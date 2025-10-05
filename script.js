document.getElementById("convertBtn").addEventListener("click", () => {
    const fileInput = document.getElementById("imageInput");
    const output = document.getElementById("jsonOutput");

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
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0);

            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
            const pixels = [];

            // Flatten pixels row by row
            for (let i = 0; i < imageData.length; i += 4) {
                const r = imageData[i];
                const g = imageData[i + 1];
                const b = imageData[i + 2];
                const a = imageData[i + 3];
                pixels.push([r, g, b, a]);
            }

            const json = {
                width: img.width,
                height: img.height,
                pixels: pixels
            };

            output.value = JSON.stringify(json, null, 2); // Pretty print JSON
        };
    };

    reader.readAsDataURL(file);
});
