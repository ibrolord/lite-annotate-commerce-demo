import { products } from './catalog.js';
import { formatLoyaltyGreeting } from './customer.js';

const cart = new Map();
const productGrid = document.getElementById('product-grid');
const cartLines = document.getElementById('cart-lines');
const navCartCount = document.getElementById('nav-cart-count');
const summaryItems = document.getElementById('summary-items');
const summarySubtotal = document.getElementById('summary-subtotal');
const quoteBox = document.getElementById('quote-box');
const checkoutStatus = document.getElementById('checkout-status');
const loyaltyStatus = document.getElementById('loyalty-status');
const profilePanel = document.getElementById('profile-panel');

renderProducts();
renderCart();
bindNavigation();
showRoute(window.location.pathname);

document.getElementById('refresh-quote').addEventListener('click', refreshQuote);
document.getElementById('checkout-form').addEventListener('submit', handleCheckout);
document.getElementById('load-loyalty-profile').addEventListener('click', loadLoyaltyProfile);
window.addEventListener('popstate', () => showRoute(window.location.pathname));

function renderProducts() {
  productGrid.innerHTML = '';
  for (const product of products) {
    const article = document.createElement('article');
    article.className = 'product-card';
    const art = product.imageSrc
      ? `<img class="product-image" src="${product.imageSrc}" alt="${product.imageAlt}" data-product-image="${product.id}" />`
      : `<div class="product-art ${product.id}" aria-label="${product.imageAlt}" role="img"></div>`;
    article.innerHTML = `
      <div class="product-media">${art}</div>
      <div class="product-meta">
        <span>${product.category}</span>
        <strong>$${product.price}</strong>
      </div>
      <h3>${product.name}</h3>
      <p>${product.description}</p>
      <button class="button button-secondary" type="button" data-add-product="${product.id}">
        Add ${product.name}
      </button>
    `;
    productGrid.appendChild(article);
  }

  productGrid.querySelectorAll('[data-product-image]').forEach((image) => {
    const markBrokenImage = () => {
      image.closest('.product-media')?.classList.add('media-broken');
      console.error('[cedar-and-sail] product image failed to load', {
        productId: image.dataset.productImage,
        src: image.getAttribute('src')
      });
    };
    image.addEventListener('error', markBrokenImage);
    if (image.complete && image.naturalWidth === 0) {
      markBrokenImage();
    }
  });

  productGrid.addEventListener('click', (event) => {
    const button = event.target.closest('[data-add-product]');
    if (!button) return;
    addToCart(button.dataset.addProduct);
  });
}

function addToCart(productId) {
  const quantity = cart.get(productId) || 0;
  cart.set(productId, quantity + 1);
  console.log('[cedar-and-sail] added product to cart', productId);
  renderCart();
}

function renderCart() {
  const entries = Array.from(cart.entries())
    .map(([productId, quantity]) => ({
      product: products.find((item) => item.id === productId),
      quantity
    }))
    .filter((line) => line.product);

  const itemCount = entries.reduce((total, line) => total + line.quantity, 0);
  const subtotal = entries.reduce((total, line) => total + line.quantity * line.product.price, 0);

  navCartCount.textContent = itemCount > 0 ? String(itemCount) : '';
  summaryItems.textContent = String(itemCount);
  summarySubtotal.textContent = `$${subtotal}`;

  if (!entries.length) {
    cartLines.innerHTML = '<p class="empty-state">Your bag is empty. Add a product from the catalog.</p>';
    return;
  }

  cartLines.innerHTML = entries.map(({ product, quantity }) => `
    <article class="cart-line">
      <div>
        <strong>${product.name}</strong>
        <span>${product.color} / ${product.category}</span>
      </div>
      <div>
        <span>Qty ${quantity}</span>
        <strong>$${product.price * quantity}</strong>
      </div>
    </article>
  `).join('');
}

async function refreshQuote() {
  quoteBox.textContent = 'Refreshing quote...';
  const response = await fetch('/api/checkout/quote');
  const quote = await response.json();
  quoteBox.textContent = JSON.stringify(quote, null, 2);
}

function handleCheckout(event) {
  event.preventDefault();
  checkoutStatus.textContent = 'Redirecting to order confirmation...';
  console.warn('[cedar-and-sail] checkout redirect target is not registered', '/checkout/confirmation');
  setTimeout(() => {
    history.pushState({}, '', '/checkout/confirmation');
    showRoute('/checkout/confirmation');
  }, 120);
}

async function loadLoyaltyProfile() {
  loyaltyStatus.textContent = 'Loading loyalty profile...';
  profilePanel.classList.remove('profile-error');

  const response = await fetch('/api/customers/vip-404');
  if (!response.ok) {
    console.warn('[cedar-and-sail] loyalty profile lookup returned', response.status);
  }

  try {
    const greeting = formatLoyaltyGreeting('vip-404');
    loyaltyStatus.textContent = greeting;
  } catch (error) {
    loyaltyStatus.textContent = 'Loyalty profile failed to load.';
    profilePanel.classList.add('profile-error');
    console.error('[cedar-and-sail] loyalty profile crashed', error);
    setTimeout(() => {
      throw error;
    }, 0);
  }
}

function bindNavigation() {
  document.querySelectorAll('[data-route-link]').forEach((link) => {
    link.addEventListener('click', (event) => {
      const href = link.getAttribute('href');
      if (!href || href.startsWith('http')) return;
      event.preventDefault();
      history.pushState({}, '', href);
      showRoute(href);
    });
  });
}

function showRoute(pathname) {
  const route = routeName(pathname);
  document.querySelectorAll('[data-view]').forEach((view) => {
    view.hidden = view.dataset.view !== route;
  });

  document.querySelectorAll('.main-nav a').forEach((link) => {
    const href = link.getAttribute('href');
    link.toggleAttribute('aria-current', routeName(href) === route);
  });

  if (route === 'checkout') {
    refreshQuote().catch((error) => {
      quoteBox.textContent = 'Quote failed to load.';
      console.error('[cedar-and-sail] checkout quote failed', error);
    });
  }
}

function routeName(pathname) {
  if (pathname === '/shop') return 'shop';
  if (pathname === '/cart') return 'cart';
  if (pathname === '/checkout') return 'checkout';
  if (pathname === '/account') return 'account';
  return 'home';
}
