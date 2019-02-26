$(document).ready(function() {
    // Getting references to our form and input
    var signUpForm = $("form#reused_form");
    var nameInput = $("input#name");
    var emailInput = $("input#email");
    var messageInput = $("input#message");

  
    // When the signup button is clicked, we validate the email and password are not blank
    signUpForm.on("submit", function(event) {
      event.preventDefault();
      var userData = {
        name: nameInput.val().trim(),
        email: emailInput.val().trim(),
        message: messageInput.val().trim(),
      };
     
      if (!userData.name || !userData.email || !userData.message) {
        return;
      }
      
      // If we have an email and password, run the signUpUser function
      signUpUser(userData.name.userData.email, userData.message);
        nameInput.val("");
        emailInput.val("");
        messageInput.val("");
  
    // Does a post to the signup route. If succesful, we are redirected to the members page
    // Otherwise we log any errors
    function signUpUser(name, email, message) {
      $.post("/api/contact", {
        email: email,
        name: name,
        message: message
      }).then(function(data) {
        window.location.replace(data);
        console.log(handleLoginErr, "this is sign up error 1");
  
        // If there's an error, handle it by throwing up a boostrap alert
      }).catch(handleLoginErr);
      console.log(handleLoginErr, "this is sign up error 2");
  
    }
  
    function handleLoginErr(err) {
      $("#alert .msg").text(err.responseJSON);
      $("#alert").fadeIn(500);
    }
  });
  