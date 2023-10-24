// Get the login form element
// Get the login button element
var loginButton = document.getElementById("login-button");

// Add an event listener to the login button
loginButton.addEventListener("click", function (event) {
    event.preventDefault(); // Prevent the default form submission behavior

    console.log("Logging in...");
    // Get the username and password fields
    var usernameField = document.getElementById("username");
    var passwordField = document.getElementById("password");

    // Get the values of the username and password fields
    var username = usernameField.value;
    var password = passwordField.value;

    // Your code here...
    verifyUser(username, password);
});

//function to pass the request to the server
async function verifyUser(username, password) {
    console.log("Verifying user...");
    //posting the request to the server
    fetch("https://qj46ayflt7.execute-api.us-east-1.amazonaws.com/default/UsersInfoAss?head=LogIn", {
        method: "POST",
        body: JSON.stringify({
            "email": username,
            "passwd": password
        })
    })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            if (data === "REAL USER") {
                sessionStorage.setItem("log", "true");
                sessionStorage.setItem("email", username);
                console.log("Logged in", sessionStorage.getItem("log"));
                window.location.href = "index.html";
            } else {
                alert("Invalid username or password");
            }
        });
}

function showProfile() {
    getusers();
    var username = sessionStorage.getItem("username");
    var email = sessionStorage.getItem("email");
    var language = sessionStorage.getItem("lang_p");
    var profilePicUrl = sessionStorage.getItem("profile_pic");

    // Populate fields
    document.getElementById("username").innerHTML = username;
    document.getElementById("email").innerHTML = email;
    document.getElementById("language").innerHTML = language;
    document.getElementById("profile-pic").src = profilePicUrl;
}

function getusers() {
    fetch("https://qj46ayflt7.execute-api.us-east-1.amazonaws.com/default/UsersInfoAss?head=" + sessionStorage.getItem("email"),
        {
            method: "GET"
        }).then(response => response.json())
        .then(data => {
            console.log(data);
            console.log(data.email);
            sessionStorage.setItem("email", data.email);
            console.log(data.username);
            sessionStorage.setItem("username", data.username);
            console.log(data.user_id);
            sessionStorage.setItem("user_id", data.user_id);
            console.log(data.lang_p);
            sessionStorage.setItem("lang_p", data.lang_p);
            console.log(data.anilist_id);
            sessionStorage.setItem("anilist_id", data.anilist_id);
            console.log(data.profile_pic);
            sessionStorage.setItem("profile_pic", data.profile_pic);
        });
}