# Iron Pulse Gym Website 💪

A fully animated, interactive gym website built with HTML, CSS, and vanilla JavaScript. All pages share a cohesive dark, high-energy design with an orange flame gradient theme.

## 🏋️ Pages

| Page | File | Description |
|------|------|-------------|
| Home | `Index.html` | Hero, features, animated stat counters, gallery showcase, contact |
| About | `about.html` | Story, experience stats, facility list, coach gallery, CTA |
| Gallery | `Gallary.html` | Filterable gallery grid with lightbox (Strength / Cardio / Classes / Recovery) |
| Login | `Login.html` | Member sign-in with demo & guest login |
| Signup | `Signup.html` | 3-step membership enrollment wizard with password strength meter |
| Dashboard | `Member.html` | Member dashboard with stats, quick actions, training progress, class schedule |
| Logout | `Logout.html` | Signed-out confirmation page |

## 🔐 Demo Login

On `Login.html`, click **Demo Login** (or fill the form / use Google / Apple) to be redirected to the **Member Dashboard** (`Member.html`) with a personalized welcome message. The dashboard is fully interactive — animated stat counters, progress bars, class schedule, and a **Logout** button that returns to the signed-out page.

## 🎨 Features

- **Animations** — scroll-reveal (IntersectionObserver), floating hero shapes, hover-lift cards, animated counters, pulsing glows, staggered gallery filters, animated progress bars
- **Interactivity** — mobile slide-in menu, sticky glass header, gallery filter + lightbox, password toggle, multi-step signup, demo/guest login, toast notifications, member dashboard
- **Responsive** — fully responsive grid layouts down to mobile
- **Local storage** — remembers the logged-in member session

## 🚀 Run

Just open `Index.html` in any modern browser. No build step or server required.

## 📁 Structure

```
├── Index.html
├── about.html
├── Gallary.html
├── Login.html
├── Signup.html
├── Member.html
├── Logout.html
├── css/
│   ├── main.css
│   ├── about.css
│   ├── gallery.css
│   ├── auth.css
│   └── member.css
├── js/
│   └── main.js
└── images/
    ├── gallery-*.svg
    ├── about-gym.svg
    ├── gym-equipment.svg
    └── trainer-*.svg
```

> **Note:** The folder is a flat structure, so all CSS/JS/image paths use root-relative links (e.g. `css/main.css`, `images/gallery-workout-zone.svg`).

