# Nacaya Student Profile - Activity 5

## 1. Project Description

The Nacaya Student Profile is a responsive multi-page student portfolio application developed using HTML5, CSS3, vanilla JavaScript, and Apache Cordova.

Activity 5 continues the Student Profile application developed in Activity 4 while adding a functional profile editing system. The application allows the user to edit personal profile information, validate the entered data, save the information using localStorage, and automatically display the latest saved profile information.

The project contains five main pages: Profile, About, Skills, Projects, and Contact. The interface is designed to work across desktop, tablet, and mobile screen sizes while maintaining a consistent student developer portfolio design.

---

## 2. Application Pages

### Profile - `index.html`

The main page displays the student's profile information, including:

- Full Name
- Course
- Year Level
- About Me
- Skills
- Profile photo

The Profile page also contains the **Edit Profile** feature introduced in Activity 5.

### About - `about.html`

The About page presents information about the student's:

- Personal background
- Academic background
- Interests
- Learning activities
- Development goals and aspirations

### Skills - `skills.html`

The Skills page organizes technical and development skills into clear categories, including:

- Frontend Development
- Programming and Application Logic
- Mobile Development and Storage
- Development Workflow
- UI/UX and Prototyping
- Project and Problem Solving

### Projects - `projects.html`

The Projects page presents selected development projects together with project descriptions, developer roles, and technologies used.

### Contact - `contact.html`

The Contact page provides available contact information, including:

- Email
- Phone
- GitHub
- Location

---

## 3. Profile Editing

Activity 5 introduces an interactive **Edit Profile** system on the Profile page.

The following information can be edited:

- Full Name
- Course
- Year Level
- About Me
- Skills

### Edit Profile

Selecting the **Edit Profile** button opens the profile editing interface and automatically fills the form with the currently displayed profile information.

### Save Changes

When **Save Changes** is selected:

1. JavaScript retrieves the values entered in the form.
2. Required fields are validated.
3. Invalid information is prevented from being saved.
4. Valid profile information is stored in localStorage.
5. The profile display is updated dynamically.
6. The editing interface is closed.
7. The newly saved information is immediately displayed.

### Cancel

Selecting **Cancel**:

1. Discards unsaved form changes.
2. Keeps the previously saved profile information.
3. Returns the user to the profile view.
4. Does not modify the saved localStorage data.

---

## 4. JavaScript Functionality

Vanilla JavaScript is used to provide the interactive functionality required for Activity 5.

The JavaScript handles:

- Loading profile information
- Reading saved localStorage data
- Displaying default profile information when no saved data exists
- Opening the Edit Profile interface
- Populating the edit form
- Retrieving form values
- Validating required fields
- Displaying validation messages
- Saving valid profile information
- Dynamically updating the Profile page
- Cancelling unsaved changes
- Rendering skills
- Maintaining profile information between application sessions

The profile information is handled as a single profile data structure rather than storing unrelated values throughout the application.

---

## 5. Local Data Storage

The application uses the browser/Cordova WebView `localStorage` API to provide persistent client-side profile storage.

The stored profile information includes:

- Full Name
- Course
- Year Level
- About Me
- Skills

When the application starts, JavaScript checks localStorage for previously saved profile information.

If saved information exists, it is automatically loaded and displayed.

If no saved profile exists, the application displays the default student information included with the project.

After a successful profile update, the latest information remains available after refreshing, closing, and reopening the application.

No external database is required for the Activity 5 profile editing feature.

---

## 6. Validation

The Edit Profile form validates required information before saving.

The following fields cannot be empty:

- Full Name
- Course
- Year Level
- About Me

If required information is missing, the application prevents the profile from being saved and provides validation feedback to the user.

Skills are handled separately and may be updated through the profile editing interface.

---

## 7. Responsive Design

The application uses responsive CSS techniques including:

- CSS Flexbox
- CSS Grid
- Responsive sizing
- Media queries
- Flexible cards and containers
- Responsive navigation
- Mobile-friendly forms and buttons

The interface is designed to remain usable across common screen sizes, including:

- Desktop
- Laptop
- Tablet
- Mobile

The layout adapts to smaller screens to reduce horizontal overflow, cramped content, and unusable controls.

---

## 8. UI/UX and Accessibility

The Activity 5 interface improves the visual consistency and usability of the original Activity 4 project.

The design includes:

