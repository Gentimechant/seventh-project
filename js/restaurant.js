/*jshint esversion: 6 */

// load Json into a variable
    let restaurants = (function () {
        let json = null;
        $.ajax({
            'async': false,
            'global': false,
            'url': "json/restaurant.json",
            'dataType': "json",
            'success': function (data) {
                json = data;
            }
        });
        return json;
    })();

    // let restaurants = (function () {
    //     let json = null;
    //     $.getJSON("json/restaurant.json",
    //         function (data) {
    //         json = data; 
    //         }
    //     );
    //     return json;
    // })();
    
    
    const streetView = {
        key : "AIzaSyB48K7MnLGjHOLRg8YlZVgGg2kIj2zNrXU",
        size : "300x150"	
    };

/**
 * Function to Add all restaurants to the left side
 * @param  {Object} restaurant
 * @param  {number} index
 */

function restaurantList(restaurants, i, lat, long) { 
    
         // Each street view 
         const urlStreetView = 'https://maps.googleapis.com/maps/api/streetview?size=300x150&key=' + streetView.key +
            '&location=' + lat + ',' + long;
     
     // Add restaurant list
     $('#restaurantList').append( 
         '<a class="list-group-item" id="restaurant'+i+'" data-toggle="collapse" href="#collapse'+i+'" style="position:relative;">'+
             '<div class="row">'+
                 '<div class="col-xs-4" style="height:100%;">'+ // Section for street view
                     '<img class="img-responsive" src="'+urlStreetView+'" />'+	            
                 '</div>'+
                 '<div class="clo-xs-8" id="infoRestaurant'+i+'">'+ // All information for the restaurant
                     '<h4 class="list-group-item-heading" id="nameRestaurant'+i+'">'+ restaurants[i].restaurantName +'</h4>'+
                     '<p class="list-group-item-text">'+
                         restaurants[i].address +'<br/>'+
                         '<strong><span id="averageComment'+i+'" style="color:orange; font-size:15px">'+
                             '0' +
                         '</span></strong> - ' +
                         '<span id="nbComment'+i+'"> 0 avis</span>'+					
                     '</p>'+
                 '</div>'+
                 '<div class="col-xs-12" style="padding-top:10px;">'+
                     '<div class="row">'+
                         '<div class="col-xs-2 form-group">'+ // Blue btn showing comment input group
                             '<button class="btnComment btn btn-primary" id="btnComment'+i+'" title="Ajouter un nouvel avis">'+
                                 '<span class="glyphicon glyphicon-plus"></span>'+
                             '</button>'+
                         '</div>'+
                         '<div class="col-xs-10 form-group" id="addNewComment'+i+'">'+ // Stars for rating
                             '<div class="rating-stars">'+
                                 '<ul id="stars'+i+'">' +
                                     '<li class="star" data-value="1">' +
                                         '<i class="fa fa-star fa-fw"></i>' +
                                     '</li>' +
                                     '<li class="star" data-value="2">' +
                                         '<i class="fa fa-star fa-fw"></i>' +
                                     '</li>' +
                                     '<li class="star" data-value="3">' +
                                         '<i class="fa fa-star fa-fw"></i>' +
                                     '</li>' +
                                     '<li class="star" data-value="4">' + 
                                         '<i class="fa fa-star fa-fw"></i>' +
                                     '</li>' + 
                                     '<li class="star" data-value="5">' +
                                         '<i class="fa fa-star fa-fw"></i>' + 
                                     '</li>'+
                                 '</ul>'+
                             '</div>'+
                             '<div class="input-group" id="inputComment'+i+'">'+ // Input grp
                                 '<input class="form-control" id="newComment'+i+'" name="newComment" placeholder="Donnez votre avis sur ce restaurant" value="" type="text" required>'+
                                 '<span class="input-group-btn"><button type="submit" class="btn btn-primary submitNewComment" id="submitNewComment'+i+'"><span class="glyphicon glyphicon-ok"></span></button></span>'+
                             '</div>'+
                             '<div class="alert alert-danger" style="display:none;" id="alert'+i+'" role="alert">erreur</div>'+
                         '</div>'+
                     '</div>'+		
                 '</div>'+
                 '<div class="col-xs-12 " id="collapse'+i+'"></div>'+ // All comments for each restaurant
             '</div>'+
         '</a>'
     );
    
}


