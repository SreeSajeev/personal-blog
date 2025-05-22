require('dotenv').config();
const express = require('express');
const app = express();

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send(`
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>🌸 Weather App 🌸</title>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;600&display=swap" rel="stylesheet" />
    <style>
    body {
      font-family: 'Comic Sans MS', cursive, sans-serif;
      background: linear-gradient(to right, #fdfbfb, #ADD8E6); /* pastel grey-white blend */
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      margin: 0;
      padding: 20px;
      text-align: center;
    }

    h1 {
      color: #555;
      font-size: 2.5rem;
      margin-bottom: 20px;
      animation: bounce 1s infinite alternate;
    }

    @keyframes bounce {
      from { transform: translateY(0); }
      to { transform: translateY(-8px); }
    }

    input[type="text"] {
      padding: 10px;
      border-radius: 20px;
      border: 1px solid #ccc;
      font-size: 1rem;
      margin-bottom: 15px;
      width: 250px;
      text-align: center;
      background-color: #fff;
      color: #333;
    }

    button {
      padding: 10px 20px;
      border-radius: 20px;
      border: none;
      background-color: #a8dadc; /* soft teal */
      color: #fff;
      font-weight: bold;
      cursor: pointer;
      transition: background 0.3s;
    }

    button:hover {
      background-color: #457b9d; /* darker blue on hover */
    }

    #weatherDisplay {
      background: #ffffff;
      border-radius: 20px;
      padding: 20px;
      max-width: 90vw;
      width: 400px;
      margin-top: 20px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      animation: fadeIn 0.5s ease-in-out;
      word-wrap: break-word;
      overflow-wrap: break-word;
      max-height: 300px;
      overflow-y: auto;
      color: #444;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: scale(0.95); }
      to { opacity: 1; transform: scale(1); }
    }
  </style>
  </head>
  <body>
    <h1>Sky Cast - Weather App</h1>
    <form id="weatherForm">
      <input type="text" id="cityInput" name="city" placeholder="Enter city name" required />
      <button type="submit">Check Weather</button>
    </form>
    <div id="weatherResult">Enter a city and hit "Check Weather" to see the magic!</div>

    <script>
      const form = document.getElementById('weatherForm');
      const weatherResult = document.getElementById('weatherResult');

      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const city = document.getElementById('cityInput').value.trim();

        if (!city) {
          weatherResult.textContent = 'Please enter a city name.';
          return;
        }

        weatherResult.textContent = 'Loading... 🌷';

        try {
          const res = await fetch('/weather?city=' + encodeURIComponent(city));
          if (!res.ok) {
            const err = await res.json();
            weatherResult.textContent = err.error || 'Oops! Could not fetch weather.';
            return;
          }
          const data = await res.json();

          const iconUrl = "https://openweathermap.org/img/wn/" + data.weather[0].icon + "@2x.png";

          weatherResult.innerHTML = \`
            <h2>\${data.name}, \${data.sys.country}</h2>
            <img id="weatherIcon" src="\${iconUrl}" alt="\${data.weather[0].description}" />
            <p><strong>\${data.weather[0].description}</strong></p>
            <p>🌡️ Temperature: \${data.main.temp} °C (feels like \${data.main.feels_like} °C)</p>
            <p>💧 Humidity: \${data.main.humidity}%</p>
            <p>💨 Wind Speed: \${data.wind.speed} m/s</p>
          \`;
        } catch (error) {
          weatherResult.textContent = 'Something went wrong. Try again later!';
          console.error(error);
        }
      });
    </script>
  </body>
  </html>
  `);
});

app.get('/weather', async (req, res) => {
  const city = req.query.city || 'London';
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.API_KEY}&units=metric`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      return res.status(response.status).json({ error: 'City not found or API error' });
    }

    const data = await response.json();
    res.json(data);

  } catch (error) {
    console.error('Fetch error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log('Server running at http://localhost:\${PORT}');
});
