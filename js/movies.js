// Show cards whose text contains the search phrase.
const movieSearch = document.getElementById("movie-search");
const movieCards = document.querySelectorAll(".movie-card");

function searchMovies() {
    const search = movieSearch.value.trim().toLowerCase();
    let count = 0;
    for (let i = 0; i < movieCards.length; i++) {
        const text = movieCards[i].textContent.toLowerCase();
        if (text.includes(search)) {
            movieCards[i].hidden = false;
            count++;
        } else {
            movieCards[i].hidden = true;
        }
    }
    document.getElementById("movie-count").textContent = count + " films found.";
}

movieSearch.addEventListener("input", searchMovies);
document.getElementById("clear-search").addEventListener("click", function () {
    movieSearch.value = "";
    searchMovies();
    movieSearch.focus();
});
