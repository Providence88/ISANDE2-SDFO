// public/js/popup.js
function showPopup(event) {
    event.preventDefault(); // Prevent form submission
    // Here you can add your AJAX call to submit the form data if needed
    // After successful submission, show the popup
    document.getElementById("popup").style.display = "flex";
}

function closePopup() {
    document.getElementById("popup").style.display = "none";
}