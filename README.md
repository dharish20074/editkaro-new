# Editkaro.in — Website

A complete, responsive 4-page website for **Editkaro.in**, a social media marketing and video editing agency. Built with plain HTML, CSS, and JavaScript — no build step, no framework — so it can be deployed as-is to any static host.

**Design concept:** the whole site borrows its visual language from a non-linear video editor (NLE) — a scrubber/timeline hero, a running timecode, perforated film dividers, and timecoded process steps — because that's literally the product this agency sells.

---

## 1. File structure

```
editkaro/
├── index.html              Home — hero, services, process, portfolio teaser, email subscribe form
├── portfolio.html           Portfolio — filterable grid across all 9 categories
├── about.html                About Us — mission, vision, values, team
├── contact.html               Contact Us — full contact form + studio info
├── css/
│   └── style.css              All styles (design tokens at the top)
├── js/
│   ├── portfolio-data.js       Placeholder portfolio items + categories
│   └── main.js                  Nav, scrubber, filters, modal, form handling
├── apps-script/
│   └── Code.gs                   Google Apps Script backend (paste into Google Sheets)
├── robots.txt
├── sitemap.xml
└── README.md
```

No other dependencies. Fonts (Anton, Work Sans, IBM Plex Mono) load from Google Fonts via `<link>` tags already in each page's `<head>`.

---

## 2. Preview locally

Any static server works. From the project folder:

```bash
python3 -m http.server 8080
# then open http://localhost:8080
```

Opening `index.html` directly by double-clicking also works, but a local server avoids occasional `fetch`/CORS quirks while testing the forms.

---

## 3. Where the required content lives

| Brief requirement | Where it is |
|---|---|
| Responsive design | Every page; breakpoints at 980px / 880px / 620px in `style.css` |
| Portfolio categorized by client | `js/portfolio-data.js` — 9 categories, 3 placeholder clips each |
| Every button functional | All nav links, footer links, filter tabs, and CTAs route somewhere real; social icons show a toast (see below) since no real social accounts were provided |
| "Our Team" placeholder page | `about.html` team grid — random names + `pravatar.cc` placeholder photos |
| Email collector (home) | `#newsletterForm` in `index.html`, wired to Google Sheets — see §4 |
| Contact form (name/email/phone/message) | `#contactForm` in `contact.html`, wired to Google Sheets — see §4 |
| SEO basics | Meta description/keywords, canonical tags, Open Graph tags, JSON-LD `Organization` schema (home page), semantic headings, `robots.txt`, `sitemap.xml` |
| Performance basics | No build dependencies, lazy-loaded images (`loading="lazy"`), system-level font loading, minimal JS |

**Placeholder buttons:** the footer social icons (Instagram/YouTube/LinkedIn) don't have real accounts yet, so instead of dead `#` links they show a small toast message explaining what to do — find them in `js/main.js` → `initFootnoteButtons()` / the `data-toast` attribute pattern. Replace the `href="#"` with the real URL and remove the `data-toast` attribute once accounts exist.

---

## 4. Connecting the forms to Google Sheets

Both forms post to **one** Google Apps Script Web App, which files each submission into the right sheet tab.

1. Create a new Google Sheet (any name — e.g. "Editkaro Leads").
2. In the Sheet: **Extensions → Apps Script**.
3. Delete the placeholder code and paste in the contents of `apps-script/Code.gs`.
4. **Deploy → New deployment → Web app**.
   - Execute as: **Me**
   - Who has access: **Anyone**
5. Click **Deploy**, then approve the permissions Google asks for.
6. Copy the **Web app URL** it gives you.
7. Open `js/main.js` and paste that URL into:
   ```js
   const CONFIG = {
     SHEETS_ENDPOINT: "PASTE_YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE",
   };
   ```
8. Submit a test entry on the live site, then check your Sheet — it auto-creates a **Subscribers** tab and a **Contacts** tab the first time each form is used.

**Why `mode: 'no-cors'`?** Apps Script web apps don't respond to the CORS preflight browsers send before a JSON POST. Sending the body as `text/plain` (already done in `main.js`) avoids triggering that preflight, so the request succeeds — but it also means the browser can't read the response back. The form shows an optimistic "sent" message rather than a server-confirmed one. If you need to read real success/failure responses, swap this for a small backend (e.g. a Node/Express endpoint or a Cloudflare Worker) that sets proper CORS headers, or use a form service like Formspree/Getform instead.

---

## 5. Deployment

Any static host works since there's no build step.

**Netlify**
- Drag the `editkaro` folder into the Netlify dashboard, or
- `netlify deploy` from inside the folder (Netlify CLI), publish directory = `.`

**Vercel**
- `vercel` from inside the folder — when asked for a framework, choose "Other"/static.

**GitHub Pages**
- Push this folder to a GitHub repo.
- Repo → Settings → Pages → Deploy from branch → select `main` and `/ (root)`.
- Update the `<link rel="canonical">` tags and `sitemap.xml`/`robots.txt` URLs to match your actual GitHub Pages URL (or custom domain) before going live.

Whichever host you use, point your real domain at it and update the placeholder `https://editkaro.in/...` URLs in the meta tags, `sitemap.xml`, and `robots.txt`.

---

## 6. Content you'll want to swap before this goes live for a real client

- **Team bios/photos** (`about.html`) — currently random names with `pravatar.cc` placeholder avatars.
- **Portfolio thumbnails & videos** (`js/portfolio-data.js`) — currently `picsum.photos` placeholder images with no real video attached. Add a `videoUrl` field per item and update `openClipModal()` in `js/main.js` to render a real `<video>`/`<iframe>` instead of the placeholder note.
- **Studio address, phone, email** (`contact.html`).
- **Social links** (footer, all pages).
- **`CONFIG.SHEETS_ENDPOINT`** (`js/main.js`) — see §4.

---

## 7. Notes for your project report

A few decisions worth mentioning if you're writing up the assignment report:

- **No real client footage was provided**, so the portfolio, team, and client-logo strip use clearly-placeholder content (stock placeholder images, fictional client names) rather than inventing fake claims about real businesses.
- **Forms use Google Apps Script** rather than a custom backend, per the brief's suggested approach — trade-off is the `no-cors` limitation described in §4.
- **Single shared header/footer markup** is duplicated across the 4 pages rather than templated, since the brief specifies plain HTML/CSS/JS with no build tooling — keeps deployment to GitHub Pages/Netlify/Vercel friction-free.
- **Accessibility:** visible focus states, `aria-label`s on icon-only controls, `aria-expanded` on the mobile menu toggle, and `prefers-reduced-motion` support (freezes the running timecode and disables transitions).
