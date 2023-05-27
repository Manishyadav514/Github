const product = [
  {
    id: 0,
    image: "product1.jpg",
    title: "Z Flip Foldable Mobile",
    price: 120,
  },
  {
    id: 1,
    image: "product2.jpg",
    title: "Food Item",
    price: 128,
  },
  {
    id: 2,
    image: "shahi-paneer.jpg",
    title: "Sahi Paneer",
    price: 124,
  },
  {
    id: 3,
    image: "shahi-paneer.jpg",
    title: "Palak Paneer",
    price: 129,
  },
];
const categories = [
  ...new Set(
    product.map((item) => {
      return item.title;
    })
  ),
];

let cart = [];

function addtocart(a) {
  console.log({ a });
  cart.push({ ...a });
  console.log({ cart });
  displaycart();
}

// function addtocart(item) {
//   const { id, image, title, price } = item;
//   cart.push({ id, image, title, price });
//   document.getElementById("count").innerHTML = cart.length;
//   console.log(cart);
// }
let i = 0;

document.getElementById("root").innerHTML = categories
  .map((title) => {
    let items = product.filter((item) => {
      return item.title === title;
    });
    return items
      .map((item) => {
        var { image, title, price } = item;
        return `<div class='box'>
        <div class='img-box'>
        <img class='images' src='${image}'></img>
        </div>
        <div class='bottom'>
        <p>${title}</p>
        <h2>Rs. ${price}.00</h2>
        <button onclick='addtocart(${JSON.stringify(
          item
        )})'>Add to cart</button>
        </div>
    </div>`;
      })
      .join("");
  })
  .join("");

function delElement(a) {
  cart.splice(a, 1);
  displaycart();
}
console.log({ cart });

function displaycart() {
  let j = 0,
    total = 0;
  console.log({ cart });
  document.getElementById("count").innerHTML = cart.length;
  if (cart.length === 0) {
    document.getElementById("cartItem").innerHTML = "Your cart is empty";
    document.getElementById("total").innerHTML = "Rs. " + 0 + ".00";
  } else {
    document.getElementById("cartItem").innerHTML = cart
      .map((item, index) => {
        var { image, title, price } = item;
        total = total + price;
        document.getElementById("total").innerHTML = "Rs. " + total + ".00";

        return `<div class='cart-item'>
            <div class='row-img'>
            <img class='rowimg' src='${image}'>
            </div>
            <p style='font-size:12px;'>${title}</p>
            <h2 style='font-size: 15px;'>Rs. ${price}.00</h2>
            <i class='fa-solid fa-trash' onclick='delElement(${index})'></i>
        </div>`;
      })
      .join("");
  }
}
