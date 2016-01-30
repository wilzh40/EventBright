var myLatlng = new google.maps.LatLng(48.3333, 16.35);
// sorry - this demo is a beta
// there is lots of work todo
// but I don't have enough time for eg redrawing on dragrelease right now
var myOptions = {
    zoom: 2,
    center: myLatlng,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    disableDefaultUI: false,
    scrollwheel: true,
    draggable: true,
    navigationControl: true,
    mapTypeControl: false,
    scaleControl: true,
    disableDoubleClickZoom: false
};
var map = new google.maps.Map(document.getElementById("heatmapArea"), myOptions);
var heatmap = new HeatmapOverlay(map, {"radius":15, "visible":true, "opacity":60});


document.getElementById("tog").onclick = function(){
    heatmap.toggle();
};

var testData = [];

window.onload = function() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
        console.log("lol");
    }

}


// this is important, because if you set the data set too early, the latlng/pixel projection doesn't work

function getEvents(lat, lon) {
    jQuery.get( "https://www.eventbriteapi.com/v3/events/search/?location.within=50mi&location.latitude="+ lat +"&location.longitude="+ lon +"&token=YRKRMUBSHY35H3KOZ5UX", function( response  ) {
        console.log(response);
        // var count = response.pagination.page_count;
        count = 50;
        console.log(count);
        loadMap();
        while (count--){
            var id = response.events[count].id;
            if (response.events[count].hasOwnProperty('venue_id')) {
                var venue_id = response.events[count].venue_id;
                var p_token = "EHVCT2USO6SVM4FHT7A4"
                jQuery.get( "https://www.eventbriteapi.com/v3/venues/" + venue_id + "/?token=" + p_token, function( response  ) {
                    console.log(response);
                    var lat = response.latitude;
                    var lon = response.longitude;
                    heatmap.addDataPoint(lat,lon,1);

                });

            }

        }
    }  );
}
document.getElementById("search-button").addEventListener("click", function(){
    //window.location = document.getElementById('link-box').value;
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);



    }
});
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
 var testData={
        max: 46,
        data: [{lat: 33.5363, lng:-117.044, count: 1},{lat: 33.5608, lng:-117.24, count: 1}]
    };
function loadMap(){

    // sorry - this demo is a beta
    // there is lots of work todo
    // but I don't have enough time for eg redrawing on dragrelease right now
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

    // this is important, because if you set the data set too early, the latlng/pixel projection doesn't work
};
    google.maps.event.addListenerOnce(map, "idle", function(){
        heatmap.setDataSet(testData);
    });
