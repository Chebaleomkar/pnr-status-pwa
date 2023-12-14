
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./serviceWorker.js')
        .then(registration => {
            console.log('SW registered');
            console.log(registration);
        })
        .catch(err => {
            console.log('Sw failed ', err)
        })
}

var searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];

function updateSearchHistory(pnrInput) {
    // Add current search to the history
    searchHistory.push(pnrInput);

    // Keep only the most recent 10 searches
    if (searchHistory.length > 10) {
        searchHistory = searchHistory.slice(-10);
    }

    // Save the updated search history to localStorage
    localStorage.setItem('searchHistory', JSON.stringify(searchHistory));

    // Optionally, you can display the search history in the console
    console.log("Search History:", searchHistory);
}

function updateSearchHistoryUI() {
    // Display the search history in the UI
    const searchHistoryList = document.getElementById('searchHistoryList');

    searchHistoryList.innerHTML = '';
    searchHistory.slice().reverse().forEach(search => {
        const listItem = document.createElement('li');
        listItem.textContent = search;

        listItem.addEventListener('click', function () {
            // Set the clicked history item as the input value
            document.getElementById('pnrInput').value = search;
            // Hide the search history list
            searchHistoryList.style.display = 'none';
        });
        searchHistoryList.appendChild(listItem);
    });

    // Add event listener to hide search history when clicking outside
    document.addEventListener('click', function (event) {
        const targetElement = event.target; // Clicked element

        if (
            targetElement.id !== 'pnrInput' &&
            !searchHistoryList.contains(targetElement)
        ) {
            // Click was outside the search history list and input field
            searchHistoryList.style.display = 'none';
        }
    });
}


// Display the search history when the input field is clicked
document.getElementById('pnrInput').addEventListener('click', function () {
    const searchHistoryList = document.getElementById('searchHistoryList');
    if (searchHistory.length > 0) {
        updateSearchHistoryUI();
        searchHistoryList.style.display = 'block';
    }
});

async function checkStatus() {
    var pnrInput = document.getElementById('pnrInput').value;
    let resultContainer = document.getElementById('result');

    if (pnrInput.trim() === '') {
        alert('Please enter a valid PNR number');
        return;
    }

    const url = `https://pnr-status-indian-railway.p.rapidapi.com/pnr-check/${pnrInput}`;
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': 'fe2f26c906msh336fdf1b2d865e1p1b3814jsn02a4de671e51',
            'X-RapidAPI-Host': 'pnr-status-indian-railway.p.rapidapi.com'
        }
    };

    updateSearchHistory(pnrInput);
    try {
        const res = await fetch(url, options);

        if (res.ok) {
            const response = await res.json();
            const data = response.data
            console.log('API Response:', data);

            localStorage.setItem('data', JSON.stringify(data));


            //render Api Data using DOM
            resultContainer.classList.add('result-container')
            resultContainer.innerHTML = `
            <h2>PNR Status: <span class="pnr-input">${pnrInput}</span></h2>
            <div class="train-info">
                <p ><i class="fa fa-train"></i> <strong>Train Name:</strong> ${data.trainInfo.name}</p>
                <p><i class="fa fa-train"></i> <strong>Train No.:</strong> ${data.trainInfo.trainNo}</p>
                <p><i class="fa fa-calendar"></i> <strong>Date:</strong> ${data.trainInfo.dt}</p>
            </div>
            <div class="location">
                <span class="txtalg ml" ><i class="fa fa-clock"></i> <b> Arrival Time </b> : ${data.boardingInfo.arrivalTime}</span>
                <span class="txtalg ml" ><i class="fa fa-clock"></i> <b> Departure Time </b> : ${data.boardingInfo.departureTime}</span>
                <br/>
                </div>
            <div class="location">
                <span class="txtalg" ><i class="fa fa-map-marker"></i><b> Station  </b>  ${data.boardingInfo.stationName}</span>
                <span class="txtalg " ><i class="fa fa-map-marker"></i> <b> Platform </b>  ${data.boardingInfo.platform}</span>
                <span class="txtalg" ><i class="fa fa-calendar"></i> <b> Travel Day </b> ${data.destinationInfo.travellingDay}</span>
            </div>
            <div class="location">
                <span><i class="fa fa-map-marker"></i> <b> To <b/> : ${data.boardingInfo.stationName}</span>
                <span><i class="fa fa-map-marker"></i> <b> From <b/> : ${data.destinationInfo.stationName}</span>
                
            </div>
            <div class="seat-info">
                <p><b>Berth:</b> ${data.seatInfo.berth}</p>
                <p><b>Coach:</b> ${data.seatInfo.coach}</p>
                <p><i class="fa fa-th"></i> <b>Passenger Count:</b> ${data.seatInfo.noOfSeats}</p>
            </div>
        `;
        } else {
            console.error('Error fetching data. Status:', res.status);
            resultContainer.innerHTML = 'Error fetching data. Please try again.';
        }
    } catch (err) {
        console.error('An error occurred:', err);
        resultContainer.innerHTML = 'An error occurred. Please try again.';
    }
}


if (!navigator.onLine) {
    console.log('offline')
    const data = JSON.parse(localStorage.getItem('data'));

    const storedHistory = localStorage.getItem('searchHistory');
    const pnr = storedHistory[2] + storedHistory[3] + storedHistory[4] + storedHistory[5] + storedHistory[6] + storedHistory[7] + storedHistory[8] + storedHistory[9] + storedHistory[10] + storedHistory[11];

    let resultContainer = document.getElementById('result');
    if (data) {
        resultContainer.classList.add('result-container')
        resultContainer.innerHTML = `
            <h2>PNR Status: <span class="pnr-input">${pnr}</span></h2>
            <div class="train-info">
                <p ><i class="fa fa-train"></i> <strong>Train Name:</strong> ${data.trainInfo.name}</p>
                <p><i class="fa fa-train"></i> <strong>Train No.:</strong> ${data.trainInfo.trainNo}</p>
                <p><i class="fa fa-calendar"></i> <strong>Date:</strong> ${data.trainInfo.dt}</p>
            </div>
            <div class="location">
                <span class="txtalg ml" ><i class="fa fa-clock-o" ></i> <b> Arrival Time </b> : ${data.boardingInfo.arrivalTime}</span>
                <span class="txtalg ml" ><i class="fa fa-clock-o" ></i> <b> Departure Time </b> : ${data.boardingInfo.departureTime}</span>
                <br/>
                </div>
            <div class="location">
                <span class="txtalg" ><i class="fa fa-map-marker"></i><b> Station : </b>  ${data.boardingInfo.stationName}</span>
                <span class="txtalg " ><i class="fa fa-map-marker"></i> <b> Platform :</b>  ${data.boardingInfo.platform}</span>
                <span class="txtalg" ><i class="fa fa-calendar"></i> <b> Travel Day : </b> ${data.destinationInfo.travellingDay}</span>
            </div>
            <div class="location">
                <span><i class="fa fa-map-marker"></i> <b> To <b/> : ${data.boardingInfo.stationName}</span>
                <span><i class="fa fa-map-marker"></i> <b> From <b/> : ${data.destinationInfo.stationName}</span>
                
            </div>
            <div class="seat-info">
                <p><b>Berth:</b> ${data.seatInfo.berth}</p>
                <p><b>Coach:</b> ${data.seatInfo.coach}</p>
                <p><i class="fa fa-th"></i> <b>Passenger Count:</b> ${data.seatInfo.noOfSeats}</p>
            </div>
        `;

    } else {
        resultContainer.innerHTML = `<h3>No Stored Data is Available </h3/>`
    }

}