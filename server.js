import express from 'express'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'
import fs from 'fs'
import multer from 'multer'
import os from 'os'
import path from 'path'
import { fileURLToPath } from 'url'

dotenv.config()

const app = express()
const PORT = 3001
const SESSION_NAME = 'veloura_session'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const assetsDirectory = process.env.VERCEL ? path.join(os.tmpdir(), 'bparlour-assets') : path.join(__dirname, 'public', 'assets')
const localContentFile = path.join(__dirname, 'content-store.json')
const supabaseUrl = process.env.SUPABASE_URL?.replace(/\/$/, '')
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const supabaseBucket = process.env.SUPABASE_STORAGE_BUCKET || 'site-images'
const hasSupabase = Boolean(supabaseUrl && supabaseServiceKey)

fs.mkdirSync(assetsDirectory, { recursive: true })

const upload = multer({
  storage: multer.diskStorage({
    destination: assetsDirectory,
    filename: (_req, file, callback) => {
      const extension = path.extname(file.originalname).toLowerCase()
      const baseName = path.basename(file.originalname, extension).replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '').toLowerCase() || 'image'
      callback(null, `${baseName}-${Date.now()}${extension}`)
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, callback) => {
    callback(null, file.mimetype.startsWith('image/'))
  },
})

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'velouraadmin'
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Veloura@2026!'

app.use(express.json())
app.use(cookieParser())

app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-store')
  next()
})

app.post('/api/login', (req, res) => {
  const { username, password } = req.body || {}

  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    res.cookie(SESSION_NAME, 'authenticated', {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 8,
      path: '/',
    })

    return res.json({ success: true })
  }

  return res.status(401).json({ success: false, message: 'Invalid username or password.' })
})

app.get('/api/session', (req, res) => {
  const authenticated = Boolean(req.cookies?.[SESSION_NAME])
  res.json({ authenticated })
})

app.post('/api/logout', (req, res) => {
  res.clearCookie(SESSION_NAME, { path: '/' })
  res.json({ success: true })
})

const readLocalContent = () => {
  try {
    return JSON.parse(fs.readFileSync(localContentFile, 'utf8'))
  } catch {
    return null
  }
}

const writeLocalContent = (content) => {
  fs.writeFileSync(localContentFile, JSON.stringify(content, null, 2), 'utf8')
}

const supabaseRequest = async (endpoint, options = {}) => {
  const response = await fetch(`${supabaseUrl}${endpoint}`, {
    ...options,
    headers: {
      apikey: supabaseServiceKey,
      Authorization: `Bearer ${supabaseServiceKey}`,
      ...(options.headers || {}),
    },
  })

  if (!response.ok) throw new Error(`Supabase request failed with ${response.status}`)
  return response
}

app.get('/api/content', async (_req, res) => {
  try {
    if (!hasSupabase) return res.json({ success: true, content: readLocalContent(), persistent: false })

    const response = await supabaseRequest('/rest/v1/site_content?select=data&id=eq.default')
    const rows = await response.json()
    return res.json({ success: true, content: rows[0]?.data || null, persistent: true })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ success: false, message: 'Unable to load site content.' })
  }
})

app.put('/api/content', async (req, res) => {
  if (!req.cookies?.[SESSION_NAME]) return res.status(401).json({ success: false, message: 'Admin authentication required.' })

  const { content } = req.body || {}
  if (!content || typeof content !== 'object') return res.status(400).json({ success: false, message: 'Valid site content is required.' })

  try {
    if (!hasSupabase) {
      writeLocalContent(content)
      return res.json({ success: true, persistent: false })
    }

    await supabaseRequest('/rest/v1/site_content', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Prefer: 'resolution=merge-duplicates' },
      body: JSON.stringify({ id: 'default', data: content, updated_at: new Date().toISOString() }),
    })
    return res.json({ success: true, persistent: true })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ success: false, message: 'Unable to save site content.' })
  }
})

app.post('/api/upload', upload.single('image'), (req, res) => {
  if (!req.cookies?.[SESSION_NAME]) {
    if (req.file) fs.unlinkSync(req.file.path)
    return res.status(401).json({ success: false, message: 'Admin authentication required.' })
  }

  if (!req.file) {
    return res.status(400).json({ success: false, message: 'Please select an image file.' })
  }

  if (!hasSupabase) return res.json({ success: true, url: `/assets/${req.file.filename}`, persistent: false })

  const uploadToStorage = async () => {
    const imageBuffer = fs.readFileSync(req.file.path)
    await supabaseRequest(`/storage/v1/object/${supabaseBucket}/${req.file.filename}`, {
      method: 'POST',
      headers: { 'Content-Type': req.file.mimetype, 'x-upsert': 'true' },
      body: imageBuffer,
    })
    fs.unlinkSync(req.file.path)
    return `${supabaseUrl}/storage/v1/object/public/${supabaseBucket}/${req.file.filename}`
  }

  return uploadToStorage()
    .then((url) => res.json({ success: true, url, persistent: true }))
    .catch((error) => {
      console.error(error)
      if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path)
      return res.status(500).json({ success: false, message: 'Unable to store image.' })
    })
})

app.use('/assets', express.static(assetsDirectory))
app.use(express.static(path.join(__dirname, 'dist')))

app.get(/^(?!\/api).*/, (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'))
})

if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Admin backend running on http://localhost:${PORT}`)
  })
}

export default app
