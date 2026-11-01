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

## 🚀 Getting Started

### Prerequisites
- Node.js >= 18
- npm

### Install & Run

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🛠 Tech Stack

| Tool | Purpose |
|------|---------|
| React 19 | UI Framework |
| Vite 8 | Build tool & dev server |
| Font Awesome 6 | Thumbs-up icon |
| Google Fonts (Inter) | Typography |
| Picsum Photos API | Photo data source |

---

## 📁 Project Structure

```
src/
├── App.jsx        # Main app component (infinite scroll + PhotoCard)
├── index.css      # All styles (dark theme, animations, responsive)
└── main.jsx       # React entry point
index.html         # HTML shell with CDN links
vite.config.js     # Vite config with picsum proxy
```

---

## 🔗 API

Photos are sourced from the public [Lorem Picsum](https://picsum.photos) API:

```
GET https://picsum.photos/v2/list?page=1&limit=30
```

Each item includes `id`, `author`, `width`, `height`, and `download_url`.
