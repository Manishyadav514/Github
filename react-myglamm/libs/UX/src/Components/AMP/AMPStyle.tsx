const ampStyle = `
button {
    margin: 0;
    padding: 0;
    border: 0;
    outline: 0;
    font-size: 100%;
    vertical-align: baseline;
    background: 0 0;
  }

  ul{
    display: block;
    list-style-type: disc;
    margin-block-start: 1em;
    margin-block-end: 1em;
    margin-inline-start: 0px;
    margin-inline-end: 0px;
    padding-inline-start: 40px;
  }

  li.businessDay {
    text-transform: capitalize;
  }

body {
    background: #EEE;
    font-family: "Open Sans", "Helvetica Neue" , Helvetica, Arial, sans-serif;
    font-weight: 100;
    font-size: 16px;
    line-height: 1.5;
    letter-spacing: 0.5px;
  }
  main {
    background: #FFF;
    max-width: 720px;
    width: 100%;
    margin: 8px auto;
    box-shadow: 0 0 2px 0 #000;
  }
  main > section {
    padding: 0px 16px 16px 16px;
  }
  p {
    margin: 8px 0px;
    letter-spacing: 1.5px;
  }
  h6 {
    font-size: 16px;
    font-weight: 400;
    margin: 8px 0px;
  }
  h5 {
    font-size: 16px;
    font-weight: 600;
  }
  h4 {
    font-size: 18px;
    font-weight: 400;
  }
  h3 {
    font-size: 18px;
    font-weight: 600;
    margin: 1em 0;
  }
  h2 {
    font-size: 20px;
    font-weight: 400;
  }
  h1 {
    font-size: 22px;
    font-weight: 400;
    margin: 0.83em 0;
  }
  header {
    background: #fff;
    box-shadow: 0 0 2px 0 #000;
  }
  header amp-img {
    width: 200px;
    height: 32px;
  }
  amp-fit-text{
    width: 200px; height: 400px;
  }
  header h1 {
    margin: 0px;
    padding: 8px;
  }
  header button, header amp-img {
    vertical-align: middle;
  }
  header button {
    padding: 1px 6px;
    margin: 0 4px;
  }
  amp-sidebar {
    background: #FFF;
  }
  #sidebar h4, #sidebar h5{
    padding: 8px;
  }
  amp-sidebar ul {
    list-style: none;
    padding: 16px;
  }
  footer {
    padding: 16px 8px;
    text-align: center;
  }
  .pA4 { padding: 4px; }
  .pA8 { padding: 8px; }
  .pA12 { padding: 12px; }
  .pA16 { padding: 16px; }
  .pTB4 { padding: 4px 0px; }
  .pTB8 { padding: 8px 0px; }
  .pTB12 { padding: 12px 0px; }
  .pTB16 { padding: 16px 0px; }
  .pRL4 { padding: 0px 4px; }
  .pRL8 { padding: 0px 8px; }
  .pRL12 { padding: 0px 12px; }
  .pRL16 { padding: 0px 16px; }
  .pT4 { padding-top: 4px; }
  .pT8 { padding-top: 8px; }
  .pT12 { padding-top: 12px; }
  .pT16 { padding-top: 16px; }
  .pB4 { padding-bottom: 4px; }
  .pB8 { padding-bottom: 8px; }
  .pB12 { padding-bottom: 12px; }
  .pB16 { padding-bottom: 16px; }
  .pR4 { padding-right: 4px; }
  .pR8 { padding-right: 8px; }
  .pR12 { padding-right: 12px; }
  .pR16 { padding-right: 16px; }
  .pL4 { padding-left: 4px; }
  .pL8 { padding-left: 8px; }
  .pL12 { padding-left: 12px; }
  .pL16 { padding-left: 16px; }

  .mA4 { margin: 4px; }
  .mA8 { margin: 8px; }
  .mA12 { margin: 12px; }
  .mA16 { margin: 16px; }
  .mTB4 { margin: 4px 0px; }
  .mTB8 { margin: 8px 0px; }
  .mTB12 { margin: 12px 0px; }
  .mTB16 { margin: 16px 0px; }
  .mRL4 { margin: 0px 4px; }
  .mRL8 { margin: 0px 8px; }
  .mRL12 { margin: 0px 12px; }
  .mRL16 { margin: 0px 16px; }
  .mT4 { margin-top: 4px; }
  .mT8 { margin-top: 8px; }
  .mT12 { margin-top: 12px; }
  .mT16 { margin-top: 16px; }
  .mB4 { margin-bottom: 4px; }
  .mB8 { margin-bottom: 8px; }
  .mB12 { margin-bottom: 12px; }
  .mB16 { margin-bottom: 16px; }
  .mR4 { margin-right: 4px; }
  .mR8 { margin-right: 8px; }
  .mR12 { margin-right: 12px; }
  .mR16 { margin-right: 16px; }
  .mL4 { margin-left: 4px; }
  .mL8 { margin-left: 8px; }
  .mL12 { margin-left: 12px; }
  .mL16 { margin-left: 16px; }

  .btn-primary {
    color: #fc7585;
    font-size: 12px;
    font-weight: bold;
    width: 85px;
    height: 17px;
  }

  ul.tabs {
    list-style-type: none;
    margin: 0;
    padding: 0;
    display: table;
    text-align: center;
    width: 100%;
    background: #edefed;
  }
  ul.tabs li {
    display: table-cell;
    padding: 8px;
  }
  ul.tabs li h2 {
    display: inline;
  }
  a {
    color: -webkit-link;
    cursor: pointer;
    text-decoration: underline;
  }
  form input, form textarea {
    padding: 6px;
    border:1px solid #CCC;
    font-size: 13px;
    width: 100%;
    box-sizing: border-box;
  }
  button {
    background: #fc7585;
    outline: none;
    border: 0px;
    border-radius: 3px;
    font-size: 14px;
    color: #FFF;
  }
  form .form-group {
    display: table;
    width: 100%;
  }
  form .form-group .form-cell {
    display: table-cell;
    padding: 4px;
  }
  .v-center > *{
    vertical-align: middle;
  }
  .share-icon-wrapper {
    display: inline-block;
    text-decoration: none;
    height: 22px;
    width: 22px;
    margin: 0 4px;
  }
  .thumb {
    display: table;
    width: 100%;
    padding-top: 8px;
  }
  .thumb .profile {
    display: table-cell;
    vertical-align: top;
    padding: 8px 4px;
    width: 48px;
  }
  .thumb .profile amp-img, .thumb .profile img {
    height: 48px;
    width: 48px;
    background: #CCC;
    border-radius: 40px;
  }
  .v-center amp-img{
    width: 22px; height: 22px;
  }
  .thumb .body {
    display: table-cell;
    vertical-align: top;
    padding: 8px 4px;
  }
  .thumb .body .author {
    padding: 4px;
    height: 24px;
    display: inline-block;
  }
  .thumb .body .data {
    background: #edefed;
    padding: 8px;
    border-radius: 2px;
  }

  .thumb .body .data.review {
    font-size: 14px;
  }
  .thumb .body .data.review h6 {
    margin: 0px;
  }
  .packages {
    display: flex;
    margin: 16px 0px;
    background: #edefed;
    border-radius: 2px;
  }
  .packages .image {
    flex: 2 1 50%;
  }
  .packages .body {
    flex: 2 1 50%;
  }
  .packages .body h4 {
    margin: 0px;
  }
  .packages .enquiry-wrapper {
    background: #edefed;
  }
  .packages amp-accordion h4{
    border:none;
    border-bottom: 1px solid #CCC;
    font-size: 14px;
  }
  .packages amp-accordion h4 span{
    float: right;
  }
  .display-table {
    display: table;
    width: 100%;
  }
  .display-table-cell {
    display: table-cell;
  }
  form.amp-form-submit-success > .form-input {
    display: none;
  }

  .circular-border-radius {
    border-radius: 50%;
  }

  .profile-detail-wrapper {
    display: inline-block;
    font-size: 12px;
    vertical-align: top;
    width: 70%;
  }
`;

export default ampStyle;
