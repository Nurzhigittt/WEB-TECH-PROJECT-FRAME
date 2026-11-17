// This file runs on every page. Scripts are placed after the HTML.

// 1. Theme: a CSS class changes the colours.
const themeButton = document.getElementById("theme-button");
let theme = localStorage.getItem("frame-theme");

function showTheme() {
    if (theme === "light") {
        document.body.classList.add("light");
        themeButton.textContent = "Dark mode";
    } else {
        document.body.classList.remove("light");
        themeButton.textContent = "Light mode";
    }
}

themeButton.addEventListener("click", function () {
    if (theme === "light") {
        theme = "dark";
    } else {
        theme = "light";
    }
    localStorage.setItem("frame-theme", theme);
    showTheme();
});
showTheme();

// 2. Local sign-in: only the display name is saved, never the email.
const signInButton = document.getElementById("signin-button");
const signOutButton = document.getElementById("signout-button");
const signInPanel = document.getElementById("signin-panel");
const signInForm = document.getElementById("signin-form");
const greeting = document.getElementById("greeting");
const accountStatus = document.getElementById("account-status");

function showUser() {
    const name = localStorage.getItem("frame-name");
    if (name) {
        greeting.textContent = "Hi, " + name;
        signInButton.hidden = true;
        signOutButton.hidden = false;
    } else {
        greeting.textContent = "";
        signInButton.hidden = false;
        signOutButton.hidden = true;
    }
}

signInButton.addEventListener("click", function () {
    signInPanel.hidden = false;
    signInButton.setAttribute("aria-expanded", "true");
    document.getElementById("signin-name").focus();
});

document.getElementById("cancel-signin").addEventListener("click", function () {
    signInPanel.hidden = true;
    signInButton.setAttribute("aria-expanded", "false");
    signInForm.reset();
    signInButton.focus();
});

signInForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const name = document.getElementById("signin-name").value.trim();
    if (name.length < 2) {
        document.getElementById("signin-error").textContent = "Enter at least 2 non-space characters.";
        return;
    }
    // required, minlength and type="email" also validate the HTML form.
    localStorage.setItem("frame-name", name);
    showUser();
    signInPanel.hidden = true;
    signInButton.setAttribute("aria-expanded", "false");
    signInForm.reset();
    document.getElementById("signin-error").textContent = "";
    accountStatus.textContent = "You are signed in on this browser.";
    signOutButton.focus();
});

signOutButton.addEventListener("click", function () {
    localStorage.removeItem("frame-name");
    showUser();
    accountStatus.textContent = "You are signed out.";
    signInButton.focus();
});
showUser();

// 3. jQuery FAQ: next() finds the answer just after the button.
$(".faq-question").on("click", function () {
    $(this).next(".faq-answer").stop(true, true).slideToggle(250);
    if ($(this).attr("aria-expanded") === "true") {
        $(this).attr("aria-expanded", "false");
        $(this).find("span").text("+");
    } else {
        $(this).attr("aria-expanded", "true");
        $(this).find("span").text("−");
    }
});
