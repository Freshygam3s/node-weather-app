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


app.post('/', async (req, res) => {
  const city = req.body.city;
  const apiKey = process.env.apiKey;
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

  try {
    const response = await axios.get(url);
    const weather = {
      city: response.data.name,
      country: response.data.sys.country,
      MinTemp: response.data.main.temp_min,
      MaxTemp: response.data.main.temp_max,
      feelsLike: response.data.main.feels_like,
      pressure: response.data.main.pressure,
      visibility: response.data.visibility,
      windDeg: response.data.wind.deg,
      temperature: response.data.main.temp,
      description: response.data.weather[0].description,
      humidity: response.data.main.humidity,
      wind: response.data.wind.speed
    };
    res.render('index', { weather, error: null });
  } catch (error) {
    res.render('index', { weather: null, error: 'City not found or invalid' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});