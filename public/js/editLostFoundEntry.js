document.getElementById('landfEdit').addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevent the page from refreshing

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

    const caseId = getCaseIdFromURL(); // Get the ID of the case being edited

    try {
        const response = await fetch(`/editLostFoundEntry/${caseId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData), // Convert data to JSON
        });

        const data = await response.json();

        if (response.ok) {
            // Optionally redirect or refresh the data
            document.getElementById('landfEdit').reset();
        } else {
            alert(`Error: ${data.error}`);
        }
    } catch (error) {
        console.error('Error submitting edit form:', error);
    }
});

// Helper function to get case ID from URL (or wherever it's stored)
function getCaseIdFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id'); // Assumes the case ID is in the URL as ?id=123
}