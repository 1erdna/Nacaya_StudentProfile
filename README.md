# Nacaya Student Profile - Activity 6

## 1. Project Description

The Nacaya Student Profile is a responsive multi-page student portfolio application developed using HTML5, CSS3, vanilla JavaScript, Apache Cordova, and localStorage.

Activity 6 extends the Student Profile application developed in Activities 4 and 5 by integrating the device camera into the application. The user can open the device camera directly from the Profile page, capture a new profile picture, confirm the captured image, and automatically display it as the current profile picture.

The captured profile picture is stored locally so that it remains available even after the application is closed and reopened.

The project contains five main pages:

- Profile
- About
- Skills
- Projects
- Contact

The application is designed to work across desktop, tablet, and mobile screen sizes while maintaining a consistent student developer portfolio design.

---

## 2. Activity 6 - Camera Integration

Activity 6 introduces camera functionality to the Student Profile application using Apache Cordova.

The Profile page now contains a **Change Profile Picture** control that allows the user to:

1. Open the device camera.
2. Capture a new image.
3. Review the captured image.
4. Confirm or cancel the captured image.
5. Use the confirmed image as the new profile picture.
6. Replace an existing captured profile picture.
7. Preserve the selected profile picture between application sessions.

The camera feature is implemented using the Apache Cordova Camera plugin.

---

## 3. Application Pages

### Profile - `index.html`

The main page displays the student's profile information, including:

- Full Name
- Course
- Year Level
- About Me
- Skills
- Profile Picture

The Profile page contains both:

- **Change Profile Picture**
- **Edit Profile**

The Change Profile Picture feature was introduced in Activity 6, while the Edit Profile feature from Activity 5 remains available.

### About - `about.html`

The About page presents information about the student's:

- Personal background
- Academic background
- Interests
- Learning activities
- Development goals and aspirations

### Skills - `skills.html`

The Skills page organizes technical and development skills into clear categories.

### Projects - `projects.html`

The Projects page presents selected development projects together with project descriptions, developer roles, and technologies used.

### Contact - `contact.html`

The Contact page provides available contact information, including:

- Email
- Phone
- GitHub
- Location

---

## 4. Camera Functionality

The Activity 6 camera feature allows the user to update the profile picture directly from the Android application.

### Open Camera

Selecting **Change Profile Picture** requests access to the device camera and opens the camera interface.

### Capture Photo

The user can capture a photo using the Android camera interface.

After taking the photo, the user is provided with controls to confirm the image, retake it, or cancel the operation.

### Confirm Photo

When the captured image is confirmed:

1. The camera returns the image to the Cordova application.
2. JavaScript receives the image data.
3. The image is assigned to the profile image element.
4. The new profile picture is displayed immediately.
5. The image is stored locally for persistence.

### Retake / Replace Photo

The user can select **Change Profile Picture** again at any time.

A newly confirmed image replaces the previously saved profile picture.

### Cancel Camera

If the user cancels the camera operation, the existing profile picture remains unchanged.

---

## 5. Camera Image Handling

The application uses the Cordova Camera plugin to retrieve the captured image.

The captured image is returned to JavaScript as image data that can be displayed directly by the profile image element.

The application validates the returned camera data before updating the profile picture.

If valid image data is received, the application:

1. Updates the profile image.
2. Saves the image locally.
3. Displays the new image immediately.

This allows the camera feature to operate without requiring an external image server or database.

---

## 6. Profile Picture Persistence

The application uses `localStorage` to preserve the selected profile picture.

After a successful camera capture, the profile picture is stored locally.

When the application starts again, JavaScript checks whether a previously saved profile picture exists.

If a saved image is available, it is automatically restored and displayed.

This means the profile picture remains available after:

- Closing the application
- Restarting the application
- Reopening the Student Profile

No external database is required for profile picture persistence.

---

## 7. Camera Error Handling

The application includes error handling for camera operations.

The camera feature handles situations such as:

- Camera permission being denied
- Camera operation being cancelled
- Camera failing to return valid image data
- Camera access being unavailable

If the camera operation fails, the application provides feedback rather than replacing the existing profile picture with invalid data.

The existing profile information and previously saved profile picture remain protected when a camera operation is unsuccessful.

---

## 8. Profile Editing

Activity 5 introduced an interactive **Edit Profile** system that remains available in Activity 6.

The following information can be edited:

- Full Name
- Course
- Year Level
- About Me
- Skills

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

Selecting **Cancel** discards unsaved changes and keeps the previously saved profile information.

---

## 9. JavaScript Functionality

Vanilla JavaScript provides the interactive functionality of the application.

JavaScript handles:

- Cordova device-ready initialization
- Camera initialization
- Opening the camera
- Receiving captured image data
- Updating the profile picture
- Saving the profile picture
- Restoring the saved profile picture
- Camera error handling
- Loading profile information
- Reading saved localStorage data
- Opening the Edit Profile interface
- Populating the edit form
- Validating required fields
- Saving valid profile information
- Dynamically updating the Profile page
- Cancelling unsaved changes
- Rendering skills
- Maintaining profile information between application sessions

---

## 10. Local Data Storage

The application uses the browser/Cordova WebView `localStorage` API to provide persistent client-side storage.

Stored information includes:

- Full Name
- Course
- Year Level
- About Me
- Skills
- Profile Picture

When the application starts, JavaScript checks localStorage for previously saved information.

If saved information exists, it is automatically loaded and displayed.

If no saved information exists, the application uses the default information included with the project.

---

## 11. Responsive Design

The application uses responsive CSS techniques including:

- CSS Flexbox
- CSS Grid
- Responsive sizing
- Media queries
- Flexible cards and containers
- Responsive navigation
- Mobile-friendly forms and buttons
- Responsive profile image presentation

The interface is designed to remain usable across:

- Desktop
- Laptop
- Tablet
- Mobile

The camera functionality is primarily intended for the Android Cordova application.

---

## 12. UI/UX and Accessibility

The application maintains a consistent dark student-portfolio interface.

The design includes:

- Clear visual hierarchy
- Responsive layouts
- Consistent navigation
- Reusable card components
- Consistent buttons
- Visible form validation
- Active navigation states
- Keyboard-accessible form controls
- Focus states for interactive elements
- Meaningful profile image alternative text
- Semantic HTML where appropriate
- Clearly visible Change Profile Picture control

---

## 13. Technologies Used

- HTML5
- CSS3
- JavaScript
- localStorage
- Apache Cordova
- Cordova Camera Plugin
- Android
- Android Studio
- Android Emulator
- Git
- GitHub
- Visual Studio Code
- Node.js
- npm
- PowerShell

---

## 14. Cordova Camera Plugin

Activity 6 uses the Cordova Camera plugin.

The plugin can be installed using:

```bash
cordova plugin add cordova-plugin-camera