// 
/**
 * Function to Add comment in the restaurant list
 * @param  {Object} restaurant
 * @param  {number} index
 */

function addComments(restaurant, index) {
        let collapsComment = $('#collapse'+index);
        let averageComment = $('#averageComment'+index);
        let nbComment = $('#nbComment'+index);
        let totalStars = 0;
        let rest = restaurant.ratings;  
        const restLength = rest.length;
        
        if (restLength === undefined || restLength === 0) {
            nbComment.text("Aucun avis");
            averageComment.text("0");
        } else {
            nbComment.text(restLength + ' avis');
           // loop showing all comments for each restaurant 
           for (let i = 0; i < rest.length; i++) {
                totalStars += rest[i].stars;
                collapsComment.append(
                    '<span style="color:orange; font-size:14px">' + rest[i].stars + '/5 '+'</span>'+
                    '<span style="font-size:12px">\"'+ rest[i].comment+'\"</span><br/><br/>'
                ).hide();
            }
            
            // average stars for each restaurant
            let averageStars = (totalStars/restLength).toFixed(1);
            if (restLength === 0) {
                averageComment.text("0");
            } else {
                averageComment.text(averageStars);
            }
        }     
}
//load the JSON file and display markers on map maching thr location
function displayRestaurant() {
    for (let index = 0; index < restaurants.length; index++) {
       let restaurant = restaurants[index]; 
       const element = restaurants[index].restaurantName;
       restaurantList(restaurants, index, restaurant.lat, restaurant.long);
       addComments(restaurant, index);
       drawMarker(map, restaurant.lat, restaurant.long, element);
    }
}

function addNearbyComments(restaurant, index) {
    let collapsComment = $('#collapse'+index);
    let rest = restaurant.ratings;  
    for (let i = 0; i < rest.length; i++) {
        collapsComment.append(
            '<span style="color:orange; font-size:14px">' + rest[i].stars + '/5 '+'</span>'+
            '<span style="font-size:12px">\"'+ rest[i].comment+'\"</span><br/><br/>'
        ).hide();
    }
}
/*
   // googlePlace
          const request = {
            location: map.getCenter(),
            radius: '1000',
            type: ['restaurant']
          };

          function callback(results, status) {
            if (status == google.maps.places.PlacesServiceStatus.OK) {
              for (let i = 0; i < results.length; i++) {
                let place = results[i];
                let place_id = place.place_id;
                const length = restaurants.length;

                  // add new restaurant by place's results
                  restaurants[length] = {
                    "restaurantName": place.name,
                    "address": place.vicinity,
                    "lat": place.geometry.location.lat(),
                    "long": place.geometry.location.lng(),
                    "ratings":[]
                  };
               
                drawMarker(map, place.geometry.location.lat(), place.geometry.location.lng(), place.name);
                restaurantList(restaurants, length);
                service.getDetails(addPlaceRequest(place_id), placeCallback(restaurants[length], length));
              }
            }
          }

            // Functions for Google details
            function addPlaceRequest(placeId) { 
              let request = {
                placeId: placeId,
                fields: ['name', 'rating', 'reviews']
              };
              return request;
            }

            function placeCallback(restaurant, index) {
              const ratings = restaurant.ratings;
              function callback(place, status) {
                if (status == google.maps.places.PlacesServiceStatus.OK) {
                  let placeRev = place.reviews;
                  // let rating = restaurant.ratings;
                  if (placeRev === undefined) {
                    $('#nbComment'+index).text('Aucun Avis');   
                } else {
                  for (let index = 0; index < placeRev.length; index++) {
                    let reviews = placeRev[index];
                    let rat = { "stars": reviews.rating, "comment": reviews.text };
                    ratings.push(rat);

                  }
                }
                  
                  // Add comment's API
                  addComments(restaurant, index); 
                }
              }
              return callback;
            }
          
          // Nearby search 
          service.nearbySearch(request, callback);

*/

