const express = require('express');
const axios = require('axios');

const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.render('index', { weather: null, error: null });
});


app.post('/', async (req, res) => {
  const city = req.body.city;
  const apiKey = 'YOUR_API_KEY'; // Replace with your
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

  try {
    const response = await axios.get(url);
    const weather = {
      city: response.data.name,
      temperature: response.data.main.temp
    };
    res.render('index', { weather, error: null });
  } catch (error) {
    res.render('index', { weather: null, error: 'City not found' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});