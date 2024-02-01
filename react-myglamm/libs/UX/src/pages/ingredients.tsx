import React, { useState } from "react";

import { INGREDIENTS_STYLES } from "@libStyles/TSStyles/ingredientsStyle";

const Ingredients = () => {
  /**Ingredients JSON data*/
  const ingredientsJSON = [
    {
      "A - C": [
        {
          label: "Acai Berries",
          description:
            "Acai berries with their loaded antioxidant content are extremely effective anti-ageing agents. They repair damaged skin cells, retain and restore moisture and control hyperpigmentation.",
          imageURL: "https://files.organicharvest.in/site-images/original/oh-ingredients-acaiberries.jpg",
          buttonLinkURL: "/collection/acai-berries",
        },
        {
          label: "Aloe Vera",
          description:
            "Aloe Vera contains enzymes, antioxidants, vitamins A and C which can treat burns, acne, dry skin, and many other skin problems. It has cooling properties hence; it is used for small abrasions, cuts, eczema, and inflammatory acne.",
          imageURL: "https://files.organicharvest.in/site-images/original/aloe-vera.png",
          buttonLinkURL: "/collection/aloe-vera",
        },
        {
          label: "Apple Cider Vinegar",
          description:
            "ACV is a known anti-inflammatory, and can prevent bacteria growth on the scalp, as well as the population of dandruff. It also helps in restoring shine to hair and reducing dryness, making them less frizzy.",
          imageURL: "https://files.organicharvest.in/site-images/original/apple-ing.png",
          buttonLinkURL: "/collection/apple-cider-vinegar",
        },
        {
          label: "Argan",
          description:
            "Argan oil is made from the kernels that grow on the argan trees native to Morocco. It has traditionally been used both topically and orally to improve the health of skin, hair, and nails. It contains a number of different beneficial properties and vitamins that form a powerful combination to boost skin health.",
          imageURL: "https://files.organicharvest.in/site-images/original/agran-oil-copy_1.jpg",
          buttonLinkURL: "/collection/argan",
        },
        {
          label: "Avocado",
          description:
            "Avocados are a rich source of vitamin C and E. They help reduce the effects of UVA and UVB radiation because they contain antioxidants that can neutralise the effects of free radicals that are caused by sun’s rays. They also help reduce the appearance of wrinkles.",
          imageURL: "https://files.organicharvest.in/site-images/original/oh-ingredients-avacado.jpg",
          buttonLinkURL: "/collection/avocado",
        },
        {
          label: "Banana",
          description:
            "Bananas are rich in potassium, natural oils, carbohydrates and vitamins, which help soften our hair and protect their natural elasticity. It is also known to prevent and control dandruff, and moisturise our scalp.",
          imageURL: "https://files.organicharvest.in/site-images/original/banana-in.png",
          buttonLinkURL: "/collection/banana",
        },
        {
          label: "Basil",
          description:
            "Basil oil is widely used to prevent hair loss and soothe an itchy scalp. Its antibacterial and antifungal nature helps to heal scalp infections.",
          imageURL: "https://files.organicharvest.in/site-images/original/basil.jpg",
          buttonLinkURL: "/collection/basil",
        },
        {
          label: "Bearberry",
          description:
            "Bearberry contains an active agent called arbutin, a natural skin brightener that can help reduce pigmentation and lighten skin tone.",
          imageURL: "https://files.organicharvest.in/site-images/original/bearberry.jpg",
          buttonLinkURL: "/collection/bearberry",
        },
        {
          label: "Beetroot",
          description:
            "Beetroot is rich in antioxidants, vitamin A, C and folic acid, all of which help promote healthy hair. It speeds up hair growth and its detoxifying properties keep your scalp clean and nourished.",
          imageURL: "https://files.organicharvest.in/site-images/original/beetroot.jpg",
          buttonLinkURL: "/collection/beetroot",
        },

        {
          label: "Broccoli",
          description:
            "Broccoli is full of vitamins and minerals, like zinc, Vitamin A, and C, which are important for skin health. It also contains lutein, which protects your skin from oxidative damage, which can cause your skin to become dry and wrinkled.",
          imageURL: "https://files.organicharvest.in/site-images/original/broccoli_1.png",
          buttonLinkURL: "/collection/broccoli",
        },
        {
          label: "Caffeine",
          description:
            "Caffeine is rich in antioxidants that block possible cause of cell damage and reduces transepidermal water loss (TDWL or TWL) and stimulate healthy cell production. The nutrient properties of caffeine strengthen hair shafts and thus add extra shine.",
          imageURL: "https://files.organicharvest.in/site-images/original/caffeine.png",
          buttonLinkURL: "/collection/caffeine",
        },
        {
          label: "Castor",
          description:
            "Castor is a plant that produces seeds (beans). Castor oil is produced by pressing ripe seeds that have had their outer covering (hull) removed. The hull contains a deadly poison called ricin. It has antibacterial properties which is good for skin and hair problems. It also helps to reduce weight and can be used as an aromatherapy oil.",
          imageURL: "https://files.organicharvest.in/site-images/original/castor-oil-copy_2.jpg",
          buttonLinkURL: "/collection/castor",
        },
        {
          label: "Clary sage",
          description:
            "Clary sage oil is extremely helpful for a dry scalp; it tames the frizz and keeps it manageable. It assists in hair growth and also helps control dandruff.",
          imageURL: "https://files.organicharvest.in/site-images/original/sage.jpg",
          buttonLinkURL: "",
        },
        {
          label: "Coconut Oil",
          description:
            "Apart from its immense hydrating properties, coconut oil is also used to treat dark spots and pigmentation. In fact, it can lighten the skin just like a lemon can.",
          imageURL: "https://files.organicharvest.in/site-images/original/oh-ingredients-coconut-oil.jpg",
          buttonLinkURL: "/collection/coconut-oil",
        },
        {
          label: "Cucumber",
          description:
            "Cucumber contains vitamin C and caffeic acid that help cool the skin and combat irritation, inflammation and redness. Being high in water content, it gives the skin a healthy glow.",
          imageURL: "https://files.organicharvest.in/site-images/original/oh-ingredients-cucumber.jpg",
          buttonLinkURL: "/collection/cucumber",
        },
      ],
    },
    {
      "D - F": [
        {
          label: "Daisy Flower",
          description:
            "Daisy flower extract is antiseptic in nature and hence, it removes bacteria from the surface of the skin. It is used to brighten skin and prevent hyperpigmentation.",
          imageURL: "https://files.organicharvest.in/site-images/original/oh-ingredients-daisyflower.jpg",
          buttonLinkURL: "/collection/daisy-flower",
        },
        {
          label: "Eucalyptus",
          description:
            "Eucalyptus oil when used on the hair, stimulates blood follicles and accelerates hair growth. It improves the health of your hair and makes it shiny, lustrous and thick.",
          imageURL: "https://files.organicharvest.in/site-images/original/eucalyptus.jpg",
          buttonLinkURL: "/collection/eucalyptus",
        },
        {
          label: "Evening Primrose",
          description:
            "Evening primrose is a plant that's native to Europe and North America. The seeds of evening primose which are high in fatty acids (Omega - 6), which helps in treating inflammation, reducing the pain related with premenstrual stress syndrome and helps in some skin diseases, etc.",
          imageURL: "https://files.organicharvest.in/site-images/original/evening-primrose-copy_1.jpg",
          buttonLinkURL: "/collection/evening-primrose",
        },
        {
          label: "Figs",
          description:
            "Figs are rich in omega-6 which nourishes the skin. They are also rich in antioxidants that help fight the signs of ageing. The anti-inflammatory compounds found in figs help to reduce redness.",
          imageURL: "https://files.organicharvest.in/site-images/original/fig-new.png",
          buttonLinkURL: "/collection/figs",
        },
      ],
    },
    {
      "G - I": [
        {
          label: "Geranium",
          description:
            "Geranium flower oil regulates the secretion of sebum in your scalp and balances the oil content. The oil balancing property of geranium oil makes it a great option for both dry and oily hair.",
          imageURL: "https://files.organicharvest.in/site-images/original/oh-ingredients-geranium.jpg",
          buttonLinkURL: "/collection/geranium",
        },
        {
          label: "Green tea",
          description:
            "Green tea contains catechins which are powerful antioxidants that help give your skin a healthy glow. It also contains bacteria-fighting properties that help reduce pimples. Green tea also tones the skin by shrinking large pores.",
          imageURL: "https://files.organicharvest.in/site-images/original/green-tea.jpg",
          buttonLinkURL: "/collection/green-tea",
        },
        {
          label: "Honey",
          description:
            "Being a humectant, honey attracts moisture from the environment and helps retain it within the skin. This makes the skin extremely soft and supple. Since it is antimicrobial in nature, it helps destroys acne-causing bacteria too!",
          imageURL: "https://files.organicharvest.in/site-images/original/oh-ingredients-honey.jpg",
          buttonLinkURL: "/collection/honey",
        },
        {
          label: "Honeysuckle extract",
          description:
            "Being a humectant, honey attracts moisture from the environment and helps retain it within the skin. This makes the skin extremely soft and supple. Since it is antimicrobial in nature, it helps destroys acne-causing bacteria too!",
          imageURL: "https://files.organicharvest.in/site-images/original/oh-ingredients-honeysuckle.jpg",
          buttonLinkURL: "/collection/honeysuckle-extract",
        },
        {
          label: "Indian Gooseberry",
          description:
            "Also known as amla, Indian gooseberry is a rich source of vitamin C and is power-packed with antioxidants. It helps firming the skin and brightens the complexion.",
          imageURL: "https://files.organicharvest.in/site-images/original/indian-gooseberry.jpg",
          buttonLinkURL: "/collection/indian-gooseberry",
        },
      ],
    },
    {
      "J - L": [
        {
          label: "Jojoba Oil",
          description:
            "Thanks to its antibacterial and non-greasy nature, jojoba oil helps to soften dry skin and soothe itchy patches. It can also be enlisted as part of the oil cleansing method for oily, acne-ridden skin. Owing to its hydrating properties, jojoba oil is also a popular ingredient in most cosmetic products.",
          imageURL: "https://files.organicharvest.in/site-images/original/oh-ingredients-jojoba.jpg",
          buttonLinkURL: "",
        },
        {
          label: "Juniper berry",
          description:
            "Juniper berry oil promotes hair growth and improves the texture of your hair by detoxifying your scalp. It also maintains the oil balance of the scalp and moisturises it without making it greasy.",
          imageURL: "https://files.organicharvest.in/site-images/original/juniper.jpg",
          buttonLinkURL: "/collection/juniper-berry",
        },
        {
          label: "Lanolin",
          description:
            "Organic lanolin is a plant-based alternative of lanolin derived from plant oils like sunflower, grapeseed, castor beans and flaxseed oils. It hydrates dry and cracked lips due to the emollient and moisturising properties.",
          imageURL: "https://files.organicharvest.in/site-images/original/lanolin_1.jpg",
          buttonLinkURL: "/collection/lanolin",
        },
        {
          label: "Lavender Oil",
          description:
            "Lavender oil is a soothing oil that helps with various skin conditions such as wrinkles, inflammation, redness and even psoriasis. It speeds up the healing process of the skin by assisting in the formation of scar tissue. Its antimicrobial and antioxidant properties nourish the skin and help combat acne.",
          imageURL: "https://files.organicharvest.in/site-images/original/oh-ingredients-lavender.jpg",
          buttonLinkURL: "/collection/lavender-oil",
        },
        {
          label: "Lemon",
          description:
            "Lemon is rich in vitamin C which is extremely crucial for the growth and strengthening of hair. The citric acid in lemon prevents build-up and keeps excess oiliness and greasiness at bay.",
          imageURL: "https://files.organicharvest.in/site-images/original/lemon.jpg",
          buttonLinkURL: "/collection/lemon",
        },
        {
          label: "Lemongrass",
          description:
            "Lemongrass is anti-fungal and antibacterial in nature owing to citral, an organic compound found in the leaf of this plant. It keeps bacteria and infections at bay. It helps soothe the skin and reduces the appearance of large pores.",
          imageURL: "https://files.organicharvest.in/site-images/original/oh-ingredients-lemongrass.jpg",
          buttonLinkURL: "/collection/lemongrass",
        },
      ],
    },
    {
      "M - O": [
        {
          label: "Mango Butter",
          description:
            "Mango Butter is a rich natural fat derived from the seeds contained inside the pits of the Mango fruit. It seals in moisture and reduces breakage and hair loss by strengthening hair follicles, thereby encouraging the growth of stronger, healthier hair.",
          imageURL: "https://files.organicharvest.in/site-images/original/mango-1.png",
          buttonLinkURL: "",
        },
        {
          label: "Mint",
          description:
            "Mint contains salicylic acid which loosens dead skin cells, fights zits and dries acne and promotes cell turnover. It also helps brighten the skin tone and acts as a mild astringent that can double up as a toner.",
          imageURL: "https://files.organicharvest.in/site-images/original/mint.jpg",
          buttonLinkURL: "",
        },
        {
          label: "Mulberry",
          description:
            "Mulberry contains antioxidants such as beta-carotene that prevent damage cased due to free radicals. It regulates the melanin synthesis of your skin, which in turn helps reduce dark spots. It also soothes dry and sensitive skin.",
          imageURL: "https://files.organicharvest.in/site-images/original/mulberry.jpg",
          buttonLinkURL: "",
        },
        {
          label: "Neem",
          description:
            "Neem is packed with antibacterial properties that target and clear acne and acne-causing bacteria. It also reduces redness and inflammation. Neem oil is non-comedogenic and often used to treat scars.",
          imageURL: "https://files.organicharvest.in/site-images/original/oh-ingredients-neem.jpg",
          buttonLinkURL: "",
        },
        {
          label: "Neroli",
          description:
            "Ideal for oily skin, neroli oil rejuvenates the skin while maintaining its moisture levels. Its antiseptic properties help get rid of bacteria. It’s highly recommended for acne-prone skin.",
          imageURL: "https://files.organicharvest.in/site-images/original/oh-ingredients-neroli.jpg",
          buttonLinkURL: "",
        },
        {
          label: "Niacinamide",
          description:
            "It is also known as Nicotinamide, is part of the Vitamin B family. It consists of Vitamin B3 and helps you get rid of Vit B-3 deficiency, cure skin problems such as acne or eczema. It also helps regulate oil production in the glands and can serve both normal and oily skin types.",
          imageURL: "https://files.organicharvest.in/site-images/original/niacinamide-1.png",
          buttonLinkURL: "",
        },
        {
          label: "Olive Oil",
          description:
            "Considered to be nature’s best conditioner, olive oil locks in a generous amount of moisture into the skin to keep it hydrated. It contains antioxidants and hydrating squalane (an oil which occurs naturally in our bodies, also found in olives, that which makes the oil extremely hydrating and absorbent) which helps tame extremely dry, peeling skin.",
          imageURL: "https://files.organicharvest.in/site-images/original/oh-ingredients-olive-(1).jpg",
          buttonLinkURL: "",
        },
        {
          label: "Onion",
          description:
            "Onions are rich in substances that fight fungus and bacteria, and can keep your hair free of infections and improve hair growth. A good massage with onion juice can help increase blood circulation, further helping in hair growth.",
          imageURL: "https://files.organicharvest.in/site-images/original/onion.png",
          buttonLinkURL: "",
        },
        {
          label: "Orange",
          description:
            "High in citric acid, orange peel extract helps rejuvenate the skin and reduces inflammation. It also helps shrink pores, remove excess dirt and grime, unclog pores and dry out acne.",
          imageURL: "https://files.organicharvest.in/site-images/original/orange.jpg",
          buttonLinkURL: "",
        },
        {
          label: "Orchid Petal",
          description:
            "Orchid petal extract contains calcium, zinc and magnesium which boost skin’s elasticity and contribute towards making it healthy. Orchid oil is extensively used to reduce the appearance of fine lines and wrinkles.",
          imageURL: "https://files.organicharvest.in/site-images/original/orchid-petal.jpg",
          buttonLinkURL: "",
        },
      ],
    },
    {
      "P - S": [
        {
          label: "Patchouli",
          description:
            "Patchouli oil is used to treat a variety of skin conditions such as dry, chapped skin, itching, eczema and acne. Its anti-inflammatory properties help soothe irritation. In addition to that, patchouli oil also helps tighten the skin.",
          imageURL: "https://files.organicharvest.in/site-images/original/oh-ingredients-patchouli.jpg",
          buttonLinkURL: "/collection/patchouli",
        },
        {
          label: "Peppermint",
          description:
            "Peppermint oil is best known for its soothing, cooling properties and is often mixed with lotions to lend them antiseptic and antimicrobial properties. It helps control oil production in the skin.",
          imageURL: "https://files.organicharvest.in/site-images/original/oh-ingredients-peppermint.jpg",
          buttonLinkURL: "/collection/peppermint",
        },
        {
          label: "Quinoa",
          description:
            "Quinoa contains minerals like calcium, iron and phosphorus that keep your scalp moisturised and helps get rid of any flakiness. It also contains all the 8 essential amino acids, which helps it to condition and protect your hair and makes it look smooth and shiny.",
          imageURL: "https://files.organicharvest.in/site-images/original/quinoa-in.png",
          buttonLinkURL: "/collection/quinoa",
        },
        {
          label: "Red Guava",
          description:
            "Red guava contains vitamin C, antioxidants and carotene. While vitamin C and antioxidants brighten the skin and give it a healthy glow, carotene helps even out the skin tone.",
          imageURL: "https://files.organicharvest.in/site-images/original/red-guava.jpg",
          buttonLinkURL: "/collection/red-guava",
        },
        {
          label: "Rose",
          description:
            "Rose water is widely used for its refreshing, cooling and instantly rejuvenating properties. It soothes the skin and is often used as a toner.",
          imageURL: "https://files.organicharvest.in/site-images/original/oh-ingredients-rose.jpg",
          buttonLinkURL: "/collection/rose",
        },
        {
          label: "Rosehip",
          description:
            "The rose hip or rosehip, also called rose haw and rose hep, is the accessory fruit of the rose plant. Rose hips have been used for centuries in traditional and folk medicine for their anti-inflammatory and pain-relieving properties. Rose hips help prevent skin aging, reduce osteoarthritis pain, and aid weight loss and heart health.",
          imageURL: "https://files.organicharvest.in/site-images/original/rosehip-oil-copy.jpg",
          buttonLinkURL: "/collection/rosehip",
        },
        {
          label: "Rosemary",
          description:
            "The oil of the rosemary herb is used to help aide hair growth. It soothes the scalp and acts as a natural hair darkener by reversing premature greying. It also unclogs hair follicles and helps eliminate dandruff.",
          imageURL: "https://files.organicharvest.in/site-images/original/rosemary.jpg",
          buttonLinkURL: "/collection/rosemary",
        },
        {
          label: "Saffron",
          description:
            "Saffron contains skin lightening properties that help even out the skin tone and improve your complexion. It’s also anti-fungal and helps reduce acne.",
          imageURL: "https://files.organicharvest.in/site-images/original/saffron.jpg",
          buttonLinkURL: "/collection/saffron",
        },
        {
          label: "Sandalwood",
          description:
            "Sandalwood being an antiseptic agent fights acne-causing bacteria, soothes sunburn and inflammation and reduces the signs of ageing. It also heals dry skin.",
          imageURL: "https://files.organicharvest.in/site-images/original/sandalwood.jpg",
          buttonLinkURL: "/collection/sandalwood",
        },
        {
          label: "Seaweed",
          description:
            "Seaweed is packed with amino acids, vitamins, minerals and antibacterial properties that fight acne and signs of ageing. It’s supremely hydrating and improves the texture of the skin.",
          imageURL: "https://files.organicharvest.in/site-images/original/oh-ingredients-seaweed.jpg",
          buttonLinkURL: "/collection/seaweed",
        },
        {
          label: "Shea butters",
          description:
            "Shea butter is extremely hydrating thanks to its rich fatty acid content. Continued use of shea butter also reduces scars and helps the skin heal faster. It’s recommended for extremely dry and dehydrated skin.",
          imageURL: "https://files.organicharvest.in/site-images/original/oh-ingredients-sheabutter.jpg",
          buttonLinkURL: "/collection/shea-butter",
        },
        {
          label: "Soya bean extract",
          description:
            "Organic soya bean extract reduces the appearance of fine lines and wrinkles and slows down the process of ageing. It contains phytoestrogens that help produce estrogen in the body, one of the hormones responsible for your skin’s elasticity.",
          imageURL: "https://files.organicharvest.in/site-images/original/oh-ingredients-soyabean.jpg",
          buttonLinkURL: "/collection/soya-bean-extract",
        },
        {
          label: "Spinach",
          description:
            "Spinach has antioxidants and nutrients your skin loves. It is rich in Vitamins C, E, A, and B which are especially great for your skin. They help in reducing inflammation, heal scars or sun damage, fortify its natural barrier, and enhance skin radiance. It helps in fighting skin problems for all skin types.",
          imageURL: "https://files.organicharvest.in/site-images/original/spinach.png",
          buttonLinkURL: "/collection/spinach",
        },
        {
          label: "Swiss Ice Wine",
          description:
            "Swiss ice wine is made with grapes that are left on the vine so that they can freeze naturally. The juice works as an astringent on the face and also creates a lifting effect that makes the skin appear smoother and more youthful.",
          imageURL: "https://files.organicharvest.in/site-images/original/swiss-ice-wine-new.png",
          buttonLinkURL: "/collection/swiss-ice-wine",
        },
      ],
    },
    {
      "T - V": [
        {
          label: "Tamarind",
          description:
            "Tamarind seed extract contains hyaluronic acid that keeps skin healthy and moisturised. It also helps reduce fine lines, wrinkles and signs of ageing. Tamarind seeds are also used to heal harsh rashes and boost skin’s elasticity.",
          imageURL: "https://files.organicharvest.in/site-images/original/oh-ingredients-tamarind.jpg",
          buttonLinkURL: "",
        },
        {
          label: "Tea Tree",
          description:
            "Being a natural toner, tea tree helps open up clogged pores and firm the skin. It also regulates the production of sebum and keeps acne-causing bacteria at bay",
          imageURL: "https://files.organicharvest.in/site-images/original/tea.jpg",
          buttonLinkURL: "",
        },
        {
          label: "Tea Tree Oil",
          description:
            "Tea tree oil unclogs hair follicles and nourishes the roots. When used with a carrier oil, it promotes hair growth and battles dandruff as well as an itchy scalp.",
          imageURL: "https://files.organicharvest.in/site-images/original/tea.jpg",
          buttonLinkURL: "",
        },
        {
          label: "Tulsi",
          description:
            "Tulsi detoxifies your skin and helps get rid of bacteria that can cause skin infections. It is recommended that one consume tulsi leaves regularly since they help purify blood and give your skin a healthy glow. Rich in antioxidants, tulsi helps slow down the process of ageing.",
          imageURL: "https://files.organicharvest.in/site-images/original/oh-ingredients-tulsi.jpg",
          buttonLinkURL: "",
        },
        {
          label: "Vetiver",
          description:
            "Vetiver oil is extremely beneficial in reducing the appearance of dark spots on the skin. It moisturises, tightens and evens out the skin tone. Its antioxidants help protect the skin from damage.",
          imageURL: "https://files.organicharvest.in/site-images/original/vetiver.jpg",
          buttonLinkURL: "",
        },
      ],
    },
    {
      "W - Z": [
        {
          label: "Wheat Germ",
          description:
            "Wheat germ oil is easily absorbed into the skin and gives it a boost of vitamin A, D and antioxidants. It also contains vitamin E which helps fight free radicals. Wheat germ oil aids in formation of collagen which helps skin stay youthful and elastic.",
          imageURL: "https://files.organicharvest.in/site-images/original/oh-ingredients-wheat.jpg",
          buttonLinkURL: "/collection/wheat-germ",
        },
        {
          label: "Wild Rose",
          description:
            "Wild rose contains Vitamin C which nourishes and softens the skin, lending it a healthy glow. The essential oils in wild rose help to repair even the most delicate skin.",
          imageURL: "https://files.organicharvest.in/site-images/original/wild-rose-new.png",
          buttonLinkURL: "/collection/wild-rose",
        },
        {
          label: "Witch Hazel",
          description:
            "Witch hazel is packed with anti-inflammatory agents that cleanse the skin, remove excess oil and tighten pores. It is also a gentle astringent, which helps in reducing inflammation.",
          imageURL: "https://files.organicharvest.in/site-images/original/witch-hazel-new.png",
          buttonLinkURL: "/collection/witch-hazel",
        },
      ],
    },
  ];

  /**Ingredients filter categories*/
  const filters = ["A - C", "D - F", "G - I", "J - L", "M - O", "P - S", "T - V", "W - Z"];

  const [filterData, setFilterData] = useState(Object.values(ingredientsJSON[0])[0]);
  const [currentFilter, setCurrentFilter] = useState(filters[0]);

  const handleFilterChange = (input: any, onTop: any) => {
    ingredientsJSON.forEach(data => {
      if (Object.keys(data) && Object.keys(data)[0] === input) {
        setFilterData(Object.values(data)[0]);
      }
    });
    setCurrentFilter(input);
    if (onTop) {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth",
      });
    }
  };

  return (
    <main className="orhingredients">
      <div className="productlistingbannerWrapper">
        <div className="facecareWrapper">
          <h1>Ingredients</h1>
          <p>
            All of our products are made from ingredients that are sourced from organic fields. Being free of pesticides,
            they're much more potent and effective at dealing with skin and hair concerns.
          </p>
        </div>
      </div>

      <div className="sortWrapper">
        <div className="centerWrapper">
          <p>Sort Ingredients by</p>
          <ul className="sort_by">
            {filters.map((filter, index) => {
              return (
                <li key={index}>
                  <a
                    className={`${filter === currentFilter ? "sortting" : ""}`}
                    onClick={() => handleFilterChange(filter, false)}
                    aria-label={filter}
                  >
                    {filter}
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      <div className="ingredientWrapper" id="ingerdientsContent">
        {filterData.map((data: any, index: number) => {
          if (index > 2) return null;
          return (
            <div className="ingredientrow a-c" key={index}>
              <div className="ingredient_col">
                <img src={data.imageURL} alt="Organic Harvest" width="711" height="338" />
              </div>
              <div className="ingredient_right_col txt_left">
                <div className="centerWrapper">
                  <h2>{data.label}</h2>
                  <p>{data.description}</p>
                  <p>
                    <a href={data.buttonLinkURL} className="show_product_btn" aria-label="Show products">
                      Show products
                    </a>
                  </p>
                </div>
              </div>
              <div className="clear"></div>
            </div>
          );
        })}
        <div className="organic_banner_ingredient organic_banner">
          <img
            src="https://files.organicharvest.in/site-images/original/ingredient-bg.png"
            alt="Organic Harvest"
            width="1628"
            height="647"
          />
        </div>
      </div>
      <div className="ingredientWrapper ingredientsAfterBanner">
        {filterData.map((data: any, index: number) => {
          if (index < 3) return null;
          return (
            <div className="ingredientrow" key={index}>
              <div className="ingredient_col">
                <img src={data.imageURL} alt="Organic Harvest" width="711" height="338" />
              </div>
              <div className="ingredient_right_col txt_left">
                <div className="centerWrapper">
                  <h2>{data.label}</h2>
                  <p>{data.description}</p>
                  <p>
                    <a href={data.buttonLinkURL} className="show_product_btn" aria-label="Show products">
                      Show products
                    </a>
                  </p>
                </div>
              </div>
              <div className="clear"></div>
            </div>
          );
        })}
      </div>

      <div className="sortWrapper sortBottomWrapper">
        <div className="centerWrapper">
          <p>Sort Ingredients by</p>
          <ul className="sort_by">
            {filters.map((filter, index) => {
              return (
                <li key={index}>
                  <a
                    className={`${filter === currentFilter ? "sortting" : ""}`}
                    onClick={() => handleFilterChange(filter, true)}
                    aria-label={filter}
                  >
                    {filter}
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      <INGREDIENTS_STYLES />
    </main>
  );
};

export default Ingredients;
