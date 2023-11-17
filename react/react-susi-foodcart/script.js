// Get elements
const deliveryOptions = document.querySelectorAll('input[name="delivery-option"]');
const homeDeliveryAddress = document.querySelector('#home-delivery ~ .address');

// Set event listeners
deliveryOptions.forEach((option) => {
  option.addEventListener('change', () => {
    if (option.value === 'home-delivery') {
      homeDeliveryAddress.style.display = 'block';
    } else {
      homeDeliveryAddress.style.display = 'none';
    }
  });
});

// Sample data for cart items
const cartItems = [
  {
    id: 1,
    product: "Food 1",
    photo: "https://via.placeholder.com/100x100",
    quantity: 2,
    price: 20,
  },
  {
    id: 2,
    product: "Food 2",
    photo: "https://via.placeholder.com/100x100",
    quantity: 1,
    price: 35,
  },
];

// Get the cart items container and total price element
const cartItemsContainer = document.getElementById("cart-items");
const totalPriceElement = document.getElementById("total-price");

// Initialize total price
let totalPrice = 0;

// Loop through the cart items and create the table rows
cartItems.forEach((item) => {
  const { id, product, photo, quantity, price } = item;

  // Calculate the item total price
  const itemTotalPrice = quantity * price;

  // Add the item total price to the total price
  totalPrice += itemTotalPrice;

  // Create the table row
  const row = document.createElement("tr");
  row.innerHTML = `
    <td>${product}</td>
    <td><img src="${photo}" alt="${product}" /></td>
    <td>
      <input type="number" value="${quantity}" min="1" onchange="updateCartItem(${id}, this.value, ${price})" />
    </td>
    <td>$${itemTotalPrice}</td>
    <td>${id}</td>
  `;

  // Add the row to the cart items container
  cartItemsContainer.appendChild(row);
});

// Set the total price element value
totalPriceElement.textContent = `$${totalPrice.toFixed(2)}`;

// Function to update the cart item quantity and price
function updateCartItem(id, quantity, price) {
  // Find the item in the cartItems array
  const item = cartItems.find((item) => item.id === id);

  // Update the quantity and item total price
  const oldQuantity = item.quantity;
  item.quantity = parseInt(quantity);
  const itemTotalPrice = item.quantity * price;

  // Update the total price
  totalPrice += itemTotalPrice - (oldQuantity * price);

  // Set the item total price and total price element values
  const itemTotalPriceElement = document.querySelector(`#cart-items tr:nth-child(${item.id}) td:nth-child(4)`);
  itemTotalPriceElement.textContent = `$${itemTotalPrice.toFixed(2)}`;
  totalPriceElement.textContent = `$${totalPrice.toFixed(2)}`;
}
