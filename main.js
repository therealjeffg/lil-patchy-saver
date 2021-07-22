import * as dom from './dom.js';

const scenarioSpan = document.getElementById('scenario');
const signInButton = document.getElementById('sign-in');

const capturedPagesMessage = document.getElementById('captured-pages-message');
const labelInput = document.getElementById('label');
const notesInput = document.getElementById('notes');
const saveButton = document.getElementById('save');

const savedPagesOptions = document.getElementById('saved-page-options');

webnative.setup.debug({ enabled: true });

const fissionInit = {
  permissions: {
    app: {
      name: 'lil-patchy-saver',
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

      // Send a message to inform the extension that the user is authed
      window.postMessage({ type: "FROM_PAGE", text: "User is authenticated." });

      const fs = state.fs;

      let capturedPages, capturedPagesCount, currentCapturedPage;
      let updatePageCount;

      /** Load saved pages from WNFS
       * The pages are stored JSON files in 'public/saved-pages'.
       */

      const savedPagesPath = webnative.path.directory('public', 'saved-pages')
      const utf8decoder = new TextDecoder();

      let savedPagesIndex = await fs.ls(savedPagesPath)
      let savedPages = await Promise.all(Object.keys(savedPagesIndex).map(async filename => {
        const path = webnative.path.combine(
          savedPagesPath,
          webnative.path.file(filename)
        )

        const file = await fs.read(path);
        const decodedFile = utf8decoder.decode(file);

        return JSON.parse(decodedFile);
      }))


      /** Show cards for each saved page if any */

      if (savedPages.length > 0) {
        dom.show('saved-pages')

        savedPages.forEach(page => {
          let option = dom.savedPageOption(page);
          savedPagesOptions.appendChild(option)
        })
      }


      /** Listen for pages to save from the extension */

      window.addEventListener('message', event => {

        console.log('event', event, window.patchy);

        if (!event.data && !event.data.id) {
          // reject message payload shapes we don't support
          return;
        } else {
          const detail = event.data.data;

          console.log('got here', detail);

          capturedPages = Array.isArray(detail) ? detail : [detail];
          capturedPagesCount = capturedPages.length;
  
          currentCapturedPage = capturedPages.shift();
          dom.displayCapturedPage(currentCapturedPage);
  
          updatePageCount = dom.setPageCount(1, capturedPagesCount)
          dom.hide('captured-pages-message');
          dom.clearInputs('label', 'notes')
          dom.show('captured-pages', 'captured-pages-counter', 'save');
        }
      });

      /** Save pages to WNFS one at a time until done */

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

        // Write the captured page to WNFS
        await fs.write(path, JSON.stringify(currentCapturedPage));
        await fs.publish();

        // Add a card to saved pages section
        let option = dom.savedPageOption(currentCapturedPage);
        savedPagesOptions.appendChild(option);

        dom.hide('saving')
        dom.clearInputs('label', 'notes');

        if (capturedPages.length > 0) {

          // Slice off the next page to display
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


  /** Sign the user in through the Fission auth lobby */

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