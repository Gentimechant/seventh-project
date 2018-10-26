/*jshint esversion: 6 */

let markers = [];
let lat, long, nearbyS, map, infoWindow; 

function initMap() { // TODO : add info window in wich marker 
    // Map option
    let options = {
        zoom: 14,
        center: {lat: 43.6582047, lng: 1.43194289}, // default position 
        zoomControlOptions: {
          style: google.maps.ZoomControlStyle.SMALL
        },
        panControlOptions: {
          style: google.maps.ZoomControlStyle.SMALL
        }
    };

    /**
     * lat = parseFloat(position.coords.latitude);
          long = parseFloat(position.coords.longitude);
     */

    // New map
    map = new google.maps.Map(document.getElementById("map"), options);
    infoWindow = new google.maps.InfoWindow();

    // Set current position as center of map
    // https://developers.google.com/maps/documentation/javascript/examples/map-geolocation
    if (navigator.geolocation) {
    	navigator.geolocation.getCurrentPosition(function(position) {
    		const pos = {
    			lat: position.coords.latitude,
    			lng: position.coords.longitude
    		};
    		infoWindow.setPosition(pos);
        infoWindow.setContent('Vous êtes ici.');
        infoWindow.open(map);
        map.setCenter(pos);

         // googlePlace
        const request = {
          location: map.getCenter(),
          radius: '500',
          type: ['restaurant']
        };
        
        service = new google.maps.places.PlacesService(map);
          
        function callback(results, status) {
          if (status == google.maps.places.PlacesServiceStatus.OK) {
            for (let i = 0; i < results.length; i++) {
              let place = results[i];
              // console.log(' Nom est : ' + place.name + ' ,son étoile est : ' + place.rating + ' il se trouve à : ' + place.vicinity);
              console.log(place);
              drawMarker(map, place.geometry.location.lat(), place.geometry.location.lng(), place.name);
            }
          }
        }
   		
        drawMarkerCurrentLocation(map, pos);
        service.nearbySearch(request, callback);
        
    	}, function() {
    		handleLocationError(true, infoWindow, map.getCenter());
    	});
    } else {
      // Browser doesn't support Geolocation
      handleLocationError(false, infoWindow, map.getCenter());
    }
    
    //Browser doesn't support Geolocation
    function handleLocationError(browserHasGeolocation, infoWindow, pos) {
        infoWindow.setPosition(pos);
        infoWindow.setContent(browserHasGeolocation ?
                              'Error: The Geolocation service failed.' :
                              'Error: Your browser doesn\'t support geolocation.');
    }


   
  // console.log(place.name);

  // Listen for click on map
    google.maps.event.addListener(map, 'click', function(event){
        const coords = event.latLng;
        lat = parseFloat(event.latLng.lat()); // parseFloat : decimal transformation
        long = parseFloat(event.latLng.lng());
        
        
        //Add google street view
        const urlStreetView = 'https://maps.googleapis.com/maps/api/streetview?'+
            'size=' + streetView.size +
            '&location=' + lat + ',' + long +
            '&key=' + streetView.key;
        // Insert on popup window
        $('#street-view').attr('src', urlStreetView);

        // modal link : https://www.w3schools.com/howto/howto_css_modals.asp
        // Get the modal
        var modal = document.getElementById('myModal');

        // Get the <span> element that closes the modal
        var span = document.getElementsByClassName("close")[0];

        // When the user clicks on the button, open the modal
        modal.style.display = "block";

        // When the user clicks on <span> (x), close the modal
        span.onclick = function() {
            modal.style.display = "none";
        };

        // When the user clicks anywhere outside of the modal, close it
        window.onclick = function(event) {
            if (event.target == modal) {
                modal.style.display = "none";
            }
        }; 
        let adress;
        // Insert adress to popup window
        const geocoder = new google.maps.Geocoder();
        geocoder.geocode({ 'latLng': coords }, function(results, status) {
          if (status == google.maps.GeocoderStatus.OK) {
            if (results[0]) {
                   adress = results[0].formatted_address;
                  $("#adressLocation").text(adress);
              }
          }
        });

        $('#myModal').on('click', '.submitNewRestaurant', function(){
          let newRestaurant = $('#addRestaurant').val();
          const length = restaurants.length;
           if (newRestaurant != '') {
             // add new restaurant 
             restaurants[length] = {
               "restaurantName":newRestaurant,
               "address": adress,
               "lat":lat,
               "long":long,
               "ratings":[]
             };
             console.log(restaurants);
             restaurantList(length);
             drawMarker(map, lat, long, restaurants[length].restaurantName);
             $('#averageComment'+length).text(0);
             $('#nbComment'+length).text("0 avis");
             modal.style.display = "none";
           } else {
             $('#emptyName').removeClass().addClass('alert alert-danger')
               .text('Veuillez entrer le nom de votre restaurant')
               .show(500).delay(3000).hide(500);
           }
           
         });
    });
    
displayRestaurant();
}


//load the JSON file and display markers on map maching thr location
function displayRestaurant() {
  for (let index = 0; index < restaurants.length; index++) {
     let restaurant = restaurants[index]; 
     const element = restaurants[index].restaurantName;
     restaurantList(index);
     addComments(restaurant, index);
     drawMarker(map, restaurant.lat, restaurant.long, element);
   }
 }

 // Function to draw marker 
 function drawMarker(map, latitude,longitude, element){
  const iconRest = 'img/restaurant_icon.png';
  let iMarker = markers.length;
  markers[iMarker] = new google.maps.Marker({
    position: {lat:parseFloat(latitude),lng:parseFloat(longitude)},
    map: map,
    draggable: true,
    icon: iconRest
  });
  let infoWindow = new google.maps.InfoWindow({
    content: '<h4>' + element + '</h4>'
  });

  markers[iMarker].addListener('click', function(){
    infoWindow.open(map, markers[iMarker]);
  });
}

// custom icon for current location
function drawMarkerCurrentLocation(map, position){
  const img = 'http://www.robotwoods.com/dev/misc/bluecircle.png';
  let marker = new google.maps.Marker({
    position: position,
    icon: img,
    draggable: true,
    map: map
  });
  marker.setAnimation(google.maps.Animation.BOUNCE);
}
