// GLOBAL VARIABLES

const apiKey = 'd90c67317b789f9b8a0455a4ae60d8aa';
const apiBaseURL = 'https://api.openweathermap.org/data/2.5/forecast';

const zipcodeInput = document.getElementById
('zipcode');
const searchBTN = document.getElementById('search-btn');
const forecastDisplay = document.getElementById('forecast');


// Function to get the API data
function getAPI(zipcode) {
    const apiURL = apiBaseURL+'?zip='+zipcode+'&appid='+apiKey+'&units=imperial';

    fetch(apiURL)
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
    const currentDate = new Date();
    const temperature = data.list[0].main.temp;
    const windSpeed = data.list[0].wind.speed;
    const humidity = data.list[0].main.humidity;
    
    // Update the current weather display
    document.getElementById('weather-today').textContent = cityName;
    document.getElementById('date').textContent = currentDate.toDateString();
    document.getElementById('temp').textContent = 'Temp: ' + temperature + '°F';
    document.getElementById('wind').textContent = 'Wind: ' + windSpeed + ' m/s';
    document.getElementById('humidity').textContent = 'Humidity: ' + humidity + '%';
}

// Event listener for Search Button
searchBTN.addEventListener('click', function(event) {
    event.preventDefault(); 
    console.log('Search Button Clicked');
    
    const zipcode = zipcodeInput.value;
    getAPI(zipcode);
});


