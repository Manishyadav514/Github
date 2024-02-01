export const ORGANIZATION_SCHEMA: any = {
  mgp: {
    "@context": "http://www.schema.org",
    "@type": "Organization",
    name: "MyGlamm",
    url: "https://www.myglamm.com/",
    sameAs: [
      "https://www.facebook.com/myGlamm/",
      "https://www.instagram.com/myglamm/",
      "https://twitter.com/myglamm",
      "https://www.youtube.com/channel/UCrUxV9rsE-ivYxrgwkQhrjQ",
    ],
    logo: "https://files.myglamm.com/images/static/myglamm-logo.png",
    description:
      "Buy Makeup & Cosmetics Products from international makeup brand MyGlamm, official online beauty store in India. Shop Manish Malhotra Makeup and our wide range of Makeup products and kits for face, lips, eyes & nails.",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Unit 101, DTC Building, N M Joshi Marg, Lower Parel, Mumbai",
      postOfficeBoxNumber: "400011",
      addressLocality: "Mumbai",
      addressRegion: "Maharashtra",
      postalCode: "400011",
      addressCountry: "India",
    },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer support",
      telephone: "[+91-22-4891-3663]",
      email: "hello@myglamm.com",
      hoursAvailable: "Mo 10:00-19:00 Tu 10:00-19:00 We 10:00-19:00 Th 10:00-19:00 Fr 10:00-19:00",
    },
    email: "hello@myglamm.com",
    brand: [
      {
        "@type": "Brand",
        name: "MyGlamm",
        description: "Our makeup stays with you - no smudges, no transfers, no fuss - all day long! Live Glamorous.",
        url: "https://www.myglamm.com/collection/myglamm",
      },
      {
        "@type": "Brand",
        name: "GLOW: Iridescent Brightening Skincare",
        description:
          "Infused with Rosehip Oil Vitamin Elixir to illuminate and hydrate the skin, providing a radiant, healthy-looking glow.",
        url: "https://www.myglamm.com/collection/glow-iridescent-brightening-skincare",
      },
      {
        "@type": "Brand",
        name: "Manish Malhotra",
        description: "Matte, metallic and foil finishes. Hi-shine, glossy textures. Unapologetic glamour!",
        url: "https://www.myglamm.com/collection/manish-malhotra",
      },
      {
        "@type": "Brand",
        name: "LIT Collection",
        description:
          "Tried and tested on our favourite human, Sidharth Malhotra. Statement making, cruelty-free makeup that’s on fleek!",
        url: "https://www.myglamm.com/collection/lit-collection",
      },
      {
        "@type": "Brand",
        name: "POSE Camera Ready HD Makeup",
        description:
          "Presenting POSE, a collection of high definition makeup designed to make you look good on camera – whenever, wherever.",
        url: "https://www.myglamm.com/collection/camera-ready-hd-makeup",
      },
      {
        "@type": "Brand",
        name: "K.Play Flavoured Makeup",
        description:
          "High on flavour, it infuses the goodness of nature’s best skin-enhancing ingredients to help you and your skin look good.",
        url: "https://www.myglamm.com/collection/kplay-flavoured-makeup",
      },
    ],
  },

  stb: {
    "@context": "http://schema.org",
    "@type": "Organization",
    name: "St.Botanica",
    url: "https://www.stbotanica.com/",
    logo: "https://www.stbotanica.com/images/stblogo2.png",
    skinAnalyzerMetaTitle: "Free Skin Analysis Online Like An Expert - St.Botanica",
    skinAnalyzerMetaDescription:
      "Get free skin analysis online in 3 simple steps. You’ll receive AI based skin assessment along with product recommendations for your skin health.",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Plot No 70, Godrej Eternia, Regus Harmony Tower A, Level 4, Industrial Area Phase-1",
      addressLocality: "Chandigarh",
      addressRegion: "CH",
      postalCode: "160002",
      addressCountry: "IND",
    },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "Customer Support",
      telephone: "022-48914525",
      email: "hello@stbotanica.com",
      hoursAvailable: "Monday to Saturday (9:30 a.m. to 6:30 p.m.)",
    },
    sameAs: [
      "https://www.facebook.com/stbotanicaindia/",
      "https://www.instagram.com/stbotanica/",
      "https://www.youtube.com/c/StBotanica",
    ],
  },

  orh: {
    "@context": "http://schema.org",
    "@type": "WebSite",
    name: "Organic Harvest",
    url: "https://www.organicharvest.in/",
    skinAnalyzerMetaTitle: "Skin Analyzer - Get Free Skin Analysis Online in India - Organic Harvest",
    skinAnalyzerMetaDescription:
      "Get free skin analysis online in 3 simple steps. Benefit from an AI-based skin analyzer and personalized product recommendations tailored to your skin's well-being.",
  },
};

export const WEBSITE_SCHEMA: any = {
  mgp: {
    "@context": "http://schema.org",
    "@type": "WebSite",
    name: "My Glamm",
    url: "https://www.myglamm.com/",
  },
  tmc: {
    "@context": "http://schema.org",
    "@type": "WebSite",
    name: "The Moms Co.",
    url: "https://themomsco.com/",
  },
  orh: {
    "@context": "http://schema.org",
    "@type": "WebSite",
    name: "Organic Harvest",
    url: "https://www.organicharvest.in/",
  },
  stb: {
    "@context": "http://schema.org",
    "@type": "WebSite",
    name: "St.Botanica",
    url: "https://www.stbotanica.com/",
  },
  srn: {
    "@context": "http://schema.org",
    "@type": "WebSite",
    name: "Sirona",
    url: "https://www.thesirona.com/",
  },
  bbc: {
    "@context": "http://schema.org",
    "@type": "WebSite",
    name: "Baby Chakra",
    url: "https://www.babychakra.com/",
  },
};

export const SEARCHBOX_SCHEMA: any = {
  mgp: {
    "@context": "http://schema.org",
    "@type": "WebSite",
    url: "https://www.myglamm.com/",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://www.myglamm.com/search?q={search_term_string}&tab=PRODUCTS",
      "query-input": "required name=search_term_string",
    },
  },
  tmc: {
    "@context": "http://schema.org",
    "@type": "WebSite",
    url: "https://themomsco.com/",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://themomsco.com/search?q={search_term_string}&tab=PRODUCTS",
      "query-input": "required name=search_term_string",
    },
  },
  orh: {
    "@context": "http://schema.org",
    "@type": "WebSite",
    url: "https://www.organicharvest.in/",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://www.organicharvest.in/search?q={search_term_string}&tab=PRODUCTS",
      "query-input": "required name=search_term_string",
    },
  },
  stb: {
    "@context": "http://schema.org",
    "@type": "WebSite",
    url: "https://www.stbotanica.com/",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://www.stbotanica.com/search?q={search_term_string}&tab=PRODUCTS",
      "query-input": "required name=search_term_string",
    },
  },
  srn: {
    "@context": "http://schema.org",
    "@type": "WebSite",
    url: "https://www.thesirona.com/",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://www.thesirona.com/search?q={search_term_string}&tab=PRODUCTS",
      "query-input": "required name=search_term_string",
    },
  },
  bbc: {},
};
