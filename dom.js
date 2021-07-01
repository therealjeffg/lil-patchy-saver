const urlA = document.getElementById('url')
const timestampSpan = document.getElementById('timestamp')
const screenshotImg = document.getElementById('screenshot')
const capturedPagesCounter = document.getElementById('captured-pages-counter');

const hide = (...ids) => {
  ids.forEach(id => {
    document.getElementById(id).style.display = 'none';
  });
};

const show = (...ids) => {
  ids.forEach(id => {
    const el = document.getElementById(id);
    if (el.tagName === 'SPAN') {
      el.style.display = 'inline';
    } else {
      el.style.display = 'block';
    }
  });
};

const clearInputs = (...ids) => {
  ids.forEach(id =>  {
    const el = document.getElementById(id);
    el.value = '';
  })
}

const setPageCount = (initialPage, totalPages) => {
  const total = totalPages;
  capturedPagesCounter.textContent = `(${initialPage}/${total})`

  return count => {
    capturedPagesCounter.textContent = `(${count}/${total})`
  }
}

const displayCapturedPage = (data) => {
  screenshotImg.src = data.imageUri;
  urlA.href = data.url;
  urlA.textContent = data.url;
  timestampSpan.textContent = formatDate(data.timestamp);
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

export { clearInputs, displayCapturedPage, hide, setPageCount, show };
