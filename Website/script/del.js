
function deleteProfile() {
    console.log("saving");
    emaill = sessionStorage.getItem("email");
    fetch("https://qj46ayflt7.execute-api.us-east-1.amazonaws.com/default/UsersInfoAss?head=" + emaill,
        {
            method: "DELETE"
        }).then(response => response.json())
        .then(data => {
            if (data === "User info deleted successfully") {
                sessionStorage.setItem("log", "false");
                sessionStorage.clear();
                window.location.href = "index.html";
            } else {
                alert("error user cannot be deleted");
            }
        });
}