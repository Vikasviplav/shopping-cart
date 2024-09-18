import React, { createContext, useReducer, useContext, useState, useEffect } from "react";
import { cartReducer, productReducer } from "./Reducer";
import axios from "axios"; // To make API requests

const Cart = createContext();

export const Context = ({ children }) => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get("https://fakestoreapi.com/products"); 
        const formattedProducts = data.map((product) => ({
          id: product.id,
          name: product.title,
          price: product.price*10,
          image: product.image, // Assuming image comes in the API response
          inStock: Math.floor(Math.random() * 10), // Random stock count
          ratings: Math.floor(Math.random() * 5) + 1, // Random ratings 1-5
          fastDelivery: Math.random() > 0.5, // Random fast delivery boolean
          size: null, // If the API doesn't provide size
          category: product.category,
        }));
        setProducts(formattedProducts); 
      } catch (error) {
        console.error("Error fetching products: ", error);
      }
    };

    fetchProducts();
  }, []); 

  const [state, dispatch] = useReducer(cartReducer, {
    products: products,
    cart: [],
  });

  const [productState, productDispatch] = useReducer(productReducer, {
    byStock: false,
    byFastDelivery: false,
    byRating: 0,
    searchQuery: "",
  });

  return (
    <Cart.Provider value={{ state: { ...state, products }, dispatch, productState, productDispatch }}>
      {children}
    </Cart.Provider>
  );
};

export const CartState = () => {
  return useContext(Cart);
};
