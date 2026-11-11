
"use strict";

$(document).ready(function () {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function feedback(id, message) {
        const input = $("#" + id);
        input.toggleClass("is-invalid", Boolean(message));
        input.toggleClass("is-valid", !message);
        input.attr("aria-invalid", message ? "true" : "false");
        $("#" + id + "-error").text(message || "Looks good.").toggleClass("valid-message", !message);
        return !message;
    }

    function clearFeedback(form) {
        $(form).find(".is-invalid, .is-valid").removeClass("is-invalid is-valid").removeAttr("aria-invalid");
        $(form).find(".field-message").text("").removeClass("valid-message");
    }

    function status(id, message, warning) {
        $("#" + id).text(message).toggleClass("status-warning", Boolean(warning));
    }

    function validEmail(value) {
        return value.length <= 254 && emailPattern.test(value);
    }

    function readRecords(key, defaults, validRecord) {
        try {
            const stored = localStorage.getItem(key);
            if (stored === null) return { records: defaults, warning: "" };
            const records = JSON.parse(stored);
            if (!Array.isArray(records) || !records.every(validRecord) ||
                new Set(records.map(function (record) { return record.id; })).size !== records.length) {
                throw new Error("Invalid saved data");
            }
            return { records: records, warning: "" };
        } catch (error) {
            return { records: defaults, warning: "Saved data could not be loaded. You can still work in this session." };
        }
    }

    function saveRecords(key, records) {
        try {
            localStorage.setItem(key, JSON.stringify(records));
            return true;
        } catch (error) {
            return false;
        }
    }

    function nextId(records) {
        return records.reduce(function (highest, record) { return Math.max(highest, record.id); }, 0) + 1;
    }

    $("[data-close]").on("click", function () {
        document.getElementById($(this).attr("data-close")).close();
    });
    $(".form-dialog").on("click", function (event) {
        const box = this.getBoundingClientRect();
        if (event.target === this && (event.clientX < box.left || event.clientX > box.right ||
            event.clientY < box.top || event.clientY > box.bottom)) this.close();
    });

    function initRegistration() {
        const form = document.getElementById("registration-form");
        if (!form) return;
        const ids = ["member-name", "member-email", "member-password", "member-confirm"];

        function strength(password) {
            if (!password) return 0;
            if (password.length < 8 || !/[a-z]/i.test(password) || !/[0-9]/.test(password)) return 1;
            if (password.length >= 12 && /[a-z]/.test(password) && /[A-Z]/.test(password) && /[^a-z0-9\s]/i.test(password)) return 3;
            return 2;
        }

        function showStrength() {
            const level = strength($("#member-password").val());
            $("#password-meter").val(level).attr("data-level", level);
            $("#password-strength-label").text(["Enter a password", "Weak", "Medium", "Strong"][level]);
        }

        function validate(id) {
            const value = $("#" + id).val();
            let error = "";
            if (!value.trim()) error = "This field is required.";
            else if (id === "member-name" && value.trim().length > 80) error = "Use no more than 80 characters.";
            else if (id === "member-email" && !validEmail(value.trim())) error = "Enter an email such as you@example.com.";
            else if (id === "member-password" && (strength(value) < 2 || value.length > 128)) error = "Use 8–128 characters, including a letter and a number.";
            else if (id === "member-confirm" && value !== $("#member-password").val()) error = "The passwords do not match.";
            return feedback(id, error);
        }

        ids.forEach(function (id) {
            $("#" + id).on("input blur", function () {
                status("registration-status", "");
                validate(id);
                if (id === "member-password") {
                    showStrength();
                    if ($("#member-confirm").val()) validate("member-confirm");
                }
            });
        });

        $("#password-toggle").on("click", function () {
            const visible = $(this).attr("aria-pressed") !== "true";
            $("#member-password, #member-confirm").attr("type", visible ? "text" : "password");
            $(this).attr("aria-pressed", String(visible)).text(visible ? "Hide passwords" : "Show passwords");
        });

        $(form).on("reset", function () {
            clearFeedback(form);
            status("registration-status", "");
            $("#password-meter").val(0).attr("data-level", 0);
            $("#password-strength-label").text("Enter a password");
            $("#member-password, #member-confirm").attr("type", "password");
            $("#password-toggle").attr("aria-pressed", "false").text("Show passwords");
        });

        $(form).on("submit", function (event) {
            event.preventDefault();
            const results = ids.map(validate); // Validate every field, including after the first error.
            showStrength();
            if (results.includes(false)) {
                status("registration-status", "Please correct the highlighted fields.", true);
                $(form).find(".is-invalid").first().trigger("focus");
                return;
            }
            const name = $("#member-name").val().trim();
            form.reset();
            status("registration-status", "Thanks, " + name + "! Your registration details passed all checks. This demo does not create an account or save your details.");
        });
        $(form).find("button[type='submit']").prop("disabled", false);
    }

    function initSearch() {
        if (!document.getElementById("movie-search")) return;
        let category = "all";
        function filterMovies() {
            const query = $("#movie-search").val().trim().toLowerCase();
            let count = 0;
            $(".movie-card").each(function () {
                const categories = $(this).attr("data-categories").split(" ");
                const matchesSearch = $(this).text().toLowerCase().includes(query);
                const matchesCategory = category === "all" || categories.includes(category);
                const visible = matchesSearch && matchesCategory;
                $(this).prop("hidden", !visible);
                if (visible) count++;
            });
            $("#search-count").text(count + (count === 1 ? " film" : " films") + " found");
            $("#search-empty").prop("hidden", count !== 0);
        }
        $("#movie-search").on("input", filterMovies);
        $(".filter-button").on("click", function () {
            category = $(this).attr("data-category");
            $(".filter-button").removeClass("active").attr("aria-pressed", "false");
            $(this).addClass("active").attr("aria-pressed", "true");
            filterMovies();
        });
        $("#reset-filters").on("click", function () {
            $("#movie-search").val("");
            $(".filter-button[data-category='all']").trigger("click");
            $("#movie-search").trigger("focus");
        });
        filterMovies();
    }

    function initRatings() {
        if (!document.getElementById("ratings-body")) return;
        const storageKey = "frame.ratings.v1";
        const genres = $("#rating-genre option").map(function () { return this.value; }).get().filter(Boolean);
        const initial = [
            { id: 1, title: "Interstellar", year: 2014, genre: "Science fiction", score: 9 },
            { id: 2, title: "Inception", year: 2010, genre: "Thriller", score: 8.8 },
            { id: 3, title: "Dune", year: 2021, genre: "Adventure", score: 8.3 }
        ];
        const loaded = readRecords(storageKey, initial, function (item) {
            return item && Number.isSafeInteger(item.id) && item.id > 0 && item.id < 1e12 &&
                typeof item.title === "string" && item.title.trim().length > 0 && item.title.length <= 100 &&
                Number.isInteger(item.year) && item.year >= 1888 && item.year <= 2100 && genres.includes(item.genre) &&
                Number.isFinite(item.score) && item.score >= 0 && item.score <= 10;
        });
        let records = loaded.records;
        let editId = null;
        let deleteId = null;
        const form = document.getElementById("movie-form");
        const dialog = document.getElementById("movie-dialog");
        const deleteDialog = document.getElementById("delete-dialog");
        const fields = ["rating-title", "rating-year", "rating-score", "rating-genre"];

        function renderRatings() {
            const body = $("#ratings-body").empty();
            records.forEach(function (movie, index) {
                const row = $("<tr>");
                $("<td>").text(String(index + 1).padStart(2, "0")).appendTo(row);
                $("<th>").attr("scope", "row").text(movie.title).appendTo(row);
                $("<td>").text(movie.year).appendTo(row);
                $("<td>").text(movie.genre).appendTo(row);
                $("<td>").addClass("rating-score").text(movie.score.toFixed(1) + " / 10").appendTo(row);
                const actions = $("<td>").addClass("row-actions");
                $("<button>").attr({ type: "button", "data-id": movie.id, "aria-label": "Edit " + movie.title }).addClass("row-edit plain-button").text("Edit").appendTo(actions);
                $("<button>").attr({ type: "button", "data-id": movie.id, "aria-label": "Delete " + movie.title }).addClass("row-delete plain-button danger-text").text("Delete").appendTo(actions);
                row.append(actions).appendTo(body);
            });
            if (!records.length) $("<tr>").append($("<td>").attr("colspan", 6).addClass("empty-table").text("Your scorecard is empty. Add a movie to get started.")).appendTo(body);
            $("#ratings-count").text(records.length + (records.length === 1 ? " movie" : " movies") + " in your scorecard");
        }

        function persist(message) {
            const saved = saveRecords(storageKey, records);
            status("ratings-status", message + (saved ? " Saved in this browser." : " Browser storage is unavailable; this change lasts only for this session."), !saved);
            renderRatings();
        }

        function openEditor(movie) {
            form.reset();
            clearFeedback(form);
            editId = movie ? movie.id : null;
            $("#movie-dialog-title").text(movie ? "Edit movie" : "Add a movie");
            $("#save-movie").text(movie ? "Save changes" : "Add movie");
            if (movie) {
                $("#rating-title").val(movie.title);
                $("#rating-year").val(movie.year);
                $("#rating-genre").val(movie.genre);
                $("#rating-score").val(movie.score);
            }
            dialog.showModal();
            $("#rating-title").trigger("focus");
        }

        function validate(id) {
            const value = $("#" + id).val().trim();
            let error = "";
            if (!value) error = "This field is required.";
            else if (id === "rating-title" && value.length > 100) error = "Use no more than 100 characters.";
            else if (id === "rating-year" && (!/^\d{4}$/.test(value) || Number(value) < 1888 || Number(value) > 2100)) error = "Enter a whole year from 1888 to 2100.";
            else if (id === "rating-score" && (!/^\d+(\.\d)?$/.test(value) || Number(value) > 10)) error = "Enter a score from 0 to 10 with at most one decimal place.";
            else if (id === "rating-genre" && !genres.includes(value)) error = "Choose a genre from the list.";
            return feedback(id, error);
        }

        fields.forEach(function (id) { $("#" + id).on("input change blur", function () { validate(id); }); });
        $("#add-movie").on("click", function () { openEditor(null); });
        $("#ratings-body").on("click", ".row-edit", function () {
            const id = Number($(this).attr("data-id"));
            openEditor(records.find(function (movie) { return movie.id === id; }));
        });
        $("#ratings-body").on("click", ".row-delete", function () {
            deleteId = Number($(this).attr("data-id"));
            const movie = records.find(function (item) { return item.id === deleteId; });
            $("#delete-description").text('Remove “' + movie.title + '” from your scorecard? This cannot be undone.');
            deleteDialog.showModal();
        });
        $("#confirm-delete").on("click", function () {
            records = records.filter(function (movie) { return movie.id !== deleteId; });
            deleteDialog.close();
            persist("Movie deleted.");
            $("#add-movie").trigger("focus");
        });
        $(form).on("submit", function (event) {
            event.preventDefault();
            const valid = fields.map(validate).every(Boolean);
            if (!valid) { $(form).find(".is-invalid").first().trigger("focus"); return; }
            const title = $("#rating-title").val().trim();
            const year = Number($("#rating-year").val());
            if (records.some(function (movie) { return movie.id !== editId && movie.title.toLowerCase() === title.toLowerCase() && movie.year === year; })) {
                feedback("rating-title", "This movie and year are already in your scorecard. Edit the existing entry.");
                $("#rating-title").trigger("focus");
                return;
            }
            const movie = { id: editId === null ? nextId(records) : editId, title: title, year: year,
                genre: $("#rating-genre").val(), score: Number($("#rating-score").val()) };
            if (editId === null) records.push(movie);
            else records = records.map(function (item) { return item.id === editId ? movie : item; });
            dialog.close();
            persist(editId === null ? "Movie added." : "Movie updated.");
            $("#add-movie").trigger("focus");
        });
        renderRatings();
        if (loaded.warning) status("ratings-status", loaded.warning, true);
    }

    function initGallery() {
        const dialog = document.getElementById("lightbox");
        if (!dialog) return;
        const posters = $(".gallery-item").map(function () {
            return { src: $(this).find("img").attr("src"), title: $(this).attr("data-title") };
        }).get();
        let current = 0;
        let opener = null;
        let closing = false;
        const duration = reducedMotion ? 0 : 180;
        function paintPoster() {
            const poster = posters[current];
            $("#lightbox-image").attr({ src: poster.src, alt: poster.title + " film poster" });
            $("#lightbox-caption").text(poster.title + " · " + (current + 1) + " / " + posters.length);
        }
        function move(direction) {
            if (closing) return;
            $("#lightbox-image").stop(true, true);
            current = (current + direction + posters.length) % posters.length;
            $("#lightbox-image").fadeOut(duration, function () { paintPoster(); $(this).fadeIn(duration); });
        }
        function closeGallery() {
            if (closing) return;
            closing = true;
            $("#lightbox-image").stop(true, true);
            $(".lightbox-panel").stop(true, true).fadeOut(duration, function () {
                dialog.close();
                closing = false;
                if (opener) opener.focus();
            });
        }
        $(".gallery-item").on("click", function () {
            current = Number($(this).attr("data-gallery-index"));
            opener = this;
            paintPoster();
            $("#lightbox-image").show();
            dialog.showModal();
            $(".lightbox-panel").hide().fadeIn(duration);
            $("#lightbox-close").trigger("focus");
        });
        $("#lightbox-prev").on("click", function () { move(-1); });
        $("#lightbox-next").on("click", function () { move(1); });
        $("#lightbox-close").on("click", closeGallery);
        $(dialog).on("cancel", function (event) { event.preventDefault(); closeGallery(); });
        $(dialog).on("click", function (event) { if (event.target === dialog) closeGallery(); });
        $(dialog).on("keydown", function (event) {
            if (event.key === "ArrowLeft") { event.preventDefault(); move(-1); }
            if (event.key === "ArrowRight") { event.preventDefault(); move(1); }
        });
        $(dialog).on("close", function () { $("#lightbox-image").stop(true, true); });
    }

    function initReviews() {
        const form = document.getElementById("review-form");
        if (!form) return;
        const storageKey = "frame.reviews.v1";
        const titles = ["Interstellar", "Inception", "Dune"];
        const loaded = readRecords(storageKey, [], function (review) {
            return review && Number.isSafeInteger(review.id) && review.id > 0 && review.id < 1e12 &&
                typeof review.name === "string" && review.name.trim().length > 0 && review.name.length <= 80 &&
                typeof review.text === "string" && review.text.trim().length > 0 && review.text.length <= 1000 &&
                titles.includes(review.movie) && Number.isInteger(review.score) && review.score >= 1 && review.score <= 10;
        });
        let reviews = loaded.records;
        let deleteId = null;
        const fields = ["reviewer", "review-email", "score", "review"];
        const deleteDialog = document.getElementById("delete-review-dialog");

        function renderReviews() {
            const list = $("#personal-reviews-list").empty();
            if (!reviews.length) $("<p>").addClass("muted").text("No reviews yet. Tell us about a film that stayed with you.").appendTo(list);
            reviews.slice().reverse().forEach(function (review) {
                const article = $("<article>").addClass("review-item personal-review");
                const heading = $("<div>").addClass("review-heading");
                $("<h3>").text(review.movie).appendTo(heading);
                $("<span>").addClass("rating-score").text(review.score + " / 10").appendTo(heading);
                article.append(heading);
                $("<p>").addClass("review-text").text(review.text).appendTo(article);
                $("<p>").addClass("muted").text("By " + review.name + " · Saved on this device").appendTo(article);
                $("<button>").attr({ type: "button", "data-id": review.id, "aria-label": "Delete your review of " + review.movie }).addClass("plain-button delete-review danger-text").text("Delete review").appendTo(article);
                article.appendTo(list);
            });
        }

        function validate(id) {
            const value = $("#" + id).val().trim();
            let error = "";
            if (!value) error = "This field is required.";
            else if (id === "review-email" && !validEmail(value)) error = "Enter an email such as you@example.com.";
            else if (id === "reviewer" && value.length > 80) error = "Use no more than 80 characters.";
            else if (id === "score" && (!Number.isInteger(Number(value)) || Number(value) < 1 || Number(value) > 10)) error = "Choose a score from 1 to 10.";
            else if (id === "review" && value.length > 1000) error = "Use no more than 1000 characters.";
            return feedback(id, error);
        }
        fields.forEach(function (id) {
            $("#" + id).on("input change blur", function () {
                status("review-status", "");
                validate(id);
                if (id === "review") $("#review-length").text($(this).val().length + " / 1000 characters");
            });
        });
        $(form).on("reset", function () {
            clearFeedback(form);
            status("review-status", "");
            $("#review-length").text("0 / 1000 characters");
        });
        $(form).on("submit", function (event) {
            event.preventDefault();
            const valid = fields.map(validate).every(Boolean);
            if (!valid) { $(form).find(".is-invalid").first().trigger("focus"); return; }
            const movie = $("#movie").val();
            if (!titles.includes(movie)) return;
            reviews.push({ id: nextId(reviews), name: $("#reviewer").val().trim(), movie: movie,
                score: Number($("#score").val()), text: $("#review").val().trim() });
            const saved = saveRecords(storageKey, reviews);
            form.reset();
            renderReviews();
            status("review-status", saved ? "Review saved in this browser. It is not posted publicly." : "Review added for this session. Browser storage is unavailable.", !saved);
        });
        $("#personal-reviews-list").on("click", ".delete-review", function () {
            deleteId = Number($(this).attr("data-id"));
            const review = reviews.find(function (item) { return item.id === deleteId; });
            $("#delete-review-description").text('Remove your review of “' + review.movie + '”? This cannot be undone.');
            deleteDialog.showModal();
        });
        $("#confirm-delete-review").on("click", function () {
            reviews = reviews.filter(function (review) { return review.id !== deleteId; });
            const saved = saveRecords(storageKey, reviews);
            deleteDialog.close();
            renderReviews();
            status("review-status", saved ? "Review deleted." : "Deleted for this session only. Browser storage is unavailable.", !saved);
            $("#reviewer").trigger("focus");
        });
        renderReviews();
        if (loaded.warning) status("review-status", loaded.warning, true);
        $(form).find("button[type='submit']").prop("disabled", false);
    }

    initRegistration();
    initSearch();
    initRatings();
    initGallery();
    initReviews();
});
