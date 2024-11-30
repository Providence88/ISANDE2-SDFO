document.getElementById('nfcEdit').addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevent the page from refreshing

    const formData = {
        idNumber: document.getElementById('idNumber').value,
        lastName: document.getElementById('lastName').value,
        firstName: document.getElementById('firstName').value,
        middleInitial: document.getElementById('middleInitial').value,
        cellphoneNumber: document.getElementById('cellphoneNumber').value,
        schoolEmail: document.getElementById('schoolEmail').value,
        signature: document.getElementById('signature').value,
        consent: document.getElementById('consent').value,
        submitted: document.getElementById('submitted').value,
    };

    const caseId = getCaseIdFromURL(); // Get the ID of the case being edited

    try {
        const response = await fetch(`/editNonFraternityContract/${caseId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData), // Convert data to JSON
        });

        const data = await response.json();

        if (response.ok) {
            // Optionally redirect or refresh the data
            document.getElementById('nfcEdit').reset();
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