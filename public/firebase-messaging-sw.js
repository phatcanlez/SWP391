// // Import Firebase scripts
// importScripts("https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js");
// importScripts(
//   "https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js"
// );

// // Initialize the Firebase app in the service worker by passing in your app's Firebase config object.
// const firebaseConfig = {
//     apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
//     authDomain: "koikichi-b5079.firebaseapp.com",
//     projectId: "koikichi-b5079",
//     storageBucket: "koikichi-b5079.appspot.com",
//     messagingSenderId: "1075567685195",
//     appId: "1:1075567685195:web:2e46d6fd03b533dc71e7ce",
//     measurementId: "G-4VJMQBPQYJ"
//   };

// // Initialize Firebase
// firebase.initializeApp(firebaseConfig);

// // Retrieve an instance of Firebase Messaging so that it can handle background messages.
// const messaging = firebase.messaging();

// messaging.onBackgroundMessage((payload) => {
//   console.log(
//     "[firebase-messaging-sw.js] Received background message ",
//     payload
//   );

//   // Customize notification here
//   const notificationTitle =
//     payload.notification?.title || "Background Message Title";
//   const notificationOptions = {
//     body: payload.notification?.body || "Background Message body.",
//     icon: payload.notification?.icon || "/firebase-logo.png",
//   };

//   self.registration.showNotification(notificationTitle, notificationOptions);
// });