import { Store } from './store.js';

const store = new Store(document);
document.addEventListener('DOMContentLoaded', () => store.init());
