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

