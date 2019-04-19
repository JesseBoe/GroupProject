$(document).ready(function () {

    //The base urls for spoonacular.
    var spoonacularBaseURL = 'https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/search/?mashape-key=b2a438b504msh5c44b66f387d373p1fbdadjsn9a8aa9582250';
    var spoonacularSearchByIdURL = 'https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/';
    //Used for keeping track of recipe ids for removing
    var listOfOnPageIds = [];

    //We can use this for input validation
    var geographicalCusineList = ['African', 'Chinese', 'Japanese', 'Korean', 'Vietnamese', 'Thai', 'Indian', 'British', 'Irish', 'French', 'Italian', 'Mexican', 'Spanish', 'Middle Eastern', 'Jewish', 'American', 'Cajun', 'Southern', 'Greek', 'German', 'Nordic', 'Eastern European', 'Caribbean', "Latin American"];
    var foodTypeList = ['Main Course', 'Lunch', 'Side Dish', 'Dessert', 'Appetizer', 'Salad', 'Bread', 'Breakfast', 'Soup', 'Beverage', 'Sauce', 'Drink'];
    //This variable is used for calculating if cards should be appened on the left or right
    var recipesCount = 0;
    //Used as a parameter in our ajax calls
    var offset = 0;
    
    //While lazyloadflag is true, the user can trigger more things to load, by scrolling to the bottom of the page
    var lazyLoadFlag = false;
    var pageTokenID;

    //Stores the most recent valid search in an object (.query .cuisine .type .numberToGet)
    var currentSearch;

    var curUser;
    var localFavoriteIds = [1];

    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            curUser = firebase.auth().currentUser;
            //Logged In. Start listening to serverside changes.
            

            db.ref('users/' + curUser.uid).update({
                email: curUser.email
            });

            db.ref('users/' + curUser.uid).child("favorites").once("value", snapshot => {

                if (!snapshot.exists()) {
                    db.ref('users/' + curUser.uid).update({
                        favorites: { 100: true }
                    });
                }

                db.ref('users/' + curUser.uid).child("favorites").on("value", snapshot => {
                    localFavoriteIds = [];
                    snapshot.forEach(function (snap) {
                        console.log(snap.val());
                        localFavoriteIds.push(snap.val());
                    })
                    console.log("Final: " + localFavoriteIds);
                });
            });
        }
    })

    // this adds the cuisine drop down options in our html
    for (var i = 0; i < geographicalCusineList.length; i++) {
        $('.cuisine-select').append(`<option value="${geographicalCusineList[i]}">${geographicalCusineList[i]}</option>`);
    }

    // when the submit button is clicked, grab these values
    $("#submit-button").on("click", function () {
        event.preventDefault();

        if (checkInput($('#query-input').val(), $('.cuisine-select').val(), $('.type-select').val(), 6)) {
            currentSearch = { 'query': $('#query-input').val(), 'cuisine': $('.cuisine-select').val(), 'type': $('.type-select').val(), 'numberToGet': 6 };
            console.log(currentSearch);
            listOfOnPageIds.forEach(element => {
                $('#card-' + element).remove();
            });
            $('.youtube-playlists').empty();
            listOfOnPageIds = [];
            recipesCount = 0;
            offset = 0;
            SearchSpoonacular(currentSearch.query, currentSearch.cuisine, currentSearch.type, 6);
            // calling the display youtube playlists function while outlining cuisineInput variable
            displayYoutubePlaylists(currentSearch.cuisine + " music");
        }
    })

    //Search spoonacular and retrieve information about dishes. 
    //query: dish name.
    //cuisine: location it comes from.
    //type: One of the following: main course, side dish, dessert, appetizer, salad, bread, breakfast, soup, beverage, sauce, or drink.
    //offset: Unused at this point in time. Maybe look into lazy loading cards as the user srolls down? This is probably pretty complicated for both code and front end
    function checkInput(query, cuisine, type, numberToGet) {
        var valid = true;

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

        var tempUrl = spoonacularBaseURL;

        if (query == undefined) {
            query = "";
        }
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
        tempUrl += "&offset=" + (offset * numberToGet);
        if (offset < 5) {
            $.ajax({
                Method: 'GET',
                url: tempUrl
            }).then(function (response) {
                response.results.forEach(element => {
                    GetSpoonacularGetById(element.id);
                });
            }).done(function () {
                lazyLoadFlag = true;
            })
        }
    }

    function GetSpoonacularGetById(id) {
        $.ajax({
            Method: 'GET',
            url: spoonacularSearchByIdURL + id + "/information?mashape-key=b2a438b504msh5c44b66f387d373p1fbdadjsn9a8aa9582250"
        }).then(function (response) {

            if (response.image == "" || response.imageType == "") {
                //The database fed us some bad data. Lets just skip over it.
            }
            else if (response.instructions == "") {
                //More garbage
            }
            else {

                var col = recipesCount % 2 == 0 ? "leftRecipes" : "rightRecipes";

                //I wonder if there is a better way to procedurally make DOM elements? I mean, I guess this works fine.

                var thing = $('<div class="card" id="card-' + id + '"> <img class="card-img-top" src="' + response.image + '"> <div class="card-header text-center" id="headingOne"> <h1 class="recipe-title-area"> <a class="btn btn-link" data-toggle="collapse" data-target="#collapse' + id + '" aria-expanded="true" aria-controls="collapse' + id + '"> <span id="recipe-name">' + response.title + '</span><br> <div class="row d-flex"> <div class="p-2 flex-fill" id="servings"> Serves: <span id="recipe-servings">6</span> </div> <div class="p-2 flex-fill" id="time"> Cook Time: <span id="recipe-time">' + response.readyInMinutes + ' Minutes</span> </div> </div> </a> </h1> </div> <div id="collapse' + id + '" class="collapse" aria-labelledby="heading' + id + '" data-parent="#accordion"> <div class="card-body d-flex justify-content-center"> <i class="fas fa-link ml-4 mr-4" id = "link-' + id + '" style="font-size : 48px; color : rgb(27, 25, 25);"></i> <i class="fas fa-clipboard-list ml-4 mr-4" id = "recipe-' + id + '" style="font-size : 48px; color : rgb(137, 233, 128)" data-toggle="modal" data-target="#exampleModalCenter"></i> <i class="far fa-heart ml-4 mr-4" id = "favorite-' + id + '" style="font-size : 48px; color : rgb(228, 92, 92)"></i> </div> </div> </div>')

                if (localFavoriteIds.includes(id)) {
                    toggleHeart($('#favorite-' + id));
                }

                thing.appendTo($('.' + col));
                listOfOnPageIds.push(id);
                recipesCount++;

                $('#link-' + id).on("click", function () {
                    console.log("Link: " + id);
                    window.open(response.spoonacularSourceUrl, '_blank')
                })

                // This is the click that pops up your instructions modal.
                $('#recipe-' + id).on("click", function () {
                    console.log("Recipe: " + id);
                    $("#recipe-instructions").text(response.instructions);
                })

                $('#favorite-' + id).on("click", function () {
                    console.log("Favorite: " + id);
                    toggleHeart($('#favorite-' + id));

                    db.ref('users/' + curUser.uid).child("favorites").once("value", snapshot => {
                        db.ref("users/" + curUser.uid).child('favorites').push(id);

                        console.log("Unknown1: " + db.ref("users/" + curUser.uid).child("favorites").exists);
                        if (snapshot.child(id).exists) {
                            //Unfavorite
                            db.ref("users/" + curUser.uid + '/favorites').child(id).remove();
                        }
                        else {
                            //favorite
                            db.ref("users/" + curUser.uid).child('favorites').update({ id : true });
                        }
                    })

                })
            }
        })
    }

    function displayYoutubePlaylists(cuisineInput) {

        var youtubeAPIkey = "AIzaSyDCkqQ18w7WBh4LnZdoP62hayX7BVKXru4";
        var youtubeQueryURL = "https://www.googleapis.com/youtube/v3/search?part=snippet&q=" + cuisineInput + "&safeSearch=moderate&type=playlist&key=" + youtubeAPIkey;

        if (pageTokenID != null) {
            youtubeQueryURL += "&pageToken=" + pageTokenID;
        }
        // Creating an ajax call for when the submit button is clicked
        $.ajax({
            url: youtubeQueryURL,
            headers: { "Accept": "application/jason" },
            method: "GET"
        }).then(function (response) {
            console.log(response);

            pageTokenID = response.nextPageToken;

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

    function toggleHeart($element) {
        if ($element.hasClass('fas')) {
            $element.removeClass('fas').addClass('far');
        }
        else if ($element.hasClass('far')) {
            $element.removeClass('far').addClass('fas');
        }
    }

    $(window).scroll(function () {
        if ($(window).scrollTop() + $(window).height() > $(document).height() - 100) {
            if (currentSearch != null) {
                if (lazyLoadFlag) {
                    offset++;
                    SearchSpoonacular(currentSearch.query, currentSearch.cuisine, currentSearch.type, 6);
                    displayYoutubePlaylists(currentSearch.cuisine + " music");
                    lazyLoadFlag = false;
                }
            }
        }
    });
})
