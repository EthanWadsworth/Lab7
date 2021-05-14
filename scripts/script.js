// script.js

import { router } from './router.js'; // Router imported so you can use it to manipulate your SPA app here
const setState = router.setState;

// Make sure you register your service worker here too
if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('./sw.js').then(function(registration) {
      // Registration was successful
      console.log('ServiceWorker registration successful with scope: ', registration.scope);
    }, function(err) {
      // registration failed :(
      console.log('ServiceWorker registration failed: ', err);
    });
  });
}

let counter = 1;
document.addEventListener('DOMContentLoaded', () => {
  fetch('https://cse110lab6.herokuapp.com/entries')
    .then(response => response.json())
    .then(entries => {
      entries.forEach(entry => {
        let newPost = document.createElement('journal-entry');
        newPost.id = counter;
        newPost.addEventListener("click", (event) => {
          let entryData = event.target.entry;
          entryData.page = `entry${newPost.id}`;
          entryData.id = newPost.id;
          setState(entryData, `entry${newPost.id}`);
        });

        newPost.entry = entry;
        document.querySelector('main').appendChild(newPost);
        counter++;
      });
    });
});

// getting settings page
const settingsBtn = document.querySelector('[alt="settings"]');

settingsBtn.addEventListener("click", () => {
  setState({page: "settings"}, "settings");
});

window.onpopstate = function(event) {
  // checks for home page first, and then for the settings and event entry pages
  if (!event.state) {
    document.querySelector("body").classList.remove("settings");
    document.querySelector("body").classList.remove("single-entry");
    document.querySelector("h1").textContent = `Journal Entries`;
  } else if (event.state.page[0] == 's') {
    router.setSettings(event.state);
  } else if (event.state.page[0] == 'e') {
    router.resetEntry(event.state);
  }
}