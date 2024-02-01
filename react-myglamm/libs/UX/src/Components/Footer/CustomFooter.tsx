import React, { useState } from "react";

// import "./customFooter.scss";

const CustomFooter = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="customFooter">
      {/* Header */}
      <div aria-hidden id="seo_footer-header" className="p-6 text-xs bg-white flex" onClick={() => setOpen(!open)}>
        <button className="flex items-center" type="button" aria-expanded="true" aria-controls="seo_footer">
          <span className="">More about online shopping at Myglamm</span>
          <span className="absolute right-0">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              x="0px"
              y="0px"
              width="24px"
              height="24px"
              viewBox={open ? "0 -700 1000 1000" : "-500 -250 1000 1000"}
            >
              <path
                transform={open ? "rotate(270)" : "rotate(90)"}
                fill="#9b9b9b"
                d="M163 500l-58-57 187-187-187-187 58-57 244 244z"
              />
            </svg>
          </span>
        </button>
      </div>

      <style jsx>
        {`
          .panel-bg {
            background-image: url(https://files.myglamm.com/site-images/original/seo-m-logo.png);
            height: 100%;
            width: 100%;
            background-size: "cover";
            background-position: center;
            background-repeat: no-repeat;
            // background-color: #fceeee;
          }

          button {
            outline: none !important;
          }

          .seo-category ul li {
            display: inline-block;
            font-size: 12px;
            color: #666;
            border-right: 0.5px solid #9b9b9b;
            padding: 0 9px;
          }
          .seo-category,
          .seo-skin h2 {
            color: var(--color1);
          }
          .seo-category p {
            font-size: 12px;
            line-height: 1.5;
            color: #666;
          }
          .seo-skin ul li {
            width: 100%;
            display: flex;
            border-bottom: 1px solid rgba(0, 0, 0, 0.1);
          }
          .amount-label {
            width: 80%;
            padding-right: 0.5rem !important;
          }
          .price {
            width: 20%;
            padding-left: 0.5rem !important;
          }
          .seo-skin ul li .amount-label,
          .seo-skin ul li .price {
            font-size: 12px;
            line-height: 1.5;
            color: #666;
            padding: 15px 0;
          }
        `}
      </style>

      {/* Body */}
      {open && (
        <section>
          <div className="panel-bg px-6">
            <div className="seo-category mb-4">
              <h2 className="text-xs font-bold pb-2">BRAND</h2>
              <ul className="list-none">
                <li>
                  <a href="https://www.myglamm.com/collection/myglamm">MyGlamm</a>
                </li>
                <li>
                  <a href="https://www.myglamm.com/collection/glow-iridescent-brightening-skincare">
                    GLOW Iridescent Brightening Skincare
                  </a>
                </li>
                <li>
                  <a href="https://www.myglamm.com/collection/manish-malhotra">Manish Malhotra</a>
                </li>
                <li>
                  <a href="https://www.myglamm.com/collection/lit-collection">LIT Collection</a>
                </li>
                <li>
                  <a href="https://www.myglamm.com/collection/camera-ready-hd-makeup">POSE</a>
                </li>
                <li>
                  <a href="https://www.myglamm.com/collection/kplay-flavoured-makeup">K.Play</a>
                </li>
              </ul>
            </div>
            <div className="seo-category mb-4">
              <h2 className="text-xs font-bold pb-2">CATEGORIES</h2>
              <ul className="list-none">
                <li>
                  <a href="https://www.myglamm.com/buy/makeup/skincare">SKINCARE</a>
                </li>
                <li>
                  <a href="https://www.myglamm.com/buy/makeup/skincare/cleanser">Cleanser</a>
                </li>
                <li>
                  <a href="https://www.myglamm.com/buy/makeup/skincare/toner">Toner</a>
                </li>
                <li>
                  <a href="https://www.myglamm.com/buy/makeup/skincare/moisturiser">Moisturiser</a>
                </li>
                <li>
                  <a href="https://www.myglamm.com/buy/makeup/skincare/body-lotion">Body Lotion</a>
                </li>
                <li>
                  <a href="https://www.myglamm.com/buy/makeup/skincare/sheet-mask">Sheet Mask</a>
                </li>
                <li>
                  <a href="https://www.myglamm.com/buy/makeup/face">FACE</a>
                </li>
                <li>
                  <a href="https://www.myglamm.com/buy/makeup/face/primer">Primer</a>
                </li>
                <li>
                  <a href="https://www.myglamm.com/buy/makeup/face/concealer">Concealer</a>
                </li>
                <li>
                  <a href="https://www.myglamm.com/buy/makeup/face/foundation">Foundation</a>
                </li>
                <li>
                  <a href="https://www.myglamm.com/buy/makeup/face/compact-powder">Compact Powder</a>
                </li>
                <li>
                  <a href="https://www.myglamm.com/buy/makeup/face/contour-and-highlight">Contour and Highlight</a>
                </li>
                <li>
                  <a href="https://www.myglamm.com/buy/makeup/face/blush">Blush</a>
                </li>
                <li>
                  <a href="https://www.myglamm.com/buy/makeup/face/blush">Bronzer</a>
                </li>
                <li>
                  <a href="https://www.myglamm.com/buy/makeup/face/cheek-stain">Cheek Stain</a>
                </li>
                <li>
                  <a href="https://www.myglamm.com/buy/makeup/face/face-chalks">Face Chalks</a>
                </li>
                <li>
                  <a href="https://www.myglamm.com/buy/makeup/face/sheet-mask">Masks</a>
                </li>
                <li>
                  <a href="https://www.myglamm.com/buy/makeup/eyes">EYES</a>
                </li>
                <li>
                  <a href="https://www.myglamm.com/buy/makeup/eyes/eyeshadow">Eye Shadow</a>
                </li>
                <li>
                  <a href="https://www.myglamm.com/buy/makeup/eyes/eyeliner">Eyeliner</a>
                </li>
                <li>
                  <a href="https://www.myglamm.com/buy/makeup/eyes/brow-definer">Eyebrows</a>
                </li>
                <li>
                  <a href="https://www.myglamm.com/buy/makeup/eyes/lip-and-eye-sparkles">Eye Sparkle</a>
                </li>
                <li>
                  <a href="https://www.myglamm.com/buy/makeup/eyes/eye-chalks">Eye Chalks</a>
                </li>
                <li>
                  <a href="https://www.myglamm.com/buy/makeup/eyes/mascara">Mascara</a>
                </li>
                <li>
                  <a href="https://www.myglamm.com/buy/makeup/lips">LIPS</a>
                </li>
                <li>
                  <a href="https://www.myglamm.com/buy/makeup/lips/lipstick">Lipstick</a>
                </li>
                <li>
                  <a href="https://www.myglamm.com/buy/makeup/lips/lip-gloss">Lip Gloss</a>
                </li>
                <li>
                  <a href="https://www.myglamm.com/buy/makeup/lips/lip-pencil">Lipliners</a>
                </li>
                <li>
                  <a href="https://www.myglamm.com/buy/makeup/lips/lip-balm">Lip Care</a>
                </li>
                <li>
                  <a href="https://www.myglamm.com/buy/makeup/eyes/lip-and-eye-sparkles">Lip Sparkle</a>
                </li>
                <li>
                  <a href="https://www.myglamm.com/buy/makeup/lips/lip-stain">Lip Stain</a>
                </li>
                <li>
                  <a href="https://www.myglamm.com/buy/makeup/lips/lip-chalks">Lip Chalks</a>
                </li>
                <li>
                  <a href="https://www.myglamm.com/buy/makeup/nails">NAILS</a>
                </li>
                <li>
                  <a href="https://www.myglamm.com/buy/makeup/nails/gel-nail-polish">Gel</a>
                </li>
                <li>
                  <a href="https://www.myglamm.com/collection/nail-care">Care</a>
                </li>
                <li>
                  <a href="https://www.myglamm.com/buy/makeup/nails/matte-nail-polish">Matte</a>
                </li>
                <li>
                  <a href="https://www.myglamm.com/buy/makeup/makeup-kits">Makeup Kits</a>
                </li>
                <li>
                  <a href="https://www.myglamm.com/buy/makeup/accessories">ACCESSORIES/TOOLS</a>
                </li>
                <li>
                  <a href="https://www.myglamm.com/buy/makeup/accessories/brushes">Brushes</a>
                </li>
                <li>
                  <a href="https://www.myglamm.com/buy/makeup/accessories/sharpener">Other</a>
                </li>
              </ul>
            </div>
            <div className="seo-category mb-4">
              <h2 className="text-xs font-bold pb-2">SKIN TYPE</h2>
              <ul className="list-none">
                <li>
                  <a href="https://www.myglamm.com/collection/light-skin">Fair Skin</a>
                </li>
                <li>
                  <a href="https://www.myglamm.com/collection/medium-skin">Medium Skin</a>
                </li>
                <li>
                  <a href="https://www.myglamm.com/collection/dusky-skin">Dusky Skin</a>
                </li>
              </ul>
            </div>
            <div className="seo-category mb-4">
              <h2 className="text-xs font-bold pb-2">EXPERTS</h2>
              <ul className="list-none">
                <li>
                  <a href="https://www.myglamm.com/daniel-bauer">Daniel Bauer</a>
                </li>
                <li>
                  <a href="https://www.myglamm.com/cory-walia">Cory Walia</a>
                </li>
                <li>
                  <a href="https://www.myglamm.com/influencer-listing">Influencers</a>
                </li>
              </ul>
            </div>
            <div className="seo-category mb-4">
              <h2 className="text-xs font-bold pb-2">OTHER PAGES</h2>
              <ul className="list-none">
                <li>
                  <a href="https://www.myglamm.com/collection/just-dropped">Just Dropped</a>
                </li>
                <li>
                  <a href="https://www.myglamm.com/shade-finder">Find Your Lipstick</a>
                </li>
                <li>
                  <a href="https://www.myglamm.com/offers">Offers</a>
                </li>
                <li>
                  <a href="https://www.myglamm.com/glammstudio">Blogs</a>
                </li>
                <li>
                  <a href="https://www.myglamm.com/glammstudio/style/">Style</a>
                </li>
                <li>
                  <a href="https://www.myglamm.com/glammstudio/lifestyle/">Lifestyle</a>
                </li>
                <li>
                  <a href="https://www.myglamm.com/glammstudio/trends/">Trends</a>
                </li>
                <li>
                  <a href="https://www.myglamm.com/glammstudio/tips/">Tips</a>
                </li>
                <li>
                  <a href="https://www.myglamm.com/glammstudio/beauty/">Beauty</a>
                </li>
                <li>
                  <a href="https://www.myglamm.com/glammstudio/tutorials/">Tutorials</a>
                </li>
                <li>
                  <a href="https://www.myglamm.com/lookbook/looks">looks</a>
                </li>
                <li>
                  <a href="https://www.myglamm.com/press">Press</a>
                </li>
                <li>
                  <a href="https://www.myglamm.com/store-locator">Store Locator</a>
                </li>
                <li>
                  <a href="https://www.myglamm.com/contact-us/">Contact Us</a>
                </li>
                <li>
                  <a href="https://www.myglamm.com/policies">Policies</a>
                </li>
                <li>
                  <a href="https://www.myglamm.com/shipping-and-delivery-policy">Shipping and Delivery Policy</a>
                </li>
                <li>
                  <a href="https://www.myglamm.com/returns-and-replacements">Returns and Replacements</a>
                </li>
                <li>
                  <a href="https://www.myglamm.com/glamm-insider">Glamm Insider</a>
                </li>
                <li>
                  <a href="https://www.myglamm.com/online-parties">Glamm Parties</a>
                </li>
                <li>
                  <a href="https://www.myglamm.com/glammexperience">Glamm Experience</a>
                </li>
                <li>
                  <a href="https://www.myglamm.com/about-us">About us</a>
                </li>
                <li>
                  <a href="https://www.myglamm.com/refer">Refer and Earn</a>
                </li>
              </ul>
            </div>
            <div className="seo-category mb-4">
              <h2 className="text-xs font-bold pb-2">SHOPPING AT MYGLAMM</h2>
              <p>
                Backed by one of Europe&apos;s largest natural beauty companies, MyGlamm collaborated with global experts and
                makeup artists to bring about exciting innovation in makeup to accomplish our single, focused goal – make
                looking glamorous effortless!
              </p>
            </div>
            <div className="seo-skin">
              <h2 className="text-xs font-bold pb-2">PRODUCTS PRICE LIST</h2>
              <ul className="list-none">
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/glow-iridescent-brightening-sheet-mask.html">
                      GLOW Iridescent Brightening Sheet Mask
                    </a>
                  </div>
                  <div className="price">199 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/glow-iridescent-brightening-toner.html">
                      GLOW Iridescent Brightening Toner
                    </a>
                  </div>
                  <div className="price">995 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/glow-iridescent-brightening-body-lotion.html">
                      GLOW Iridescent Brightening Body Lotion
                    </a>
                  </div>
                  <div className="price">1095 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/glow-iridescent-brightening-moisturising-cream.html">
                      GLOW Iridescent Brightening Moisturising Cream
                    </a>
                  </div>
                  <div className="price">1595 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/glow-iridescent-brightening-foam-cleanser.html">
                      GLOW Iridescent Brightening Foam Cleanser
                    </a>
                  </div>
                  <div className="price">995 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/two-of-your-kind-nude-blush.html">
                      Two of Your Kind Gel Finish Nail Polish Duo - Nude Blush
                    </a>
                  </div>
                  <div className="price">390 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/two-of-your-kind-christmas-eve.html">
                      Two of Your Kind Gel Finish Nail Polish Duo - Christmas Eve
                    </a>
                  </div>
                  <div className="price">390 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/two-of-your-kind-classic-duet.html">
                      Two of Your Kind Gel Finish Nail Polish Duo - Classic Duet
                    </a>
                  </div>
                  <div className="price">390 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/two-of-your-kind-summer-souffle.html">
                      Two of Your Kind Gel Finish Nail Polish Duo - Summer Souffle
                    </a>
                  </div>
                  <div className="price">390 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/two-of-your-kind-by-the-sea.html">
                      Two of Your Kind Gel Finish Nail Polish Duo - By The Sea
                    </a>
                  </div>
                  <div className="price">390 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/two-of-your-kind-purple-smurf.html">
                      Two of Your Kind Gel Finish Nail Polish Duo - Purple Smurf
                    </a>
                  </div>
                  <div className="price">390 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/two-of-your-kind-candyland.html">
                      Two of Your Kind Gel Finish Nail Polish Duo - Candyland
                    </a>
                  </div>
                  <div className="price">390 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/two-of-your-kind-cherry-on-top.html">
                      Two of Your Kind Gel Finish Nail Polish Duo - Cherry on Top
                    </a>
                  </div>
                  <div className="price">390 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/two-of-your-kind-doll-face.html">
                      Two of Your Kind Gel Finish Nail Polish Duo - Doll face
                    </a>
                  </div>
                  <div className="price">390 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/two-of-your-kind-party-popper.html">
                      Two of Your Kind Gel Finish Nail Polish Duo - Party Popper
                    </a>
                  </div>
                  <div className="price">390 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/two-of-your-kind-liquid-gold.html">
                      Two of Your Kind Gel Finish Nail Polish Duo - Liquid Gold
                    </a>
                  </div>
                  <div className="price">390 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/two-of-your-kind-foxtrot.html">
                      Two of Your Kind Gel Finish Nail Polish Duo - Foxtrot
                    </a>
                  </div>
                  <div className="price">390 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/perfect-curves-matte-lip-crayon-ampere.html">
                      Perfect Curves Matte Lip Crayon - Ampere
                    </a>
                  </div>
                  <div className="price">695 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/perfect-curves-soleil.html">
                      Perfect Curves Matte Lip Crayon - Soleil
                    </a>
                  </div>
                  <div className="price">795 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/perfect-curves-terra.html">
                      Perfect Curves Matte Lip Crayon - Terra
                    </a>
                  </div>
                  <div className="price">795 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/perfect-curves-matte-lip-crayon-carnation.html">
                      Perfect Curves Matte Lip Crayon - Carnation
                    </a>
                  </div>
                  <div className="price">795 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/perfect-curves-siren.html">
                      Perfect Curves Matte Lip Crayon - Siren
                    </a>
                  </div>
                  <div className="price">695 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/perfect-curves-cosmopolitan.html">
                      Perfect Curves Matte Lip Crayon - Cosmopolitan
                    </a>
                  </div>
                  <div className="price">795 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/perfect-curves-debutante.html">
                      Perfect Curves Matte Lip Crayon - Debutante
                    </a>
                  </div>
                  <div className="price">795 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/perfect-curves-biscotti.html">
                      Perfect Curves Matte Lip Crayon - Biscotti
                    </a>
                  </div>
                  <div className="price">795 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/stay-defined.html">
                      Stay Defined Liquid Eyeliner Brow Powder - Ebony & Walnut
                    </a>
                  </div>
                  <div className="price">1095 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/jet-set-eyes.html">Jet Set Eyes Kajal Eyeliner - Noir</a>
                  </div>
                  <div className="price">750 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/chisel-it-show-stopper.html">
                      Chisel It Contour Kit - Show Stopper
                    </a>
                  </div>
                  <div className="price">1250 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/chisel-it-game-face.html">Chisel It Contour Kit - Game Face</a>
                  </div>
                  <div className="price">1250 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/glow-to-glamour.html">Glow to Glamour Shimmer And Fixing Powder</a>
                  </div>
                  <div className="price">1195 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/total-make-over-ff-cream-dusky.html">
                      Total Makeover FF Cream Foundation Palette - Dusky
                    </a>
                  </div>
                  <div className="price">1450 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/total-make-over-ff-cream-medium.html">
                      Total Makeover FF Cream Foundation Palette - Medium Skin Tone
                    </a>
                  </div>
                  <div className="price">1450 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/total-make-over-ff-cream-light.html">
                      Total Makeover FF Cream Foundation Palette - Latte
                    </a>
                  </div>
                  <div className="price">1450 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/wheelie.html">Wheelie Liquid Eyeliner</a>
                  </div>
                  <div className="price">895 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/powder-magic-aquamarine.html">
                      Powder Magic Eyeshadow Pencil - Aquamarine
                    </a>
                  </div>
                  <div className="price">950 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/powder-magic-smoky-quartz.html">
                      Powder Magic Eyeshadow Pencil - Smoky Quartz
                    </a>
                  </div>
                  <div className="price">950 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/powder-magic-goldmine.html">
                      Powder Magic Eyeshadow Pencil - Goldmine
                    </a>
                  </div>
                  <div className="price">950 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/powder-magic-amethyst.html">
                      Powder Magic Eyeshadow Pencil - Amethyst
                    </a>
                  </div>
                  <div className="price">950 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/tinted-perfection.html">Tinted Perfection Face Primer</a>
                  </div>
                  <div className="price">1095 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/butterlicious-possessed.html">
                      Butterlicious Liquid Matte Lipstick - Possessed
                    </a>
                  </div>
                  <div className="price">895 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/butterlicious-high-voltage.html">
                      Butterlicious Liquid Matte Lipstick - High Voltage
                    </a>
                  </div>
                  <div className="price">895 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/butterlicious-runway.html">
                      Butterlicious Liquid Matte Lipstick - Runway
                    </a>
                  </div>
                  <div className="price">895 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/butterlicious-rose.html">
                      Butterlicious Liquid Matte Lipstick - Rosé
                    </a>
                  </div>
                  <div className="price">895 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/two-of-your-kind-rumour-has-it.html">
                      Two of Your Kind Gel Finish Nail Polish Duo - Rumour has it
                    </a>
                  </div>
                  <div className="price">390 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/two-of-your-kind-i-woke-up-like-this.html">
                      Two of Your Kind Gel Finish Nail Polish Duo - I woke up like this
                    </a>
                  </div>
                  <div className="price">390 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/two-of-your-kind-serve-it-up.html">
                      Two of Your Kind Gel Finish Nail Polish Duo - Serve it up
                    </a>
                  </div>
                  <div className="price">390 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/two-of-your-kind-bringing-down-the-house.html">
                      Two of Your Kind Gel Finish Nail Polish Duo - Bringing down the house
                    </a>
                  </div>
                  <div className="price">390 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/two-of-your-kind-almost-there.html">
                      Two of Your Kind Gel Finish Nail Polish Duo - Almost there
                    </a>
                  </div>
                  <div className="price">390 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/two-of-your-kind-good-girl-gone-bad.html">
                      Two of Your Kind Gel Finish Nail Polish Duo - Good girl gone bad
                    </a>
                  </div>
                  <div className="price">390 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/twin-faced-concealer-toffee-dusky.html">
                      Twin Faced Concealer Sticks - Toffee Dusky
                    </a>
                  </div>
                  <div className="price">795 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/twin-faced-concealer-frappe-light.html">
                      Twin Faced Concealer Sticks - Frappe Light
                    </a>
                  </div>
                  <div className="price">795 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/twin-faced-concealer-butterscotch-medium.html">
                      Twin Faced Concealer Sticks - Butterscotch Medium
                    </a>
                  </div>
                  <div className="price">795 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/perfect-curves-spice.html">
                      Perfect Curves Matte Lip Crayon - Spice it up
                    </a>
                  </div>
                  <div className="price">795 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/perfect-curves-passion.html">
                      Perfect Curves Matte Lip Crayon - Passion
                    </a>
                  </div>
                  <div className="price">795 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/perfect-curves-candy.html">
                      Perfect Curves Matte Lip Crayon - Bourbon Candy
                    </a>
                  </div>
                  <div className="price">795 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/jet-set-eyes-bleu.html">Jet Set Eyes Kajal Eyeliner - Bleu</a>
                  </div>
                  <div className="price">750 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/jet-set-eyes-brun.html">Jet Set Eyes Kajal Eyeliner - Brun</a>
                  </div>
                  <div className="price">750 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/total-makeover-ff-cream-honey.html">
                      Total Makeover FF Cream Foundation Palette - Honey
                    </a>
                  </div>
                  <div className="price">1450 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/manish-malhotra-hi-shine-lipstick-sunset-sienna.html">
                      Manish Malhotra Hi-Shine Lipstick - Sunset Sienna
                    </a>
                  </div>
                  <div className="price">950 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/manish-malhotra-hi-shine-lipstick-caramel-kiss.html">
                      Manish Malhotra Hi-Shine Lipstick - Caramel Kiss
                    </a>
                  </div>
                  <div className="price">950 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/manish-malhotra-hi-shine-lipstick-desert-suede.html">
                      Manish Malhotra Hi-Shine Lipstick - Desert Suede
                    </a>
                  </div>
                  <div className="price">950 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/manish-malhotra-hi-shine-lipstick-barely-nude.html">
                      Manish Malhotra Hi-Shine Lipstick - Barely Nude
                    </a>
                  </div>
                  <div className="price">950 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/manish-malhotra-hi-shine-lipstick-cocoa-love.html">
                      Manish Malhotra Hi-Shine Lipstick - Cocoa Love
                    </a>
                  </div>
                  <div className="price">950 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/manish-malhotra-hi-shine-lipstick-mauve-struck.html">
                      Manish Malhotra Hi-Shine Lipstick - Mauve Struck
                    </a>
                  </div>
                  <div className="price">950 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/manish-malhotra-hi-shine-lipstick-red-carpet.html">
                      Manish Malhotra Hi-Shine Lipstick - Red Carpet
                    </a>
                  </div>
                  <div className="price">950 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/manish-malhotra-hi-shine-lipstick-ruby-runway.html">
                      Manish Malhotra Hi-Shine Lipstick - Ruby Runway
                    </a>
                  </div>
                  <div className="price">950 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/manish-malhotra-hi-shine-lipstick-moroccan-red.html">
                      Manish Malhotra Hi-Shine Lipstick - Moroccan Red
                    </a>
                  </div>
                  <div className="price">950 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/manish-malhotra-hi-shine-lipstick-wild-rose.html">
                      Manish Malhotra Hi-Shine Lipstick - Wild Rose
                    </a>
                  </div>
                  <div className="price">950 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/manish-malhotra-hi-shine-lipstick-english-rose.html">
                      Manish Malhotra Hi-Shine Lipstick - English Rose
                    </a>
                  </div>
                  <div className="price">950 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/manish-malhotra-hi-shine-lipstick-vintage-wine.html">
                      Manish Malhotra Hi-Shine Lipstick - Vintage Wine
                    </a>
                  </div>
                  <div className="price">950 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/manish-malhotra-hi-shine-lipgloss-gold-dust.html">
                      Manish Malhotra Hi-Shine Lipgloss - Gold Dust
                    </a>
                  </div>
                  <div className="price">1050 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/manish-malhotra-hi-shine-lipgloss-modern-muse.html">
                      Manish Malhotra Hi-Shine Lipgloss - Modern Muse
                    </a>
                  </div>
                  <div className="price">1050 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/manish-malhotra-hi-shine-lipgloss-retro-romance.html">
                      Manish Malhotra Hi-Shine Lipgloss - Retro Romance
                    </a>
                  </div>
                  <div className="price">1050 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/manish-malhotra-hi-shine-lipgloss-ravishing-red.html">
                      Manish Malhotra Hi-Shine Lipgloss - Ravishing Red
                    </a>
                  </div>
                  <div className="price">1050 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/manish-malhotra-hi-shine-lipgloss-rose-lustre.html">
                      Manish Malhotra Hi-Shine Lipgloss - Rose Lustre
                    </a>
                  </div>
                  <div className="price">1050 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/manish-malhotra-hi-shine-lipgloss-copper-rose.html">
                      Manish Malhotra Hi-Shine Lipgloss - Copper Rose
                    </a>
                  </div>
                  <div className="price">1050 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/manish-malhotra-9-in-1-eyeshadow-palette-rendezvous.html">
                      Manish Malhotra 9 in 1 Eyeshadow Palette - Rendezvous
                    </a>
                  </div>
                  <div className="price">1850 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/manish-malhotra-9-in-1-eyeshadow-palette-soiree.html">
                      Manish Malhotra 9 in 1 Eyeshadow Palette - Soirée
                    </a>
                  </div>
                  <div className="price">1850 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/manish-malhotra-4-in-1-eyeshadow-palette-vice.html">
                      Manish Malhotra 4 in 1 Eyeshadow Palette - Vice
                    </a>
                  </div>
                  <div className="price">1250 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/manish-malhotra-4-in-1-eyeshadow-palette-after-8.html">
                      Manish Malhotra 4 in 1 Eyeshadow Palette - After 8
                    </a>
                  </div>
                  <div className="price">1250 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/manish-malhotra-4-in-1-eyeshadow-palette-paparazzi.html">
                      Manish Malhotra 4 in 1 Eyeshadow Palette - Paparazzi
                    </a>
                  </div>
                  <div className="price">1250 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/manish-malhotra-4-in-1-eyeshadow-palette-glitz.html">
                      Manish Malhotra 4 in 1 Eyeshadow Palette - Glitz
                    </a>
                  </div>
                  <div className="price">1250 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/manish-malhotra-4-in-1-eyeshadow-palette-front-row.html">
                      Manish Malhotra 4 in 1 Eyeshadow Palette - Front Row
                    </a>
                  </div>
                  <div className="price">1250 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/manish-malhotra-nail-lacquer-rosette.html">
                      Manish Malhotra Nail Lacquer - Rosette
                    </a>
                  </div>
                  <div className="price">450 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/manish-malhotra-nail-lacquer-scarlet-finale.html">
                      Manish Malhotra Nail Lacquer - Scarlet Finalé
                    </a>
                  </div>
                  <div className="price">450 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/manish-malhotra-nail-lacquer-champagne-rush.html">
                      Manish Malhotra Nail Lacquer - Champagne Rush
                    </a>
                  </div>
                  <div className="price">450 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/manish-malhotra-nail-lacquer-antique.html">
                      Manish Malhotra Nail Lacquer - Antique
                    </a>
                  </div>
                  <div className="price">450 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/manish-malhotra-nail-lacquer-sheer-glitz.html">
                      Manish Malhotra Nail Lacquer - Sheer Glitz
                    </a>
                  </div>
                  <div className="price">450 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/manish-malhotra-nail-lacquer-iridescent-indigo.html">
                      Manish Malhotra Nail Lacquer - Iridescent Indigo
                    </a>
                  </div>
                  <div className="price">450 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/manish-malhotra-nail-lacquer-vintage-sheen.html">
                      Manish Malhotra Nail Lacquer - Vintage Sheen
                    </a>
                  </div>
                  <div className="price">450 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/manish-malhotra-nail-lacquer-fuchsia-dreams.html">
                      Manish Malhotra Nail Lacquer - Fuchsia Dreams
                    </a>
                  </div>
                  <div className="price">450 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/manish-malhotra-nail-lacquer-chromatic-crepe.html">
                      Manish Malhotra Nail Lacquer - Chromatic Crepe
                    </a>
                  </div>
                  <div className="price">450 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/manish-malhotra-nail-lacquer-sterling-lace.html">
                      Manish Malhotra Nail Lacquer - Sterling Lace
                    </a>
                  </div>
                  <div className="price">450 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/manish-malhotra-nail-lacquer-blonde-muse.html">
                      Manish Malhotra Nail Lacquer - Blonde Muse
                    </a>
                  </div>
                  <div className="price">450 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/manish-malhotra-nail-lacquer-crushed-velour.html">
                      Manish Malhotra Nail Lacquer - Crushed Velour
                    </a>
                  </div>
                  <div className="price">450 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/manish-malhotra-nail-lacquer-blush-cashmere.html">
                      Manish Malhotra Nail Lacquer - Blush Cashmere
                    </a>
                  </div>
                  <div className="price">450 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/manish-malhotra-nail-lacquer-glitterati.html">
                      Manish Malhotra Nail Lacquer - Glitterati
                    </a>
                  </div>
                  <div className="price">450 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/manish-malhotra-nail-lacquer-teal-tale.html">
                      Manish Malhotra Nail Lacquer - Teal Tale
                    </a>
                  </div>
                  <div className="price">450 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/manish-malhotra-nail-lacquer-velvet-stardust.html">
                      Manish Malhotra Nail Lacquer - Velvet Stardust
                    </a>
                  </div>
                  <div className="price">450 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/manish-malhotra-nail-lacquer-midnight-muse.html">
                      Manish Malhotra Nail Lacquer - Midnight Muse
                    </a>
                  </div>
                  <div className="price">450 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/manish-malhotra-nail-lacquer-opulent-ocean.html">
                      Manish Malhotra Nail Lacquer - Opulent Ocean
                    </a>
                  </div>
                  <div className="price">450 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/manish-malhotra-illuminating-blush-stick-seduction.html">
                      Manish Malhotra Illuminating Blush Stick - Seduction
                    </a>
                  </div>
                  <div className="price">1250 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/manish-malhotra-illuminating-blush-stick-romance.html">
                      Manish Malhotra Illuminating Blush Stick - Romance
                    </a>
                  </div>
                  <div className="price">1250 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/manish-malhotra-illuminating-highlighter-stick-bedazzled.html">
                      Manish Malhotra Illuminating Highlighter Stick - Bedazzled
                    </a>
                  </div>
                  <div className="price">1250 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/lit-ph-lip-balm-main-squeeze.html">
                      LIT - pH Lip Balm - Main Squeeze
                    </a>
                  </div>
                  <div className="price">345 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/lit-ph-lip-balm-orange-crush.html">
                      LIT - pH Lip Balm - Orange Crush
                    </a>
                  </div>
                  <div className="price">345 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/lit-ph-lip-balm-netflix-n-chill.html">
                      LIT - pH Lip Balm - Netflix n Chill
                    </a>
                  </div>
                  <div className="price">345 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/lit-ph-lip-balm-rose-all-day.html">
                      LIT - pH Lip Balm - Rose All Day
                    </a>
                  </div>
                  <div className="price">345 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/lit-ph-lip-balm-bite-me.html">LIT - pH Lip Balm - Bite Me</a>
                  </div>
                  <div className="price">345 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/lit-ph-lip-balm-hickey.html">LIT - pH Lip Balm - Hickey</a>
                  </div>
                  <div className="price">345 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/lit-lip-eye-sparkles-crown-jewels.html">
                      LIT Lip & Eye Sparkles - Crown Jewels
                    </a>
                  </div>
                  <div className="price">445 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/lit-lip-eye-sparkles-duchess.html">
                      LIT Lip & Eye Sparkles - Duchess
                    </a>
                  </div>
                  <div className="price">445 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/lit-lip-eye-sparkles-her-royal-hotness.html">
                      LIT Lip & Eye Sparkles - Her Royal Hotness
                    </a>
                  </div>
                  <div className="price">445 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/lit-lip-eye-sparkles-kween.html">LIT Lip & Eye Sparkles - Kween</a>
                  </div>
                  <div className="price">445 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/lit-lip-eye-sparkles-regina.html">
                      LIT Lip & Eye Sparkles - Regina
                    </a>
                  </div>
                  <div className="price">445 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/lit-lip-eye-sparkles-your-grace.html">
                      LIT Lip & Eye Sparkles - Your Grace
                    </a>
                  </div>
                  <div className="price">445 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/lit-matte-lipliner-pencil-sass.html">
                      LIT Matte Lipliner Pencil - Sass
                    </a>
                  </div>
                  <div className="price">445 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/lit-matte-lipliner-pencil-bae.html">
                      LIT Matte Lipliner Pencil - Bae
                    </a>
                  </div>
                  <div className="price">445 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/lit-matte-lipliner-pencil-spoilt.html">
                      LIT Matte Lipliner Pencil - Spoilt
                    </a>
                  </div>
                  <div className="price">445 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/lit-matte-lipliner-pencil-pretty-mess.html">
                      LIT Matte Lipliner Pencil - Pretty Mess
                    </a>
                  </div>
                  <div className="price">445 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/lit-matte-lipliner-pencil-basic.html">
                      LIT Matte Lipliner Pencil - Basic
                    </a>
                  </div>
                  <div className="price">445 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/lit-matte-lipliner-pencil-blended.html">
                      LIT Matte Lipliner Pencil - Blended
                    </a>
                  </div>
                  <div className="price">445 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/lit-satin-matte-lipstick-modern-family.html">
                      LIT Satin Matte Lipstick - Modern Family
                    </a>
                  </div>
                  <div className="price">495 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/lit-satin-matte-lipstick-the-good-wife.html">
                      LIT Satin Matte Lipstick - The Good Wife
                    </a>
                  </div>
                  <div className="price">495 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/lit-satin-matte-lipstick-kuwtk.html">
                      LIT Satin Matte Lipstick - KUWTK
                    </a>
                  </div>
                  <div className="price">495 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/lit-satin-matte-lipstick-wild-wild-country.html">
                      LIT Satin Matte Lipstick - Wild Wild Country
                    </a>
                  </div>
                  <div className="price">495 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/lit-satin-matte-lipstick-two-broke-girls.html">
                      LIT Satin Matte Lipstick - Two Broke Girls
                    </a>
                  </div>
                  <div className="price">495 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/lit-satin-matte-lipstick-queen-of-the-south.html">
                      LIT Satin Matte Lipstick - Queen Of The South
                    </a>
                  </div>
                  <div className="price">495 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/lit-satin-matte-lipstick-the-affair.html">
                      LIT Satin Matte Lipstick - The Affair
                    </a>
                  </div>
                  <div className="price">495 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/lit-satin-matte-lipstick-desperate-housewives.html">
                      LIT Satin Matte Lipstick - Desperate Housewives
                    </a>
                  </div>
                  <div className="price">495 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/lit-satin-matte-lipstick-kissing-booth.html">
                      LIT Satin Matte Lipstick - Kissing Booth
                    </a>
                  </div>
                  <div className="price">495 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/lit-satin-matte-lipstick-crazy-ex-girlfriends.html">
                      LIT Satin Matte Lipstick - Crazy Ex Girlfriends
                    </a>
                  </div>
                  <div className="price">495 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/lit-satin-matte-lipstick-the-sinner.html">
                      LIT Satin Matte Lipstick - The Sinner
                    </a>
                  </div>
                  <div className="price">495 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/lit-satin-matte-lipstick-gossip-girl.html">
                      LIT Satin Matte Lipstick - Gossip Girl
                    </a>
                  </div>
                  <div className="price">495 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/lit-satin-matte-lipstick-lust-stories.html">
                      LIT Satin Matte Lipstick - Lust Stories
                    </a>
                  </div>
                  <div className="price">495 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/lit-satin-matte-lipstick-pretty-little-liars.html">
                      LIT Satin Matte Lipstick - Pretty Little Liars
                    </a>
                  </div>
                  <div className="price">495 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/lit-nail-enamel-bad-romance.html">LIT Nail Enamel - Bad Romance</a>
                  </div>
                  <div className="price">190 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/lit-nail-enamel-fomo.html">LIT Nail Enamel - FOMO</a>
                  </div>
                  <div className="price">190 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/lit-nail-enamel-no-chill.html">LIT Nail Enamel - No Chill</a>
                  </div>
                  <div className="price">190 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/lit-nail-enamel-babe.html">LIT Nail Enamel - Babe</a>
                  </div>
                  <div className="price">190 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/lit-nail-enamel-trouble-maker.html">
                      LIT Nail Enamel - Trouble Maker
                    </a>
                  </div>
                  <div className="price">190 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/lit-nail-enamel-loud-mouth.html">LIT Nail Enamel - Loud Mouth</a>
                  </div>
                  <div className="price">190 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/lit-nail-enamel-time-out.html">LIT Nail Enamel - Time Out</a>
                  </div>
                  <div className="price">190 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/lit-nail-enamel-bang-on.html">LIT Nail Enamel - Bang on</a>
                  </div>
                  <div className="price">190 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/lit-nail-enamel-commando.html">LIT Nail Enamel - Commando</a>
                  </div>
                  <div className="price">190 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/lit-nail-enamel-low-key.html">LIT Nail Enamel - Low Key</a>
                  </div>
                  <div className="price">190 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/lit-nail-enamel-hey-gurl.html">LIT Nail Enamel - Hey Gurl</a>
                  </div>
                  <div className="price">190 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/lit-nail-enamel-crushing.html">LIT Nail Enamel - Crushing</a>
                  </div>
                  <div className="price">190 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/lit-nail-enamel-say-no-more.html">LIT Nail Enamel - Say no More</a>
                  </div>
                  <div className="price">190 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/lit-nail-enamel-man-eater.html">LIT Nail Enamel - Man Eater</a>
                  </div>
                  <div className="price">190 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/lit-nail-enamel-thirsty.html">LIT Nail Enamel - Thirsty</a>
                  </div>
                  <div className="price">190 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/lit-nail-enamel-rad.html">LIT Nail Enamel - Rad</a>
                  </div>
                  <div className="price">190 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/lit-nail-enamel-boi-bye.html">LIT Nail Enamel - Boi Bye</a>
                  </div>
                  <div className="price">190 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/lit-nail-enamel-morning-after.html">
                      LIT Nail Enamel - Morning After
                    </a>
                  </div>
                  <div className="price">190 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/lit-nail-enamel-xoxo.html">LIT Nail Enamel - XOXO</a>
                  </div>
                  <div className="price">190 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/lit-nail-enamel-fling.html">LIT Nail Enamel - Fling</a>
                  </div>
                  <div className="price">190 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/lit-nail-enamel-bold-digger.html">LIT Nail Enamel - Bold Digger</a>
                  </div>
                  <div className="price">190 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/lit-nail-enamel-oh-fudge.html">LIT Nail Enamel - Oh Fudge</a>
                  </div>
                  <div className="price">190 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/lit-nail-enamel-cheap-thrills.html">
                      LIT Nail Enamel - Cheap Thrills
                    </a>
                  </div>
                  <div className="price">190 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/lit-nail-enamel-grounded.html">LIT Nail Enamel - Grounded</a>
                  </div>
                  <div className="price">190 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/lit-nail-enamel-seal-the-deal.html">
                      LIT Nail Enamel - Seal the Deal
                    </a>
                  </div>
                  <div className="price">190 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/lit-nail-enamel-groundwork.html">LIT Nail Enamel - Groundwork</a>
                  </div>
                  <div className="price">190 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/lit-matte-eyeliner-pencil-mood.html">
                      LIT Matte Eyeliner Pencil - Mood
                    </a>
                  </div>
                  <div className="price">445 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/lit-matte-eyeliner-pencil-on-fleek.html">
                      LIT Matte Eyeliner Pencil - On Fleek
                    </a>
                  </div>
                  <div className="price">445 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/lit-matte-eyeliner-pencil-girl-crush.html">
                      LIT Matte Eyeliner Pencil - Girl Crush
                    </a>
                  </div>
                  <div className="price">445 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/lit-matte-eyeliner-pencil-prom-night.html">
                      LIT Matte Eyeliner Pencil - Prom Night
                    </a>
                  </div>
                  <div className="price">445 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/lit-matte-eyeliner-pencil-yass.html">
                      LIT Matte Eyeliner Pencil - Yass
                    </a>
                  </div>
                  <div className="price">445 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/lit-matte-eyeliner-pencil-slay.html">
                      LIT Matte Eyeliner Pencil - Slay
                    </a>
                  </div>
                  <div className="price">445 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/lit-matte-eyeliner-pencil-wicked.html">
                      LIT Matte Eyeliner Pencil - Wicked
                    </a>
                  </div>
                  <div className="price">445 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/lit-matte-eyeliner-pencil-savage.html">
                      LIT Matte Eyeliner Pencil - Savage
                    </a>
                  </div>
                  <div className="price">445 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/stay-defined-nutmeg-and-espresso.html">
                      Stay Defined Liquid Eyeliner Brow Powder - Nutmeg & Espresso
                    </a>
                  </div>
                  <div className="price">1095 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/total-makeover-ff-cream-cappuccino.html">
                      Total Makeover FF Cream Foundation Palette - Cappuccino
                    </a>
                  </div>
                  <div className="price">1450 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/total-makeover-ff-cream-hazelnut.html">
                      Total Makeover FF Cream Foundation Palette - Hazelnut
                    </a>
                  </div>
                  <div className="price">1450 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/wanderlust-air.html">Wanderlust Gel Nail Polish - Air</a>
                  </div>
                  <div className="price">390 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/wanderlust-fresco.html">Wanderlust Gel Nail Polish - Fresco</a>
                  </div>
                  <div className="price">390 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/wanderlust-siesta.html">Wanderlust Gel Nail Polish - Siesta</a>
                  </div>
                  <div className="price">390 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/wanderlust-gel-nail-polish-queen-of-night.html">
                      Wanderlust Gel Nail Polish - Queen of Night
                    </a>
                  </div>
                  <div className="price">390 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/wanderlust-bordeaux.html">
                      Wanderlust Matte Nail Polish - Bordeaux
                    </a>
                  </div>
                  <div className="price">390 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/wanderlust-arabian-mystery.html">
                      Wanderlust Gel Nail Polish - Arabian Mystery
                    </a>
                  </div>
                  <div className="price">390 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/wanderlust-aspen.html">Wanderlust Matte Nail Polish - Aspen</a>
                  </div>
                  <div className="price">390 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/wanderlust-allure.html">Wanderlust Gel Nail Polish - Allure</a>
                  </div>
                  <div className="price">390 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/wanderlust-casablanca.html">
                      Wanderlust Matte Nail Polish - Casablanca
                    </a>
                  </div>
                  <div className="price">390 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/wanderlust-burning-love.html">
                      Wanderlust Gel Nail Polish - Burning Love
                    </a>
                  </div>
                  <div className="price">390 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/wanderlust-cape-town.html">
                      Wanderlust Matte Nail Polish - Cape Town
                    </a>
                  </div>
                  <div className="price">390 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/wanderlust-burgandy-lace.html">
                      Wanderlust Gel Nail Polish - Burgandy Lace
                    </a>
                  </div>
                  <div className="price">390 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/wanderlust-tokyo.html">Wanderlust Matte Nail Polish - Tokyo</a>
                  </div>
                  <div className="price">390 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/wanderlust-mistress.html">Wanderlust Gel Nail Polish - Mistress</a>
                  </div>
                  <div className="price">390 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/wanderlust-fiji.html">Wanderlust Matte Nail Polish - Fiji</a>
                  </div>
                  <div className="price">390 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/wanderlust-tango.html">Wanderlust Gel Nail Polish - Tango</a>
                  </div>
                  <div className="price">390 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/wanderlust-provence.html">
                      Wanderlust Matte Nail Polish - Provence
                    </a>
                  </div>
                  <div className="price">390 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/wanderlust-moonglow.html">Wanderlust Gel Nail Polish - Moonglow</a>
                  </div>
                  <div className="price">390 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/wanderlust-cairo.html">Wanderlust Matte Nail Polish - Cairo</a>
                  </div>
                  <div className="price">390 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/wanderlust-claudia.html">Wanderlust Gel Nail Polish - Claudia</a>
                  </div>
                  <div className="price">390 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/two-of-your-kind-sorcery.html">
                      Two of Your Kind Nail Polish Duo - Sorcery
                    </a>
                  </div>
                  <div className="price">390 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/two-of-your-kind-supernatural.html">
                      Two of Your Kind Nail Polish Duo - Supernatural
                    </a>
                  </div>
                  <div className="price">390 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/two-of-your-kind-celestial.html">
                      Two of Your Kind Nail Polish Duo - Celestial
                    </a>
                  </div>
                  <div className="price">390 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/two-of-your-kind-bewitched.html">
                      Two of Your Kind Nail Polish Duo - Bewitched
                    </a>
                  </div>
                  <div className="price">390 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/lit-2-in-1-liquid-matte-lipstick-social-butterfly.html">
                      LIT 2 in 1 Liquid Matte Lipstick - Social Butterfly
                    </a>
                  </div>
                  <div className="price">545 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/lit-2-in-1-liquid-matte-lipstick-boss-babe.html">
                      LIT 2 in 1 Liquid Matte Lipstick - Boss Babe
                    </a>
                  </div>
                  <div className="price">545 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/lit-2-in-1-liquid-matte-lipstick-heartbreaker.html">
                      LIT 2 in 1 Liquid Matte Lipstick - Heartbreaker
                    </a>
                  </div>
                  <div className="price">545 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/lit-2-in-1-liquid-matte-lipstick-funny-gurl.html">
                      LIT 2 in 1 Liquid Matte Lipstick - Funny Gurl
                    </a>
                  </div>
                  <div className="price">545 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/lit-2-in-1-liquid-matte-lipstick-hot-mama.html">
                      LIT 2 in 1 Liquid Matte Lipstick - Hot Mama
                    </a>
                  </div>
                  <div className="price">545 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/lit-2-in-1-liquid-matte-lipstick-flower-child.html">
                      LIT 2 in 1 Liquid Matte Lipstick - Flower Child
                    </a>
                  </div>
                  <div className="price">545 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/lit-2-in-1-liquid-matte-lipstick-firecracker.html">
                      LIT 2 in 1 Liquid Matte Lipstick - Firecracker
                    </a>
                  </div>
                  <div className="price">545 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/lit-2-in-1-liquid-matte-lipstick-stargazer.html">
                      LIT 2 in 1 Liquid Matte Lipstick - Stargazer
                    </a>
                  </div>
                  <div className="price">545 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/lit-2-in-1-liquid-matte-lipstick-uncensored.html">
                      LIT 2 in 1 Liquid Matte Lipstick - Uncensored
                    </a>
                  </div>
                  <div className="price">545 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/lit-2-in-1-liquid-matte-lipstick-overachiever.html">
                      LIT 2 in 1 Liquid Matte Lipstick - Overachiever
                    </a>
                  </div>
                  <div className="price">545 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/lit-2-in-1-liquid-matte-lipstick-alpha-female.html">
                      LIT 2 in 1 Liquid Matte Lipstick - Alpha Female
                    </a>
                  </div>
                  <div className="price">545 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/lit-2-in-1-liquid-matte-lipstick-miss-independent.html">
                      LIT 2 in 1 Liquid Matte Lipstick - Miss Independent
                    </a>
                  </div>
                  <div className="price">545 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/spotlight-rouge.html">Spotlight Illuminating Liquid - Rouge</a>
                  </div>
                  <div className="price">1195 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/spotlight-stardust.html">
                      Spotlight Illuminating Liquid - Stardust
                    </a>
                  </div>
                  <div className="price">1195 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/spotlight-sunkissed.html">
                      Spotlight Illuminating Liquid - Sunkissed
                    </a>
                  </div>
                  <div className="price">1195 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/manish-malhotra-soft-matte-lipstick-flirty-fuchsia.html">
                      Manish Malhotra Soft Matte Lipstick - Flirty Fuchsia
                    </a>
                  </div>
                  <div className="price">950 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/manish-malhotra-soft-matte-lipstick-velvet-wine.html">
                      Manish Malhotra Soft Matte Lipstick - Velvet Wine
                    </a>
                  </div>
                  <div className="price">950 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/manish-malhotra-soft-matte-lipstick-romantic-rouge.html">
                      Manish Malhotra Soft Matte Lipstick - Romantic Rouge
                    </a>
                  </div>
                  <div className="price">950 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/manish-malhotra-soft-matte-lipstick-poppy-pink.html">
                      Manish Malhotra Soft Matte Lipstick - Poppy Pink
                    </a>
                  </div>
                  <div className="price">950 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/manish-malhotra-soft-matte-lipstick-berry-fantasy.html">
                      Manish Malhotra Soft Matte Lipstick - Berry Fantasy
                    </a>
                  </div>
                  <div className="price">950 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/manish-malhotra-soft-matte-lipstick-pink-passion.html">
                      Manish Malhotra Soft Matte Lipstick - Pink Passion
                    </a>
                  </div>
                  <div className="price">950 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/manish-malhotra-soft-matte-lipstick-eternal-rose.html">
                      Manish Malhotra Soft Matte Lipstick - Eternal Rose
                    </a>
                  </div>
                  <div className="price">950 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/manish-malhotra-soft-matte-lipstick-cocoa-butter.html">
                      Manish Malhotra Soft Matte Lipstick - Cocoa Butter
                    </a>
                  </div>
                  <div className="price">950 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/manish-malhotra-soft-matte-lipstick-blush-rose.html">
                      Manish Malhotra Soft Matte Lipstick - Blush Rose
                    </a>
                  </div>
                  <div className="price">950 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/manish-malhotra-soft-matte-lipstick-candy-crush.html">
                      Manish Malhotra Soft Matte Lipstick - Candy Crush
                    </a>
                  </div>
                  <div className="price">950 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/manish-malhotra-soft-matte-lipstick-coral-affair.html">
                      Manish Malhotra Soft Matte Lipstick - Coral Affair
                    </a>
                  </div>
                  <div className="price">950 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/manish-malhotra-soft-matte-lipstick-violet-dream.html">
                      Manish Malhotra Soft Matte Lipstick - Violet Dream
                    </a>
                  </div>
                  <div className="price">950 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/manish-malhotra-soft-matte-lipstick-burnt-love.html">
                      Manish Malhotra Soft Matte Lipstick - Burnt Love
                    </a>
                  </div>
                  <div className="price">950 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/manish-malhotra-soft-matte-lipstick-lavender-dream.html">
                      Manish Malhotra Soft Matte Lipstick - Lavender Dream
                    </a>
                  </div>
                  <div className="price">950 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/manish-malhotra-soft-matte-lipstick-burnt-rust.html">
                      Manish Malhotra Soft Matte Lipstick - Burnt Rust
                    </a>
                  </div>
                  <div className="price">950 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/lit-creamy-matte-lipstick-manhattan.html">
                      LIT Creamy Matte Lipstick - Manhattan
                    </a>
                  </div>
                  <div className="price">595 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/lit-creamy-matte-lipstick-appletini.html">
                      LIT Creamy Matte Lipstick - Appletini
                    </a>
                  </div>
                  <div className="price">595 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/lit-creamy-matte-lipstick-rossini.html">
                      LIT Creamy Matte Lipstick - Rossini
                    </a>
                  </div>
                  <div className="price">595 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/lit-creamy-matte-lipstick-bloody-mary.html">
                      LIT Creamy Matte Lipstick - Bloody Mary
                    </a>
                  </div>
                  <div className="price">595 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/lit-creamy-matte-lipstick-tequila-sunrise.html">
                      LIT Creamy Matte Lipstick - Tequila Sunrise
                    </a>
                  </div>
                  <div className="price">595 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/lit-creamy-matte-lipstick-bellini.html">
                      LIT Creamy Matte Lipstick - Bellini
                    </a>
                  </div>
                  <div className="price">595 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/lit-creamy-matte-lipstick-sangria.html">
                      LIT Creamy Matte Lipstick - Sangria
                    </a>
                  </div>
                  <div className="price">595 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/lit-creamy-matte-lipstick-hanky-panky.html">
                      LIT Creamy Matte Lipstick - Hanky Panky
                    </a>
                  </div>
                  <div className="price">595 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/lit-creamy-matte-lipstick-pink-daiquiri.html">
                      LIT Creamy Matte Lipstick - Pink Daiquiri
                    </a>
                  </div>
                  <div className="price">595 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/lit-creamy-matte-lipstick-purple-martini.html">
                      LIT Creamy Matte Lipstick - Purple Martini
                    </a>
                  </div>
                  <div className="price">595 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/lit-creamy-matte-lipstick-old-fashion.html">
                      LIT Creamy Matte Lipstick - Old Fashion
                    </a>
                  </div>
                  <div className="price">595 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/lit-creamy-matte-lipstick-mimosa.html">
                      LIT Creamy Matte Lipstick - Mimosa
                    </a>
                  </div>
                  <div className="price">595 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/lit-radiant-matte-compact-serving-face.html">
                      LIT Radiant Matte Compact Powder - Serving Face
                    </a>
                  </div>
                  <div className="price">495 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/lit-radiant-matte-compact-beat.html">
                      LIT Radiant Matte Compact Powder - Beat
                    </a>
                  </div>
                  <div className="price">495 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/lit-radiant-matte-compact-snatched.html">
                      LIT Radiant Matte Compact Powder - Snatched
                    </a>
                  </div>
                  <div className="price">495 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/manish-malhotra-hi-shine-lipstick-old-rose.html">
                      Manish Malhotra Hi-Shine Lipstick - Old Rose
                    </a>
                  </div>
                  <div className="price">950 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/manish-malhotra-hi-shine-lipstick-fuchsia-fantasy.html">
                      Manish Malhotra Hi-Shine Lipstick - Fuchsia Fantasy
                    </a>
                  </div>
                  <div className="price">950 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/manish-malhotra-hi-shine-lipstick-rose-romance.html">
                      Manish Malhotra Hi-Shine Lipstick - Rose Romance
                    </a>
                  </div>
                  <div className="price">950 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/manish-malhotra-hi-shine-lipstick-radiant-red.html">
                      Manish Malhotra Hi-Shine Lipstick - Radiant Red
                    </a>
                  </div>
                  <div className="price">950 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/manish-malhotra-hi-shine-lipstick-violet-mystery.html">
                      Manish Malhotra Hi-Shine Lipstick - Violet Mystery
                    </a>
                  </div>
                  <div className="price">950 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/pose-hd-blush-duo-coral-punch.html">
                      POSE HD Blush Duo - Coral | Punch
                    </a>
                  </div>
                  <div className="price">699 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/pose-hd-highlighter-duo-champagne-rose-gold.html">
                      POSE HD Highlighter Duo - Champagne | Rose Gold
                    </a>
                  </div>
                  <div className="price">699 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/pose-hd-banana-powder-yellow.html">
                      POSE HD Banana Powder - Yellow
                    </a>
                  </div>
                  <div className="price">699 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/pose-hd-bronzer-duo-cinnamon-teracotta.html">
                      POSE HD Bronzer Duo - Cinnamon | Teracotta
                    </a>
                  </div>
                  <div className="price">699 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/pose-hd-setting-powder-ivory.html">
                      POSE HD Setting Powder - Ivory
                    </a>
                  </div>
                  <div className="price">699 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/pose-hd-lipstick-merlot.html">POSE HD Lipstick - Merlot</a>
                  </div>
                  <div className="price">599 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/pose-hd-lipstick-true-red.html">POSE HD Lipstick - True Red</a>
                  </div>
                  <div className="price">599 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/pose-hd-lipstick-deep-pink.html">POSE HD Lipstick - Deep Pink</a>
                  </div>
                  <div className="price">599 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/pose-hd-lipstick-burgundy.html">POSE HD Lipstick - Burgundy</a>
                  </div>
                  <div className="price">599 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/pose-hd-lipstick-mahogany.html">POSE HD Lipstick - Mahogany</a>
                  </div>
                  <div className="price">599 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/pose-hd-lipstick-rose-pink.html">POSE HD Lipstick - Rose Pink</a>
                  </div>
                  <div className="price">599 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/pose-hd-lipstick-muted-brown.html">
                      POSE HD Lipstick - Muted Brown
                    </a>
                  </div>
                  <div className="price">599 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/pose-hd-lipstick-nude-mauve.html">POSE HD Lipstick - Nude Mauve</a>
                  </div>
                  <div className="price">599 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/pose-hd-lipstick-dark-brown.html">POSE HD Lipstick - Dark Brown</a>
                  </div>
                  <div className="price">599 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/pose-hd-lipstick-raspberry.html">POSE HD Lipstick - Raspberry</a>
                  </div>
                  <div className="price">599 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/pose-hd-lipstick-rich-rose.html">POSE HD Lipstick - Rich Rose</a>
                  </div>
                  <div className="price">599 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/pose-hd-lipstick-soft-pink.html">POSE HD Lipstick - Soft Pink</a>
                  </div>
                  <div className="price">599 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/pose-hd-lipstick-peach-pink.html">POSE HD Lipstick - Peach Pink</a>
                  </div>
                  <div className="price">599 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/pose-hd-lipstick-deep-rose-red.html">
                      POSE HD Lipstick - Deep Rose Red
                    </a>
                  </div>
                  <div className="price">599 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/pose-hd-lipstick-caramel.html">POSE HD Lipstick - Caramel</a>
                  </div>
                  <div className="price">599 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/pose-hd-lipstick-carmine-red.html">
                      POSE HD Lipstick - Carmine Red
                    </a>
                  </div>
                  <div className="price">599 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/pose-hd-lipstick-muted-coral.html">
                      POSE HD Lipstick - Muted Coral
                    </a>
                  </div>
                  <div className="price">599 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/pose-hd-lipstick-cranberry.html">POSE HD Lipstick - Cranberry</a>
                  </div>
                  <div className="price">599 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/pose-hd-lipstick-brick-red.html">POSE HD Lipstick - Brick Red</a>
                  </div>
                  <div className="price">599 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/pose-hd-lipstick-ripe-grape.html">POSE HD Lipstick - Ripe Grape</a>
                  </div>
                  <div className="price">599 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/chisel-it-poker-face.html">Chisel It Contour Kit - Poker Face</a>
                  </div>
                  <div className="price">1250 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/chisel-it-face-value.html">Chisel It Contour Kit - Face Value</a>
                  </div>
                  <div className="price">1250 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/magic-potion.html">Magic Potion</a>
                  </div>
                  <div className="price">995 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/lit-brow-definer-pencil.html">LIT Brow Definer Pencil</a>
                  </div>
                  <div className="price">495 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/tint-it-up-fever.html">Tint It Up - Fever</a>
                  </div>
                  <div className="price">695 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/tint-it-up-flushed.html">Tint It Up - Flushed</a>
                  </div>
                  <div className="price">695 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/tint-it-up-frolic.html">Tint It Up - Frolic</a>
                  </div>
                  <div className="price">695 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/tint-it-up-fleur.html">Tint It Up - Fleur</a>
                  </div>
                  <div className="price">695 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/lit-single-liquid-matte-lipsticks-fbo.html">
                      LIT Liquid Matte Lipstick - FBO
                    </a>
                  </div>
                  <div className="price">395 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/lit-single-liquid-matte-lipsticks-lovebomb.html">
                      LIT Liquid Matte Lipstick - Lovebomb
                    </a>
                  </div>
                  <div className="price">395 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/lit-single-liquid-matte-lipsticks-catfish.html">
                      LIT Liquid Matte Lipstick - Catfish
                    </a>
                  </div>
                  <div className="price">395 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/lit-single-liquid-matte-lipsticks-breadcrumb.html">
                      LIT Liquid Matte Lipstick - Breadcrumb
                    </a>
                  </div>
                  <div className="price">395 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/lit-single-liquid-matte-lipsticks-matrimania.html">
                      LIT Liquid Matte Lipstick - Matrimania
                    </a>
                  </div>
                  <div className="price">395 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/lit-single-liquid-matte-lipsticks-thirst-trap.html">
                      LIT Liquid Matte Lipstick - Thirst Trap
                    </a>
                  </div>
                  <div className="price">395 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/lit-single-liquid-matte-lipsticks-benched.html">
                      LIT Liquid Matte Lipstick - Benched
                    </a>
                  </div>
                  <div className="price">395 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/lit-single-liquid-matte-lipsticks-slow-fade.html">
                      LIT Liquid Matte Lipstick - Slow Fade
                    </a>
                  </div>
                  <div className="price">395 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/lit-single-liquid-matte-lipsticks-swipe-right.html">
                      LIT Liquid Matte Lipstick - Swipe Right
                    </a>
                  </div>
                  <div className="price">395 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/lit-single-liquid-matte-lipsticks-dtf.html">
                      LIT Liquid Matte Lipstick - DTF
                    </a>
                  </div>
                  <div className="price">395 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/lit-single-liquid-matte-lipsticks-burner.html">
                      LIT Liquid Matte Lipstick - Burner
                    </a>
                  </div>
                  <div className="price">395 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/lit-single-liquid-matte-lipsticks-draking.html">
                      LIT Liquid Matte Lipstick - Draking
                    </a>
                  </div>
                  <div className="price">395 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/lit-single-liquid-matte-lipsticks-ghosted.html">
                      LIT Liquid Matte Lipstick - Ghosted
                    </a>
                  </div>
                  <div className="price">395 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/lit-single-liquid-matte-lipsticks-dtr.html">
                      LIT Liquid Matte Lipstick - DTR
                    </a>
                  </div>
                  <div className="price">395 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/lit-single-liquid-matte-lipsticks-cuffing.html">
                      LIT Liquid Matte Lipstick - Cuffing
                    </a>
                  </div>
                  <div className="price">395 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/kplay-flavoured-lipstick-blueberry-rush.html">
                      K.Play Flavoured Lipstick - Blueberry Rush
                    </a>
                  </div>
                  <div className="price">545 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/kplay-flavoured-lipstick-apple-crunch.html">
                      K.Play Flavoured Lipstick - Apple Crunch
                    </a>
                  </div>
                  <div className="price">545 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/kplay-flavoured-lipstick-raspberry-punch.html">
                      K.Play Flavoured Lipstick - Raspberry Punch
                    </a>
                  </div>
                  <div className="price">545 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/kplay-flavoured-lipstick-cranberry-twist.html">
                      K.Play Flavoured Lipstick - Cranberry Twist
                    </a>
                  </div>
                  <div className="price">545 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/kplay-flavoured-lipstick-passion-fruit-crush.html">
                      K.Play Flavoured Lipstick - Passion Fruit Crush
                    </a>
                  </div>
                  <div className="price">545 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/kplay-flavoured-lipstick-melon-squeeze.html">
                      K.Play Flavoured Lipstick - Melon Squeeze
                    </a>
                  </div>
                  <div className="price">545 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/kplay-flavoured-lipstick-berry-blast.html">
                      K.Play Flavoured Lipstick - Berry Blast
                    </a>
                  </div>
                  <div className="price">545 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/kplay-flavoured-lipstick-lychee-twirl.html">
                      K.Play Flavoured Lipstick - Lychee Twirl
                    </a>
                  </div>
                  <div className="price">545 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/kplay-flavoured-lipstick-mango-swirl.html">
                      K.Play Flavoured Lipstick - Mango Swirl
                    </a>
                  </div>
                  <div className="price">545 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/kplay-flavoured-lipstick-cherry-burst.html">
                      K.Play Flavoured Lipstick - Cherry Burst
                    </a>
                  </div>
                  <div className="price">545 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/kplay-flavoured-lipstick-pink-guava-smash.html">
                      K.Play Flavoured Lipstick - Pink Guava Smash
                    </a>
                  </div>
                  <div className="price">545 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/kplay-flavoured-lipstick-orange-spin.html">
                      K.Play Flavoured Lipstick - Orange Spin
                    </a>
                  </div>
                  <div className="price">545 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/kplay-flavoured-blush-frozen-raspberry.html">
                      K.Play Flavoured Blush - Frozen Raspberry
                    </a>
                  </div>
                  <div className="price">645 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/kplay-flavoured-blush-juicy-strawberry.html">
                      K.Play Flavoured Blush - Juicy Strawberry
                    </a>
                  </div>
                  <div className="price">645 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/kplay-flavoured-blush-sweet-peach.html">
                      K.Play Flavoured Blush - Sweet Peach
                    </a>
                  </div>
                  <div className="price">645 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/kplay-flavoured-highlighter-ripe-melon.html">
                      K.Play Flavoured Highlighter - Ripe Melon
                    </a>
                  </div>
                  <div className="price">645 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/kplay-flavoured-highlighter-pink-rose.html">
                      K.Play Flavoured Highlighter - Pink Rose
                    </a>
                  </div>
                  <div className="price">645 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/kplay-flavoured-compact.html">K.Play Flavoured Compact</a>
                  </div>
                  <div className="price">645 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/kplay-flavoured-lipgloss-blueberry-rush.html">
                      K.Play Flavoured Lipgloss - Blueberry Rush
                    </a>
                  </div>
                  <div className="price">595 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/kplay-flavoured-lipgloss-apple-crunch.html">
                      K.Play Flavoured Lipgloss - Apple Crunch
                    </a>
                  </div>
                  <div className="price">595 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/kplay-flavoured-lipgloss-raspberry-punch.html">
                      K.Play Flavoured Lipgloss - Raspberry Punch
                    </a>
                  </div>
                  <div className="price">595 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/kplay-flavoured-lipgloss-cranberry-twist.html">
                      K.Play Flavoured Lipgloss - Cranberry Twist
                    </a>
                  </div>
                  <div className="price">595 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/kplay-flavoured-lipgloss-passion-fruit-crush.html">
                      K.Play Flavoured Lipgloss - Passion Fruit Crush
                    </a>
                  </div>
                  <div className="price">595 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/kplay-flavoured-lipgloss-melon-squeeze.html">
                      K.Play Flavoured Lipgloss - Melon Squeeze
                    </a>
                  </div>
                  <div className="price">595 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/kplay-flavoured-lipgloss-berry-blast.html">
                      K.Play Flavoured Lipgloss - Berry Blast
                    </a>
                  </div>
                  <div className="price">595 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/kplay-flavoured-lipgloss-lychee-twirl.html">
                      K.Play Flavoured Lipgloss - Lychee Twirl
                    </a>
                  </div>
                  <div className="price">595 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/kplay-flavoured-lipgloss-mango-swirl.html">
                      K.Play Flavoured Lipgloss - Mango Swirl
                    </a>
                  </div>
                  <div className="price">595 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/kplay-flavoured-lipgloss-cherry-burst.html">
                      K.Play Flavoured Lipgloss - Cherry Burst
                    </a>
                  </div>
                  <div className="price">595 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/kplay-flavoured-lipgloss-pink-guava-smash.html">
                      K.Play Flavoured Lipgloss - Pink Guava Smash
                    </a>
                  </div>
                  <div className="price">595 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/kplay-flavoured-lipgloss-orange-spin.html">
                      K.Play Flavoured Lipgloss - Orange Spin
                    </a>
                  </div>
                  <div className="price">595 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/manish-malhotra-liquid-matte-lipstick-caramel-quest.html">
                      Manish Malhotra Liquid Matte Lipstick - Caramel Quest
                    </a>
                  </div>
                  <div className="price">995 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/manish-malhotra-liquid-matte-lipstick-mess-with-me.html">
                      Manish Malhotra Liquid Matte Lipstick - Mess With Me
                    </a>
                  </div>
                  <div className="price">995 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/manish-malhotra-liquid-matte-lipstick-girl-code.html">
                      Manish Malhotra Liquid Matte Lipstick - Girl Code
                    </a>
                  </div>
                  <div className="price">995 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/manish-malhotra-liquid-matte-lipstick-talk-to-me.html">
                      Manish Malhotra Liquid Matte Lipstick - Talk To Me
                    </a>
                  </div>
                  <div className="price">995 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/manish-malhotra-liquid-matte-lipstick-sugar-coral.html">
                      Manish Malhotra Liquid Matte Lipstick - Sugar Coral
                    </a>
                  </div>
                  <div className="price">995 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/manish-malhotra-liquid-matte-lipstick-crazier-than-pink.html">
                      Manish Malhotra Liquid Matte Lipstick - Crazier Than Pink
                    </a>
                  </div>
                  <div className="price">995 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/manish-malhotra-liquid-matte-lipstick-playfull-kiss.html">
                      Manish Malhotra Liquid Matte Lipstick - Playfull Kiss
                    </a>
                  </div>
                  <div className="price">995 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/manish-malhotra-liquid-matte-lipstick-rumor-has-it.html">
                      Manish Malhotra Liquid Matte Lipstick - Rumor Has It
                    </a>
                  </div>
                  <div className="price">995 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/manish-malhotra-liquid-matte-lipstick-eyes-on-me.html">
                      Manish Malhotra Liquid Matte Lipstick - Eyes On Me
                    </a>
                  </div>
                  <div className="price">995 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/manish-malhotra-liquid-matte-lipstick-envy-me.html">
                      Manish Malhotra Liquid Matte Lipstick - Envy Me
                    </a>
                  </div>
                  <div className="price">995 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/manish-malhotra-liquid-matte-lipstick-wild-queen.html">
                      Manish Malhotra Liquid Matte Lipstick - Wild Queen
                    </a>
                  </div>
                  <div className="price">995 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/manish-malhotra-liquid-matte-lipstick-night-aura.html">
                      Manish Malhotra Liquid Matte Lipstick - Night Aura
                    </a>
                  </div>
                  <div className="price">995 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/xoxo-pearly-lipgloss-roman-holiday.html">
                      XOXO Pearly Lipgloss - Roman Holiday
                    </a>
                  </div>
                  <div className="price">395 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/lit-liquid-matte-lipstick-rbomb.html">
                      LIT Liquid Matte Lipstick - Rbomb
                    </a>
                  </div>
                  <div className="price">395 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/lit-liquid-matte-lipstick-pie-hunt.html">
                      LIT Liquid Matte Lipstick - Pie Hunt
                    </a>
                  </div>
                  <div className="price">395 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/lit-liquid-matte-lipstick-booty-call.html">
                      LIT Liquid Matte Lipstick - Booty Call
                    </a>
                  </div>
                  <div className="price">395 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/lit-liquid-matte-lipstick-boo.html">
                      LIT Liquid Matte Lipstick - Boo
                    </a>
                  </div>
                  <div className="price">395 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/lit-liquid-matte-lipstick-stashing.html">
                      LIT Liquid Matte Lipstick - Stashing
                    </a>
                  </div>
                  <div className="price">395 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/lit-liquid-matte-lipstick-smash.html">
                      LIT Liquid Matte Lipstick - Smash
                    </a>
                  </div>
                  <div className="price">395 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/lit-liquid-matte-lipstick-microcheating.html">
                      LIT Liquid Matte Lipstick - Microcheating
                    </a>
                  </div>
                  <div className="price">395 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/lit-liquid-matte-lipstick-ship.html">
                      LIT Liquid Matte Lipstick - Ship
                    </a>
                  </div>
                  <div className="price">395 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/lit-liquid-matte-lipstick-snacc.html">
                      LIT Liquid Matte Lipstick - Snacc
                    </a>
                  </div>
                  <div className="price">395 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/lit-liquid-matte-lipstick-super-swipe.html">
                      LIT Liquid Matte Lipstick - Super Swipe
                    </a>
                  </div>
                  <div className="price">395 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/lit-liquid-matte-lipstick-dm-slide.html">
                      LIT Liquid Matte Lipstick - DM Slide
                    </a>
                  </div>
                  <div className="price">395 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/lit-liquid-matte-lipstick-cu.html">
                      LIT Liquid Matte Lipstick - CU46
                    </a>
                  </div>
                  <div className="price">395 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/lit-liquid-matte-lipstick-curve.html">
                      LIT Liquid Matte Lipstick - Curve
                    </a>
                  </div>
                  <div className="price">395 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/lit-liquid-matte-lipstick-hook-up.html">
                      LIT Liquid Matte Lipstick - Hook Up
                    </a>
                  </div>
                  <div className="price">395 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/lit-liquid-matte-lipstick-swinger.html">
                      LIT Liquid Matte Lipstick - Swinger
                    </a>
                  </div>
                  <div className="price">395 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/manish-malhotra-9-in-1-eyeshadow-palette-enchant.html">
                      Manish Malhotra 9 in 1 Eyeshadow Palette - Enchanté
                    </a>
                  </div>
                  <div className="price">1850 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/manish-malhotra-glitter-eyeliner-black-moon.html">
                      Manish Malhotra Glitter Eyeliner - Black Moon
                    </a>
                  </div>
                  <div className="price">850 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/manish-malhotra-glitter-eyeliner-dazzle.html">
                      Manish Malhotra Glitter Eyeliner - Dazzle
                    </a>
                  </div>
                  <div className="price">850 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/manish-malhotra-glitter-eyeliner-jade-forest.html">
                      Manish Malhotra Glitter Eyeliner - Jade Forest
                    </a>
                  </div>
                  <div className="price">850 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/manish-malhotra-glitter-eyeliner-galaxy-blue.html">
                      Manish Malhotra Glitter Eyeliner - Galaxy Blue
                    </a>
                  </div>
                  <div className="price">850 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/lit-matte-nail-enamel-boujee.html">
                      LIT Matte Nail Enamel - Boujee
                    </a>
                  </div>
                  <div className="price">220 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/lit-matte-nail-enamel-extra.html">LIT Matte Nail Enamel - Extra</a>
                  </div>
                  <div className="price">220 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/lit-matte-nail-enamel-salty.html">LIT Matte Nail Enamel - Salty</a>
                  </div>
                  <div className="price">220 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/lit-matte-nail-enamel-turnt.html">LIT Matte Nail Enamel - Turnt</a>
                  </div>
                  <div className="price">220 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/lit-matte-nail-enamel-banger.html">
                      LIT Matte Nail Enamel - Banger
                    </a>
                  </div>
                  <div className="price">220 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/lit-matte-nail-enamel-call-it-clout.html">
                      LIT Matte Nail Enamel - Call It Clout
                    </a>
                  </div>
                  <div className="price">220 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/lit-matte-nail-enamel-kiki.html">LIT Matte Nail Enamel - Kiki</a>
                  </div>
                  <div className="price">220 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/lit-matte-nail-enamel-tea.html">LIT Matte Nail Enamel - Tea</a>
                  </div>
                  <div className="price">220 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/lit-matte-nail-enamel-clapback.html">
                      LIT Matte Nail Enamel - Clapback
                    </a>
                  </div>
                  <div className="price">220 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/lit-matte-nail-enamel-og.html">LIT Matte Nail Enamel - OG</a>
                  </div>
                  <div className="price">220 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/lit-matte-nail-enamel-adulting.html">
                      LIT Matte Nail Enamel - Adulting
                    </a>
                  </div>
                  <div className="price">220 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/lit-matte-nail-enamel-finsta.html">
                      LIT Matte Nail Enamel - Finsta
                    </a>
                  </div>
                  <div className="price">220 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/lit-matte-nail-enamel-twerk.html">LIT Matte Nail Enamel - Twerk</a>
                  </div>
                  <div className="price">220 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/lit-matte-nail-enamel-bye-felicia.html">
                      LIT Matte Nail Enamel - Bye Felicia
                    </a>
                  </div>
                  <div className="price">220 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/lit-matte-nail-enamel-flex.html">LIT Matte Nail Enamel - Flex</a>
                  </div>
                  <div className="price">220 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/manish-malhotra-metallic-chalk-rose-radiance.html">
                      Manish Malhotra Metallic Chalk - Rose Radiance
                    </a>
                  </div>
                  <div className="price">890 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/manish-malhotra-metallic-chalk-gold-touch.html">
                      Manish Malhotra Metallic Chalk - Gold Touch
                    </a>
                  </div>
                  <div className="price">890 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/manish-malhotra-metallic-chalk-violet-rush.html">
                      Manish Malhotra Metallic Chalk - Violet Rush
                    </a>
                  </div>
                  <div className="price">890 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/manish-malhotra-metallic-chalk-copper-burn.html">
                      Manish Malhotra Metallic Chalk - Copper Burn
                    </a>
                  </div>
                  <div className="price">890 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/manish-malhotra-metallic-chalk-scarlet-siren.html">
                      Manish Malhotra Metallic Chalk - Scarlet Siren
                    </a>
                  </div>
                  <div className="price">890 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/manish-malhotra-glitter-mascara-topcoat.html">
                      Manish Malhotra Glitter Mascara Topcoat
                    </a>
                  </div>
                  <div className="price">950 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/manish-malhotra-face-body-highlighter.html">
                      Manish Malhotra Face & Body Highlighter
                    </a>
                  </div>
                  <div className="price">1250 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/eye-tapered-blender-brush.html">Eye Tapered Blender Brush</a>
                  </div>
                  <div className="price">1050 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/powder-brush.html">Powder Brush</a>
                  </div>
                  <div className="price">1295 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/eye-blender-brush.html">Eye Blender Brush</a>
                  </div>
                  <div className="price">850 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/eye-shader-brush.html">Eye Shader Brush</a>
                  </div>
                  <div className="price">850 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/flat-foundation-brush.html">Flat Foundation Brush</a>
                  </div>
                  <div className="price">1150 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/lip-brush.html">Lip Brush</a>
                  </div>
                  <div className="price">750 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/manish-malhotra-metallic-lipstick-indulgence.html">
                      Manish Malhotra Metallic Lipstick - Indulgence
                    </a>
                  </div>
                  <div className="price">1050 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/manish-malhotra-metallic-lipstick-regal.html">
                      Manish Malhotra Metallic Lipstick - Regal
                    </a>
                  </div>
                  <div className="price">1050 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/manish-malhotra-metallic-lipstick-empress.html">
                      Manish Malhotra Metallic Lipstick - Empress
                    </a>
                  </div>
                  <div className="price">1050 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/manish-malhotra-metallic-lipstick-sensual.html">
                      Manish Malhotra Metallic Lipstick - Sensual
                    </a>
                  </div>
                  <div className="price">1050 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/xoxo-pearly-lipgloss-notting-hill.html">
                      XOXO Pearly Lipgloss - Notting Hill
                    </a>
                  </div>
                  <div className="price">395 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/xoxo-pearly-lipgloss-love-story.html">
                      XOXO Pearly Lipgloss - Love Story
                    </a>
                  </div>
                  <div className="price">395 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/xoxo-pearly-lipgloss-love-actually.html">
                      XOXO Pearly Lipgloss - Love Actually
                    </a>
                  </div>
                  <div className="price">395 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/xoxo-pearly-lipgloss-notebook.html">
                      XOXO Pearly Lipgloss - Notebook
                    </a>
                  </div>
                  <div className="price">395 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/xoxo-pearly-lipgloss-pretty-woman.html">
                      XOXO Pearly Lipgloss - Pretty Woman
                    </a>
                  </div>
                  <div className="price">395 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/kplay-lychee-hydrating-sheet-mask.html">
                      K.Play Lychee Hydrating Sheet Mask
                    </a>
                  </div>
                  <div className="price">145 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/kplay-mandarin-brightening-sheet-mask.html">
                      K.Play Mandarin Brightening Sheet Mask
                    </a>
                  </div>
                  <div className="price">145 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/kplay-acai-berry-anti-oxidant-sheet-mask.html">
                      K.Play Acai Berry Anti-Oxidant Sheet Mask
                    </a>
                  </div>
                  <div className="price">145 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/lit-stick-on-wing-liner-dusted.html">
                      LIT Stick-On Wing Liner - Dusted
                    </a>
                  </div>
                  <div className="price">295 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/lit-stick-on-wing-liner-brag.html">
                      LIT Stick-On Wing Liner - Brag
                    </a>
                  </div>
                  <div className="price">295 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/lit-stick-on-wing-liner-high-key.html">
                      LIT Stick-On Wing Liner - High Key
                    </a>
                  </div>
                  <div className="price">295 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/lit-stick-on-wing-liner-hunty.html">
                      LIT Stick-On Wing Liner - Hunty
                    </a>
                  </div>
                  <div className="price">295 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/total-make-over-ff-cream-light.html">
                      Total Makeover FF Cream Foundation Palette - Latte
                    </a>
                  </div>
                  <div className="price">1450 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/perfect-curves-siren.html">
                      Perfect Curves Matte Lip Crayon - Siren
                    </a>
                  </div>
                  <div className="price">695 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/perfect-curves-matte-lip-crayon-ampere.html">
                      Perfect Curves Matte Lip Crayon - Ampere
                    </a>
                  </div>
                  <div className="price">695 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/manish-malhotra-metallic-chalk-ignite.html">
                      Manish Malhotra Metallic Chalk Duo - Ignite
                    </a>
                  </div>
                  <div className="price">1350 INR</div>
                </li>
                <li>
                  <div className="amount-label">
                    <a href="https://www.myglamm.com/product/manish-malhotra-metallic-chalk-duo-inferno.html">
                      Manish Malhotra Metallic Chalk Duo - Inferno
                    </a>
                  </div>
                  <div className="price">1350 INR</div>
                </li>
              </ul>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default CustomFooter;
