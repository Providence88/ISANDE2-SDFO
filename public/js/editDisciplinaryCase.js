document.getElementById('discEdit').addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevent the page from refreshing

    // Collect form data
    const formData = {
        complainantId: document.getElementById('complainantId').value,
        complainantName: document.getElementById('complainantName').value,
        complainantEmail: document.getElementById('complainantEmail').value,
        respondentId: document.getElementById('respondentId').value,
        respondentName: document.getElementById('respondentName').value,
        respondentEmail: document.getElementById('respondentEmail').value,
        currentLevelOfEscalation: document.getElementById('currentLevelOfEscalation').value,
        confirmedBy: document.getElementById('confirmedBy').value
    };

    // Get the caseId from the URL
    const caseId = getCaseIdFromURL();

    try {
        const response = await fetch(`/disciplinary/edit/${caseId}`, {
            method: 'PUT',  // Use PUT method for updating
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData), // Send data as JSON
        });

        if (response.ok) {
            // Redirect to the list page after successful update
            window.location.href = '/disciplinary/list'; // Update this to wherever you want to navigate
        } else {
            // Handle failure (optional: you could show a more descriptive error)
            alert('Failed to update the case');
        }
    } catch (error) {
        console.error('Error submitting edit form:', error);
        alert('An error occurred while submitting the form');
    }
});

// Helper function to get caseId from URL
function getCaseIdFromURL() {
    const pathParts = window.location.pathname.split('/');
    return pathParts[pathParts.length - 1]; // Case ID is the last part of the URL
}
