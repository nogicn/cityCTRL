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
            let type = spot.type;
            switch (type) {
                case 1:
                    type = 'regular';
                    break;
                case 2:
                    type = 'handicap';
                    break;
                case 3:
                    type = 'electric';
                    break;
                default:
                    type = 'regular';
                    break;
            }

            const marker = L.marker([spot.lat, spot.lng]);

            if (spot.status === 'free') {
                marker.setIcon(L.divIcon({
                    className: 'green-dot',
                    html: `<div class="marker-type"><b>${type}</b></div>`,
                }));
            } else {
                marker.setIcon(L.divIcon({
                    className: 'red-dot',
                    html: `<div class="marker-type"><b>${type}</b></div>`,
                }));
            }

            marker.addTo(map);
        });
    });
