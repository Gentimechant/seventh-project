/*jshint esversion: 6 */

let markers = [];
let map, lat, long, geocoder, infoWindow; 

function initMap() { 
    // Map option
    let options = {
        zoom: 15,
        center: {lat: 43.59991108712436, lng: 1.4504528045654297}, // default position 
        zoomControlOptions: {
          style: google.maps.ZoomControlStyle.SMALL
        },
        panControlOptions: {
          style: google.maps.ZoomControlStyle.SMALL
        }
    };
    
    // New map
    map = new google.maps.Map(document.getElementById("map"), options);
    service = new google.maps.places.PlacesService(map);
    infoWindow = new google.maps.InfoWindow();
    geocoder = new google.maps.Geocoder();

   
    /**
     * Set current position as center of map
     * @see  https://developers.google.com/maps/documentation/javascript/examples/map-geolocation
     */
    
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

        // drawMarkerCurrentLocation(map, pos);
        const img = 'http://www.robotwoods.com/dev/misc/bluecircle.png';
        let marker = new google.maps.Marker({
          position: pos,
          icon: img,
          draggable: true,
          map: map
        });
        marker.setAnimation(google.maps.Animation.BOUNCE);
        
        for (let index = 0; index < markers.length; index++) {
          const marker = markers[index];
          $('#restaurant' + index).hide();
          marker.setVisible(false);
          
        }

        // Functions for Nearbysearch
        const centerMap = map.getCenter();
        addNearby(centerMap);
        
    	}, function() {
    		handleLocationError(true, infoWindow, map.getCenter());
    	});
    } else {
      // Browser doesn't support Geolocation id_place: ChIJk_Dyve2krhIRUkSPLIddWhc
      handleLocationError(false, infoWindow, map.getCenter());
    }
    
    //Browser doesn't support Geolocation
    function handleLocationError(browserHasGeolocation, infoWindow, pos) {
        infoWindow.setPosition(pos);
        infoWindow.setContent(browserHasGeolocation ?
                              'Error: The Geolocation service failed.' :
                              'Error: Your browser doesn\'t support geolocation.');
    }
}


 // Function to draw marker 
 /**
  * @param  {object} map
  * @param  {number} latitude
  * @param  {number} longitude
  * @param  {string} infoWindow_Name
  */
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
// function drawMarkerCurrentLocation(map, position){
//   const img = 'http://www.robotwoods.com/dev/misc/bluecircle.png';
//   let marker = new google.maps.Marker({
//     position: position,
//     icon: img,
//     draggable: true,
//     map: map
//   });
//   marker.setAnimation(google.maps.Animation.BOUNCE);
// }

function addNearby(position) {
  // googlePlace
  const request = {
   location: position,
   radius: '800',
   type: ['restaurant']
 };

 function callback(results, status) {
   if (status == google.maps.places.PlacesServiceStatus.OK) {
    for (let i = 0; i < results.length; i++) {
      const place = results[i];
      // const position = place.geometry.location;
      const place_id = {placeId: place.place_id};
      const length = restaurants.length;

         // add new restaurant by place's results
         restaurants[length] = {
           "restaurantName": place.name,
           "address": place.vicinity,
           "lat": place.geometry.location.lat(),
           "long": place.geometry.location.lng(),
           "ratings":[]
         };

      const restaurant = restaurants[length];
      const ratings = restaurant.ratings;

      // Drawing new marker and add restaurant
      drawMarker(map, place.geometry.location.lat(), place.geometry.location.lng(), place.name);
      restaurantList(restaurants, length, restaurant.lat, restaurant.long);
       
       
      const averageComment = $('#averageComment'+length);
      const nbComment = $('#nbComment'+length);

       if (place.rating === undefined) {
        averageComment.text(0);
        nbComment.text('0 avis');
          
       } else{
        averageComment.text(place.rating);
        service.getDetails(place_id, function (results, status) {
          if (status == google.maps.places.PlacesServiceStatus.OK) {
            let placeRev = results.reviews;
            nbComment.text(placeRev.length + ' avis');
           
           for (let index = 0; index < placeRev.length; index++) {
             let reviews = placeRev[index];
             let rat = { "stars": reviews.rating, "comment": reviews.text };
             ratings.push(rat);
            
           }
            // Add comment's API
            addNearbyComments(restaurant, length); 
          }
        });
      }

    let average = averageComment.text();
    let minFilter = parseInt($('#minFilter').val());
    let maxFilter = parseInt($('#maxFilter').val());

      if (average >= minFilter && average <= maxFilter) {
        $('#restaurant'+ length).show();
      } else {
        $('#restaurant'+ length).hide();
        markers[length].setVisible(false);
      }
      
     } //  each results
   }
 }
 // Nearby search 
 service.nearbySearch(request, callback);

}

         