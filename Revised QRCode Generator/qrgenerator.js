const input = document.getElementById('input');
const qrimg = document.getElementById('qr-img');
const button = document.getElementById('btn');
const shareButtons = document.getElementById('share-buttons');
const downloadButton = document.getElementById('download-btn');
const clearInput = document.getElementById('clear-input');

const twitterShare = document.getElementById('twitter-share');
const facebookShare = document.getElementById('facebook-share');
const whatsappShare = document.getElementById('whatsapp-share');
const emailShare = document.getElementById('email-share');

const urlRegex = /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(:\d+)?(\/\S*)?$/;

button.addEventListener('click', () => {
    let inputValue = input.value.trim();

    if (!inputValue) {
        alert("Please enter a valid URL.");
        return;
    }

    if (!urlRegex.test(inputValue)) {
        alert("Invalid entry! Only URLs are allowed.");
        return;
    }

    if (!inputValue.startsWith("http://") && !inputValue.startsWith("https://")) {
        inputValue = "https://" + inputValue;
    }

    // Generate QR Code if input is valid
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(inputValue)}`;
    qrimg.src = qrCodeUrl;
    qrimg.alt = `QR Code for ${inputValue}`;

    qrimg.style.display = "block";
    shareButtons.style.display = "flex";
    downloadButton.style.display = "block";

    downloadButton.onclick = async () => {
        try {
            const response = await fetch(qrCodeUrl);
            const blob = await response.blob();
            const url = URL.createObjectURL(blob);

            const a = document.createElement("a");
            a.href = url;
            a.download = "qrcode.png";
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);

            URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Error downloading QR Code:", error);
        }
    };

    twitterShare.onclick = () => {
        window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(qrCodeUrl)}&text=Check out this QR Code!`, "_blank");
    };

    facebookShare.onclick = () => {
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(qrCodeUrl)}`, "_blank");
    };

    whatsappShare.onclick = () => {
        window.open(`https://wa.me/?text=Check out this QR Code: ${qrimg.src}`, "_blank");
    };

    emailShare.onclick = () => {
        const emailSubject = `QR Code for ${inputValue}`;
        const emailBody = `Here is the QR Code for ${inputValue}:\n${qrCodeUrl}`;
        window.open(`https://mail.google.com/mail/?view=cm&fs=1&to=&su=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`, "_blank");
    };
});

input.addEventListener('input', () => {
    clearInput.style.display = input.value ? 'block' : 'none';
});

clearInput.addEventListener('click', () => {
    input.value = "";
    clearInput.style.display = 'none';
});
