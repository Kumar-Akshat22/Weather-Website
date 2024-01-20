const userTab = document.querySelector('[data-userWeather]')
const searchTab = document.querySelector('[data-searchWeather]')
const userContainer = document.querySelector('.weather-container')
const grantAccessContainer = document.querySelector('.grant-location-container')
const grantAccessBtn = document.querySelector('[data-grantAccess]')
const searchForm = document.querySelector('[data-searchForm]')
const searchInput = document.querySelector('[data-searchInput]')
const loadingScreen = document.querySelector('.loading-container')
const userInfoContainer = document.querySelector('.user-info-container')
const errorContainer = document.querySelector('.error')

// Initializing the variables
const APIkey = "019947b686adde825c5c6104b3e13d7e";
let currentTab = userTab;

currentTab.classList.add("current-tab");
getfromSessionStorage();

// swtchTab is a person that helps in switching the tab
function switchTab(clickedTab){

    // Condition Checking
    if(clickedTab != currentTab){

        currentTab.classList.remove("current-tab");
        currentTab = clickedTab;
        currentTab.classList.add("current-tab");

        if(!searchForm.classList.contains("active")){

            userInfoContainer.classList.remove("active");
            grantAccessContainer.classList.remove("active");
            searchForm.classList.add("active");
        }

        else{

            // Make the error container invisible
            errorContainer.classList.remove("active");
            
            // User clicked on the Your Weather tab
            searchForm.classList.remove("active");
            
            userInfoContainer.classList.remove("active");


            // Ab user is on the Your Weather tab, so weather display karna padega, so let's check local storage first
            // for Coordinates,  if we have saved from there 
            getfromSessionStorage();
        }

    }
}

userTab.addEventListener('click' , () => {

    // Pass clicked tab as the input parameter
    switchTab(userTab);
})

searchTab.addEventListener('click' , () => {

    // Pass clicked tab as the input parameter
    switchTab(searchTab);

})

function getfromSessionStorage(){

    const localCoordinates = sessionStorage.getItem("user-coordinates");
    if(!localCoordinates){

        // Agar local coordinates nhi mile
        grantAccessContainer.classList.add("active");

    }

    else{

        const coordinates = JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);
    }
}

async function fetchUserWeatherInfo(coordinates){

    // Fetch Latitude and Longitude from the coordinates
    const {lat , lon} = coordinates;

    // Make Grant Access Container invisible
    grantAccessContainer.classList.remove("active");

    // Make Loading Screen visible
    loadingScreen.classList.add("active");

    // API call
    try{

        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${APIkey}&units=metric`);
        const data = await response.json();

        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
    }

    catch(err){

        
    }
}


function renderWeatherInfo(weatherInfo) {

    // First we have to fetch the elements 
    const cityname = document.querySelector('[data-cityName]');
    const countryflag = document.querySelector('[data-countryIcon]');
    const weatherdesc = document.querySelector('[data-weatherDesc]');
    const weathericon =  document.querySelector('[data-weatherIcon]');
    const temp =  document.querySelector('[data-Temp]');
    const windspeed = document.querySelector('[data-windSpeed]');
    const humidity = document.querySelector('[data-humidity]');
    const clouds = document.querySelector('[data-clouds]')
    const pressure = document.querySelector('[data-pressure]')

    // Fetch the values from weatherinfo and put them on UI
    cityname.innerText = weatherInfo?.name;
    countryflag.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    weatherdesc.innerText = weatherInfo?.weather?.[0]?.description;
    weathericon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temp.innerText = `${weatherInfo?.main?.temp} °C`;
    windspeed.innerText = `${weatherInfo?.wind?.speed} m/s`;
    humidity.innerText = `${weatherInfo?.main?.humidity} %`;
    clouds.innerText = `${weatherInfo?.clouds?.all} %`;
    pressure.innerText = `${weatherInfo?.main?.pressure} hPa`

}

function getLocation(){

    if(navigator.geolocation){

        navigator.geolocation.getCurrentPosition(showPosition)

    }

    else{

        // HW - Show an alert for no Geolocation support available
        alert('No Location Support available');
    }
}

function showPosition(position){

    const userCoordinates = {

        lat: position.coords.latitude, 
        lon: position.coords.longitude
    }

    sessionStorage.setItem("user-coordinates" , JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates);

}

grantAccessBtn.addEventListener('click' , getLocation);

searchForm.addEventListener('submit' , (e) => {

    e.preventDefault();
    let city = searchInput.value.toLowerCase(); 
    if(city === ""){
        return;
    }

    else{

        fetchSearchWeatherInfo(searchInput.value);
    }
});

async function fetchSearchWeatherInfo(city){

    grantAccessContainer.classList.remove("active");
    loadingScreen.classList.add("active");

    try{

        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${APIkey}&units=metric`);

        if(!response.ok){

            loadingScreen.classList.remove("active");
            userInfoContainer.classList.remove("active");
            errorContainer.classList.add("active");
            console.log('My name is Akshat');
        }

        else{

            const data = await response.json();
            loadingScreen.classList.remove("active");
            errorContainer.classList.remove("active");
            userInfoContainer.classList.add("active");
            renderWeatherInfo(data);
        }

    }

    catch(err){

        // HW

        console.log(err)
    }

}