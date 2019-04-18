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

      // Create a new user - hooks to register button
      function createUser(email, password) {
        console.log("local?", firebase.auth.Auth.Persistence.LOCAL);
          if (!email || !password) {
                $('#auth-nopwduid').modal();
          } 
          else {    
                firebase.auth().createUserWithEmailAndPassword(email, password)
                .then(function(res) {
                    console.log("Registration successful")
                    modal.style.display = "none";
                })
                .catch(function(error) {
                    console.log(error.message);
                    $('#auth-nosuchuser').modal();
                });
          }
      }

      // User login - hooks to login button
      function loginUser(email, password) {
          console.log("local?", firebase.auth.Auth.Persistence.LOCAL);
          if (!email || !password) {
              $('#auth-nopwduid').modal();
          } 
          else {
              firebase.auth().signInWithEmailAndPassword(email, password)
              .then(function(res) {
                  modal.style.display = "none";
              })
              .catch(function(error) {
                  console.log(error.message);
                  alert(error.message);
                  $('#auth-badpwduid').modal();
              });
          }
      }

// javascript for modal dialog login window below

      var modal = document.getElementById('authModalWindow');
      var span = document.getElementsByClassName("close")[0];
     
           //  Open the modal 
      $(window).on('load', function() {
          $('#authModalWindow').modal();
      });

    });