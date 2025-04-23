// Ayarlar
const PRODUCTS_PER_PAGE = 6;

// Global durum
let currentCategory = "all";
let currentPage = 1;

// DOM hazır olunca
document.addEventListener("DOMContentLoaded", () => {
  setupFilterButtons();
  loadProducts();
});

// Ürünleri ve sayfalama butonlarını yükle
function loadProducts() {
  const productsContainer = document.getElementById("products-container");
  const paginationContainer = document.getElementById("pagination");

  // Grid & sayfalama alanlarını temizle
  productsContainer.innerHTML = "";
  paginationContainer.innerHTML = "";

  // Kategoriye göre filtrele
  const filtered =
    currentCategory === "all"
      ? products
      : products.filter((p) => p.category === currentCategory);

  // Ürün yoksa mesaj göster
  if (filtered.length === 0) {
    productsContainer.innerHTML =
      '<div class="no-products">Bu kategoride ürün bulunmuyor.</div>';
    return;
  }

  // Sayfa sayısını hesapla
  const totalPages = Math.ceil(filtered.length / PRODUCTS_PER_PAGE);

  // Sayfa dışına taşma kontrolü (örn. filtre değiştiğinde)
  if (currentPage > totalPages) currentPage = 1;

  // Mevcut sayfanın ürünleri
  const start = (currentPage - 1) * PRODUCTS_PER_PAGE;
  const end = start + PRODUCTS_PER_PAGE;
  const pageProducts = filtered.slice(start, end);

  // Kartları oluştur
  pageProducts.forEach((product) => {
    const card = document.createElement("div");
    card.classList.add("product-card");
    card.innerHTML = `
      <div class="product-card__image">
        <img src="${product.image}" alt="${product.title}" />
      </div>
      <div class="product-card__content">
        <span class="product-card__category">${getCategoryName(
          product.category
        )}</span>
        <h3 class="product-card__title">${product.title}</h3>
        <p class="product-card__description">${product.description}</p>
        <div class="product-card__footer">
          <div class="product-card__price">${product.price}</div>
          <a href="#contact" class="btn btn--outline">Bilgi Al</a>
        </div>
      </div>`;
    productsContainer.appendChild(card);
  });

  // Sayfa butonlarını oluştur
  renderPagination(totalPages);
}

function renderPagination(totalPages) {
  const paginationContainer = document.getElementById("pagination");

  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement("button");
    btn.classList.add("page-btn");
    if (i === currentPage) btn.classList.add("active");
    btn.textContent = i;

    // --- TIKLAMADA: sayfa + kaydırma ---
    btn.addEventListener("click", () => {
      currentPage = i;
      loadProducts(); // kartları güncelle

      // #products bölümüne yumuşak kaydır
      const target = document.getElementById("products");
      // Eğer sabit (fixed) bir header varsa yüksekliğini düşerek hizalayın
      const headerOffset = 80; // header yüksekliği (px) - ihtiyaca göre değiştir
      const top =
        target.getBoundingClientRect().top + window.pageYOffset - headerOffset;

      window.scrollTo({ top, behavior: "smooth" });
    });
    // ------------------------------------

    paginationContainer.appendChild(btn);
  }
}

// Kategori isimlerini Türkçeleştir
function getCategoryName(category) {
  switch (category) {
    case "içecek":
      return "İçecek Otomatı";
    case "yiyecek":
      return "Yiyecek Otomatı";
    case "özel":
      return "Özel Çözüm";
    default:
      return category;
  }
}

// Filtre butonlarını etkinleştir
function setupFilterButtons() {
  const filterButtons = document.querySelectorAll(".filter-btn");

  filterButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      // Aktif butonu güncelle
      document.querySelector(".filter-btn.active")?.classList.remove("active");
      btn.classList.add("active");

      // Kategori & sayfa durumunu değiştir
      currentCategory = btn.dataset.filter;
      currentPage = 1;
      loadProducts();
    });
  });
}
