// public/js/map.js
const map = L.map('map').setView([45.81539, 15.96656], 15);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
}).addTo(map);

// Load parking spot data
fetch('../parking-spots.json')
    .then((response) => response.json())
    .then((data) => {
        data.forEach((spot) => {
            const marker = L.marker([spot.lat, spot.lng]);

            if (spot.status === 'free') {
                marker.setIcon(L.divIcon({ className: 'green-dot' }));
            } else {
                marker.setIcon(L.divIcon({ className: 'red-dot' }));
            }

            marker.addTo(map);
        });
    });
