// Restrict access if not logged in
if (localStorage.getItem("isAuthenticated") !== "true") {
    alert("Unauthorized access! Please log in first.");
    window.location.href = "login.html"; // Redirect back to login
}

async function fetchRequests() {
    try {
        const response = await fetch('/fetch-requests'); // Call API to get book requests
        const data = await response.json();

        const requestContainer = document.getElementById('request-container');
        requestContainer.innerHTML = ""; // Clear existing data

        if (data.length === 0) {
            requestContainer.innerHTML = "<p>No book requests found.</p>";
            return;
        }

        data.forEach(request => {
            const card = document.createElement('div');
            card.className = 'request-card';
            card.innerHTML = `
                <h3>${request.Book_name}</h3>
                <p><strong>Student Name:</strong> ${request.Student_name}</p>
                <p><strong>Student ID:</strong> ${request.Student_id}</p>
                <p><strong>Semester:</strong> ${request.Sem}</p>
                <p><strong>Request Date:</strong> ${new Date(request.Issue_date).toDateString()}</p>
                <div class="button-container">
                    <button class="accept-btn" onclick="handleAction('${request._id}', 'accept')">Accept</button>
                    <button class="decline-btn" onclick="handleAction('${request._id}', 'decline')">Decline</button>
                </div>
            `;
            requestContainer.appendChild(card);
        });

    } catch (error) {
        console.error("Error fetching requests:", error);
    }
}

async function handleAction(requestId, action) {
    try {
        const response = await fetch(`/handle-request/${requestId}/${action}`, { method: 'POST' });
        const result = await response.json();
        alert(result.message);
        fetchRequests(); // Refresh request list after action
    } catch (error) {
        console.error("Error handling request:", error);
    }
}

function logout() {
    localStorage.removeItem("isAuthenticated"); // Clear authentication flag
    window.location.href = "Home.html"; // Redirect to login page
}

window.onload = fetchRequests; // Fetch requests automatically on page load