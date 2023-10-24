function goToEditProfilePage() {
    window.location.href = "editProfile.html";
}

// get the save changes element
var saveChange = document.getElementById("save-button");

// Add an event listener to the save changes  button
saveChange.addEventListener("click", function (event) {
    event.preventDefault(); // Prevent the default form submission behavior

    console.log("saving");
    //collecting the data from the form
    var usernameField = document.getElementById("username");
    var emailField = document.getElementById("email");
    var languageField = document.getElementById("language");
    var NpasswordField = document.getElementById("new-password");

    //check if form is empty
    if (usernameField.value == "" && emailField.value == "" && languageField.value == "" && NpasswordField.value == "") {
        alert("No changes made");
        //return back to profile page
        window.location.href = "profile.html";
    } else {
        // Get the values of the username and password fields
        var username = usernameField.value;
        var email = emailField.value;
        var language = languageField.value;
        var Npassword = NpasswordField.value;
        //check if any of the values are missing
        if (usernameField.value == "") {
            username = sessionStorage.getItem("username");
        }
        else if (emailField.value == "") {
            email = sessionStorage.getItem("email");
        }
        else if (languageField.value == "") {
            language = sessionStorage.getItem("lang_p");
        }
        else if (NpasswordField.value == "") {
            Npassword = sessionStorage.getItem("password");
        }
        //posting the request to the server
        fetch("https://qj46ayflt7.execute-api.us-east-1.amazonaws.com/default/UsersInfoAss", {
            method: "PUT",
            body: JSON.stringify({
                "user_id": sessionStorage.getItem("user_id"),
                "password": Npassword,
                "email": email,
                "lang_p": language,
                "username": username,
                "anilist_id": sessionStorage.getItem("anilist_id"),
                "profile_pic": sessionStorage.getItem("profile_pic")
            })

        })
            .then(response => response.json())
            .then(data => {
                console.log(data);
                if (data === "User info updated successfully") {
                    sessionStorage.setItem("log", "true");
                    sessionStorage.setItem("email", email);
                    sessionStorage.setItem("username", username);
                    sessionStorage.setItem("lang_p", language);
                    console.log("Logged in", sessionStorage.getItem("log"));
                    window.location.href = "profile.html";
                } else {
                    alert("Error, occured while processing the request, upadate user info failed");
                }
            });
    }

});

