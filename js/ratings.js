const ratingInputs = document.querySelectorAll(".rating-input");
const ratingStatus = document.getElementById("rating-status");

for (let i = 0; i < ratingInputs.length; i++) {
    const saved = localStorage.getItem(ratingInputs[i].id);
    if (saved !== null) {
        ratingInputs[i].value = saved;
    }
}

document.getElementById("rating-form").addEventListener("submit", function (event) {
    event.preventDefault();
    let total = 0;
    for (let i = 0; i < ratingInputs.length; i++) {
        total = total + Number(ratingInputs[i].value);
        localStorage.setItem(ratingInputs[i].id, ratingInputs[i].value);
    }
    const average = total / ratingInputs.length;
    ratingStatus.textContent = "Ratings saved. Your average: " + average.toFixed(1) + " / 10";
});

document.getElementById("clear-ratings").addEventListener("click", function () {
    for (let i = 0; i < ratingInputs.length; i++) {
        localStorage.removeItem(ratingInputs[i].id);
        ratingInputs[i].value = "";
    }
    ratingStatus.textContent = "Your ratings have been cleared.";
});