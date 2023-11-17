import React, { useContext } from "react";
import { AiFillMinusCircle, AiFillPlusCircle } from "react-icons/ai";
import { AppContext } from "../context/context";
import { useNavigate } from "react-router-dom";
import noImage from "../images/no-Image.jpg";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../toggle.scss";

const removeNotification = () =>
  toast.error("Item Removed", {
    position: "top-right",
    autoClose: 2000,
  });

const Cart = () => {
  const globalContexts = useContext(AppContext);
  const state = globalContexts.state;
  const navigate = useNavigate();
  const dispatch = globalContexts.dispatch;

  // Function to calculate total price
  const totalPrice = state.reduce((total, item) => {
    return total + item.price * item.quantity;
  }, 0);

  // Function to calculate total items
  const totalItem = state.reduce((total, item) => {
    return total + item.quantity;
  }, 0);

  const order = () => {
    navigate("/");
    alert("Your order is getting ready..♨️👨‍🍳");
    state.length = [];
  };

  const imageOnError = (event) => {
    event.currentTarget.src = noImage;
  };

  if (state.length === 0) {
    return (
      <div className="empty-cart">
        <h1> Your cart is empty...!</h1>
        <h3>Please, pick some items 😋</h3>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <ToastContainer className="notification" />
      {state.length > 0 && (
        <>
          <div className="total-container">
            <div className="total">
              <p className="total-item">Total Items : {totalItem}</p>
              <p className="total-price">
                Price : <span>$ {totalPrice.toFixed()}</span>{" "}
              </p>
            </div>
            <button onClick={order} className="order-btn">
              Order
            </button>
          </div>{" "}
          <div className="total-container">
            <div className="total">
              <p className="total-item">Delivery To?</p>
              <div class="normal-container">
                <div class="smile-rating-container">
                  <div class="smile-rating-toggle-container">
                    <form class="submit-rating">
                      <input id="meh" name="satisfaction" type="radio" />
                      <input id="fun" name="satisfaction" type="radio" />
                      <label for="meh" class="rating-label rating-label-meh">
                        Room Delivery
                      </label>
                      <div class="smile-rating-toggle"></div>

                      <div class="rating-eye rating-eye-left"></div>
                      <div class="rating-eye rating-eye-right"></div>

                      <div class="mouth rating-eye-bad-mouth"></div>

                      <div class="toggle-rating-pill"></div>
                      <label for="fun" class="rating-label rating-label-fun">
                        Pick up from Store
                      </label>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
      {state.map((item) => (
        <div className="cart-items" key={item.id}>
          <div className="cart-item-info">
            <img
              src={item.img}
              onError={imageOnError}
              alt={item.name}
              className="cart-item-image"
            />
            <div className="cart-item-dsc">
              <p className="item-name"> {item.name}</p>
              <p className="item-price">
                {" "}
                Price : <span>${item.price * item.quantity.toFixed(1)}</span>
              </p>
            </div>
          </div>
          <div className="btn-container">
            <div className="count-buttons">
              <button
                type="button"
                className="btn"
                onClick={() => {
                  if (item.quantity > 1) {
                    dispatch({ type: "DECREASE", payload: item });
                  }
                }}
              >
                <AiFillMinusCircle />
              </button>
              <h3 className="count">{item.quantity}</h3>
              <button
                type="button"
                className="btn"
                onClick={() => dispatch({ type: "INCREASE", payload: item })}
              >
                <AiFillPlusCircle />
              </button>
            </div>
            <button
              className="remove-btn"
              onClick={() => {
                removeNotification();
                dispatch({ type: "REMOVE", payload: item });
              }}
            >
              {" "}
              Remove{" "}
            </button>
          </div>
        </div>
      ))}
      <div></div>
    </div>
  );
};

export default Cart;
