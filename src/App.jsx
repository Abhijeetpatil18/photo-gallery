import { useState, useEffect, useRef, useCallback } from 'react'

// Helper: generate avatar initials from author name
function getInitials(name) {
  return name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('')
}

// Helper: pick a gradient based on author name hash
function getAvatarGradient(name) {
  const gradients = [
    'linear-gradient(135deg, #5b8dee, #9b5de5)',
    'linear-gradient(135deg, #f72585, #7209b7)',
    'linear-gradient(135deg, #4cc9f0, #4361ee)',
    'linear-gradient(135deg, #06d6a0, #118ab2)',
    'linear-gradient(135deg, #fb8500, #e63946)',
    'linear-gradient(135deg, #9b5de5, #f15bb5)',
    'linear-gradient(135deg, #00bbf9, #00f5d4)',
    'linear-gradient(135deg, #fee440, #f15bb5)',
  ]
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = (hash * 31 + name.charCodeAt(i)) & 0xffffffff
  }
  return gradients[Math.abs(hash) % gradients.length]
}

// ─── PhotoCard Component ─────────────────────────────────────────────────────
function PhotoCard({ photo, likeCount, onLike }) {
  const [loaded, setLoaded] = useState(false)
  const [popping, setPopping] = useState(false)
  const liked = likeCount > 0

  const handleLike = () => {
    onLike(photo.id)
    setPopping(true)
  }

  const handleAnimEnd = () => setPopping(false)

  const initials = getInitials(photo.author)
  const gradient = getAvatarGradient(photo.author)

  return (
    <article className="photo-card" id={`photo-${photo.id}`}>
      {/* Image */}
      <div className="card-image-wrapper">
        {!loaded && <div className="image-skeleton" />}
        <img
          className="card-image"
          src={photo.download_url}
          alt={`Photo by ${photo.author}`}
          loading="lazy"
          onLoad={() => setLoaded(true)}
          style={{ opacity: loaded ? 1 : 0, transition: 'opacity 0.4s ease' }}
        />
        <div className="image-overlay" />
        <div className="photo-id-badge">#{photo.id}</div>
      </div>

      {/* Divider */}
      <div className="card-footer-divider" />

      {/* Meta */}
      <div className="card-meta">
        <div className="author-info">
          <div
            className="author-avatar"
            style={{ background: gradient }}
            aria-hidden="true"
          >
            {initials}
          </div>
          <div className="author-text">
            <div className="author-label">Photographer</div>
            <div className="author-name" title={photo.author}>{photo.author}</div>
          </div>
        </div>

        <div className="photo-dimensions">
          {photo.width} × {photo.height}
        </div>

        {/* Like Button */}
        <div className="like-section">
          <button
            id={`like-btn-${photo.id}`}
            className={`like-btn${liked ? ' liked' : ''}${popping ? ' pop' : ''}`}
            onClick={handleLike}
            onAnimationEnd={handleAnimEnd}
            aria-label={`Like photo by ${photo.author}. ${likeCount} likes`}
            title="Like this photo"
          >
            <i className={`fa-thumbs-up like-icon${liked ? ' fa-solid' : ' fa-regular'}`} aria-hidden="true" />
            <span className="like-count">{likeCount}</span>
          </button>
        </div>
      </div>
    </article>
  )
}

// ─── App Component ───────────────────────────────────────────────────────────
const PAGE_LIMIT = 30 // picsum default items per page

