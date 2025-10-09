// Fiktive Installateure-Daten
const installateure = [
    {
        id: 1,
        name: "Elektro Müller AG",
        contact: "Hans Müller",
        address: "Bahnhofstrasse 12",
        plz: "8001",
        city: "Zürich",
        kanton: "ZH",
        phone: "+41 44 123 45 67",
        email: "info@elektro-mueller.ch",
        website: "www.elektro-mueller.ch",
        certified: true,
        installations: 45,
        rating: 4.8,
        lat: 47.3769,
        lng: 8.5417,
        description: "Spezialisiert auf Photovoltaik und Batteriespeicher seit über 20 Jahren"
    },
    {
        id: 2,
        name: "Schneider Elektrotechnik",
        contact: "Peter Schneider",
        address: "Marktgasse 8",
        plz: "3011",
        city: "Bern",
        kanton: "BE",
        phone: "+41 31 987 65 43",
        email: "kontakt@schneider-elektro.ch",
        website: "www.schneider-elektro.ch",
        certified: true,
        installations: 32,
        rating: 4.9,
        lat: 46.9480,
        lng: 7.4474,
        description: "Ihr Partner für nachhaltige Energielösungen in der Region Bern"
    },
    {
        id: 3,
        name: "Weber Energiesysteme GmbH",
        contact: "Thomas Weber",
        address: "Industriestrasse 45",
        plz: "6003",
        city: "Luzern",
        kanton: "LU",
        phone: "+41 41 555 12 34",
        email: "info@weber-energie.ch",
        website: "www.weber-energie.ch",
        certified: true,
        installations: 28,
        rating: 4.7,
        lat: 47.0502,
        lng: 8.3093,
        description: "Komplettlösungen für Solarenergie und Batteriespeicher"
    },
    {
        id: 4,
        name: "Fischer Elektro Service",
        contact: "Martin Fischer",
        address: "Seestrasse 23",
        plz: "6440",
        city: "Brunnen",
        kanton: "SZ",
        phone: "+41 41 820 33 44",
        email: "info@fischer-elektro.ch",
        website: "www.fischer-elektro.ch",
        certified: true,
        installations: 52,
        rating: 5.0,
        lat: 47.0071,
        lng: 8.6067,
        description: "Direkt in der Nähe der modual Produktion - Ihr lokaler Experte"
    },
    {
        id: 5,
        name: "Gamma Elektroinstallationen",
        contact: "Andreas Gamma",
        address: "Hauptstrasse 67",
        plz: "5000",
        city: "Aarau",
        kanton: "AG",
        phone: "+41 62 834 56 78",
        email: "kontakt@gamma-elektro.ch",
        website: "www.gamma-elektro.ch",
        certified: true,
        installations: 38,
        rating: 4.6,
        lat: 47.3908,
        lng: 8.0426,
        description: "Zuverlässige Installation und Wartung von Batteriespeichern"
    },
    {
        id: 6,
        name: "Meier & Söhne Elektrotechnik",
        contact: "Robert Meier",
        address: "Rosengasse 15",
        plz: "9000",
        city: "St. Gallen",
        kanton: "SG",
        phone: "+41 71 222 33 44",
        email: "info@meier-soehne.ch",
        website: "www.meier-soehne.ch",
        certified: true,
        installations: 41,
        rating: 4.8,
        lat: 47.4239,
        lng: 9.3748,
        description: "Familienunternehmen mit über 30 Jahren Erfahrung"
    },
    {
        id: 7,
        name: "Steiner Solar Solutions",
        contact: "Urs Steiner",
        address: "Avenue de la Gare 88",
        plz: "1003",
        city: "Lausanne",
        kanton: "VD",
        phone: "+41 21 311 22 33",
        email: "info@steiner-solar.ch",
        website: "www.steiner-solar.ch",
        certified: true,
        installations: 35,
        rating: 4.9,
        lat: 46.5197,
        lng: 6.6323,
        description: "Solutions complètes pour l'énergie solaire et le stockage"
    },
    {
        id: 8,
        name: "Dupont Électricité SA",
        contact: "Jean Dupont",
        address: "Rue du Rhône 45",
        plz: "1204",
        city: "Genève",
        kanton: "GE",
        phone: "+41 22 789 45 67",
        email: "contact@dupont-electric.ch",
        website: "www.dupont-electric.ch",
        certified: true,
        installations: 29,
        rating: 4.7,
        lat: 46.2044,
        lng: 6.1432,
        description: "Votre partenaire pour les solutions énergétiques durables"
    },
    {
        id: 9,
        name: "Huber Elektrotechnik",
        contact: "Franz Huber",
        address: "Dorfstrasse 34",
        plz: "8400",
        city: "Winterthur",
        kanton: "ZH",
        phone: "+41 52 212 34 56",
        email: "info@huber-elektro.ch",
        website: "www.huber-elektro.ch",
        certified: true,
        installations: 26,
        rating: 4.8,
        lat: 47.4996,
        lng: 8.7242,
        description: "Innovative Energielösungen für Privat und Gewerbe"
    },
    {
        id: 10,
        name: "Keller Energie & Technik",
        contact: "Stefan Keller",
        address: "Alte Landstrasse 56",
        plz: "8802",
        city: "Kilchberg",
        kanton: "ZH",
        phone: "+41 44 715 88 99",
        email: "info@keller-energie.ch",
        website: "www.keller-energie.ch",
        certified: true,
        installations: 33,
        rating: 4.9,
        lat: 47.3217,
        lng: 8.5450,
        description: "Premium-Installation für anspruchsvolle Kunden"
    },
    {
        id: 11,
        name: "Zimmermann Solar AG",
        contact: "Daniel Zimmermann",
        address: "Bernstrasse 102",
        plz: "3072",
        city: "Ostermundigen",
        kanton: "BE",
        phone: "+41 31 931 44 55",
        email: "info@zimmermann-solar.ch",
        website: "www.zimmermann-solar.ch",
        certified: true,
        installations: 30,
        rating: 4.6,
        lat: 46.9559,
        lng: 7.4889,
        description: "Ihr Spezialist für Solaranlagen und Speichersysteme"
    },
    {
        id: 12,
        name: "Baumgartner Elektro",
        contact: "Michael Baumgartner",
        address: "Zürcherstrasse 78",
        plz: "5400",
        city: "Baden",
        kanton: "AG",
        phone: "+41 56 203 77 88",
        email: "kontakt@baumgartner-elektro.ch",
        website: "www.baumgartner-elektro.ch",
        certified: true,
        installations: 27,
        rating: 4.7,
        lat: 47.4730,
        lng: 8.3061,
        description: "Kompetenz und Service aus einer Hand"
    },
    {
        id: 13,
        name: "Gross Energietechnik GmbH",
        contact: "Beat Gross",
        address: "Werkstrasse 12",
        plz: "6330",
        city: "Cham",
        kanton: "ZG",
        phone: "+41 41 780 66 77",
        email: "info@gross-energie.ch",
        website: "www.gross-energie.ch",
        certified: true,
        installations: 24,
        rating: 4.8,
        lat: 47.1825,
        lng: 8.4625,
        description: "Moderne Energielösungen für die Zentralschweiz"
    },
    {
        id: 14,
        name: "Lehmann Elektroservice",
        contact: "Christian Lehmann",
        address: "Lindenweg 89",
        plz: "8212",
        city: "Neuhausen",
        kanton: "SH",
        phone: "+41 52 672 33 44",
        email: "info@lehmann-elektro.ch",
        website: "www.lehmann-elektro.ch",
        certified: true,
        installations: 21,
        rating: 4.9,
        lat: 47.6866,
        lng: 8.6128,
        description: "Persönlicher Service und höchste Qualität"
    },
    {
        id: 15,
        name: "Baumann Solartechnik",
        contact: "Simon Baumann",
        address: "Brunnengasse 23",
        plz: "4500",
        city: "Solothurn",
        kanton: "SO",
        phone: "+41 32 621 55 66",
        email: "info@baumann-solar.ch",
        website: "www.baumann-solar.ch",
        certified: true,
        installations: 19,
        rating: 4.7,
        lat: 47.2080,
        lng: 7.5378,
        description: "Nachhaltige Energielösungen für Ihr Zuhause"
    },
    {
        id: 16,
        name: "Vogel Elektrotechnik AG",
        contact: "Marco Vogel",
        address: "Seetalstrasse 45",
        plz: "6020",
        city: "Emmenbrücke",
        kanton: "LU",
        phone: "+41 41 280 99 00",
        email: "info@vogel-elektro.ch",
        website: "www.vogel-elektro.ch",
        certified: true,
        installations: 36,
        rating: 4.8,
        lat: 47.0774,
        lng: 8.2667,
        description: "Kompetenter Partner für Ihre Energiezukunft"
    },
    {
        id: 17,
        name: "Roth Energie AG",
        contact: "Felix Roth",
        address: "Feldstrasse 67",
        plz: "9500",
        city: "Wil",
        kanton: "SG",
        phone: "+41 71 913 22 33",
        email: "info@roth-energie.ch",
        website: "www.roth-energie.ch",
        certified: true,
        installations: 23,
        rating: 4.6,
        lat: 47.4622,
        lng: 9.0458,
        description: "Ihr regionaler Partner für Photovoltaik und Speicher"
    },
    {
        id: 18,
        name: "Frei Elektroinstallationen",
        contact: "Walter Frei",
        address: "Industrieweg 34",
        plz: "8590",
        city: "Romanshorn",
        kanton: "TG",
        phone: "+41 71 463 77 88",
        email: "info@frei-elektro.ch",
        website: "www.frei-elektro.ch",
        certified: true,
        installations: 18,
        rating: 4.9,
        lat: 47.5661,
        lng: 9.3783,
        description: "Qualität und Zuverlässigkeit am Bodensee"
    },
    {
        id: 19,
        name: "Suter Solar Solutions",
        contact: "René Suter",
        address: "Gartenstrasse 12",
        plz: "4600",
        city: "Olten",
        kanton: "SO",
        phone: "+41 62 212 44 55",
        email: "info@suter-solar.ch",
        website: "www.suter-solar.ch",
        certified: true,
        installations: 25,
        rating: 4.8,
        lat: 47.3498,
        lng: 7.9046,
        description: "Innovative Solartechnik für jedes Dach"
    },
    {
        id: 20,
        name: "Graf Energiesysteme",
        contact: "Markus Graf",
        address: "Talstrasse 89",
        plz: "6210",
        city: "Sursee",
        kanton: "LU",
        phone: "+41 41 921 66 77",
        email: "info@graf-energie.ch",
        website: "www.graf-energie.ch",
        certified: true,
        installations: 22,
        rating: 4.7,
        lat: 47.1708,
        lng: 8.1089,
        description: "Erfahrung trifft Innovation"
    },
    {
        id: 21,
        name: "Herzog Elektrotechnik",
        contact: "Patrick Herzog",
        address: "Rheinstrasse 56",
        plz: "4410",
        city: "Liestal",
        kanton: "BL",
        phone: "+41 61 921 33 44",
        email: "info@herzog-elektro.ch",
        website: "www.herzog-elektro.ch",
        certified: true,
        installations: 20,
        rating: 4.9,
        lat: 47.4833,
        lng: 7.7333,
        description: "Ihr Experte für moderne Energietechnik"
    },
    {
        id: 22,
        name: "Wyss Solartechnik GmbH",
        contact: "Bruno Wyss",
        address: "Bergstrasse 78",
        plz: "3600",
        city: "Thun",
        kanton: "BE",
        phone: "+41 33 222 88 99",
        email: "info@wyss-solar.ch",
        website: "www.wyss-solar.ch",
        certified: true,
        installations: 31,
        rating: 4.8,
        lat: 46.7578,
        lng: 7.6283,
        description: "Solarenergie vom Thuner See"
    },
    {
        id: 23,
        name: "Moser Energie AG",
        contact: "André Moser",
        address: "Schulhausstrasse 45",
        plz: "5610",
        city: "Wohlen",
        kanton: "AG",
        phone: "+41 56 610 55 66",
        email: "info@moser-energie.ch",
        website: "www.moser-energie.ch",
        certified: true,
        installations: 17,
        rating: 4.6,
        lat: 47.3508,
        lng: 8.2831,
        description: "Nachhaltige Energielösungen im Freiamt"
    },
    {
        id: 24,
        name: "Brunner Elektroservice",
        contact: "Lukas Brunner",
        address: "Dorfplatz 8",
        plz: "6430",
        city: "Schwyz",
        kanton: "SZ",
        phone: "+41 41 811 77 88",
        email: "info@brunner-elektro.ch",
        website: "www.brunner-elektro.ch",
        certified: true,
        installations: 34,
        rating: 5.0,
        lat: 47.0208,
        lng: 8.6539,
        description: "Tradition und Innovation vereint"
    },
    {
        id: 25,
        name: "Blitz Elektro GmbH",
        contact: "Kevin Berger",
        address: "Industrieplatz 45",
        plz: "8050",
        city: "Zürich",
        kanton: "ZH",
        phone: "+41 44 305 44 55",
        email: "info@blitz-elektro.ch",
        website: "www.blitz-elektro.ch",
        certified: false,
        installations: 8,
        rating: 4.2,
        lat: 47.4106,
        lng: 8.5422,
        description: "Junges Unternehmen mit Fokus auf moderne Technologien"
    },
    {
        id: 26,
        name: "Solar-Tech Zentralschweiz",
        contact: "Sandra Amstutz",
        address: "Bahnhofplatz 17",
        plz: "6003",
        city: "Luzern",
        kanton: "LU",
        phone: "+41 41 240 88 99",
        email: "kontakt@solartech-lu.ch",
        website: "www.solartech-lu.ch",
        certified: false,
        installations: 5,
        rating: 4.5,
        lat: 47.0502,
        lng: 8.3093,
        description: "Spezialisiert auf Photovoltaik-Komplettlösungen"
    },
    {
        id: 27,
        name: "Elektro Hofmann",
        contact: "Thomas Hofmann",
        address: "Kreuzstrasse 89",
        plz: "3000",
        city: "Bern",
        kanton: "BE",
        phone: "+41 31 350 22 33",
        email: "info@hofmann-elektro.ch",
        website: "www.hofmann-elektro.ch",
        certified: false,
        installations: 3,
        rating: 4.3,
        lat: 46.9480,
        lng: 7.4474,
        description: "Kleiner Betrieb mit persönlicher Betreuung"
    }
];

