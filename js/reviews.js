// Reviews are a DOM exercise. New reviews last until the page is reloaded.
const reviewForm = document.getElementById("review-form");
const reviewStatus = document.getElementById("review-status");

reviewForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const name = document.getElementById("review-name").value.trim();
    const movie = document.getElementById("review-movie").value;
    const text = document.getElementById("review-text").value.trim();
    if (name.length < 2 || text.length < 10) {
        reviewStatus.textContent = "Enter a name of at least 2 characters and a review of at least 10 characters.";
        return;
    }

    const card = document.createElement("article");
    card.className = "panel";
    const title = document.createElement("h3");
    title.textContent = movie + " — " + name;
    const paragraph = document.createElement("p");
    paragraph.textContent = text;
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = "Delete review";
    button.addEventListener("click", function () {
        card.remove();
        reviewStatus.textContent = "Review deleted.";
    });

    card.appendChild(title);
    card.appendChild(paragraph);
    card.appendChild(button);
    document.getElementById("my-reviews").appendChild(card);
    reviewForm.reset();
    reviewStatus.textContent = "Review added below. It stays until you reload this page.";
});
