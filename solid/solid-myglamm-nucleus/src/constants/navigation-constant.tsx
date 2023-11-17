export const sidebarMenu = [
  { name: "Dashboard", icon: "mdi-light:home", routerLink: "/dashboard" },
  {
    name: "Members",
    icon: "teenyicons:user-outline",
    routerLink: "/members"
  },
  {
    name: "Parties",
    icon: "lucide:party-popper",
    nestedMenu: [
      {
        name: "Party Theme",
        routerLink: "/party-theme"
      }
    ]
  },
  {
    name: "Good Points Burn",
    icon: "clarity:flame-line",
    nestedMenu: [
      {
        name: "Rewards Master",
        routerLink: "/rewards-master"
      },
      { name: "Popular Rewards ", routerLink: "/popular-rewards" },
      { name: "Rewards By Brands", routerLink: "/rewards-by-brands" },
      {
        name: "Rewards Redemption",
        routerLink: "/rewards-redemption"
      }
    ]
  },
  {
    name: "Good Points Earn",
    icon: "mdi:hand-coin-outline",
    nestedMenu: [
      { name: "Earn items", routerLink: "earn-items" },
      { name: "Earn By Brands", routerLink: "earn-by-brands" }
    ]
  },
  {
    name: "Good Points ",
    icon: "mdi:coupon-outline",
    routerLink: "/goodpoints"
  },
  {
    name: "Product List",
    icon: "eos-icons:product-subscriptions-outlined",
    nestedMenu: [
      { name: "Products", routerLink: "products" },
      { name: "Bundled Products", routerLink: "bundled-products" },
      { name: "Categories", routerLink: "categories" },
      { name: "Collections", routerLink: "collections" },
      { name: "Brands", routerLink: "brands" }
    ]
  },
  {
    name: "Content Manager",
    icon: "gridicons:pages",
    nestedMenu: [
      { name: "Page Category", routerLink: "page-category" },
      { name: "Pages", routerLink: "pages" },
      { name: "Moderate Pages", routerLink: "moderate-pages" },
      { name: "Moderate Questions", routerLink: "moderate-questions" },
      { name: "Moderate Polls", routerLink: "moderate-polls" },
      { name: "Moderate Posts", routerLink: "moderate-posts" },
      { name: "Navigation", routerLink: "navigation" },
      { name: "Widget Group", routerLink: "widgets" },
      { name: "myglammQUICKIES", routerLink: "myglammQUICKIES" },
      { name: "Ask me Everything", routerLink: "ask-me-anything" }
    ]
  },
  {
    name: "Community",
    icon: "material-symbols:cycle",
    nestedMenu: [
      { name: "Topics", routerLink: "topics" },
      { name: "Feed", routerLink: "community-feed" },
      { name: "Moderation", routerLink: "moderation" },
      { name: "Poll", routerLink: "community-poll" },
      { name: "Contest", routerLink: "ommunity-contest" }
    ]
  },
  {
    name: "Link Builder",
    icon: "ph:link-simple-bold",
    routerLink: "/link-builder"
  },
  {
    name: "Lookbook",
    icon: "material-symbols:list-alt-outline-sharp",
    nestedMenu: [
      { name: "Lookbook List", routerLink: "look" },
      { name: "Lookbook Categories", routerLink: "look-categories" }
    ]
  },
  {
    name: "Orders",
    icon: "material-symbols:shopping-cart-outline",
    routerLink: "/order"
  },
  {
    name: "Store Manager",
    icon: "bx:store-alt",
    routerLink: "/stores"
  },
  {
    name: "Customer Reviews",
    icon: "mdi:user-group-outline",
    routerLink: "/customer-reviews"
  },
  {
    name: "Warehouse Manager",
    icon: "tabler:building-warehouse",
    routerLink: "warehouse"
  },
  {
    name: "Retail Investory",
    icon: "fluent:building-retail-money-24-regular",
    routerLink: "retail-inventory"
  },

  {
    name: "Offers",
    icon: "mdi:discount-box-outline",
    nestedMenu: [
      { name: "Offers Categories", routerLink: "offer-categories" },
      { name: "Offers List", routerLink: "offers" }
    ]
  },
  {
    name: "Discounts",
    icon: "bxs:offer",
    nestedMenu: [
      { name: "Coupon Code", routerLink: "discountsCoupon" },
      { name: "Bulk Subsription", routerLink: "bulk-discount" },
      { name: "Product Discount", routerLink: "product-discounts" },
      { name: "Subscription Discount", routerLink: "subscription-discount" },
      { name: "Cart Discount", routerLink: "cart-discounts" },
      { name: "Upsell Rules", routerLink: "upsell-rules" }
    ]
  },
  {
    name: "Access Control List",
    icon: "mingcute:key-1-line",
    nestedMenu: [
      { name: "Users", routerLink: "acl-users" },
      { name: "Rules", routerLink: "roles" },
      { name: "Endpoints", routerLink: "acl-endpoints" },
      { name: "Microservices", routerLink: "acl-microservices" }
    ]
  },
  {
    name: "QR Code",
    icon: "ci:qr-code",
    routerLink: "/qr-code"
  },
  {
    name: "Skin Analyzer",
    icon: "mdi:scan",
    nestedMenu: [
      { name: "Product", routerLink: "skin-analyser-product" },
      { name: "Bundled Product", routerLink: "skin-analyser-bundle-product" }
    ]
  },
  {
    name: "Utility",
    icon: "ic:outline-image",
    nestedMenu: [{ name: "Upload Image", routerLink: "upload-image" }]
  },
  {
    name: "Survey",
    icon: "fluent:text-bullet-list-square-edit-24-regular",
    routerLink: "/survey"
  },
  {
    name: "Settings",
    icon: "ep:setting",
    nestedMenu: [
      { name: "Tax Groups", routerLink: "" },
      { name: "Tag Manager", routerLink: "/tag-manager" },
      { name: "Chat Manager", routerLink: "" },
      { name: "Cron Manager", routerLink: "" },
      { name: "Sync Product", routerLink: "" },
      { name: "Mail Templates", routerLink: "/mail-templates" },
      { name: "FAQ", routerLink: "" },
      { name: "Sticker", routerLink: "" },
      { name: "Purge", routerLink: "" },
      { name: "Gamification", routerLink: "" },
      { name: "Logger", routerLink: "" },
      { name: "Sub Parameter Reviews", routerLink: "" },
      { name: "URL Redirection", routerLink: "" },
      { name: "Shipping Charges", routerLink: "" }
    ]
  }
];
