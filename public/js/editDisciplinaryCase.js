document.addEventListener("DOMContentLoaded", function() {
    // Handle form submission
    const form = document.getElementById('discEdit');
    
    form.addEventListener('submit', function(event) {
        event.preventDefault();

        // Get the form data
        const formData = new FormData(form);
        const data = {
            complainantId: formData.get('complainantId'),
            complainantName: formData.get('complainantName'),
            complainantEmail: formData.get('complainantEmail'),
            respondentId: formData.get('respondentId'),
            respondentName: formData.get('respondentName'),
            respondentEmail: formData.get('respondentEmail'),
            currentLevelOfEscalation: formData.get('currentLevelOfEscalation'),
            confirmedBy: formData.get('confirmedBy')
        };

        // Send an AJAX request to update the disciplinary case
        fetch('/disciplinary/update', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Disciplinary case updated successfully!');
                // Redirect to the disciplinary case list page
                window.location.href = '/disciplinary/list';
            } else {
                alert('Error updating case: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Something went wrong. Please try again later.');
        });
    });
});
