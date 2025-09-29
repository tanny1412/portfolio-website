# Portfolio Website — Data Scientist & GenAI Engineer

A clean, dynamic, single‑page portfolio you can deploy anywhere (GitHub Pages, Netlify, Vercel, S3). Projects and profile are driven by simple JSON files. Includes tasteful click sound effects and a large hero cover photo with a soft gradient blend.

## Quick Start

1) Put your headshot at `assets/profile.jpg` (4:5 ratio recommended).

2) Edit `data/config.json` with your details (name, links, bio, skills, stats).

3) Add/modify your projects in `data/projects.json`.

4) Serve locally:

   - Python: `python3 -m http.server 3000` then open http://localhost:3000
   - Node: `npx serve` or any static server

5) Deploy by pushing this folder to any static host.

## Files to Edit

- `data/config.json` — Name, role, about text, socials, resume, skills, stats.
- `data/projects.json` — All your projects. Fields per project:
  - `title` (string)
  - `description` (string)
  - `tags` (array of strings)
  - `tech` (array of strings)
  - `image` (url/path; optional)
  - `github` (url)
  - `demo` (url; optional)
  - `stars` (number; relative prominence)
  - `date` (YYYY-MM-DD; for sorting)
  - `featured` (boolean; optional)

## Customization Tips

- Hero photo: replace `assets/profile.jpg`. The frame applies a subtle overlay and blend automatically so it looks cohesive with the theme.
- Theme: default is dark; toggle in the header. Light/dark preference is saved.
- Sounds: subtle UI click sounds are on by default and only initialize on first user interaction. Remove the attribute `data-click-sfx` from buttons/links if you don’t want sounds on those elements.
- Styling: tweak colors in `css/styles.css` at the top under `:root` and `[data-theme="light"]`.

## Notes

- For local file opening (`file://`), browsers may block `fetch` of `data/*.json`. Use a local server as shown above.
- Images: store any project thumbnails under `assets/` and reference them from `projects.json`.
- Accessibility: modal is keyboard accessible; press `Esc` to close. Cards are keyboard‑focusable.

## License

You own your content. The template is provided as‑is for personal and professional use.

