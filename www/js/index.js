"use strict";

const API_BASE_URL = "http://10.0.2.2:3000";
const TOKEN_KEY = "authToken";
let currentProfile = null;

document.addEventListener("DOMContentLoaded", () => {
    initializeApplication().catch((error) => {
        console.error("Application initialization error:", error);
        showProfileError("Unable to initialize the application.");
    });
    initializeCameraFeature();
});

document.addEventListener("deviceready", initializeCameraFeature, false);

async function initializeApplication() {
    if (!getAuthToken()) {
        redirectToLogin();
        return;
    }

    const editProfileButton = document.getElementById("editProfileButton");
    const cancelEditButton = document.getElementById("cancelEditButton");
    const editProfileForm = document.getElementById("editProfileForm");

    if (editProfileButton) {
        editProfileButton.addEventListener("click", openEditProfile);
    }
    if (cancelEditButton) {
        cancelEditButton.addEventListener("click", cancelEdit);
    }
    if (editProfileForm) {
        editProfileForm.addEventListener("submit", handleProfileSave);
    }

    await loadProfileFromDatabase();
}

function getAuthToken() {
    return localStorage.getItem(TOKEN_KEY);
}

function redirectToLogin() {
    window.location.href = "login.html";
}

function logout() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem("authenticatedUser");
    redirectToLogin();
}

function handleUnauthorizedResponse(response) {
    if (response.status === 401 || response.status === 403) {
        logout();
        return true;
    }
    return false;
}

async function loadProfileFromDatabase() {
    const token = getAuthToken();
    if (!token) {
        redirectToLogin();
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/api/profile`, {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` }
        });

        if (handleUnauthorizedResponse(response)) return;

        const data = await response.json();
        if (!response.ok || !data.success) {
            throw new Error(data.message || "Unable to retrieve profile.");
        }

        currentProfile = normalizeProfile(data.profile);
        renderProfile(currentProfile);
    } catch (error) {
        console.error("Profile retrieval error:", error);
        showProfileError(
            "Unable to load your profile from the database. " +
            "Please make sure the backend server is running."
        );
    }
}

function normalizeProfile(profile = {}) {
    return {
        userId: profile.userId || null,
        profileId: profile.profileId || null,
        username: profile.username || "",
        email: profile.email || "",
        fullName: profile.fullName || "",
        course: profile.course || "",
        yearLevel: profile.yearLevel || "",
        about: profile.about || "",
        skills: Array.isArray(profile.skills) ? profile.skills : [],
        profileImage: profile.profileImage || null,
        createdAt: profile.createdAt || null,
        updatedAt: profile.updatedAt || null
    };
}

function renderProfile(profile) {
    setText("profileName", profile.fullName);
    setText("profileCourse", profile.course);
    setText("profileYearLevel", profile.yearLevel);
    setText("profileAbout", profile.about);
    renderSkills(profile.skills);

    const image = document.getElementById("profileImage");
    if (image && profile.profileImage) {
        image.src = profile.profileImage;
    }
}

function setText(id, value) {
    const element = document.getElementById(id);
    if (element) element.textContent = value || "";
}

function renderSkills(skills) {
    const container = document.getElementById("profileSkills");
    if (!container) return;

    container.replaceChildren();

    if (!Array.isArray(skills) || skills.length === 0) {
        const empty = document.createElement("p");
        empty.className = "empty-skills";
        empty.textContent = "No skills have been added yet.";
        container.appendChild(empty);
        return;
    }

    skills.forEach((skill) => {
        const tag = document.createElement("span");
        tag.className = "skill-tag";
        tag.textContent = skill;
        container.appendChild(tag);
    });
}

function showProfileError(message) {
    setText("profileAbout", message);
}

function openEditProfile() {
    clearValidationErrors();

    if (!currentProfile) {
        alert("Your profile is still loading. Please try again.");
        return;
    }

    populateEditForm(currentProfile);

    const profileView = document.getElementById("profileView");
    const editSection = document.getElementById("editProfileSection");
    if (profileView) profileView.hidden = true;
    if (editSection) editSection.hidden = false;

    const fullName = document.getElementById("fullName");
    if (fullName) fullName.focus();
    window.scrollTo({ top: 0, behavior: "smooth" });
}

function populateEditForm(profile) {
    document.getElementById("fullName").value = profile.fullName;
    document.getElementById("course").value = profile.course;
    document.getElementById("yearLevel").value = profile.yearLevel;
    document.getElementById("about").value = profile.about;
    document.getElementById("skills").value = profile.skills.join(", ");
}

function getProfileFromForm() {
    const skillsText = document.getElementById("skills").value.trim();
    return {
        fullName: document.getElementById("fullName").value.trim(),
        course: document.getElementById("course").value.trim(),
        yearLevel: document.getElementById("yearLevel").value.trim(),
        about: document.getElementById("about").value.trim(),
        skills: skillsText
            ? skillsText.split(",").map((skill) => skill.trim()).filter(Boolean)
            : []
    };
}

function validateProfile(profile) {
    const errors = {};
    if (!profile.fullName) errors.fullName = "Please enter your full name.";
    if (!profile.course) errors.course = "Please enter your course or program.";
    if (!profile.yearLevel) errors.yearLevel = "Please enter your year level.";
    if (!profile.about) errors.about = "Please enter information about yourself.";
    return { isValid: Object.keys(errors).length === 0, errors };
}

function clearValidationErrors() {
    ["fullName", "course", "yearLevel", "about"].forEach((id) => {
        const field = document.getElementById(id);
        const error = document.getElementById(`${id}Error`);
        if (field) {
            field.classList.remove("input-error");
            field.removeAttribute("aria-invalid");
        }
        if (error) error.textContent = "";
    });

    const status = document.getElementById("formStatus");
    if (status) {
        status.textContent = "";
        status.className = "form-status";
    }
}

