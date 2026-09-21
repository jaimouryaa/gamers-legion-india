// Central site configuration — avoids hard-coding marketing copy/numbers in
// multiple components. In a later iteration these could move into a
// `site_settings` Supabase table and be editable from /admin.

export const SITE = {
  name: "Gamers Legion India",
  tagline: "Your next game starts here.",
  description:
    "Discover the latest games, exclusive deals, and gaming bundles built for India's gaming community.",
};

export const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Games", href: "/games" },
  { label: "Deals", href: "/deals" },
  { label: "Bundles", href: "/bundles" },
  { label: "Proof", href: "/proof" },
  { label: "About", href: "/about" },
];

export const HERO_STATS = [
  { label: "Games Available", value: "1,200+", icon: "gamepad" as const },
  { label: "Active Deals", value: "500+", icon: "tag" as const },
  { label: "Happy Gamers", value: "50,000+", icon: "users" as const },
  { label: "Secure & Trusted", value: "100%", icon: "shield" as const },
];

export const FEATURE_STRIP = [
  {
    title: "Instant Delivery",
    description: "Get your games instantly after purchase.",
    icon: "zap" as const,
  },
  {
    title: "Secure Checkout",
    description: "Confirm your order directly over WhatsApp.",
    icon: "lock" as const,
  },
  {
    title: "Verified Game Keys",
    description: "100% trusted and verified listings.",
    icon: "badge-check" as const,
  },
  {
    title: "Best Price Deals",
    description: "More games. Less money.",
    icon: "trending-down" as const,
  },
];

export const PROMOTION = {
  title: "SEPTEMBER SALE",
  subtitle: "UP TO 70% OFF",
  description: "Across action, RPG and open-world favourites — for a limited time only.",
  ctaLabel: "Shop the sale",
  ctaHref: "/deals",
};

export const FOOTER = {
  description:
    "India's home for great games, honest deals and bundles worth talking about.",
  navigation: [
    { label: "Home", href: "/" },
    { label: "Games", href: "/games" },
    { label: "Deals", href: "/deals" },
    { label: "Bundles", href: "/bundles" },
    { label: "About", href: "/about" },
  ],
  support: [
    { label: "Contact", href: "/contact" },
    { label: "Support", href: "/support" },
    { label: "FAQ", href: "/faq" },
    { label: "Proof & Activation", href: "/proof" },
  ],
  legal: [
    { label: "Terms", href: "/terms" },
    { label: "Privacy", href: "/privacy" },
    { label: "Refund Policy", href: "/refund-policy" },
  ],
  social: [
    { label: "Instagram", href: "https://www.instagram.com/gamerss_legion_india/" },
  ],
};

export const CONNECT = {
  instagram: "https://www.instagram.com/gamerss_legion_india/",
};

export const ACTIVATION_GUIDES = [
  {
    platform: "PC",
    matches: ["PC"],
    title: "Steam / PC",
    note: "Bought through Epic Games instead of Steam? The redemption steps are similar — look for \"Redeem Code\" under your account menu in the Epic Games launcher.",
    steps: [
      "Open the Steam client and sign in to your account.",
      "Click the \"+ Add a Game\" button at the bottom-left of your Library.",
      "Choose \"Activate a Product on Steam...\" and accept the agreement.",
      "Enter the key exactly as sent to you on WhatsApp, then click Next.",
      "The game installs straight to your Library — no further steps needed.",
    ],
  },
  {
    platform: "PlayStation",
    matches: ["PlayStation"],
    title: "PlayStation Store",
    steps: [
      "On your console, open the PlayStation Store.",
      "Scroll down and select \"Redeem Codes\" (or find it under your profile menu).",
      "Enter the code exactly as sent, then confirm.",
      "The game downloads to your console automatically.",
    ],
  },
  {
    platform: "Xbox",
    matches: ["Xbox"],
    title: "Xbox",
    steps: [
      "On your console or the Xbox app, open the Microsoft Store.",
      "Search \"Redeem\" or go to your profile > Redeem a code.",
      "Enter the code exactly as sent, then confirm.",
      "The game will be added to your library and can be installed from there.",
    ],
  },
  {
    platform: "Nintendo Switch",
    matches: ["Nintendo Switch"],
    title: "Nintendo Switch",
    steps: [
      "From the HOME Menu, select the Nintendo eShop icon.",
      "Scroll down and select \"Enter Code\".",
      "Enter the code exactly as sent, then confirm your purchase.",
      "The game will begin downloading to your console.",
    ],
  },
] as const;

export const GENRE_FILTERS = [
  "All",
  "Action",
  "RPG",
  "Adventure",
  "Indie",
  "Strategy",
  "Racing",
  "Simulation",
  "Sports",
  "Horror",
] as const;

export const SORT_OPTIONS = [
  { value: "featured", label: "Featured" },
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "discount", label: "Highest Discount" },
  { value: "rating", label: "Highest Rated" },
  { value: "ending-soon", label: "Ending Soon" },
] as const;

export type SortOption = (typeof SORT_OPTIONS)[number]["value"];
