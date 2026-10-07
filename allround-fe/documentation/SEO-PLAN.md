# SEO Implementation Plan — allround.effct.site

Step-by-step plan for making the site indexable and share-friendly.
Nothing here changes game logic or layout; all changes are meta-level.

Estimated total effort: ~1-2 hours including Search Console waits.

---

## Phase 1 — Base meta tags (`index.html`)

**File:** `allround-fe/index.html`

The static shell every route loads. Add/fix:

1. `<html lang="en">` — verify present (it is).
2. `<title>` — a proper default: `Allround — minigames by Effct`
   (routes override this at runtime; this is the crawl/first-paint
   fallback).
3. `<meta name="description">` — one sentence, e.g.
   "A collection of quick browser minigames: typing, aim training,
   mental maths and memory tests."
4. Favicon — replace `/vite.svg` with an Effct-branded icon
   (32×32 + 180×180 apple-touch-icon, placed in `public/`).
5. Open Graph / Twitter tags:
   - `og:site_name` = Allround
   - `og:title`, `og:description` (same as above)
   - `og:url` = `https://allround.effct.site`
   - `og:image` = branded preview image (1200×630 recommended —
     reuse the Effct art, **compressed**; the current 737KB PNG is
     too heavy)
   - `twitter:card` = `summary_large_image`
6. `<link rel="canonical" href="https://allround.effct.site/">`

**Verify:** view-source on the deployed site shows the tags.

---

## Phase 2 — Per-route titles & descriptions

**Files:** `allround-fe/src/routes.ts`, `src/main.ts`
(new tiny composable, e.g. `src/lib/usePageMeta.ts`)

Right now `main.ts` sets only `"<route> | Allround"` as the title.
Extend each route with meta fields and apply them in the global
`afterEach` hook (no extra dependency needed at this size):

```ts
// routes.ts — add a meta block per route
{ path: '/projects/typewright', component: Typewright,
  meta: { title: 'Typewright — Typing Speed Test',
          description: 'Test and train your typing speed and accuracy.' } }
```

Per-route descriptions (draft, reword freely):

| Route        | Title                          | Description                              |
| ------------ | ------------------------------ | ---------------------------------------- |
| `/`          | Allround — browser minigames   | Quick typing, aim, maths and memory games |
| `/about`     | About — Allround               | What Allround is, built with Vue + TS    |
| typewright   | Typewright — Typing Test       | Typing speed & accuracy test             |
| aimlab       | Aimlab — Aim Trainer           | Gridshot-style click aim trainer         |
| quick-maths  | Quick Maths — Mental Maths     | Solve as many problems as you can        |
| chimp-test   | Chimp Test — Memory Test       | Memorize numbers, click them in order    |
| settings     | (noindex — see below)          |                                          |

Also set `<link rel="canonical">` per route in the same hook so each
page canonicalizes to itself.

**Note:** Google does execute the JS and typically sees these, but the
`index.html` fallbacks from Phase 1 remain the safety net.

**Verify:** navigate between routes, check the tab title and view-source
after render.

---

## Phase 3 — robots.txt, sitemap.xml, noindex

**New files in `allround-fe/public/`** (copied verbatim to `dist/`):

1. `robots.txt`

   ```
   User-agent: *
   Allow: /

   Sitemap: https://allround.effct.site/sitemap.xml
   ```

2. `sitemap.xml` — all 6 content routes with `lastmod`.

3. **Noindex `/settings`** — it's an app panel, not content. Either
   via a `robots` meta tag applied in the Phase 2 hook
   (`<meta name="robots" content="noindex">` when route meta says so)
   or by listing it as `Disallow` in robots.txt (meta-tag approach is
   preferable; Disallow hides it from crawling but not indexing).

**Verify:** `https://allround.effct.site/robots.txt` and `/sitemap.xml`
return the files after deploy.

---

## Phase 4 — Structured data (optional but cheap)

**File:** `index.html`

One JSON-LD block describing the site:

- `@type: WebSite` — name, url
- optionally one `VideoGame` entry per game on their route metas
  later (Phase 2 hook can inject per-route JSON-LD too — keep it
  simple for now, site-level only)

**Verify:** https://search.google.com/test/rich-results

---

## Phase 5 — Search Console & Bing (the actual "appear in searches" step)

1. **Google Search Console** — https://search.google.com/search-console
   - Add property → Domain → `effct.site`
     (domain-level covers subdomains; requires DNS TXT record)
   - Cloudflare dashboard → DNS → add the TXT record Google shows
     (propagates in minutes on Cloudflare)
   - Submit sitemap: `sitemap.xml`
2. **Bing Webmaster Tools** — can import straight from GSC.
3. **Request indexing** for the home page once verified — jumps the
   queue instead of waiting for organic crawl.

**Verify:** GSC "URL Inspection" shows the home page as indexed;
"Performance" starts collecting (takes days-weeks for data).

---

## Phase 6 — Follow-ups (not blocking, listed for completeness)

- Compress/resize the Effct og-image (target < 200KB).
- Consider canonicalizing `*.pages.dev` → custom domain
  (redirect rule in Cloudflare, avoids duplicate content).
- Real 404s for unknown paths (currently SPA-fallback 200s
  everything — fine for now, low SEO risk on a small site).
- Inbound links (the real long-term ranking lever): share the site,
  link it from a GitHub profile/portfolio — none of the above ranks
  a link-less site for competitive terms.

---

## Why not SSR/prerendering?

Discussed and deliberately skipped: the pages are interactive games
with little crawlable text; the static text that exists (home/about/
game descriptions) is small and covered by the title/description
approach. Replatforming to Nuxt or adding prerendering is a large
change for marginal gain at this site's scale. Revisit only if the
site grows content-heavy pages (e.g. stats pages, leaderboards, a
blog).

---

## Execution checklist

- [ ] Phase 1 — index.html base meta + favicon + OG
- [ ] Phase 2 — per-route title/description/canonical hook
- [ ] Phase 3 — robots.txt + sitemap.xml + noindex settings
- [ ] Phase 4 — JSON-LD WebSite block
- [ ] Deploy (commit → Cloudflare build)
- [ ] Phase 5 — GSC verify + sitemap + request indexing
- [ ] Bing import