function displayValidationErrors(errors) {
    let firstInvalid = null;

    Object.entries(errors).forEach(([id, message]) => {
        const field = document.getElementById(id);
        const error = document.getElementById(`${id}Error`);
        if (error) error.textContent = message;
        if (field) {
            field.classList.add("input-error");
            field.setAttribute("aria-invalid", "true");
            if (!firstInvalid) firstInvalid = field;
        }
    });

    const status = document.getElementById("formStatus");
    if (status) {
        status.textContent = "Please correct the highlighted fields.";
        status.className = "form-status error";
    }
    if (firstInvalid) firstInvalid.focus();
}

async function handleProfileSave(event) {
    event.preventDefault();
    clearValidationErrors();

    const editedProfile = getProfileFromForm();
    const validation = validateProfile(editedProfile);
    if (!validation.isValid) {
        displayValidationErrors(validation.errors);
        return;
    }

    const status = document.getElementById("formStatus");
    const saveButton = event.submitter;
    if (saveButton) {
        saveButton.disabled = true;
        saveButton.textContent = "Saving...";
    }
    if (status) status.textContent = "Saving profile to database...";

    try {
        const token = getAuthToken();
        if (!token) {
            redirectToLogin();
            return;
        }

        const response = await fetch(`${API_BASE_URL}/api/profile`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                ...editedProfile,
                profileImage: currentProfile ? currentProfile.profileImage : null
            })
        });

        if (handleUnauthorizedResponse(response)) return;

        const data = await response.json();
        if (!response.ok || !data.success) {
            throw new Error(data.message || "Unable to update profile.");
        }

        currentProfile = normalizeProfile(data.profile);
        renderProfile(currentProfile);

        if (status) {
            status.textContent = "Profile updated successfully.";
            status.className = "form-status success";
        }

        setTimeout(closeEditProfile, 700);
    } catch (error) {
        console.error("Profile update error:", error);
        if (status) {
            status.textContent = error.message || "Unable to update your profile.";
            status.className = "form-status error";
        }
    } finally {
        if (saveButton) {
            saveButton.disabled = false;
            saveButton.textContent = "Save Changes";
        }
    }
}

function cancelEdit() {
    clearValidationErrors();
    if (currentProfile) populateEditForm(currentProfile);
    closeEditProfile();
}

function closeEditProfile() {
    const profileView = document.getElementById("profileView");
    const editSection = document.getElementById("editProfileSection");
    if (editSection) editSection.hidden = true;
    if (profileView) profileView.hidden = false;

    const editButton = document.getElementById("editProfileButton");
    if (editButton) editButton.focus();
    window.scrollTo({ top: 0, behavior: "smooth" });
}

function initializeCameraFeature() {
    const button = document.getElementById("changeProfilePictureButton");
    if (!button || button.dataset.cameraBound === "true") return;

    button.addEventListener("click", openCamera);
    button.dataset.cameraBound = "true";
}

function openCamera() {
    if (!navigator.camera || typeof Camera === "undefined") {
        alert("Camera is not ready yet. Please wait a moment and try again.");
        return;
    }

    navigator.camera.getPicture(
        cameraSuccess,
        cameraError,
        {
            quality: 45,
            destinationType: Camera.DestinationType.DATA_URL,
            sourceType: Camera.PictureSourceType.CAMERA,
            encodingType: Camera.EncodingType.JPEG,
            mediaType: Camera.MediaType.PICTURE,
            correctOrientation: true,
            targetWidth: 320,
            targetHeight: 320,
            saveToPhotoAlbum: false
        }
    );
}

// Keep this as a normal Function. Cordova Camera's runtime argument checker
// rejects AsyncFunction callbacks even though they are callable JavaScript.
function cameraSuccess(imageData) {
    if (!imageData) {
        alert("The camera did not return an image. Please try again.");
        return;
    }

    const imageSource = imageData.startsWith("data:")
        ? imageData
        : `data:image/jpeg;base64,${imageData}`;

    const image = document.getElementById("profileImage");
    if (image) image.src = imageSource;

    if (!currentProfile) {
        alert("Your profile has not finished loading. Please try again.");
        return;
    }

    currentProfile.profileImage = imageSource;
    void saveProfilePictureToDatabase();
}

async function saveProfilePictureToDatabase() {
    const token = getAuthToken();
    if (!currentProfile || !token) {
        if (!token) redirectToLogin();
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/api/profile`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                fullName: currentProfile.fullName,
                course: currentProfile.course,
                yearLevel: currentProfile.yearLevel,
                about: currentProfile.about,
                skills: currentProfile.skills,
                profileImage: currentProfile.profileImage
            })
        });

        if (handleUnauthorizedResponse(response)) return;

        const data = await response.json();
        if (!response.ok || !data.success) {
            throw new Error(data.message || "Unable to save profile picture.");
        }

        currentProfile = normalizeProfile(data.profile);
        renderProfile(currentProfile);
        alert("Profile picture updated successfully.");
    } catch (error) {
        console.error("Profile picture update error:", error);
        alert("The picture was captured, but it could not be saved to the database.");
    }
}

function cameraError(message) {
    const errorMessage = String(message || "");
    const lower = errorMessage.toLowerCase();

    if (
        lower.includes("cancel") ||
        lower.includes("no image selected") ||
        lower.includes("camera cancelled")
    ) {
        return;
    }

    console.error("Camera error:", errorMessage);
    alert("Unable to access the camera. Please check your device permissions.");
}
