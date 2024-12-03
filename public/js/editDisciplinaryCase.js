document.addEventListener("DOMContentLoaded", function() {
    const form = document.getElementById('landfEdit');

    form.addEventListener('submit', function(event) {
        event.preventDefault();  // Prevent form from submitting normally

        // Get form data
        const formData = new FormData(form);
        const data = {
            itemId: formData.get('itemId'),
            itemName: formData.get('itemName'),
            locationFound: formData.get('locationFound'),
            dateTimeFound: formData.get('dateTimeFound'),
            confirmedBy: formData.get('confirmedBy'),
            claimed: formData.get('claimed'),
            claimedBy: formData.get('claimedBy'),
            claimConfirmedBy: formData.get('claimConfirmedBy'),
            dateClaimed: formData.get('dateClaimed')
        };

        // Validate that no required field is empty
        for (const key in data) {
            if (!data[key]) {
                alert(`${key} is required!`);
                return;
            }
        }

        // Send an AJAX request to update the lost and found entry
        fetch('/lostFound/edit/' + formData.get('itemId'), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Lost and Found entry updated successfully!');
                // Redirect to the main page or another appropriate page
                window.location.href = '/main';
            } else {
                alert('Error updating entry: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Something went wrong. Please try again later.');
        });
    });
});
