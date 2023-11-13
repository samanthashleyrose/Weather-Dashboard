// GLOBAL VARIABLES

const apiKey = 'd90c67317b789f9b8a0455a4ae60d8aa';
const apiBaseURL = 'https://api.openweathermap.org/data/2.5/forecast';

const zipcodeInput = document.getElementById
('zipcode');
const searchBTN = document.getElementById('search-btn');
const forecastDisplay = document.getElementById('forecast');

// Popular Cities Quick Search Buttons
const NYBtn = document.getElementById('NY');
const LABtn = document.getElementById('LA');
const atlantaBtn = document.getElementById('Atlanta');
const denverBtn = document.getElementById('Denver');
const seattleBtn = document.getElementById('Seattle');
const chicagoBtn = document.getElementById('Chicago');
const austinBtn = document.getElementById('Austin');
const orlandoBtn = document.getElementById('Orlando');

let weatherData = {};

// Function to retrieve data from local storage
function getDataFromLocalStorage() {
    let storedData = JSON.parse(localStorage.getItem('weatherData'));

    if (storedData) {
        weatherData = storedData;
    }
    console.log("From Local Storage: ", storedData);
    return storedData;
}

// Function to save data to local storage
function saveDataToLocalStorage() {
    // Retrieve existing data from local storage
    let storedData = JSON.parse(localStorage.getItem('weatherData'));

    // Check if the data has already been saved
    if (storedData) {
        // If the data has already been saved, do not save it again
        console.log('Data has already been saved to local storage');
    } else {
        // If the data has not been saved, save it to local storage
        localStorage.setItem('weatherData', JSON.stringify(weatherData));
        console.log('Saved to Local Storage');
    }
}

// Function to update the weather data with a new zip code
function updateWeatherData(zipcode, data) {
    weatherData[zipcode] = data;
    saveDataToLocalStorage();
}

// Function to Display the users Search History
function displaySearchHistory() {
    const searchHistoryList = document.querySelector('.search-history');
    searchHistoryList.style.display = 'inline-block';

    // Create a new list item and link for the search history
    const searchHistory = document.createElement('li');
    const searchHistoryLink = document.createElement('a');
    searchHistoryLink.textContent = zipcodeInput.value;

    searchHistoryLink.setAttribute('data-zipcode', zipcodeInput.value);
    searchHistory.appendChild(searchHistoryLink);
    searchHistoryList.appendChild(searchHistory);

    // Event listener for each search history link
    searchHistoryLink.addEventListener('click', function(event) {
        event.preventDefault();
        const clickedZipcode = searchHistoryLink.getAttribute('data-zipcode');

        // Check if data is available in local storage for the clicked zipcode
        const storedData = getDataFromLocalStorage();
        if (storedData && storedData[clickedZipcode]) {
            displayCurrentWeather(storedData[clickedZipcode]);
            display5DayForecast(storedData[clickedZipcode].forecastData);
        } else {
            getCurrentWeatherAPI(clickedZipcode);
            get5DayForecastAPI(clickedZipcode);
        }
    });
}

// Function to get the API data for Today's Current weather
function getCurrentWeatherAPI(zipcode) {
    const apiCurrentWeatherURL = apiBaseURL+'?zip='+zipcode+'&appid='+apiKey+'&units=imperial';

    fetch(apiCurrentWeatherURL)
        .then(function(response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);
            updateWeatherData(zipcode, data);
            displayCurrentWeather(data);
        })
};

// Function to get the weather icon URL based on the icon code
function getWeatherIconUrl(iconCode) {
    // Construct the URL for the weather icon using OpenWeather's icon set
    const iconBaseUrl = 'http://openweathermap.org/img/wn/';
    return `${iconBaseUrl}${iconCode}@2x.png`;
}

// Function to display Today's Current Weather for entered zipcode
function displayCurrentWeather(data) {
    // Data from the API
    console.log(data);
    const cityName = data.city.name;
    const currentDate = new Date(); // Creates new date object
    const temperature = data.list[0].main.temp;
    const windSpeed = data.list[0].wind.speed;
    const humidity = data.list[0].main.humidity;
    const weatherIconCode = data.list[0].weather[0].icon;
    const weatherIconUrl = getWeatherIconUrl(weatherIconCode);
        
    // Update the current weather display
    document.getElementById('weather-today').textContent = cityName;
    document.getElementById('date').textContent = currentDate.toDateString();
    document.getElementById('temp').textContent = 'Temp: ' + temperature + '°F';
    document.getElementById('wind').textContent = 'Wind: ' + windSpeed + ' m/s';
    document.getElementById('humidity').textContent = 'Humidity: ' + humidity + '%';

    // Displays the weather icon --- also replaces weather icon when new weather information populates
    const weatherIconElement = document.querySelector('#current-weather-icon img');
    if (weatherIconElement) {
        weatherIconElement.src = weatherIconUrl;
    } else {
        const newWeatherIconElement = document.createElement('img');
        newWeatherIconElement.src = weatherIconUrl;
        newWeatherIconElement.alt = 'Weather Icon';
        document.querySelector('#current-weather-icon').appendChild(newWeatherIconElement);
    }
};

// Function to get the API data for 5-day Forecast
function get5DayForecastAPI(zipcode) {
    const api5DayURL = apiBaseURL+'?zip='+zipcode+'&appid='+apiKey+'&units=imperial';

    fetch(api5DayURL)
        .then(function(response) {
            return response.json();
        })
        .then(function (data) {
            display5DayForecast(data);
        })
};

