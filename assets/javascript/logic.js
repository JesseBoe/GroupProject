$(document).ready(function(){
    
    //The base sure for spoonacular.
    var spoonacularBaseURL = 'https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/search/?mashape-key=b2a438b504msh5c44b66f387d373p1fbdadjsn9a8aa9582250';
    var spoonacularSearchByIdURL = 'https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/?mashape-key=b2a438b504msh5c44b66f387d373p1fbdadjsn9a8aa9582250';
    //We can use this for input validation
    var geographicalCusineList = ['african', 'chinese', 'japanese', 'korean', 'vietnamese', 'thai', 'indian', 'british', 'irish', 'french', 'italian', 'mexican', 'spanish', 'middle eastern', 'jewish', 'american', 'cajun', 'southern', 'greek', 'german', 'nordic', 'eastern european', 'caribbean', 'latin american'];

    //Search spoonacular and retrieve information about dishes. 
    //query: dish name.
    //cuisine: location it comes from.
    //type: One of the following: main course, side dish, dessert, appetizer, salad, bread, breakfast, soup, beverage, sauce, or drink.
    //offset: Unused at this point in time. Maybe look into lazy loading cards as the user srolls down? This is probably pretty complicated for both code and front end

    //TODO: Link this to a real button
    $("#FakeButton").on("click", function () {
        SearchSpoonacular($('#query-input').val(), $('#cuisine-input').val(), $('#type-input').val(), 1);
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
            console.log(response);

            //We need to pull all the values we need to build the card from the resonse.

            response.results.forEach(element => {
                //This is all the info we get from our AJAX call. If we want more, we can look into doing a second ajax call with the ID
                console.log(element.id);
                console.log(element.image);
                console.log(element.title);
                console.log(element.servings);
                console.log(element.readyInMinutes)

                //We will be autogenerating cards
                GetSpoonacularGetById(element.id);
            });
        })
    }

    function GetSpoonacularGetById(id) {
        $.ajax({
            Method: 'GET',
            url: spoonacularSearchByIdURL + id + "/information"
        }).then(function (response) {
            console.log(response);
        })
    }
})
