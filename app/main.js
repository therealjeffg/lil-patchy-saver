const messageP = document.getElementById('message')
const urlA = document.getElementById('url')
const timestampSpan = document.getElementById('timestamp')
const screenshotImg = document.getElementById('screenshot')


window.addEventListener('message', event => {
  const data = event.data.detail;

  messageP.textContent = 'Viewing '
  urlA.href = data.url;
  urlA.textContent = data.url;
  timestampSpan.textContent = data.timestamp;
  screenshotImg.src = data.imageUri;
});