document.addEventListener('DOMContentLoaded', () => {
    console.log('Space Weather Alert System Loaded');
    fetchAlerts();
});

async function fetchAlerts() {
    const url = "https://services.swpc.noaa.gov/products/alerts.json";

    try {
        const response = await fetch(url);
        const data = await response.json();

        const geomagneticStorms = data.filter(alert => 
            alert[2] && alert[2].includes("Geomagnetic Storm")
        );

        displayAlerts(geomagneticStorms);
    } catch (error) {
        console.error("Error fetching alerts:", error);
        document.querySelector('.real-time-alerts').innerHTML = "<p>Failed to load alerts.</p>";
    }
}

function displayAlerts(alerts) {
    const alertPanel = document.querySelector('.real-time-alerts');

    if (alerts.length === 0) {
        alertPanel.innerHTML = "<p>No geomagnetic storm alerts at this time.</p>";
        return;
    }

    alerts.forEach(alert => {
        const alertElement = document.createElement('div');
        alertElement.classList.add('alert-item');
        alertElement.innerHTML = `
            <div class="alert-box">
                <h3>Space Weather Alert: ${alert[1]}</h3>
                <p><strong>Issue Time:</strong> ${alert[0]}</p>
                <p><strong>ALERT:</strong> ${alert[4]}</p>
                <p><strong>Active Warning:</strong> Yes</p>
                <p><strong>Potential Impacts:</strong> ${alert[5]}</p>
                <p><strong>Status:</strong> Alert</p>
            </div>
        `;

        // Append new alerts at the top
        alertPanel.prepend(alertElement);
    });
}

document.getElementById('currentYear').textContent = new Date().getFullYear();

setInterval(fetchAlerts, 300000);