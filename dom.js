const messageP = document.getElementById('message')
const urlA = document.getElementById('url')
const timestampSpan = document.getElementById('timestamp')
const screenshotImg = document.getElementById('screenshot')

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

export { displayCapturedPage, hide, show };