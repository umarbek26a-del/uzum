import React, { useState, useMemo, useEffect } from "react";

const BRANDS = ["Estée Lauder", "Chanel", "Dior", "Tom Ford", "La Mer"];

const MIN_LIMIT = 0;
const MAX_LIMIT = 300;
const MIN_GAP = 5;

const PRICE_PRESETS = [
  { id: "under-50", label: "Under $50", min: 0, max: 50 },
  { id: "50-100", label: "$50-$100", min: 50, max: 100 },
  { id: "100-150", label: "$100-$150", min: 100, max: 150 },
  { id: "150-plus", label: "$150+", min: 150, max: 300 },
];

const PICKUP_POINTS = [
  "Ташкент • Мирабад, ул. Нукусская 24",
  "Ташкент • Чиланзар, Ц-квартал 12",
  "Ташкент • Юнусабад, 4-й квартал 19",
  "Самарканд • ул. Регистанская 42",
  "Бухара • ул. Бахауддина Накшбанди 88",
];

const TRANSLATIONS = {
  ru: {
    pickupPoints: "Пункты выдачи",
    myOrders: "Мои заказы",
    morning: "Утро",
    night: "Ночь",
    catalog: "Каталог",
    searchPlaceholder: "Поиск женских аксессуаров и брендов...",
    find: "Найти",
    profileLogin: "Профиль / Вход",
    wishlist: "Избранное",
    cart: "Корзина",
    allCats: "Все аксессуары",
    catBags: "Сумки и кейсы",
    catScarves: "Платки и шали",
    catGlasses: "Очки",
    catHair: "Для волос",
    catBeauty: "Бьюти-аксессуары",
    heroBadge: "lumel1 • ЖЕНСКИЕ АКСЕССУАРЫ",
    heroTitle: "Люксовые женские аксессуары с доставкой в пункт выдачи",
    heroSub:
      "36 моделей от Chanel, Dior, Tom Ford, Estée Lauder и La Mer в одном JSX-компоненте с фильтрами, корзиной и отслеживанием в пункте выдачи.",
    filters: "Фильтры",
    reset: "Сбросить",
    priceRange: "Диапазон цен",
    luxuryBrands: "Люкс-бренды",
    sortFeatured: "Популярные",
    sortPriceAsc: "Сначала дешевле",
    sortPriceDesc: "Сначала дороже",
    sortRating: "По рейтингу",
    showing: "Показано товаров:",
    inCart: "В корзину",
    orderNow: "Заказать",
    perMonth: "/мес × 12",
    reviews: "отзывов",
    backToCatalog: "← В каталог",
    tabAll: "Все заказы",
    tabTransit: "В пути",
    tabPickup: "В пункте выдачи",
    simulateArrival: "Отметить прибытие в пункт выдачи",
    atPickupStatus: "В пункте выдачи",
    inTransitStatus: "В пути • Прибудет завтра",
    profileTabOrders: "Заказы",
    profileTabInfo: "Регистрация и профиль",
    fullName: "Имя и фамилия",
    email: "Email",
    phone: "Телефон",
    defaultPickup: "Пункт выдачи по умолчанию",
    saveProfile: "Сохранить профиль",
    savedMsg: "Данные профиля сохранены.",
    emptyTitle: "По выбранным фильтрам ничего не найдено",
    emptySub: "Измените диапазон цен, бренд или категорию.",
    cartTotal: "Итого к оплате:",
    checkoutBtn: "Оформить заказ в пункт выдачи",
    orderCreatedMsg: "Заказ оформлен! Отслеживайте статус в разделе «Профиль → Заказы».",
  },
  uz: {
    pickupPoints: "Topshirish punktlari",
    myOrders: "Buyurtmalarim",
    morning: "Tong",
    night: "Tun",
    catalog: "Katalog",
    searchPlaceholder: "Ayollar aksessuarlari va brendlarini izlash...",
    find: "Izlash",
    profileLogin: "Profil / Kirish",
    wishlist: "Saralangan",
    cart: "Savat",
    allCats: "Barcha aksessuarlar",
    catBags: "Sumka va keys",
    catScarves: "Roʻmol va shallar",
    catGlasses: "Koʻzoynaklar",
    catHair: "Soch bezaklari",
    catBeauty: "Byuti aksessuarlar",
    heroBadge: "UZUM LUXE • AYOLLAR AKSESSUARLARI",
    heroTitle: "Topshirish punktiga yetkaziladigan lyuks ayollar aksessuarlari",
    heroSub:
      "Chanel, Dior, Tom Ford, Estée Lauder va La Mer brendlaridan 36 ta model, filtrlar, savat va topshirish punkti nazorati bitta JSX faylda.",
    filters: "Filtrlar",
    reset: "Tozalash",
    priceRange: "Narx oraligʻi",
    luxuryBrands: "Lyuks brendlar",
    sortFeatured: "Mashhur",
    sortPriceAsc: "Avval arzonroq",
    sortPriceDesc: "Avval qimmatroq",
    sortRating: "Reyting boʻyicha",
    showing: "Koʻrsatilgan mahsulotlar:",
    inCart: "Savatga",
    orderNow: "Buyurtma",
    perMonth: "/oy × 12",
    reviews: "sharhlar",
    backToCatalog: "← Katalogga",
    tabAll: "Barcha buyurtmalar",
    tabTransit: "Yoʻlda",
    tabPickup: "Topshirish punktida",
    simulateArrival: "Topshirish punktiga keldi deb belgilash",
    atPickupStatus: "Topshirish punktida",
    inTransitStatus: "Yoʻlda • Ertaga yetib keladi",
    profileTabOrders: "Buyurtmalar",
    profileTabInfo: "Roʻyxatdan oʻtish va profil",
    fullName: "Ism va familiya",
    email: "Email",
    phone: "Telefon",
    defaultPickup: "Asosiy topshirish punkti",
    saveProfile: "Profilni saqlash",
    savedMsg: "Profil maʼlumotlari saqlandi.",
    emptyTitle: "Filtrlar boʻyicha mahsulot topilmadi",
    emptySub: "Narx oraligʻini, brend yoki toifani oʻzgartiring.",
    cartTotal: "Jami toʻlov:",
    checkoutBtn: "Topshirish punktiga buyurtma berish",
    orderCreatedMsg: "Buyurtma rasmiylashtirildi! Holatini «Profil → Buyurtmalar» boʻlimida kuzating.",
  },
  en: {
    pickupPoints: "Pickup Points",
    myOrders: "My Orders",
    morning: "Day",
    night: "Night",
    catalog: "Catalog",
    searchPlaceholder: "Search women's accessories & luxury houses...",
    find: "Search",
    profileLogin: "Profile / Sign In",
    wishlist: "Wishlist",
    cart: "Cart",
    allCats: "All Accessories",
    catBags: "Bags & Cases",
    catScarves: "Scarves & Shawls",
    catGlasses: "Eyewear",
    catHair: "Hair Accessories",
    catBeauty: "Beauty Tools",
    heroBadge: "UZUM LUXE • WOMEN'S ACCESSORIES",
    heroTitle: "Luxury women's accessories delivered to your pickup point",
    heroSub:
      "36 curated women's accessories from Chanel, Dior, Tom Ford, Estée Lauder, and La Mer in a single JSX file with pickup tracking.",
    filters: "Filters",
    reset: "Reset",
    priceRange: "Price Range",
    luxuryBrands: "Luxury Brands",
    sortFeatured: "Featured",
    sortPriceAsc: "Price: Low to High",
    sortPriceDesc: "Price: High to Low",
    sortRating: "Top Rated",
    showing: "Showing products:",
    inCart: "Add to Cart",
    orderNow: "Order",
    perMonth: "/mo × 12",
    reviews: "reviews",
    backToCatalog: "← Back to Catalog",
    tabAll: "All Orders",
    tabTransit: "In Transit",
    tabPickup: "At Pickup Point",
    simulateArrival: "Mark Arrived at Pickup Point",
    atPickupStatus: "At Pickup Point",
    inTransitStatus: "In Transit • Arriving Tomorrow",
    profileTabOrders: "Orders",
    profileTabInfo: "Registration & Profile",
    fullName: "Full Name",
    email: "Email",
    phone: "Phone",
    defaultPickup: "Default Pickup Point",
    saveProfile: "Save Profile",
    savedMsg: "Profile details saved.",
    emptyTitle: "No accessories match your filters",
    emptySub: "Adjust the price range, brand selection, or category.",
    cartTotal: "Total:",
    checkoutBtn: "Place Order to Pickup Point",
    orderCreatedMsg: "Order placed! Track its arrival in Profile → Orders.",
  },
};

