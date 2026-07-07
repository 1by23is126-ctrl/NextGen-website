# NextGen Interiors — PRD

## Original Problem Statement (verbatim)
Premium interior design + turnkey execution company website. Must feel like a luxury digital experience — quiet, editorial, materially literate. Communicate premium quality, trust, luxury, craftsmanship, design excellence. Avoid AI-template look. Include: Home, About, Services (10 services), Portfolio with case studies, Process, Testimonials, Blog (CMS-driven), FAQ, Contact, Book Consultation (multi-step), Privacy, 404, plus an admin panel for leads + blog. Wow moments: cinematic scroll-hero, immersive portfolio storytelling, animated consultation journey. Before/After slider, count-up stats, smooth scrolling, page transitions, premium loader.

## User Choices (literal)
- Backend functionality: Save to DB + simple admin panel to view leads
- Business details: Elegant Indian placeholders
- Blog content: Backend-driven (CMS-like) with seed articles
- Integrations: WhatsApp link + Google Maps embed only
- Imagery: Curated Unsplash/Pexels luxury interior photos

## Architecture
- **Backend**: FastAPI + MongoDB (motor). JWT bcrypt auth. Endpoints under /api: auth/login, auth/logout, auth/me, leads (public POST, admin GET/PATCH/DELETE), blog (public GET, admin POST/PUT/DELETE), projects (GET), stats (GET). Idempotent seed on startup of 1 admin user, 6 projects, 5 blog posts.
- **Frontend**: React + react-router, Lenis smooth-scroll, framer-motion, Tailwind, shadcn components, sonner toasts. Playfair Display (serif headings) + Manrope (sans body). Custom design tokens (Obsidian, Graphite, Ivory, Stone, Champagne Gold, Walnut, Sage).

## Implemented (Dec 2025)
- Cinematic scroll-responsive hero with text-reveal animation
- Home: hero, featured projects (asymmetric grid), about preview, 10-services list, why-us, before/after slider, 6-step process timeline, testimonials, count-up statistics, instagram grid, FAQ accordion, consultation CTA
- About: studio narrative, four principles, team grid, stats
- 10 service detail pages with overview, benefits, process, FAQ accordion, related projects
- Portfolio: filterable (8 categories) with asymmetric magazine grid
- Project case study: parallax hero, overview, challenge, concept, materials palette, timeline phases, testimonial, next-project navigation
- Process page: 6 alternating phase blocks
- Testimonials page
- Blog: backend-driven list + category filter + detail page with formatted content
- FAQ: categorised accordion
- Contact: luxury form (saves to backend) + studio details + WhatsApp + Google Maps embed
- Book Consultation: 4-step animated multi-step form + final form + success state
- Privacy Policy
- Custom 404 ("Off the floor plan")
- Floating WhatsApp button (appears after scroll)
- Premium page loader
- Smooth scroll (Lenis), page transitions, hover image zoom
- Admin: login → leads dashboard (filter/status/delete) → blog CRUD

## Test Credentials
- Admin: `admin@nextgeninteriors.in` / `NextGen@2025`

## Backlog (P1)
- Replace placeholder images with client's actual project photography
- Add real Instagram OEmbed feed
- Email notifications on new leads (Resend integration)
- SEO meta per page (react-helmet-async)
- Sitemap.xml + robots.txt generation

## Backlog (P2)
- CMS-driven project entries (currently seeded)
- Bilingual (English + Hindi)
- Sticky service comparison
- Calendar booking integration on consultation
- Newsletter signup
