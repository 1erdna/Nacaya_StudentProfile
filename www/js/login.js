// ============================================================
// NACAYA STUDENT PROFILE
// Activity 7 - Login
// ============================================================


// Android Emulator uses 10.0.2.2 to reach the computer's localhost.
const API_BASE_URL = "http://10.0.2.2:3000";


// ============================================================
// INITIALIZE LOGIN PAGE
// ============================================================

document.addEventListener("DOMContentLoaded", function () {

    const loginForm =
        document.getElementById("loginForm");

    const usernameInput =
        document.getElementById("loginUsername");

    const passwordInput =
        document.getElementById("loginPassword");

    const loginButton =
        document.getElementById("loginButton");

    const loginStatus =
        document.getElementById("loginStatus");


    // --------------------------------------------------------
    // If already logged in, go directly to the profile.
    // --------------------------------------------------------

    const existingToken =
        localStorage.getItem("authToken");

    if (existingToken) {

        window.location.href = "index.html";
        return;
    }


    // --------------------------------------------------------
    // LOGIN FORM
    // --------------------------------------------------------

    loginForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            const username =
                usernameInput.value.trim();

            const password =
                passwordInput.value;


            // Clear previous message
            loginStatus.textContent = "";
            loginStatus.className = "form-status";


            // ------------------------------------------------
            // Basic validation
            // ------------------------------------------------

            if (!username || !password) {

                loginStatus.textContent =
                    "Please enter your username and password.";

                loginStatus.className =
                    "form-status error";

                return;
            }


            // ------------------------------------------------
            // Disable button while logging in
            // ------------------------------------------------

            loginButton.disabled = true;
            loginButton.textContent = "Signing in...";


            try {

                // --------------------------------------------
                // Send credentials to Node.js backend
                // --------------------------------------------

                const response = await fetch(
                    `${API_BASE_URL}/api/auth/login`,
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify({
                            username: username,
                            password: password
                        })
                    }
                );


                const data = await response.json();


                // --------------------------------------------
                // Reject invalid login
                // --------------------------------------------

                if (!response.ok || !data.success) {

                    throw new Error(
                        data.message ||
                        "Unable to log in."
                    );
                }


                // --------------------------------------------
                // Save JWT
                // --------------------------------------------

                localStorage.setItem(
                    "authToken",
                    data.token
                );


                // Save basic authenticated user information.
                localStorage.setItem(
                    "authenticatedUser",
                    JSON.stringify(data.user)
                );


                // --------------------------------------------
                // Success message
                // --------------------------------------------

                loginStatus.textContent =
                    "Login successful. Loading your profile...";

                loginStatus.className =
                    "form-status success";


                // --------------------------------------------
                // Open profile page
                // --------------------------------------------

                setTimeout(function () {

                    window.location.href =
                        "index.html";

                }, 500);


            } catch (error) {

                console.error(
                    "Login error:",
                    error
                );


                loginStatus.textContent =
                    error.message ||
                    "Unable to connect to the server.";

                loginStatus.className =
                    "form-status error";


                passwordInput.value = "";
                passwordInput.focus();


            } finally {

                loginButton.disabled = false;
                loginButton.textContent = "Login";
            }
        }
    );

});