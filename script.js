const imageInput = document.getElementById("imageInput");
const canvas = document.getElementById("canvas");
const preview = document.getElementById("preview");
const submitBtn = document.getElementById("submitBtn");

let jsonData = null;

// GitHub config
const FILE_PATH = "pixels.json";
const BRANCH = "main";
const TOKEN = "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"; // your token

let latestSha = null; // to store current SHA

// Fetch current SHA of pixels.json
async function fetchFileSha() {
    const url = "https://api.github.com/repos/skittleguy/Robloxtest/contents/pixels.json?ref=main";
    const res = await fetch(url, {
        headers: { "Authorization": `token ${TOKEN}` }
    });
    const data = await res.json();
    latestSha = data.sha;
}

imageInput.addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        const img = new Image();
        img.onload = function() {
            const size = 100;
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

            jsonData = {
                width: size,
                height: size,
                pixels: pixels
            };
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
});

submitBtn.addEventListener("click", async () => {
    if (!jsonData) return alert("No image selected!");

    try {
        // Fetch latest SHA
        await fetchFileSha();

        // Encode JSON to base64
        const content = btoa(unescape(encodeURIComponent(JSON.stringify(jsonData, null, 2))));

        const url = "https://api.github.com/repos/skittleguy/Robloxtest/contents/pixels.json";

        const body = {
            message: "Update pixels.json via website",
            content: content,
            sha: latestSha,
            branch: BRANCH
        };

        const res = await fetch(url, {
            method: "PUT",
            headers: {
                "Authorization": `token ${TOKEN}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        });

        const data = await res.json();
        if (data.content) {
            alert("pixels.json updated successfully! Roblox will fetch the new image.");
        } else {
            console.error(data);
            alert("Failed to update pixels.json. Check console.");
        }
    } catch (err) {
        console.error(err);
        alert("Error sending JSON to GitHub");
    }
});
