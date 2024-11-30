/*
document.addEventListener('DOMContentLoaded', async () => {
    const listContainer = document.querySelectorAll('casesList'); // Target the list container

    try {
        const response = await fetch('/module/list'); // Replace with the appropriate endpoint
        if (!response.ok) throw new Error('Failed to fetch entries');
        const entries = await response.json(); // Parse the JSON response

        // Render the entries
        listContainer.innerHTML = entries.map(entry => `
            <li>
                <strong>${entry.name}</strong> - ${entry.description}
                <a href="/module/edit/${entry._id}">Edit</a>
                <form action="/module/delete/${entry._id}" method="POST" style="display:inline;">
                    <button type="submit">Delete</button>
                </form>
            </li>
        `).join('');
    } catch (error) {
        console.error('Error fetching entries:', error);
        listContainer.innerHTML = '<p>Failed to load entries. Please try again later.</p>';
    }
});
*/
