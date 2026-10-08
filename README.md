# Alexander Morris Resume Site

This folder is a self-contained static portfolio based only on the supplied resume. It uses an independent modern corporate visual system and a locally bundled copy of Animate.css. The included `resume.pdf` is the downloadable resume used by both primary calls to action.

## Preview locally

Open `index.html` directly in a browser, or serve this folder with any static file server. No build step is required.

For example, from this folder:

```text
python -m http.server 8000
```

Then open `http://localhost:8000/`.

## Files

- `index.html` — semantic portfolio content and metadata
- `styles.css` — responsive, reduced-motion, focus, and print styles
- `script.js` — navigation and progressive Animate.css scroll effects
- `animate.min.css` — locally bundled Animate.css 4.1.1
- `favicon.svg` — compact AM site mark
- `resume.pdf` — downloadable two-page resume

## Publish safely as a new GitHub Pages site

1. Create a brand-new public GitHub repository with a unique name. Do not reuse, rename, replace, or modify any existing repository or site.
2. Upload only the six site files listed above plus this README to the new repository's default branch.
3. In the new repository, open **Settings → Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**, select the default branch and the root folder, then save.
5. Wait for the Pages deployment to finish successfully.
6. Open the resulting public URL and verify that the portfolio styling loads and both Download PDF buttons open `resume.pdf`.

The site is an independent professional portfolio.
