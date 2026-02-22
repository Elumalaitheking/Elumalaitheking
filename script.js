const imageInput = document.getElementById("imageInput");
const extractBtn = document.getElementById("extractBtn");
const statusEl = document.getElementById("status");
const rawTextEl = document.getElementById("rawText");

const valueEls = {
  nox: document.getElementById("noxValue"),
  co: document.getElementById("coValue"),
  co2: document.getElementById("co2Value"),
  o2: document.getElementById("o2Value"),
};

function normalizeText(text) {
  return text
    .replace(/[|]/g, "I")
    .replace(/[,:]/g, ".")
    .replace(/\s+/g, " ")
    .trim();
}

function extractValue(text, patternList) {
  for (const pattern of patternList) {
    const match = text.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }
  return "Not found";
}

function parseEmissionValues(ocrText) {
  const text = normalizeText(ocrText);

  return {
    nox: extractValue(text, [
      /\bNO\s*x\s*[:=]?\s*([0-9]+(?:\.[0-9]+)?\s*(?:ppm|mg\/m3|mg\/Nm3|%)?)/i,
      /\bN0\s*x\s*[:=]?\s*([0-9]+(?:\.[0-9]+)?\s*(?:ppm|mg\/m3|mg\/Nm3|%)?)/i,
    ]),
    co: extractValue(text, [
      /\bCO\b\s*[:=]?\s*([0-9]+(?:\.[0-9]+)?\s*(?:ppm|mg\/m3|mg\/Nm3|%)?)/i,
    ]),
    co2: extractValue(text, [
      /\bCO\s*2\s*[:=]?\s*([0-9]+(?:\.[0-9]+)?\s*(?:%|ppm)?)/i,
      /\bC0\s*2\s*[:=]?\s*([0-9]+(?:\.[0-9]+)?\s*(?:%|ppm)?)/i,
    ]),
    o2: extractValue(text, [
      /\bO\s*2\s*[:=]?\s*([0-9]+(?:\.[0-9]+)?\s*(?:%|ppm)?)/i,
      /\b0\s*2\s*[:=]?\s*([0-9]+(?:\.[0-9]+)?\s*(?:%|ppm)?)/i,
    ]),
  };
}

function updateUI(values) {
  valueEls.nox.textContent = values.nox;
  valueEls.co.textContent = values.co;
  valueEls.co2.textContent = values.co2;
  valueEls.o2.textContent = values.o2;
}

extractBtn.addEventListener("click", async () => {
  const file = imageInput.files?.[0];
  if (!file) {
    statusEl.textContent = "Please upload an image first.";
    return;
  }

  extractBtn.disabled = true;
  statusEl.textContent = "Running OCR... this may take a few seconds.";

  try {
    const result = await Tesseract.recognize(file, "eng", {
      logger: (msg) => {
        if (msg.status === "recognizing text") {
          const progress = Math.round((msg.progress || 0) * 100);
          statusEl.textContent = `Reading text: ${progress}%`;
        }
      },
    });

    const ocrText = result.data.text || "";
    rawTextEl.textContent = ocrText || "No text found.";

    const values = parseEmissionValues(ocrText);
    updateUI(values);

    statusEl.textContent = "Done. Values extracted.";
  } catch (error) {
    statusEl.textContent = `Failed to extract text: ${error.message}`;
  } finally {
    extractBtn.disabled = false;
  }
});
