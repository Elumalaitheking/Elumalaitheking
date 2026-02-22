# Emission Value Extractor (NOx, CO, CO2, O2)

A lightweight web app to upload analyzer photos and automatically extract emission values:

- NOx
- CO
- CO2
- O2

## How to run

```bash
python3 -m http.server 4173
```

Then open:

```text
http://localhost:4173
```

## How it works

1. Upload analyzer image.
2. Click **Extract values**.
3. App uses **Tesseract.js** in the browser for OCR.
4. Regex parsing extracts NOx/CO/CO2/O2 values and shows them separately.

## Notes

- Better image quality gives better OCR accuracy.
- Keep labels visible (NOx, CO, CO2, O2) for best results.
