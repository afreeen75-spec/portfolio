# Afreen Khatun — Portfolio

A single-page portfolio built with **React + TypeScript**, **Tailwind CSS**, **shadcn/ui**
and **Vite**, with the résumé content served from **Firebase** so it can be edited
without a redeploy.

---

## Running it

```bash
pnpm install
pnpm dev        # http://localhost:5173
pnpm build      # typecheck + production build into dist/
pnpm preview    # serve the production build
```

## How the content works

The site renders from **two sources, in this order**:

1. `src/lib/resume-data.ts` — the résumé transcribed into typed objects. This is what
   paints on first load, so the page is never blank and works with no network.
2. **Firestore** — if it has content, it replaces the static data section by section.

Falling back per-section (not all-or-nothing) means a half-filled database still
renders a complete page. If Firestore is unreachable, the site quietly shows the
static résumé instead of erroring.

### Firestore layout

| Path                | Holds                                              |
| ------------------- | -------------------------------------------------- |
| `site/profile`      | Name, role, contact, tagline, about, stats, socials |
| `experience/{id}`   | One document per role                               |
| `projects/{id}`     | One document per product, including its modules     |
| `skills/{id}`       | One skill group (category + items)                  |
| `education/{id}`    | One qualification                                   |

Every collection document carries an `order` number, which is what the site sorts by.

## The editor at `/admin`

Sign in with the Firebase Auth account, edit any section, hit **Publish**. The site
picks the changes up on the next load.

- **Seed** copies `resume-data.ts` into Firestore — run it once to bootstrap, or later
  to reset everything back to what's in the codebase.
- **Publish** writes every section and deletes documents you removed in the editor.
- **Résumé PDF** (Profile tab) uploads a new CV to Firebase Storage at `resume/resume.pdf`
  and writes the fresh download URL back to `site/profile`. Every "Download résumé"
  button on the site then serves the new file — **no rebuild, no redeploy**. Replacing
  the CV is the one-step flow: upload, done.

## Firebase setup

The web config is already in `.env.local` for project `porfolio-6cd34`. Three services
still need to be turned on in the [Firebase console](https://console.firebase.google.com/project/porfolio-6cd34):

1. **Firestore Database** → *Create database* (production mode, any region).
2. **Authentication** → *Get started* → enable **Email/Password**, then add the user
   `khatunafreen742@gmail.com` under the Users tab. Verify the address — the rules
   require `email_verified`.
3. **Storage** → *Get started* (needed for résumé uploads).

Then publish the security rules:

```bash
pnpm dlx firebase-tools login
pnpm dlx firebase-tools deploy --only firestore:rules,storage --project porfolio-6cd34
```

`firestore.rules` and `storage.rules` make all content **publicly readable** and
writable only by that one verified email. Keep the email in those two files in sync
with `VITE_ADMIN_EMAIL`.

Until those three services exist, the site runs fine on the static résumé and `/admin`
will simply fail to sign in.

## Deploying

```bash
pnpm build
pnpm dlx firebase-tools deploy --only hosting --project porfolio-6cd34
```

`firebase.json` serves `dist/`, rewrites all routes to `index.html` (so `/admin` works
on a hard refresh), and caches hashed assets for a year.

> Set the same `VITE_*` variables in your host's environment. They are public by
> design — Firebase web keys identify the project; access is controlled by the rules.

## Project structure

```
src/
  components/
    ui/          shadcn/ui primitives
    layout/      side rail, mobile nav, theme toggle, footer
    sections/    hero, about, work, craft, studies, contact
    common/      section shell, headings, scroll reveal
  admin/         editor forms and the résumé uploader
  hooks/         theme, resume, auth, scroll-spy
  lib/           types, static résumé, Firebase, Firestore service
  pages/         home, admin, 404
```

## Notes

- **Theme** — light/dark/system via Tailwind's `class` strategy, persisted to
  `localStorage` and applied by an inline script in `index.html` so there is no flash
  of the wrong theme. The toggle sits in the side rail (bottom) and the mobile bar.
- **Performance** — the Firebase SDK loads *after* first paint, and Auth and Storage
  are split into their own chunks so visitors only download what they use.
- **Motion** — all entry animations honour `prefers-reduced-motion`.
- **Portrait** — `public/afreen-portrait.{jpg,webp}` is a cropped, optimised version of
  `public/afreen.jpg`. Replace both to change the hero photo.
