/*jshint esversion: 6 */

function restaurantList(i) { 
    
        // Each street view 
        const urlStreetView = 'https://maps.googleapis.com/maps/api/streetview?'+
            'size=' + streetView.size +
            '&location=' + restaurants[i].lat + ',' + restaurants[i].long +
            '&key=' + streetView.key;
        
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
                                'TEXTE MOYENNE AVIS' +
                            '</span></strong> - ' +
                            '<span id="nbComment'+i+'">' + restaurants[i].ratings.length + ' avis</span>'+					
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

// Add comment
function addComments(restaurant, index) {
        let collapsComment = $('#collapse'+index);
        let averageComment = $('#averageComment'+index);
        let totalStars = 0;
        let rest = restaurant.ratings;  
        const comRest = rest.length;
        
        // loop showing all comments for each restaurant
        for (let i = 0; i < rest.length; i++) {
            totalStars += rest[i].stars;
            collapsComment.append(
                '<span style="color:orange; font-size:14px">' + rest[i].stars + '/5 '+'</span>'+
                '<span style="font-size:12px">\"'+ rest[i].comment+'\"</span><br/><br/>'
            ).hide();
        }
        
        // average stars for each restaurant
        let averageStars = (totalStars/comRest).toFixed(1);
        if (comRest === 0) {
            averageComment.text("0");
        } else {
            averageComment.text(averageStars);
        }
        
}
// function generateRestList() {
//     for (let i = 0; i < restaurants.length; i++) {
//         let restaurant = restaurants[i];
//         restaurantList(i);
//         addComments(restaurant, i);
//     }
// }
