document.getElementById('dtcfCreate').addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevent the page from refreshing

    // Collect inputs
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

    try {
        // Send data to the backend
        const response = await fetch('/drugTest/create', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData), // Convert data to JSON
        });

        const data = await response.json(); // Parse the response

        if (response.ok) {
            // Optionally clear the form or redirect
            document.getElementById('dtcfCreate').reset();
        } else {
            alert(`Error: ${data.error}`);
        }
    } catch (error) {
        console.error('Error submitting form:', error);
    }
});
