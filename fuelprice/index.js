class RmaGasStationRenderer {
  #districtId;
  #stationContainerId;
  #dieselMap;
  #superMap;

  constructor(districtId, containerId) {
    this.#districtId = districtId || document.getElementById('districts').value;
    this.#stationContainerId = containerId;

    document.getElementById(containerId).innerHTML = `
            <h2>DIESEL</h2>
        	<div id="die-container">
				<div id="skeletonContainer">
					<p class="skeleton skeleton-text dark small"></p>
					<p class="skeleton skeleton-text"></p>
					<p class="skeleton skeleton-text small"></p>
				</div>
			</div>
        	<div id="die-map" style="height: 400px; width:100%;"></div>

            <h2>SUPER</h2>
        	<div id="sup-container"></div>
        	<div id="sup-map" style="height: 400px; width:100%;"></div>`;

    const skeletonTemplate = document.getElementById('skeletonContainer');
    const dieselCont = document.getElementById('die-container');
    for (let i = 0; i < 8; i++) {
      dieselCont.append(skeletonTemplate.cloneNode(true));
    }
    const superCont = document.getElementById('sup-container');
    for (let i = 0; i < 9; i++) {
      superCont.append(skeletonTemplate.cloneNode(true));
    }

    this.#dieselMap = L.map('die-map').setView([47.505, 11], 13);
    this.#superMap = L.map('sup-map').setView([47.505, 11], 13);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution:
        '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(this.#dieselMap);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution:
        '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(this.#superMap);
  }

  renderGasStations() {
    this.#getGasStation(this.#districtId, 'DIE', this.#renderDiesel);
    this.#getGasStation(this.#districtId, 'SUP', this.#renderSuper);
  }

  update(districtId) {
    this.#districtId = districtId;
    this.renderGasStations();
  }

  #renderDiesel(stations, instance) {
    instance.#renderToHtml(stations, 'die-container', instance.#dieselMap);
  }

  #renderSuper(stations, instance) {
    instance.#renderToHtml(stations, 'sup-container', instance.#superMap);
  }

  #getGasStation(regionCode, fuelType, cb) {
    var xhr = new XMLHttpRequest();
    const outer = this;
    xhr.withCredentials = false;

    xhr.addEventListener('readystatechange', function () {
      if (this.readyState === 4) {
        cb(outer.#formatGasStations(this.responseText), outer);
      }
    });

    xhr.open(
      'GET',
      `https://api.e-control.at/sprit/1.0/search/gas-stations/by-region?code=${regionCode}&type=PB&fuelType=${fuelType}&includeClosed=false`
    );

    xhr.send();
  }

  #formatGasStations(responseText) {
    let gasStationAsJson = JSON.parse(responseText);
    let stationObjects = [];
    gasStationAsJson.forEach((station) => {
      const { name, location, prices } = station;
      var geojsonFeature = {
        type: 'Feature',
        properties: {
          name: name,
          location: location,
          prices: prices,
        },
        geometry: {
          type: 'Point',
          coordinates: [location.longitude, location.latitude],
        },
      };
      stationObjects.push(geojsonFeature);
    });
    return stationObjects;
  }

  #renderToHtml(stations, contentContainer, mapContainer) {
    let counter = 1;
    let html = '';
    stations.forEach((station) => {
      html += `<p>
					<b>${counter}. ${station.properties.name}</b>
					<br>
					${station.properties.location.address}, ${station.properties.location.postalCode} ${station.properties.location.city}
					<br>
					${station.properties.prices[0].label} €${station.properties.prices[0].amount}
				</p>`;
      counter++;
    });
    var element = (document.getElementById(contentContainer).innerHTML = html);

    let result = L.geoJSON(stations, {
      onEachFeature: this.#onEachFeature,
    }).addTo(mapContainer);
    mapContainer.fitBounds(result.getBounds());
  }

  #onEachFeature(feature, layer) {
    // does this feature have a property named popupContent?
    if (feature.properties && feature.properties.name) {
      const content = `${feature.properties.name}<br>${feature.properties.prices[0].amount}€`;
      layer.bindPopup(content);
    }
  }
}
