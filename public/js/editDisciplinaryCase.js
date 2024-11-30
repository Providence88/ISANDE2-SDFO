document.getElementById('discEdit').addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevent the page from refreshing

    const formData = {
        complainantId: document.getElementById('complaintId').value,
        complainantName: document.getElementById('complainantName').value,
        complainantEmail: document.getElementById('complainantEmail').value,
        respondentId: document.getElementById('respondentId').value,
        respondentName: document.getElementById('respondentName').value,
        respondentEmail: document.getElementById('respondentEmail').value,
        currentLevelOfEscalation: document.getElementById('currentLevelOfEscalation').value,
        confirmedBy: document.getElementById('confirmedBy').value
    };

    const caseId = getCaseIdFromURL(); // Get the ID of the case being edited

    try {
        const response = await fetch(`/disciplinary/edit/${caseId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData), // Convert data to JSON
        });

        const data = await response.json();

        if (response.ok) {
            alert('Disciplinary case edited successfully!');
            // Optionally redirect or refresh the data
        } else {
            alert(`Error: ${data.error}`);
        }
    } catch (error) {
        console.error('Error submitting edit form:', error);
        alert('Something went wrong while updating the case.');
    }
});

// Helper function to get case ID from URL (or wherever it's stored)
function getCaseIdFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id'); // Assumes the case ID is in the URL as ?id=123
}