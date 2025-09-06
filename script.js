async function fetchWeather() {
  let searchInput = document.getElementById("search").value;
  const weatherDataSection = document.getElementById("weather-data");
  weatherDataSection.style.display = "block";
  const apiKey = "9ae557011c7cf993fa7b38b445891eca"; // Replace with your OpenWeatherMap API key

  if (searchInput === "") {
    weatherDataSection.innerHTML = `
      <div>
        <h2>Empty Input!</h2>
        <p>Please try again with a valid <u>city name</u>.</p>
      </div>
    `;
    return;
  }

  try {
    // Step 1: Get latitude and longitude
    const geocodeData = await getLonAndLat(searchInput, apiKey);
    if (!geocodeData) return; // Stop if geocode data is invalid

    // Step 2: Get weather data
    const weatherData = await getWeatherData(geocodeData.lat, geocodeData.lon, apiKey);
    if (!weatherData) return; // Stop if weather data is invalid

    // Step 3: Display weather data
    weatherDataSection.style.display = "flex";
    weatherDataSection.innerHTML = `
      <img src="https://openweathermap.org/img/wn/${weatherData.weather[0].icon}.png" alt="${weatherData.weather[0].description}" width="100" />
      <div>
        <h2>${weatherData.name}</h2>
        <p><strong>Temperature:</strong> ${Math.round(weatherData.main.temp - 273.15)}°C</p>
        <p><strong>Description:</strong> ${weatherData.weather[0].description}</p>
      </div>
    `;
  } catch (error) {
    console.error("Error fetching weather data:", error);
    weatherDataSection.innerHTML = `
      <div>
        <h2>Error!</h2>
        <p>Something went wrong. Please try again later.</p>
      </div>
    `;
  }

  document.getElementById("search").value = ""; // Clear input
}

async function getLonAndLat(city, apiKey) {
  const countryCode = ""; // Optional: Remove or make dynamic for broader use
  const geocodeURL = `https://api.openweathermap.org/geo/1.0/direct?q=${city.replace(" ", "%20")}${countryCode ? "," + countryCode : ""}&limit=1&appid=${apiKey}`;

  try {
    const response = await fetch(geocodeURL);
    if (!response.ok) {
      console.error("Geocoding API error:", response.status);
      document.getElementById("weather-data").innerHTML = `
        <div>
          <h2>Invalid Input: "${city}"</h2>
          <p>Please try again with a valid <u>city name</u>.</p>
        </div>
      `;
      return null;
    }

    const data = await response.json();
    if (data.length === 0) {
      console.error("No geocode data found for:", city);
      document.getElementById("weather-data").innerHTML = `
        <div>
          <h2>Invalid Input: "${city}"</h2>
          <p>Please try again with a valid <u>city name</u>.</p>
        </div>
      `;
      return null;
    }

    return data[0]; // Return first result with lat and lon
  } catch (error) {
    console.error("Error in getLonAndLat:", error);
    return null;
  }
}

async function getWeatherData(lat, lon, apiKey) {
  const weatherURL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`;

  try {
    const response = await fetch(weatherURL);
    if (!response.ok) {
      console.error("Weather API error:", response.status);
      document.getElementById("weather-data").innerHTML = `
        <div>
          <h2>Error!</h2>
          <p>Unable to fetch weather data. Please try again.</p>
        </div>
      `;
      return null;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error in getWeatherData:", error);
    return null;
  }
}