# RiL Gold AI — Elite XAUUSD Trading Intelligence

AI-powered XAUUSD (Gold) chart scanner & trading advisor. 100% client-side single-file app (React via CDN) — tidak ada backend, tidak ada database. API key AI (Gemini/OpenRouter/Groq/Custom) disimpan di `localStorage` browser masing-masing pengguna dan hanya dikirim langsung ke provider AI yang bersangkutan.

## Isi repo

| File | Fungsi |
|---|---|
| `index.html` | Seluruh aplikasi (React + logic dikompilasi di browser via Babel standalone) |
| `manifest.json` | Web App Manifest — bikin app bisa di-install (PWA) |
| `sw.js` | Service worker — cache app shell untuk mode offline |
| `icon-*.png`, `favicon.ico` | Icon app di berbagai ukuran |
| `netlify.toml` | Header cache (dipakai kalau deploy ke Netlify, diabaikan di GitHub Pages) |
| `.github/workflows/deploy.yml` | Auto-deploy ke GitHub Pages tiap push ke `main` |
| `.nojekyll` | Supaya GitHub Pages tidak memproses file lewat Jekyll |

## Deploy ke GitHub Pages (otomatis, direkomendasikan)

1. Push repo ini ke GitHub (branch `main`).
2. Buka **Settings → Pages** di repo.
3. Pada **Build and deployment → Source**, pilih **GitHub Actions**.
4. Push apa saja ke `main` — workflow `.github/workflows/deploy.yml` otomatis build & deploy.
5. Setelah selesai, URL app muncul di **Settings → Pages** (biasanya `https://<username>.github.io/<nama-repo>/`).

Tidak perlu setting `base path` manual — semua path di `index.html`/`manifest.json`/`sw.js` sudah relatif (`./...`), jadi otomatis cocok baik di root domain maupun di subpath repo GitHub Pages.

## Deploy ke GitHub Pages (manual, tanpa Actions)

Kalau mau lebih simpel tanpa workflow:
1. **Settings → Pages → Source** pilih **Deploy from a branch**.
2. Pilih branch `main`, folder `/ (root)`.
3. Save. URL akan aktif dalam 1–2 menit.

## Custom domain (opsional)

Tambahkan file `CNAME` berisi domain kamu (mis. `goldai.domainkamu.com`) di root repo, lalu arahkan DNS domain tersebut (CNAME record) ke `<username>.github.io`.

## Update versi PWA setelah perubahan

Setiap kali `index.html` diubah dan di-deploy ulang, naikkan `CACHE_VERSION` di `sw.js` (mis. `v1` → `v2`) supaya pengguna lama otomatis dapat versi baru, bukan versi lama dari cache.

## Development lokal

Karena pakai service worker, buka lewat local server (bukan `file://`):

```bash
npx serve .
# atau
python3 -m http.server 8080
```

Lalu akses `http://localhost:8080` (atau port sesuai server yang dipakai).
