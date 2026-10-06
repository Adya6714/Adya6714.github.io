# Adya Srivastava, portfolio

A single-page portfolio over a painted forest river. The painting is the backdrop, the water is animated with a WebGL shader, and everything you read sits in normal, scrollable sections.

No framework, no build step. Plain HTML, CSS and JavaScript.

## Run it locally
```
npx serve .
```
Open the printed address. Do not open `index.html` straight from disk, because the browser blocks the textures.

## Where things live
| What | File |
|---|---|
| All text, links, projects, papers, interview answers | `js/content.js` |
| Photo, resume, study module link, form endpoint, sample items switch | `js/config.js` |
| Layout and every section | `js/site.js` |
| Animated backdrop | `js/scene.js` and the shader inside `index.html` |
| The guardian (matching and animation) | `js/interview.js` |
| Koi pond | `js/koi.js` |
| Look and feel | `css/style.css` |

## Add your photo
Save a square photo (600 x 600 or more, under 250 KB) as `assets/photo.jpg`. The file name must be lowercase because GitHub Pages is case sensitive.

## Study module
In Google Drive: right-click the file or folder, Share, General access, Anyone with the link, Viewer, Copy link. Paste it as `STUDY_MODULE_URL` in `js/config.js`. The address `drive.google.com/drive/home` only opens your own Drive.

## Reading log and shelf
In `js/content.js` find `shelf.reading` and `shelf.videos`. Replace the items marked `sample: true` with your own (write a real takeaway and a one-line "why"). When you are done, set `SHOW_SAMPLES: false` in `js/config.js`.

## Drop me a card
Cards are sent with FormSubmit (`SUGGESTION_ENDPOINT`). The first submission triggers an activation email to srivastavadya@gmail.com. Click the link in it once, and every card after that arrives in your inbox. If the service cannot be reached, the visitor's email app opens with the card filled in.

## Deploy
Push to `main`. The workflow in `.github/workflows/pages.yml` publishes to GitHub Pages. In the repository, set Settings, Pages, Source to "GitHub Actions".

## Edit the interview
Questions live in `content.js` under `interview.qs`. Each has a short answer, a longer one, a list of phrasings (`para`) that help matching, and follow-up questions (`next`). Rewrite the answers in your own voice.
