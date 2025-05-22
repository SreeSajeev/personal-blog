require('dotenv').config();
const express = require('express');
const app = express();

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send(`
    <html>
      <head>
        <title>Weather API</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            height: 100vh;
            margin: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            background: #f0f4f8;
          }
          .container {
            text-align: center;
            padding: 20px;
            background: white;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
            border-radius: 8px;
            width: 320px;
          }
          input, select, button {
            font-size: 1em;
            padding: 8px;
            margin-top: 10px;
            width: 100%;
            box-sizing: border-box;
            border: 1px solid #ccc;
            border-radius: 4px;
          }
          button {
            cursor: pointer;
            background-color: #007bff;
            color: white;
            border: none;
            transition: background-color 0.3s ease;
          }
          button:hover {
            background-color: #0056b3;
          }
          p {
            margin-top: 15px;
          }
          .weather-info {
            font-size: 1.1em;
            line-height: 1.5;
            color: #333;
          }
          .weather-icon {
            width: 80px;
            height: 80px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Check Weather</h1>
          <form action="/weather" method="get">
            <label for="city">Enter city name:</label>
            <input type="text" id="city" name="city" placeholder="e.g. London" required />
            <button type="submit">Get Weather</button>
          </form>
          <p>Or pick from the list:</p>
          <form action="/weather" method="get">
            <select name="city" onchange="this.form.submit()">
              <option value="">Select a city</option>
              <option value="London">London</option>
              <option value="New York">New York</option>
              <option value="Tokyo">Tokyo</option>
              <option value="Paris">Paris</option>
              <option value="Mumbai">Mumbai</option>
            </select>
          </form>
        </div>
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
      return res.status(response.status).send(`
        <html>
          <body style="font-family: Arial, sans-serif; text-align:center; padding:20px;">
            <h2>Error: City not found or API error</h2>
            <a href="/">Go back</a>
          </body>
        </html>
      `);
    }

    const data = await response.json();

    const weatherDescription = data.weather[0].description;
    const temperature = data.main.temp;
    const feelsLike = data.main.feels_like;
    const humidity = data.main.humidity;
    const windSpeed = data.wind.speed;
    const icon = data.weather[0].icon;

    res.send(`
      <html>
        <head>
          <title>Weather in ${city}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              height: 100vh;
              margin: 0;
              display: flex;
              justify-content: center;
              align-items: center;
              background: #f0f4f8;
            }
            .container {
              background: white;
              padding: 25px;
              border-radius: 10px;
              box-shadow: 0 0 12px rgba(0,0,0,0.1);
              width: 320px;
              text-align: center;
              color: #333;
            }
            .weather-icon {
              width: 100px;
              height: 100px;
            }
            .back-link {
              display: inline-block;
              margin-top: 20px;
              padding: 10px 15px;
              background-color: #007bff;
              color: white;
              text-decoration: none;
              border-radius: 5px;
              transition: background-color 0.3s ease;
            }
            .back-link:hover {
              background-color: #0056b3;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Weather in ${city}</h1>
            <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="Weather icon" class="weather-icon"/>
            <p><strong>Condition:</strong> ${weatherDescription}</p>
            <p><strong>Temperature:</strong> ${temperature}°C (feels like ${feelsLike}°C)</p>
            <p><strong>Humidity:</strong> ${humidity}%</p>
            <p><strong>Wind speed:</strong> ${windSpeed} m/s</p>
            <a href="/" class="back-link">Check another city</a>
          </div>
        </body>
      </html>
    `);
  } catch (error) {
    console.error('Fetch error:', error);
    res.status(500).send(`
      <html>
        <body style="font-family: Arial, sans-serif; text-align:center; padding:20px;">
          <h2>Internal Server Error</h2>
          <a href="/">Go back</a>
        </body>
      </html>
    `);
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
