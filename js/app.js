/*jshint esversion: 6 */

$(function() {
    
    initMap();
    
    //Default filter at the begining (or after refresh)
    $("#minFilter, #maxFilter").prop("selectedIndex", 0);
    
    // filter function 
    /**
     * @param  {number} minFilter
     * @param  {number} maxFilter
     */
    function filterStars(minFilter, maxFilter){
        for (let i = 0; i < restaurants.length; i++) {
            let averageStars = parseFloat($('#averageComment'+ i).text());
            const restau = $('#restaurant'+ i);
            if (averageStars >= minFilter && averageStars <= maxFilter){
                restau.show();
                markers[i].setVisible(true);
            } else {
                restau.hide();
                markers[i].setVisible(false);
            }
        }
    }

    /**
     * Note: $(document) must be declared otherwise the new restaurants will not have Event Listener
     */
    // add min filter event
    $(document).on('change', '#minFilter', function(){
        let minFilter = parseInt($(this).val());
        let maxFilter = parseInt($('#maxFilter').val());
        filterStars(minFilter, maxFilter);
    });

    // add max filter event
    $(document).on('change', '#maxFilter', function(){
        let minFilter = parseInt($('#minFilter').val());
        let maxFilter = parseInt($(this).val());
        filterStars(minFilter, maxFilter);
    });

    // Event click to show comments
    $(document).on('click', '#restaurantList .btnComment', function (e) { 
        const id = $(this).attr('id').replace('btnComment','');
        $('#collapse'+id).toggle("slow");
        
    });

    $(document).on('click', '#restaurantList h4', function (e) {
        const id = $(this).attr('id').replace('nameRestaurant','');
        const name = $(this).text();
        infoWindow.open(map, markers[id]);
        infoWindow.setContent(name);
    });

    /* 1. Visualizing things on Hover  */
    $(document).on('mouseover', ".rating-stars ul li", function(){
        let onStar = parseInt($(this).data('value'), 10); // The star currently mouse on 
    
        // Now highlight all the stars that's not after the current hovered star
        $(this).parent().children('li.star').each(function(e){
        if (e < onStar) {
            $(this).addClass('hover');
        }
        else {
            $(this).removeClass('hover');
        }
        });
        
    }).on('mouseout', ".rating-stars ul li", function(){
        $(this).parent().children('li.star').each(function(e){
        $(this).removeClass('hover');
        });
    });
    
    let ratStar;
    
    /* 2. Action to perform on click */
    $(document).on('click', ".rating-stars ul li", function(){
        let onStar = parseInt($(this).data('value'), 10); // The star currently selected
        let stars = $(this).parent().children('li.star');
        for (i = 0; i < stars.length; i++) {
        $(stars[i]).removeClass('selected');
        }
        
        for (i = 0; i < onStar; i++) {
        $(stars[i]).addClass('selected');
        }
        ratStar = onStar;
    });

    // add comments and ratings
    $(document).on('click', '#restaurantList .submitNewComment', function(){
        const id = $(this).attr('id').replace('submitNewComment','');
        let onStar = $('#stars'+id).children('li.star');
        const indexRating = restaurants[id].ratings.length;
        let rating = ratStar;

        // Submit error
        if($('#newComment'+id).val() === '') {
            $('#alert'+id).removeClass().addClass('alert alert-danger')
                .text('le champ commentaire est vide ou aucune note est attribuée')
                .show(500).delay(3000).hide(500);
        } else {
            restaurants[id].ratings[indexRating] = { "stars":rating, "comment": $('#newComment'+id).val() };
            $('#collapse'+id).append(
                    '<span style="color:orange; font-size:14px">' + restaurants[id].ratings[indexRating].stars + '/5 '+'</span>'+
                    '<span style="font-size:12px">\"'+ restaurants[id].ratings[indexRating].comment+'\"</span><br/>'
            );
            // Update comments and average comment
            const averageComment = $('#averageComment'+id);
            const totComments = $('#nbComment'+id);
            let rest = restaurants[id].ratings;
            const comRest = rest.length;
            let totalStars = 0;
            for (let index = 0; index < rest.length; index++) {
                totalStars += rest[index].stars;
            }
            let averageStars = (totalStars/comRest).toFixed(1);
            averageComment.text(averageStars);
            totComments.text(comRest + ' avis');
            
            // Submit success
            $('#alert'+id).removeClass().addClass('alert alert-success')
                .text('nouvel avis enregistré avec succès')
                .show(500).delay(3000).hide(500);
            
            // Refresh input
            $('#newComment'+id).val('');
            
            // Refresh stars
            for (i = 0; i < onStar.length; i++) {
                $(onStar[i]).removeClass('selected');
            }
        }
    });

});