// js/map.js
// Inicializa mapa Leaflet e busca cafeterias via Overpass API

if (typeof L === 'undefined') {
    console.error('Leaflet não foi carregado. Verifique se o arquivo Leaflet.js foi baixado corretamente ou se o CDN está acessível.');
    document.addEventListener('DOMContentLoaded', () => {
        const el = document.getElementById('map');
        if (el) {
            el.innerHTML = '<p style="text-align:center;color:#666;padding:2rem">Erro: Leaflet não carregou. Verifique a consola do navegador (F12) e a ligação ao CDN.</p>';
        }
    });
} else {
    const map = L.map('map', { zoomControl: true }).setView([0, 0], 2);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    const userLayer = L.layerGroup().addTo(map);
    const cafesLayer = L.layerGroup().addTo(map);

    function setUserMarker(lat, lon) {
        userLayer.clearLayers();
        const userIcon = L.circleMarker([lat, lon], { radius: 8, color: '#ff6600', fillColor: '#ff6600', fillOpacity: 0.9 }).addTo(userLayer);
        userIcon.bindPopup('Você está aqui').openPopup();
    }

    function buildOverpassQuery(lat, lon, radius) {
        // Busca por amenity=cafe e também por lojas relacionadas a café para aumentar cobertura
        return `[out:json][timeout:25];(
  node["amenity"="cafe"](around:${radius},${lat},${lon});
  way["amenity"="cafe"](around:${radius},${lat},${lon});
  relation["amenity"="cafe"](around:${radius},${lat},${lon});
  node["shop"="coffee_shop"](around:${radius},${lat},${lon});
  way["shop"="coffee_shop"](around:${radius},${lat},${lon});
  node["shop"="cafe"](around:${radius},${lat},${lon});
  way["shop"="cafe"](around:${radius},${lat},${lon});
);
out center;`;
    }

    function fetchCafes(lat, lon, radius) {
        cafesLayer.clearLayers();
        const q = buildOverpassQuery(lat, lon, radius);
        console.log('Overpass query:', q);

        const btn = document.getElementById('findBtn');
        if (btn) {
            btn.disabled = true;
            const oldText = btn.innerText;
            btn.dataset._oldText = oldText;
            btn.innerText = 'Buscando...';
        }

        return fetch('https://overpass-api.de/api/interpreter', {
            method: 'POST',
            body: q,
            headers: { 'Content-Type': 'text/plain; charset=UTF-8' }
        })
        .then(res => {
            if (!res.ok) throw new Error('Resposta Overpass não OK: ' + res.status);
            return res.json();
        })
        .then(data => {
            console.log('Overpass resposta elements:', data.elements ? data.elements.length : 0);
            if (!data.elements || data.elements.length === 0) {
                alert('Nenhuma cafeteria encontrada no raio selecionado. Tente aumentar o raio.');
                return;
            }

            data.elements.forEach(el => {
                let latEl = el.lat, lonEl = el.lon;
                if (!latEl && el.center) {
                    latEl = el.center.lat;
                    lonEl = el.center.lon;
                }
                if (!latEl) return;

                const name = (el.tags && (el.tags.name || el.tags['brand'])) || 'Cafeteria sem nome';
                const street = el.tags && (el.tags['addr:street'] || el.tags['addr:housenumber'] ? `${el.tags['addr:street'] || ''} ${el.tags['addr:housenumber'] || ''}`.trim() : null);
                const popup = `<strong>${name}</strong>${street ? `<br>${street}` : ''}`;

                L.marker([latEl, lonEl]).addTo(cafesLayer).bindPopup(popup);
            });

            // Ajusta bounds para mostrar usuário e cafeterias
            const group = L.featureGroup([userLayer, cafesLayer]);
            try {
                map.fitBounds(group.getBounds().pad(0.2));
                setTimeout(() => { try { map.invalidateSize(); } catch(e){} }, 200);
            } catch (e) {
                // fallback: apenas centraliza no usuário
            }
        })
        .catch(err => {
            console.error(err);
            alert('Erro ao buscar cafeterias. Veja o console para detalhes.');
        })
        .finally(() => {
            if (btn) {
                btn.disabled = false;
                if (btn.dataset._oldText) btn.innerText = btn.dataset._oldText;
            }
        });
    }

    function locateAndFind(radius) {
        if (!navigator.geolocation) {
            alert('Geolocalização não suportada pelo navegador.');
            return;
        }

        navigator.geolocation.getCurrentPosition((pos) => {
            const lat = pos.coords.latitude;
            const lon = pos.coords.longitude;
            setUserMarker(lat, lon);
            map.setView([lat, lon], 15);
            setTimeout(() => { try { map.invalidateSize(); } catch(e){} }, 200);
            fetchCafes(lat, lon, radius);
        }, (err) => {
            console.error(err);
            alert('Não foi possível obter sua localização. Verifique permissões ou tente novamente.');
        }, { enableHighAccuracy: true, timeout: 10000 });
    }

    document.addEventListener('DOMContentLoaded', () => {
        const btn = document.getElementById('findBtn');
        const radiusSelect = document.getElementById('radius');

        if (btn) {
            btn.addEventListener('click', () => {
                const r = parseFloat(radiusSelect.value) || 1;
                locateAndFind(r * 1000); // Converte km em metros
            });
        }

        // Tenta localizar automaticamente ao carregar
        setTimeout(() => {
            try { locateAndFind((parseFloat(radiusSelect.value) || 1) * 1000); } catch(e) {}
            try { map.invalidateSize(); } catch(e) {}
        }, 800);
    });
}
