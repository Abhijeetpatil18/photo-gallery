# 📷 Photo Gallery – Infinite Scroll

A modern, single-page **photo gallery** built with **React + Vite** that implements infinite scrolling using paginated JSON feeds from [picsum.photos](https://picsum.photos).

---

## ✨ Features

- **Infinite Scroll** — Automatically loads the next page of photos as you scroll to the bottom, using the `IntersectionObserver` API
- **Paginated API** — Fetches data from `https://picsum.photos/v2/list?page=N` with a Vite proxy to avoid CORS issues
- **Thumbs Up / Like** — Each photo has a Font Awesome thumbs-up icon with a click counter (starts at 0, increments on every click)
- **Author Info** — Displays photographer name with auto-generated avatar initials and colorful gradients
- **Shimmer Skeleton** — Smooth loading placeholder while images are being fetched
- **End of Feed Detection** — Stops fetching when the API returns no more data
- **Error Handling** — Graceful error state with a retry button
- **Premium Dark UI** — Glassmorphism sticky header, card hover animations, and responsive layout

---

Public URL
https://photo-gallery-rust-sigma.vercel.app/
