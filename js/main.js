// *********************************
// Get HTML elements ***************
// *********************************
const listItems = document.querySelectorAll("#global_nav ul li");
const navSlideLine = document.querySelector(".nav_slide_line");
const cityNameH1 = document.getElementById("city_name");
const currentTimeDiv = document.getElementById("current_time");
const timeDisplayCard = document.querySelector(".time_display_card");
const pageMain = document.querySelector("main");
const photoCopyRightP = document.querySelector(".photo_copy_right");

// *********************************
// Declare variables ***************
// *********************************
let clockInterval = null;
let flipTimeout = null;
// Time gaps in UTC
const timeGaps = {
    cupertino: -7,
    new_york_city: -4,
    london: 1,
    amsterdam: 2,
    tokyo: 9,
    hong_kong: 8,
    sydney: 10
}

// *********************************
// Reusable functions **************
// *********************************
const removeClassFromAll = (elementList, className) => {
    elementList.forEach((el) => {
        el.classList.remove(className);
    })
}

const alignSlideBar = (slideLineElement, targetElement) => {
    slideLineElement.style.width = window.getComputedStyle(targetElement).width;
    slideLineElement.style.left = targetElement.getBoundingClientRect().left + "px";
}

const getSelectedCity = (elementList) => {
    let selectedCity;
    elementList.forEach((el) => {
        if (el.classList.contains("active")) {
            selectedCity = el.textContent
        }
    })
    return selectedCity;
}

const getTime = (gap = 0) => {
    let utcHours = new Date().getUTCHours()
    let utcMinutes = new Date().getUTCMinutes()
    let utcSeconds = new Date().getUTCSeconds()

    // Adjust UTC time to local time
    utcHours += gap

    utcHours = utcHours >= 24 ? utcHours - 24 : utcHours;
    utcHours = utcHours < 0 ? 24 + utcHours : utcHours;

    utcMinutes = utcMinutes < 10 ? '0' + utcMinutes : utcMinutes;
    utcSeconds = utcSeconds < 10 ? '0' + utcSeconds : utcSeconds;

    return `${utcHours}:${utcMinutes}:${utcSeconds}`;
}

const initiateClock = (elementList) => {
    // clear previous interval
    clearInterval(clockInterval);

    const selectedCityName = getSelectedCity(elementList).toLowerCase().replaceAll(' ', '_');

    clockInterval = setInterval(() => {
        const currentTime = getTime(timeGaps[selectedCityName])
        currentTimeDiv.textContent = currentTime
    }, 1000)
}

const setBackgroundImage = (elementList) => {
    // "images" object is loaded by script in index.html
    const selectedCityName = getSelectedCity(elementList).toLowerCase().replaceAll(' ', '_');
    
    // Set background image to main element
    pageMain.style.background = `linear-gradient(0deg, rgba(0, 0, 0, 0.7), rgba(255, 255, 255, 1.0)), url(${images[selectedCityName].url})`;
    pageMain.style.backgroundSize = "cover";

    // Insert copy right text to p element
    photoCopyRightP.innerHTML = images[selectedCityName].copyRight
}

// *********************************
// Main init function **************
// *********************************
const init = () => {
    // Initiate clock and background with default settings("cupertino")
    initiateClock(listItems);
    cityNameH1.textContent = getSelectedCity(listItems);
    setBackgroundImage(listItems);
    
    // *********************************
    // ADD click event to  *************
    // listItem element ****************
    // *********************************
    listItems.forEach((listItem) => {
        // Initialise the slide line
        if (listItem.classList.contains("active")) {
            alignSlideBar(navSlideLine, listItem)
        }

        // Add click event to remove and add "active" class
        // and change the style of the slide line
        listItem.addEventListener("click", function () {
            // clear previous timeout and remove "flip" class from the card element
            clearTimeout(flipTimeout)
            timeDisplayCard.classList.remove("flip")

            // Add "active" class to clicked list item and align the sliding line 
            if (!this.classList.contains("active")) {
                removeClassFromAll(listItems, "active");
                this.classList.add("active");
                alignSlideBar(navSlideLine, this)
            }

            // Initiate the clock again 
            initiateClock(listItems)

            cityNameH1.textContent = getSelectedCity(listItems);

            // Add "flip" class to the card element to give animation
            timeDisplayCard.classList.add("flip")

            // Remove "flip" class from the card element after the flip animation
            flipTimeout = setTimeout(()=>{
                timeDisplayCard.classList.remove("flip")
            }, 1800)

            // Change background image
            setBackgroundImage(listItems)
        })

        // Add and remove "tilt" class for simple motion
        listItem.addEventListener("mouseover", function(){
            timeDisplayCard.classList.remove("bottom_shadow")
            timeDisplayCard.classList.add("tilt")
        })
        listItem.addEventListener("mouseout", function(){
            timeDisplayCard.classList.remove("tilt")
            timeDisplayCard.classList.add("bottom_shadow")
        })

        // Listen to window resize to align the sliding bar
        window.addEventListener("resize", () => {
            listItems.forEach((listItem)=>{
                if (listItem.classList.contains("active")) {
                    alignSlideBar(navSlideLine, listItem)
                }
            })
        });
    })
};

init();