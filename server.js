const express = require('express');
const axios = require('axios');
require('dotenv').config();
const app = express();
const port = 3000;
app.use(express.static('public'));

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.render('index', { weather: null, error: null });
});

function toWeather(data) {
  return {
    city: data.name,
    country: data.sys.country,
    MinTemp: data.main.temp_min,
    MaxTemp: data.main.temp_max,
    feelsLike: data.main.feels_like,
    pressure: data.main.pressure,
    visibility: data.visibility,
    windDeg: data.wind.deg,
    temperature: data.main.temp,
    description: data.weather[0].description,
    humidity: data.main.humidity,
    wind: data.wind.speed,
    lat: data.coord.lat,
    lon: data.coord.lon
  };
}

app.post('/', async (req, res) => {
  const city = req.body.city;
  const apiKey = process.env.apiKey;
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

  try {
    const response = await axios.get(url);
    const weather = toWeather(response.data);
    res.render('index', { weather, error: null });
  } catch (error) {
    res.render('index', { weather: null, error: 'City not found or invalid' });
  }
});

app.get('/weather', async (req, res) => {
  const { lat, lon } = req.query;
  const apiKey = process.env.apiKey;
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

  try {
    const response = await axios.get(url);
    res.json(toWeather(response.data));
  } catch (error) {
    res.status(500).json({ error: 'Could not get weather for this point' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});