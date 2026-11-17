const filmSelect = document.getElementById("film-select");
const refreshButton = document.getElementById("refresh-films");
const apiStatus = document.getElementById("api-status");
const filmDetails = document.getElementById("film-details");
let films = [];

function showFilm() {
    const film = films[Number(filmSelect.value)];
    document.getElementById("film-title").textContent = film.title;
    document.getElementById("film-description").textContent = film.description;
    document.getElementById("film-director").textContent = film.director;
    document.getElementById("film-year").textContent = film.release_date;
    document.getElementById("film-time").textContent = film.running_time + " min";
    document.getElementById("film-score").textContent = film.rt_score + " / 100";
    filmDetails.hidden = false;
}

async function loadFilms() {
    apiStatus.textContent = "Loading films…";
    refreshButton.disabled = true;
    filmSelect.disabled = true;
    filmDetails.hidden = true;
    filmSelect.textContent = "";
    films = [];

    try {
        const response = await fetch("https://ghibliapi.vercel.app/films");
        if (!response.ok) {
            throw new Error("The request failed.");
        }
        films = await response.json();
        if (!Array.isArray(films) || films.length === 0) {
            throw new Error("No film data was returned.");
        }

        for (let i = 0; i < films.length; i++) {
            if (!films[i] || !films[i].title || !films[i].description) {
                throw new Error("Incomplete film data.");
            }
            const option = document.createElement("option");
            option.value = i;
            option.textContent = films[i].title;
            filmSelect.appendChild(option);
        }
        filmSelect.disabled = false;
        showFilm();
        apiStatus.textContent = films.length + " films loaded. Choose a title to explore.";
    } catch (error) {
        filmSelect.textContent = "";
        filmDetails.hidden = true;
        filmSelect.disabled = true;
        apiStatus.textContent = "Films are unavailable. Check your connection and press Refresh films to try again.";
    } finally {
        refreshButton.disabled = false;
    }
}

filmSelect.addEventListener("change", showFilm);
refreshButton.addEventListener("click", loadFilms);
loadFilms();