// Globale Variablen
let map;
let markers = [];
let filteredInstallateure = [...installateure];
let radiusCircle = null;

// Schweizer PLZ zu Koordinaten Mapping (vereinfacht)
const plzToCoords = {
    '8001': [47.3769, 8.5417], '8002': [47.3664, 8.5408], '8003': [47.3588, 8.5338],
    '8004': [47.3775, 8.5194], '8005': [47.3890, 8.5250], '8006': [47.3951, 8.5456],
    '8050': [47.4106, 8.5422], '8400': [47.4996, 8.7242], '8802': [47.3217, 8.5450],
    '3000': [46.9480, 7.4474], '3011': [46.9480, 7.4474], '3072': [46.9559, 7.4889],
    '3600': [46.7578, 7.6283],
    '6003': [47.0502, 8.3093], '6020': [47.0774, 8.2667], '6210': [47.1708, 8.1089],
    '6330': [47.1825, 8.4625], '6430': [47.0208, 8.6539], '6440': [47.0071, 8.6067],
    '5000': [47.3908, 8.0426], '5400': [47.4730, 8.3061], '5610': [47.3508, 8.2831],
    '9000': [47.4239, 9.3748], '9500': [47.4622, 9.0458], '8590': [47.5661, 9.3783],
    '1003': [46.5197, 6.6323], '1204': [46.2044, 6.1432],
    '4500': [47.2080, 7.5378], '4600': [47.3498, 7.9046], '4410': [47.4833, 7.7333],
    '8212': [47.6866, 8.6128]
};

