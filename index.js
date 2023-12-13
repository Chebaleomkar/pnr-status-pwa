
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
    const url = `https://pnr-status-indian-railway-pnr-check1.p.rapidapi.com/pnrno/${pnrInput}`;
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': '607eb5cbdfmsh6b451121343e547p1ceff4jsn66e6837e2bff',
            'X-RapidAPI-Host': 'pnr-status-indian-railway-pnr-check1.p.rapidapi.com'
        }
    };
   
    updateSearchHistory(pnrInput);
    try {
        const res = await fetch(url, options);

        if (res.ok) {
            const data = await res.json();
            console.log('API Response:', data);

            localStorage.setItem('data' , JSON.stringify(data));


            //render Api Data using DOM
            resultContainer.classList.add('result-container')
            resultContainer.innerHTML = `
            <h2>PNR Status : <b> <i style={color:black} > ${data.Pnr} </i> </b> </h2>
            <p><i class="fa fa-train"></i> <strong>Train Name:</strong> ${data.TrainName} <br/><br/>
            <i class="fa fa-train"></i> <strong> Train Number : </strong> ${data.TrainNo} </p>
            <p><i class="fa fa-info-circle"></i> <strong>Status:</strong> ${data.InformationMessage || data.TrainStatus}</p>
            <p><i class="fa fa-calendar"></i> <strong>Date :</strong> ${data.Doj}</p>
            <div class="location">
                <span><i class="fa fa-map-marker" ></i> To : ${data.To}</span>
                <!-- <span><i class="fa fa-arrow-right" ></i></span> -->
                <span><i class="fa fa-map-marker" ></i>From : ${data.From} </span>

            </div>
            <p>
             <i class="fa fa-ticket" > </i> <b> Ticket : </b> &#8377;${data.TicketFare || data.BookingFare} <br/><br/>
             <i  class="fa fa-th"></i> <b> PassengerCount :  </b>${data.PassengerCount} 
            </p>
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


if(!navigator.onLine){
    const storedData = localStorage.getItem('data');

    if(storedData){

        resultContainer.classList.add('result-container')
        resultContainer.innerHTML = `
        <h2>PNR Status : <b> <i style={color:black} > ${storedData.Pnr} </i> </b> </h2>
        <p><i class="fa fa-train"></i> <strong>Train Name:</strong> ${storedData.TrainName} <br/><br/>
        <i class="fa fa-train"></i> <strong> Train Number : </strong> ${storedData.TrainNo} </p>
        <p><i class="fa fa-info-circle"></i> <strong>Status:</strong> ${storedData.InformationMessage || storedData.TrainStatus}</p>
        <p><i class="fa fa-calendar"></i> <strong>Date :</strong> ${storedData.Doj}</p>
        <div class="location">
            <span><i class="fa fa-map-marker" ></i> To : ${storedData.To}</span>
            <!-- <span><i class="fa fa-arrow-right" ></i></span> -->
            <span><i class="fa fa-map-marker" ></i>From : ${storedData.From} </span>
    
        </div>
        <p>
         <i class="fa fa-ticket" > </i> <b> Ticket : </b> &#8377;${storedData.TicketFare || storedData.BookingFare} <br/><br/>
         <i  class="fa fa-th"></i> <b> PassengerCount :  </b>${storedData.PassengerCount} 
        </p>  `;

    }else{
        resultContainer.innerHTML = `<h3>No Stored Data is Available </h3/>`
    }
    
}