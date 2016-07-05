'use strict';

// jQuery shorthand for $(document).ready
$(() => {
  const baseUrl = 'http://localhost:3000';

  // error handler (to be passed as a callback)
  const onError = (error) => {
    console.error(error);
  };

  // another handler, this time for signUp success
  const onSignUp = (response) => {
    console.log(response);
    console.log('Signed up');
  };

  // a handler for signIn success
  const onSignIn = (response) => {
    console.log(response);
    console.log('Signed in');
  };

  // signUpOrIn will do either signUp or signIn, since the two requests only
  // differ by the path. onFulfilled is how we refer to the passed-in success
  // handler and onRejected is how we refer to the passed-in error handler.
  const signUpOrIn = (credentials, path, onFulfilled, onRejected) => {
    // XMLHttpRequest is the object the browser provides in order to make
    // network requests.
    let xhr = new XMLHttpRequest();

    // the 'load' event is fired when the browser receives a response from the
    // server
    xhr.addEventListener('load', () => {
      // if the request was successfull
      if (xhr.status >= 200 && xhr.status < 300) {
        onFulfilled(xhr.response); // run the success callback that was passed
      } else { // if the request was not successful
        onRejected(xhr); // run the error callback that was passed
      }
    });

    // handle any errors that occur before the request is even made
    xhr.addEventListener('error', () => onRejected(xhr));

    // start the request
    xhr.open('POST', baseUrl + path);

    // actually process the request and send the data, if any
    xhr.send(credentials);
  };

  // call signUpOrIn with the appropriate path for sign-in
  const signIn = (credentials, onFulfilled, onRejected) =>
    signUpOrIn(credentials, '/sign-in', onFulfilled, onRejected);

  // call signUpOrIn with the appropriate path for sign-up
  const signUp = (credentials, onFulfilled, onRejected) =>
    signUpOrIn(credentials, '/sign-up', onFulfilled, onRejected);

  const submitHandler = (event) => {
    event.preventDefault();
    // formData is kinda like getFormFields... don't use formData
    // formData is only used when we send files through AJAX, when it's a
    // regular form, prefer getFormFields.
    //
    // BTW for extra points: getFormFields is kinda like $.serialize
    let formData = new FormData(event.target);


    const onSignUpSuccess = function (response) {
      onSignUp(response);
      signIn(formData, onSignIn, onError);
    };

    signUp(formData, onSignUpSuccess, onError);
  };

  // attach a single-use named function to the sign-up form in the DOM
  $('#sign-up').on('submit', submitHandler);
});
