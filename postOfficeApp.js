$.getJSON("https://api.ipify.org?format=json", function(data) {
         
        // Setting text of element with id = right-desc-ip
        $("#loc").html(data.ip);
        localStorage.setItem('ipAddress', data.ip);
    });



const ipValue = document.getElementById('ip-value');
const latValue = document.getElementById('lat-value');
const cityValue = document.getElementById('city-value');
const organisationValue = document.getElementById('organisation-value');
const longValue = document.getElementById('long-value');
const regionValue = document.getElementById('region-value');
const hostnameValue = document.getElementById('hostname-value');

const mapLocation = document.getElementsByClassName('second-map-container')[0].firstElementChild;

const timeZoneValue = document.getElementById('time-zone-value');
const dateTimeValue = document.getElementById('date-time-value');
const pincodeValue = document.getElementById('pincode-value');
const messageValue = document.getElementById('message-value');


// load all necessary data on load of this page
window.onload = () => {
    getIpInfo();
}

const IP = localStorage.getItem('ipAddress');


//----------------- Function to get IP Info--------------------
async function getIpInfo() {

    // fetch ip info
    var url = `https:api.ipapi.is/?q=${IP}`;

    var response = await fetch(url);
    var data = await response.json();

    console.log(data);
    // store the date and time value returned according to timezone
    var currDateTime = getDateTimeViaTimezone(data.location.timezone);

    // store the list of post-offices returned according to the pincode
    var postOfficeData = await getPostOfficesViaPincode(data.location.zip);

    // finally, render all data obtained on DOM
    renderData(data, currDateTime, postOfficeData);
}


//----------------- Function to list of post-offices via pincode-----------------
async function getPostOfficesViaPincode(pincode) {

    // fetch list of post-offices using pincode and return
    var url = `https://api.postalpincode.in/pincode/${pincode}`;
    var response = await fetch(url);
    var data = await response.json();

    return data;
}


//--------------- Function to get date and time according to timezone-----------------
function getDateTimeViaTimezone(timezone) {

    // get date and time according to timezone and return
    let currDateTime = new Date().toLocaleString("en-IN", { timeZone: `${timezone}` });
    return currDateTime;
}


//----------------- Function to render all data on DOM-------------------------
function renderData(data, currDateTime, postOfficeData) {

    // set data for first section
    ipValue.innerText = IP;
    latValue.innerText = `${data.location.latitude}`;
    cityValue.innerText = `${data.location.city}`;
    organisationValue.innerText = `${data.asn.org}`;
    longValue.innerText = `${data.location.longitude}`;
    regionValue.innerText = `${data.location.state}`;
    hostnameValue.innerText = `${data.company.domain}`;


    // set data for second section
    mapLocation.setAttribute('src', `https://maps.google.com/maps?q=${data.location.latitude}, ${data.location.longitude}&z=15&output=embed`);


    // set data for third section
    timeZoneValue.innerText = `${data.location.timezone}`;
    dateTimeValue.innerText = currDateTime;
    pincodeValue.innerText = `${data.location.zip}`;
    messageValue.innerText = `${postOfficeData[0].Message}`;


    // set data for fourth section
    var po = postOfficeData[0].PostOffice;
    var fourthInfo = document.getElementsByClassName('fourth-info')[0];

    for (let i=0; i<po.length; i++){

        let fourthSubInfo = document.createElement('div');
        fourthSubInfo.setAttribute('class', 'fourth-sub-info');
        fourthSubInfo.setAttribute('id', `po-${i}`);

        fourthSubInfo.innerHTML = `<div class="part">
            <span>Name :</span>
            <span id="name-${i}">${po[i].Name}</span>
        </div>
        <div class="part">
            <span>Branch Type :</span>
            <span id="branch-type-${i}">${po[i].BranchType}</span>
        </div>
        <div class="part">
            <span>Delivery Status :</span>
            <span id="delivery-status-${i}">${po[i].DeliveryStatus}</span>
        </div>
        <div class="part">
            <span>District :</span>
            <span id="district-${i}">${po[i].District}</span>
        </div>
        <div class="part">
            <span>Division :</span>
            <span id="division-${i}">${po[i].Division}</span>
        </div>`;

        fourthInfo.append(fourthSubInfo);
    }
    

    // finally, add searchbar's event listener to search by Name and Branch Type
    var searchInput = document.getElementById("search-input");

    searchInput.addEventListener("input", () => {
        var searchTerm = searchInput.value.toLowerCase();
        filterByNameAndBranchType(fourthInfo.children, searchTerm);
    });

}

// ----------------------Function to implement searching by name and branch type------------------------

function filterByNameAndBranchType(items, searchTerm) {
    
    for (let i=0; i<items.length; i++){
        
        let name = items[i].children[0].children[1].innerText.toLowerCase();
        let branchType = items[i].children[1].children[1].innerText.toLowerCase();

        if (name.includes(searchTerm)) {
            items[i].style.display = 'flex';
        }
        else if (branchType.includes(searchTerm)) {
            items[i].style.display = 'flex';
        }
        else {
          items[i].style.display = 'none';
        }
    }
}