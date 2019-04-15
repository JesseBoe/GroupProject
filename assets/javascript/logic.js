
$(document).ready(function () {

    //The base sure for spoonacular.
    var spoonacularBaseURL = 'https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/search/?mashape-key=b2a438b504msh5c44b66f387d373p1fbdadjsn9a8aa9582250';
    var spoonacularSearchByIdURL = 'https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/';

    //We can use this for input validation
    var geographicalCusineList = ['African', 'Chinese', 'Japanese', 'Korean', 'Vietnamese', 'Thai', 'Indian', 'British', 'Irish', 'French', 'Italian', 'Mexican', 'Spanish', 'Middle Eastern', 'Jewish', 'American', 'Cajun', 'Southern', 'Greek', 'German', 'Nordic', 'Eastern European', 'Caribbean', 'Latin American'];
    var recipesCount = 0;

    for (var i =0; i < geographicalCusineList.length; i++) {
        $('.cuisine-select').append('<option value='+geographicalCusineList[i]+'>'+geographicalCusineList[i]+'</option>');
    }

    //Search spoonacular and retrieve information about dishes. 
    //query: dish name.
    //cuisine: location it comes from.
    //type: One of the following: main course, side dish, dessert, appetizer, salad, bread, breakfast, soup, beverage, sauce, or drink.
    //offset: Unused at this point in time. Maybe look into lazy loading cards as the user srolls down? This is probably pretty complicated for both code and front end


    // when the submit button is clicked, grab these values
    $("#submit-button").on("click", function () {
        event.preventDefault();
        SearchSpoonacular($('#query-input').val(), $('.cuisine-select').val(), $('.type-select').val(), 6);
        // calling the display youtube playlists function while outlining cuisineInput variable
        displayYoutubePlaylists($('.cuisine-select').val() + " music");
    })

    function SearchSpoonacular(query, cuisine, type, numberToGet) {

        if (cuisine == "Choose your cuisine...") {
            cuisine = "";
        }

        if (type == "Choose your type of meal...") {
            type = "";
        }
        if (query == undefined) {
            query = "";
        }

        console.log(cuisine);
        console.log(type);
        var tempUrl = spoonacularBaseURL;

        if (query != "") {
            tempUrl += "&query=" + query;
        }
        if (cuisine != "") {
            tempUrl += "&cuisine=" + cuisine;
        }
        if (type != "") {
            tempUrl += "&type=" + type;
        }
        tempUrl += "&number=" + numberToGet;

        $.ajax({
            Method: 'GET',
            url: tempUrl
        }).then(function (response) {
            console.log(response);
            recipesCount = 0;
            response.results.forEach(element => {
                //This ajax call doesnt get us much info, but we can grab an ID and use it to get more info
                GetSpoonacularGetById(element.id);
            });
        })
    }

    function GetSpoonacularGetById(id) {
        $.ajax({
            Method: 'GET',
            url: spoonacularSearchByIdURL + id + "/information?mashape-key=b2a438b504msh5c44b66f387d373p1fbdadjsn9a8aa9582250"
        }).then(function (response) {
            console.log(response);

            if (response.image == "" || response.imageType == "") {
                //The database fed us some bad data. Lets just skip over it.
            }
            else {


                var col = recipesCount % 2 == 0 ? "leftRecipes" : "rightRecipes";

                //I wonder if there is a better way to procedurally make DOM elements? I mean, I guess this works fine.

                var thing = $('<div class="card"> <img class="card-img-top" src="' + response.image + '"> <div class="card-header text-center" id="headingOne"> <h1 class="recipe-title-area"> <a class="btn btn-link" data-toggle="collapse" data-target="#collapse' + id + '" aria-expanded="true" aria-controls="collapse' + id + '"> <span id="recipe-name">' + response.title + '</span><br> <div class="row d-flex"> <div class="p-2 flex-fill" id="servings"> Serves: <span id="recipe-servings">6</span> </div> <div class="p-2 flex-fill" id="time"> Cook Time: <span id="recipe-time">' + response.readyInMinutes + ' Minutes</span> </div> </div> </a> </h1> </div> <div id="collapse' + id + '" class="collapse" aria-labelledby="heading' + id + '" data-parent="#accordion"> <div class="card-body d-flex justify-content-center"> <i class="fas fa-link ml-4 mr-4" id = "link-' + id + '" style="font-size : 48px; color : rgb(27, 25, 25);"></i> <i class="fas fa-clipboard-list ml-4 mr-4" id = "recipe-' + id + '" style="font-size : 48px; color : rgb(137, 233, 128)"></i> <i class="fas fa-heart ml-4 mr-4" id = "favorite-' + id +'" style="font-size : 48px; color : rgb(228, 92, 92)"></i> </div> </div> </div>')

                thing.appendTo($('.' + col));
                recipesCount++;

                //TODO: Make it so buttons look more clickable

                $('#link-' + id).on("click", function () {
                    console.log("Link: " + id);
                    window.open(response.spoonacularSourceUrl, '_blank')
                })
                $('#recipe-' + id).on("click", function() {
                    console.log("Recipe: " + id);
                    //TODO: Add some Module thingy thing
                })
                $('#favorite-' + id).on("click", function(){
                    console.log("Favorite: " + id);
                    //TODO: Add firebase something something
                })
            }
        })
    }

    function displayYoutubePlaylists(cuisineInput) {
        console.log(cuisineInput);

        var youtubeAPIkey = "AIzaSyAcW6MxYGPv_DenM4MKDSBonCRQnpMWcLE";
        var youtubeQueryURL = "https://www.googleapis.com/youtube/v3/search?part=snippet&q=" + cuisineInput + "&safeSearch=moderate&type=playlist&key=" + youtubeAPIkey;

        // Creating an ajax call for when the submit button is clicked
        $.ajax({
            url: youtubeQueryURL,
            headers: { "Accept": "application/jason" },
            method: "GET"
        }).then(function (response) {
            console.log(response);

            // assigning the jquery to a variable
            var playlist = $('.youtube-playlists');

            // for every response (playlist) returned:
            for (var i = 0; i < response.items.length; i++) {

                // get the playlist IDs from the youtube API
                var playlistID = response.items[i].id.playlistId;

                // embed youtube playlist into HTML card
                playlist.prepend('<iframe width="100%" height="100%" src="https://www.youtube.com/embed/videoseries?list=' + playlistID + '" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>');
            };
        });
    }
})
