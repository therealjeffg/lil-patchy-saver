import * as dom from './dom.js';

const scenarioSpan = document.getElementById('scenario');
const signInButton = document.getElementById('sign-in');

const capturedPagesMessage = document.getElementById('captured-pages-message');

const labelInput = document.getElementById('label');
const notesInput = document.getElementById('notes');
const saveButton = document.getElementById('save');

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

      window.postMessage({ type: "FROM_PAGE", text: "User is authenticated." });

      const fs = state.fs;
      const savedPagesPath = webnative.path.directory('public', 'saved-pages')
      let capturedPages;
      let capturedPagesCount;
      let updatePageCount;
      let currentCapturedPage;

      window.addEventListener('message', event => {

        // Ignore messages from page script
        if (event.data.type && (event.data.type === "FROM_PAGE")) {
          return;
        }

        const detail = event.data.detail;

        capturedPages = Array.isArray(detail) ? detail : [detail];
        capturedPagesCount = capturedPages.length;

        currentCapturedPage = capturedPages.shift();
        dom.displayCapturedPage(currentCapturedPage);

        updatePageCount = dom.setPageCount(1, capturedPagesCount)
        dom.hide('captured-pages-message');
        dom.clearInputs('label', 'notes')
        dom.show('captured-pages', 'captured-pages-counter', 'save');
      });

      saveButton.addEventListener('click', async event => {
        event.preventDefault();

        currentCapturedPage = {
          ...currentCapturedPage,
          uuid: uuid.v4(),
          label: labelInput.value,
          notes: notesInput.value
        }

        const path = webnative.path.combine(
          savedPagesPath,
          webnative.path.file(`${currentCapturedPage.uuid}.json`)
        )

        dom.hide('save')
        dom.show('saving')

        await fs.write(path, currentCapturedPage);
        await fs.publish();

        dom.hide('saving')
        dom.clearInputs('label', 'notes');

        if (capturedPages.length > 0) {
          let currentCapturedPage = capturedPages.shift();
          dom.displayCapturedPage(currentCapturedPage);

          updatePageCount(capturedPagesCount - capturedPages.length)
          dom.show('save')
        } else {
          dom.hide('captured-pages', 'captured-pages-counter')
          capturedPagesMessage.textContent = 'All pages saved!'
          dom.show('captured-pages-message');
        }
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