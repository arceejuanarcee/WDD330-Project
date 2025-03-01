document.addEventListener('DOMContentLoaded', () => {
    console.log('Space Weather Alert System Loaded');
    fetchAlerts();
    fetchF107Flux();
    fetchEnlilTimeSeries(); // Fetch and display Enlil Time Series Data
});

// Fetch Alerts
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
    alertPanel.innerHTML = ""; // Clear previous alerts

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

        alertPanel.prepend(alertElement);
    });
}

// Fetch F10.7 Flux Data
async function fetchF107Flux() {
    const url = "https://services.swpc.noaa.gov/json/f107_cm_flux.json";

    try {
        const response = await fetch(url);
        const data = await response.json();

        displayF107Flux(data);
    } catch (error) {
        console.error("Error fetching F10.7 Flux data:", error);
        document.querySelector('.information').innerHTML = "<p>Failed to load F10.7 Flux data.</p>";
    }
}

function displayF107Flux(data) {
    const infoPanel = document.querySelector('.information');
    infoPanel.innerHTML = ""; // Clear previous data

    if (!data || data.length === 0) {
        infoPanel.innerHTML = "<p>No F10.7 Flux data available at this time.</p>";
        return;
    }

    const fluxContainer = document.createElement('div');
    fluxContainer.classList.add('flux-data-container');

    fluxContainer.innerHTML = `
        <h3>F10.7 Flux Data</h3>
        <div class="flux-table-container">
            <table>
                <thead>
                    <tr>
                        <th>Time</th>
                        <th>Flux</th>
                    </tr>
                </thead>
                <tbody>
                    ${data.map(entry => `
                        <tr>
                            <td>${entry.time_tag}</td>
                            <td>${entry.flux}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;

    infoPanel.appendChild(fluxContainer);
}

// Fetch Enlil Time Series Data
async function fetchEnlilTimeSeries() {
    const url = "https://services.swpc.noaa.gov/json/enlil_time_series.json";

    try {
        const response = await fetch(url);
        const data = await response.json();

        console.log("Enlil Time Series API Response:", data); // Log the response

        if (!data || data.length === 0) {
            throw new Error("No data available.");
        }

        displayEnlilData(data);
    } catch (error) {
        console.error("Error fetching Enlil Time Series data:", error);
        document.querySelector('.historical-visualization').innerHTML = "<p>Failed to load Enlil time series data.</p>";
    }
}

// Display Enlil Time Series Data
function displayEnlilData(data) {
    const visualizationContainer = document.querySelector('.historical-visualization');
    if (!visualizationContainer) {
        console.error('Historical visualization container not found');
        return;
    }

    // Clear previous content
    visualizationContainer.innerHTML = "";

    // Create container
    const container = document.createElement('div');
    container.classList.add('enlil-visualization');

    // Add title
    const title = document.createElement('h3');
    title.textContent = 'Enlil Solar Wind Model Data';
    container.appendChild(title);

    // Extract relevant data (show first 10 entries for visualization)
    const timeSeries = data.slice(0, 10).map(entry => ({
        time: entry.time_tag,
        temperature: entry.temperature || "N/A", // Correct key for temperature
        earthParticles: entry.earth_particles_per_cm3 || "N/A" // Correct key for earth particles
    }));

    // Create Table
    const table = document.createElement('table');
    table.innerHTML = `
        <thead>
            <tr>
                <th>Time</th>
                <th>Temperature (K)</th>
                <th>Earth Particles (per cm³)</th>
            </tr>
        </thead>
        <tbody>
            ${timeSeries.map(entry => `
                <tr>
                    <td>${entry.time}</td>
                    <td>${entry.temperature}</td>
                    <td>${entry.earthParticles}</td>
                </tr>
            `).join('')}
        </tbody>
    `;

    // Append Table
    container.appendChild(table);
    visualizationContainer.appendChild(container);
}

// Auto-refresh every 5 minutes (300,000ms)
setInterval(fetchAlerts, 300000);
setInterval(fetchF107Flux, 300000);
setInterval(fetchEnlilTimeSeries, 300000);
