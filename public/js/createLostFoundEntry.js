// public/js/createLostFoundEntry.js
document.getElementById('landfCreate').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the form from submitting normally

    const formData = new FormData(this);
    const data = {
        itemId: formData.get('itemId'),
        itemName: formData.get('itemName'),
        locationFound: formData.get('locationFound'),
        dateTimeFound: formData.get('dateTimeFound'),
        confirmedBy: formData.get('confirmedBy'),
        claimed: formData.get('claimed') === 'true' // Convert to boolean
    };

    // Send the data to the server via AJAX
    fetch('/lostFound/create', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (response.ok) {
            window.location.href = '/main'; // Redirect to the main page after success
        } else {
            alert('Error creating entry');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred. Please try again.');
    });
});
