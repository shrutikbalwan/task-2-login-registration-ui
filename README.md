# AuthPortal Login & Registration System

## Project Overview
AuthPortal is a professional and fully responsive authentication UI project created for internship submission. It includes a modern Login page, a polished Registration page, client-side validation, password visibility toggles, AJAX username availability checking, and a simple PHP backend endpoint.

## Features
- Responsive Login and Registration pages
- Bootstrap 5 navbar, cards, forms, buttons, and grid layout
- Glassmorphism-inspired modern card design
- Client-side validation with dynamic error messages
- Password and confirm password matching
- Show/Hide password toggle
- AJAX username availability check using Fetch API
- PHP integration through `check_user.php`
- Smooth hover effects, fade-in animation, and polished focus states

## Technologies Used
- HTML5
- CSS3
- JavaScript (ES6)
- Bootstrap 5
- AJAX Fetch API
- PHP
- Google Fonts
- Font Awesome

## Project Structure
```text
Task-2/
+-- login.html
+-- register.html
+-- style.css
+-- script.js
+-- check_user.php
+-- README.md
+-- images/
```

## How to Run
Use this to run the project with PHP and test the AJAX username availability feature:

```bash
php -S localhost:8000
```

Then open:
- `http://localhost:8000/login.html`
- `http://localhost:8000/register.html`

## Username Availability Demo
Sample existing usernames in `check_user.php`:
- `admin`
- `john_doe`
- `shruti`
- `intern2026`
- `authportal`
- `demo_user`

Any other valid username should return `Username Available`.

## Author Name
Shrut

## Screenshots Section
Add project screenshots inside the `images` folder and update this section when preparing your GitHub submission:

- `images/login-page.png`
- `images/register-page.png`

## Notes
- Replace the sample usernames in `check_user.php` with a database query for a real-world project.
- The current success messages are frontend-only and simulate form submission for demonstration purposes.
