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

const streetView = {
	key : "AIzaSyAwz_WOrMURY-oJO9R5QMH_TUDw9dtb7ss",
	size : "300x150"	
};

// let json = null;
// $.ajax({
//     type: "GET",
//     dataType: "jsonp",
//     url: 'https://maps.googleapis.com/maps/api/place/details/json?place_id=ChIJGRC76ImkrhIRTIDv0CQrvng&fields=name,rating,reviews&key=AIzaSyAwz_WOrMURY-oJO9R5QMH_TUDw9dtb7ss',
//     success: function (result) {
//         json = result;
//         console.log(json);
//     }
//   });

// const url = 'https://jsonplaceholder.typicode.com/posts';
// $.getJSON(url,
//     function (data) {
//         console.log(data);
        
//     }
// );

// const Http = new XMLHttpRequest();
// const url='https://maps.googleapis.com/maps/api/place/details/json?placeid=ChIJGRC76ImkrhIRTIDv0CQrvng&fields=name,rating,reviews&key=AIzaSyAwz_WOrMURY-oJO9R5QMH_TUDw9dtb7ss';
// Http.open("GET", url);
// Http.send();
// Http.onreadystatechange=(e)=>{
// console.log(Http.responseText);
// };

/* 
     function placeCallback(restaurant, index) { //restaurant[i]
              function callback(place, status) {
                if (status == google.maps.places.PlacesServiceStatus.OK) {
                  let reviews = place.reviews;
                  let rating = restaurant.ratings;
                  if (reviews === undefined) {
                      console.log(0);
                      $('#nbComment'+index).text('Aucun Avis');   
                  } else {
                    for (let index = 0; index < reviews.length; index++) {
                      // let reviews = place[index].reviews;
                      // ratings.push(reviews);
                      // console.log(ratings[index]);
                      
                    }
                  }
                  
                  // let rat = { "stars": place.rating, "comment": place.text };
                  console.log(place);
                  // console.log(place.reviews);
                  
                  
                  // placeDetails = place;
                  // addComments(placeDetails, i); 
                }
              }
              return callback;
            }

















*/