"use strict";

/*
 * Activity 5 & Activity 6 - Student Profile
 * Andrei Jullian Nacaya
 *
 * Handles:
 * - Profile loading
 * - Profile rendering
 * - Edit Profile
 * - Validation
 * - Save
 * - Cancel
 * - localStorage persistence
 * - Cordova camera integration
 * - Profile picture capture
 * - Profile picture persistence
 * - Camera cancellation
 * - Camera error handling
 */


/* =========================================================
   STORAGE
   ========================================================= */

const STORAGE_KEY = "studentProfile";
const PROFILE_IMAGE_KEY = "studentProfileImage";


/* =========================================================
   DEFAULT PROFILE
   ========================================================= */

const defaultProfile = {
    fullName: "Andrei Jullian Nacaya",
    course: "BS Computer Science",
    yearLevel: "2nd Year",
    about:
        "I am a Computer Science student interested in software development, responsive web applications, mobile development, and modern technology.",
    skills: [
        "HTML5",
        "CSS3",
        "JavaScript",
        "Git",
        "GitHub",
        "Apache Cordova"
    ]
};


/* =========================================================
   APPLICATION INITIALIZATION
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    initializeApplication
);

document.addEventListener(
    "deviceready",
    initializeCameraFeature,
    false
);


/*
 * Initialize Activity 5 profile features.
 */

function initializeApplication() {

    const profile = loadProfile();

    renderProfile(profile);

    /*
     * Load the saved profile picture here as well.
     * This allows the picture to appear as soon as the page loads.
     */

    loadSavedProfileImage();


    const editProfileButton =
        document.getElementById("editProfileButton");

    const cancelEditButton =
        document.getElementById("cancelEditButton");

    const editProfileForm =
        document.getElementById("editProfileForm");


    if (editProfileButton) {

        editProfileButton.addEventListener(
            "click",
            openEditProfile
        );
    }


    if (cancelEditButton) {

        cancelEditButton.addEventListener(
            "click",
            cancelEdit
        );
    }


    if (editProfileForm) {

        editProfileForm.addEventListener(
            "submit",
            handleProfileSave
        );
    }
}


/* =========================================================
   ACTIVITY 5 - PROFILE DATA
   ========================================================= */


/*
 * Load profile information.
 */

function loadProfile() {

    try {

        const savedProfile =
            localStorage.getItem(STORAGE_KEY);


        if (!savedProfile) {

            return copyDefaultProfile();
        }


        const parsedProfile =
            JSON.parse(savedProfile);


        return {

            fullName:
                parsedProfile.fullName ||
                defaultProfile.fullName,

            course:
                parsedProfile.course ||
                defaultProfile.course,

            yearLevel:
                parsedProfile.yearLevel ||
                defaultProfile.yearLevel,

            about:
                parsedProfile.about ||
                defaultProfile.about,

            skills:
                Array.isArray(parsedProfile.skills)
                    ? parsedProfile.skills
                    : defaultProfile.skills.slice()
        };


    } catch (error) {

        console.error(
            "Unable to load profile:",
            error
        );

        return copyDefaultProfile();
    }
}


/*
 * Return a safe copy of the default profile.
 */

function copyDefaultProfile() {

    return {

        fullName:
            defaultProfile.fullName,

        course:
            defaultProfile.course,

        yearLevel:
            defaultProfile.yearLevel,

        about:
            defaultProfile.about,

        skills:
            defaultProfile.skills.slice()
    };
}


/*
 * Save profile information.
 */

function saveProfile(profile) {

    try {

        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(profile)
        );

        return true;


    } catch (error) {

        console.error(
            "Unable to save profile:",
            error
        );

        return false;
    }
}


/*
 * Render profile.
 */

function renderProfile(profile) {

    const profileName =
        document.getElementById("profileName");

    const profileCourse =
        document.getElementById("profileCourse");

    const profileYearLevel =
        document.getElementById("profileYearLevel");

    const profileAbout =
        document.getElementById("profileAbout");


    if (profileName) {

        profileName.textContent =
            profile.fullName;
    }


    if (profileCourse) {

        profileCourse.textContent =
            profile.course;
    }


    if (profileYearLevel) {

        profileYearLevel.textContent =
            profile.yearLevel;
    }


    if (profileAbout) {

        profileAbout.textContent =
            profile.about;
    }


    renderSkills(profile.skills);
}


/*
 * Render skills.
 */

function renderSkills(skills) {

    const skillsContainer =
        document.getElementById("profileSkills");


    if (!skillsContainer) {

        return;
    }


    skillsContainer.replaceChildren();


    if (
        !Array.isArray(skills) ||
        skills.length === 0
    ) {

        const emptyMessage =
            document.createElement("p");

        emptyMessage.className =
            "empty-skills";

        emptyMessage.textContent =
            "No skills have been added yet.";

        skillsContainer.appendChild(
            emptyMessage
        );

        return;
    }


    skills.forEach(function (skill) {

        const skillTag =
            document.createElement("span");

        skillTag.className =
            "skill-tag";

        skillTag.textContent =
            skill;

        skillsContainer.appendChild(
            skillTag
        );
    });
}


