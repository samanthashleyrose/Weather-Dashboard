// GLOBAL VARIABLES

const apiKey = 'd90c67317b789f9b8a0455a4ae60d8aa';
const apiBaseURL = 'https://api.openweathermap.org/data/2.5/forecast';

const zipcodeInput = document.getElementById
('zipcode');
const searchBTN = document.getElementById('search-btn');
const forecastDisplay = document.getElementById('forecast');


// Function to get the API data for Today's Current weather
function getCurrentWeatherAPI(zipcode) {
    const apiCurrentWeatherURL = apiBaseURL+'?zip='+zipcode+'&appid='+apiKey+'&units=imperial';

    fetch(apiCurrentWeatherURL)
        .then(function(response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data.city);
            displayCurrentWeather(data);
        })
};

// Function to display Today's Current Weather for entered zipcode
function displayCurrentWeather(data) {
    // Data from the API
    const cityName = data.city.name;
    const currentDate = new Date(); // Creates new date object
    const temperature = data.list[0].main.temp;
    const windSpeed = data.list[0].wind.speed;
    const humidity = data.list[0].main.humidity;
    
    // Update the current weather display
    document.getElementById('weather-today').textContent = cityName;
    document.getElementById('date').textContent = currentDate.toDateString();
    document.getElementById('temp').textContent = 'Temp: ' + temperature + '°F';
    document.getElementById('wind').textContent = 'Wind: ' + windSpeed + ' m/s';
    document.getElementById('humidity').textContent = 'Humidity: ' + humidity + '%';
};

// Function to get the API data for 5-day Forecast
function get5DayForecastAPI(zipcode) {
    const api5DayURL = apiBaseURL+'?zip='+zipcode+'&appid='+apiKey+'&units=imperial';

    fetch(api5DayURL)
        .then(function(response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);
            display5DayForecast(data);
        })
};

// Function to display 5-day Forecast for entered zipcode
function display5DayForecast(data) {
    // Data from the API
    const forecastData = data.list;
    // Loops through the forecastData array to display each day's forecast in HTML divs
    for (let i = 0; i < 5; i++) {
        const currentForecast = forecastData[i]; // Gets data for the current day in the loop
        const currentDate = new Date(); // Creates new date object
        currentDate.setDate(currentDate.getDate() + i); // Adds 'i' days to the current date
        const temperature = currentForecast.main.temp;
        const windSpeed = currentForecast.wind.speed;
        const humidity = currentForecast.main.humidity;
    
        // Update each forecast card
        const dayElement = document.getElementById('forecast-day' + (i + 1)); // Matches 'i' to HTML to populate each day 
        dayElement.querySelector('.forecast-date').textContent = currentDate.toDateString();
        dayElement.querySelector('.forecast-temp').textContent = 'Temp: ' + temperature + '°F';
        dayElement.querySelector('.forecast-wind').textContent = 'Wind: ' + windSpeed + ' m/s';
        dayElement.querySelector('.forecast-humidity').textContent = 'Humidity: ' + humidity + '%';
    }
}

// Event listener for Search Button
searchBTN.addEventListener('click', function(event) {
    event.preventDefault(); 
    console.log('Search Button Clicked');
    
    const zipcode = zipcodeInput.value;
    getCurrentWeatherAPI(zipcode);
    get5DayForecastAPI(zipcode);
});


