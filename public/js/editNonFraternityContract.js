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
        submitted: document.getElementById('submitted').value,
    };

    const contractId = getContractIdFromURL(); // Get the ID of the contract being edited

    try {
        const response = await fetch(`/nonFraternity/edit/${contractId}`, {
            method: 'POST', // We use 'POST' because this is an update request
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData), // Convert data to JSON
        });

        const data = await response.json();

        if (response.ok) {
            // Optionally redirect or refresh the data
            alert('Contract updated successfully!');
            window.location.href = `/nonFraternity/view/${contractId}`; // Redirect to the contract's view page
        } else {
            alert(`Error: ${data.error}`);
        }
    } catch (error) {
        console.error('Error submitting edit form:', error);
        alert('An error occurred while submitting the form.');
    }
});

// Helper function to get contract ID from URL (or wherever it's stored)
function getContractIdFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id'); // Assumes the contract ID is in the URL as ?id=123
}
