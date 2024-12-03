document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('dtcfEdit');

    form.addEventListener('submit', async function (event) {
        event.preventDefault(); // Prevent default form submission

        // Retrieve and prepare form values
        const formData = {
            idNumber: document.getElementById('idNumber').value.trim(),
            lastName: document.getElementById('lastName').value.trim(),
            firstName: document.getElementById('firstName').value.trim(),
            middleInitial: document.getElementById('middleInitial').value.trim(),
            cellphoneNumber: document.getElementById('cellphoneNumber').value.trim(),
            schoolEmail: document.getElementById('schoolEmail').value.trim(),
            signature: document.getElementById('signature').value === 'true', // Convert to boolean
            submittedNFC: document.getElementById('submittedNFC').value === 'true', // Convert to boolean
            consentDTCF: document.getElementById('consentDTCF').value === 'true', // Convert to boolean
            submittedDTCF: document.getElementById('submittedDTCF').value === 'true', // Convert to boolean
        };

        // Validation: Ensure required fields are filled
        if (
            !formData.idNumber ||
            !formData.lastName ||
            !formData.firstName ||
            !formData.middleInitial ||
            !formData.cellphoneNumber ||
            !formData.schoolEmail
        ) {
            alert('All fields are required.');
            return;
        }

        const actionUrl = form.action;

        try {
            // Disable submit button and show loading indicator
            const submitButton = form.querySelector('button[type="submit"]');
            submitButton.disabled = true;
            submitButton.textContent = 'Submitting...';

            // Send data to the server
            const response = await fetch(actionUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const result = await response.json();

            if (response.ok && result.success) {
                // Redirect to the list page on success
                window.location.href = '/dtcfNFC/list';
            } else {
                // Show error message from server or generic error
                const errorMessage = result.message || 'Failed to update the consent form.';
                alert(errorMessage);
            }
        } catch (error) {
            console.error('Error during form submission:', error);
            alert('An unexpected error occurred while updating the consent form.');
        } finally {
            // Re-enable the submit button and reset its text
            const submitButton = form.querySelector('button[type="submit"]');
            submitButton.disabled = false;
            submitButton.textContent = 'Submit';
        }
    });
});
