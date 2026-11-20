Понял! Убираю зависимость от внешнего CSS и Tailwind — вся сетка, отступы, кнопки, карточки, модальное окно, оценка, описание, оставшиеся цвета и размеры будут заданы прямо внутри `App.jsx` через объект стилей (`style={{ ... }}`), чтобы в `src/App.jsx` всё работало самодостаточно и сетка не разъезжалась.

```jsx
import React, { useState, useEffect, useMemo } from "react";

const MIN_LIMIT = 0;
const MAX_LIMIT = 300;
const MIN_GAP = 5;

const BRANDS = ["Estée Lauder", "Chanel", "Dior", "Tom Ford", "La Mer"];

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

const CATEGORIES = [
  { id: "all", ru: "Все аксессуары", uz: "Barcha aksessuarlar", en: "All Accessories" },
  { id: "bags", ru: "Сумки и кейсы", uz: "Sumka va keys", en: "Bags & Cases" },
  { id: "scarves", ru: "Платки и шали", uz: "Roʻmol va shallar", en: "Scarves & Shawls" },
  { id: "glasses", ru: "Очки", uz: "Koʻzoynaklar", en: "Eyewear" },
  { id: "hair", ru: "Для волос", uz: "Soch bezaklari", en: "Hair Accessories" },
  { id: "beauty", ru: "Бьюти-аксессуары", uz: "Byuti aksessuarlar", en: "Beauty Tools" },
];

const TRANSLATIONS = {
  ru: {
    pickupPrefix: "Пункт выдачи:",
    myOrders: "Мои заказы",
    morning: "☀ Утро",
    night: "☾ Ночь",
    catalog: "Каталог",
    searchPlaceholder: "Поиск деталей образа — платки, сумки, очки, заколки...",
    find: "Найти",
    profileLogin: "Профиль / Вход",
    wishlist: "Избранное",
    cart: "Корзина",
    heroBadge: "LUMEL1 • ДЕТАЛИ ОБРАЗА ДЛЯ НЕЁ",
    heroTitle: "Шелковые платки, кейсы и вечерние сумочки",
    heroSub: "36 женских деталей образа от Chanel, Dior, Tom Ford, Estée Lauder и La Mer с доставкой в пункт выдачи.",
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
    savedMsg: "✓ Данные профиля сохранены.",
    emptyTitle: "По выбранным фильтрам ничего не найдено",
    emptySub: "Измените диапазон цен, бренд или категорию.",
    cartTotal: "Итого к оплате:",
    checkoutBtn: "Оформить заказ в пункт выдачи",
    orderCreatedMsg: "✓ Заказ оформлен! Отслеживайте статус в разделе «Профиль → Заказы».",
    addedMsg: "✓ Добавлено в корзину:",
    arrivedMsg: "✓ Заказ прибыл в пункт выдачи.",
    modalInstallment: "Рассрочка LUMEL1:",
    modalPickupInfo: "Доставка в пункт выдачи:",
    modalZoomHint: "Нажмите на фото для приближения",
    modalReviewsTitle: "Отзывы покупательниц",
    modalSampleReview1: "«Великолепная отделка и плотная фактура, в пункте выдачи упаковано аккуратно.»",
    modalSampleReview2: "«Смотрится дорого и статусно, легко сочетается с вечерним и повседневным образом.»",
    ratingLabel: "Оценка:",
    descriptionLabel: "Описание:",
    colorsLeftLabel: "Оставшиеся цвета:",
    sizesLabel: "Размеры:",
    leftShort: "ост.",
  },
  uz: {
    pickupPrefix: "Topshirish punkti:",
    myOrders: "Buyurtmalarim",
    morning: "☀ Tong",
    night: "☾ Tun",
    catalog: "Katalog",
    searchPlaceholder: "Obraz detallarini izlash — ro‘mol, sumka, ko‘zoynak...",
    find: "Izlash",
    profileLogin: "Profil / Kirish",
    wishlist: "Saralangan",
    cart: "Savat",
    heroBadge: "LUMEL1 • OBRAZ DETALLARI",
    heroTitle: "Ipak ro‘mollar, keys va kechki sumkachalar",
    heroSub: "Chanel, Dior, Tom Ford, Estée Lauder va La Mer brendlaridan 36 ta detal topshirish punktiga yetkazish bilan.",
    filters: "Filtrlar",
    reset: "Tozalash",
    priceRange: "Narx oralig‘i",
    luxuryBrands: "Lyuks brendlar",
    sortFeatured: "Mashhur",
    sortPriceAsc: "Avval arzonroq",
    sortPriceDesc: "Avval qimmatroq",
    sortRating: "Reyting bo‘yicha",
    showing: "Ko‘rsatilgan mahsulotlar:",
    inCart: "Savatga",
    orderNow: "Buyurtma",
    perMonth: "/oy × 12",
    reviews: "sharhlar",
    backToCatalog: "← Katalogga",
    tabAll: "Barcha buyurtmalar",
    tabTransit: "Yo‘lda",
    tabPickup: "Topshirish punktida",
    simulateArrival: "Topshirish punktiga keldi deb belgilash",
    atPickupStatus: "Topshirish punktida",
    inTransitStatus: "Yo‘lda • Ertaga yetib keladi",
    profileTabOrders: "Buyurtmalar",
    profileTabInfo: "Ro‘yxatdan o‘tish va profil",
    fullName: "Ism va familiya",
    email: "Email",
    phone: "Telefon",
    defaultPickup: "Asosiy topshirish punkti",
    saveProfile: "Profilni saqlash",
    savedMsg: "✓ Profil ma’lumotlari saqlandi.",
    emptyTitle: "Filtrlar bo‘yicha mahsulot topilmadi",
    emptySub: "Narx oralig‘ini, brend yoki toifani o‘zgartiring.",
    cartTotal: "Jami to‘lov:",
    checkoutBtn: "Topshirish punktiga buyurtma berish",
    orderCreatedMsg: "✓ Buyurtma rasmiylashtirildi! Holatini «Profil → Buyurtmalar» bo‘limida kuzating.",
    addedMsg: "✓ Savatga qo‘shildi:",
    arrivedMsg: "✓ Buyurtma topshirish punktiga yetib keldi.",
    modalInstallment: "LUMEL1 muddatli to‘lov:",
    modalPickupInfo: "Topshirish punktiga yetkazish:",
    modalZoomHint: "Kattalashtirish uchun rasmni bosing",
    modalReviewsTitle: "Xaridorlar sharhlari",
    modalSampleReview1: "«Sifati juda a’lo, topshirish punktida chiroyli qadoqlangan holda berildi.»",
    modalSampleReview2: "«Obrazni juda nafis ko‘rsatadi, kundalik va kechki uslubga mos.»",
    ratingLabel: "Baho:",
    descriptionLabel: "Tavsif:",
    colorsLeftLabel: "Qolgan ranglar:",
    sizesLabel: "O‘lchamlar:",
    leftShort: "qoldi",
  },
  en: {
    pickupPrefix: "Pickup point:",
    myOrders: "My orders",
    morning: "☀ Morning",
    night: "☾ Night",
    catalog: "Catalog",
    searchPlaceholder: "Search look details — silk scarves, bags, sunglasses, hair clips...",
    find: "Search",
    profileLogin: "Profile / Sign in",
    wishlist: "Wishlist",
    cart: "Cart",
    heroBadge: "LUMEL1 • CURATED LOOK DETAILS",
    heroTitle: "Silk Scarves, Cases & Evening Bags",
    heroSub: "36 women's look details from Chanel, Dior, Tom Ford, Estée Lauder, and La Mer with pickup point delivery.",
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
    fullName: "Full name",
    email: "Email",
    phone: "Phone",
    defaultPickup: "Default pickup point",
    saveProfile: "Save Profile",
    savedMsg: "✓ Profile details saved.",
    emptyTitle: "No look details match your filters",
    emptySub: "Adjust the price range, brand selection, or category.",
    cartTotal: "Total:",
    checkoutBtn: "Place Order to Pickup Point",
    orderCreatedMsg: "✓ Order placed! Track its arrival in Profile → Orders.",
    addedMsg: "✓ Added to cart:",
    arrivedMsg: "✓ Order arrived at pickup point.",
    modalInstallment: "LUMEL1 Installment:",
    modalPickupInfo: "Pickup point delivery:",
    modalZoomHint: "Click photo to zoom in/out",
    modalReviewsTitle: "Customer Reviews",
    modalSampleReview1: "“Crisp luxury finish and arrived neatly packed at my pickup point.”",
    modalSampleReview2: "“Elevates both daytime and evening outfits effortlessly.”",
    ratingLabel: "Rating:",
    descriptionLabel: "Description:",
    colorsLeftLabel: "Remaining colors:",
    sizesLabel: "Sizes:",
    leftShort: "left",
  },
};

const COLOR_SWATCHES = {
  Burgundy: "#7f1d1d",
  Ivory: "#f5f1e6",
  Noir: "#18181b",
  Rose: "#fda4af",
  Gold: "#eab308",
  Emerald: "#059669",
  Amber: "#d97706",
};

const CATEGORY_SIZES = {
  bags: ["Mini", "S", "M"],
  scarves: ["70×70", "90×90", "140×140"],
  glasses: ["S (50mm)", "M (54mm)", "L (58mm)"],
  hair: ["S", "M", "One Size"],
  beauty: ["Compact", "Standard", "Travel"],
};

const CATEGORY_DESCRIPTIONS = {
  bags: "Фирменная форма, аккуратная строчка и надёжная фурнитура для повседневных и вечерних выходов.",
  scarves: "Мягкая ткань с благородным блеском и ручной обработкой края, легко драпируется в образе.",
  glasses: "Лёгкая посадка на переносице, защита от UV-лучей и выразительный силуэт оправы.",
  hair: "Надёжная фиксация без заломов волос с декоративным акцентом для причёсок на каждый день и праздник.",
  beauty: "Эргономичный аксессуар для ухода и макияжа с приятной текстурой и удобным хранением в сумочке.",
};

const REAL_ACCESSORY_PHOTOS = [
  "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=700&q=80",
  "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=700&q=80",
  "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=700&q=80",
  "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=700&q=80",
  "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=700&q=80",
  "https://images.unsplash.com/photo-1526045478516-99145907023c?auto=format&fit=crop&w=700&q=80",
  "https://images.unsplash.com/photo-1617038220319-276d3cfab638?auto=format&fit=crop&w=700&q=80",
  "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=700&q=80",
  "https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?auto=format&fit=crop&w=700&q=80",
  "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=700&q=80",
  "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?auto=format&fit=crop&w=700&q=80",
  "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?auto=format&fit=crop&w=700&q=80",
  "https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=700&q=80",
  "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=700&q=80",
  "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?auto=format&fit=crop&w=700&q=80",
  "https://images.unsplash.com/photo-1591561954557-26941169b49e?auto=format&fit=crop&w=700&q=80",
  "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=700&q=80",
  "https://images.unsplash.com/photo-1543076447-215ad9ba6923?auto=format&fit=crop&w=700&q=80",
  "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=700&q=80",
  "https://images.unsplash.com/photo-1508296695146-257a814070b4?auto=format&fit=crop&w=700&q=80",
  "https://images.unsplash.com/photo-1583209814683-c023dd293cc6?auto=format&fit=crop&w=700&q=80",
  "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=700&q=80",
  "https://images.unsplash.com/photo-1594223274512-ad4803739b7c?auto=format&fit=crop&w=700&q=80",
  "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=700&q=80",
  "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=700&q=80",
  "https://images.unsplash.com/photo-1606760227091-3dd1a6d16e33?auto=format&fit=crop&w=700&q=80",
  "https://images.unsplash.com/photo-1577803645773-f96470509666?auto=format&fit=crop&w=700&q=80",
  "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=700&q=80",
  "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=700&q=80",
  "https://images.unsplash.com/photo-1547949003-9794a18a2745?auto=format&fit=crop&w=700&q=80",
  "https://images.unsplash.com/photo-1611085583191-a3b181a88401?auto=format&fit=crop&w=700&q=80",
  "https://images.unsplash.com/photo-1509695507497-903c140c43b0?auto=format&fit=crop&w=700&q=80",
  "https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=700&q=80",
  "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&w=700&q=80",
  "https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?auto=format&fit=crop&w=700&q=80",
  "https://images.unsplash.com/photo-1611652022419-a9419f74343d?auto=format&fit=crop&w=700&q=80",
];

const RAW_PRODUCTS = [
  { id: 1, brand: "Chanel", category: "bags", name: "Quilted Vanity Mini Case", price: 245, oldPrice: 280, rating: 4.9, reviews: 142 },
  { id: 2, brand: "Dior", category: "scarves", name: "Oblique Silk Twill Mitzah Scarf", price: 115, oldPrice: 135, rating: 4.8, reviews: 96 },
  { id: 3, brand: "Tom Ford", category: "glasses", name: "Whitney Cat-Eye Acetate Sunglasses", price: 220, oldPrice: 260, rating: 4.9, reviews: 184 },
  { id: 4, brand: "Estée Lauder", category: "beauty", name: "Rose Quartz Contour Sculpting Roller", price: 48, oldPrice: 60, rating: 4.7, reviews: 210 },
  { id: 5, brand: "La Mer", category: "beauty", name: "Velvet Kabuki Brush & Pouch Set", price: 95, oldPrice: 115, rating: 4.9, reviews: 78 },
  { id: 6, brand: "Chanel", category: "hair", name: "Camellia Pearl Hair Claw Clip", price: 84, oldPrice: 98, rating: 4.8, reviews: 129 },
  { id: 7, brand: "Dior", category: "bags", name: "Cannage Satin Evening Clutch", price: 275, oldPrice: 310, rating: 5.0, reviews: 64 },
  { id: 8, brand: "Tom Ford", category: "scarves", name: "Cashmere Fringe Stole Shawl", price: 190, oldPrice: 230, rating: 4.8, reviews: 87 },
  { id: 9, brand: "Estée Lauder", category: "bags", name: "Crimson Velvet Cosmetic Train Case", price: 68, oldPrice: 82, rating: 4.7, reviews: 155 },
  { id: 10, brand: "La Mer", category: "beauty", name: "Jade Gua Sha Facial Lifting Stone", price: 56, oldPrice: 70, rating: 4.8, reviews: 118 },
  { id: 11, brand: "Chanel", category: "glasses", name: "Pearl Chain Round Optical Frames", price: 260, oldPrice: 295, rating: 4.9, reviews: 93 },
  { id: 12, brand: "Dior", category: "hair", name: "J'Adore Velvet Ribbon Scrunchie", price: 42, oldPrice: 54, rating: 4.6, reviews: 174 },
  { id: 13, brand: "Tom Ford", category: "bags", name: "Croc-Embossed Cardholder Pouch", price: 145, oldPrice: 170, rating: 4.8, reviews: 112 },
  { id: 14, brand: "Estée Lauder", category: "scarves", name: "Botanical Silk Neck Foulard", price: 64, oldPrice: 79, rating: 4.7, reviews: 88 },
  { id: 15, brand: "La Mer", category: "bags", name: "Atelier Linen Travel Tote Bag", price: 130, oldPrice: 155, rating: 4.8, reviews: 69 },
  { id: 16, brand: "Chanel", category: "scarves", name: "Double-C Jacquard Winter Wrap", price: 235, oldPrice: 270, rating: 4.9, reviews: 105 },
  { id: 17, brand: "Dior", category: "glasses", name: "Signature Rimless Aviator Shades", price: 195, oldPrice: 225, rating: 4.8, reviews: 77 },
  { id: 18, brand: "Tom Ford", category: "hair", name: "Gold Barrette Hair Pin Trio", price: 78, oldPrice: 92, rating: 4.7, reviews: 61 },
  { id: 19, brand: "Estée Lauder", category: "glasses", name: "Tortoiseshell Square Sun Glasses", price: 88, oldPrice: 105, rating: 4.6, reviews: 133 },
  { id: 20, brand: "La Mer", category: "scarves", name: "Seafoam Silk Sleep Headscarf", price: 108, oldPrice: 125, rating: 4.9, reviews: 54 },
  { id: 21, brand: "Chanel", category: "beauty", name: "Sculpted Compact Mirror & Case", price: 120, oldPrice: 140, rating: 4.9, reviews: 149 },
  { id: 22, brand: "Dior", category: "beauty", name: "Backstage Fan & Powder Brush Set", price: 112, oldPrice: 130, rating: 4.8, reviews: 91 },
  { id: 23, brand: "Tom Ford", category: "beauty", name: "Ivory Travel Atomizer & Holder", price: 86, oldPrice: 102, rating: 4.8, reviews: 73 },
  { id: 24, brand: "Estée Lauder", category: "hair", name: "Satin Pillow Scrunchie Duo", price: 36, oldPrice: 45, rating: 4.7, reviews: 198 },
  { id: 25, brand: "La Mer", category: "glasses", name: "Champagne Oversized Resort Shades", price: 175, oldPrice: 205, rating: 4.8, reviews: 47 },
  { id: 26, brand: "Chanel", category: "bags", name: "Burgundy Flap Chain Wristlet", price: 290, oldPrice: 325, rating: 5.0, reviews: 115 },
  { id: 27, brand: "Dior", category: "scarves", name: "Floral Jacquard Silk Bandana", price: 98, oldPrice: 118, rating: 4.8, reviews: 82 },
  { id: 28, brand: "Tom Ford", category: "glasses", name: "Amber Butterfly Sun Spectacles", price: 205, oldPrice: 240, rating: 4.9, reviews: 66 },
  { id: 29, brand: "Estée Lauder", category: "beauty", name: "Microcurrent Eye Massage Wand", price: 79, oldPrice: 95, rating: 4.7, reviews: 121 },
  { id: 30, brand: "La Mer", category: "hair", name: "Pearl & Gold Wave Hair Comb", price: 62, oldPrice: 75, rating: 4.8, reviews: 58 },
  { id: 31, brand: "Chanel", category: "beauty", name: "Nappa Leather Brush Roll Case", price: 155, oldPrice: 180, rating: 4.9, reviews: 84 },
  { id: 32, brand: "Dior", category: "bags", name: "Saddle Jacquard Phone Pouch", price: 230, oldPrice: 265, rating: 4.9, reviews: 109 },
  { id: 33, brand: "Tom Ford", category: "scarves", name: "Velvet Trim Evening Pashmina", price: 150, oldPrice: 178, rating: 4.8, reviews: 71 },
  { id: 34, brand: "Estée Lauder", category: "bags", name: "Ruby Quilted Jewelry Organizer", price: 54, oldPrice: 68, rating: 4.7, reviews: 146 },
  { id: 35, brand: "La Mer", category: "bags", name: "Soft Suede Weekend Vanity Bag", price: 185, oldPrice: 215, rating: 4.9, reviews: 63 },
  { id: 36, brand: "Chanel", category: "hair", name: "Crystal Bow Couture Hair Clip", price: 128, oldPrice: 150, rating: 4.9, reviews: 92 },
];

const COLOR_SETS = [
  [
    { name: "Burgundy", left: 4 },
    { name: "Ivory", left: 2 },
    { name: "Noir", left: 6 },
  ],
  [
    { name: "Rose", left: 5 },
    { name: "Gold", left: 3 },
    { name: "Noir", left: 2 },
  ],
  [
    { name: "Amber", left: 3 },
    { name: "Noir", left: 7 },
    { name: "Ivory", left: 2 },
  ],
  [
    { name: "Emerald", left: 4 },
    { name: "Ivory", left: 5 },
    { name: "Gold", left: 2 },
  ],
];

const PRODUCTS = RAW_PRODUCTS.map((item, idx) => ({
  ...item,
  description: `${item.name} от ${item.brand}. ${
    CATEGORY_DESCRIPTIONS[item.category] ||
    "Аккуратная отделка и удобная посадка на каждый день."
  }`,
  colorsLeft: COLOR_SETS[idx % COLOR_SETS.length],
  sizes: CATEGORY_SIZES[item.category] || ["S", "M", "L"],
  image: REAL_ACCESSORY_PHOTOS[idx % REAL_ACCESSORY_PHOTOS.length],
  fallbackImage: `https://placehold.co/600x600/3b0d17/fff8f5?text=${encodeURIComponent(
    `${item.brand} • ${item.name}`
  )}`,
}));

export default function App() {
  const [lang, setLang] = useState("ru");
  const [nightMode, setNightMode] = useState(false);
  const [view, setView] = useState("catalog");
  const [profileTab, setProfileTab] = useState("orders");
  const [orderFilter, setOrderFilter] = useState("all");

  const [category, setCategory] = useState("all");
  const [brands, setBrands] = useState([]);
  const [minPrice, setMinPrice] = useState(MIN_LIMIT);
  const [maxPrice, setMaxPrice] = useState(MAX_LIMIT);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("featured");

  const [pickup, setPickup] = useState(PICKUP_POINTS[0]);
  const [wishlist, setWishlist] = useState([1, 3, 10]);
  const [cart, setCart] = useState([{ productId: 2, qty: 1 }]);
  const [orders, setOrders] = useState([
    {
      id: "UZ-80412",
      productId: 1,
      title: "Quilted Vanity Mini Case (Chanel)",
      price: 245,
      pickupPoint: PICKUP_POINTS[0],
      eta: "Сегодня, 14:30",
      status: "pickup",
    },
    {
      id: "UZ-80519",
      productId: 3,
      title: "Whitney Cat-Eye Acetate Sunglasses (Tom Ford)",
      price: 220,
      pickupPoint: PICKUP_POINTS[1],
      eta: "Завтра, до 18:00",
      status: "transit",
    },
  ]);

  const [profile, setProfile] = useState({
    name: "Мадина Каримова",
    email: "madina.karimova@example.com",
    phone: "+998 90 123 45 67",
    pickupPoint: PICKUP_POINTS[0],
  });

  const [activeModalProductId, setActiveModalProductId] = useState(null);
  const [installmentMonths, setInstallmentMonths] = useState(12);
  const [modalZoomed, setModalZoomed] = useState(false);
  const [modalQty, setModalQty] = useState(1);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [toast, setToast] = useState("");

  const t = TRANSLATIONS[lang] || TRANSLATIONS.ru;

  const showToast = (message) => {
    setToast(message);
  };

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(""), 2800);
    return () => clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    if (!activeModalProductId) return;
    const onKeyDown = (e) => {
      if (e.key === "Escape") {
        setActiveModalProductId(null);
        setModalZoomed(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activeModalProductId]);

  const palette = useMemo(() => {
    if (nightMode) {
      return {
        bgPage: "#140511",
        bgPageGrad:
          "radial-gradient(circle at 82% 10%, #3b1032 0%, #1d0719 52%, #0c020a 100%)",
        bgSurface: "#22091d",
        bgCard: "#2c0d26",
        bgSubtle: "#3a1232",
        border: "#5c1e4f",
        textMain: "#fff4fa",
        textMuted: "#d9a7c7",
        accent: "#f06292",
        uzumYellow: "#ffd166",
        pickupGreen: "#34d399",
        pickupGreenBg: "rgba(52, 211, 153, 0.15)",
        pickupGreenBorder: "rgba(52, 211, 153, 0.38)",
        heroGrad:
          "linear-gradient(125deg, #4a113b 0%, #26071f 58%, #12030f 100%)",
        heroBorder: "rgba(255, 209, 102, 0.35)",
        photoFilter: "saturate(0.92) brightness(0.94) contrast(1.05)",
        topPillBg: "rgba(255, 248, 245, 0.14)",
        topPillColor: "#fff8f5",
        topPillBorder: "rgba(255, 248, 245, 0.25)",
        topText: "#f8dfe4",
      };
    }

    return {
      bgPage: "#f7e7e2",
      bgPageGrad:
        "radial-gradient(circle at 12% 8%, #fff3eb 0%, #f5dfd8 48%, #e8c7be 100%)",
      bgSurface: "#fffdfb",
      bgCard: "#ffffff",
      bgSubtle: "#faece7",
      border: "#e9c9c0",
      textMain: "#2d0b14",
      textMuted: "#7a4654",
      accent: "#b82946",
      uzumYellow: "#ffcf33",
      pickupGreen: "#15803d",
      pickupGreenBg: "rgba(21, 128, 61, 0.12)",
      pickupGreenBorder: "rgba(21, 128, 61, 0.3)",
      heroGrad:
        "linear-gradient(125deg, #c93855 0%, #8e1b33 58%, #5e0e1f 100%)",
      heroBorder: "rgba(255, 255, 255, 0.45)",
      photoFilter: "satur(1.06) contrast(1.02)",
      topPillBg: "#fffdfb",
      topPillColor: "#2d0b14",
      topPillBorder: "#d9a79b",
      topText: "#3d101d",
    };
  }, [nightMode]);

  const filteredProducts = useMemo(() => {
    const q = search.trim().toLowerCase();
    const matched = PRODUCTS.filter((item) => {
      const matchCategory = category === "all" || item.category === category;
      const matchBrand = brands.length === 0 || brands.includes(item.brand);
      const matchPrice = item.price >= minPrice && item.price <= maxPrice;
      const matchSearch =
        !q ||
        item.name.toLowerCase().includes(q) ||
        item.brand.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q);
      return matchCategory && matchBrand && matchPrice && matchSearch;
    });

    const sorted = [...matched];
    if (sort === "priceAsc") sorted.sort((a, b) => a.price - b.price);
    else if (sort === "priceDesc") sorted.sort((a, b) => b.price - a.price);
    else if (sort === "rating") sorted.sort((a, b) => b.rating - a.rating);
    return sorted;
  }, [category, brands, minPrice, maxPrice, search, sort]);

  const activeModalProduct = useMemo(
    () => PRODUCTS.find((p) => p.id === activeModalProductId) || null,
    [activeModalProductId]
  );

  const resetFilters = () => {
    setCategory("all");
    setBrands([]);
    setMinPrice(MIN_LIMIT);
    setMaxPrice(MAX_LIMIT);
    setSearch("");
    setSort("featured");
  };

  const toggleWishlist = (id) => {
    setWishlist((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const addToCart = (productId, qty = 1) => {
    const prod = PRODUCTS.find((p) => p.id === productId);
    if (!prod) return;
    setCart((prev) => {
      const existing = prev.find((c) => c.productId === productId);
      if (existing) {
        return prev.map((c) =>
          c.productId === productId ? { ...c, qty: c.qty + qty } : c
        );
      }
      return [...prev, { productId, qty }];
    });
    showToast(`${t.addedMsg} ${prod.name}`);
  };

  const createInstantOrder = (productId, qty = 1) => {
    const prod = PRODUCTS.find((p) => p.id === productId);
    if (!prod) return;
    const activePickup = pickup || profile.pickupPoint;
    setOrders((prev) => [
      {
        id: `UZ-${Math.floor(81000 + Math.random() * 8999)}`,
        productId: prod.id,
        title: `${prod.name} (${prod.brand})${qty > 1 ? ` ×${qty}` : ""}`,
        price: prod.price * qty,
        pickupPoint: activePickup,
        eta: "Завтра, 12:00–19:00",
        status: "transit",
      },
      ...prev,
    ]);
    showToast(t.orderCreatedMsg);
  };

  const openProductModal = (productId) => {
    const prod = PRODUCTS.find((p) => p.id === productId);
    setActiveModalProductId(productId);
    setModalZoomed(false);
    setModalQty(1);
    setSelectedColor(prod?.colorsLeft?.[0]?.name || "");
    setSelectedSize(prod?.sizes?.[0] || "");
  };

  const closeProductModal = () => {
    setActiveModalProductId(null);
    setModalZoomed(false);
  };

  const updateCartQty = (productId, delta) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.productId === productId ? { ...item, qty: item.qty + delta } : item
        )
        .filter((item) => item.qty > 0)
    );
  };

  const handleCheckoutCart = () => {
    if (cart.length === 0) return;
    const activePickup = pickup || profile.pickupPoint;
    const created = cart
      .map((entry, idx) => {
        const prod = PRODUCTS.find((p) => p.id === entry.productId);
        if (!prod) return null;
        return {
          id: `UZ-${Math.floor(82000 + Math.random() * 7999)}-${idx + 1}`,
          productId: prod.id,
          title: `${prod.name} ×${entry.qty}`,
          price: prod.price * entry.qty,
          pickupPoint: activePickup,
          eta: "Завтра, до 17:00",
          status: "transit",
        };
      })
      .filter(Boolean);

    setOrders((prev) => [...created, ...prev]);
    setCart([]);
    setView("profile");
    setProfileTab("orders");
    showToast(t.orderCreatedMsg);
  };

  const markOrderArrived = (orderId) => {
    setOrders((prev) =>
      prev.map((ord) =>
        ord.id === orderId
          ? { ...ord, status: "pickup", eta: "Готов к выдаче сегодня" }
          : ord
      )
    );
    showToast(t.arrivedMsg);
  };

  const cartTotalQty = cart.reduce((sum, item) => sum + item.qty, 0);
  const cartTotalSum = cart.reduce((sum, item) => {
    const prod = PRODUCTS.find((p) => p.id === item.productId);
    return sum + (prod ? prod.price * item.qty : 0);
  }, 0);

  const visibleOrders = orders.filter((ord) => {
    if (orderFilter === "all") return true;
    return ord.status === orderFilter;
  });

  const pillBtnStyle = (active) => ({
    backgroundColor: active ? palette.accent : palette.bgSurface,
    color: active ? "#ffffff" : palette.textMain,
    border: `1px solid ${active ? palette.accent : palette.border}`,
    borderRadius: "999px",
    padding: "6px 14px",
    fontSize: "13px",
    fontWeight: 600,
    cursor: "pointer",
  });

  const secondaryBtnStyle = {
    backgroundColor: palette.bgSubtle,
    color: palette.textMain,
    border: `1px solid ${palette.border}`,
    borderRadius: "10px",
    padding: "8px 12px",
    fontSize: "12px",
    fontWeight: 700,
    cursor: "pointer",
  };

  const primaryBtnStyle = {
    backgroundColor: palette.accent,
    color: "#ffffff",
    border: `1px solid ${palette.accent}`,
    borderRadius: "10px",
    padding: "8px 12px",
    fontSize: "12px",
    fontWeight: 700,
    cursor: "pointer",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        boxSizing: "border-box",
        backgroundColor: palette.bgPage,
        backgroundImage: palette.bgPageGrad,
        color: palette.textMain,
        fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
      }}
    >
      <div
        style={{
          maxWidth: "1440px",
          margin: "0 auto",
          padding: "0 20px 64px",
          boxSizing: "border-box",
        }}
      >
        {/* Верхняя служебная панель */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "12px",
            padding: "12px 0",
            fontSize: "13px",
            fontWeight: 600,
            color: palette.topText,
          }}
        >
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "8px" }}>
            <span>{t.pickupPrefix}</span>
            <select
              value={pickup}
              onChange={(e) => setPickup(e.target.value)}
              aria-label="Pickup point"
              style={{
                backgroundColor: palette.topPillBg,
                color: palette.topPillColor,
                border: `1px solid ${palette.topPillBorder}`,
                borderRadius: "999px",
                padding: "6px 12px",
                fontSize: "12px",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              {PICKUP_POINTS.map((pt) => (
                <option key={pt} value={pt} style={{ backgroundColor: "#fff8f5", color: "#190409" }}>
                  {pt}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => {
                setView("profile");
                setProfileTab("orders");
              }}
              style={{
                backgroundColor: palette.topPillBg,
                color: palette.topPillColor,
                border: `1px solid ${palette.topPillBorder}`,
                borderRadius: "999px",
                padding: "6px 12px",
                fontSize: "12px",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              📦 {t.myOrders} ({orders.length})
            </button>
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "8px" }}>
            {["ru", "uz", "en"].map((code) => {
              const isActive = lang === code;
              return (
                <button
                  key={code}
                  type="button"
                  onClick={() => setLang(code)}
                  style={{
                    backgroundColor: isActive ? palette.accent : palette.topPillBg,
                    color: isActive ? "#ffffff" : palette.topPillColor,
                    border: `1px solid ${isActive ? palette.accent : palette.topPillBorder}`,
                    borderRadius: "999px",
                    padding: "6px 12px",
                    fontSize: "12px",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    cursor: "pointer",
                  }}
                >
                  {code}
                </button>
              );
            })}
            <button
              type="button"
              onClick={() => setNightMode((prev) => !prev)}
              style={{
                backgroundColor: palette.topPillBg,
                color: palette.topPillColor,
                border: `1px solid ${palette.topPillBorder}`,
                borderRadius: "999px",
                padding: "6px 12px",
                fontSize: "12px",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              {nightMode ? t.morning : t.night}
            </button>
          </div>
        </div>

        {/* Основная шапка */}
        <header
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "12px",
            backgroundColor: palette.bgSurface,
            border: `1px solid ${palette.border}`,
            borderRadius: "18px",
            padding: "14px 18px",
          }}
        >
          <button
            type="button"
            onClick={() => setView("catalog")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              border: "none",
              background: "transparent",
              color: palette.textMain,
              textAlign: "left",
              cursor: "pointer",
              padding: 0,
            }}
          >
            <span
              style={{
                width: "38px",
                height: "38px",
                borderRadius: "999px",
                backgroundColor: palette.accent,
                color: "#fff8f5",
                display: "grid",
                placeItems: "center",
                fontSize: "16px",
                fontWeight: 800,
                flexShrink: 0,
              }}
            >
              L
            </span>
            <span>
              <div style={{ fontSize: "18px", fontWeight: 800, lineHeight: 1.1 }}>
                lumel1
              </div>
              <div style={{ fontSize: "11px", color: palette.textMuted }}>
                Women's Luxury Accessories
              </div>
            </span>
          </button>

          <button
            type="button"
            onClick={() => {
              setView("catalog");
              setCategory("all");
            }}
            style={{
              backgroundColor: palette.bgSubtle,
              color: palette.accent,
              border: `1px solid ${palette.border}`,
              borderRadius: "10px",
              padding: "10px 14px",
              fontSize: "13px",
              fontWeight: 700,
              cursor: "pointer",
              whiteSpace: "nowrap",
            }}
          >
            ☰ {t.catalog}
          </button>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              setView("catalog");
            }}
            style={{
              display: "flex",
              alignItems: "center",
              flex: "1 1 280px",
              minWidth: "220px",
              backgroundColor: palette.bgCard,
              border: `1px solid ${palette.border}`,
              borderRadius: "12px",
              overflow: "hidden",
            }}
          >
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t.searchPlaceholder}
              style={{
                flex: 1,
                minWidth: 0,
                border: "none",
                background: "transparent",
                color: palette.textMain,
                padding: "10px 14px",
                fontSize: "14px",
                outline: "none",
              }}
            />
            <button
              type="submit"
              style={{
                border: "none",
                backgroundColor: palette.bgSubtle,
                color: palette.textMain,
                padding: "10px 16px",
                fontSize: "13px",
                fontWeight: 600,
                cursor: "pointer",
                whiteSpace: "nowrap",
              }}
            >
              {t.find}
            </button>
          </form>

          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "8px" }}>
            <button
              type="button"
              onClick={() => setView("profile")}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                backgroundColor: view === "profile" ? palette.bgSubtle : palette.bgCard,
                color: palette.textMain,
                border: `1px solid ${view === "profile" ? palette.accent : palette.border}`,
                borderRadius: "10px",
                padding: "8px 12px",
                fontSize: "13px",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              <span>👤</span>
              <span>{profile.name || t.profileLogin}</span>
            </button>

            <button
              type="button"
              onClick={() => setView("wishlist")}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                backgroundColor: view === "wishlist" ? palette.bgSubtle : palette.bgCard,
                color: palette.textMain,
                border: `1px solid ${view === "wishlist" ? palette.accent : palette.border}`,
                borderRadius: "10px",
                padding: "8px 12px",
                fontSize: "13px",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              <span>♡</span>
              <span>{t.wishlist}</span>
              <span
                style={{
                  backgroundColor: palette.accent,
                  color: "#ffffff",
                  borderRadius: "999px",
                  padding: "2px 7px",
                  fontSize: "11px",
                  fontWeight: 700,
                }}
              >
                {wishlist.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setView("cart")}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                backgroundColor: view === "cart" ? palette.bgSubtle : palette.bgCard,
                color: palette.textMain,
                border: `1px solid ${view === "cart" ? palette.accent : palette.border}`,
                borderRadius: "10px",
                padding: "8px 12px",
                fontSize: "13px",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              <span>🛍️</span>
              <span>{t.cart}</span>
              <span
                style={{
                  backgroundColor: palette.accent,
                  color: "#ffffff",
                  borderRadius: "999px",
                  padding: "2px 7px",
                  fontSize: "11px",
                  fontWeight: 700,
                }}
              >
                {cartTotalQty}
              </span>
            </button>
          </div>
        </header>

        {/* Панель категорий */}
        <nav
          aria-label="Categories"
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "8px",
            marginTop: "14px",
          }}
        >
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => {
                setView("catalog");
                setCategory(cat.id);
              }}
              style={pillBtnStyle(view === "catalog" && category === cat.id)}
            >
              {cat[lang] || cat.ru}
            </button>
          ))}
        </nav>

        {/* Уведомление */}
        {toast && (
          <div
            role="status"
            style={{
              marginTop: "12px",
              padding: "10px 14px",
              borderRadius: "12px",
              border: `1px solid ${palette.pickupGreenBorder}`,
              backgroundColor: palette.pickupGreenBg,
              color: palette.pickupGreen,
              fontSize: "13px",
              fontWeight: 700,
            }}
          >
            {toast}
          </div>
        )}

        {/* Каталог */}
        {view === "catalog" && (
          <section style={{ marginTop: "16px" }}>
            <div
              style={{
                background: palette.heroGrad,
                border: `1px solid ${palette.heroBorder}`,
                borderRadius: "20px",
                padding: "24px 28px",
                color: "#ffffff",
              }}
            >
              <span
                style={{
                  display: "inline-block",
                  backgroundColor: palette.uzumYellow,
                  color: "#190409",
                  borderRadius: "6px",
                  padding: "4px 10px",
                  fontSize: "11px",
                  fontWeight: 800,
                  marginBottom: "10px",
                }}
              >
                {t.heroBadge}
              </span>
              <h1 style={{ fontSize: "26px", fontWeight: 800, margin: 0 }}>{t.heroTitle}</h1>
              <p style={{ margin: "6px 0 0", maxWidth: "720px", fontSize: "14px", color: "#f4d8df" }}>
                {t.heroSub}
              </p>
            </div>

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "flex-start",
                gap: "22px",
                marginTop: "22px",
              }}
            >
              {/* Фильтры */}
              <aside
                style={{
                  flex: "0 0 276px",
                  width: "100%",
                  maxWidth: "276px",
                  backgroundColor: palette.bgSurface,
                  border: `1px solid ${palette.border}`,
                  borderRadius: "18px",
                  padding: "18px",
                  boxSizing: "border-box",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    borderBottom: `1px solid ${palette.border}`,
                    paddingBottom: "12px",
                    marginBottom: "16px",
                  }}
                >
                  <h2 style={{ fontSize: "16px", fontWeight: 700, margin: 0 }}>{t.filters}</h2>
                  <button
                    type="button"
                    onClick={resetFilters}
                    style={{
                      border: "none",
                      background: "transparent",
                      color: palette.accent,
                      fontSize: "12px",
                      fontWeight: 700,
                      cursor: "pointer",
                    }}
                  >
                    {t.reset}
                  </button>
                </div>

                <div style={{ marginBottom: "20px" }}>
                  <span style={{ display: "block", fontSize: "13px", fontWeight: 700, marginBottom: "10px" }}>
                    {t.priceRange}
                  </span>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: "13px",
                      fontWeight: 700,
                      marginBottom: "8px",
                    }}
                  >
                    <span>${minPrice}</span>
                    <span>{maxPrice === MAX_LIMIT ? "$300+" : `$${maxPrice}`}</span>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "12px" }}>
                    <input
                      type="range"
                      min={MIN_LIMIT}
                      max={MAX_LIMIT}
                      step={5}
                      value={minPrice}
                      aria-label="Minimum price"
                      onChange={(e) =>
                        setMinPrice(Math.min(Number(e.target.value), maxPrice - MIN_GAP))
                      }
                      style={{ width: "100%", accentColor: palette.accent, cursor: "pointer" }}
                    />
                    <input
                      type="range"
                      min={MIN_LIMIT}
                      max={MAX_LIMIT}
                      step={5}
                      value={maxPrice}
                      aria-label="Maximum price"
                      onChange={(e) =>
                        setMaxPrice(Math.max(Number(e.target.value), minPrice + MIN_GAP))
                      }
                      style={{ width: "100%", accentColor: palette.accent, cursor: "pointer" }}
                    />
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                    {PRICE_PRESETS.map((preset) => {
                      const active = minPrice === preset.min && maxPrice === preset.max;
                      return (
                        <button
                          key={preset.id}
                          type="button"
                          onClick={() => {
                            setMinPrice(preset.min);
                            setMaxPrice(preset.max);
                          }}
                          style={{
                            backgroundColor: active ? palette.accent : palette.bgCard,
                            color: active ? "#ffffff" : palette.textMain,
                            border: `1px solid ${active ? palette.accent : palette.border}`,
                            borderRadius: "8px",
                            padding: "7px 6px",
                            fontSize: "12px",
                            fontWeight: 600,
                            cursor: "pointer",
                          }}
                        >
                          {preset.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <span style={{ display: "block", fontSize: "13px", fontWeight: 700, marginBottom: "10px" }}>
                    {t.luxuryBrands}
                  </span>
                  {BRANDS.map((brand) => {
                    const count = PRODUCTS.filter((p) => p.brand === brand).length;
                    const checked = brands.includes(brand);
                    return (
                      <label
                        key={brand}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          padding: "6px 0",
                          fontSize: "13px",
                          cursor: "pointer",
                        }}
                      >
                        <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setBrands((prev) =>
                                  prev.includes(brand) ? prev : [...prev, brand]
                                );
                              } else {
                                setBrands((prev) => prev.filter((b) => b !== brand));
                              }
                            }}
                          />
                          <span>{brand}</span>
                        </span>
                        <span
                          style={{
                            backgroundColor: palette.bgSubtle,
                            color: palette.textMuted,
                            border: `1px solid ${palette.border}`,
                            borderRadius: "999px",
                            padding: "2px 8px",
                            fontSize: "11px",
                            fontWeight: 700,
                          }}
                        >
                          {count}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </aside>

              {/* Сетка товаров */}
              <main
                style={{
                  flex: "1 1 620px",
                  minWidth: "280px",
                  backgroundColor: palette.bgSurface,
                  border: `1px solid ${palette.border}`,
                  borderRadius: "18px",
                  padding: "20px",
                  boxSizing: "border-box",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "12px",
                    marginBottom: "18px",
                  }}
                >
                  <strong>
                    {t.showing} {filteredProducts.length} / {PRODUCTS.length}
                  </strong>
                  <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                    aria-label="Sort products"
                    style={{
                      backgroundColor: palette.bgCard,
                      color: palette.textMain,
                      border: `1px solid ${palette.border}`,
                      borderRadius: "10px",
                      padding: "8px 12px",
                      fontSize: "13px",
                      fontWeight: 600,
                    }}
                  >
                    <option value="featured">{t.sortFeatured}</option>
                    <option value="priceAsc">{t.sortPriceAsc}</option>
                    <option value="priceDesc">{t.sortPriceDesc}</option>
                    <option value="rating">{t.sortRating}</option>
                  </select>
                </div>

                {filteredProducts.length === 0 ? (
                  <div style={{ padding: "36px 16px", textAlign: "center" }}>
                    <h3 style={{ fontSize: "16px", fontWeight: 700, margin: "0 0 6px" }}>{t.emptyTitle}</h3>
                    <p style={{ color: palette.textMuted, fontSize: "13px", margin: "0 0 14px" }}>{t.emptySub}</p>
                    <button type="button" onClick={resetFilters} style={primaryBtnStyle}>
                      {t.reset}
                    </button>
                  </div>
                ) : (
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fill, minmax(225px, 1fr))",
                      gap: "16px",
                    }}
                  >
                    {filteredProducts.map((item) => {
                      const isFav = wishlist.includes(item.id);
                      const monthly = Math.max(1, Math.ceil(item.price / 12));
                      return (
                        <article
                          key={item.id}
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            backgroundColor: palette.bgCard,
                            border: `1px solid ${palette.border}`,
                            borderRadius: "14px",
                            overflow: "hidden",
                          }}
                        >
                          <div
                            onClick={() => openProductModal(item.id)}
                            style={{
                              position: "relative",
                              width: "100%",
                              height: "210px",
                              backgroundColor: palette.bgSubtle,
                              cursor: "pointer",
                              overflow: "hidden",
                            }}
                          >
                            <img
                              src={item.image}
                              alt={item.name}
                              loading="eager"
                              onError={(e) => {
                                e.currentTarget.onerror = null;
                                e.currentTarget.src = item.fallbackImage;
                              }}
                              style={{
                                display: "block",
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                                filter: palette.photoFilter,
                              }}
                            />
                            <span
                              style={{
                                position: "absolute",
                                bottom: "10px",
                                left: "10px",
                                backgroundColor: "rgba(255,255,255,0.95)",
                                color: "#15803d",
                                borderRadius: "6px",
                                padding: "3px 8px",
                                fontSize: "10px",
                                fontWeight: 800,
                              }}
                            >
                              ✓ ORIGINAL
                            </span>
                            <button
                              type="button"
                              aria-label="Wishlist"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleWishlist(item.id);
                              }}
                              style={{
                                position: "absolute",
                                top: "10px",
                                right: "10px",
                                width: "34px",
                                height: "34px",
                                borderRadius: "999px",
                                display: "grid",
                                placeItems: "center",
                                fontSize: "16px",
                                fontWeight: 700,
                                cursor: "pointer",
                                backgroundColor: isFav ? palette.accent : "rgba(255, 253, 251, 0.92)",
                                color: isFav ? "#ffffff" : palette.accent,
                                border: `1px solid ${isFav ? palette.accent : palette.border}`,
                              }}
                            >
                              {isFav ? "♥" : "♡"}
                            </button>
                          </div>

                          <div
                            style={{
                              display: "flex",
                              flex: 1,
                              flexDirection: "column",
                              gap: "6px",
                              padding: "12px 14px 14px",
                            }}
                          >
                            <div
                              style={{
                                fontSize: "11px",
                                fontWeight: 700,
                                textTransform: "uppercase",
                                letterSpacing: "0.04em",
                                color: palette.textMuted,
                              }}
                            >
                              {item.brand}
                            </div>
                            <h3
                              onClick={() => openProductModal(item.id)}
                              style={{
                                margin: 0,
                                fontSize: "14px",
                                fontWeight: 700,
                                lineHeight: 1.3,
                                cursor: "pointer",
                              }}
                            >
                              {item.name}
                            </h3>
                            <p
                              style={{
                                margin: 0,
                                fontSize: "11px",
                                lineHeight: 1.35,
                                color: palette.textMuted,
                              }}
                            >
                              {item.description}
                            </p>
                            <div
                              style={{
                                display: "flex",
                                flexWrap: "wrap",
                                alignItems: "center",
                                gap: "6px",
                                paddingTop: "2px",
                              }}
                            >
                              {item.colorsLeft.map((c) => (
                                <span
                                  key={c.name}
                                  title={`${c.name} (${c.left} ${t.leftShort})`}
                                  style={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: "4px",
                                    backgroundColor: palette.bgSubtle,
                                    border: `1px solid ${palette.border}`,
                                    borderRadius: "999px",
                                    padding: "2px 6px",
                                    fontSize: "10px",
                                    fontWeight: 600,
                                  }}
                                >
                                  <span
                                    style={{
                                      width: "8px",
                                      height: "8px",
                                      borderRadius: "999px",
                                      backgroundColor: COLOR_SWATCHES[c.name] || "#b82946",
                                    }}
                                  />
                                  <span>{c.left}</span>
                                </span>
                              ))}
                              <span
                                style={{
                                  marginLeft: "auto",
                                  fontSize: "10px",
                                  fontWeight: 600,
                                  color: palette.textMuted,
                                }}
                              >
                                {item.sizes.join(" · ")}
                              </span>
                            </div>
                            <span
                              style={{
                                alignSelf: "flex-start",
                                backgroundColor: palette.uzumYellow,
                                color: "#190409",
                                borderRadius: "6px",
                                padding: "2px 7px",
                                fontSize: "11px",
                                fontWeight: 700,
                              }}
                            >
                              ${monthly}
                              {t.perMonth}
                            </span>
                            <div style={{ fontSize: "12px", color: palette.textMuted }}>
                              {t.ratingLabel}{" "}
                              <strong style={{ color: palette.textMain }}>
                                ★ {item.rating.toFixed(1)}
                              </strong>{" "}
                              ({item.reviews} {t.reviews})
                            </div>
                            <div
                              style={{
                                marginTop: "auto",
                                paddingTop: "4px",
                                display: "flex",
                                alignItems: "baseline",
                                gap: "8px",
                              }}
                            >
                              <span style={{ fontSize: "17px", fontWeight: 800 }}>${item.price}</span>
                              <span style={{ fontSize: "12px", color: palette.textMuted, textDecoration: "line-through" }}>
                                ${item.oldPrice}
                              </span>
                            </div>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginTop: "8px" }}>
                              <button type="button" onClick={() => addToCart(item.id, 1)} style={secondaryBtnStyle}>
                                {t.inCart}
                              </button>
                              <button type="button" onClick={() => createInstantOrder(item.id, 1)} style={primaryBtnStyle}>
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
          </section>
        )}

        {/* Профиль и заказы */}
        {view === "profile" && (
          <section
            style={{
              marginTop: "20px",
              backgroundColor: palette.bgSurface,
              border: `1px solid ${palette.border}`,
              borderRadius: "20px",
              padding: "22px",
            }}
          >
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "12px",
                borderBottom: `1px solid ${palette.border}`,
                paddingBottom: "16px",
                marginBottom: "18px",
              }}
            >
              <div>
                <h2 style={{ margin: 0, fontSize: "20px", fontWeight: 700 }}>{profile.name}</h2>
                <p style={{ margin: "4px 0 0", fontSize: "13px", color: palette.textMuted }}>{profile.email}</p>
              </div>
              <button
                type="button"
                onClick={() => setView("catalog")}
                style={{
                  backgroundColor: palette.bgCard,
                  color: palette.textMain,
                  border: `1px solid ${palette.border}`,
                  borderRadius: "10px",
                  padding: "8px 12px",
                  fontSize: "13px",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                {t.backToCatalog}
              </button>
            </div>

            <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-start", gap: "20px" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px", width: "240px" }}>
                <button
                  type="button"
                  onClick={() => setProfileTab("orders")}
                  style={{
                    backgroundColor: profileTab === "orders" ? palette.accent : palette.bgCard,
                    color: profileTab === "orders" ? "#ffffff" : palette.textMain,
                    border: `1px solid ${profileTab === "orders" ? palette.accent : palette.border}`,
                    borderRadius: "12px",
                    padding: "10px 14px",
                    fontSize: "13px",
                    fontWeight: 700,
                    textAlign: "left",
                    cursor: "pointer",
                  }}
                >
                  📦 {t.profileTabOrders} ({orders.length})
                </button>
                <button
                  type="button"
                  onClick={() => setProfileTab("info")}
                  style={{
                    backgroundColor: profileTab === "info" ? palette.accent : palette.bgCard,
                    color: profileTab === "info" ? "#ffffff" : palette.textMain,
                    border: `1px solid ${profileTab === "info" ? palette.accent : palette.border}`,
                    borderRadius: "12px",
                    padding: "10px 14px",
                    fontSize: "13px",
                    fontWeight: 700,
                    textAlign: "left",
                    cursor: "pointer",
                  }}
                >
                  ⚙️ {t.profileTabInfo}
                </button>
              </div>

              <div style={{ flex: "1 1 420px", minWidth: "260px" }}>
                {profileTab === "orders" ? (
                  <div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "16px" }}>
                      {[
                        { id: "all", label: t.tabAll },
                        { id: "transit", label: t.tabTransit },
                        { id: "pickup", label: t.tabPickup },
                      ].map((tab) => (
                        <button
                          key={tab.id}
                          type="button"
                          onClick={() => setOrderFilter(tab.id)}
                          style={pillBtnStyle(orderFilter === tab.id)}
                        >
                          {tab.label}
                        </button>
                      ))}
                    </div>

                    {visibleOrders.length === 0 ? (
                      <div style={{ padding: "36px 16px", textAlign: "center" }}>
                        <h3 style={{ fontSize: "16px", fontWeight: 700 }}>{t.emptyTitle}</h3>
                      </div>
                    ) : (
                      visibleOrders.map((ord) => {
                        const prod = PRODUCTS.find((p) => p.id === ord.productId) || PRODUCTS[0];
                        return (
                          <div
                            key={ord.id}
                            style={{
                              display: "flex",
                              flexWrap: "wrap",
                              alignItems: "center",
                              justifyContent: "space-between",
                              gap: "12px",
                              backgroundColor: palette.bgCard,
                              border: `1px solid ${palette.border}`,
                              borderRadius: "14px",
                              padding: "14px 16px",
                              marginBottom: "12px",
                            }}
                          >
                            <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                              <img
                                src={prod.image}
                                alt={ord.title}
                                onError={(e) => {
                                  e.currentTarget.onerror = null;
                                  e.currentTarget.src = prod.fallbackImage;
                                }}
                                style={{
                                  display: "block",
                                  width: "64px",
                                  height: "64px",
                                  borderRadius: "10px",
                                  objectFit: "cover",
                                  border: `1px solid ${palette.border}`,
                                  flexShrink: 0,
                                }}
                              />
                              <div>
                                <div style={{ fontSize: "14px", fontWeight: 800 }}>
                                  #{ord.id} • {ord.title}
                                </div>
                                <div style={{ fontSize: "12px", color: palette.textMuted, marginTop: "4px" }}>
                                  📍 {ord.pickupPoint} • 🕒 {ord.eta}
                                </div>
                              </div>
                            </div>
                            <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "10px" }}>
                              <strong>${ord.price}</strong>
                              {ord.status === "pickup" ? (
                                <span
                                  style={{
                                    backgroundColor: palette.pickupGreenBg,
                                    color: palette.pickupGreen,
                                    border: `1px solid ${palette.pickupGreenBorder}`,
                                    borderRadius: "999px",
                                    padding: "4px 10px",
                                    fontSize: "12px",
                                    fontWeight: 700,
                                  }}
                                >
                                  ● {t.atPickupStatus}
                                </span>
                              ) : (
                                <>
                                  <span
                                    style={{
                                      backgroundColor: "rgba(245, 158, 11, 0.15)",
                                      color: "#b45309",
                                      border: "1px solid rgba(245, 158, 11, 0.4)",
                                      borderRadius: "999px",
                                      padding: "4px 10px",
                                      fontSize: "12px",
                                      fontWeight: 700,
                                    }}
                                  >
                                    ◐ {t.inTransitStatus}
                                  </span>
                                  <button type="button" onClick={() => markOrderArrived(ord.id)} style={secondaryBtnStyle}>
                                    {t.simulateArrival}
                                  </button>
                                </>
                              )}
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                ) : (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      setProfile((prev) => ({
                        ...prev,
                        name: prev.name.trim() || "Мадина Каримова",
                        email: prev.email.trim() || "madina.karimova@example.com",
                      }));
                      setPickup(profile.pickupPoint);
                      showToast(t.savedMsg);
                    }}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                      gap: "14px",
                      maxWidth: "720px",
                    }}
                  >
                    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                      <label htmlFor="jsx-inp-name" style={{ fontSize: "12px", fontWeight: 700 }}>
                        {t.fullName}
                      </label>
                      <input
                        id="jsx-inp-name"
                        type="text"
                        required
                        value={profile.name}
                        onChange={(e) => setProfile((prev) => ({ ...prev, name: e.target.value }))}
                        style={{
                          backgroundColor: palette.bgCard,
                          color: palette.textMain,
                          border: `1px solid ${palette.border}`,
                          borderRadius: "10px",
                          padding: "10px 12px",
                          fontSize: "13px",
                        }}
                      />
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                      <label htmlFor="jsx-inp-email" style={{ fontSize: "12px", fontWeight: 700 }}>
                        {t.email}
                      </label>
                      <input
                        id="jsx-inp-email"
                        type="email"
                        required
                        value={profile.email}
                        onChange={(e) => setProfile((prev) => ({ ...prev, email: e.target.value }))}
                        style={{
                          backgroundColor: palette.bgCard,
                          color: palette.textMain,
                          border: `1px solid ${palette.border}`,
                          borderRadius: "10px",
                          padding: "10px 12px",
                          fontSize: "13px",
                        }}
                      />
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                      <label htmlFor="jsx-inp-phone" style={{ fontSize: "12px", fontWeight: 700 }}>
                        {t.phone}
                      </label>
                      <input
                        id="jsx-inp-phone"
                        type="text"
                        value={profile.phone}
                        onChange={(e) => setProfile((prev) => ({ ...prev, phone: e.target.value }))}
                        style={{
                          backgroundColor: palette.bgCard,
                          color: palette.textMain,
                          border: `1px solid ${palette.border}`,
                          borderRadius: "10px",
                          padding: "10px 12px",
                          fontSize: "13px",
                        }}
                      />
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                      <label htmlFor="jsx-inp-pickup" style={{ fontSize: "12px", fontWeight: 700 }}>
                        {t.defaultPickup}
                      </label>
                      <select
                        id="jsx-inp-pickup"
                        value={profile.pickupPoint}
                        onChange={(e) => setProfile((prev) => ({ ...prev, pickupPoint: e.target.value }))}
                        style={{
                          backgroundColor: palette.bgCard,
                          color: palette.textMain,
                          border: `1px solid ${palette.border}`,
                          borderRadius: "10px",
                          padding: "10px 12px",
                          fontSize: "13px",
                        }}
                      >
                        {PICKUP_POINTS.map((pt) => (
                          <option key={pt} value={pt}>
                            {pt}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div style={{ gridColumn: "1 / -1" }}>
                      <button type="submit" style={{ ...primaryBtnStyle, padding: "10px 16px" }}>
                        {t.saveProfile}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </section>
        )}

        {/* Избранное */}
        {view === "wishlist" && (
          <section
            style={{
              marginTop: "20px",
              backgroundColor: palette.bgSurface,
              border: `1px solid ${palette.border}`,
              borderRadius: "20px",
              padding: "22px",
            }}
          >
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "12px",
                borderBottom: `1px solid ${palette.border}`,
                paddingBottom: "16px",
                marginBottom: "18px",
              }}
            >
              <h2 style={{ margin: 0, fontSize: "20px", fontWeight: 700 }}>
                {t.wishlist} ({wishlist.length})
              </h2>
              <button
                type="button"
                onClick={() => setView("catalog")}
                style={{
                  backgroundColor: palette.bgCard,
                  color: palette.textMain,
                  border: `1px solid ${palette.border}`,
                  borderRadius: "10px",
                  padding: "8px 12px",
                  fontSize: "13px",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                {t.backToCatalog}
              </button>
            </div>

            {wishlist.length === 0 ? (
              <div style={{ padding: "36px 16px", textAlign: "center" }}>
                <h3 style={{ fontSize: "16px", fontWeight: 700 }}>{t.emptyTitle}</h3>
              </div>
            ) : (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(225px, 1fr))",
                  gap: "16px",
                }}
              >
                {PRODUCTS.filter((p) => wishlist.includes(p.id)).map((item) => (
                  <article
                    key={item.id}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      backgroundColor: palette.bgCard,
                      border: `1px solid ${palette.border}`,
                      borderRadius: "14px",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      onClick={() => openProductModal(item.id)}
                      style={{
                        position: "relative",
                        width: "100%",
                        height: "210px",
                        backgroundColor: palette.bgSubtle,
                        cursor: "pointer",
                        overflow: "hidden",
                      }}
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        loading="eager"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = item.fallbackImage;
                        }}
                        style={{
                          display: "block",
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          filter: palette.photoFilter,
                        }}
                      />
                    </div>
                    <div style={{ display: "flex", flex: 1, flexDirection: "column", gap: "6px", padding: "12px 14px 14px" }}>
                      <div style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", color: palette.textMuted }}>
                        {item.brand}
                      </div>
                      <h3 onClick={() => openProductModal(item.id)} style={{ margin: 0, fontSize: "14px", fontWeight: 700, cursor: "pointer" }}>
                        {item.name}
                      </h3>
                      <div style={{ marginTop: "auto", paddingTop: "4px", fontSize: "17px", fontWeight: 800 }}>
                        ${item.price}
                      </div>
                      <button type="button" onClick={() => addToCart(item.id, 1)} style={{ ...secondaryBtnStyle, marginTop: "8px" }}>
                        {t.inCart}
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        )}

        {/* Корзина */}
        {view === "cart" && (
          <section
            style={{
              marginTop: "20px",
              backgroundColor: palette.bgSurface,
              border: `1px solid ${palette.border}`,
              borderRadius: "20px",
              padding: "22px",
            }}
          >
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "12px",
                borderBottom: `1px solid ${palette.border}`,
                paddingBottom: "16px",
                marginBottom: "18px",
              }}
            >
              <h2 style={{ margin: 0, fontSize: "20px", fontWeight: 700 }}>
                {t.cart} ({cartTotalQty})
              </h2>
              <button
                type="button"
                onClick={() => setView("catalog")}
                style={{
                  backgroundColor: palette.bgCard,
                  color: palette.textMain,
                  border: `1px solid ${palette.border}`,
                  borderRadius: "10px",
                  padding: "8px 12px",
                  fontSize: "13px",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                {t.backToCatalog}
              </button>
            </div>

            {cart.length === 0 ? (
              <div style={{ padding: "36px 16px", textAlign: "center" }}>
                <h3 style={{ fontSize: "16px", fontWeight: 700 }}>{t.emptyTitle}</h3>
              </div>
            ) : (
              <>
                {cart.map((entry) => {
                  const prod = PRODUCTS.find((p) => p.id === entry.productId);
                  if (!prod) return null;
                  const lineTotal = prod.price * entry.qty;
                  return (
                    <div
                      key={entry.productId}
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: "14px",
                        backgroundColor: palette.bgCard,
                        border: `1px solid ${palette.border}`,
                        borderRadius: "14px",
                        padding: "12px 16px",
                        marginBottom: "12px",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                        <img
                          src={prod.image}
                          alt={prod.name}
                          onClick={() => openProductModal(prod.id)}
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = prod.fallbackImage;
                          }}
                          style={{
                            display: "block",
                            width: "64px",
                            height: "64px",
                            borderRadius: "10px",
                            objectFit: "cover",
                            border: `1px solid ${palette.border}`,
                            cursor: "pointer",
                            flexShrink: 0,
                          }}
                        />
                        <div>
                          <div style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", color: palette.textMuted }}>
                            {prod.brand}
                          </div>
                          <strong onClick={() => openProductModal(prod.id)} style={{ fontSize: "14px", cursor: "pointer" }}>
                            {prod.name}
                          </strong>
                          <div style={{ fontSize: "12px", color: palette.textMuted }}>
                            ${prod.price} × {entry.qty}
                          </div>
                        </div>
                      </div>

                      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "12px" }}>
                        <div
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "8px",
                            backgroundColor: palette.bgSubtle,
                            border: `1px solid ${palette.border}`,
                            borderRadius: "9px",
                            padding: "4px 8px",
                          }}
                        >
                          <button
                            type="button"
                            aria-label="Decrease quantity"
                            onClick={() => updateCartQty(prod.id, -1)}
                            style={{
                              width: "24px",
                              height: "24px",
                              borderRadius: "6px",
                              border: `1px solid ${palette.border}`,
                              backgroundColor: palette.bgCard,
                              color: palette.textMain,
                              fontWeight: 800,
                              cursor: "pointer",
                            }}
                          >
                            −
                          </button>
                          <span style={{ minWidth: "18px", textAlign: "center", fontWeight: 700 }}>
                            {entry.qty}
                          </span>
                          <button
                            type="button"
                            aria-label="Increase quantity"
                            onClick={() => updateCartQty(prod.id, 1)}
                            style={{
                              width: "24px",
                              height: "24px",
                              borderRadius: "6px",
                              border: `1px solid ${palette.border}`,
                              backgroundColor: palette.bgCard,
                              color: palette.textMain,
                              fontWeight: 800,
                              cursor: "pointer",
                            }}
                          >
                            +
                          </button>
                        </div>
                        <strong style={{ minWidth: "64px", textAlign: "right" }}>${lineTotal}</strong>
                      </div>
                    </div>
                  );
                })}

                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "12px",
                    marginTop: "16px",
                  }}
                >
                  <div style={{ fontSize: "18px", fontWeight: 800 }}>
                    {t.cartTotal} ${cartTotalSum}
                  </div>
                  <button type="button" onClick={handleCheckoutCart} style={{ ...primaryBtnStyle, padding: "10px 16px" }}>
                    {t.checkoutBtn}
                  </button>
                </div>
              </>
            )}
          </section>
        )}

        {/* Модальное окно товара */}
        {activeModalProduct && (
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="jsx-modal-title"
            onClick={closeProductModal}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 50,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "rgba(0, 0, 0, 0.7)",
              padding: "18px",
              boxSizing: "border-box",
            }}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                position: "relative",
                width: "100%",
                maxWidth: "860px",
                maxHeight: "92vh",
                overflowY: "auto",
                backgroundColor: palette.bgSurface,
                color: palette.textMain,
                border: `1px solid ${palette.border}`,
                borderRadius: "20px",
                padding: "22px",
                boxSizing: "border-box",
              }}
            >
              <button
                type="button"
                aria-label="Close modal"
                onClick={closeProductModal}
                style={{
                  float: "right",
                  width: "36px",
                  height: "36px",
                  borderRadius: "999px",
                  border: `1px solid ${palette.border}`,
                  backgroundColor: palette.bgCard,
                  color: palette.textMain,
                  fontSize: "18px",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                ✕
              </button>

              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "24px",
                  marginTop: "8px",
                }}
              >
                <div style={{ flex: "0 0 320px", maxWidth: "100%" }}>
                  <div
                    style={{
                      width: "100%",
                      height: "320px",
                      borderRadius: "16px",
                      border: `1px solid ${palette.border}`,
                      backgroundColor: palette.bgSubtle,
                      overflow: "hidden",
                    }}
                  >
                    <img
                      src={activeModalProduct.image}
                      alt={activeModalProduct.name}
                      onClick={() => setModalZoomed((prev) => !prev)}
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = activeModalProduct.fallbackImage;
                      }}
                      style={{
                        display: "block",
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        transform: modalZoomed ? "scale(1.25)" : "scale(1)",
                        transition: "transform 0.2s ease",
                        cursor: modalZoomed ? "zoom-out" : "zoom-in",
                      }}
                    />
                  </div>
                  <p style={{ marginTop: "8px", textAlign: "center", fontSize: "11px", color: palette.textMuted }}>
                    {t.modalZoomHint}
                  </p>
                </div>

                <div style={{ flex: "1 1 340px", minWidth: "240px" }}>
                  <div style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", color: palette.textMuted }}>
                    {activeModalProduct.brand} • {activeModalProduct.category.toUpperCase()}
                  </div>
                  <h2 id="jsx-modal-title" style={{ margin: "4px 0 8px", fontSize: "22px", fontWeight: 800 }}>
                    {activeModalProduct.name}
                  </h2>
                  <div style={{ fontSize: "12px", color: palette.textMuted }}>
                    {t.ratingLabel}{" "}
                    <strong style={{ color: palette.textMain }}>
                      ★ {activeModalProduct.rating.toFixed(1)}
                    </strong>{" "}
                    ({activeModalProduct.reviews} {t.reviews}) • ✓ LUMEL1 ORIGINAL
                  </div>

                  <div
                    style={{
                      margin: "12px 0",
                      padding: "12px",
                      borderRadius: "12px",
                      border: `1px solid ${palette.border}`,
                      backgroundColor: palette.bgCard,
                      fontSize: "12px",
                      lineHeight: 1.5,
                    }}
                  >
                    <strong style={{ display: "block", marginBottom: "4px" }}>{t.descriptionLabel}</strong>
                    <span style={{ color: palette.textMuted }}>{activeModalProduct.description}</span>
                  </div>

                  <div style={{ marginBottom: "12px" }}>
                    <div style={{ fontSize: "12px", fontWeight: 700, marginBottom: "6px" }}>{t.colorsLeftLabel}</div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                      {activeModalProduct.colorsLeft.map((colorObj) => {
                        const isSelected = selectedColor === colorObj.name;
                        return (
                          <button
                            key={colorObj.name}
                            type="button"
                            onClick={() => setSelectedColor(colorObj.name)}
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "6px",
                              borderRadius: "8px",
                              padding: "6px 10px",
                              fontSize: "12px",
                              fontWeight: 700,
                              cursor: "pointer",
                              backgroundColor: isSelected ? palette.accent : palette.bgCard,
                              color: isSelected ? "#ffffff" : palette.textMain,
                              border: `1px solid ${isSelected ? palette.accent : palette.border}`,
                            }}
                          >
                            <span
                              style={{
                                width: "12px",
                                height: "12px",
                                borderRadius: "999px",
                                backgroundColor: COLOR_SWATCHES[colorObj.name] || "#b82946",
                                border: "1px solid rgba(255,255,255,0.5)",
                              }}
                            />
                            <span>{colorObj.name}</span>
                            <span style={{ opacity: 0.85 }}>
                              ({colorObj.left} {t.leftShort})
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div style={{ marginBottom: "12px" }}>
                    <div style={{ fontSize: "12px", fontWeight: 700, marginBottom: "6px" }}>{t.sizesLabel}</div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                      {activeModalProduct.sizes.map((sz) => {
                        const isSizeSelected = selectedSize === sz;
                        return (
                          <button
                            key={sz}
                            type="button"
                            onClick={() => setSelectedSize(sz)}
                            style={{
                              borderRadius: "8px",
                              padding: "6px 12px",
                              fontSize: "12px",
                              fontWeight: 700,
                              cursor: "pointer",
                              backgroundColor: isSizeSelected ? palette.accent : palette.bgCard,
                              color: isSizeSelected ? "#ffffff" : palette.textMain,
                              border: `1px solid ${isSizeSelected ? palette.accent : palette.border}`,
                            }}
                          >
                            {sz}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div style={{ display: "flex", alignItems: "baseline", gap: "10px", margin: "12px 0" }}>
                    <span style={{ fontSize: "24px", fontWeight: 800 }}>${activeModalProduct.price}</span>
                    <span style={{ fontSize: "14px", color: palette.textMuted, textDecoration: "line-through" }}>
                      ${activeModalProduct.oldPrice}
                    </span>
                    <span
                      style={{
                        backgroundColor: "rgba(255,255,255,0.95)",
                        color: "#15803d",
                        borderRadius: "6px",
                        padding: "3px 8px",
                        fontSize: "10px",
                        fontWeight: 800,
                      }}
                    >
                      ✓ ORIGINAL
                    </span>
                  </div>

                  <div style={{ fontSize: "12px", fontWeight: 700 }}>{t.modalInstallment}</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", margin: "10px 0" }}>
                    {[3, 6, 12].map((m) => {
                      const activePlan = installmentMonths === m;
                      return (
                        <button
                          key={m}
                          type="button"
                          onClick={() => setInstallmentMonths(m)}
                          style={{
                            borderRadius: "8px",
                            padding: "6px 10px",
                            fontSize: "12px",
                            fontWeight: 700,
                            cursor: "pointer",
                            backgroundColor: activePlan ? palette.uzumYellow : palette.bgCard,
                            color: activePlan ? "#190409" : palette.textMain,
                            border: `1px solid ${activePlan ? "#d4c11c" : palette.border}`,
                          }}
                        >
                          {m} мес • ${Math.max(1, Math.ceil(activeModalProduct.price / m))}/мес
                        </button>
                      );
                    })}
                  </div>

                  <div
                    style={{
                      marginBottom: "14px",
                      padding: "10px 12px",
                      borderRadius: "12px",
                      border: `1px solid ${palette.border}`,
                      backgroundColor: palette.bgCard,
                      fontSize: "12px",
                    }}
                  >
                    <strong>{t.modalPickupInfo}</strong> {pickup || profile.pickupPoint}
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
                    <span style={{ fontSize: "12px", fontWeight: 700 }}>Кол-во:</span>
                    <div
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "8px",
                        backgroundColor: palette.bgSubtle,
                        border: `1px solid ${palette.border}`,
                        borderRadius: "9px",
                        padding: "4px 8px",
                      }}
                    >
                      <button
                        type="button"
                        aria-label="Decrease quantity"
                        onClick={() => setModalQty((q) => Math.max(1, q - 1))}
                        style={{
                          width: "24px",
                          height: "24px",
                          borderRadius: "6px",
                          border: `1px solid ${palette.border}`,
                          backgroundColor: palette.bgCard,
                          color: palette.textMain,
                          fontWeight: 800,
                          cursor: "pointer",
                        }}
                      >
                        −
                      </button>
                      <span style={{ minWidth: "20px", textAlign: "center", fontWeight: 700 }}>{modalQty}</span>
                      <button
                        type="button"
                        aria-label="Increase quantity"
                        onClick={() => setModalQty((q) => Math.min(20, q + 1))}
                        style={{
                          width: "24px",
                          height: "24px",
                          borderRadius: "6px",
                          border: `1px solid ${palette.border}`,
                          backgroundColor: palette.bgCard,
                          color: palette.textMain,
                          fontWeight: 800,
                          cursor: "pointer",
                        }}
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "16px" }}>
                    <button type="button" onClick={() => addToCart(activeModalProduct.id, modalQty)} style={secondaryBtnStyle}>
                      {t.inCart}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        createInstantOrder(activeModalProduct.id, modalQty);
                        closeProductModal();
                      }}
                      style={primaryBtnStyle}
                    >
                      {t.orderNow} ($
                      {Math.max(1, Math.ceil(activeModalProduct.price / installmentMonths))}/мес)
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleWishlist(activeModalProduct.id)}
                      style={{
                        width: "38px",
                        height: "36px",
                        borderRadius: "10px",
                        display: "grid",
                        placeItems: "center",
                        fontSize: "16px",
                        fontWeight: 700,
                        cursor: "pointer",
                        backgroundColor: wishlist.includes(activeModalProduct.id) ? palette.accent : palette.bgCard,
                        color: wishlist.includes(activeModalProduct.id) ? "#ffffff" : palette.accent,
                        border: `1px solid ${wishlist.includes(activeModalProduct.id) ? palette.accent : palette.border}`,
                      }}
                    >
                      {wishlist.includes(activeModalProduct.id) ? "♥" : "♡"}
                    </button>
                  </div>

                  <div style={{ borderTop: `1px solid ${palette.border}`, paddingTop: "12px" }}>
                    <div style={{ fontSize: "13px", fontWeight: 700, marginBottom: "6px" }}>{t.modalReviewsTitle}</div>
                    <p style={{ margin: "0 0 6px", fontSize: "12px", color: palette.textMuted }}>
                      {t.modalSampleReview1}
                    </p>
                    <p style={{ margin: 0, fontSize: "12px", color: palette.textMuted }}>
                      {t.modalSampleReview2}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

```
