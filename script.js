var myLatlng = new google.maps.LatLng(48.3333, 16.35);
var map;
var heatmap;
var testData = [];
// Eventbrite "upgraded" private key
var p_token = "EHVCT2USO6SVM4FHT7A4"


// Checks for user location on page load

window.onload = function() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
        console.log("Getting current position...");
    }

}

// Call back once location is recieved
function showPosition(position) {
    var x = document.getElementById("link-box");
    var info = document.getElementById("display");
    info.innerHTML = "Latitude: " + position.coords.latitude +
                "<br>Longitude: " + position.coords.longitude;

    console.log( "Latitude: " + position.coords.latitude +
                "<br>Longitude: " + position.coords.longitude);

                myLatlng = new google.maps.LatLng(position.coords.latitude,position.coords.longitude);
                getEvents(position.coords.latitude,position.coords.longitude);

}

// Eventbrite API Calls
function getEvents(lat, lon) {
    jQuery.get( "https://www.eventbriteapi.com/v3/events/search/?location.within=50mi&location.latitude="+ lat +"&location.longitude="+ lon +"&token=YRKRMUBSHY35H3KOZ5UX", function( response  ) {
        console.log(response);
        // Queries Eventbrite API for events 50 miles within browser location
        // var count = response.pagination.page_count;
        count = 50;
        loadMap();
        while (count--){
            var id = response.events[count].id;
            if (response.events[count].hasOwnProperty('venue_id')) {
                var venue_id = response.events[count].venue_id;
                jQuery.get( "https://www.eventbriteapi.com/v3/venues/" + venue_id + "/?token=" + p_token, function( response  ) {
                    // For each event, if the event has a venue, fine the venue location and plot it on the heat map
                    console.log(response);
                    var lat = response.latitude;
                    var lon = response.longitude;
                    heatmap.addDataPoint(lat,lon,1);

                });

            }

        }
    }  );
}
//document.getElementById("search-button").addEventListener("click", function(){
//    //window.location = document.getElementById('link-box').value;
//    if (navigator.geolocation) {
//        navigator.geolocation.getCurrentPosition(showPosition);
//});


function loadMap(){

    var myOptions = {
        zoom: 10,
        center: myLatlng,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        disableDefaultUI: false,
        scrollwheel: false,
        draggable: true,
        navigationControl: true,
        mapTypeControl: false,
        scaleControl: true,
        disableDoubleClickZoom: false
    };
    map = new google.maps.Map(document.getElementById("heatmapArea"), myOptions);
    heatmap = new HeatmapOverlay(map, {"radius":15, "visible":true, "opacity":60});

    document.getElementById("tog").onclick = function(){
        heatmap.toggle();
    };

};
