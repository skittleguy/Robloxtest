const imageInput = document.getElementById("imageInput");
const canvas = document.getElementById("canvas");
const preview = document.getElementById("preview");
const jsonOutput = document.getElementById("jsonOutput");
const submitBtn = document.getElementById("submitBtn");

imageInput.addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        const img = new Image();
        img.onload = function() {
            const size = 100; // Resize image to 100x100
            canvas.width = size;
            canvas.height = size;
            const ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0, size, size);

            preview.src = canvas.toDataURL();

            const imageData = ctx.getImageData(0, 0, size, size).data;
            const pixels = [];

            for (let i = 0; i < imageData.length; i += 4) {
                const r = imageData[i];
                const g = imageData[i + 1];
                const b = imageData[i + 2];
                const a = imageData[i + 3];
                pixels.push([r, g, b, a]);
            }

            const json = {
                width: size,
                height: size,
                pixels: pixels
            };

            jsonOutput.value = JSON.stringify(json, null, 2);
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
});

submitBtn.addEventListener("click", async () => {
    // Placeholder: send JSON to your server/GitHub automatically
    // For now, just alert
    alert("JSON generated and ready for Roblox to fetch!");
});
