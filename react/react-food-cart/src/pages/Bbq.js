import React, { useEffect, useState } from "react";
import { useContext } from "react";
import { AppContext } from "../context/context";
import loader from '../images/loader.png'
import noImage from '../images/no-Image.jpg'
import { ToastContainer,toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const addNotification = () => toast.success("Item Added ⬆" ,{
  position: "top-right",
  autoClose: 2000});

const Bbq = () => {
  const [items, setItems] = useState([])
  const [isLoading, setIsLoading] = useState(true);
  const bbqUrl = "https://adorable-bat-fatigues.cyclic.app/bbqs";

  useEffect(() => {
    fetch(bbqUrl)
      .then((response) => response.json())
      .then((data) => {
        setIsLoading(false);
        setItems(data);
      })
      .catch((err) => console.log(err));
  }, []);
    
  const globalContext = useContext(AppContext)
  const dispatch = globalContext.dispatch; 
  const imageOnError = (event) => {
    event.currentTarget.src = noImage;
  };
  if (isLoading) {
    return (
      <div className="loading">
        <div className="loader"> <img src={loader} alt="loader"/> </div>
        <div className="loader-shadow"></div>
        <h2>Loading, please wait...</h2>
      </div>
    );
  }
  
  return (

    <div className="container">
      <h1>BBQ's</h1>
      <ToastContainer className='notification' />
      <div className="items-container" > 
      {items.map((item,index) => {
        item.quantity=1
        return (
          <div className="item" key={index}>
            <img src={item.img} onError={imageOnError} alt={item.name} className="item-image" />
            <div className="item-dsc">
              <p className="item-name"> {item.name}</p>
              <p className="item-price"> Price : <span> ${item.price}</span></p>
              <button
              type="button"
              className="add-item-btn"
              onClick={() => {
                addNotification();
                dispatch({type:"ADD", payload:item });}}>
                Add +
            </button>
            </div>
          </div>
              )})}
              </div>
              </div>  
  );
};

export default Bbq;
