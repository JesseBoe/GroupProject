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
      $("#logoutBtn").attr("disabled", true);

      //Event Listeners 

      // Register button - click will create new user -Provider -email/pwd Login
      //$("#target-form").on("submit", function(event) {
      $("#registerBtn").on("click", function(event) {
          event.preventDefault();
          email = $("#email-input").val();
          password = $("#pass-input").val();
          createUser(email, password);
          currentUser = firebase.auth().currentUser;
      });

      $("#loginBtn").on("click", function(event) {
          event.preventDefault();
          email = $("#email-input").val();
          password = $("#pass-input").val();
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
          console.log('onAuthStateChanged::USER', user);
          // user is undefined if no user signed in
          window.user = user; // user is undefined if no user signed in
          if (user) {
              console.log(user);
              currentUser = user;
              $("#logoutBtn").attr("disabled", false);
              console.log("Logout if usr=T - LogoutBtn not disabled");
          } else {
              $("#logoutBtn").attr("disabled", true);
              // this will occur on initial load or refresh as no one is logged in
              console.log("Logout if usr=F - LogoutBtn disabled");
          }
      });

      // Create a new user - hook to a register button
      function createUser(email, password) {
          alert("CreateUser");
          if (!email || !password) {
              alert("Please enter an e-mail and a password")
          } else {
              //Note: if I remove the 2 promise lines below, I get "user already exists"
              //const promise = auth().createUserWithEmailAndPassword(email, password);
              // promise.catch(e => console.log(e.message));
              //without promise lines, I get "Violation click handler took 7000ms"
              firebase.auth().createUserWithEmailAndPassword(email, password)
                  .then(function(res) {
                      alert("Registration successful")
                  })
                  .catch(function(error) {
                      console.log(error.message);
                      // need to handle these errors better - looking at error codes
                      alert(error.message);
                  });
          }
      }

      // User login - hook to login button
      function loginUser(email, password) {
          console.log("local?", firebase.auth.Auth.Persistence.LOCAL);
          alert("loginUser");
          if (!email || !password) {
              alert("Please enter an e-mail and a password") // change to modal
          } else {
              firebase.auth().signInWithEmailAndPassword(email, password).then(function(res) {
                  console.log("Log in successful");
              }).catch(function(err) {
                  console.log("error logging in", err);
              })
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

      /* js for google auth */
      function googleSignin() {
          firebase.auth()
              .signInWithPopup(provider).then(function(result) {
                  var token = result.credential.accessToken;
                  var user = result.user;
                  console.log(token)
                  console.log(user)
              }).catch(function(error) {
                  var errorCode = error.code;
                  var errorMessage = error.message;
                  console.log(error.code)
                  console.log(error.message)
              });
      }

      function googleSignout() {
          firebase.auth().signOut()

          .then(function() {
              console.log('Signout Succesful')
          }, function(error) {
              console.log('Signout Failed')
          });
      }


      //Generate test data array

      //createTestData()
      // deleteTestData()

      function createTestData() {
          let testDataArr = [];
          let domain1 = '@gmail.com';
          let domain = '@greyspider.com';
          var uidbase = 'test';
          var email = '';
          let password = 'Td0mhp2r';
          var extraProp = '';
          var numInt = 10;
          for (let i = 0; i < numInt; i++) {
              objectId = i;
              email = (uidbase + i + domain);
              console.log(objectId + ' email: ' + email + ' password: ' + password);
              testDataArr.push({
                  "objectId": objectId,
                  "email": email,
                  "password": password,
                  "extraProp": extraProp
              });
              console.log(testDataArr[i]);
              firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
                  console.log(error.message);
              });
          }
      }
      // fix deleteTest data - admin not working


      function deleteTestData() {
          let numInt = 100;
          let domain = '@greyspider.com';
          let uidbase = 'test';
          for (let i = 0; i < numInt; i++) {
              let email = (uidbase + i + domain);
              admin.auth().deleteUser(email)
                  .then(function() {
                      console.log('Successfully deleted user')
                  })
                  .catch(function(error) {
                      console.log('Error deleting user:', error);
                  });
          }
      }

  });