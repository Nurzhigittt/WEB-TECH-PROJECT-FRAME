# FRAME Movie Website

**Topic:** an interactive movie guide and personal film scorecard.

FRAME extends our Web Technologies midterm website for the endterm project. The original five-page structure, dark-and-gold design, film posters and responsive layouts are retained. JavaScript and jQuery now power registration validation, live search, category filtering, a CRUD ratings table, a poster lightbox and local reviews.

**Published website:** https://nurzhigittt.github.io/WEB-TECH-MIDTERM/

**Repository:** https://github.com/Nurzhigittt/WEB-TECH-MIDTERM

## Pages and features

| Page | Features |
| --- | --- |
| Home (`index.html`) | Film introduction and club registration form with live validation. |
| Movies (`movies.html`) | Case-insensitive live search, combined genre filters, result count, empty state, reset button and Bootstrap poster gallery. |
| Ratings (`ratings.html`) | Dynamic table with Add, Read, Edit and Delete, confirmation dialog, validation and browser persistence. |
| Trailers (`trailers.html`) | Original film descriptions and links to official studio trailers. |
| Reviews (`reviews.html`) | Original editorial reviews plus a validated form to save and delete personal reviews on this device. |

### Registration and form validation

- Name, email, password and confirmation are required. Whitespace-only input is rejected.
- Email format is checked with a regular expression.
- Weak: fewer than 8 characters, or missing a letter or number.
- Medium: at least 8 characters with a letter and a number.
- Strong: at least 12 characters with uppercase, lowercase, a number and a symbol.
- Medium or Strong is required; passwords are limited to 128 characters and must match exactly.
- The strength meter updates while typing. Changing the password rechecks its confirmation.
- Field errors and success feedback update immediately; failed submissions focus the first invalid field.
- Password visibility and form reset controls are included.
- Reviews also require a name, valid email, score and nonempty message.

### Live search and filtering

Search runs on the `input` event, including typing, pasting and clearing. It matches visible movie-card text, including title, director, year and genre, regardless of case. All films, Science fiction, Thriller and Adventure buttons work together with the query. Results, count and the no-results message update without a reload.

### Dynamic table with CRUD

- **Create:** add a title, release year, genre and score through a form dialog.
- **Read:** generate the table from an array of movie objects.
- **Update:** Edit opens the same form with the existing values.
- **Delete:** a confirmation dialog offers Keep movie or Delete movie.
- Years must be whole numbers from 1888 to 2100. Scores range from 0 to 10 with at most one decimal place. Duplicate title/year pairs are rejected.
- Records use stable numeric IDs. An empty table is a valid saved state.
- `localStorage` preserves records across reloads. Storage failures display a warning and allow the current session to continue.

### Image gallery

The responsive poster grid uses Bootstrap rows and columns. Posters open in a native dialog with an enlarged image and caption. Previous/Next buttons and Left/Right arrow keys wrap around the collection. Escape, Close and a backdrop click dismiss it. jQuery `.fadeIn()` and `.fadeOut()` animate opening, closing and image changes; reduced-motion preferences disable the fades.

## Technologies

- HTML5, CSS3, Flexbox, CSS Grid and media queries.
- Bootstrap **5.3.3** CSS via the original jsDelivr CDN link, with an integrity check.
- Full jQuery **3.7.1** via the official CDN, with an integrity check. The full build includes the gallery effects; the slim build does not.
- JavaScript functions, arrays, objects, RegEx, DOM manipulation and event handlers.
- Browser APIs: `<dialog>`, `localStorage`, `matchMedia`.
- Roboto through Google Fonts with an Arial/sans-serif fallback.
- GitHub Pages static hosting. No build step, backend, API key or database is needed.

All application JavaScript is in **`js/script.js`**. jQuery loads before that file, and both scripts use `defer`. Initializers check for their page elements before running: `initRegistration`, `initSearch`, `initRatings`, `initGallery` and `initReviews`.

## Group members and individual contributions

The contribution allocation from the original midterm README is retained:

| Group member | Individual contribution |
| --- | --- |
| Duiset Nurzhigit | Home and Movies pages, navigation menu. |
| Seitkapar Magzhan | Ratings and Trailers pages, ratings table. |
| Korganbek Madiyar | Reviews page, form and responsive styles. |

Endterm functionality is documented by page above and in the corresponding initializer functions in `js/script.js`.

## Run locally

Clone this existing repository, open it in VS Code and start **Live Server** on `index.html`.

Alternatively, run `python3 -m http.server 8000` from the repository folder and open http://localhost:8000/.

Use an HTTP server or the published site for consistent browser storage behavior. No package installation is required. Internet access is needed for Bootstrap CSS, jQuery, external trailers and the optional Google Font.

## Data and accessibility

- Registration is a **client-side validation demo**, not authentication. It does not create an account or save/send the entered details. Registration and review submission stay disabled until their JavaScript handlers are ready.
- Ratings use `frame.ratings.v1`; reviews use `frame.reviews.v1` in localStorage. Records belong to this browser and website origin, not a shared server.
- Review names and messages are stored locally. Review email is checked but never saved or displayed. Passwords are never persisted.
- User-entered content is inserted with `.text()`, so HTML-like input remains plain text.
- Inputs have labels and linked feedback; status updates use live regions. Current-page indicators, a skip link and native dialog focus management support keyboard navigation.
- The ratings table scrolls within its own region on narrow screens.

## Demonstration and verification

1. **Home:** submit an empty form. Try an invalid email and mismatched passwords. Compare `abc` (Weak), `Cinema123` (Medium) and `CinemaNight123!` (Strong). Complete the form and check its success message and reset.
2. **Movies:** search `DuNe`, select Thriller for no matches, then reset. Search `Nolan` to find two films.
3. **Ratings:** add a movie, edit its score and reload. Cancel a deletion, then confirm it. Try a score above 10 and a duplicate title/year pair.
4. **Gallery:** open a poster, navigate both ways, wrap from the first to the last, and close with Escape.
5. **Reviews:** save a review and reload. HTML-like text should remain plain text. Delete through its confirmation dialog.
6. **Responsive layout:** check desktop, tablet and mobile widths. Only the ratings table should need horizontal scrolling.

The implementation was exercised in Chrome at desktop size and at 320, 390 and 768 px embedded viewports. Local HTML links, fragment targets, referenced assets and JavaScript syntax were also checked. Embedded viewport checks are not physical-device testing.

Film artwork and trailer sources are recorded in `SOURCES.txt`. Movie scores are illustrative student-project values, not IMDb ratings.
