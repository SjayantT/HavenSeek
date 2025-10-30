document.addEventListener("DOMContentLoaded", function() {
    //Replace with your actual user fetching logic
    const user = {
        name: "Sahil Jayant",
        profileImage: null // Or a URL if available
    };

    const avatar = document.getElementById("navProfileAvatar");
    if (user.profileImage) {
        avatar.innerHTML = `<img src="${user.profileImage}" alt="Profile">`;
    } else {
        avatar.textContent = user.name ? user.name.trim()[0].toUpperCase() : "?";
    }
  
});
console.log("Navbar script loaded");
