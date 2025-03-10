const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(cors());

const API_KEY = "4be2e9d19ed68f84cbc4ba69f73373f7"; // Your OpenWeatherMap API key

// Default route for testing
app.get("/", (req, res) => {
    res.send("Weather API is running! Use /weather?city=London");
});

// Current Weather API Route
app.get("/weather", async (req, res) => {
    const city = req.query.city;
    if (!city) {
        return res.status(400).json({ error: "City is required" });
    }

    try {
        const response = await axios.get(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
        );

        console.log(`Weather API Response for ${city}:`, response.data); // Log API response
        
        res.json(response.data);
    } catch (error) {
        console.error("Error fetching weather data:", error.response?.data || error.message);
        res.status(500).json({ error: "Failed to fetch weather data", details: error.response?.data });
    }
});


// 5-Day Forecast API Route
app.get("/forecast", async (req, res) => {
    const city = req.query.city;
    if (!city) {
        return res.status(400).json({ error: "City is required" });
    }

    try {
        const response = await axios.get(
            `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`
        );

        console.log(`Forecast API Response for ${city}:`, response.data); // Log API response
        
        res.json(response.data);
    } catch (error) {
        console.error("Error fetching forecast data:", error.response?.data || error.message);
        res.status(500).json({ error: "Failed to fetch forecast data", details: error.response?.data });
    }
});

// Start Server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
