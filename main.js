// My personal API Key, won't be needed with a correct auth
const apiKey = '67479981f898288f4031e28a84841f06';

const search = document.querySelector('#search');
const searchResults = document.querySelector('.search-results');
const favourites = document.querySelector('.favourites');

// Listener on search input to enable keypress validation
search.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        getMovie();
    }
});

// Retrieve and display search results from MovieDB API
const getMovie = function getMovieFromAPI() {
    fetch(`https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${search.value}&page=1&include_adult=false`)
    .then(function(response){
        return response.json();
    })
    .then(function(list) {
        let moviesList = "";
        if(list.results.length > 0)
        {
            searchResults.innerHTML = '';
            searchResults.innerHTML = `<span class="reset-search"><i class="far fa-times-circle"></i> Search : "${search.value}"</span>
            <ul class="movies-list"></ul>`;
            
            list.results.forEach(element => {
                let posterPath = (element.poster_path === null) ? "poster_not_found.jpg" : `https://image.tmdb.org/t/p/w200/${element.poster_path}`;
                moviesList += `<li class="" data-id="${element.id}">
                <img class="movie-poster" src="${posterPath}">
                <button class="favourite" onclick="addToFavourites(${element.id})";><i class="fas fa-heart"></i>  Add to favourites</i></button>
                <span class="movie-title">${element.title}</span>
                </li>`;
            }, moviesList);

            document.querySelector('.movies-list').innerHTML = moviesList;

            let reset = document.querySelector('.reset-search');
            reset.addEventListener("click", function() {
                searchResults.innerHTML = '';
            });
        }

        search.value = "";
        search.blur();
    });
}

const addToFavourites = function addSelectedMovieToFavourites(movieId) {

    // Local storage variable
    let favouritesStorage = [];

    if(localStorage.favourites != null && localStorage.favourites.length > 0) {
        let storage = JSON.parse(localStorage.favourites);
        favouritesStorage = favouritesStorage.concat(storage);
    }
    
    if(favourites.innerHTML.length === 0) {
        favourites.innerHTML = `<span class="favourites-heading">Favourites :</span><ul class="favourites-items"></ul>`;
    }

    let currentLi = document.querySelector('.search-results').querySelector(`li[data-id="${movieId}"`);
    let title = currentLi.querySelector('.movie-title').innerHTML;
    let movie = `<li data-id="${movieId}">${title}</li>`;


    if(favourites.querySelector(`li[data-id="${movieId}"]`) == null)
        document.querySelector('.favourites-items').innerHTML += movie;

    let movieInfos = {
        "id": movieId,
        "title": title
    };

    favouritesStorage.push(movieInfos);

    localStorage.setItem('favourites', JSON.stringify(favouritesStorage));
}