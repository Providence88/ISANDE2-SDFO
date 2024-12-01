document.getElementById('nfcCreate').addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevent the page from refreshing

    // Collect form data
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

    try {
        // Send data to the backend
        const response = await fetch('/nonFraternity/create', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json' 
            },
            body: JSON.stringify(formData), // Send data as JSON
        });

        const data = await response.json(); // Parse the response

        if (response.ok) {
            // Optionally clear the form or redirect
            document.getElementById('nfcCreate').reset();
            alert(data.message);  // Use success message from backend
            window.location.href = '/nonFraternity/list';  // Redirect to the contract list page after successful creation
        } else {
            alert(`Error: ${data.error || 'Unknown error occurred'}`);
        }
    } catch (error) {
        console.error('Error submitting form:', error);
        alert("An error occurred while submitting the form.");
    }
});
