browser.runtime.onMessage.addListener(
  function (request, sender, sendResponse) {
      sendResponse({ farewell: "goodbye" });

      // console.log("In content script: ", request.greeting)
      // document.dispatchEvent(new CustomEvent('offload', { detail: request.greeting}));

      console.log("In content script: ", request)
      document.dispatchEvent(new CustomEvent('offload', { detail: request}));
  }
);