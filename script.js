let temperatureText = document.querySelector("#temperature");
let cloudText = document.querySelector("#cloud-cover");
let windText = document.querySelector("#wind-speed");
let statusText = document.querySelector("#status");
let updatedTime = document.querySelector("#updated-time");
let temperatureBar = document.querySelector("#temperature-bar");
let weatherMessage = document.querySelector("#weather-message");
let refreshButton = document.querySelector("#refresh-button");

let apiURL =
  "https://api.open-meteo.com/v1/forecast" +
  "?latitude=31.5204&longitude=74.3587" +
  "&current=temperature_2m,cloud_cover,wind_speed_10m" +
  "&temperature_unit=celsius&wind_speed_unit=kmh" +
  "&timezone=Asia%2FKarachi";

let hasWeather = false;

function updateDesign(temperature) {
  if (temperature < 18) {
    document.body.className = "cool";
    weatherMessage.textContent =
      "Cool weather in Lahore — the page turns blue.";
  } else if (temperature < 30) {
    document.body.className = "mild";
    weatherMessage.textContent =
      "Mild weather in Lahore — the page turns green.";
  } else {
    document.body.className = "hot";
    weatherMessage.textContent =
      "Hot weather in Lahore — the page turns orange.";
  }

  let barHeight = (temperature / 50) * 100;
  barHeight = Math.max(0, Math.min(barHeight, 100));

  temperatureBar.style.height = barHeight + "%";
}

async function getWeather() {
  statusText.textContent = "Loading Lahore's weather…";
  refreshButton.disabled = true;
  refreshButton.textContent = "Loading…";

  try {
    let response = await fetch(apiURL);

    if (!response.ok) {
      throw new Error("Weather request failed.");
    }

    let data = await response.json();
    let weather = data.current;

    if (
      !weather ||
      !Number.isFinite(weather.temperature_2m) ||
      !Number.isFinite(weather.cloud_cover) ||
      !Number.isFinite(weather.wind_speed_10m)
    ) {
      throw new Error("Weather readings are missing.");
    }

    let temperature = weather.temperature_2m;
    let clouds = weather.cloud_cover;
    let wind = weather.wind_speed_10m;

    temperatureText.textContent = temperature + "°C";
    cloudText.textContent = clouds + "%";
    windText.textContent = wind + " km/h";

    updateDesign(temperature);

    updatedTime.textContent =
      "Weather data time: " +
      weather.time.replace("T", " at ") +
      " (Lahore time)";

    statusText.textContent = "Weather loaded successfully.";
    hasWeather = true;
  } catch (error) {
    console.error("Error:", error);

    if (hasWeather) {
      statusText.textContent =
        "Could not refresh. Showing the last loaded weather. Try again.";
    } else {
      statusText.textContent =
        "Could not load weather. Check your internet and click Refresh Weather.";
    }
  } finally {
    refreshButton.disabled = false;
    refreshButton.textContent = "Refresh Weather";
  }
}

refreshButton.addEventListener("click", getWeather);

getWeather();