// Map initialisieren
function initMap() {
    // Karte auf Schweiz zentrieren
    map = L.map('map').setView([46.8182, 8.2275], 8);

    // OpenStreetMap Tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19
    }).addTo(map);

    // Alle Marker hinzufügen
    updateMarkers(installateure);
}

// Marker aktualisieren
function updateMarkers(data) {
    // Alte Marker entfernen
    markers.forEach(marker => map.removeLayer(marker));
    markers = [];

    // Neue Marker hinzufügen
    data.forEach(installer => {
        const marker = L.marker([installer.lat, installer.lng], {
            icon: L.divIcon({
                className: 'custom-marker',
                html: `<div class="marker-pin"><i data-feather="zap"></i></div>`,
                iconSize: [30, 42],
                iconAnchor: [15, 42],
                popupAnchor: [0, -42]
            })
        });

        const popupContent = `
            <div class="marker-popup">
                <h4>${installer.name}</h4>
                <p><strong>${installer.contact}</strong></p>
                <p>${installer.address}<br>${installer.plz} ${installer.city}</p>
                <p><i data-feather="phone" style="width: 14px; height: 14px;"></i> ${installer.phone}</p>
                <a href="mailto:${installer.email}" class="popup-link">Kontakt aufnehmen</a>
            </div>
        `;

        marker.bindPopup(popupContent);
        marker.addTo(map);
        markers.push(marker);

        // Click Event für Marker
        marker.on('click', function() {
            // Scroll zu entsprechender Card
            const card = document.querySelector(`[data-installer-id="${installer.id}"]`);
            if (card) {
                card.scrollIntoView({ behavior: 'smooth', block: 'center' });
                card.classList.add('highlight');
                setTimeout(() => card.classList.remove('highlight'), 2000);
            }
        });
    });

    // Feather Icons in Popups aktualisieren
    setTimeout(() => feather.replace(), 100);
}

