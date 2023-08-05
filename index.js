
$.getJSON("https://api.ipify.org?format=json", function(data) {
         
        // Setting text of element with id = right-desc-ip
        $("#right-desc-ip").html(data.ip);
        localStorage.setItem('ipAddress', data.ip);
    });



const getStarted = document.getElementById('get-started');

getStarted.addEventListener('click', () => {
    location.href = './postOfficeApp.html';
});