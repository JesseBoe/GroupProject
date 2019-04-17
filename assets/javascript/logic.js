
$(document).ready(function () {

    //The base sure for spoonacular.
    var spoonacularBaseURL = 'https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/search/?mashape-key=b2a438b504msh5c44b66f387d373p1fbdadjsn9a8aa9582250';
    var spoonacularSearchByIdURL = 'https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/';
    var listOfOnPageIds = [];

    //We can use this for input validation
    var geographicalCusineList = ['African', 'Chinese', 'Japanese', 'Korean', 'Vietnamese', 'Thai', 'Indian', 'British', 'Irish', 'French', 'Italian', 'Mexican', 'Spanish', 'Middle Eastern', 'Jewish', 'American', 'Cajun', 'Southern', 'Greek', 'German', 'Nordic', 'Eastern European', 'Caribbean', 'Latin American'];
    var foodTypeList = ['Main Course', 'Lunch', 'Side Dish', 'Dessert', 'Appetizer', 'Salad', 'Bread', 'Breakfast', 'Soup', 'Beverage', 'Sauce', 'Drink'];
    var recipesCount = 0;

    // this adds the cuisine drop down options in our html
    for (var i =0; i < geographicalCusineList.length; i++) {
        $('.cuisine-select').append('<option value='+geographicalCusineList[i]+'>'+geographicalCusineList[i]+'</option>');
    }

    // when the submit button is clicked, grab these values
    $("#submit-button").on("click", function () {
        event.preventDefault();

        if (checkInput($('#query-input').val(), $('.cuisine-select').val(), $('.type-select').val(), 6)) 
        {
            listOfOnPageIds.forEach(element => {
                $('#card-' + element).remove();
            });
            listOfOnPageIds = [];
            SearchSpoonacular($('#query-input').val(), $('.cuisine-select').val(), $('.type-select').val(), 6);
            // calling the display youtube playlists function while outlining cuisineInput variable
            displayYoutubePlaylists($('.cuisine-select').val() + " music");
        }
    })

    //Search spoonacular and retrieve information about dishes. 
    //query: dish name.
    //cuisine: location it comes from.
    //type: One of the following: main course, side dish, dessert, appetizer, salad, bread, breakfast, soup, beverage, sauce, or drink.
    //offset: Unused at this point in time. Maybe look into lazy loading cards as the user srolls down? This is probably pretty complicated for both code and front end
    function checkInput(query, cuisine, type, numberToGet) 
    {
        var valid = true;
        console.log(geographicalCusineList.indexOf($('.cuisine-select').val()));
        if (geographicalCusineList.indexOf($('.cuisine-select').val()) == -1) {
            setInvalid($('.cuisine-select'));
            valid = false;
        }
        else {
            setValid($('.cuisine-select'));
        }
        if (foodTypeList.indexOf($('.type-select').val()) == -1) {
            setInvalid($('.type-select'));
            valid = false;
        }
        else {
            setValid($('.type-select'));
        }
        if (numberToGet <= 0) {
            //This doesnt happen unless someone is really messing with our website.
            alert("Please use a number higher than 0");
            valid = false;
        }

        return valid;
    }

    function SearchSpoonacular(query, cuisine, type, numberToGet) {

        if (query == undefined) {
            query = "";
        }

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

            if (response.image == "" || response.imageType == "") {
                //The database fed us some bad data. Lets just skip over it.
            }
            else {

                console.log(response);
                var col = recipesCount % 2 == 0 ? "leftRecipes" : "rightRecipes";

                //I wonder if there is a better way to procedurally make DOM elements? I mean, I guess this works fine.

                var thing = $('<div class="card" id="card-' + id + '"> <img class="card-img-top" src="' + response.image + '"> <div class="card-header text-center" id="headingOne"> <h1 class="recipe-title-area"> <a class="btn btn-link" data-toggle="collapse" data-target="#collapse' + id + '" aria-expanded="true" aria-controls="collapse' + id + '"> <span id="recipe-name">' + response.title + '</span><br> <div class="row d-flex"> <div class="p-2 flex-fill" id="servings"> Rating: <span id="recipe-servings">' + response.spoonacularScore +'</span> </div> <div class="p-2 flex-fill" id="time"> Cook Time: <span id="recipe-time">' + response.readyInMinutes + ' Minutes</span> </div> </div> </a> </h1> </div> <div id="collapse' + id + '" class="collapse" aria-labelledby="heading' + id + '" data-parent="#accordion"> <div class="card-body d-flex justify-content-center"> <i class="fas fa-link ml-4 mr-4" id = "link-' + id + '" style="font-size : 48px; color : rgb(27, 25, 25);"></i> <i class="fas fa-clipboard-list ml-4 mr-4" id = "recipe-' + id + '" style="font-size : 48px; color : rgb(137, 233, 128)"></i> <i class="far fa-heart ml-4 mr-4" id = "favorite-' + id +'" style="font-size : 48px; color : rgb(228, 92, 92)"></i> </div> </div> </div>')

                thing.appendTo($('.' + col));
                listOfOnPageIds.push(id);
                recipesCount++;

                //TODO: Make it so buttons look more clickable

                $('#link-' + id).on("click", function () {
                    console.log("Link: " + id);
                    window.open(response.spoonacularSourceUrl, '_blank')
                })
                $('#recipe-' + id).on("click", function() {
                    console.log("Recipe: " + id);
                    //$('#recipe-' + id).attr('data', response.instructions);
                    //TODO: Add some Module thingy thing
                })
                $('#favorite-' + id).on("click", function(){
                    console.log("Favorite: " + id);
                    toggleHeart($('#favorite-' + id));

                    
                    //TODO: Add firebase something something
                })
            }
        })
    }

    function displayYoutubePlaylists(cuisineInput) {
        $('.youtube-playlists').empty();

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
            var playlistContainer = $('<span class="playlist-container" id="playlist-name"></span>');
            

            // for every response (playlist) returned:
            for (var i = 0; i < response.items.length; i++) {

                // get the playlist IDs from the youtube API
                var playlistID = response.items[i].id.playlistId;
                var playlistHeader = response.items[i].snippet.title;

                // embed youtube playlist into HTML card
                playlist.append(playlistContainer);
                playlistContainer.append(playlistHeader);
                playlistContainer.append('<iframe width="100%" height="100%" src="https://www.youtube.com/embed/videoseries?list=' + playlistID + '" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>');
            };
        });
    }

    function setValid($element) {
        $element.removeClass('is-invalid');
        $element.addClass('is-valid');
    }
    function setInvalid($element) {
        $element.removeClass('is-valid');
        $element.addClass('is-invalid');
    }

    function toggleHeart($element){
        if ($element.hasClass('fas')) {
            $element.removeClass('fas').addClass('far');
        }
        else if ($element.hasClass('far')) {
            $element.removeClass('far').addClass('fas');
        }
    }
})
