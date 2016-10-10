'use strict';

const getFormFields = require('../../lib/get-form-fields');

$(() => {
  // // console methods require `this` to be `console`
  // // promise function are called with `this === undefined`
  // let clog = console.log.bind(console);
  // let elog = console.error.bind(console);

  const baseUrl = 'http://localhost:3000';

  const onError = (error) => {
    console.error(error);
  };

  const onSignIn = (response) => {
    console.log(response);
    console.log('Signed in');
  };

  const onSignUp = (response) => {
    console.log(response);
    console.log('Signed up');
  };

// this is the first time we use a callback / Promise
// since there's no brace here, we'll be implicitly returning this next line
  const signUpOrIn = (credentials, path) =>
  // resolve replaces our success handlers
  // reject replaces our rejection handlers
  // instead of defining and using them immediately, we let the promise
  //  maintain the callback chain, so we don't have to pass them further
  // down the line
    new Promise((resolve, reject) => {
      let xhr = new XMLHttpRequest();
      // the promise is resolved when the load event is fired.
      // the load event is fired when the readystate is flipped.
      xhr.addEventListener('load', () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(xhr.response);
        } else {
          reject(xhr);
        }
      });
      xhr.addEventListener('error', () => reject(xhr));
      xhr.open('POST', baseUrl + path);
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.send(JSON.stringify(credentials));
    });

  // we're hard coding in the path, but we don't need to include our
  // onfulfilled/onrejected function callbacks here because they're handled
  // by the promise
  const signIn = (credentials) => signUpOrIn(credentials, '/sign-in');

  const signUp = (credentials) => signUpOrIn(credentials, '/sign-up');

  const submitHandler =  function submitHandler(event) {
    event.preventDefault();
    let data = getFormFields(event.target);
    signUp(data)
    .then(onSignUp)
    .then(() => signIn(data)) // this is just a shorthand for function() { return signIn(data) }
                              // or a function definition, to be called later. Watch for these when debugging!
    .then(onSignIn)
    .catch(onError);
  };

  $('#sign-up-promise').on('submit', submitHandler);
});
