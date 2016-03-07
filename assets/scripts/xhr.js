'use strict';

$(() => {
  const baseUrl = 'http://localhost:3000';

  const onError = (error) => {
    console.error(error);
  };

  const onSignUp = (response) => {
    console.log(response);
    console.log('Signed up');
  };

  const onSignIn = (response) => {
    console.log(response);
    console.log('Signed in');
  };

  const signUpOrIn = (credentials, path, onFulilled, onRejected) => {
    let xhr = new XMLHttpRequest();
    xhr.addEventListener('load', () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        onFulilled(xhr.response);
      } else {
        onRejected(xhr);
      }
    });
    xhr.addEventListener('error', () => onRejected(xhr));
    xhr.open('POST', baseUrl + path);
    xhr.send(credentials);
  };

  const signIn = (credentials, onFulilled, onRejected) =>
    signUpOrIn(credentials, '/sign-in', onFulilled, onRejected);

  const signUp = (credentials, onFulilled, onRejected) =>
    signUpOrIn(credentials, '/sign-up', onFulilled, onRejected);

  $('#sign-up').on('submit', function submitHandler(e) {
    e.preventDefault();
    let formData = new FormData(this);
    const onSignUpSuccess = function (response) {
      onSignUp(response);
      signIn(formData, onSignIn, onError);
    };

    signUp(formData, onSignUpSuccess, onError);
  });
});
