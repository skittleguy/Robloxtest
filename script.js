const imageInput = document.getElementById("imageInput");
const widthInput = document.getElementById("widthInput");
const heightInput = document.getElementById("heightInput");
const canvas = document.getElementById("canvas");
const preview = document.getElementById("preview");
const jsonOutput = document.getElementById("jsonOutput");
const copyBtn = document.getElementById("copyBtn");

let currentImage = null; // store the uploaded image

imageInput.addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        const img = new Image();
        img.onload = function() {
            currentImage = img;

            // default inputs to actual image size
            widthInput.value = img.width;
            heightInput.value = img.height;

            processImage();
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
});

function processImage() {
    if (!currentImage) return;

    const sizeX = parseInt(widthInput.value) || currentImage.width;
    const sizeY = parseInt(heightInput.value) || currentImage.height;

    canvas.width = sizeX;
    canvas.height = sizeY;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(currentImage, 0, 0, sizeX, sizeY);

    preview.src = canvas.toDataURL();

    const imageData = ctx.getImageData(0, 0, sizeX, sizeY).data;
    const pixels = [];

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

// re-process image when user changes width/height
widthInput.addEventListener("input", processImage);
heightInput.addEventListener("input", processImage);

copyBtn.addEventListener("click", () => {
    jsonOutput.select();
    navigator.clipboard.writeText(jsonOutput.value).then(() => {
        alert("Copied JSON to clipboard!");
    }).catch(err => {
        console.error("Failed to copy: ", err);
    });
});