/* 
function addNearby(position) {
     // googlePlace
     const request = {
      location: position,
      radius: '1000',
      type: ['restaurant']
    };

    function callback(results, status) {
      if (status == google.maps.places.PlacesServiceStatus.OK) {
        $.each(results, function(){
          const place_id = {placeId: this.place_id};
          const length = restaurants.length;

            // add new restaurant by place's results
            restaurants[length] = {
              "restaurantName": place.name,
              "address": place.vicinity,
              "lat": place.geometry.location.lat(),
              "long": place.geometry.location.lng(),
              "ratings":[]
            };
            let restaurant = restaurants[length];
            const ratings = restaurant.ratings;
          
          drawMarker(map, place.geometry.location.lat(), place.geometry.location.lng(), place.name);
          restaurantList(restaurants, length);
          service.getDetails(place_id, function (results, status) {
            if (status == google.maps.places.PlacesServiceStatus.OK) {
              let placeRev = place.reviews;
              // let rating = restaurant.ratings;
              if (placeRev === undefined) {
                $('#nbComment'+index).text('Aucun Avis');   
            } else {
              for (let index = 0; index < placeRev.length; index++) {
                let reviews = placeRev[index];
                let rat = { "stars": reviews.rating, "comment": reviews.text };
                ratings.push(rat);
  
              }
            }
              
              // Add comment's API
              addComments(restaurant, index); 
            }
          });

        });
      }
    }
    // Nearby search 
    service.nearbySearch(request, callback);
}


 /**
     * Event Listener for google map
     */

/*

    google.maps.event.addListener(map, 'click', function(event){
        const coords = event.latLng;
        lat = parseFloat(event.latLng.lat()); // parseFloat : decimal transformation
        long = parseFloat(event.latLng.lng());
        
        
        //Add google street view
        const urlStreetView = 'https://maps.googleapis.com/maps/api/streetview?'+
            'size=300x150' + 
            '&key=' + streetView.key +
            '&location=' + lat + ',' + long;
        // Insert on popup window
        $('#street-view').attr('src', urlStreetView);

        /**
         * Get the modal
         * @see  https://www.w3schools.com/howto/howto_css_modals.asp
       
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
              } else {
                window.alert('No results found');
              }
          } else {
            window.alert('Geocoder failed due to: ' + status);
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
             // Display and draw marker restaurant
             restaurantList(restaurants, length);
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
      let place = results[i];
      // console.log(place); 
      //  console.log(place.rating);
       
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
        let restaurant = restaurants[length];
        const ratings = restaurant.ratings;
        let averageComment = $('#averageComment'+length);
        let nbComment = $('#nbComment'+length);
       
       drawMarker(map, place.geometry.location.lat(), place.geometry.location.lng(), place.name);
       restaurantList(restaurants, length);
       if (place.rating != undefined) {
          averageComment.text(place.rating);
          service.getDetails(place_id, function (results, status) {
            if (status == google.maps.places.PlacesServiceStatus.OK) {
              let placeRev = results.reviews;
              nbComment.text(placeRev.length + ' avis');
             console.log(results);
             console.log(status);
             
             for (let index = 0; index < placeRev.length; index++) {
               let reviews = placeRev[index];
              //  if (reviews.reviews === undefined) {
              //   $('#nbComment'+length).text('Aucun Avis');   
              //   } else {
                  let rat = { "stars": reviews.rating, "comment": reviews.text };
                  ratings.push(rat);
                // }
             }
              
              
              // Add comment's API
              addNearbyComments(restaurant, length); 
            }
          });
       } 
      //  else{
      //   averageComment.text(0);
      //   nbComment.text('0 avis');
      //  }
       

     } // fin each results
   }
 }
 // Nearby search 
 service.nearbySearch(request, callback);
}
*/