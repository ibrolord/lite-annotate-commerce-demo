const params = new URLSearchParams(window.location.search);
const explicitApiUrl = params.get('annotateApi');
const explicitWidgetUrl = params.get('widgetUrl');

if (explicitApiUrl) {
  localStorage.setItem('liteAnnotateApiUrl', explicitApiUrl);
}

if (explicitWidgetUrl) {
  localStorage.setItem('liteAnnotateWidgetUrl', explicitWidgetUrl);
}

const apiUrl = explicitApiUrl ||
  localStorage.getItem('liteAnnotateApiUrl') ||
  (isLocalHost() ? 'http://localhost:3001' : '');

const widgetUrl = explicitWidgetUrl ||
  localStorage.getItem('liteAnnotateWidgetUrl') ||
  (apiUrl ? `${apiUrl.replace(/\/$/, '')}/widget.js` : '');

window.ANNOTATE_PROJECT_ID = 'cedar-and-sail-commerce';
window.ANNOTATE_REPO = 'ibrolord/lite-annotate-commerce-demo';

if (apiUrl) {
  window.ANNOTATE_API_URL = apiUrl.replace(/\/$/, '');
}

if (widgetUrl) {
  const script = document.createElement('script');
  script.src = widgetUrl;
  script.async = true;
  script.dataset.liteAnnotateWidget = 'true';
  script.addEventListener('load', () => {
    console.log('[cedar-and-sail] Lite Annotate widget loaded', widgetUrl);
  });
  script.addEventListener('error', () => {
    console.warn('[cedar-and-sail] Lite Annotate widget failed to load', widgetUrl);
  });
  document.head.appendChild(script);
} else {
  console.info('[cedar-and-sail] Lite Annotate widget URL is not configured.');
}

function isLocalHost() {
  return ['localhost', '127.0.0.1', '0.0.0.0'].includes(window.location.hostname);
}

