import * as dom from './dom.js';

const scenarioSpan = document.getElementById('scenario');
const signInButton = document.getElementById('sign-in');

const saveButton = document.getElementById('save');
const labelInput = document.getElementById('label');
const notesInput = document.getElementById('notes');

webnative.setup.debug({ enabled: true });

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
  switch (state.scenario) {
    case webnative.Scenario.AuthSucceeded:
    case webnative.Scenario.Continuation:
      scenarioSpan.textContent = 'Signed in.';
      dom.show('app');

      const fs = state.fs;
      const savedPagesPath = webnative.path.directory('public', 'saved-pages')
      let latestCapture = {};

      window.addEventListener('message', event => {
        console.log(event)
        dom.displayCapturedPage(event.data.detail);

        latestCapture = event.data.detail;
      });

      saveButton.addEventListener('click', async event => {
        event.preventDefault();

        latestCapture = {
          ...latestCapture,
          uuid: uuid.v4(),
          label: labelInput.value,
          notes: notesInput.value
        }

        const path = webnative.path.combine(
          savedPagesPath,
          webnative.path.file(`${latestCapture.uuid}.json`)
        )

        dom.hide('save')
        dom.show('saving-message')
        await fs.write(path, latestCapture);
        await fs.publish();
        dom.hide('saving-message')
      })

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