/* =========================================================
   ACTIVITY 5 - EDIT PROFILE
   ========================================================= */


/*
 * Open Edit Profile.
 */

function openEditProfile() {

    clearValidationErrors();


    const currentProfile =
        loadProfile();


    populateEditForm(
        currentProfile
    );


    const profileView =
        document.getElementById("profileView");

    const editSection =
        document.getElementById(
            "editProfileSection"
        );


    if (profileView) {

        profileView.hidden = true;
    }


    if (editSection) {

        editSection.hidden = false;
    }


    const fullNameField =
        document.getElementById("fullName");


    if (fullNameField) {

        fullNameField.focus();
    }


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


/*
 * Populate Edit Profile form.
 */

function populateEditForm(profile) {

    document.getElementById("fullName").value =
        profile.fullName;

    document.getElementById("course").value =
        profile.course;

    document.getElementById("yearLevel").value =
        profile.yearLevel;

    document.getElementById("about").value =
        profile.about;

    document.getElementById("skills").value =
        profile.skills.join(", ");
}


/*
 * Save edited profile.
 */

function handleProfileSave(event) {

    event.preventDefault();

    clearValidationErrors();


    const profile =
        getProfileFromForm();


    const validationResult =
        validateProfile(profile);


    if (!validationResult.isValid) {

        displayValidationErrors(
            validationResult.errors
        );

        return;
    }


    const wasSaved =
        saveProfile(profile);


    if (!wasSaved) {

        const formStatus =
            document.getElementById(
                "formStatus"
            );


        if (formStatus) {

            formStatus.textContent =
                "Your profile could not be saved. Please try again.";

            formStatus.classList.add(
                "error"
            );
        }

        return;
    }


    renderProfile(profile);

    closeEditProfile();
}


/*
 * Get values from Edit Profile form.
 */

function getProfileFromForm() {

    const fullName =
        document
            .getElementById("fullName")
            .value
            .trim();


    const course =
        document
            .getElementById("course")
            .value
            .trim();


    const yearLevel =
        document
            .getElementById("yearLevel")
            .value
            .trim();


    const about =
        document
            .getElementById("about")
            .value
            .trim();


    const skillsText =
        document
            .getElementById("skills")
            .value
            .trim();


    const skills =
        skillsText

            ? skillsText
                .split(",")
                .map(function (skill) {

                    return skill.trim();
                })
                .filter(function (skill) {

                    return skill.length > 0;
                })

            : [];


    return {

        fullName: fullName,
        course: course,
        yearLevel: yearLevel,
        about: about,
        skills: skills
    };
}


/*
 * Validate profile.
 */

function validateProfile(profile) {

    const errors = {};


    if (!profile.fullName) {

        errors.fullName =
            "Please enter your full name.";
    }


    if (!profile.course) {

        errors.course =
            "Please enter your course or program.";
    }


    if (!profile.yearLevel) {

        errors.yearLevel =
            "Please enter your year level.";
    }


    if (!profile.about) {

        errors.about =
            "Please enter information about yourself.";
    }


    return {

        isValid:
            Object.keys(errors).length === 0,

        errors: errors
    };
}


/*
 * Display validation errors.
 */

function displayValidationErrors(errors) {

    const fieldIds = [
        "fullName",
        "course",
        "yearLevel",
        "about"
    ];


    let firstInvalidField = null;


    fieldIds.forEach(
        function (fieldId) {

            if (!errors[fieldId]) {

                return;
            }


            const field =
                document.getElementById(
                    fieldId
                );


            const errorElement =
                document.getElementById(
                    fieldId + "Error"
                );


            if (errorElement) {

                errorElement.textContent =
                    errors[fieldId];
            }


            if (field) {

                field.classList.add(
                    "input-error"
                );

                field.setAttribute(
                    "aria-invalid",
                    "true"
                );


                if (!firstInvalidField) {

                    firstInvalidField =
                        field;
                }
            }
        }
    );


    const formStatus =
        document.getElementById(
            "formStatus"
        );


    if (formStatus) {

        formStatus.textContent =
            "Please correct the highlighted fields.";

        formStatus.classList.add(
            "error"
        );
    }


    if (firstInvalidField) {

        firstInvalidField.focus();
    }
}


/*
 * Clear validation errors.
 */

function clearValidationErrors() {

    const fields = [
        "fullName",
        "course",
        "yearLevel",
        "about"
    ];


    fields.forEach(
        function (fieldId) {

            const field =
                document.getElementById(
                    fieldId
                );


            const errorElement =
                document.getElementById(
                    fieldId + "Error"
                );


            if (field) {

                field.classList.remove(
                    "input-error"
                );

                field.removeAttribute(
                    "aria-invalid"
                );
            }


            if (errorElement) {

                errorElement.textContent =
                    "";
            }
        }
    );


    const formStatus =
        document.getElementById(
            "formStatus"
        );


    if (formStatus) {

        formStatus.textContent =
            "";

        formStatus.classList.remove(
            "error"
        );
    }
}


/*
 * Cancel Edit Profile.
 */

function cancelEdit() {

    clearValidationErrors();


    const savedProfile =
        loadProfile();


    populateEditForm(
        savedProfile
    );


    closeEditProfile();
}


/*
 * Close Edit Profile.
 */

function closeEditProfile() {

    const profileView =
        document.getElementById(
            "profileView"
        );


    const editSection =
        document.getElementById(
            "editProfileSection"
        );


    if (editSection) {

        editSection.hidden = true;
    }


    if (profileView) {

        profileView.hidden = false;
    }


    const editProfileButton =
        document.getElementById(
            "editProfileButton"
        );


    if (editProfileButton) {

        editProfileButton.focus();
    }


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


/* =========================================================
   ACTIVITY 6 - CAMERA INTEGRATION
   ========================================================= */


/*
 * Initialize camera after Cordova is ready.
 */

function initializeCameraFeature() {

    console.log(
        "Cordova device ready - initializing camera."
    );


    const changePictureButton =
        document.getElementById(
            "changeProfilePictureButton"
        );


    if (changePictureButton) {

        changePictureButton.addEventListener(
            "click",
            openCamera
        );
    }


    loadSavedProfileImage();
}


/*
 * Open the device camera.
 */

function openCamera() {

    /*
     * Make sure Cordova Camera is available.
     */

    if (
        !navigator.camera ||
        typeof Camera === "undefined"
    ) {

        alert(
            "Unable to access the camera. Please run this application on a device with Cordova camera support."
        );

        return;
    }


    navigator.camera.getPicture(

        cameraSuccess,

        cameraError,

        {

            /*
             * Moderate quality keeps the Base64 image
             * small enough for localStorage.
             */

            quality: 50,


            /*
             * DATA_URL returns the image as Base64.
             */

            destinationType:
                Camera.DestinationType.DATA_URL,


            /*
             * Use the actual camera.
             */

            sourceType:
                Camera.PictureSourceType.CAMERA,


            /*
             * JPEG keeps the image size smaller.
             */

            encodingType:
                Camera.EncodingType.JPEG,


            /*
             * Only capture still pictures.
             */

            mediaType:
                Camera.MediaType.PICTURE,


            /*
             * Correct portrait/landscape orientation.
             */

            correctOrientation: true,


            /*
             * Reduce image dimensions.
             *
             * This is important because storing a
             * full-resolution Base64 image in
             * localStorage can exceed storage limits.
             */

            targetWidth: 600,

            targetHeight: 600,


            /*
             * Activity 6 only needs the image inside
             * the Student Profile.
             */

            saveToPhotoAlbum: false
        }
    );
}


/*
 * Camera success.
 *
 * imageData contains the JPEG image encoded
 * as a Base64 string.
 */

function cameraSuccess(imageData) {


    if (!imageData) {

        alert(
            "The camera did not return an image. Please try again."
        );

        return;
    }


    const imageSource = imageData;


    const profileImage =
        document.getElementById(
            "profileImage"
        );


    if (!profileImage) {

        console.error(
            "Profile image element was not found."
        );

        return;
    }


    /*
     * Display captured picture.
     */

    profileImage.src =
        imageSource;


    /*
     * Save captured picture.
     */

    saveProfileImage(
        imageSource
    );


    console.log(
        "Profile picture successfully updated."
    );
}


/*
 * Camera error/cancellation.
 */

function cameraError(message) {

    const errorMessage =
        String(message || "");


    const lowerMessage =
        errorMessage.toLowerCase();


    /*
     * Cancellation should NOT replace the existing
     * profile picture and should NOT crash the app.
     */

    if (
        lowerMessage.includes("cancel") ||
        lowerMessage.includes(
            "no image selected"
        ) ||
        lowerMessage.includes(
            "camera cancelled"
        )
    ) {

        console.log(
            "Camera operation cancelled by user."
        );

        return;
    }


    /*
     * Other camera errors.
     */

    console.error(
        "Camera error:",
        errorMessage
    );


    alert(
        "Unable to access the camera. Please check your device permissions."
    );
}


/* =========================================================
   ACTIVITY 6 - IMAGE PERSISTENCE
   ========================================================= */


/*
 * Save profile image to localStorage.
 */

function saveProfileImage(imageSource) {

    try {

        localStorage.setItem(
            PROFILE_IMAGE_KEY,
            imageSource
        );


        console.log(
            "Profile picture saved."
        );


    } catch (error) {

        console.error(
            "Unable to save profile image:",
            error
        );


        alert(
            "The picture was captured, but it could not be saved permanently."
        );
    }
}


/*
 * Restore saved profile picture.
 */

function loadSavedProfileImage() {

    try {

        const savedImage =
            localStorage.getItem(
                PROFILE_IMAGE_KEY
            );


        if (!savedImage) {

            return;
        }


        const profileImage =
            document.getElementById(
                "profileImage"
            );


        if (profileImage) {

            profileImage.src =
                savedImage;
        }


    } catch (error) {

        console.error(
            "Unable to load saved profile image:",
            error
        );
    }
}