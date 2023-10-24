function goToHomePage() {
    window.location.href = 'index.html';
}

function goToLogInPage() {
    window.location.href = 'login.html';
}

function goToSignUpPage() {
    window.location.href = 'signup.html';
}

function goToAniListPage() {
    window.location.href = 'anilist.html';
}

function goTogoToProfilePage(){
    window.location.href = 'profile.html';
}

function logout() {
    sessionStorage.setItem("log", "false");
    sessionStorage.setItem("email", "");
    console.log("Logged out", sessionStorage.getItem("log"));
    sessionStorage.clear()
    window.location.href = "index.html";
}

function logstatus() {
    console.log("logstatus",sessionStorage.getItem("log"));
    var log = sessionStorage.getItem("log");
    if (log == "true") {
        document.getElementById("login").style.display = "none";
        document.getElementById("signup").style.display = "none";
        document.getElementById("logout").style.display = "inline";
        document.getElementById("profile").style.display = "inline";
        document.getElementById("anilist").style.display = "inline";
    }
    else {
        document.getElementById("login").style.display = "inline";
        document.getElementById("signup").style.display = "inline";
        document.getElementById("logout").style.display = "none";
        document.getElementById("profile").style.display = "none";
        document.getElementById("anilist").style.display = "none";
    }
}
