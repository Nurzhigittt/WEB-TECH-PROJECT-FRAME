# FRAME simplified version — verification

Date: 17 November 2026. Environment: local HTTP preview in cloud Chromium.
These results refer to this source package, not to GitHub Pages deployment.

| Check | Observed result |
| --- | --- |
| JavaScript | All five custom scripts passed Node syntax checks. |
| Static structure | Six HTML pages; unique IDs; relative files and fragment targets checked. |
| Theme | Light mode persisted after reload and navigation; dark mode also restored after reload. |
| Sign-in | Empty name and malformed email rejected by HTML validation; whitespace-only name rejected by JS. Valid demo name survived reload and page navigation. |
| Sign-out | Sign-in button returned; signed-out state survived reload. |
| FAQ | Six questions present. First answer opened and closed; aria-expanded changed with the indicator. |
| Local search | Nolan matched 2 films; an unknown word matched 0; clearing restored 3. |
| API | Live request returned 22 films; selecting Spirited Away changed details; Refresh loaded results again. |
| API failure | QA-only page simulated a rejected request. Error text appeared; Refresh then recovered using the real API. |
| API CORS | HTTP 200 and Access-Control-Allow-Origin for https://nurzhigittt.github.io observed in a request with that Origin header. |
| Ratings | 11 rejected; 9, 8, 7 saved and produced average 8.0; all restored after reload; clearing persisted. |
| Reviews | Add/delete worked. Text containing HTML tags remained literal; no injected b element appeared. |
| Trailers | All three film links point to the retained YouTube trailer URLs and open a new tab. |
| Responsive | All six pages checked in 390px / 768px iframes (375px / 753px content widths). No document-wide horizontal overflow. Ratings table scrolls inside its wrapper on phones. |
| Visuals | Desktop Home dark, Discover light and narrow layouts inspected; screenshots included. |

Not verified: new GitHub Pages deployment, LMS deadline/submissions, native Safari,
Firefox, physical devices, or current YouTube playback availability. Browser
extension metadata errors were seen; they were not website script errors.
The simulated-failure page and responsive test wrapper are not in the ZIP.

No commits, pushes or publication were performed.
