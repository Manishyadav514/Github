import { IS_DESKTOP } from "@libConstants/COMMON.constant";

export const INGREDIENTS_STYLES = () => {
  if (IS_DESKTOP) {
    return (
      <style jsx global>
        {`
          .productlistingbannerWrapper {
            width: 100%;
            height: auto;
            margin: 0 auto;
            text-align: center;
            background: url(/images/product_listing_banner.png) no-repeat center;
            background-size: 100% 103%;
            padding: 2em 0 8em;
            background-color: #97b147;
          }
          .facecareWrapper {
            width: 100%;
            height: auto;
            margin: 0 auto;
            text-align: center;
          }
          .facecareWrapper h2,
          .facecareWrapper h1 {
            text-transform: capitalize;
          }
          .facecareWrapper h2,
          .facecareWrapper h1 {
            font-family: "JelyttaRegular";
            font-weight: 400;
            color: #fff;
            font-size: 4.1em;
            text-align: center;
            padding: 0.5em 0;
            letter-spacing: 0.05em;
          }
          .facecareWrapper p {
            font-family: "Montserrat";
            font-weight: 300;
            font-size: 1.2em;
            color: #fff;
            line-height: 1.8em;
            padding: 1em 27%;
            letter-spacing: 0.05em;
          }
          .ingredient_right_col {
            width: 50%;
            height: auto;
            margin: 0 auto;
            text-align: center;
            float: right;
          }
          .txt_left .centerWrapper {
            text-align: left;
          }
          .centerWrapper {
            width: 90%;
            height: auto;
            margin: 0 auto;
            text-align: center;
          }
          .ingredientWrapper p {
            font-weight: 300;
          }
          .txt_left p {
            padding: 0 33% 0 0;
          }
          .ingredientWrapper p {
            font-family: "Montserrat";
            font-weight: 400;
            font-size: 1.1em;
            color: #000;
            line-height: 1.8em;
          }
          .ingredientWrapper h2,
          .ingredientWrapper h3 {
            font-family: "JelyttaRegular";
            font-weight: 400;
            color: #97b04e;
            font-size: 3.1em;
            padding: 0 0 0.5em;
          }

          .ingredient_col img,
          .ingredient_col1 img,
          .ingredient_right_col img {
            width: 85%;
            height: auto;
            margin: 0 auto;
            text-align: center;
            display: block;
          }
          img {
            border: 0 none;
          }
          .centerWrapper {
            width: 90%;
            height: auto;
            margin: 0 auto;
            text-align: center;
          }
          .ingredientrow {
            width: 80%;
          }
          .ingredientWrapper,
          .ingredientrow {
            width: 90%;
            height: auto;
            margin: 0 auto;
          }
          .ingredientrow {
            padding: 0;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          h2 {
            display: block;
            font-size: 1.5em;
            margin-block-start: 0.83em;
            margin-block-end: 0.83em;
            margin-inline-start: 0px;
            margin-inline-end: 0px;
            font-weight: bold;
          }
          .centerWrapper {
            width: 90%;
            /* height: auto; */
            margin: 0 auto;
            /* text-align: center; */
          }
          p {
            display: block;
            margin-block-start: 1em;
            margin-block-end: 1em;
            margin-inline-start: 0px;
            margin-inline-end: 0px;
          }
          .ingredientrow:nth-child(2n),
          .ingredientsAfterBanner .ingredientrow:nth-child(1n) {
            flex-direction: row-reverse;
          }
          .ingredient_col {
            width: 50%;
            height: auto;
            margin: 0 auto;

            float: left;
          }
          .ingredientWrapper .ingredientrow:nth-child(2n) h2,
          .ingredientsAfterBanner .ingredientrow:nth-child(1n) h2 {
            text-align: right;
          }
          * {
            margin: 0;
            padding: 0;
          }
          .ingredientWrapper .ingredientrow:nth-child(2n) p,
          .ingredientsAfterBanner .ingredientrow:nth-child(1n) p {
            padding: 0 0 0 33%;
            text-align: right;
          }

          .show_product_btn {
            background-color: #f9c851;
            font-family: "Montserrat";
            font-weight: 400;
            font-size: 1em;
            color: #000;
            padding: 0.5em 1.2em;
            border-radius: 25px;
            border: 0;
            display: inline-block;
            //webkit-box-shadow: 0 10px 36px -8px rgba(0,0,0,0.5);
            //-moz-box-shadow: 0 10px 36px -8px rgba(0,0,0,0.5);
            // box-shadow: 0 10px 20px -8px rgb(0 0 0 / 30%);
            text-align: left;
            margin: 1em 0;
          }
          .organic_banner_ingredient {
            background-image: url(/images/ingredient.jpg);
            background-attachment: fixed;
            background-position: center;
            background-repeat: no-repeat;
            background-size: cover;
            width: 100%;
            height: auto;
            margin: 0 auto;
            text-align: center;
            overflow: hidden;
          }
          .organic_banner {
            width: 100%;
            height: auto;
            margin: 2em auto;
            text-align: center;
          }
          .organic_banner img {
            width: 100%;
            height: auto;
            margin: 0 auto;
            text-align: center;
            display: block;
          }
          .sortWrapper {
            width: 100%;
            height: auto;
            margin: 2em auto;
            text-align: center;
          }
          .sortWrapper p {
            font-family: "Montserrat";
            font-weight: 400;
            font-size: 1.2em;
            color: #bababa;
            line-height: 1.8em;
            padding: 0 1em;
          }

          .bestseller .sortting,
          .sort_by .sortting {
            border: 2px solid #97b147;
            border-radius: 20px;
          }
          .sort_by li a {
            color: #97b147;
            padding: 0.5em 1.3em;
          }
          .sortting {
            border: 2px solid #97b147;
            border-radius: 20px;
          }
          a {
            text-decoration: none;
            font-size: medium;
            outline: none;
            color: #fff;
          }
          .sort_by li {
            display: inline-block;
            cursor: pointer;
            margin: 0 1.3em;
            color: #97b147;
          }

          li {
            text-align: -webkit-match-parent;
          }
          .sort_by {
            list-style: none;
          }
          ul {
            margin: 0;
            padding: 0;
            list-style: none;
          }

          ul {
            list-style-type: disc;
          }
          .centerWrapper {
            width: 90%;
            height: auto;
            margin: 0 auto;
            text-align: center;
          }
          .sortWrapper {
            width: 100%;
            height: auto;
            margin: 2em auto;
            text-align: center;
          }
          .ingredientWrapper .ingredientrow:nth-child(2n) h2,
          .ingredientsAfterBanner .ingredientrow:nth-child(1n) h2 {
            text-align: right;
          }
          .ingredientsAfterBanner .ingredientrow:nth-child(2n) {
            flex-direction: row;
          }
          .ingredientsAfterBanner .ingredientrow:nth-child(2n) p {
            text-align: left;
            padding: 0 33% 0 0;
          }
          .ingredientsAfterBanner .ingredientrow:nth-child(2n) h2 {
            text-align: left;
          }
          .signup_form h2 {
            font-family: "Montserrat";
            font-weight: 300;
            font-size: 2.2em;
            color: #fff;
            padding: 1% 28%;
            line-height: 1.4em;
            letter-spacing: 0.05em;
          }

          .signup_form {
            width: 50%;
            height: auto;
            margin: 0 auto;
            text-align: center;
            position: absolute;
            top: 24%;
            left: 0;
            right: 0;
          }
          .email_ip {
            background-color: transparent;
            border: 0;
            outline: none;
            border-bottom: 1px solid #fff;
            padding: 0.5em 1em;
            width: 30%;
            font-family: "Montserrat";
            font-weight: 400;
            font-size: 1em;
            color: #63838e;
            text-align: center;
            display: block;
            margin: 1.5em auto 0.2em;
            letter-spacing: 0.05em;
          }
          .button,
          .input {
            line-height: normal;
          }
          .button,
          .input,
          .select,
          .textarea {
            font-family: inherit;
            font-size: 100%;
            margin: 0;
            outline: 0;
          }
          .signupWrapper img {
            width: 100%;
            height: auto;
            margin: 0 auto;
            text-align: center;
            display: block;
          }
          .signup_desktop_banner {
            display: block;
          }
          .signupWrapper {
            position: relative;
            margin: 3em auto 0;
          }

          form {
            display: block;
            margin-top: 0em;
          }
          .signup_btn {
            background-color: #f9c851;
            font-family: "Montserrat";
            font-weight: 400;
            font-size: 1.2em;
            color: #000;
            padding: 0.4em 1.8em 0.6em;
            border-radius: 25px;
            border: 0;
            display: block;
            margin: 1.5em auto 1em;
          }
          .signup_form .thankyou {
            font-family: "Montserrat";
            font-weight: 400;
            color: #fff;
            font-size: 1.1em;
          }
          .button,
          html input[type="button"],
          input[type="reset"],
          input[type="submit"] {
            -webkit-appearance: button;
            cursor: pointer;
          }
          /* .error1, .error, .contactWrapper .error, .contactWrapper .error1 {
    color: #b22222;
    font-weight: 500;
  }
  .error {
    color: red;
    font-family: 'Montserrat';
    font-weight: 300;
    font-size: .9em;
    text-align: center;
  }
   */

          *,
          :after,
          :before {
            box-sizing: border-box;
          }
          .mainWrapper,
          .ohmenuWrapper,
          .menuWrapper,
          .submenuWrapper,
          .catageryWrapper,
          .productimg,
          .productdtl,
          .searchWrapper,
          .search_form,
          .footer,
          .signupWrapper,
          .signupdtl,
          .spotlightWrapper,
          .spotlightnav,
          .spotligtproductWrapper,
          .mainbannerWrapper,
          .switchWrapper,
          .everydayWrapper,
          .ingredientWrapper {
            width: 100%;
            height: auto;
            margin: 0 auto;
            text-align: center;
          }
          ::placeholder {
            /* Chrome, Firefox, Opera, Safari 10.1+ */
            color: #bece91;
            opacity: 100; /* Firefox */
          }
        `}
      </style>
    );
  }
  return (
    <style jsx global>
      {`
        @font-face {
          font-family: "JelyttaRegular";
          src: url(/fonts/Jelytta.ttf) format("woff"), url(/fonts/Jelytta.ttf) format("opentype"),
            url(/fonts/Jelytta.ttf) format("truetype");
          font-weight: 400;
          font-style: normal;
          font-display: swap;
        }

        .orhingredients {
          background-color: #ffffff;
        }

        .orhingredients .productlistingbannerWrapper {
          width: 100%;
          height: auto;
          margin: 0 auto;
          background: url(/images/ingredients/product_listing_banner.png) no-repeat center;
          padding: 1.5em 0 5em;
          background-size: auto;
          background-position: center bottom;
          background-color: #97b147;
        }
        .orhingredients .facecareWrapper {
          width: 100%;
          height: auto;
          margin: 0 auto;
          text-align: center;
        }
        .facecareWrapper h2,
        .orhingredients .facecareWrapper h1 {
          font-family: "JelyttaRegular";
          font-weight: 400;
          color: #fff;
          font-size: 3.5em;
          text-align: center;
          letter-spacing: 0.05em;
          text-transform: capitalize;
        }
        .orhingredients .facecareWrapper p {
          font-family: "Montserrat";
          font-weight: 300;
          font-size: 1em;
          color: #fff;
          line-height: 1.8em;
          padding: 1em 10%;
          letter-spacing: 0.05em;
        }
        .orhingredients .sortWrapper {
          width: 100%;
          height: auto;
          margin: 2em auto;
          text-align: center;
        }
        .orhingredients .centerWrapper {
          width: 100%;
          height: auto;
          margin: 0 auto;
          text-align: center;
        }
        .orhingredients .sortWrapper p {
          font-family: "Montserrat";
          font-weight: 400;
          font-size: 1.1em;
          color: #bababa;
          line-height: 1.8em;
          padding: 0 0 1em;
        }
        .orhingredients ul {
          display: block;
          list-style-type: disc;
          margin-block-start: 1em;
          margin-block-end: 1em;
          margin-inline-start: 0px;
          margin-inline-end: 0px;
          margin: 0;
          padding: 0;
        }
        .orhingredients .sort_by {
          list-style: none;
        }
        .orhingredients .sort_by li {
          display: inline-block;
          cursor: pointer;
          color: #97b147;
          padding: 0.5em 0;
          margin: 0.5em 0;
        }
        .orhingredients .sort_by li a {
          color: #97b147;
          padding: 0.4em 0.8em;
        }
        .orhingredients .sortting {
          border: 2px solid #97b147;
          border-radius: 20px;
        }
        .orhingredients .bestseller .sortting,
        .orhingredients .sort_by .sortting {
          border: 2px solid #97b147;
          border-radius: 20px;
        }
        .orhingredients .ingredientWrapper {
          position: relative;
        }
        .orhingredients .ingredientWrapper,
        .orhingredients .ingredientrow {
          width: 100%;
          height: auto;
          margin: 0 auto;
        }
        .orhingredients .ingredientrow {
          padding: 0;
          width: 85%;
          display: initial;
          align-items: center;
          justify-content: center;
        }
        .orhingredients .ingredient_col,
        .orhingredients .ingredient_right_col {
          width: 90% !important;
          float: none;
          margin: 0 auto;
        }
        .orhingredients .ingredient_col img,
        .orhingredients .ingredient_col1 img,
        .orhingredients .ingredient_right_col img {
          height: auto;
          width: 100%;
          margin: 5% 0 0;
          text-align: center;
          display: block;
        }
        .orhingredients img {
          border: 0 none;
          outline: none;
        }
        .orhingredients .ingredientWrapper h2,
        .orhingredients .ingredientWrapper h3 {
          font-family: "JelyttaRegular";
          font-weight: 400;
          display: block;
          padding: 0;
          font-size: 2em;
        }
        .orhingredients .ingredientWrapper h3,
        .orhingredients .ingredientWrapper h2,
        .orhingredients .ingredientWrapper.home h2 {
          position: relative;
          top: initial;
          left: initial;
          color: #97b04e;
        }
        .orhingredients .txt_left .centerWrapper {
          text-align: left;
        }
        .orhingredients .ingredientWrapper p {
          font-family: "Montserrat";
          font-weight: 300;
          font-size: 1em;
          color: #000;
          line-height: 1.8em;
        }
        .orhingredients .txt_left p {
          padding: 0;
        }
        .orhingredients .show_product_btn {
          background-color: #f9c851;
          font-family: "Montserrat";
          font-weight: 400;
          font-size: 1em;
          padding: 0.2em 1em;
          color: #000;
          border-radius: 25px;
          border: 0;
          display: inline-block;
          box-shadow: 0 10px 20px -8px rgb(0 0 0 / 30%);
          text-align: left;
          margin: 1em 0;
        }
        .orhingredients .organic_banner {
          width: 100%;
          height: auto;
          margin: 2em auto;
        }
        .orhingredients .organic_banner img {
          width: 100%;
          height: auto;
          margin: 0 auto;
          text-align: center;
          display: block;
        }
      `}
    </style>
  );
};