const CATEGORIES = [
  { id: "all", key: "allCats" },
  { id: "bags", key: "catBags" },
  { id: "scarves", key: "catScarves" },
  { id: "glasses", key: "catGlasses" },
  { id: "hair", key: "catHair" },
  { id: "beauty", key: "catBeauty" },
];

const PRODUCTS = [
  { id: 1, brand: "Chanel", category: "bags", name: "Quilted Vanity Mini Case", price: 245, oldPrice: 280, rating: 4.9, reviews: 142, image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=600&q=80" },
  { id: 2, brand: "Dior", category: "scarves", name: "Oblique Silk Twill Mitzah Scarf", price: 115, oldPrice: 135, rating: 4.8, reviews: 96, image: "https://images.unsplash.com/photo-1584030373081-f37b7bb4fa8e?auto=format&fit=crop&w=600&q=80" },
  { id: 3, brand: "Tom Ford", category: "glasses", name: "Whitney Cat-Eye Acetate Sunglasses", price: 220, oldPrice: 260, rating: 4.9, reviews: 184, image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=600&q=80" },
  { id: 4, brand: "Estée Lauder", category: "beauty", name: "Rose Quartz Contour Sculpting Roller", price: 48, oldPrice: 60, rating: 4.7, reviews: 210, image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=600&q=80" },
  { id: 5, brand: "La Mer", category: "beauty", name: "Velvet Kabuki Brush & Pouch Set", price: 95, oldPrice: 115, rating: 4.9, reviews: 78, image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=600&q=80" },
  { id: 6, brand: "Chanel", category: "hair", name: "Camellia Pearl Hair Claw Clip", price: 84, oldPrice: 98, rating: 4.8, reviews: 129, image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=600&q=80" },
  { id: 7, brand: "Dior", category: "bags", name: "Cannage Satin Evening Clutch", price: 275, oldPrice: 310, rating: 5.0, reviews: 64, image: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=600&q=80" },
  { id: 8, brand: "Tom Ford", category: "scarves", name: "Cashmere Fringe Stole Shawl", price: 190, oldPrice: 230, rating: 4.8, reviews: 87, image: "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?auto=format&fit=crop&w=600&q=80" },
  { id: 9, brand: "Estée Lauder", category: "bags", name: "Crimson Velvet Cosmetic Train Case", price: 68, oldPrice: 82, rating: 4.7, reviews: 155, image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=600&q=80" },
  { id: 10, brand: "La Mer", category: "beauty", name: "Jade Gua Sha Facial Lifting Stone", price: 56, oldPrice: 70, rating: 4.8, reviews: 118, image: "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?auto=format&fit=crop&w=600&q=80" },
  { id: 11, brand: "Chanel", category: "glasses", name: "Pearl Chain Round Optical Frames", price: 260, oldPrice: 295, rating: 4.9, reviews: 93, image: "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?auto=format&fit=crop&w=600&q=80" },
  { id: 12, brand: "Dior", category: "hair", name: "J'Adore Velvet Ribbon Scrunchie", price: 42, oldPrice: 54, rating: 4.6, reviews: 174, image: "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?auto=format&fit=crop&w=600&q=80" },
  { id: 13, brand: "Tom Ford", category: "bags", name: "Croc-Embossed Cardholder Pouch", price: 145, oldPrice: 170, rating: 4.8, reviews: 112, image: "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=600&q=80" },
  { id: 14, brand: "Estée Lauder", category: "scarves", name: "Botanical Silk Neck Foulard", price: 64, oldPrice: 79, rating: 4.7, reviews: 88, image: "https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?auto=format&fit=crop&w=600&q=80" },
  { id: 15, brand: "La Mer", category: "bags", name: "Atelier Linen Travel Tote Bag", price: 130, oldPrice: 155, rating: 4.8, reviews: 69, image: "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?auto=format&fit=crop&w=600&q=80" },
  { id: 16, brand: "Chanel", category: "scarves", name: "Double-C Jacquard Winter Wrap", price: 235, oldPrice: 270, rating: 4.9, reviews: 105, image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=600&q=80" },
  { id: 17, brand: "Dior", category: "glasses", name: "Signature Rimless Aviator Shades", price: 195, oldPrice: 225, rating: 4.8, reviews: 77, image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=600&q=80" },
  { id: 18, brand: "Tom Ford", category: "hair", name: "Gold Barrette Hair Pin Trio", price: 78, oldPrice: 92, rating: 4.7, reviews: 61, image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=600&q=80" },
  { id: 19, brand: "Estée Lauder", category: "glasses", name: "Tortoiseshell Square Sun Glasses", price: 88, oldPrice: 105, rating: 4.6, reviews: 133, image: "https://images.unsplash.com/photo-1509695507497-903c140c43b0?auto=format&fit=crop&w=600&q=80" },
  { id: 20, brand: "La Mer", category: "scarves", name: "Seafoam Silk Sleep Headscarf", price: 108, oldPrice: 125, rating: 4.9, reviews: 54, image: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=600&q=80" },
  { id: 21, brand: "Chanel", category: "beauty", name: "Sculpted Compact Mirror & Case", price: 120, oldPrice: 140, rating: 4.9, reviews: 149, image: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=600&q=80" },
  { id: 22, brand: "Dior", category: "beauty", name: "Backstage Fan & Powder Brush Set", price: 112, oldPrice: 130, rating: 4.8, reviews: 91, image: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=600&q=80" },
  { id: 23, brand: "Tom Ford", category: "beauty", name: "Ivory Travel Atomizer & Holder", price: 86, oldPrice: 102, rating: 4.8, reviews: 73, image: "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=600&q=80" },
  { id: 24, brand: "Estée Lauder", category: "hair", name: "Satin Pillow Scrunchie Duo", price: 36, oldPrice: 45, rating: 4.7, reviews: 198, image: "https://images.unsplash.com/photo-1611085583191-a3b181a88401?auto=format&fit=crop&w=600&q=80" },
  { id: 25, brand: "La Mer", category: "glasses", name: "Champagne Oversized Resort Shades", price: 175, oldPrice: 205, rating: 4.8, reviews: 47, image: "https://images.unsplash.com/photo-1508296695146-257a814070b4?auto=format&fit=crop&w=600&q=80" },
  { id: 26, brand: "Chanel", category: "bags", name: "Burgundy Flap Chain Wristlet", price: 290, oldPrice: 325, rating: 5.0, reviews: 115, image: "https://images.unsplash.com/photo-1591561954557-269ca1169be7?auto=format&fit=crop&w=600&q=80" },
  { id: 27, brand: "Dior", category: "scarves", name: "Floral Jacquard Silk Bandana", price: 98, oldPrice: 118, rating: 4.8, reviews: 82, image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=600&q=80" },
  { id: 28, brand: "Tom Ford", category: "glasses", name: "Amber Butterfly Sun Spectacles", price: 205, oldPrice: 240, rating: 4.9, reviews: 66, image: "https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?auto=format&fit=crop&w=600&q=80" },
  { id: 29, brand: "Estée Lauder", category: "beauty", name: "Microcurrent Eye Massage Wand", price: 79, oldPrice: 95, rating: 4.7, reviews: 121, image: "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?auto=format&fit=crop&w=600&q=80" },
  { id: 30, brand: "La Mer", category: "hair", name: "Pearl & Gold Wave Hair Comb", price: 62, oldPrice: 75, rating: 4.8, reviews: 58, image: "https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?auto=format&fit=crop&w=600&q=80" },
  { id: 31, brand: "Chanel", category: "beauty", name: "Nappa Leather Brush Roll Case", price: 155, oldPrice: 180, rating: 4.9, reviews: 84, image: "https://images.unsplash.com/photo-1583209814683-c023dd293cc6?auto=format&fit=crop&w=600&q=80" },
  { id: 32, brand: "Dior", category: "bags", name: "Saddle Jacquard Phone Pouch", price: 230, oldPrice: 265, rating: 4.9, reviews: 109, image: "https://images.unsplash.com/photo-1547949003-9792a18a2601?auto=format&fit=crop&w=600&q=80" },
  { id: 33, brand: "Tom Ford", category: "scarves", name: "Velvet Trim Evening Pashmina", price: 150, oldPrice: 178, rating: 4.8, reviews: 71, image: "https://images.unsplash.com/photo-1516762689617-e1cffcef479d?auto=format&fit=crop&w=600&q=80" },
  { id: 34, brand: "Estée Lauder", category: "bags", name: "Ruby Quilted Jewelry Organizer", price: 54, oldPrice: 68, rating: 4.7, reviews: 146, image: "https://images.unsplash.com/photo-1594223274512-ad4803739b7c?auto=format&fit=crop&w=600&q=80" },
  { id: 35, brand: "La Mer", category: "bags", name: "Soft Suede Weekend Vanity Bag", price: 185, oldPrice: 215, rating: 4.9, reviews: 63, image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=600&q=80" },
  { id: 36, brand: "Chanel", category: "hair", name: "Crystal Bow Couture Hair Clip", price: 128, oldPrice: 150, rating: 4.9, reviews: 92, image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80" },
];

const INITIAL_ORDERS = [
  {
    id: "UZ-80412",
    title: "Quilted Vanity Mini Case (Chanel)",
    price: 245,
    pickupPoint: PICKUP_POINTS[0],
    eta: "Сегодня, 14:30",
    status: "pickup",
  },
  {
    id: "UZ-80519",
    title: "Whitney Cat-Eye Acetate Sunglasses (Tom Ford)",
    price: 220,
    pickupPoint: PICKUP_POINTS[1],
    eta: "Завтра, до 18:00",
    status: "transit",
  },
];

const STYLES_CSS = `
:root {
  --bg-page: #3b0d17;
  --bg-page-grad: radial-gradient(circle at 15% 10%, #5c1424 0%, #3b0d17 52%, #24060d 100%);
  --bg-surface: #fff8f5;
  --bg-card: #fffdfb;
  --bg-subtle: #f7ece8;
  --border-color: #ead5cf;
  --text-main: #23080e;
  --text-muted: #6e4750;
  --accent: #8f1d35;
  --accent-hover: #6e1327;
  --accent-soft: rgba(143, 29, 53, 0.12);
  --uzum-purple: #7000ff;
  --uzum-yellow: #ffeb3b;
  --pickup-green: #16a34a;
  --pickup-green-bg: rgba(22, 163, 74, 0.14);
  --pickup-green-border: rgba(22, 163, 74, 0.35);
}

body.night-mode {
  --bg-page: #190409;
  --bg-page-grad: radial-gradient(circle at 20% 0%, #380914 0%, #190409 60%, #0d0204 100%);
  --bg-surface: #290b13;
  --bg-card: #320e18;
  --bg-subtle: #421320;
  --border-color: #5a1c2d;
  --text-main: #fff5f7;
  --text-muted: #d4a6b0;
  --accent: #e14b6b;
  --accent-hover: #f26382;
  --accent-soft: rgba(225, 75, 107, 0.18);
  --pickup-green: #22c55e;
  --pickup-green-bg: rgba(34, 197, 94, 0.16);
  --pickup-green-border: rgba(34, 197, 94, 0.4);
}

* { box-sizing: border-box; margin: 0; padding: 0; }

body {
  min-height: 100vh;
  font-family: "Inter", -apple-system, BlinkMacSystemFont, sans-serif;
  background: var(--bg-page);
  background-image: var(--bg-page-grad);
  color: var(--text-main);
  transition: background 0.25s ease, color 0.25s ease;
}

.container { max-width: 1440px; margin: 0 auto; padding: 0 24px 64px; }

.topbar {
  display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between;
  gap: 12px; padding: 12px 0; font-size: 13px; color: #f8dfe4;
}

.topbar-left, .topbar-right { display: flex; flex-wrap: wrap; align-items: center; gap: 10px; }

.pill-btn, .lang-btn, .mode-btn {
  background: rgba(255, 248, 245, 0.12); color: #fff8f5;
  border: 1px solid rgba(255, 248, 245, 0.22); border-radius: 999px;
  padding: 5px 12px; font-size: 12px; font-weight: 600; cursor: pointer;
}

.pill-btn:hover, .lang-btn:hover, .mode-btn:hover, .lang-btn.active {
  background: #fff8f5; color: #3b0d17;
}

.main-header {
  background: var(--bg-surface); border: 1px solid var(--border-color);
  border-radius: 18px; padding: 14px 20px; display: grid;
  grid-template-columns: auto auto 1fr auto; align-items: center; gap: 14px;
}

.brand-logo { display: flex; align-items: center; gap: 10px; background: none; border: none; cursor: pointer; color: var(--text-main); text-align: left; }
.brand-badge { width: 38px; height: 38px; border-radius: 10px; background: var(--uzum-purple); color: #fff; font-weight: 800; font-size: 16px; display: grid; place-items: center; }
.brand-title { font-size: 17px; font-weight: 800; line-height: 1.1; }
.brand-sub { font-size: 11px; color: var(--text-muted); }

.catalog-trigger { background: var(--accent-soft); color: var(--accent); border: 1px solid var(--border-color); border-radius: 10px; padding: 10px 14px; font-weight: 700; font-size: 13px; cursor: pointer; }

.search-box { display: flex; align-items: center; background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 12px; overflow: hidden; }
.search-box input { flex: 1; border: none; background: transparent; padding: 10px 14px; font-size: 14px; color: var(--text-main); outline: none; }
.search-box button { background: var(--bg-subtle); color: var(--text-main); border: none; padding: 10px 16px; font-weight: 600; cursor: pointer; }

.nav-actions { display: flex; align-items: center; gap: 8px; }
.nav-btn { background: var(--bg-card); color: var(--text-main); border: 1px solid var(--border-color); border-radius: 10px; padding: 9px 12px; font-size: 13px; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 6px; }
.nav-btn:hover, .nav-btn.active { border-color: var(--accent); background: var(--accent-soft); }
.count-chip { background: var(--accent); color: #fff; font-size: 11px; padding: 1px 6px; border-radius: 999px; }

.categories-bar { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 16px; }
.cat-chip { background: var(--bg-surface); color: var(--text-main); border: 1px solid var(--border-color); border-radius: 999px; padding: 7px 14px; font-size: 13px; font-weight: 600; cursor: pointer; }
.cat-chip.active { background: var(--accent); color: #fff; border-color: var(--accent); }

.hero-banner { margin-top: 18px; background: linear-gradient(120deg, #6b1125 0%, #350712 65%, #1d0309 100%); border: 1px solid rgba(255, 235, 59, 0.25); border-radius: 20px; padding: 28px 32px; color: #fff; }
.hero-tag { display: inline-block; background: var(--uzum-yellow); color: #190409; font-weight: 800; font-size: 11px; padding: 4px 10px; border-radius: 6px; margin-bottom: 10px; }
.hero-title { font-size: 28px; font-weight: 800; margin-bottom: 8px; }
.hero-sub { color: #f4d8df; font-size: 14px; max-width: 680px; }

.catalog-grid-layout { margin-top: 24px; display: grid; grid-template-columns: 280px 1fr; gap: 24px; align-items: start; }
.sidebar { background: var(--bg-surface); border: 1px solid var(--border-color); border-radius: 18px; padding: 20px; position: sticky; top: 16px; }
.sidebar-head { display: flex; justify-content: space-between; align-items: center; padding-bottom: 14px; margin-bottom: 18px; border-bottom: 1px solid var(--border-color); }
.reset-link { background: none; border: none; color: var(--accent); font-size: 12px; font-weight: 700; cursor: pointer; }
.filter-block { margin-bottom: 22px; }
.filter-label { font-size: 13px; font-weight: 700; margin-bottom: 10px; display: block; }
.price-readout { display: flex; justify-content: space-between; font-size: 13px; font-weight: 700; margin-bottom: 8px; }
.dual-range { display: flex; flex-direction: column; gap: 8px; margin-bottom: 12px; }
.dual-range input[type="range"] { width: 100%; accent-color: var(--accent); cursor: pointer; }
.presets-2x2 { display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; }
.preset-btn { background: var(--bg-card); color: var(--text-main); border: 1px solid var(--border-color); border-radius: 8px; padding: 7px 6px; font-size: 12px; font-weight: 600; cursor: pointer; }
.preset-btn.active { background: var(--accent); color: #fff; border-color: var(--accent); }

.brand-row { display: flex; align-items: center; justify-content: space-between; padding: 6px 0; font-size: 13px; cursor: pointer; }
.brand-row-left { display: flex; align-items: center; gap: 8px; }
.brand-count-badge { background: var(--bg-subtle); color: var(--text-muted); border: 1px solid var(--border-color); border-radius: 999px; padding: 2px 8px; font-size: 11px; font-weight: 700; }

.catalog-main { background: var(--bg-surface); border: 1px solid var(--border-color); border-radius: 18px; padding: 22px; }
.catalog-toolbar { display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 12px; margin-bottom: 20px; }
.sort-select { background: var(--bg-card); color: var(--text-main); border: 1px solid var(--border-color); border-radius: 10px; padding: 8px 12px; font-size: 13px; font-weight: 600; }

.products-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
.product-card { background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 14px; overflow: hidden; display: flex; flex-direction: column; }
.product-img-wrap { position: relative; aspect-ratio: 1 / 1; background: var(--bg-subtle); overflow: hidden; }
.product-img-wrap img { width: 100%; height: 100%; object-fit: cover; display: block; }
.orig-tag { position: absolute; left: 8px; bottom: 8px; background: rgba(255, 255, 255, 0.92); color: #14532d; font-size: 10px; font-weight: 800; padding: 3px 7px; border-radius: 5px; }
.fav-btn { position: absolute; top: 8px; right: 8px; width: 32px; height: 32px; border-radius: 50%; border: 1px solid var(--border-color); background: rgba(255, 255, 255, 0.92); color: #3b0d17; font-size: 15px; cursor: pointer; }
.fav-btn.active { color: #e11d48; }

.product-body { padding: 12px; display: flex; flex-direction: column; flex: 1; }
.product-brand { font-size: 11px; font-weight: 700; color: var(--accent); text-transform: uppercase; margin-bottom: 4px; }
.product-title { font-size: 14px; font-weight: 700; line-height: 1.3; margin-bottom: 6px; }
.installment-pill { align-self: flex-start; background: var(--uzum-yellow); color: #190409; font-size: 11px; font-weight: 700; padding: 2px 7px; border-radius: 5px; margin-bottom: 8px; }
.product-meta { font-size: 12px; color: var(--text-muted); margin-bottom: 10px; }
.product-price-row { display: flex; justify-content: space-between; align-items: baseline; margin-top: auto; margin-bottom: 10px; }
.price-now { font-size: 17px; font-weight: 800; }
.price-old { font-size: 12px; color: var(--text-muted); text-decoration: line-through; }

.card-actions { display: grid; grid-template-columns: 1fr auto; gap: 6px; }
.btn-cart { background: var(--uzum-purple); color: #fff; border: none; border-radius: 9px; padding: 8px 10px; font-size: 12px; font-weight: 700; cursor: pointer; }
.btn-buy-now { background: var(--accent); color: #fff; border: none; border-radius: 9px; padding: 8px 10px; font-size: 12px; font-weight: 700; cursor: pointer; }

.page-panel { margin-top: 22px; background: var(--bg-surface); border: 1px solid var(--border-color); border-radius: 18px; padding: 24px; }
.profile-layout { display: grid; grid-template-columns: 240px 1fr; gap: 24px; margin-top: 16px; }
.profile-menu { display: flex; flex-direction: column; gap: 8px; }
.profile-menu-btn { text-align: left; background: var(--bg-card); color: var(--text-main); border: 1px solid var(--border-color); border-radius: 10px; padding: 11px 14px; font-size: 13px; font-weight: 600; cursor: pointer; }
.profile-menu-btn.active { background: var(--accent); color: #fff; border-color: var(--accent); }
.order-tabs { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 16px; }
.order-card { background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 14px; padding: 16px; margin-bottom: 12px; display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 12px; }

.status-pickup-green { display: inline-flex; align-items: center; gap: 6px; background: var(--pickup-green-bg); color: var(--pickup-green); border: 1px solid var(--pickup-green-border); font-size: 12px; font-weight: 800; padding: 5px 11px; border-radius: 999px; }
.status-transit { display: inline-flex; align-items: center; gap: 6px; background: var(--accent-soft); color: var(--accent); font-size: 12px; font-weight: 700; padding: 5px 11px; border-radius: 999px; }

.form-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 14px; max-width: 680px; }
.form-field label { display: block; font-size: 12px; font-weight: 700; margin-bottom: 6px; }
.form-field input, .form-field select { width: 100%; background: var(--bg-card); color: var(--text-main); border: 1px solid var(--border-color); border-radius: 10px; padding: 10px 12px; font-size: 13px; }
.toast-banner { margin-top: 14px; background: var(--pickup-green-bg); border: 1px solid var(--pickup-green-border); color: var(--pickup-green); padding: 10px 14px; border-radius: 12px; font-size: 13px; font-weight: 700; }

@media (max-width: 1150px) { .products-grid { grid-template-columns: repeat(3, 1fr); } .main-header { grid-template-columns: 1fr 1fr; } }
@media (max-width: 860px) { .catalog-grid-layout, .profile-layout { grid-template-columns: 1fr; } .sidebar { position: static; } .products-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 520px) { .products-grid, .form-grid { grid-template-columns: 1fr; } }
`;

export default function App() {
  const [lang, setLang] = useState("ru");
  const [nightMode, setNightMode] = useState(false);
  const [view, setView] = useState("catalog");
  const [profileTab, setProfileTab] = useState("orders");
  const [orderFilter, setOrderFilter] = useState("all");

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [minPrice, setMinPrice] = useState(MIN_LIMIT);
  const [maxPrice, setMaxPrice] = useState(MAX_LIMIT);
  const [sortBy, setSortBy] = useState("featured");

  const [wishlist, setWishlist] = useState([1, 3, 10]);
  const [cart, setCart] = useState([{ productId: 2, qty: 1 }]);
  const [orders, setOrders] = useState(INITIAL_ORDERS);
  const [selectedPickup, setSelectedPickup] = useState(PICKUP_POINTS[0]);
  const [toast, setToast] = useState("");

  const [profile, setProfile] = useState({
    name: "Мадина Каримова",
    email: "madina.karimova@example.com",
    phone: "+998 90 123 45 67",
    pickupPoint: PICKUP_POINTS[0],
  });

  const t = TRANSLATIONS[lang];

  useEffect(() => {
    document.body.classList.toggle("night-mode", nightMode);
  }, [nightMode]);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3200);
  };

  const brandCounts = useMemo(() => {
    const map = {};
    BRANDS.forEach((b) => {
      map[b] = PRODUCTS.filter((p) => p.brand === b).length;
    });
    return map;
  }, []);

  const filteredProducts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const list = PRODUCTS.filter((item) => {
      const catOk = selectedCategory === "all" || item.category === selectedCategory;
      const brandOk = selectedBrands.length === 0 || selectedBrands.includes(item.brand);
      const priceOk = item.price >= minPrice && item.price <= maxPrice;
      const searchOk =
        !q ||
        item.name.toLowerCase().includes(q) ||
        item.brand.toLowerCase().includes(q);
      return catOk && brandOk && priceOk && searchOk;
    });

    if (sortBy === "priceAsc") return [...list].sort((a, b) => a.price - b.price);
    if (sortBy === "priceDesc") return [...list].sort((a, b) => b.price - a.price);
    if (sortBy === "rating") return [...list].sort((a, b) => b.rating - a.rating);
    return list;
  }, [searchQuery, selectedCategory, selectedBrands, minPrice, maxPrice, sortBy]);

  const toggleBrand = (brand) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((x) => x !== brand) : [...prev, brand]
    );
  };

  const resetFilters = () => {
    setSelectedCategory("all");
    setSelectedBrands([]);
    setMinPrice(MIN_LIMIT);
    setMaxPrice(MAX_LIMIT);
    setSearchQuery("");
    setSortBy("featured");
  };

  const toggleWishlist = (id) => {
    setWishlist((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.productId === product.id);
      if (existing) {
        return prev.map((c) =>
          c.productId === product.id ? { ...c, qty: c.qty + 1 } : c
        );
      }
      return [...prev, { productId: product.id, qty: 1 }];
    });
    showToast(`${product.name} — ${t.inCart}`);
  };

  const instantOrder = (product) => {
    const newOrder = {
      id: `UZ-${Math.floor(81000 + Math.random() * 8999)}`,
      title: `${product.name} (${product.brand})`,
      price: product.price,
      pickupPoint: selectedPickup || profile.pickupPoint,
      eta: "Завтра, 12:00–19:00",
      status: "transit",
    };
    setOrders((prev) => [newOrder, ...prev]);
    showToast(t.orderCreatedMsg);
  };

  const checkoutCart = () => {
    if (cart.length === 0) return;
    const created = cart.map((entry, idx) => {
      const prod = PRODUCTS.find((p) => p.id === entry.productId);
      return {
        id: `UZ-${Math.floor(82000 + Math.random() * 7999)}-${idx + 1}`,
        title: `${prod.name} ×${entry.qty}`,
        price: prod.price * entry.qty,
        pickupPoint: selectedPickup || profile.pickupPoint,
        eta: "Завтра, до 17:00",
        status: "transit",
      };
    });
    setOrders((prev) => [...created, ...prev]);
    setCart([]);
    setView("profile");
    setProfileTab("orders");
    showToast(t.orderCreatedMsg);
  };

  const markArrivedAtPickup = (orderId) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? { ...o, status: "pickup", eta: "Готов к выдаче сегодня" }
          : o
      )
    );
  };

  const visibleOrders = useMemo(() => {
    if (orderFilter === "pickup") return orders.filter((o) => o.status === "pickup");
    if (orderFilter === "transit") return orders.filter((o) => o.status === "transit");
    return orders;
  }, [orders, orderFilter]);

  const cartCount = cart.reduce((acc, item) => acc + item.qty, 0);
  const cartTotal = cart.reduce((sum, item) => {
    const prod = PRODUCTS.find((p) => p.id === item.productId);
    return sum + (prod ? prod.price * item.qty : 0);
  }, 0);

  return (
    <div className="container">
      <style>{STYLES_CSS}</style>

      <div className="topbar">
        <div className="topbar-left">
          <span>📍 {t.pickupPoints}:</span>
          <select
            className="pill-btn"
            style={{ color: "#fff8f5", background: "rgba(0,0,0,0.25)" }}
            value={selectedPickup}
            onChange={(e) => setSelectedPickup(e.target.value)}
          >
            {PICKUP_POINTS.map((pt) => (
              <option key={pt} value={pt} style={{ color: "#190409" }}>
                {pt}
              </option>
            ))}
          </select>
          <button
            type="button"
            className="pill-btn"
            onClick={() => {
              setView("profile");
              setProfileTab("orders");
            }}
          >
            {t.myOrders} ({orders.length})
          </button>
        </div>

        <div className="topbar-right">
          {["ru", "uz", "en"].map((code) => (
            <button
              key={code}
              type="button"
              className={`lang-btn ${lang === code ? "active" : ""}`}
              onClick={() => setLang(code)}
            >
              {code.toUpperCase()}
            </button>
          ))}
          <button
            type="button"
            className="mode-btn"
            onClick={() => setNightMode((prev) => !prev)}
          >
            {nightMode ? `☀️ ${t.morning}` : `🌙 ${t.night}`}
          </button>
        </div>
      </div>

      <header className="main-header">
        <button type="button" className="brand-logo" onClick={() => setView("catalog")}>
          <span className="brand-badge">U</span>
          <div>
            <div className="brand-title">uzum luxe</div>
            <div className="brand-sub">Women&apos;s Accessories</div>
          </div>
        </button>

        <button
          type="button"
          className="catalog-trigger"
          onClick={() => {
            setView("catalog");
            setSelectedCategory("all");
          }}
        >
          ☰ {t.catalog}
        </button>

        <form
          className="search-box"
          onSubmit={(e) => {
            e.preventDefault();
            setView("catalog");
          }}
        >
          <input
            type="text"
            placeholder={t.searchPlaceholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit">{t.find}</button>
        </form>

        <div className="nav-actions">
          <button
            type="button"
            className={`nav-btn ${view === "profile" ? "active" : ""}`}
            onClick={() => setView("profile")}
          >
            👤 {profile.name.split(" ")[0] || t.profileLogin}
          </button>
          <button
            type="button"
            className={`nav-btn ${view === "wishlist" ? "active" : ""}`}
            onClick={() => setView("wishlist")}
          >
            ♡ {t.wishlist} <span className="count-chip">{wishlist.length}</span>
          </button>
          <button
            type="button"
            className={`nav-btn ${view === "cart" ? "active" : ""}`}
            onClick={() => setView("cart")}
          >
            🛍️ {t.cart} <span className="count-chip">{cartCount}</span>
          </button>
        </div>
      </header>

      <div className="categories-bar">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            type="button"
            className={`cat-chip ${selectedCategory === cat.id && view === "catalog" ? "active" : ""}`}
            onClick={() => {
              setView("catalog");
              setSelectedCategory(cat.id);
            }}
          >
            {t[cat.key]}
          </button>
        ))}
      </div>

      {toast && <div className="toast-banner">✓ {toast}</div>}

      {view === "catalog" && (
        <>
          <section className="hero-banner">
            <span className="hero-tag">{t.heroBadge}</span>
            <h1 className="hero-title">{t.heroTitle}</h1>
            <p className="hero-sub">{t.heroSub}</p>
          </section>

          <div className="catalog-grid-layout">
            <aside className="sidebar">
              <div className="sidebar-head">
                <h2>{t.filters}</h2>
                <button type="button" className="reset-link" onClick={resetFilters}>
                  {t.reset}
                </button>
              </div>

              <div className="filter-block">
                <span className="filter-label">{t.priceRange}</span>
                <div className="price-readout">
                  <span>${minPrice}</span>
                  <span>{maxPrice === MAX_LIMIT ? "$300+" : `$${maxPrice}`}</span>
                </div>
                <div className="dual-range">
                  <input
                    type="range"
                    min={MIN_LIMIT}
                    max={MAX_LIMIT}
                    step={5}
                    value={minPrice}
                    onChange={(e) =>
                      setMinPrice(Math.min(Number(e.target.value), maxPrice - MIN_GAP))
                    }
                  />
                  <input
                    type="range"
                    min={MIN_LIMIT}
                    max={MAX_LIMIT}
                    step={5}
                    value={maxPrice}
                    onChange={(e) =>
                      setMaxPrice(Math.max(Number(e.target.value), minPrice + MIN_GAP))
                    }
                  />
                </div>
                <div className="presets-2x2">
                  {PRICE_PRESETS.map((p) => {
                    const active = minPrice === p.min && maxPrice === p.max;
                    return (
                      <button
                        key={p.id}
                        type="button"
                        className={`preset-btn ${active ? "active" : ""}`}
                        onClick={() => {
                          setMinPrice(p.min);
                          setMaxPrice(p.max);
                        }}
                      >
                        {p.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="filter-block">
                <span className="filter-label">{t.luxuryBrands}</span>
                {BRANDS.map((brand) => (
                  <label key={brand} className="brand-row">
                    <span className="brand-row-left">
                      <input
                        type="checkbox"
                        checked={selectedBrands.includes(brand)}
                        onChange={() => toggleBrand(brand)}
                      />
                      <span>{brand}</span>
                    </span>
                    <span className="brand-count-badge">{brandCounts[brand]}</span>
                  </label>
                ))}
              </div>
            </aside>

            <main className="catalog-main">
              <div className="catalog-toolbar">
                <div>
                  <strong>
                    {t.showing} {filteredProducts.length} / {PRODUCTS.length}
                  </strong>
                </div>
                <select
                  className="sort-select"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="featured">{t.sortFeatured}</option>
                  <option value="priceAsc">{t.sortPriceAsc}</option>
                  <option value="priceDesc">{t.sortPriceDesc}</option>
                  <option value="rating">{t.sortRating}</option>
                </select>
              </div>

              {filteredProducts.length === 0 ? (
                <div style={{ padding: "40px 16px", textAlign: "center" }}>
                  <h3>{t.emptyTitle}</h3>
                  <p style={{ color: "var(--text-muted)", margin: "8px 0 14px" }}>
                    {t.emptySub}
                  </p>
                  <button type="button" className="btn-buy-now" onClick={resetFilters}>
                    {t.reset}
                  </button>
                </div>
              ) : (
                <div className="products-grid">
                  {filteredProducts.map((item) => {
                    const isFav = wishlist.includes(item.id);
                    const monthly = Math.max(1, Math.ceil(item.price / 12));
                    return (
                      <article key={item.id} className="product-card">
                        <div className="product-img-wrap">
                          <img src={item.image} alt={item.name} loading="lazy" />
                          <span className="orig-tag">✓ ORIGINAL</span>
                          <button
                            type="button"
                            className={`fav-btn ${isFav ? "active" : ""}`}
                            onClick={() => toggleWishlist(item.id)}
                            aria-label="Wishlist"
                          >
                            {isFav ? "♥" : "♡"}
                          </button>
                        </div>

                        <div className="product-body">
                          <div className="product-brand">{item.brand}</div>
                          <h3 className="product-title">{item.name}</h3>
                          <span className="installment-pill">
                            ${monthly}
                            {t.perMonth}
                          </span>
                          <div className="product-meta">
                            ★ {item.rating.toFixed(1)} ({item.reviews} {t.reviews})
                          </div>
                          <div className="product-price-row">
                            <span className="price-now">${item.price}</span>
                            <span className="price-old">${item.oldPrice}</span>
                          </div>
                          <div className="card-actions">
                            <button
                              type="button"
                              className="btn-cart"
                              onClick={() => addToCart(item)}
                            >
                              {t.inCart}
                            </button>
                            <button
                              type="button"
                              className="btn-buy-now"
                              onClick={() => instantOrder(item)}
                            >
                              {t.orderNow}
                            </button>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              )}
            </main>
          </div>
        </>
      )}

      {view === "profile" && (
        <section className="page-panel">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <h2>{profile.name}</h2>
              <p style={{ color: "var(--text-muted)", fontSize: 13 }}>{profile.email}</p>
            </div>
            <button type="button" className="nav-btn" onClick={() => setView("catalog")}>
              {t.backToCatalog}
            </button>
          </div>

          <div className="profile-layout">
            <div className="profile-menu">
              <button
                type="button"
                className={`profile-menu-btn ${profileTab === "orders" ? "active" : ""}`}
                onClick={() => setProfileTab("orders")}
              >
                📦 {t.profileTabOrders} ({orders.length})
              </button>
              <button
                type="button"
                className={`profile-menu-btn ${profileTab === "info" ? "active" : ""}`}
                onClick={() => setProfileTab("info")}
              >
                ⚙️ {t.profileTabInfo}
              </button>
            </div>

            {profileTab === "orders" ? (
              <div>
                <div className="order-tabs">
                  <button
                    type="button"
                    className={`cat-chip ${orderFilter === "all" ? "active" : ""}`}
                    onClick={() => setOrderFilter("all")}
                  >
                    {t.tabAll}
                  </button>
                  <button
                    type="button"
                    className={`cat-chip ${orderFilter === "transit" ? "active" : ""}`}
                    onClick={() => setOrderFilter("transit")}
                  >
                    {t.tabTransit}
                  </button>
                  <button
                    type="button"
                    className={`cat-chip ${orderFilter === "pickup" ? "active" : ""}`}
                    onClick={() => setOrderFilter("pickup")}
                  >
                    {t.tabPickup}
                  </button>
                </div>

                {visibleOrders.map((ord) => (
                  <div key={ord.id} className="order-card">
                    <div>
                      <div style={{ fontWeight: 800, fontSize: 14 }}>
                        #{ord.id} • {ord.title}
                      </div>
                      <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 4 }}>
                        📍 {ord.pickupPoint} • 🕒 {ord.eta}
                      </div>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <strong>${ord.price}</strong>
                      {ord.status === "pickup" ? (
                        <span className="status-pickup-green">● {t.atPickupStatus}</span>
                      ) : (
                        <>
                          <span className="status-transit">◐ {t.inTransitStatus}</span>
                          <button
                            type="button"
                            className="btn-cart"
                            onClick={() => markArrivedAtPickup(ord.id)}
                          >
                            {t.simulateArrival}
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <form
                className="form-grid"
                onSubmit={(e) => {
                  e.preventDefault();
                  showToast(t.savedMsg);
                }}
              >
                <div className="form-field">
                  <label>{t.fullName}</label>
                  <input
                    type="text"
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  />
                </div>
                <div className="form-field">
                  <label>{t.email}</label>
                  <input
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  />
                </div>
                <div className="form-field">
                  <label>{t.phone}</label>
                  <input
                    type="text"
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  />
                </div>
                <div className="form-field">
                  <label>{t.defaultPickup}</label>
                  <select
                    value={profile.pickupPoint}
                    onChange={(e) =>
                      setProfile({ ...profile, pickupPoint: e.target.value })
                    }
                  >
                    {PICKUP_POINTS.map((pt) => (
                      <option key={pt} value={pt}>
                        {pt}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-field">
                  <button type="submit" className="btn-buy-now">
                    {t.saveProfile}
                  </button>
                </div>
              </form>
            )}
          </div>
        </section>
      )}

      {view === "wishlist" && (
        <section className="page-panel">
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
            <h2>
              {t.wishlist} ({wishlist.length})
            </h2>
            <button type="button" className="nav-btn" onClick={() => setView("catalog")}>
              {t.backToCatalog}
            </button>
          </div>
          <div className="products-grid">
            {PRODUCTS.filter((p) => wishlist.includes(p.id)).map((item) => (
              <div key={item.id} className="product-card">
                <div className="product-img-wrap">
                  <img src={item.image} alt={item.name} />
                </div>
                <div className="product-body">
                  <div className="product-brand">{item.brand}</div>
                  <div className="product-title">{item.name}</div>
                  <div className="product-price-row">
                    <span className="price-now">${item.price}</span>
                  </div>
                  <button type="button" className="btn-cart" onClick={() => addToCart(item)}>
                    {t.inCart}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {view === "cart" && (
        <section className="page-panel">
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
            <h2>
              {t.cart} ({cartCount})
            </h2>
            <button type="button" className="nav-btn" onClick={() => setView("catalog")}>
              {t.backToCatalog}
            </button>
          </div>
          {cart.map((entry) => {
            const prod = PRODUCTS.find((p) => p.id === entry.productId);
            if (!prod) return null;
            return (
              <div key={entry.productId} className="order-card">
                <div>
                  <strong>{prod.name}</strong> ({prod.brand}) × {entry.qty}
                </div>
                <strong>${prod.price * entry.qty}</strong>
              </div>
            );
          })}
          {cart.length > 0 && (
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginTop: 18,
              }}
            >
              <div style={{ fontSize: 18, fontWeight: 800 }}>
                {t.cartTotal} ${cartTotal}
              </div>
              <button type="button" className="btn-buy-now" onClick={checkoutCart}>
                {t.checkoutBtn}
              </button>
            </div>
          )}
        </section>
      )}
    </div>
  );
}
