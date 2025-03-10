const API_BASE_URL = "http://localhost:5000"; // Change this if the server URL changes

const weatherIcons = {
    "clear sky": "☀️",
    "few clouds": "🌤️",
    "scattered clouds": "⛅",
    "broken clouds": "☁️",
    "shower rain": "🌧️",
    "rain": "🌦️",
    "thunderstorm": "⛈️",
    "snow": "❄️",
    "mist": "🌫️",
    "smoke": "💨",
    "haze": "🌁",
    "fog": "🌁"
};

async function getWeather() {
    const city = document.getElementById("cityInput").value.trim();
    if (!city) {
        alert("Please enter a city name.");
        return;
    }

    try {
        // Fetch current weather
        const weatherResponse = await fetch(`${API_BASE_URL}/weather?city=${city}`);
        const weatherData = await weatherResponse.json();

        if (weatherData.cod !== 200) {
            alert("City not found!");
            return;
        }

        // Capitalize first letter of weather description
        let description = weatherData.weather[0].description;
        description = description.charAt(0).toUpperCase() + description.slice(1);

        // Get weather icon
        let icon = weatherIcons[weatherData.weather[0].description.toLowerCase()] || "🌍";

        // Update UI
        document.getElementById("cityName").innerText = `${weatherData.name}, ${weatherData.sys.country}`;
        document.getElementById("temperature").innerText = `🌡 Temp: ${weatherData.main.temp}°C`;
        document.getElementById("description").innerHTML = `${icon} ${description}`;
        document.getElementById("humidity").innerText = weatherData.main.humidity ?? "N/A";
        document.getElementById("wind").innerText = weatherData.wind.speed ?? "N/A";
        document.getElementById("pressure").innerText = weatherData.main.pressure ?? "N/A";

        // Fetch 5-day forecast
        const forecastResponse = await fetch(`${API_BASE_URL}/forecast?city=${city}`);
        const forecastData = await forecastResponse.json();

        updateForecast(forecastData);
    } catch (error) {
        alert("Failed to fetch weather data. Please check your connection.");
        console.error(error);
    }
}

function updateForecast(forecastData) {
    let forecastHTML = "";
    const dailyForecasts = {};

    forecastData.list.forEach((entry) => {
        const date = entry.dt_txt.split(" ")[0]; // Extract date (YYYY-MM-DD)
        if (!dailyForecasts[date]) {
            dailyForecasts[date] = entry; // Store first entry for each day
        }
    });

    Object.keys(dailyForecasts).slice(0, 5).forEach((date) => {
        const forecast = dailyForecasts[date];
        let weatherDesc = forecast.weather[0].description;
        let weatherEmoji = weatherIcons[weatherDesc.toLowerCase()] || "❓";

        // Capitalize first letter
        weatherDesc = weatherDesc.charAt(0).toUpperCase() + weatherDesc.slice(1);

        forecastHTML += `
            <div class="forecast-item">
                <p class="forecast-date">📅 ${date}</p>
                <p class="forecast-temp">🌡 ${forecast.main.temp}°C</p>
                <p class="forecast-desc">${weatherEmoji} ${weatherDesc}</p>
            </div>
        `;
    });

    document.getElementById("weekly-forecast").innerHTML = forecastHTML;
}
