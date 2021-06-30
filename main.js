import * as dom from './dom.js';


const scenarioSpan = document.getElementById('scenario');
const signInButton = document.getElementById('sign-in')

const fissionInit = {
  permissions: {
    app: {
      name: 'lil-patchy-viewer',
      creator: 'bgins'
    },
    fs: {
      public: [{ directory: ["saved-pages"] }]
    }
  }
};

webnative.initialize(fissionInit).then(async state => {
  console.log(state)

  switch (state.scenario) {
    case webnative.Scenario.AuthSucceeded:
    case webnative.Scenario.Continuation:
      scenarioSpan.textContent = 'Signed in.';
      dom.show('app')

      const fs = state.fs;

      window.addEventListener('message', event => {
        console.log(event)
        dom.displayCapturedPage(event.data.detail);
      });

      break;

    case webnative.Scenario.NotAuthorised:
    case webnative.Scenario.AuthCancelled:
      scenarioSpan.textContent = 'Not signed in.';
      dom.show('sign-in');
      break;
  }

  signInButton.addEventListener('click', () => {
    console.log('signing in');
    webnative.redirectToLobby(state.permissions);
  });

}).catch(error => {
  switch (error) {
    case 'UNSUPPORTED_BROWSER':
      scenarioSpan.textContent = 'Unsupported browser.';
      break;

    case 'INSECURE_CONTEXT':
      scenarioSpan.textContent = 'Insecure context.';
      break;
  }
});
