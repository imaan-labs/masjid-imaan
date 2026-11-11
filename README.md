# Imaan Masjid (`imaanmasjid.org`)

Official website and content management system for **Imaan Masjid** in Melissa, Texas ([imaanmasjid.org](https://imaanmasjid.org)).

This project provides prayer times, astronomical lunar hilal visibility calculations, community announcements/flyers, a photo gallery, excuse letters for students/employees, campaign progress tracking, and an integrated Sanity Studio CMS.

---

## Features

- **Prayer Times & Iqamah Calculation:** Dynamic prayer schedule using [`adhan`](https://github.com/batoulapps/adhan-js) with automated Iqamah rules and Sanity CMS overrides (`/prayer-times`).
- **Hilal Lunar Sighting & Calendar:** Astronomical moon visibility predictions and sighting tracking powered by [`astronomy-engine`](https://github.com/cosinekitty/astronomy) (`/calendar`).
- **Digital Flyer & Bulletin Board:** Community announcements, active flyers with countdowns, and printable/downloadable views (`/flyers`, `/bulletin`).
- **Photo & Event Gallery:** Curated community gallery powered by Sanity CDN with modal lightbox viewing (`/gallery`).
- **School & Work Excuse Letters:** Interactive excuse letter generator with printable templates for Friday Jumu'ah, Ramadan, and Eid prayers (`/excuse-letters`).
- **Campaign & Giving Integration:** Embedded campaign progress tracking and donation channel modals linked with the parent organization.
- **Embedded Sanity Studio:** Embedded CMS located directly at `/admin` for real-time editorial management.

---

## Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) (App Router)
- **CMS:** [Sanity v3 / Studio](https://www.sanity.io/) (embedded at `/admin`)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Calculations:**
  - [`adhan`](https://github.com/batoulapps/adhan-js) for prayer calculation
  - [`astronomy-engine`](https://github.com/cosinekitty/astronomy) for lunar visibility calculations
- **Language:** TypeScript
- **Runtime:** Node.js `>=24.0.0`

---

## Project Structure

```text
masjid-imaan/
├── app/
│   ├── (default)/        # Main landing page (hero, quick prayer times, featured flyers, programs)
│   ├── admin/            # Embedded Sanity Studio CMS route
│   ├── bulletin/         # Printable community bulletin view
│   ├── calendar/         # Lunar hilal calculations & calendar
│   ├── excuse-letters/   # School and work excuse letter generator
│   ├── flyers/           # Digital flyer board & announcements
│   ├── gallery/          # Community photo gallery & archive
│   ├── prayer-times/     # Monthly & daily prayer times schedule
│   ├── privacy/          # Privacy policy
│   └── terms/            # Terms of service
├── components/           # UI layout components (header, footer, mobile-menu, site-frame)
├── schemas/              # Sanity content schemas (boardMember, campaign, flyer, galleryImage, prayerSettings)
├── scripts/              # Migration & upload scripts (seed-sanity.mjs, upload-gallery.mjs)
└── src/
    ├── components/       # Core app components (PrayerTimes, HilalCalendar, FlyerBoard, DonationModal, etc.)
    └── lib/              # Prayer calculation logic, Sanity client, and lunar engine utilities
```

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) `>= 24.0.0`
- [npm](https://www.npmjs.com/) (or pnpm / yarn)

### Environment Setup

Create a `.env` file in the root directory (or use `.env.local`):

```bash
PUBLIC_SANITY_PROJECT_ID=zy8zabah
PUBLIC_SANITY_DATASET=production
```

> **Note:** Public read queries fetch via the Sanity CDN. For administrative editing in `/admin` or running upload scripts, appropriate Sanity credentials or tokens are needed.

### Installation

```bash
npm install
```

### Running the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Sanity Studio CMS

The studio can be accessed inside the running Next.js app at:

- [http://localhost:3000/admin](http://localhost:3000/admin)

Or launched standalone via:

```bash
npm run studio
```

### Available Scripts

| Script                   | Command                           | Purpose                                   |
| ------------------------ | --------------------------------- | ----------------------------------------- |
| `npm run dev`            | `next dev`                        | Start Next.js development server          |
| `npm run build`          | `next build`                      | Build the Next.js production bundle       |
| `npm run start`          | `next start`                      | Run production Next.js server             |
| `npm run studio`         | `sanity dev --port 3333`          | Run standalone Sanity Studio on port 3333 |
| `npm run seed`           | `node scripts/seed-sanity.mjs`    | Seed Sanity dataset with default data     |
| `npm run upload:gallery` | `node scripts/upload-gallery.mjs` | Upload local gallery images to Sanity     |
| `npm run lint`           | `next lint`                       | Run ESLint checks                         |

---

## Sister Repository

This project is the flagship local house of worship site operating under the umbrella 501(c)(3) foundation **International Mission For Aid And Assistance Network Inc (IMAAN)**:

- **Parent Organization Website:** [`react-masjid-website`](../react-masjid-website) ([al-imaan.org](https://al-imaan.org))
