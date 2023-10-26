// GLOBAL VARIABLES

const apiKey = 'd90c67317b789f9b8a0455a4ae60d8aa';
const apiURL = 'https://api.openweathermap.org/data/2.5/forecast?zip=${zipCode}&appid=${apiKey}';

const zipcode = document.getElementById
('zipcode').value;
const searchBTN = document.getElementById('search-btn')
const currentWeatherDisplay = document.getElementById('weather-today')
const forecastDisplay = document.getElementById('forecast')

// Function to get the API data
function getAPI() {
fetch(apiURL)
    .then(function(response) {
        return response.json();
    })
    .then(function (data) {
        for (let i = 0; i < data.length; i++) {          
            const displayWeather = document.createElement('p');
            displayWeather.textContent = data[i].html_url;
            forecastDisplay.appendChild(displayWeather);
        }
    });
};

// Event listener for Search Button
function handleSearchBTN() {
    searchBTN.addEventListener('click', getAPI);
};