- Consistent dark visual theme
- Clear visual hierarchy
- Reusable card components
- Consistent buttons
- Clear form labels
- Visible validation feedback
- Active navigation states
- Responsive layouts
- Keyboard-accessible form controls
- Focus states for interactive elements
- Meaningful profile image alternative text
- Semantic HTML where appropriate

The interface remains intentionally lightweight and appropriate for a university student development project.

---

## 9. Technologies Used

- HTML5
- CSS3
- JavaScript
- localStorage
- Apache Cordova
- Git
- GitHub
- Visual Studio Code
- PowerShell

No frontend JavaScript framework is required for the Activity 5 profile editing functionality.

---

## 10. Git and GitHub Workflow

Activity 5 development is performed using the feature branch:

```text
activity-5-profile-editing
```

The development workflow is:

```text
main
  |
  +-- activity-5-profile-editing
          |
          +-- Activity 5 development and testing
          |
          +-- merge into main after final testing
```

This workflow preserves the previous Activity 4 version while Activity 5 functionality is developed and tested separately.

---

## 11. How to Run

### Requirements

Before building the Android application, install the required development tools:

- Node.js and npm
- Apache Cordova
- Java Development Kit (JDK)
- Android SDK
- Required Android SDK platform and build tools

### Clone the Repository

```bash
git clone https://github.com/1erdna/Nacaya_StudentProfile.git
cd Nacaya_StudentProfile
```

### Install Project Dependencies

```bash
npm install
```

### Check Cordova Requirements

```bash
npx cordova requirements android
```

### Prepare the Android Project

```bash
npx cordova prepare android
```

### Build for Android

```bash
npx cordova build android
```

### Run on Android

With an Android emulator or compatible Android device configured:

```bash
npx cordova run android
```

> Note: A successful Android build requires compatible versions of the Android SDK, Gradle, Android Gradle Plugin, and JDK. The web application files inside the `www` directory can still be developed and tested independently while Android build-environment issues are being configured.

---

## 12. Application Screenshots

The following screenshots show the Activity 5 Student Profile running as an Android application through Apache Cordova.

### Student Profile

The main Profile screen displays the student's saved profile information and provides access to the Edit Profile feature.

<img width="297" height="647" alt="image" src="https://github.com/user-attachments/assets/63fb1608-84bf-4471-8ed1-3efcdef5622c" />


### Edit Profile

The Edit Profile interface allows the user to modify Full Name, Course, Year Level, About Me, and Skills.

<img width="307" height="652" alt="image" src="https://github.com/user-attachments/assets/9cc99b1a-18ad-4fa7-93c0-4b955dc1c481" />


The lower section of the form provides the Skills field together with the Cancel and Save Changes controls.

<img width="292" height="652" alt="image" src="https://github.com/user-attachments/assets/bd947416-788b-42a2-9224-6f6c52b7c2be" />


### About Page

The About page presents the student's academic background, learning activities, interests, and development goals.

<img width="301" height="651" alt="image" src="https://github.com/user-attachments/assets/ffde1105-4b1f-4f19-be55-1fcfe0076d12" />


### Skills Page

The Skills page organizes the student's technical and development skills into responsive categories.

<img width="296" height="666" alt="image" src="https://github.com/user-attachments/assets/927c1854-cd51-4459-84a2-caecf4aef917" />


### Projects Page

The Projects page presents selected development projects, descriptions, roles, and technologies used.

<img width="301" height="648" alt="image" src="https://github.com/user-attachments/assets/a0e7ec58-a3b2-4a68-8412-8f81145ee5a6" />


### Contact Page

The Contact page provides the student's email, phone, GitHub profile, and location.

<img width="301" height="655" alt="image" src="https://github.com/user-attachments/assets/0ea53635-8f0f-499e-b0bf-2e8974e3bf93" />

## 13. Activity 5 Features

Activity 5 extends the original Student Profile application with:

- Editable student profile information
- Full Name editing
- Course editing
- Year Level editing
- About Me editing
- Skills editing
- Save functionality
- Cancel functionality
- Form validation
- Dynamic profile updates
- localStorage persistence
- Default profile fallback
- Responsive Edit Profile interface
- Improved responsive portfolio pages
- Improved accessibility and visual consistency

---

## Author

**Andrei Jullian Nacaya**
BS Information Technology
Xavier University - Ateneo de Cagayan

GitHub: `1erdna`

---

## Academic Project

This repository contains the Student Profile application developed as a university programming activity.

**Activity 4:** Multi-page Student Profile
**Activity 5:** Profile Editing, JavaScript Functionality, Validation, and Local Data Storage
