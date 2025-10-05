const imageInput = document.getElementById("imageInput");
const widthInput = document.getElementById("widthInput");
const heightInput = document.getElementById("heightInput");
const canvas = document.getElementById("canvas");
const preview = document.getElementById("preview");
const jsonOutput = document.getElementById("jsonOutput");
const copyBtn = document.getElementById("copyBtn");

imageInput.addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        const img = new Image();
        img.onload = function() {
            // Default inputs to actual image size
            widthInput.value = img.width;
            heightInput.value = img.height;

            processImage(img);
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
});

function processImage(img) {
    const sizeX = parseInt(widthInput.value) || img.width;
    const sizeY = parseInt(heightInput.value) || img.height;

    canvas.width = sizeX;
    canvas.height = sizeY;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0, sizeX, sizeY);

    preview.src = canvas.toDataURL();

    const imageData = ctx.getImageData(0, 0, sizeX, sizeY).data;
    const pixels = [];

    // Extract pixels including alpha
    for (let i = 0; i < imageData.length; i += 4) {
        const r = imageData[i];
        const g = imageData[i + 1];
        const b = imageData[i + 2];
        const a = imageData[i + 3];
        pixels.push([r, g, b, a]);
    }

    const json = {
        width: sizeX,
        height: sizeY,
        pixels: pixels
    };

    jsonOutput.value = JSON.stringify(json, null, 2);
}

// Copy button
copyBtn.addEventListener("click", () => {
    jsonOutput.select();
    jsonOutput.setSelectionRange(0, 999999); // mobile support
    navigator.clipboard.writeText(jsonOutput.value).then(() => {
        alert("Copied JSON to clipboard!");
    }).catch(err => {
        console.error("Failed to copy: ", err);
    });
});

// If user manually changes width/height, re-process image
widthInput.addEventListener("input", () => {
    if (preview.src) {
        const img = new Image();
        img.onload = () => processImage(img);
        img.src = preview.src;
    }
});
heightInput.addEventListener("input", () => {
    if (preview.src) {
        const img = new Image();
        img.onload = () => processImage(img);
        img.src = preview.src;
    }
});
