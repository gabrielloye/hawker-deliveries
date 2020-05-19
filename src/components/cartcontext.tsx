import React from 'react';

export interface CartItem {
    id: string;
    stallId: string;
    name: string;
    image: string;
    description: string;
    quantity: number;
    price: number;
  }  

const cart : Array<CartItem> = []; 

export const CartContext = React.createContext({
    date: '',
    meal: '',
    cart: cart,
    modifyCart: (item : CartItem, isAdd: boolean, meal: string) => {}
});