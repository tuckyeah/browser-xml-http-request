'use strict';

const getFormFields = require('../../lib/get-form-fields');

// jquery shorthand for 'document.ready'
$(() => {
  const baseUrl = 'http://localhost:3000'; // saving the URL

// error handler, to be passed as a callback
  const onError = (error) => { // this begins with 'on,' so likely a handler
    console.error(error);
  };

// another handler, this time for signUp success
  const onSignUp = (response) => {
    console.log(response);
    console.log('Signed up');
  };

// another handler, this time for signIn success
  const onSignIn = (response) => {
    console.log(response);
    console.log('Signed in');
  };

// signUpOrIn will do _either_ a signUp or signIn, since the two requests
// only differ by their path (part of the URL after the slash)
    // we could even give sign up and sign in the same form and just show/hide
    // the password confirmation
// 'onFulFilled' is how we refer to the passed-in success handler, and 'onRejected'
// is how we refer to the passed-in error handler

// credentials: an object, possibly created by getFormFields, used for data.
// path: the part of the URL after the / which determines which authAction to take
// onFulfilled: success handler
// onRejected: error handler
  const signUpOrIn = (credentials, path, onFulfilled, onRejected) => {

// This is a new instance of an XHR, which we are saving a reference to in 'xhr'
  // just by creating this request _does not_ send the request.

// starting a new request object
    let xhr = new XMLHttpRequest();

// adding the handler for the 'load' event. this gets fired once we have data
// to pass into it. The 'load' only happens after a readystate change, meaning that
// the server says it has responded successfully. this has nothing to do with actual
// data, it's just about making sure that it has hit the server and the server
// has responded successfully.
    xhr.addEventListener('load', () => {
      // look at the status code, and if it is successful:
      if (xhr.status >= 200 && xhr.status < 300) {
        // fire the handler we passed in for success, and pass it the data
        // you may want to parse it, if its JSON, which we can do here or in the
        // handler, wherever makes sense.
        onFulfilled(xhr.response);
      } else {
        // fire the handler for failure, and pass it the entire request object.
        // we give it the entire request object here so we can dispatch different
        // errors and functions based on the status of the request.
        // these are URL routing failures.
        onRejected(xhr);
      }
    });

// Some error handling happens above, but only specific to where the request
// successully fired.
// this looks like English, finally! This handles any errors that occur before
// the request is even made (as long as it falls under the XHR object purview)
// these are things that are preventing the error from ever being sent (like CORS errors)
    xhr.addEventListener('error', () => onRejected(xhr));

    // start the request!
    xhr.open('POST', baseUrl + path);

    xhr.setRequestHeader('Content-Type', 'application/json');

    // oh wait, actually _do_ the request and send the data.
    xhr.send(JSON.stringify(credentials));
  };

// okay, now we have to use this signUpOrIn functon we made. So let's do some method delegation
  // this is a great API 'surface area' because we have two separate functions, but the
  // function body is only written once.

// define a function which calls signUpOrIn with the appropriate path for signIn
// check out "partial application," which might be related... maybe...
  const signIn = (credentials, onFulfilled, onRejected) =>
    signUpOrIn(credentials, '/sign-in', onFulfilled, onRejected);

// sa,e story, just bind the path to '/sign-up' instead
  const signUp = (credentials, onFulfilled, onRejected) =>
    signUpOrIn(credentials, '/sign-up', onFulfilled, onRejected);

  const submitHandler = function submitHandler(event) {
    event.preventDefault();
    let data = getFormFields(event.target);
    data.credentials.password_confirmation = data.credentials.password_confirmation;

    const onSignUpSuccess = function (response) {
      // the original success handler we defined at the top of the file.
      onSignUp(response);
      // but we don't want to console.log the successs, we also want to trigger
      // another event. Look ma, a callback chain!
      signIn(data, onSignIn, onError);
    };
// look here first, confusing I know, since it's at the bottom
// of the function body... But we're just calling signUp, and the order of the
// parameters dictate our success/failure callback actions.
    signUp(data, onSignUpSuccess, onError);
  };

// attach a handler to the '#sign-up' form.
  $('#sign-up').on('submit', submitHandler);
});
