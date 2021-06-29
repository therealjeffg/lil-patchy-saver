const urlA = document.getElementById('url')
const timestampSpan = document.getElementById('timestamp')
const screenshotImg = document.getElementById('screenshot')


document.addEventListener('offload', event => {
  const data = event.detail;
  console.log('Content script sent: ', data);
});