export default function App() {
  const [photos, setPhotos] = useState([])
  const [likes, setLikes] = useState({}) // { [photoId]: count }
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [error, setError] = useState(null)
  const [totalLoaded, setTotalLoaded] = useState(0)

  const sentinelRef = useRef(null)
  const observerRef = useRef(null)

  // Fetch a page of photos
  const fetchPage = useCallback(async (pageNum) => {
    if (loading) return
    setLoading(true)
    setError(null)

    try {
      const res = await fetch(`/api/picsum/v2/list?page=${pageNum}&limit=${PAGE_LIMIT}`)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()

      if (!Array.isArray(data) || data.length === 0) {
        setHasMore(false)
      } else {
        setPhotos((prev) => {
          const existingIds = new Set(prev.map((p) => p.id))
          const newPhotos = data.filter((p) => !existingIds.has(p.id))
          return [...prev, ...newPhotos]
        })
        setTotalLoaded((prev) => prev + data.length)

        // If we got fewer items than the limit, we've reached the end
        if (data.length < PAGE_LIMIT) {
          setHasMore(false)
        } else {
          setPage(pageNum + 1)
        }
      }
    } catch (err) {
      console.error('Fetch error:', err)
      setError('Failed to load photos. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [loading])

  // Initial load
  useEffect(() => {
    fetchPage(1)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // IntersectionObserver for infinite scroll
  useEffect(() => {
    if (observerRef.current) observerRef.current.disconnect()

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const [entry] = entries
        if (entry.isIntersecting && hasMore && !loading && !error) {
          fetchPage(page)
        }
      },
      { rootMargin: '300px' }
    )

    if (sentinelRef.current) {
      observerRef.current.observe(sentinelRef.current)
    }

    return () => observerRef.current?.disconnect()
  }, [page, hasMore, loading, error, fetchPage])

  // Handle likes
  const handleLike = useCallback((photoId) => {
    setLikes((prev) => ({
      ...prev,
      [photoId]: (prev[photoId] ?? 0) + 1,
    }))
  }, [])

  const totalLikes = Object.values(likes).reduce((a, b) => a + b, 0)

  return (
    <>
      {/* ── Header ── */}
      <header className="gallery-header" role="banner">
        <div className="header-logo">
          <div className="header-logo-icon" aria-hidden="true">
            <i className="fa-solid fa-images" />
          </div>
          <h1>Photo Gallery</h1>
        </div>
        <div className="header-stats" aria-live="polite" aria-atomic="true">
          <i className="fa-solid fa-image" aria-hidden="true" />
          <span>{totalLoaded}</span> photos &nbsp;·&nbsp;
          <i className="fa-solid fa-thumbs-up" aria-hidden="true" />
          <span>{totalLikes}</span> likes
        </div>
      </header>

      {/* ── Main Feed ── */}
      <main className="gallery-container" role="main">
        {/* Photo List */}
        {photos.map((photo) => (
          <PhotoCard
            key={photo.id}
            photo={photo}
            likeCount={likes[photo.id] ?? 0}
            onLike={handleLike}
          />
        ))}

        {/* Loading State */}
        {loading && (
          <div className="loading-container" aria-live="polite" aria-label="Loading more photos">
            <div className="loading-dots" aria-hidden="true">
              <div className="loading-dot" />
              <div className="loading-dot" />
              <div className="loading-dot" />
            </div>
            <p className="loading-text">Loading more photos…</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="error-container" role="alert">
            <i className="fa-solid fa-triangle-exclamation error-icon" aria-hidden="true" />
            <p className="error-text">{error}</p>
            <button className="retry-btn" onClick={() => fetchPage(page)}>
              <i className="fa-solid fa-rotate-right" aria-hidden="true" /> Retry
            </button>
          </div>
        )}

        {/* End of Feed */}
        {!hasMore && !loading && (
          <div className="end-of-feed" role="status" aria-live="polite">
            <div className="end-of-feed-line" aria-hidden="true" />
            <i className="fa-solid fa-check-circle end-of-feed-icon" aria-hidden="true" />
            <p>You&apos;ve seen all <strong>{totalLoaded}</strong> photos</p>
            <div className="end-of-feed-line" aria-hidden="true" />
          </div>
        )}

        {/* Intersection Observer Sentinel */}
        <div ref={sentinelRef} className="scroll-sentinel" aria-hidden="true" />
      </main>
    </>
  )
}
