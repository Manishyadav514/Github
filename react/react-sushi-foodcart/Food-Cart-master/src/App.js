import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./Components/Layout";
import { AppProvider } from "./context/context";
import Cart from "./Components/Cart";
import Home from "./pages/Home";
import Bbq from "./pages/Bbq";
import Pizza from "./pages/Pizza";
import Burger from "./pages/Burger";
import Dessert from "./pages/Dessert";
import Sandwich from "./pages/Sandwich";
import Drinks from "./pages/Drinks";
import PageNotFound from "./pages/PageNotFound";

const App = () => {

  return (
    <BrowserRouter>
    <AppProvider>
        <Layout>
          <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/cart" element={<Cart/>} />
          <Route path="/pizzas" element={<Pizza />} />
          <Route path="/burgers" element={<Burger />} />
          <Route path="/sandwiches" element={<Sandwich/>} />
          <Route path="/bbqs" element={<Bbq />} />
          <Route path="/desserts" element={<Dessert />} />
          <Route path="/drinks" element={<Drinks />} />
          <Route path="*" element={<PageNotFound />} />        
          </Routes>
        </Layout>
    </AppProvider>
    </BrowserRouter>
  );
};

export default App;
