// Assuming the form is already available on the page
document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('dtcfEdit');

    form.addEventListener('submit', function (event) {
        event.preventDefault();

        const idNumber = document.getElementById('idNumber').value;
        const lastName = document.getElementById('lastName').value;
        const firstName = document.getElementById('firstName').value;
        const middleInitial = document.getElementById('middleInitial').value;
        const cellphoneNumber = document.getElementById('cellphoneNumber').value;
        const schoolEmail = document.getElementById('schoolEmail').value;
        const signature = document.getElementById('signature').value;
        const consent = document.getElementById('consent').value;
        const submitted = document.getElementById('submitted').value;

        const formData = new FormData();
        formData.append('idNumber', idNumber);
        formData.append('lastName', lastName);
        formData.append('firstName', firstName);
        formData.append('middleInitial', middleInitial);
        formData.append('cellphoneNumber', cellphoneNumber);
        formData.append('schoolEmail', schoolEmail);
        formData.append('signature', signature);
        formData.append('consent', consent);
        formData.append('submitted', submitted);

        const actionUrl = form.action;

        fetch(actionUrl, {
            method: 'POST',
            body: formData,
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                window.location.href = '/drugTest/list'; // Redirect on success
            } else {
                alert('Error updating the consent form');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error updating the consent form');
        });
    });
});
