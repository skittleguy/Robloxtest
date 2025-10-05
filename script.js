document.addEventListener("DOMContentLoaded", () => {
    const fileInput = document.getElementById("imageInput");
    const output = document.getElementById("jsonOutput");
    const convertBtn = document.getElementById("convertBtn");
    const copyBtn = document.getElementById("copyBtn");
    const resizeWidthInput = document.getElementById("resizeWidth");
    const resizeHeightInput = document.getElementById("resizeHeight");
    const previewCanvas = document.getElementById("preview");
    const previewCtx = previewCanvas.getContext("2d");

    function drawPreview(img, targetWidth, targetHeight) {
        previewCanvas.width = targetWidth;
        previewCanvas.height = targetHeight;
        previewCtx.clearRect(0, 0, targetWidth, targetHeight);
        previewCtx.drawImage(img, 0, 0, targetWidth, targetHeight);
    }

    convertBtn.addEventListener("click", () => {
        if (!fileInput.files[0]) {
            alert("Please select an image first!");
            return;
        }

        const file = fileInput.files[0];
        const reader = new FileReader();

        reader.onload = function(e) {
            const img = new Image();
            img.src = e.target.result;

            img.onload = function() {
                const targetWidth = parseInt(resizeWidthInput.value) || img.width;
                const targetHeight = parseInt(resizeHeightInput.value) || img.height;

                // Draw live preview
                drawPreview(img, targetWidth, targetHeight);

                // Draw to an offscreen canvas for JSON
                const canvas = document.createElement("canvas");
                canvas.width = targetWidth;
                canvas.height = targetHeight;
                const ctx = canvas.getContext("2d");
                ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

                const imageData = ctx.getImageData(0, 0, targetWidth, targetHeight).data;
                const pixels = [];

                for (let i = 0; i < imageData.length; i += 4) {
                    pixels.push([imageData[i], imageData[i+1], imageData[i+2], imageData[i+3]]);
                }

                const json = {
                    width: targetWidth,
                    height: targetHeight,
                    pixels: pixels
                };

                output.value = JSON.stringify(json, null, 2);
            };

            img.onerror = function() {
                alert("Failed to load image. Try a different file.");
            };
        };

        reader.readAsDataURL(file);
    });

    copyBtn.addEventListener("click", async () => {
        if (!output.value) {
            alert("Nothing to copy! Generate JSON first.");
            return;
        }

        try {
            await navigator.clipboard.writeText(output.value);
            alert("JSON copied to clipboard!");
        } catch (err) {
            alert("Failed to copy JSON. Make sure your browser supports clipboard API.");
        }
    });
});
