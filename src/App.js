import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import STATE from './js/initState';
import { UserProvider } from './js/context';
import { useReducer, useState } from 'react';
import reducer from './js/reducer';
import './App.css';

import Nav from './components/common/nav';
import Footer from './components/common/footer';
import Home from './components/page/Home';
import Category from './components/page/Category';
import ProductDetail from './components/page/Product-detail';
import Cart from './components/page/Cart';
import Checkout from './components/page/Checkout';
import Confirmation from './components/page/Confirmation';
import Contact from './components/page/Contact';
import Elements from './components/page/Elements';
import Login from './components/page/Login';
import Tracking from './components/page/Tracking';
import Register from './components/page/Register';
import '../src/assets/scss/main.scss';
import User from './components/page/User';
import Favorites from './components/page/Favorites';
import OrderDetail from './components/page/Confirmation';
import Oderuser from './components/User/Oderuser';
//state 
function App() {
  const data = localStorage.getItem("state")?JSON.parse(localStorage.getItem("state")):STATE;
  const [state,dispatch] = useReducer(reducer,data);
  return (
      <>

        

  <UserProvider value={{state,dispatch}}>
        <Nav />
        <main>
          <Routes>
            <Route path='/' Component={Home}/>
            <Route path='/category' Component={Category}/>
            <Route path='/product-detail/:id' Component={ProductDetail}/>
            <Route path='/cart' Component={Cart}></Route>
            <Route path='/category' Component={Category}></Route>
            <Route path='/checkout' Component={Checkout}></Route>
            <Route path='/confirmation/:id' Component={Confirmation}></Route>
            <Route path='/contact' Component={Contact}></Route>
            <Route path='/elements' Component={Elements}></Route>
            <Route path='/login' Component={Login}></Route>
            <Route path='/tracking' Component={Tracking}></Route>
            <Route path='/register' Component={Register}></Route>
            <Route path='/user-settings' Component={User}></Route>
            <Route path='/favorites' Component={Favorites}></Route>
            <Route path='/orderDetail/:id' Component={OrderDetail}></Route>
            <Route path='/Oderuser' Component={Oderuser}></Route>
          </Routes>
        </main>
        <Footer />
      </UserProvider>

        
     
    
      
      </>
  );
}

export default App;
