const urlA = document.getElementById('url')
const timestampSpan = document.getElementById('timestamp')
const screenshotImg = document.getElementById('screenshot')
const capturedPagesCounter = document.getElementById('captured-pages-counter');

const savedPage = document.getElementById('saved-page');
const savedPageLabel = document.getElementById('saved-page-label');
const savedPageUrl = document.getElementById('saved-page-url');
const savedPageTimestamp = document.getElementById('saved-page-timestamp');
const savedPageScreenshot = document.getElementById('saved-page-screenshot');
const savedPageNotes = document.getElementById('saved-page-notes');

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

// CAPTURED PAGES

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


// SAVED PAGES

const savedPageOption = page => {
  // console.log(page)
    const option = document.createElement('aside');

    const labelP = document.createElement('p');
    labelP.textContent = page.label;
    labelP.style.fontWeight = 'bold';

    const timestampP = document.createElement('p');
    timestampP.textContent = formatDate(page.timestamp);

    option.appendChild(labelP)
    option.appendChild(timestampP)

    option.addEventListener('click', () => showPage(page));
    return option;
}

const showPage = page => {
  savedPage.style.display = 'none';

  savedPageScreenshot.src = page.imageUri;
  savedPageLabel.textContent = page.label;
  savedPageUrl.textContent = page.url;
  savedPageUrl.href = page.url;
  savedPageTimestamp.textContent = formatDate(page.timestamp);
  savedPageNotes.textContent = page.notes;

  savedPage.style.display = 'block';
}


// Localization

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

export { clearInputs, displayCapturedPage, hide, savedPageOption, setPageCount, show };