// Installateure Liste rendern
function renderInstallateure(data) {
    const listContainer = document.getElementById('installateursList');
    const noResults = document.getElementById('noResults');

    if (data.length === 0) {
        listContainer.innerHTML = '';
        noResults.style.display = 'block';
        return;
    }

    noResults.style.display = 'none';

    listContainer.innerHTML = data.map(installer => `
        <div class="installer-card" data-installer-id="${installer.id}">
            <div class="installer-header">
                <div class="installer-title">
                    <h3>${installer.name}</h3>
                    ${installer.certified 
                        ? '<span class="certified-badge"><i data-feather="check-circle"></i> Zertifiziert</span>' 
                        : '<span class="uncertified-badge"><i data-feather="info"></i> Nicht zertifiziert</span>'}
                </div>
                <div class="installer-rating">
                    <span class="rating-stars">★★★★★</span>
                    <span class="rating-value">${installer.rating}</span>
                </div>
            </div>
            
            <div class="installer-contact-person">
                <i data-feather="user"></i>
                <span>${installer.contact}</span>
            </div>

            <div class="installer-info">
                <div class="info-item">
                    <i data-feather="map-pin"></i>
                    <span>${installer.address}, ${installer.plz} ${installer.city}</span>
                </div>
                <div class="info-item">
                    <i data-feather="phone"></i>
                    <a href="tel:${installer.phone.replace(/\s/g, '')}">${installer.phone}</a>
                </div>
                <div class="info-item">
                    <i data-feather="mail"></i>
                    <a href="mailto:${installer.email}">${installer.email}</a>
                </div>
                <div class="info-item">
                    <i data-feather="globe"></i>
                    <a href="https://${installer.website}" target="_blank">${installer.website}</a>
                </div>
            </div>

            <p class="installer-description">${installer.description}</p>

            <div class="installer-stats">
                <div class="stat">
                    <div class="stat-value">${installer.installations}</div>
                    <div class="stat-label">Installationen</div>
                </div>
                <div class="stat">
                    <div class="stat-value">${installer.kanton}</div>
                    <div class="stat-label">Kanton</div>
                </div>
            </div>

            <div class="installer-actions">
                <a href="mailto:${installer.email}" class="btn btn-primary btn-small">
                    <i data-feather="mail"></i>
                    Kontakt aufnehmen
                </a>
                <button class="btn btn-secondary btn-small" onclick="showOnMap(${installer.lat}, ${installer.lng}, ${installer.id})">
                    <i data-feather="map-pin"></i>
                    Auf Karte zeigen
                </button>
            </div>
        </div>
    `).join('');

    feather.replace();
}

