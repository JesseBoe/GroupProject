
$(document).ready(function(){
    
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
})
