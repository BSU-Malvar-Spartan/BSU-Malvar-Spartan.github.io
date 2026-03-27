# BSU Malvar Spartan — Organization Website

Official GitHub Pages website for the **BSU Malvar Spartan** organization at Batangas State University, Malvar Campus.

🌐 **Live site:** https://bsu-malvar-spartan.github.io

---

## Features

- Responsive landing page (mobile-first)
- Hero section with animated gradient
- Animated stats counters (members, projects, commits, stars)
- About section with mission pillars
- Featured projects showcase
- Team member cards
- Contact form with client-side validation
- Smooth scroll & scroll-reveal animations
- Dark theme with BSU Spartan green/gold palette

## File Structure

```
BSU-Malvar-Spartan.github.io/
├── index.html          # Main HTML page
├── css/
│   └── style.css       # All styles (CSS variables, responsive)
├── js/
│   └── main.js         # Interactivity (nav, counters, animations, form)
└── assets/
    └── images/         # Place org logos and member photos here
```

## Customizing

1. **Team members** — Edit the `#team` section in `index.html`. Replace placeholder cards with real names, roles, and GitHub profile links. Use `<img>` tags inside `.member-card__avatar` with GitHub avatar URLs (e.g. `https://avatars.githubusercontent.com/u/USER_ID`).

2. **Projects** — Edit the `#projects` section in `index.html`. Replace placeholder cards with real repository names, descriptions, and links.

3. **Stats** — Edit the `statsConfig` array in `js/main.js` to reflect actual counts.

4. **Contact** — Replace the placeholder email in the `#contact` section. To enable form submissions, add a [Formspree](https://formspree.io) `action` attribute to the `<form>` element.

5. **Colors / Fonts** — All design tokens live in the `:root` block at the top of `css/style.css`.

## Deployment

This repository is served automatically via **GitHub Pages** from the `main` branch. Push changes to `main` and the site updates within minutes.

To enable GitHub Pages:
1. Go to **Settings → Pages**
2. Set Source to `Deploy from a branch` → `main` → `/ (root)`
3. Save — your site will be live at `https://bsu-malvar-spartan.github.io`

## License

MIT © BSU Malvar Spartan