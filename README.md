# Nacaya_StudentProfile

A responsive student profile developed with **HTML5 and CSS3** for Activity 3. The project is packaged as an Apache Cordova application and demonstrates responsive design, visual hierarchy, accessibility, and mobile-friendly navigation.

## Activity 3 Highlights

- Responsive layouts for **desktop, tablet, and mobile** screen sizes.
- Same-page navigation using HTML anchor links (`#about` and `#skills`).
- Responsive CSS Grid and media queries for layout adaptation.
- Flexible typography using `clamp()` and scalable spacing.
- Accessible image alternative text and semantic section headings.
- Visible keyboard focus states for navigation links.
- Five technical skills presented in a clear, readable list.
- Reduced-motion support through `prefers-reduced-motion`.

## Responsive Design Techniques

The stylesheet uses CSS Grid to organize the profile content on larger screens. At tablet widths, the layout changes to a single column so the content remains readable. At mobile widths, padding, profile image size, and navigation controls are reduced and adjusted for smaller screens. Media queries ensure that the page does not require horizontal scrolling.

## UI/UX Principles Applied

- **Visual hierarchy:** Clear headings, labels, and sections make information easy to scan.
- **Consistency:** Repeated spacing, borders, typography, and card treatments create a unified interface.
- **Accessibility:** Semantic HTML, descriptive image alt text, keyboard focus indicators, and readable contrast improve usability.
- **Mobile usability:** Navigation links are large enough to tap, while content reflows into a single-column layout on small screens.

## Screenshots

Add your final screenshots below after testing the application:

### Desktop

![Desktop Screenshot](screenshots/desktop.png)

### Tablet

![Tablet Screenshot](screenshots/tablet.png)

### Mobile

![Mobile Screenshot](screenshots/mobile.png)

## Project Structure

```text
Nacaya_StudentProfile/
├── config.xml
├── package.json
├── README.md
└── www/
    ├── css/
    │   └── index.css
    ├── img/
    │   └── pink.jpg
    ├── js/
    │   └── index.js
    └── index.html
```

## Author

**Andrei Jullian Nacaya**

BS Computer Science Student  
Xavier University - Ateneo de Cagayan
