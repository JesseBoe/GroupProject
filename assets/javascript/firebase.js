$(document).ready(function() {
    // var firebase = require('firebase');
    // var firebaseui = require('firebaseui');
// Initialize Firebase
    const config = {
        apiKey: "AIzaSyDw-EkMjzTgjFrrEgj--Uz6Iw4H078bBk0",
        authDomain: "snackify-cea62.firebaseapp.com",
        databaseURL: "https://snackify-cea62.firebaseio.com",
        projectId: "snackify-cea62",
        storageBucket: "snackify-cea62.appspot.com",
        messagingSenderId: "334536077143"
      };

      firebase.initializeApp(config);
      const database = firebase.database();
      const auth = firebase.auth();
      var provider = new firebase.auth.GoogleAuthProvider();

//get google user from the onsuccess Google Sign In callback.
    var credential = firebase.auth.GoogleAuthProvider.credential(
    googleUser.getAuthResponse().id_token);
    firebase.auth().signInWithCredential(credential)


      ui.start('#firebaseui-auth-container', {
        signInOptions: [
          firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        ],
    
      });

      firebase.auth().signInWithPopup(provider).then(function(result) {
        // This gives you a Google Access Token. You can use it to access the Google API.
        var token = result.credential.accessToken;
        // The signed-in user info.
        var user = result.user;
        // ...
      }).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;
        // ...
      });
    
      firebase.auth().signOut().then(function() {
        // Sign-out successful.
      }).catch(function(error) {
        // An error happened.
      });

      const promise = auth.signInWithEmailAndPassword(email, pass);
      auth.createUserWithEmailAndPassword(email, pass);
      firebase.auth().onAuthStateChanged()

    $("#submitBtn").on("click", function(event) {
        event.preventDefault();
        console.log("Fuck@!");
    });
});

/*

Manage Users in Firebase
Create a user
You create a new user in your Firebase project by calling the createUserWithEmailAndPassword method or by signing in a user for the first time using a federated identity provider, such as Google Sign-In or Facebook Login.

You can also create new password-authenticated users from the Authentication section of the Firebase console, on the Users page, or by using the Admin SDK.

Get the currently signed-in user
The recommended way to get the current user is by setting an observer on the Auth object:

firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    // User is signed in.
  } else {
    // No user is signed in.
  }
});
*/