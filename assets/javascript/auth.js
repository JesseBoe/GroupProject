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

      const auth = firebase.auth();
      const currentUser = firebase.auth().currentUser;
      const providerGoogle = new firebase.auth.GoogleAuthProvider();
      var providerAdmin;
      console.log("who is " + currentUser);

      //Initial setting of disabled attribute on Buttons - where false = visible/not disabled
      $("#registerBtn").attr("disabled", false);
      $("#loginBtn").attr("disabled", false);
      $("#logoutBtn").attr("disabled", true);

      //Event Listeners 

      // Register button - click will create new user -Provider -email/pwd Login
      //$("#target-form").on("submit", function(event) {
      $("#registerBtn").on("click", function(event) {
          event.preventDefault();
          email = $("#email-input").val();
          password = $("#pass-input").val();
          alert(email + password);
          createUser(email, password);
      });

      $("#loginBtn").on("click", function(event) {
          event.preventDefault();
          email = $("#email-input").val();
          password = $("#pass-input").val();
          alert(email + password);
          loginUser(email, password);
      });

      // Logout  button -  click will logout  user
      $("#logoutBtn").on("click", function(event) {
          alert("LogoutUser");
          logoutUser();
      });

      // listener for database auth state changes - 
      //It is just changing button state (active vs disabled) depending on whether
      //user is logged in or not. will expand this once core functionality is working
      firebase.auth().onAuthStateChanged(function(user) {
          // user is undefined if no user signed in
          window.user = user; // user is undefined if no user signed in
          if (user) {
              $("#logoutBtn").attr("disabled", false);
              console.log("Logout if usr=T - LogoutBtn not disabled");
              console.log(currentUser);
          } else {
              $("#logoutBtn").attr("disabled", true);
              // this will occur on initial load or refresh as no one is logged in
              console.log("Logout if usr=F - LogoutBtn disabled");
              console.log(currentUser);
          }
      });

      // Create a new user - hook to a register button
      function createUser(email, password) {
          alert("CreateUser"); // for testing
          // logic to catch empty submissions
          if (!email || !password) {
              alert("Please enter an e-mail and a password") // change to modal
          } else {
              //Note: if I remove the 2 promise lines below, I get "user already exists"
              //const promise = auth().createUserWithEmailAndPassword(email, password);
              // promise.catch(e => console.log(e.message));
              //without promise lines, I get "Violation click handler took 7000ms"
              firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
                  console.log(error.message);
                  // need to handle these errors better - looking at error codes
                  alert("user already exists");
              });
              alert("User Created" + currentUser);
          }
      }

      // User login - hook to login button
      function loginUser(email, password) {
          alert("loginUser");
          // logic to catch empty submissions
          if (!email || !password) {
              alert("Please enter an e-mail and a password") // change to modal
          } else {
              // const promise = auth().signInWithEmailAndPassword(email, password);
              // promise.catch(e => console.log(e.message));
              //without promise lines, I get "Violation click handler took 7000ms"
              firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
                  console.log(error.message);
                  // need to handle these errors better - looking at error codes
                  alert("incorrect credentials - or user not in DB");
              });
              alert("User Logged in" + currentUser);
          }
      }
      // Sign out user
      function logoutUser() {
          firebase.auth().signOut().catch(function(err) {
              console.log("logged out")
          });
      }

      // Update a user - Work on this last.. MVP can exist without user update
      function updateUser(email, password) {}

  });