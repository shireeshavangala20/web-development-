/* =================================================================
   BROWN SUGAR BAKERY — SCRIPT.JS
================================================================= */

const products = [
  { id: 1, category: "cake", name: "Belgian Chocolate Truffle Cake",
    description: "Rich Belgian chocolate layers with a silky ganache finish.",
    price: 650, rating: 4.8, image: "images/cake-1.jpg", badge: "Bestseller" },
  { id: 2, category: "cake", name: "Red Velvet Cream Cake",
    description: "Soft red velvet sponge with cream cheese frosting.",
    price: 600, rating: 4.6, image: "images/cake-2.jpg" },
  { id: 3, category: "cake", name: "Fresh Strawberry Cake",
    description: "Vanilla sponge loaded with fresh strawberries and cream.",
    price: 580, rating: 4.5, image: "images/cake-3.jpg" },
  { id: 4, category: "cake", name: "Black Forest Cake",
    description: "Classic chocolate sponge with cherries and whipped cream.",
    price: 620, rating: 4.7, image: "images/cake-4.jpg", badge: "New" },

  { id: 5, category: "icecream", name: "Belgian Chocolate Tub",
    description: "Dense chocolate ice cream made with real cocoa.",
    price: 250, rating: 4.7, image: "images/icecream-1.jpg" },
  { id: 6, category: "icecream", name: "Mango Delight",
    description: "Creamy ice cream bursting with alphonso mango pulp.",
    price: 220, rating: 4.5, image: "images/icecream-2.jpg", badge: "Bestseller" },
  { id: 7, category: "icecream", name: "Butterscotch Crunch",
    description: "Caramel ice cream loaded with crunchy butterscotch bits.",
    price: 230, rating: 4.6, image: "images/icecream-3.jpg" },
  { id: 8, category: "icecream", name: "Vanilla Bean Classic",
    description: "Smooth vanilla ice cream made with real vanilla beans.",
    price: 200, rating: 4.4, image: "images/icecream-4.jpg" },

  { id: 9, category: "chocolate", name: "Assorted Truffle Box",
    description: "Handcrafted truffles in dark, milk, and white chocolate.",
    price: 450, rating: 4.9, image: "images/chocolate-1.jpg", badge: "Bestseller" },
  { id: 10, category: "chocolate", name: "Hazelnut Praline Bar",
    description: "Crunchy hazelnut praline wrapped in smooth milk chocolate.",
    price: 180, rating: 4.6, image: "images/chocolate-2.jpg" },
  { id: 11, category: "chocolate", name: "Dark Chocolate Almond Bar",
    description: "70% dark chocolate studded with roasted almonds.",
    price: 190, rating: 4.7, image: "images/chocolate-3.jpg" },
  { id: 12, category: "chocolate", name: "Gift Hamper Box",
    description: "A curated box of our best chocolates, perfect for gifting.",
    price: 750, rating: 4.8, image: "images/chocolate-4.jpg", badge: "New" },
];

let currentSearchText = "";
let currentCategory = "all";

function getStarsHtml(rating) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  let html = "";
  for (let i = 0; i < fullStars; i++) html += '<i class="bi bi-star-fill"></i>';
  if (hasHalfStar) html += '<i class="bi bi-star-half"></i>';
  for (let i = 0; i < emptyStars; i++) html += '<i class="bi bi-star"></i>';

  return html;
}

function getFilteredProducts() {
  return products.filter(function (product) {
    const matchesCategory = currentCategory === "all" || product.category === currentCategory;
    const matchesSearch = product.name.toLowerCase().includes(currentSearchText.toLowerCase());
    return matchesCategory && matchesSearch;
  });
}

