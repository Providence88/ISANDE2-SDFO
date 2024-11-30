document.getElementById('landfCreate').addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevent the page from refreshing

    // Collect inputs
    const formData = {
        itemId: document.getElementById('').value,
        itemName: document.getElementById('').value,
        locationFound: document.getElementById('').value,
        dateTimeFound: document.getElementById('').value,
        confirmedBy: document.getElementById('').value,
        claimed: document.getElementById('').value,
        claimedBy: document.getElementById('').value,
        claimConfirmedBy: document.getElementById('').value,
        dateClaimed: document.getElementById('').value,
    };

    try {
        // Send data to the backend
        const response = await fetch('/createLostFoundEntry', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData), // Convert data to JSON
        });

        const data = await response.json(); // Parse the response

        if (response.ok) {
            // Optionally clear the form or redirect
            document.getElementById('landfCreate').reset();
        } else {
            alert(`Error: ${data.error}`);
        }
    } catch (error) {
        console.error('Error submitting form:', error);
    }
});
