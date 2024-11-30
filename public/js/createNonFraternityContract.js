// the logic in createDisciplinaryCase will be the same logic for creating
// the other modules, I'll put dito sa baba yung code content dun sa cases
// then change na lang

/*
document.getElementById('discCreate').addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevent the page from refreshing

    // Collect inputs
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

    try {
        // Send data to the backend
        const response = await fetch('/disciplinary/createDisciplinaryCase', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData), // Convert data to JSON
        });

        const data = await response.json(); // Parse the response

        if (response.ok) {
            // Optionally clear the form or redirect
            document.getElementById('submitForm').reset();
        } else {
            alert(`Error: ${data.error}`);
        }
    } catch (error) {
        console.error('Error submitting form:', error);
    }
});
*/