const API_KEY = '8488107cf0a82d7e18f03065962bd101';
async function getWeather() {
    const city = document.getElementById('city').value;
        if (!city) {
            alert('Please enter a city name');
            return;
        }
            
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;
            try {
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error('City not found');
                }
                const data = await response.json();
                
                document.getElementById('weather-result').innerHTML = `
                    <h2>${data.name}, ${data.sys.country}</h2>
                    <p>Temperature: ${data.main.temp}°C</p>
                    <p>Weather: ${data.weather[0].description}</p>
                `;
            } catch (error) {
                alert(error.message);
            }
        }
        function updateTime() {
            document.getElementById('current-time').innerText = `Current Time: ${new Date().toLocaleTimeString()}`;
        }

        setInterval(() => getWeather(currentCity), 60000); // Update weather every minute
        setInterval(updateTime, 1000); // Update time every second
        
        window.onload = () => {
            getWeather();
            updateTime();
            };