// Auf Karte zeigen
function showOnMap(lat, lng, installerId) {
    map.setView([lat, lng], 13);
    
    // Entsprechenden Marker finden und Popup öffnen
    const marker = markers.find(m => {
        const pos = m.getLatLng();
        return pos.lat === lat && pos.lng === lng;
    });
    
    if (marker) {
        marker.openPopup();
    }

    // Smooth scroll zur Karte
    document.querySelector('.map-container').scrollIntoView({ behavior: 'smooth' });
}

// Distanz zwischen zwei Koordinaten berechnen (Haversine-Formel)
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Erdradius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c; // Distanz in km
}

// Filter anwenden
function applyFilters() {
    const plzFilter = document.getElementById('plzFilter').value.trim();
    const searchFilter = document.getElementById('searchFilter').value.toLowerCase();
    const certifiedOnly = document.getElementById('certifiedOnly').checked;

    let plzCoords = null;
    const radius = 30; // 30 km Umkreis

    // PLZ-Koordinaten finden
    if (plzFilter && plzToCoords[plzFilter]) {
        plzCoords = plzToCoords[plzFilter];
        
        // Karte auf PLZ zoomen
        map.setView(plzCoords, 10);
        
        // Radius-Kreis anzeigen
        if (radiusCircle) {
            map.removeLayer(radiusCircle);
        }
        radiusCircle = L.circle(plzCoords, {
            color: '#2E5EFC',
            fillColor: '#2E5EFC',
            fillOpacity: 0.1,
            radius: radius * 1000 // in Meter
        }).addTo(map);
    } else if (radiusCircle) {
        // Kreis entfernen wenn keine PLZ
        map.removeLayer(radiusCircle);
        radiusCircle = null;
        map.setView([46.8182, 8.2275], 8);
    }

    filteredInstallateure = installateure.filter(installer => {
        // PLZ-Umkreis Filter
        let matchesPlz = true;
        if (plzCoords) {
            const distance = calculateDistance(
                plzCoords[0], plzCoords[1],
                installer.lat, installer.lng
            );
            matchesPlz = distance <= radius;
        }

        // Such-Filter
        const matchesSearch = !searchFilter || 
            installer.name.toLowerCase().includes(searchFilter) ||
            installer.city.toLowerCase().includes(searchFilter) ||
            installer.contact.toLowerCase().includes(searchFilter);
        
        // Zertifizierungs-Filter
        const matchesCertified = !certifiedOnly || installer.certified;

        return matchesPlz && matchesSearch && matchesCertified;
    });

    renderInstallateure(filteredInstallateure);
    updateMarkers(filteredInstallateure);
    updateStats();
}

