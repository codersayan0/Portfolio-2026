# CoderSayan — Portfolio 2026

Cyberpunk-inspired developer portfolio, six projects, responsive layout and a floating local Portfolio Assistant.

## Section order
Home → About → Skills → Projects → Journey → Certifications → Python Playground → Contact. Developer Lab was removed; the chatbot is available in the bottom-right corner throughout the site.

## Run locally (no API key required)

```sh
python -m http.server 8000
```

Open http://localhost:8000. The local model runs inside the browser. It is an intent classifier using TF-IDF and nearest-neighbor similarity, fitted on example questions; it returns curated answers from the public portfolio rather than generating text. It handles supported topics and some paraphrases and follow-ups, but cannot answer all possible questions. It is not a fine-tuned LLM.

## Welcome and privacy
The bot icon opens the assistant. A dismissible welcome message appears shortly after page load and disappears automatically. The assistant runs locally in the browser, uses no AI API, and does not transmit chat messages. The chatbot loads a bundled model script, so it does not require a JSON fetch and can answer even when opening index.html directly. Use HTTP (including on Vercel) for the Python worker. Existing contact form and project technology descriptions are unchanged.

## Update the chatbot's knowledge

Edit `chatbot/knowledge.json` (facts, answers, example questions, links), then run:

```sh
python chatbot/train.py
node chatbot/test.js
```

Commit the updated `knowledge.json` and generated `model.json` and `model-data.js`. The Python trainer uses only the standard library. All local knowledge is public; never include private data. Revisit the dataset when your resume or portfolio changes. The source is the uploaded portfolio, not the externally linked resume or private records. Project details and skill claims are self-reported. Linked resources remain unverified.

## Other configuration
- Project data: `PROJECTS` in `main.js`; update the initial HTML cards and chatbot knowledge alongside it.
- Contact: existing EmailJS configuration retained; verify delivery and provider-side abuse protection.
- Resume and certificate links: see `LINK-AUDIT.md`.
- Background videos are preserved but disabled by default.

## Verification in this revision
- 527 example questions across 31 intents (431 vocabulary terms).
- 40 classifier checks passed. These checks verify selected behaviors, not general accuracy on unseen questions.
- Isolated Chromium tests passed at desktop (1280×900) and mobile (390×844), using the actual widget markup, styles, scripts and model data with a mocked local JSON fetch. Tested welcome message, icon-only launcher, answers, reset and close.
- No chatbot server endpoint, external AI requests, API-key configuration or model-provider toggle remains. References to Gemini in existing project descriptions and skill lists are intentionally retained.
- Full-site browser navigation was blocked by the environment; deployment, external links and contact delivery remain unverified.


## Five-feature edition
- Time-based greetings use the visitor's browser-local time, including the bot welcome.
- Use the sun/moon button to switch themes; the preference is stored locally.
- Preview CV opens a local professional summary immediately. Use Load original PDF preview to request the existing Google Drive PDF. Open and download links are provided. No PDF was included in the original archive; the printable summary is not the original resume. Internet access and Drive permissions are required for the PDF.
- Share / QR opens a locally stored QR image for https://codersayan.vercel.app/ with copy and save controls.
- Python Playground uses Pyodide 0.27.7 in a worker loaded from a CDN on demand. It supports editable examples, output, run/stop/reset/clear, Ctrl/Cmd+Enter, a 120-second loading timeout and 10-second execution timeout. An internet connection is required for initial runtime loading; run only trusted code. Save .py exports the current editor contents to run with Python locally if the CDN is blocked.
- No recruiter mode, blog, service worker, voice or multilingual changes are included. The chatbot model and knowledge files are unchanged.

Live external resources, actual Python runtime download and execution, contact delivery and deployment have not been verified.

## Reliability revision
- Use `python -m http.server 8000` from the extracted folder, then open `http://localhost:8000/` (not a file URL for the Python playground).
- Added the Playground to desktop and mobile navigation. Navigation collapses into a menu at widths up to 1100 px.
- Local chatbot data is bundled in a normal JavaScript script; no network fetch is necessary. Both generated model files are updated by train.py.
- External font, icon, Three.js and EmailJS resources no longer block local feature initialization. They remain optional dependencies; contact delivery requires EmailJS.
- Resume summary is available before any external iframe request. The real resume is still linked to Google Drive; verify its public sharing settings.
- QR copy uses a legacy clipboard fallback where supported, or selects the URL for manual copying.
- Python loads its pinned runtime on demand, attempts an alternate CDN if loading fails, distinguishes runtime and code errors, and provides Save .py for actual local execution.
- Rechecked the 40 classifier cases, JS syntax, local asset paths, QR image, ZIP integrity and isolated Chromium interface at widths 1280, 1024 and 390. Browser tests used inlined assets because top-level navigation is blocked here; the real bundled model answered with fetch disabled. Python load-failure response was simulated; live runtime execution, external resume availability, EmailJS delivery and deployment are not verified.
