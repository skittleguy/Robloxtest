document.getElementById("convertBtn").addEventListener("click", () => {
    const fileInput = document.getElementById("imageInput");
    const output = document.getElementById("jsonOutput");
    const resizeWidth = parseInt(document.getElementById("resizeWidth").value);
    const resizeHeight = parseInt(document.getElementById("resizeHeight").value);

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
            const canvas = document.createElement("canvas");
            const targetWidth = resizeWidth || img.width;
            const targetHeight = resizeHeight || img.height;
            canvas.width = targetWidth;
            canvas.height = targetHeight;
            const ctx = canvas.getContext("2d");

            // Draw the image resized
            ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

            const imageData = ctx.getImageData(0, 0, targetWidth, targetHeight).data;
            const pixels = [];

            for (let i = 0; i < imageData.length; i += 4) {
                const r = imageData[i];
                const g = imageData[i + 1];
                const b = imageData[i + 2];
                const a = imageData[i + 3];
                pixels.push([r, g, b, a]);
            }

            const json = {
                width: targetWidth,
                height: targetHeight,
                pixels: pixels
            };

            output.value = JSON.stringify(json, null, 2);
        };

        img.onerror = function() {
            alert("Failed to load image. Please try a different file.");
        };
    };

    reader.readAsDataURL(file);
});
