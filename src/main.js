import { decode } from './hash.js';

const app = document.getElementById('app');
const pageData = decode(window.location.hash);

if (pageData) {
  const { initReceiver } = await import('./receiver.js');
  initReceiver(app, pageData);
} else {
  const { initSender } = await import('./sender.js');
  initSender(app);
}
