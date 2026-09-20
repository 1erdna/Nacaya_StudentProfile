"use strict";

/*
 * Activity 5 - Student Profile Editing
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
 */

const STORAGE_KEY = "studentProfile";

/*
 * Default profile information.
 * This is displayed when localStorage does not
 * contain previously saved profile information.
 */
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


/*
 * Application starts after the HTML document
 * has completely loaded.
 */
document.addEventListener("DOMContentLoaded", initializeApplication);


/*
 * Initialize the profile application.
 */
function initializeApplication() {

    const profile = loadProfile();

    renderProfile(profile);

    const editProfileButton =
        document.getElementById("editProfileButton");

    const cancelEditButton =
        document.getElementById("cancelEditButton");

    const editProfileForm =
        document.getElementById("editProfileForm");


    editProfileButton.addEventListener(
        "click",
        openEditProfile
    );

    cancelEditButton.addEventListener(
        "click",
        cancelEdit
    );

    editProfileForm.addEventListener(
        "submit",
        handleProfileSave
    );
}


/*
 * Load profile information.
 *
 * If saved data exists, retrieve it.
 * Otherwise return the default profile.
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
        fullName: defaultProfile.fullName,
        course: defaultProfile.course,
        yearLevel: defaultProfile.yearLevel,
        about: defaultProfile.about,
        skills: defaultProfile.skills.slice()
    };
}


/*
 * Save profile information to localStorage.
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
 * Display the profile information on the page.
 */
function renderProfile(profile) {

    document.getElementById("profileName").textContent =
        profile.fullName;

    document.getElementById("profileCourse").textContent =
        profile.course;

    document.getElementById("profileYearLevel").textContent =
        profile.yearLevel;

    document.getElementById("profileAbout").textContent =
        profile.about;

    renderSkills(profile.skills);
}


/*
 * Render skills safely using DOM elements.
 * No HTML from user input is inserted directly.
 */
function renderSkills(skills) {

    const skillsContainer =
        document.getElementById("profileSkills");

    skillsContainer.replaceChildren();


    if (!Array.isArray(skills) || skills.length === 0) {

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


/*
 * Open Edit Profile.
 */
function openEditProfile() {

    clearValidationErrors();

    const currentProfile =
        loadProfile();

    populateEditForm(currentProfile);

    const profileView =
        document.getElementById("profileView");

    const editSection =
        document.getElementById("editProfileSection");


    profileView.hidden = true;
    editSection.hidden = false;


    document.getElementById("fullName").focus();

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


/*
 * Fill the form using the currently saved profile.
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
 * Handle form submission.
 */
function handleProfileSave(event) {

    event.preventDefault();

    clearValidationErrors();


    const profile = getProfileFromForm();

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
            document.getElementById("formStatus");

        formStatus.textContent =
            "Your profile could not be saved. Please try again.";

        formStatus.classList.add("error");

        return;
    }


    renderProfile(profile);

    closeEditProfile();
}


/*
 * Retrieve form values.
 */
function getProfileFromForm() {

    const fullName =
        document.getElementById("fullName")
            .value
            .trim();

    const course =
        document.getElementById("course")
            .value
            .trim();

    const yearLevel =
        document.getElementById("yearLevel")
            .value
            .trim();

    const about =
        document.getElementById("about")
            .value
            .trim();

    const skillsText =
        document.getElementById("skills")
            .value
            .trim();


    const skills = skillsText
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
 * Validate required profile fields.
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
 * Display validation errors beside their fields.
 */
function displayValidationErrors(errors) {

    const fieldIds = [
        "fullName",
        "course",
        "yearLevel",
        "about"
    ];


    let firstInvalidField = null;


    fieldIds.forEach(function (fieldId) {

        if (!errors[fieldId]) {
            return;
        }


        const field =
            document.getElementById(fieldId);

        const errorElement =
            document.getElementById(
                fieldId + "Error"
            );


        errorElement.textContent =
            errors[fieldId];

        field.classList.add("input-error");

        field.setAttribute(
            "aria-invalid",
            "true"
        );


        if (!firstInvalidField) {
            firstInvalidField = field;
        }
    });


    const formStatus =
        document.getElementById("formStatus");

    formStatus.textContent =
        "Please correct the highlighted fields.";

    formStatus.classList.add("error");


    if (firstInvalidField) {
        firstInvalidField.focus();
    }
}


/*
 * Remove old validation messages.
 */
function clearValidationErrors() {

    const fields = [
        "fullName",
        "course",
        "yearLevel",
        "about"
    ];


    fields.forEach(function (fieldId) {

        const field =
            document.getElementById(fieldId);

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
            errorElement.textContent = "";
        }
    });


    const formStatus =
        document.getElementById("formStatus");


    if (formStatus) {

        formStatus.textContent = "";

        formStatus.classList.remove(
            "error"
        );
    }
}


/*
 * Cancel editing.
 *
 * Nothing is written to localStorage.
 * Unsaved form values are discarded.
 */
function cancelEdit() {

    clearValidationErrors();

    const savedProfile =
        loadProfile();

    populateEditForm(savedProfile);

    closeEditProfile();
}


/*
 * Return to Profile view.
 */
function closeEditProfile() {

    const profileView =
        document.getElementById("profileView");

    const editSection =
        document.getElementById("editProfileSection");


    editSection.hidden = true;
    profileView.hidden = false;


    document.getElementById(
        "editProfileButton"
    ).focus();


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}