// Stats aktualisieren
function updateStats() {
    document.getElementById('totalInstallers').textContent = filteredInstallateure.length;
}

// Filter zurücksetzen
function resetFilters() {
    document.getElementById('plzFilter').value = '';
    document.getElementById('searchFilter').value = '';
    document.getElementById('certifiedOnly').checked = false;
    
    // Kreis entfernen
    if (radiusCircle) {
        map.removeLayer(radiusCircle);
        radiusCircle = null;
    }
    
    // Karte zurücksetzen
    map.setView([46.8182, 8.2275], 8);
    
    applyFilters();
}

// Map Toggle
function toggleMapSize() {
    const mapContainer = document.querySelector('.map-container');
    const toggleBtn = document.getElementById('mapToggle');
    
    mapContainer.classList.toggle('map-expanded');
    
    if (mapContainer.classList.contains('map-expanded')) {
        toggleBtn.innerHTML = '<i data-feather="minimize-2"></i> Karte verkleinern';
    } else {
        toggleBtn.innerHTML = '<i data-feather="maximize-2"></i> Karte vergrössern';
    }
    
    feather.replace();
    
    // Map neu rendern nach Grössenänderung
    setTimeout(() => {
        map.invalidateSize();
    }, 300);
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    initMap();
    renderInstallateure(installateure);
    
    // Filter Events
    document.getElementById('plzFilter').addEventListener('input', applyFilters);
    document.getElementById('searchFilter').addEventListener('input', applyFilters);
    document.getElementById('certifiedOnly').addEventListener('change', applyFilters);
    document.getElementById('resetFilters').addEventListener('click', resetFilters);
    document.getElementById('mapToggle').addEventListener('click', toggleMapSize);

    // Mobile Menu
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }

    // Mega Menu Handling
    const megamenuTriggers = document.querySelectorAll('.megamenu-trigger');
    const megamenuOverlay = document.querySelector('.megamenu-overlay');
    
    megamenuTriggers.forEach(trigger => {
        const parentLi = trigger.parentElement;
        const megamenu = parentLi.querySelector('.megamenu');
        
        trigger.addEventListener('mouseenter', () => {
            parentLi.classList.add('active');
            megamenuOverlay.classList.add('active');
        });
        
        parentLi.addEventListener('mouseleave', () => {
            parentLi.classList.remove('active');
            megamenuOverlay.classList.remove('active');
        });
    });
    
    megamenuOverlay.addEventListener('click', () => {
        document.querySelectorAll('.has-megamenu.active').forEach(item => {
            item.classList.remove('active');
        });
        megamenuOverlay.classList.remove('active');
    });

    // Partner Form Handling
    const partnerForm = document.getElementById('partnerForm');
    if (partnerForm) {
        partnerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Formular-Daten sammeln
            const formData = new FormData(partnerForm);
            const data = Object.fromEntries(formData);
            
            console.log('Partner-Bewerbung:', data);
            
            // Hier würde normalerweise eine API-Anfrage erfolgen
            alert('Vielen Dank für Ihre Bewerbung! Wir werden uns in Kürze bei Ihnen melden.');
            
            // Formular zurücksetzen
            partnerForm.reset();
        });
    }
});
