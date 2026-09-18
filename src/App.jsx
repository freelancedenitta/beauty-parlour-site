import { useEffect, useState } from 'react'
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import './App.css'

const defaultData = {
  site: {
    name: 'Veloura Beauty Studio',
    tagline: 'Luxury beauty, skin, and bridal artistry',
    logoText: 'VB',
    logoUrl: '',
    bookingEmail: 'booking@velourabeauty.com',
    phone: '+1 (415) 555-0148',
    secondaryPhone: '+1 (415) 555-0199',
    address: '18 Rose Avenue, San Francisco, CA 94107',
    heroImage: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1800&q=85',
    heroTitle: 'Glow brighter with beauty rituals designed around you.',
    heroDescription:
      'From signature facials to bridal glam, we craft elevated self-care experiences that help you feel radiant, confident, and deeply cared for.',
  },
  socials: [
    { id: 1, label: 'Instagram', url: 'https://instagram.com', icon: '◎' },
    { id: 2, label: 'Facebook', url: 'https://facebook.com', icon: '◉' },
    { id: 3, label: 'Pinterest', url: 'https://pinterest.com', icon: '◌' },
  ],
  services: [
    { id: 1, name: 'Signature Facial', duration: '60 min', price: '$120', description: 'Deep cleansing, hydration therapy, and a luminous finish tailored to your skin goals.' },
    { id: 2, name: 'Bridal Glow', duration: '90 min', price: '$220', description: 'A full bridal prep ritual with skin prep, contouring, and long-wear glam finish.' },
    { id: 3, name: 'Luxury Hair Spa', duration: '75 min', price: '$160', description: 'Rejuvenating scalp care, shine treatment, and smooth styling for everyday luxury.' },
    { id: 4, name: 'Brows & Lashes', duration: '45 min', price: '$95', description: 'Precision shaping, tinting, and lash enhancement for a naturally polished look.' },
  ],
  reviews: [
    { id: 1, name: 'Sofia M.', text: 'The ambience is calming, the team is incredibly skilled, and my bridal look was absolutely stunning.', rating: 5 },
    { id: 2, name: 'Ariana T.', text: 'My facial left my skin glowing for weeks. Every service feels tailored and premium.', rating: 5 },
    { id: 3, name: 'Mila R.', text: 'Beautiful salon, warm staff, and flawless results from hair to makeup. I always leave feeling confident.', rating: 5 },
  ],
  gallery: [
    { id: 1, image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=900&q=80', alt: 'Beauty salon treatment chair' },
    { id: 2, image: 'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=900&q=80', alt: 'Bridal makeup styling' },
    { id: 3, image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80', alt: 'Beauty model portrait' },
    { id: 4, image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=900&q=80', alt: 'Hair finishing styling' },
  ],
}

const adminTabs = ['general', 'services', 'reviews', 'socials', 'gallery', 'contacts']

const readStoredData = () => {
  return defaultData
}

function PublicPage({ content, contactForm, setContactForm, handleBookingSubmit }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState('about')

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 12)
    const sections = ['about', 'services', 'gallery', 'reviews', 'contact']
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        const visibleSection = entries
          .filter((entry) => entry.isIntersecting)
          .sort((first, second) => second.intersectionRatio - first.intersectionRatio)[0]
        if (visibleSection) setActiveSection(visibleSection.target.id)
      },
      { rootMargin: '-18% 0px -62% 0px', threshold: [0.05, 0.2, 0.5] },
    )

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    sections.forEach((sectionId) => {
      const section = document.getElementById(sectionId)
      if (section) sectionObserver.observe(section)
    })

    return () => {
      window.removeEventListener('scroll', handleScroll)
      sectionObserver.disconnect()
    }
  }, [])

  useEffect(() => {
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') setIsMenuOpen(false)
    }
    document.addEventListener('keydown', closeOnEscape)
    return () => document.removeEventListener('keydown', closeOnEscape)
  }, [])

  const closeMenu = () => setIsMenuOpen(false)

  return (
    <div className="page-shell">
      <header className={`topbar${isScrolled ? ' is-scrolled' : ''}`}>
        <div className="brand" aria-label={content.site.name}>
          {content.site.logoUrl ? (
            <img src={content.site.logoUrl} alt={content.site.name} className="brand-logo" />
          ) : (
            <div className="brand-mark">{content.site.logoText}</div>
          )}
          <div className="brand-copy">
            <span className="brand-name">{content.site.name}</span>
            <small>{content.site.tagline}</small>
          </div>
        </div>

        <nav className={`main-nav${isMenuOpen ? ' is-open' : ''}`} aria-label="Main navigation">
          {[
            ['about', 'About'],
            ['services', 'Services'],
            ['gallery', 'Gallery'],
            ['reviews', 'Reviews'],
            ['contact', 'Contact'],
          ].map(([sectionId, label]) => (
            <a key={sectionId} className={activeSection === sectionId ? 'is-active' : ''} href={`#${sectionId}`} onClick={closeMenu}>{label}</a>
          ))}
        </nav>

        <div className="header-actions">
          <a className="secondary-button header-booking" href="#contact" onClick={closeMenu}>Book now</a>
          <button type="button" className="menu-toggle" aria-label={isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'} aria-expanded={isMenuOpen} onClick={() => setIsMenuOpen((open) => !open)}>
            <span />
            <span />
            <span />
          </button>
        </div>
      </header>

      <main>
        <section className="hero-section reveal" style={{ '--hero-image': `url("${content.site.heroImage || defaultData.site.heroImage}")` }}>
          <div className="hero-copy reveal">
            <span className="eyebrow">Luxury beauty studio</span>
            <h1>{content.site.heroTitle}</h1>
            <p>{content.site.heroDescription}</p>
            <div className="hero-actions">
              <a className="primary-button" href="#contact">Reserve a treatment</a>
              <a className="secondary-button" href="#services">Explore services</a>
            </div>
            <div className="stats-grid" aria-label="Business statistics">
              <div><strong>12k+</strong><span>Happy clients</span></div>
              <div><strong>8 yrs</strong><span>Beauty expertise</span></div>
              <div><strong>4.9/5</strong><span>Average rating</span></div>
            </div>
          </div>

        </section>

        <section className="feature-strip reveal" id="about">
          <div>
            <span>Skin-first</span>
            <p>Results-driven treatments that blend clinical care with calming luxury.</p>
          </div>
          <div>
            <span>Tailored experience</span>
            <p>Every ritual is customized to your skin, hair, and occasion goals.</p>
          </div>
          <div>
            <span>Bridal expertise</span>
            <p>From prep to finish, we create polished looks that last beautifully.</p>
          </div>
        </section>

        <section className="services-section reveal" id="services">
          <div className="section-heading reveal">
            <span className="eyebrow">Our services</span>
            <h2>Beauty rituals that restore and elevate.</h2>
          </div>

          <div className="services-grid">
            {content.services.map((service) => (
              <article className="service-card reveal" key={service.id}>
                <div className="service-header">
                  <h3>{service.name}</h3>
                  <span>{service.price}</span>
                </div>
                <p>{service.description}</p>
                <div className="service-meta">
                  <span>{service.duration}</span>
                  <a href="#contact">Book</a>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="gallery-section reveal" id="gallery">
          <div className="section-heading reveal">
            <span className="eyebrow">Our gallery</span>
            <h2>Radiant transformations, beautifully captured.</h2>
          </div>

          <div className="gallery-grid">
            {content.gallery.map((item) => (
              <figure className="gallery-item reveal" key={item.id}>
                <img src={item.image} alt={item.alt} />
              </figure>
            ))}
          </div>
        </section>

        <section className="reviews-section reveal" id="reviews">
          <div className="section-heading reveal">
            <span className="eyebrow">Client love</span>
            <h2>Trusted by women who want to feel their absolute best.</h2>
          </div>

          <div className="reviews-grid">
            {content.reviews.map((review) => (
              <article className="review-card reveal" key={review.id}>
                <div className="stars" aria-label={`${review.rating} star review`}>
                  {Array.from({ length: review.rating }, (_, index) => <span key={index}>★</span>)}
                </div>
                <p>“{review.text}”</p>
                <strong>{review.name}</strong>
              </article>
            ))}
          </div>
        </section>

        <section className="contact-section reveal" id="contact">
          <div className="contact-copy reveal">
            <span className="eyebrow">Schedule your visit</span>
            <h2>Let’s create your next glow moment.</h2>
            <p>Reach out for consultations, bridal packages, or any treatment tailored to your beauty goals.</p>
            <ul className="contact-list">
              <li>{content.site.address}</li>
              <li>{content.site.phone}</li>
              <li>{content.site.secondaryPhone}</li>
              <li>{content.site.bookingEmail}</li>
            </ul>
            <div className="social-links" aria-label="Social media links">
              {content.socials.map((social) => (
                <a key={social.id} href={social.url} target="_blank" rel="noreferrer">{social.icon} {social.label}</a>
              ))}
            </div>
          </div>

          <form className="booking-form reveal" onSubmit={handleBookingSubmit}>
            <label>
              Full name
              <input type="text" value={contactForm.name} onChange={(event) => setContactForm({ ...contactForm, name: event.target.value })} placeholder="Your name" required />
            </label>
            <label>
              Email
              <input type="email" value={contactForm.email} onChange={(event) => setContactForm({ ...contactForm, email: event.target.value })} placeholder="your@email.com" required />
            </label>
            <label>
              Service interest
              <input type="text" value={contactForm.service} onChange={(event) => setContactForm({ ...contactForm, service: event.target.value })} placeholder="Facial, bridal makeup, hair spa..." />
            </label>
            <label>
              Message
              <textarea value={contactForm.message} onChange={(event) => setContactForm({ ...contactForm, message: event.target.value })} placeholder="Tell us what you are looking for..." rows="5" />
            </label>
            <button type="submit" className="primary-button full-width">Send enquiry</button>
          </form>
        </section>
      </main>

      <footer className="site-footer reveal">
        <div className="brand-footer">
          <div className="brand-mark small">{content.site.logoText}</div>
          <div>
            <strong>{content.site.name}</strong>
            <span>{content.site.tagline}</span>
          </div>
        </div>
        <p>© {new Date().getFullYear()} {content.site.name}. All rights reserved.</p>
      </footer>
    </div>
  )
}

function AdminLogin({ onLogin }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setIsSubmitting(true)
    setError('')

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ username, password }),
      })

      const data = await response.json()
      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Login failed')
      }

      onLogin()
    } catch (loginError) {
      setError(loginError.message || 'Login failed. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="admin-access-shell">
      <div className="admin-login-card">
        <span className="eyebrow">Private Access</span>
        <h1>Admin Login</h1>
        <p>Manage your salon website, services, reviews, gallery, and contact details.</p>

        <form className="login-form" onSubmit={handleSubmit}>
          <label>
            Username
            <input type="text" value={username} onChange={(event) => setUsername(event.target.value)} placeholder="Enter username" autoComplete="username" required />
          </label>

          <label>
            Password
            <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Enter password" autoComplete="current-password" required />
          </label>

          {error ? <div className="login-error">{error}</div> : null}

          <button type="submit" className="primary-button full-width" disabled={isSubmitting}>
            {isSubmitting ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  )
}

function AdminDashboard({ content, setContent, onLogout }) {
  const [activeTab, setActiveTab] = useState('general')
  const [uploadingImage, setUploadingImage] = useState(false)

  const updateSiteField = (field, value) => {
    setContent((prev) => ({ ...prev, site: { ...prev.site, [field]: value } }))
  }

  const updateSocial = (id, field, value) => {
    setContent((prev) => ({ ...prev, socials: prev.socials.map((item) => (item.id === id ? { ...item, [field]: value } : item)) }))
  }

  const updateService = (id, field, value) => {
    setContent((prev) => ({ ...prev, services: prev.services.map((item) => (item.id === id ? { ...item, [field]: value } : item)) }))
  }

  const updateReview = (id, field, value) => {
    setContent((prev) => ({ ...prev, reviews: prev.reviews.map((item) => (item.id === id ? { ...item, [field]: value } : item)) }))
  }

  const updateGallery = (id, field, value) => {
    setContent((prev) => ({ ...prev, gallery: prev.gallery.map((item) => (item.id === id ? { ...item, [field]: value } : item)) }))
  }

  const uploadImage = async (file) => {
    if (!file) return null

    setUploadingImage(true)
    try {
      const formData = new FormData()
      formData.append('image', file)
      const response = await fetch('/api/upload', { method: 'POST', body: formData, credentials: 'include' })
      const data = await response.json()
      if (!response.ok || !data.success) throw new Error(data.message || 'Image upload failed.')
      return data.url
    } catch (uploadError) {
      window.alert(uploadError.message || 'Image upload failed.')
      return null
    } finally {
      setUploadingImage(false)
    }
  }

  const handleLogoUpload = async (event) => {
    const url = await uploadImage(event.target.files?.[0])
    if (url) updateSiteField('logoUrl', url)
    event.target.value = ''
  }

  const handleGalleryUpload = async (id, event) => {
    const url = await uploadImage(event.target.files?.[0])
    if (url) updateGallery(id, 'image', url)
    event.target.value = ''
  }

  const handleHeroUpload = async (event) => {
    const url = await uploadImage(event.target.files?.[0])
    if (url) updateSiteField('heroImage', url)
    event.target.value = ''
  }

  const addItem = (section) => {
    if (section === 'services') {
      setContent((prev) => ({
        ...prev,
        services: [
          ...prev.services,
          { id: Date.now(), name: 'New Service', duration: '45 min', price: '$99', description: 'Describe your new service here.' },
        ],
      }))
    }

    if (section === 'reviews') {
      setContent((prev) => ({
        ...prev,
        reviews: [...prev.reviews, { id: Date.now(), name: 'Client Name', text: 'Amazing service and beautiful results.', rating: 5 }],
      }))
    }

    if (section === 'socials') {
      setContent((prev) => ({ ...prev, socials: [...prev.socials, { id: Date.now(), label: 'New Network', url: 'https://example.com', icon: '✦' }] }))
    }

    if (section === 'gallery') {
      setContent((prev) => ({
        ...prev,
        gallery: [...prev.gallery, { id: Date.now(), image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80', alt: 'New gallery image' }],
      }))
    }
  }

  const removeItem = (section, id) => {
    setContent((prev) => ({ ...prev, [section]: prev[section].filter((item) => item.id !== id) }))
  }

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-header">
          <span className="eyebrow">Dashboard</span>
          <h2>{content.site.name}</h2>
        </div>

        <nav className="admin-sidebar-nav" aria-label="Admin sections">
          {adminTabs.map((tab) => (
            <button type="button" key={tab} className={activeTab === tab ? 'active' : ''} onClick={() => setActiveTab(tab)}>
              {tab}
            </button>
          ))}
        </nav>

        <button type="button" className="secondary-button admin-logout" onClick={onLogout}>Log out</button>
      </aside>

      <main className="admin-content">
        <div className="admin-panel-header">
          <div>
            <span className="eyebrow">Manage</span>
            <h2>{activeTab}</h2>
          </div>
        </div>

        {activeTab === 'general' && (
          <div className="admin-form">
            <label>Site name<input value={content.site.name} onChange={(event) => updateSiteField('name', event.target.value)} /></label>
            <label>Tagline<input value={content.site.tagline} onChange={(event) => updateSiteField('tagline', event.target.value)} /></label>
            <label>Logo text<input value={content.site.logoText} onChange={(event) => updateSiteField('logoText', event.target.value)} /></label>
            <div className="image-upload-field">
              <span>Logo image</span>
              <label className="upload-button">
                {uploadingImage ? 'Uploading...' : 'Browse'}
                <input type="file" accept="image/*" onChange={handleLogoUpload} disabled={uploadingImage} />
              </label>
              {content.site.logoUrl ? <img className="upload-preview logo-preview" src={content.site.logoUrl} alt="Current logo preview" /> : <span className="upload-empty">No logo selected</span>}
              {content.site.logoUrl ? <button type="button" className="remove-button" onClick={() => updateSiteField('logoUrl', '')}>Remove logo</button> : null}
            </div>
            <div className="image-upload-field">
              <span>Hero background image</span>
              <label className="upload-button">
                {uploadingImage ? 'Uploading...' : 'Browse'}
                <input type="file" accept="image/*" onChange={handleHeroUpload} disabled={uploadingImage} />
              </label>
              {content.site.heroImage ? <img className="upload-preview hero-preview" src={content.site.heroImage} alt="Current hero background preview" /> : <span className="upload-empty">Using default hero image</span>}
            </div>
            <label>Hero title<input value={content.site.heroTitle} onChange={(event) => updateSiteField('heroTitle', event.target.value)} /></label>
            <label>Hero description<textarea rows="4" value={content.site.heroDescription} onChange={(event) => updateSiteField('heroDescription', event.target.value)} /></label>
          </div>
        )}

        {activeTab === 'services' && (
          <div className="admin-form stacked">
            {content.services.map((service) => (
              <div className="admin-card" key={service.id}>
                <label>Service name<input value={service.name} onChange={(event) => updateService(service.id, 'name', event.target.value)} /></label>
                <label>Price<input value={service.price} onChange={(event) => updateService(service.id, 'price', event.target.value)} /></label>
                <label>Duration<input value={service.duration} onChange={(event) => updateService(service.id, 'duration', event.target.value)} /></label>
                <label>Description<textarea rows="3" value={service.description} onChange={(event) => updateService(service.id, 'description', event.target.value)} /></label>
                <button type="button" className="remove-button" onClick={() => removeItem('services', service.id)}>Remove service</button>
              </div>
            ))}
            <button type="button" className="primary-button" onClick={() => addItem('services')}>Add service</button>
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="admin-form stacked">
            {content.reviews.map((review) => (
              <div className="admin-card" key={review.id}>
                <label>Client name<input value={review.name} onChange={(event) => updateReview(review.id, 'name', event.target.value)} /></label>
                <label>Rating<input type="number" min="1" max="5" value={review.rating} onChange={(event) => updateReview(review.id, 'rating', Number(event.target.value))} /></label>
                <label>Review text<textarea rows="4" value={review.text} onChange={(event) => updateReview(review.id, 'text', event.target.value)} /></label>
                <button type="button" className="remove-button" onClick={() => removeItem('reviews', review.id)}>Remove review</button>
              </div>
            ))}
            <button type="button" className="primary-button" onClick={() => addItem('reviews')}>Add review</button>
          </div>
        )}

        {activeTab === 'socials' && (
          <div className="admin-form stacked">
            {content.socials.map((social) => (
              <div className="admin-card" key={social.id}>
                <label>Label<input value={social.label} onChange={(event) => updateSocial(social.id, 'label', event.target.value)} /></label>
                <label>URL<input value={social.url} onChange={(event) => updateSocial(social.id, 'url', event.target.value)} /></label>
                <label>Icon<input value={social.icon} onChange={(event) => updateSocial(social.id, 'icon', event.target.value)} /></label>
                <button type="button" className="remove-button" onClick={() => removeItem('socials', social.id)}>Remove social link</button>
              </div>
            ))}
            <button type="button" className="primary-button" onClick={() => addItem('socials')}>Add social link</button>
          </div>
        )}

        {activeTab === 'gallery' && (
          <div className="admin-form stacked">
            {content.gallery.map((item) => (
              <div className="admin-card" key={item.id}>
                <div className="image-upload-field">
                  <span>Gallery image</span>
                  <label className="upload-button">
                    {uploadingImage ? 'Uploading...' : 'Browse'}
                    <input type="file" accept="image/*" onChange={(event) => handleGalleryUpload(item.id, event)} disabled={uploadingImage} />
                  </label>
                  {item.image ? <img className="upload-preview" src={item.image} alt={`${item.alt} preview`} /> : <span className="upload-empty">No image selected</span>}
                </div>
                <label>Alt text<input value={item.alt} onChange={(event) => updateGallery(item.id, 'alt', event.target.value)} /></label>
                <button type="button" className="remove-button" onClick={() => removeItem('gallery', item.id)}>Remove image</button>
              </div>
            ))}
            <button type="button" className="primary-button" onClick={() => addItem('gallery')}>Add gallery image</button>
          </div>
        )}

        {activeTab === 'contacts' && (
          <div className="admin-form">
            <label>Booking email<input value={content.site.bookingEmail} onChange={(event) => updateSiteField('bookingEmail', event.target.value)} /></label>
            <label>Main phone<input value={content.site.phone} onChange={(event) => updateSiteField('phone', event.target.value)} /></label>
            <label>Secondary phone<input value={content.site.secondaryPhone} onChange={(event) => updateSiteField('secondaryPhone', event.target.value)} /></label>
            <label>Address<textarea rows="3" value={content.site.address} onChange={(event) => updateSiteField('address', event.target.value)} /></label>
          </div>
        )}
      </main>
    </div>
  )
}

function App() {
  const [content, setContent] = useState(() => readStoredData())
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false)
  const [isCheckingSession, setIsCheckingSession] = useState(true)
  const [isContentLoaded, setIsContentLoaded] = useState(false)
  const [contactForm, setContactForm] = useState({ name: '', email: '', service: '', message: '' })
  const location = useLocation()
  const navigate = useNavigate()
  const isAdminRoute = location.pathname === '/admin'

  useEffect(() => {
    const loadContent = async () => {
      try {
        const response = await fetch('/api/content')
        const data = await response.json()
        if (response.ok && data.content) setContent(data.content)
      } catch {
        // The bundled defaults remain available if the content API is unavailable.
      } finally {
        setIsContentLoaded(true)
      }
    }

    loadContent()
  }, [])

  useEffect(() => {
    if (!isContentLoaded || !isAdminAuthenticated) return undefined

    const saveTimer = window.setTimeout(async () => {
      try {
        await fetch('/api/content', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ content }),
        })
      } catch {
        // The dashboard keeps the current state while the API is unavailable.
      }
    }, 400)

    return () => window.clearTimeout(saveTimer)
  }, [content, isAdminAuthenticated, isContentLoaded])

  useEffect(() => {
    if (!isAdminRoute) {
      setIsCheckingSession(false)
      return undefined
    }

    setIsCheckingSession(true)
    const checkSession = async () => {
      try {
        const response = await fetch('/api/session', { credentials: 'include' })
        const data = await response.json()
        setIsAdminAuthenticated(Boolean(data.authenticated))
      } catch {
        setIsAdminAuthenticated(false)
      } finally {
        setIsCheckingSession(false)
      }
    }

    checkSession()
    return undefined
  }, [isAdminRoute])

  useEffect(() => {
    const revealItems = document.querySelectorAll('.reveal')
    if (!revealItems.length) return undefined

    const showInitialItems = () => {
      revealItems.forEach((element) => {
        const { top, bottom } = element.getBoundingClientRect()
        if (top < window.innerHeight && bottom > 0) element.classList.add('is-visible')
      })
    }

    showInitialItems()

    if (typeof IntersectionObserver === 'undefined') return undefined

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('is-visible')
        })
      },
      { threshold: 0.12 },
    )

    revealItems.forEach((element) => observer.observe(element))
    const visibilityFallback = window.setTimeout(() => {
      revealItems.forEach((element) => element.classList.add('is-visible'))
    }, 1200)

    return () => {
      observer.disconnect()
      window.clearTimeout(visibilityFallback)
    }
  }, [content])

  const handleBookingSubmit = (event) => {
    event.preventDefault()
    const subject = encodeURIComponent(`${contactForm.service || 'Beauty consultation'} enquiry`)
    const body = encodeURIComponent(`Name: ${contactForm.name}\nEmail: ${contactForm.email}\nService: ${contactForm.service}\n\nMessage:\n${contactForm.message}`)
    window.location.href = `mailto:${content.site.bookingEmail}?subject=${subject}&body=${body}`
  }

  const handleAdminLogin = () => {
    setIsAdminAuthenticated(true)
    navigate('/admin')
  }

  const handleAdminLogout = async () => {
    try {
      await fetch('/api/logout', { method: 'POST', credentials: 'include' })
    } catch {
      // no-op
    }

    setIsAdminAuthenticated(false)
    navigate('/admin')
  }

  return (
    <Routes>
      <Route path="/" element={<PublicPage content={content} contactForm={contactForm} setContactForm={setContactForm} handleBookingSubmit={handleBookingSubmit} />} />
      <Route path="/admin" element={isCheckingSession ? <div className="loading-screen">Checking access...</div> : isAdminAuthenticated ? <AdminDashboard content={content} setContent={setContent} onLogout={handleAdminLogout} /> : <AdminLogin onLogin={handleAdminLogin} />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
