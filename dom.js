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
  urlA.href = data.url;
  urlA.textContent = data.url;
  timestampSpan.textContent = formatDate(data.timestamp);
  hide('message')
  show('latest-capture')
}

function formatDate(timestamp) {
  const date = new Date(timestamp);
  const lang = navigator.language;
  const formatOptions = {
    dateStyle: 'long',
    timeStyle: 'short'
  };

  const formattedDate = new Intl.DateTimeFormat(
    lang,
    formatOptions
  ).format(date);

  return formattedDate;
}

export { displayCapturedPage, hide, show };
