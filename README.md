# Cultural Health Connect — Website

Source for [culturalhealthconnect.org](https://culturalhealthconnect.org): free, evidence-based health education tailored to the Middle Eastern and Mexican communities of El Cajon, CA, in English, Spanish, and Arabic.

## How it works

- Built with [Quarto](https://quarto.org). Pages are `.qmd` files at the repo root; the rendered site goes to `docs/`, which GitHub Pages serves at the custom domain (see `CNAME`).
- **Translations:** every translatable element carries a `data-i18n` key. Strings for all three languages live in `translations.js`; `i18n.js` applies them and handles the language switcher + RTL layout for Arabic. When adding content, add the key to **all three** language blocks.
- **Health Assistant:** `assistant.js` is a client-side, trilingual educational chat widget with a curated knowledge base (no API keys or server required). It is general education only and says so prominently.
- **SEO:** `_quarto.yml` sets `site-url` (generates `docs/sitemap.xml`), per-page descriptions live in each `.qmd` front matter, `robots.txt` is copied as a resource, and organization structured data (JSON-LD) is injected site-wide.

## Editing and publishing

```sh
quarto render          # rebuilds docs/
quarto preview         # local preview with live reload
```

Commit and push to `main`; GitHub Pages publishes `docs/` automatically.
