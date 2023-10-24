var signUp = document.getElementById("Signup-button");
function signUpServer(username, email, password, language) {
    console.log("signing up");
    fetch("https://qj46ayflt7.execute-api.us-east-1.amazonaws.com/default/UsersInfoAss", {
            method: "POST",
            body: JSON.stringify({
                "password": password,
                "email": email,
                "lang_p": language,
                "username": username,
            })

        })
            .then(response => response.json())
            .then(data => {
                console.log(data);
                if (data === "User info added successfully") {
                    alert("Account created successfully, please login to continue");
                    window.location.href = "login.html";
                } else {
                    alert("Error, occured while processing the request, add user info failed");
                }
            });
}

signUp.addEventListener("click", function (event) {
    event.preventDefault(); // Prevent the default form submission behavior

    console.log("signing up");
    //collecting the data from the form
    var usernameField = document.getElementById("username");
    var emailField = document.getElementById("email");
    var passwordField = document.getElementById("password");
    var languageField = document.getElementById("language");
    //checking is form is all filled
    if (usernameField.value == "" || emailField.value == "" || passwordField.value == "" || languageField.value == "") {
        alert("Please fill all the fields");
    } else {
        //get values of the fields
        var username = usernameField.value;
        var email = emailField.value;
        var password = passwordField.value;
        var language = languageField.value;
        //posting the request to the server
        signUpServer(username, email, password, language);
    }
});

