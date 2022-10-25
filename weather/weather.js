class RmaWeather {
  constructor() {}

  getWeather(lat, lon, weatherContainerId, zamgStationId) {
    this.#loadZamg(lat, lon, weatherContainerId, zamgStationId);
  }

  #loadOpenWeather(lat, lon, weatherContainerId, zamgWeather) {
    var xhr = new XMLHttpRequest();
    const outer = this;
    xhr.withCredentials = false;

    xhr.addEventListener('readystatechange', function () {
      if (this.readyState === 4) {
        const weather = JSON.parse(this.responseText);

        const currentWeather = weather.current;
        for (let i = 0; i < 4; i++) {
          let id = `${weatherContainerId}h${i}`;
          outer.#renderWeather(
            weather.hourly[i],
            currentWeather,
            zamgWeather,
            id,
            weatherContainerId,
            outer
          );
          id = `${weatherContainerId}d${i}`;
          outer.#renderWeather(
            weather.daily[i],
            currentWeather,
            zamgWeather,
            id,
            weatherContainerId,
            outer
          );
        }
      }
    });

    xhr.open(
      'GET',
      `https://api.openweathermap.org/data/2.5/onecall?appid=dd314069aa57a3c5af640811ed59eca9&lat=${lat}&lon=${lon}&lang=de&units=metric`
    );

    xhr.send();
  }

  #loadZamg(lat, lon, weatherContainerId, zamgStationId) {
    const outer = this;
    /*var xhr = new XMLHttpRequest();
  xhr.withCredentials = true;
  
  xhr.addEventListener("readystatechange", function() {
    if(this.readyState === 4) {
            const weather = JSON.parse(this.responseText)
      outer.#loadOpenWeather(lat, lon, weatherContainerId, weather);
    }
  });
  
  xhr.open("GET", "https://dataset.api.hub.zamg.ac.at/v1/station/historical/klima-v1-10min?parameters=TL,RR,RRM&start=2020-12-24T08:00&end=2020-12-24T09:00&station_ids=5904");
  xhr.setRequestHeader('accept', 'application/json')
  xhr.setRequestHeader('Access-Control-Allow-Origin','*')
  xhr.setRequestHeader('Accept-encoding', 'gzip, deflate, br')
  xhr.setRequestHeader('accept-language', 'de-AT,de;q=0.9,en;q=0.8,en-US;q=0.7')
  
  xhr.send(); */
    outer.#loadOpenWeather(lat, lon, weatherContainerId, null);
  }

  fetchWeather(
    lat,
    lon,
    weatherContainerId,
    refContainerId,
    weatherParsePath
  ) {}

  #renderWeather(
    weather,
    currentWeather,
    zamgWeather,
    weatherContainerId,
    city,
    outer
  ) {
    const sunriseDate = weather.sunrise
      ? new Date(weather.sunrise * 1000)
      : new Date(currentWeather.sunrise * 1000);
    const sunsetDate = weather.sunset
      ? new Date(weather.sunset * 1000)
      : new Date(currentWeather.sunset * 1000);
    //const zamgData = zamgWeather.features[0].properties.parameters
    const html = `<div class="left-weather">
              <h1>${city}</h1>
              <p> ${outer.#getTime(weather)}</p>
              <div class="weather-today">
                  <div>
                      <img class="weather-icon" src="http://openweathermap.org/img/wn/${
                        weather.weather[0].icon
                      }.png"></img>
                  </div>
                  <div class="">
                      <span class="current-weather__degrees">
                          <strong> ${outer.#parseTemp(weather)} </strong>
                          °C
                      </span>
                      <br>
                      ${
                        weather.weather[0].description
                      }<br>gefühlte Temperatur: ${outer.#parseFeelsLike(
      weather
    )}°C
                  </div>
              </div>
          </div>
          <div class="weather-detail">
              <div class="current-weather__sunrise text--center">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="50" height="50" class="injected-svg svg--weather_sunrise" xmlns:xlink="http://www.w3.org/1999/xlink" role="img" data-src="//assets.kleinezeitung.at/assets/icons/sprite.svg#weather_sunrise">
                      <path class="sun" d="M271.7 30.8a21.5 21.5 0 10-43 0v47.8a21.5 21.5 0 1043 0V30.8zM103.8 82.4a21.5 21.5 0 10-30.4 30.5l33.8 33.8a21.5 21.5 0 1030.5-30.4l-33.9-33.9zM21.5 237.6a21.5 21.5 0 100 43h47.8a21.5 21.5 0 100-43H21.5zm457 43.4a21.6 21.6 0 000-43.1h-47.8a21.5 21.5 0 100 43l47.8.1zm-51.6-167.9a21.5 21.5 0 10-30.4-30.4l-33.8 33.8a21.5 21.5 0 1030.4 30.4l33.8-33.8z" role="presentation"></path>
                      <path class="sun" d="M478.5 354.8c11.9 0 21.5-9.6 21.5-21.5s-9.7-21.6-21.6-21.6l-104.7-.1a133.8 133.8 0 10-246.8 0l-105.2.1a21.6 21.6 0 00.1 43.1h456.7zM250.2 168.6a91.1 91.1 0 0175 142.9H175.3a91.1 91.1 0 0174.9-142.9z" role="presentation"></path>
                      <path class="arrow" d="M208.1 462.3h29.8v30.4c0 4.1 3.3 7.4 7.4 7.4h9.5c4.1 0 7.4-3.3 7.4-7.4v-30.4H292a7.4 7.4 0 005.9-11.8l-42-57a7.4 7.4 0 00-5.9-2.9 7.5 7.5 0 00-6 3l-41.9 57a7.4 7.4 0 006 11.7z" role="presentation"></path>
                  </svg>
                  <div>
                      <strong>${
                        sunriseDate.getHours() + ':' + sunriseDate.getMinutes()
                      } Uhr</strong>
                  </div>
              </div>
              <div class="current-weather__sunset text--center">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="50" height="50" class="injected-svg svg--weather_sunset" xmlns:xlink="http://www.w3.org/1999/xlink" role="img" data-src="//assets.kleinezeitung.at/assets/icons/sprite.svg#weather_sunset">
                      <path class="sun" d="M271.8 22.1a21.5 21.5 0 10-43 0v47.7a21.5 21.5 0 1043 0V22.1zM104.1 73.6A21.5 21.5 0 1073.7 104l33.8 33.8a21.5 21.5 0 1030.4-30.4l-33.8-33.8zm-82.2 155a21.5 21.5 0 100 43h47.8a21.5 21.5 0 100-43H21.9zM478.3 272a21.5 21.5 0 100-43h-47.8a21.5 21.5 0 100 43h47.8zm-51.5-167.7a21.5 21.5 0 10-30.4-30.4l-33.8 33.8a21.5 21.5 0 1030.4 30.4l33.8-33.8z" role="presentation"></path>
                      <path class="sun" d="M478.4 345.7c11.8 0 21.4-9.6 21.4-21.4 0-11.9-9.7-21.6-21.5-21.6l-104.6-.1a133.7 133.7 0 10-246.6 0l-105 .1A21.4 21.4 0 00.7 324.3c0 11.9 9.7 21.5 21.5 21.4h456.2zM250.3 159.8a91 91 0 0174.9 142.7H175.5a91 91 0 0174.8-142.7z" role="presentation"></path>
                      <path class="arrow" d="M292.2 419.1h-29.7v-30.3c0-4.1-3.3-7.4-7.3-7.4h-9.5a7.4 7.4 0 00-7.4 7.4v30.3h-29.8a7.3 7.3 0 00-7.3 7.4c0 1.7.5 3.2 1.5 4.4l41.9 56.9a7.4 7.4 0 005.9 2.9c2.4 0 4.6-1.2 6-3l41.9-57a7.1 7.1 0 001.4-4.3c-.2-4-3.5-7.3-7.6-7.3z" role="presentation"></path>
                  </svg>
                  <div>
                      <strong>${
                        sunsetDate.getHours() + ':' + sunsetDate.getMinutes()
                      } Uhr</strong>
                  </div>
              </div>
              <ul class="current-weather_stats">
                  <li>
                      <span>
                          Niederschlag <strong>${outer.#parseRain(
                            weather
                          )} mm/h</strong>
                      </span>
                  </li>
                  <li>
                      <span>
                          Wind <strong>${parseFloat(
                            weather.wind_speed * 3.6
                          ).toFixed(0)} km/h</strong>
                      </span>
                  </li>
                  <li>
                      <span>
                          Windböen <strong>bis ${parseFloat(
                            weather.wind_gust * 3.6
                          ).toFixed(0)} km/h</strong>
                      </span>
                  </li>
                  <li>
                      <span>
                          Luftfeuchtigkeit <strong>${weather.humidity}%</strong>
                      </span>
                  </li>
                  <li>
                      <span>
                          Luftdruck <strong>${weather.pressure} hPa</strong>
                      </span>
                  </li>
                  <li>
                      <span>
                          Wolkenbedeckung <strong>${weather.clouds}%</strong>
                      </span>
                  </li>
              </ul>
          </div>`;
    var element = (document.getElementById(weatherContainerId).innerHTML =
      html);

    /**
  <div class="weather-zamg">
      <h2>Aktuelle ZAMG Wetterdaten</h2>
      <p>Temperatur ${zamgData.TL.data[0]} °C</p>
      <p>Niederschlag ${zamgData.RR.data[0]} mm/h</p>
      <p>Wind ${parseFloat(zamgData.FFAM.data[0] * 3.6).toFixed(0)} km/h</p>
      <p>Luftfeuchtigkeit ${zamgData.RFAM.data[0]}%</p>
      <p>Luftdruck ${zamgData.P.data[0]} hPa</p>
      </div>
  **/
  }

  #parseTemp(weather) {
    if (isNaN(weather.temp)) {
      return (
        parseFloat(weather.temp.max).toFixed(0) +
        '/' +
        parseFloat(weather.temp.min).toFixed(0)
      );
    }
    return parseFloat(weather.temp).toFixed(0);
  }

  #parseFeelsLike(weather) {
    if (isNaN(weather.feels_like)) {
      return parseFloat(weather.feels_like.day).toFixed(0);
    }
    return parseFloat(weather.feels_like).toFixed(0);
  }

  #parseRain(weather) {
    if (weather.rain && isNaN(weather.rain)) {
      return parseFloat(weather.rain['1h']).toFixed(1);
    } else if (weather.rain) {
      return parseFloat(weather.rain).toFixed(1);
    }
    return 0.0;
  }

  #getTime(weather) {
    const dat = new Date(weather.dt * 1000);
    return (
      dat.toLocaleDateString('de-DE', { weekday: 'long' }) +
      ',' +
      dat.getDate() +
      '.' +
      dat.toLocaleDateString('de-DE', { month: 'long' }) +
      ',' +
      dat.getHours() +
      ':' +
      dat.getMinutes() +
      ' Uhr'
    );
  }
}
