import React from 'react';

export interface CartItem {
    name: string;
    image: string;
    description: string;
    quantity: number;
    price: number;
  }  

const cart : Array<CartItem> = []; 

export const CartContext = React.createContext({
    cart: cart,
    modifyCart: (item : CartItem, isAdd: boolean) => {}
});