// Function to display 5-day Forecast for entered zipcode
function display5DayForecast(data) {

    const currentDate = new Date(); // Creates new date object representing today's date
    currentDate.setDate(currentDate.getDate() + 1); // Increments the currentDate by 1 day to get tomorrow's date

    // Loops through the forecastData array to display each day's forecast in HTML divs
    for (let i = 0; i < 5; i++) {
        // Data from the API
        const forecastData = data.list[i];
        const currentForecast = forecastData; // Gets data for the current day in the loop

        const temperatureHigh = currentForecast.main.temp_max;
        const temperatureLow = currentForecast.main.temp_min;
        const windSpeed = currentForecast.wind.speed;
        const humidity = currentForecast.main.humidity;
        const weatherIconCode = currentForecast.weather[0].icon;

        // Get the weather icon URL based on the icon code
        const weatherIconUrl = getWeatherIconUrl(weatherIconCode);
    
        // Update each forecast card
        const dayElement = document.getElementById('forecast-day' + (i + 1)); // Matches 'i' to HTML to populate each day 
        dayElement.querySelector('.forecast-date').textContent = currentDate.toDateString();
        dayElement.querySelector('.forecast-temp-high').textContent = 'High: ' + temperatureHigh + '°F';
        dayElement.querySelector('.forecast-temp-low').textContent = 'Low: ' + temperatureLow + '°F';
        dayElement.querySelector('.forecast-wind').textContent = 'Wind: ' + windSpeed + ' m/s';
        dayElement.querySelector('.forecast-humidity').textContent = 'Humidity: ' + humidity + '%';

        // Display the weather icon
        const weatherIconElement = document.createElement('img');
        weatherIconElement.src = weatherIconUrl;
        weatherIconElement.alt = 'Weather Icon';
        dayElement.querySelector('.forecast-date').appendChild(weatherIconElement)

        // Increments currentDate by 1 day for the next iteration
        currentDate.setDate(currentDate.getDate() + 1);
    };
}

// Event listener for Search Button
searchBTN.addEventListener('click', function(event) {
    event.preventDefault(); 
    console.log('Search Button Clicked');
    
    const zipcode = zipcodeInput.value;
    // Check if data is available in local storage
    getDataFromLocalStorage();
    
    if (weatherData[zipcode]) {
        // Data is available in local storage, display it without making API request
        displayCurrentWeather(weatherData[zipcode]);
        display5DayForecast(weatherData[zipcode].forecastData);
    } else {
        // Data is not available in local storage, fetch it from the API
        getCurrentWeatherAPI(zipcode);
        get5DayForecastAPI(zipcode);
    }
    displaySearchHistory();
});

// Event listener for New York 10001 Search Button
NYBtn.addEventListener('click', function(event) {
    event.preventDefault(); 
    console.log('NY Quick Search Button Clicked');
    
    const NYZipcode = '10001';
    getCurrentWeatherAPI(NYZipcode);
    get5DayForecastAPI(NYZipcode);
});

// Event listener for Los Angeles 90012 Search Button
LABtn.addEventListener('click', function(event) {
    event.preventDefault(); 
    console.log('LA Quick Search Button Clicked');
    
    const LAZipcode = '90012';
    getCurrentWeatherAPI(LAZipcode);
    get5DayForecastAPI(LAZipcode);
});

// Event listener for Atlanta 30303 Search Button
atlantaBtn.addEventListener('click', function(event) {
    event.preventDefault(); 
    console.log('Atlanta Quick Search Button Clicked');
    
    const atlantaZipcode = '30303';
    getCurrentWeatherAPI(atlantaZipcode);
    get5DayForecastAPI(atlantaZipcode);
});

// Event listener for Los Denver 80202 Search Button
denverBtn.addEventListener('click', function(event) {
    event.preventDefault(); 
    console.log('Denver Quick Search Button Clicked');
    
    const denverZipcode = '80202';
    getCurrentWeatherAPI(denverZipcode);
    get5DayForecastAPI(denverZipcode);
});

// Event listener for Seattle 98101 Search Button
seattleBtn.addEventListener('click', function(event) {
    event.preventDefault(); 
    console.log('Seattle Quick Search Button Clicked');
    
    const seattleZipcode = '98101';
    getCurrentWeatherAPI(seattleZipcode);
    get5DayForecastAPI(seattleZipcode);
});

// Event listener for Chicago 60601 Search Button
chicagoBtn.addEventListener('click', function(event) {
    event.preventDefault(); 
    console.log('Chicago Quick Search Button Clicked');
    
    const chicagoZipcode = '60601';
    getCurrentWeatherAPI(chicagoZipcode);
    get5DayForecastAPI(chicagoZipcode);
});

// Event listener for Austin 78701 Search Button
austinBtn.addEventListener('click', function(event) {
    event.preventDefault(); 
    console.log('Austin Quick Search Button Clicked');
    
    const austinZipcode = '78701';
    getCurrentWeatherAPI(austinZipcode);
    get5DayForecastAPI(austinZipcode);
});

// Event listener for Orlando 32801 Search Button
orlandoBtn.addEventListener('click', function(event) {
    event.preventDefault(); 
    console.log('Orlando Quick Search Button Clicked');
    
    const orlandoZipcode = '32801';
    getCurrentWeatherAPI(orlandoZipcode);
    get5DayForecastAPI(orlandoZipcode);
});

getDataFromLocalStorage();