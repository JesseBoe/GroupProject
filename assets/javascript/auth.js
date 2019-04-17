  $(document).ready(function() {
      // Initialize Firebase
      const config = {
          apiKey: "AIzaSyDw-EkMjzTgjFrrEgj--Uz6Iw4H078bBk0",
          authDomain: "snackify-cea62.firebaseapp.com",
          databaseURL: "https://snackify-cea62.firebaseio.com",
          projectId: "snackify-cea62",
          storageBucket: "snackify-cea62.appspot.com",
          messagingSenderId: "334536077143"
      }
      firebase.initializeApp(config);
      var currentUser = firebase.auth().currentUser;
      var auth = firebase.auth();

      //Initial setting of disabled attribute on Buttons - where false = visible/not disabled
      $("#registerBtn").attr("disabled", false);
      $("#loginBtn").attr("disabled", false);
      $("#auth-LogoutBtn").attr("disabled", true);

      //Event Listeners 

      // Register button - click will create new user 
      $("#registerBtn").on("click", function(event) {
          event.preventDefault();
          email = $("#email-input").val();
          password = $("#pass-input").val();
          createUser(email, password);
      });

      $("#loginBtn").on("click", function(event) {
          event.preventDefault();
          email = $("#email-input").val();
          password = $("#pass-input").val();
          loginUser(email, password);
      });

      // Logout  button -  click will logout  user
      $("#auth-LogoutBtn").on("click", function(event) {
          logoutUser();
      });

      // Listener for database auth state changes - just changes button state 
      //(active vs disabled) depending on whether user is logged in or not.
      firebase.auth().onAuthStateChanged(function(user) {
          console.log('onAuthStateChanged::USER', user);
          window.user = user;
          // user is undefined if no user signed in.
          if (user) {
              console.log(user);
              currentUser = user;
              $("#auth-LogoutBtn").attr("disabled", false);
          } 
          else {
              // this will occur on initial load or refresh as no one is logged in
              $("#auth-LogoutBtn").attr("disabled", true); 
          }
      });

      // Create a new user - hooks to register button
      function createUser(email, password) {
          alert("Register New User");
          if (!email || !password) {
                alert("Please enter an e-mail and a password")
          } 
          else {    
                firebase.auth().createUserWithEmailAndPassword(email, password)
                .then(function(res) {
                      alert("Registration successful")
                })
                .catch(function(error) {
                    console.log(error.message);
                    alert(error.message);
                });
          }
      }

      // User login - hooks to login button
      function loginUser(email, password) {
          console.log("local?", firebase.auth.Auth.Persistence.LOCAL);
          alert("Login User");
          if (!email || !password) {
              alert("Please enter an e-mail and a password") // change to modal
          } else {
              firebase.auth().signInWithEmailAndPassword(email, password)
              .then(function(res) {
                    alert("Login successful")
              })
              .catch(function(error) {
                  console.log(error.message);
                  alert(error.message);
              });
          }
      }

      // Sign out user
      function logoutUser() {
        alert("Log User Out");
          firebase.auth().signOut().catch(function(err) {
              console.log("logged out")
          });
      }

// javascript for modal dialog login window below

      var modal = document.getElementById('authModalWindow');
      var span = document.getElementsByClassName("close")[0];
     
           //  Open the modal 
      $(window).on('load', function() {
          $('#authModalWindow').modal();
      });

      // When the user clicks on <span> (x), close the modal
      // span.onclick = function() {
      //    modal.style.display = "none";
      // }

      
  });