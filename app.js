const video = document.getElementById("video");
const emotionResult = document.getElementById("emotion-result");

// Load face-api.js models
Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri("https://cdn.jsdelivr.net/npm/face-api.js/weights"),
    faceapi.nets.faceExpressionNet.loadFromUri("https://cdn.jsdelivr.net/npm/face-api.js/weights")
]).then(startVideo);

// Start video from webcam
function startVideo() {
    navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
            video.srcObject = stream;
        })
        .catch(err => {
            console.error("Camera not accessible:", err);
            emotionResult.textContent = "Camera access denied.";
        });
}

// Detect emotions in real-time
video.addEventListener("play", () => {
    const displaySize = { width: video.width, height: video.height };

    setInterval(async () => {
        const detections = await faceapi
            .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
            .withFaceExpressions();

        if (detections.length > 0) {
            const emotions = detections[0].expressions;
            const dominantEmotion = Object.keys(emotions).reduce((a, b) => emotions[a] > emotions[b] ? a : b);
            emotionResult.textContent = `You are feeling: ${dominantEmotion}`;
        } else {
            emotionResult.textContent = "No face detected. Please adjust!";
        }
    }, 500); // Check every 500ms
});
