const scenarioSpan = document.getElementById('scenario');
const signInButton = document.getElementById('sign-in')

const messageP = document.getElementById('message')
const urlA = document.getElementById('url')
const timestampSpan = document.getElementById('timestamp')
const screenshotImg = document.getElementById('screenshot')


const fissionInit = {
  permissions: {
    app: {
      name: 'pachy',
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
      show('app')

      const fs = state.fs;

      window.addEventListener('message', event => {
        console.log(event)
        displayCapturedPage(event.data.detail);
      });

      break;

    case webnative.Scenario.NotAuthorised:
    case webnative.Scenario.AuthCancelled:
      scenarioSpan.textContent = 'Not signed in.';
      show('sign-in');
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


const hide = (...ids) => {
  ids.forEach(id => {
    document.getElementById(id).style.display = 'none';
  });
};

const show = (...ids) => {
  ids.forEach(id => {
    const el = document.getElementById(id);
    el.style.display = 'block';
  });
};

const displayCapturedPage = (data) => {
  screenshotImg.src = data.imageUri;
  messageP.textContent = ''
  urlA.href = data.url;
  urlA.textContent = data.url;
  timestampSpan.textContent = data.timestamp;
}