function buildProductCardHtml(product) {
  const placeholderUrl =
    "https://placehold.co/500x400/4A2C2A/FFF8EE?text=" + encodeURIComponent(product.name);

  const badgeHtml = product.badge
    ? '<span class="product-badge">' + product.badge + '</span>'
    : "";

  return `
    <div class="col-sm-6 col-lg-4">
      <div class="product-card">
        <div class="product-img-wrap">
          ${badgeHtml}
          <img src="${product.image}" onerror="this.onerror=null;this.src='${placeholderUrl}'" alt="${product.name}">
        </div>
        <div class="product-body">
          <p class="product-category-tag">${product.category}</p>
          <h3 class="product-name">${product.name}</h3>
          <p class="product-desc">${product.description}</p>
          <div class="product-rating">
            ${getStarsHtml(product.rating)}
            <span>${product.rating}</span>
          </div>
          <div class="product-footer">
            <span class="product-price">&#8377;${product.price}</span>
            <button class="add-cart-btn" onclick="addToCart(${product.id})">
              <i class="bi bi-bag-plus"></i> Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
}

function displayProducts() {
  const grid = document.getElementById("productGrid");
  const noResultsBox = document.getElementById("noResults");
  const filtered = getFilteredProducts();

  if (filtered.length === 0) {
    grid.innerHTML = "";
    noResultsBox.classList.remove("d-none");
    return;
  }

  noResultsBox.classList.add("d-none");
  grid.innerHTML = filtered.map(buildProductCardHtml).join("");
}

let cart = JSON.parse(localStorage.getItem("bakeryCart")) || [];

function saveCartToStorage() {
  localStorage.setItem("bakeryCart", JSON.stringify(cart));
}

function addToCart(productId) {
  const product = products.find(function (p) { return p.id === productId; });
  if (!product) return;

  const existingItem = cart.find(function (item) { return item.id === productId; });

  if (existingItem) {
    existingItem.qty += 1;
  } else {
    cart.push({ ...product, qty: 1 });
  }

  saveCartToStorage();
  renderCartItems();
  updateCartCount();
  showToast(product.name + " added to cart!");
}

function removeFromCart(productId) {
  cart = cart.filter(function (item) { return item.id !== productId; });
  saveCartToStorage();
  renderCartItems();
  updateCartCount();
}

function changeQty(productId, delta) {
  const item = cart.find(function (i) { return i.id === productId; });
  if (!item) return;

  item.qty += delta;

  if (item.qty <= 0) {
    removeFromCart(productId);
    return;
  }

  saveCartToStorage();
  renderCartItems();
  updateCartCount();
}

function getCartTotal() {
  return cart.reduce(function (total, item) {
    return total + item.price * item.qty;
  }, 0);
}

function renderCartItems() {
  const cartItemsBox = document.getElementById("cartItems");
  const cartTotalText = document.getElementById("cartTotal");

  if (cart.length === 0) {
    cartItemsBox.innerHTML = `
      <div class="empty-cart-msg">
        <i class="bi bi-bag-x"></i>
        <p>Your cart is empty.<br>Add something sweet from the menu!</p>
      </div>`;
    cartTotalText.textContent = "₹0";
    return;
  }

  const placeholderUrl = "https://placehold.co/100x100/4A2C2A/FFF8EE?text=%F0%9F%A7%81";

  cartItemsBox.innerHTML = cart.map(function (item) {
    return `
      <div class="cart-item">
        <img src="${item.image}" onerror="this.onerror=null;this.src='${placeholderUrl}'" alt="${item.name}">
        <div class="cart-item-info">
          <h6>${item.name}</h6>
          <div class="cart-item-price">&#8377;${item.price} x ${item.qty}</div>
          <div class="qty-control">
            <button onclick="changeQty(${item.id}, -1)">-</button>
            <span>${item.qty}</span>
            <button onclick="changeQty(${item.id}, 1)">+</button>
          </div>
        </div>
        <button class="remove-item-btn" onclick="removeFromCart(${item.id})">
          <i class="bi bi-trash"></i>
        </button>
      </div>
    `;
  }).join("");

  cartTotalText.textContent = "₹" + getCartTotal();
}

function updateCartCount() {
  const totalItems = cart.reduce(function (sum, item) { return sum + item.qty; }, 0);
  document.getElementById("cartCount").textContent = totalItems;
}

function showToast(message) {
  document.getElementById("toastMessage").textContent = message;
  const toastElement = document.getElementById("cartToast");
  const toast = new bootstrap.Toast(toastElement, { delay: 2000 });
  toast.show();
}

function setupContactForm() {
  const form = document.getElementById("contactForm");
  const successBox = document.getElementById("formSuccess");

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    successBox.classList.remove("d-none");
    form.reset();

    setTimeout(function () {
      successBox.classList.add("d-none");
    }, 4000);
  });
}

function setupNewsletterForm() {
  const form = document.getElementById("newsletterForm");
  const msg = document.getElementById("newsletterMsg");

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    msg.classList.remove("d-none");
    form.reset();
    setTimeout(function () { msg.classList.add("d-none"); }, 3500);
  });
}

function setupPreloader() {
  window.addEventListener("load", function () {
    const preloader = document.getElementById("preloader");
    setTimeout(function () {
      preloader.classList.add("fade-out");
      setTimeout(function () { preloader.style.display = "none"; }, 500);
    }, 500);
  });
}

function setupScrollEffects() {
  const navbar = document.getElementById("mainNavbar");
  const backToTopBtn = document.getElementById("backToTop");

  window.addEventListener("scroll", function () {
    if (window.scrollY > 50) {
      navbar.classList.add("navbar-scrolled");
    } else {
      navbar.classList.remove("navbar-scrolled");
    }

    if (window.scrollY > 400) {
      backToTopBtn.classList.add("show");
    } else {
      backToTopBtn.classList.remove("show");
    }
  });

  backToTopBtn.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

function setupScrollReveal() {
  const revealElements = document.querySelectorAll(".reveal");

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add("active");
      }
    });
  }, { threshold: 0.15 });

  revealElements.forEach(function (el) { observer.observe(el); });
}

document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("year").textContent = new Date().getFullYear();

  displayProducts();
  renderCartItems();
  updateCartCount();

  document.getElementById("searchInput").addEventListener("input", function (event) {
    currentSearchText = event.target.value;
    displayProducts();
  });

  const filterButtons = document.querySelectorAll(".filter-btn");
  filterButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      filterButtons.forEach(function (btn) { btn.classList.remove("active"); });
      button.classList.add("active");

      currentCategory = button.dataset.category;
      displayProducts();
    });
  });

  document.getElementById("checkoutBtn").addEventListener("click", function () {
    if (cart.length === 0) {
      alert("Your cart is empty. Add a few treats first!");
      return;
    }
    alert("Thank you for your order! Total: ₹" + getCartTotal() +
          "\n(This is a demo checkout — no real payment is processed.)");
    cart = [];
    saveCartToStorage();
    renderCartItems();
    updateCartCount();
  });

  setupContactForm();
  setupNewsletterForm();
  setupPreloader();
  setupScrollEffects();
  setupScrollReveal();
});