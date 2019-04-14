
$(document).ready(function () {

    //The base sure for spoonacular.
    var spoonacularBaseURL = 'https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/search/?mashape-key=b2a438b504msh5c44b66f387d373p1fbdadjsn9a8aa9582250';
    var spoonacularSearchByIdURL = 'https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/';

    //We can use this for input validation
    var geographicalCusineList = ['african', 'chinese', 'japanese', 'korean', 'vietnamese', 'thai', 'indian', 'british', 'irish', 'french', 'italian', 'mexican', 'spanish', 'middle eastern', 'jewish', 'american', 'cajun', 'southern', 'greek', 'german', 'nordic', 'eastern european', 'caribbean', 'latin american'];

    //Search spoonacular and retrieve information about dishes. 
    //query: dish name.
    //cuisine: location it comes from.
    //type: One of the following: main course, side dish, dessert, appetizer, salad, bread, breakfast, soup, beverage, sauce, or drink.
    //offset: Unused at this point in time. Maybe look into lazy loading cards as the user srolls down? This is probably pretty complicated for both code and front end

    //SearchSpoonacular("fish tacos", "mexican", "", 3);

    //TODO: Link this to a real button
    $("#FakeButton").on("click", function () {
        SearchSpoonacular($('#query-input').val(), $('#cuisine-input').val(), $('#type-input').val(), 3);
        // calling the display youtube playlists function while outlining cuisineInput variable
        displayYoutubePlaylists($('#cuisine-input').val() + " music");
    })

    function SearchSpoonacular(query, cuisine, type, numberToGet) {

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
        })
    }

    function displayYoutubePlaylists(cuisineInput) {

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
                playlist.append('<iframe width="100%" height="100%" src="https://www.youtube.com/embed/videoseries?list=' + playlistID + '" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>');
            };
        });
    }
    // TODO: remove this line after we have a submit button - this code is to show what the playlist will look like
    displayYoutubePlaylists("indian music");
})
