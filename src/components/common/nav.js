import { Link } from "react-router-dom";
import React, { useContext, useEffect, useState } from 'react';
import '../../assets/css/main.css';
import Context from "../../js/context";
import axios from 'axios';

export default function Nav() {
  const { state } = useContext(Context);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [username, setUsername] = useState('');
  const [cartCount, setCartCount] = useState(0); // Cart count state
  const [userId, setUserId] = useState(null);
  const [userRole, setUserRole] = useState(''); // New state to store user role

  useEffect(() => {
    const fetchUserProfileAndCart = async () => {
      try {
        const userInfoResponse = await axios.get(
          'https://projectky320240926105522.azurewebsites.net/api/User/userProfile',
          {
            withCredentials: true,
          }
        );
  
        const { name, role } = userInfoResponse.data;
        setUsername(name);
        setUserRole(role); // Store the user's role
        setIsLoggedIn(true);
  
        
      } catch (error) {
        console.error('Error fetching user profile or cart data:', error);
      }
    };
  
    fetchUserProfileAndCart();
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post('https://projectky320240926105522.azurewebsites.net/api/Auth/logout', {}, {
        withCredentials: true
      });
  
      setIsLoggedIn(false);
      setShowDropdown(false);
      setUsername('');
      setCartCount(0); // Reset cart count
      localStorage.removeItem('Token'); // Clear token from localStorage
  
      console.log('User successfully logged out');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const toggleSearchBox = () => {
    setIsSearchOpen(prevState => !prevState);
  };

  const closeSearchBox = () => {
    setIsSearchOpen(false);
  };

  useEffect(() => {
    const header = document.querySelector('.header_area');
    const stickyWrapper = document.querySelector('.sticky-wrapper');
    const sticky = stickyWrapper.offsetTop;

    const handleScroll = () => {
      if (window.scrollY > sticky) {
        header.style.position = "fixed";
        header.style.top = "0";
        stickyWrapper.classList.add('is-sticky');
        document.body.classList.add('is-sticky');
      } else {
        header.style.position = "relative";
        stickyWrapper.style.top = "40px";
        stickyWrapper.classList.remove('is-sticky');
        document.body.classList.remove('is-sticky');
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="sticky-wrapper">
      <header className="header_area sticky-header">
        <div className="main_menu">
          <nav className="navbar navbar-expand-lg navbar-light main_box">
            <div className="container">
              <Link className="navbar-brand logo_h" to="/">
                <img src="img/logo.png" alt="logo" />
              </Link>
              <button
                className="navbar-toggler"
                type="button"
                data-toggle="collapse"
                data-target="#navbarSupportedContent"
                aria-controls="navbarSupportedContent"
                aria-expanded="false"
                aria-label="Toggle navigation"
              >
                <span className="icon-bar"></span>
                <span className="icon-bar"></span>
                <span className="icon-bar"></span>
              </button>
              <div className="collapse navbar-collapse offset" id="navbarSupportedContent">
                <ul className="nav navbar-nav menu_nav ml-auto">
                  <li className="nav-item active">
                    <Link className="nav-link" to="/">Home</Link>
                  </li>
                  <li className="nav-item submenu dropdown">
                    <a href="#" className="nav-link dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">Shop</a>
                    <ul className="dropdown-menu">
                      <li className="nav-item"><Link className="nav-link" to="/category">Shop Category</Link></li>
                      <li className="nav-item"><Link className="nav-link" to="/checkout">Product Checkout</Link></li>
                      <li className="nav-item"><Link className="nav-link" to="/cart">Shopping Cart</Link></li>
                    </ul>
                  </li>
                  <li className="nav-item"><Link className="nav-link" to="/contact">Contact</Link></li>
                </ul>
                
                <ul className="nav navbar-nav menu_nav ml-auto">
                  {isLoggedIn ? (
                    <li className="nav-item submenu dropdown" style={{ marginRight: "65px", border: "1px solid black", backgroundColor: "orange", padding: "0px 8px", borderRadius: "5px" }}>
                      <button className="nav-link" onClick={toggleDropdown}>{`Hello, ${username} ▼`}</button>
                      {showDropdown && (
                        <ul className="dropdown-menu" style={{ display: 'block', position: 'absolute', right: '0' }}>
                          <li className="nav-item"><Link className="nav-link" to="/favorites">Favorites</Link></li>
                          <li className="nav-item"><Link className="nav-link" to="/user-settings">User Settings</Link></li>
                          <li className="nav-item"><Link className="nav-link" to="/Oderuser">Orderuser</Link></li>
                          <li className="nav-item"><Link onClick={handleLogout} className="nav-link" to="/login">Log Out</Link></li>
                        </ul>
                      )}
                    </li>
                  ) : (
                    <>
                      <li className="nav-item" style={{ border: "1px solid black", backgroundColor: "orange", padding: "0px 10px", borderRadius: "5px", marginRight: "22px" }}>
                        <Link className="nav-link" to="/login">Login</Link>
                      </li>
                      <li className="nav-item" style={{ border: "1px solid black", backgroundColor: "orange", padding: "0px 10px", borderRadius: "5px" }}>
                        <Link className="nav-link" to="/register">Register</Link>
                      </li>
                    </>
                  )}
                </ul>
              </div>
            </div>
          </nav>
        </div>
        {isSearchOpen && (
          <div className="search_input" id="search_input_box">
            <div className="container">
              <form className="d-flex justify-content-between">
                <input type="text" className="form-control" id="search_input" placeholder="Search Here" />
                <button type="submit" className="btn"></button>
                <span className="lnr lnr-cross" id="close_search" title="Close Search" onClick={closeSearchBox}></span>
              </form>
            </div>
          </div>
        )}
      </header>
    </div>
  );
}
