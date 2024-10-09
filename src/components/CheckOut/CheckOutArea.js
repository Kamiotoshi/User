import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';

export default function CheckOutArea() {
    const [cart, setCart] = useState([]);
    const [selectedOption, setSelectedOption] = useState('COD');
    const [billingDetails, setBillingDetails] = useState({
        firstName: '',
        lastName: '',
        phoneNumber: '',
        email: '',
        address1: '',
        address2: '',
        city: '',
        orderNotes: '',
    });
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();
    const [quantity, setQuantity] = useState({});
    const [userId, setUserId] = useState(null);
    const [colors, setColors] = useState([]);
    const [sizes, setSizes] = useState([]);

    useEffect(() => {
        const storedUserId = localStorage.getItem('Token');
        if (storedUserId) {
            setUserId(storedUserId);
            const fetchCartItems = async () => {
                const url = `https://projectky320240926105522.azurewebsites.net/api/Cart/user/${storedUserId}`;
                try {
                    const rs = await axios.get(url, { withCredentials: true });
                    const data = rs.data;
                    setCart(data);
                    const initialQuantities = data.reduce((acc, item) => {
                        acc[item.variantId] = item.quantity;
                        return acc;
                    }, {});
                    setQuantity(initialQuantities);
                } catch (error) {
                    console.log(error);
                }
            };
            const fetchColors = async () => {
                try {
                    const response = await axios.get('https://projectky320240926105522.azurewebsites.net/api/Color');
                    setColors(response.data);
                } catch (error) {
                    console.log(error);
                }
            };

            const fetchSizes = async () => {
                try {
                    const response = await axios.get('https://projectky320240926105522.azurewebsites.net/api/Size');
                    setSizes(response.data);
                } catch (error) {
                    console.log(error);
                }
            };

            fetchCartItems();
            fetchColors();
            fetchSizes();
        } else {
            navigate('/login');
        }
    }, [navigate]);

    const getColorName = (colorId) => {
        const color = colors.find((color) => color.colorId === colorId);
        return color ? color.colorName : 'Unknown';
    };

    const getSizeName = (sizeId) => {
        const size = sizes.find((size) => size.sizeId === sizeId);
        return size ? size.sizeName : 'Unknown';
    };

    const subTotal = cart.reduce((total, item) => {
        return total + item.price * (quantity[item.variantId] || item.quantity);
    }, 0);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setBillingDetails(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const validate = () => {
        const newErrors = {};
        let firstErrorField = null;

        if (!billingDetails.firstName) {
            newErrors.firstName = "First name is required";
            firstErrorField = firstErrorField || 'firstName';
        }
        if (!billingDetails.lastName) {
            newErrors.lastName = "Last name is required";
            firstErrorField = firstErrorField || 'lastName';
        }
        if (!billingDetails.phoneNumber) {
            newErrors.phoneNumber = "Phone number is required";
            firstErrorField = firstErrorField || 'phoneNumber';
        }
        if (!billingDetails.email) {
            newErrors.email = "Email address is required";
            firstErrorField = firstErrorField || 'email';
        }
        if (!billingDetails.address1) {
            newErrors.address1 = "Address line 1 is required";
            firstErrorField = firstErrorField || 'address1';
        }
        if (!billingDetails.city) {
            newErrors.city = "Town/City is required";
            firstErrorField = firstErrorField || 'city';
        }

        setErrors(newErrors);

        if (firstErrorField) {
            const errorField = document.getElementById(firstErrorField);
            if (errorField) {
                const rect = errorField.getBoundingClientRect();
                const offset = window.innerHeight / 2 - rect.height / 2;

                window.scrollTo({
                    top: window.scrollY + rect.top - offset,
                    behavior: 'smooth'
                });
            }
        }

        return Object.keys(newErrors).length === 0;
    };

    const handleCheckout = async (e) => {
        // Log when checkout is triggered
        console.log("handleCheckout called");

        // Prevent default if the event exists (only for form submissions)
        if (e && e.preventDefault) {
            console.log("Preventing default event behavior");
            e.preventDefault();
        } else {
            console.log("No event to prevent default for");
        }

        // Validate form data
        if (!validate()) {
            console.log("Validation failed");
            return;
        }

        console.log("Validation passed");

        const userId = localStorage.getItem('Token');
        let checkoutData = {
            userId,
            shippingMethod: selectedOption,
            paymentMethod: selectedOption,
            shippingAddress: billingDetails.address1,
            billingAddress: billingDetails.address2,
            city: billingDetails.city,
            orderNote: billingDetails.orderNotes,
            telephone: billingDetails.phoneNumber,
            email: billingDetails.email,
            name: `${billingDetails.firstName} ${billingDetails.lastName}`,
            paid: selectedOption === 'PayPal',
        };

        // Log the checkout data
        console.log("Checkout data:", checkoutData);

        try {
            const response = await axios.post('https://projectky320240926105522.azurewebsites.net/api/Order/checkout', checkoutData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.status === 200) {
                const data = response.data;
                console.log("Order placed successfully, response:", data);
                alert('Order placed successfully!');
                // Add the returned orderId to checkoutData
                checkoutData = { ...checkoutData, orderId: data.orderId };
                // Trigger email sending after successful order placement
                await sendInvoiceEmail(checkoutData);   
                navigate('/confirmation/' + data.orderId);
            } else {
                console.error("Checkout failed with status:", response.status);
                alert(`Checkout failed: ${response.data.message}`);
            }
        } catch (error) {
            console.error('Checkout error:', error);
            alert('An error occurred during checkout.');
        }
    };

    const handlePayPalSuccess = async (details) => {
        console.log(`Transaction completed by ${details.payer.name.given_name}`);
        alert(`Transaction completed by ${details.payer.name.given_name}`);

        // Call handleCheckout without passing event (this is not a form submission)
        handleCheckout();
    };

    //Function to send invoice email
    const sendInvoiceEmail = async (checkoutData) => {
        try {
            
            const emailResponse = await axios.post(`https://projectky320240926105522.azurewebsites.net/api/Order/send-invoice/${checkoutData.orderId}`, {
                email: checkoutData.email,
                name: checkoutData.name,
                orderDetails: {
                    orderId: checkoutData.orderId, // Ensure the correct order ID is passed
                    shippingMethod: checkoutData.shippingMethod,
                    paymentMethod: checkoutData.paymentMethod,
                    totalAmount: checkoutData.totalAmount,
                }
            }, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
    
            if (emailResponse.status === 200) {
                console.log("Invoice email sent successfully!");
            } else {
                console.error("Failed to send invoice email:", emailResponse.status);
            }
        } catch (error) {
            console.error("Error sending invoice email:", error);
        }
    };
    return (
        <PayPalScriptProvider options={{ "client-id": "", currency: "USD" }}>
            <section className="checkout_area section_gap">
                <div className="container">
                    <div className="billing_details">
                        <div className="row">
                            <div className="col-lg-8">
                                <h3>Billing Details</h3>
                                <form className="row contact_form" onSubmit={handleCheckout} noValidate>
                                    {['firstName', 'lastName', 'phoneNumber', 'email', 'address1', 'address2', 'city'].map((field, index) => (
                                        <div key={index} className={`col-md-${field === 'address1' || field === 'address2' || field === 'city' ? 12 : 6} form-group p_star ${billingDetails[field] ? 'input-has-value' : ''}`}>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id={field}
                                                name={field}
                                                value={billingDetails[field]}
                                                onChange={handleInputChange}
                                            />
                                            <span className="placeholder" data-placeholder={`${field === 'address1' ? 'Address line 01' : field === 'address2' ? 'Address line 02' : field.charAt(0).toUpperCase() + field.slice(1).replace('Name', ' name')}`}></span>
                                            {errors[field] && <div className="error">{errors[field]}</div>}
                                        </div>
                                    ))}

                                    <div className="col-md-12 form-group">
                                        <textarea
                                            className="form-control"
                                            name="orderNotes"
                                            id="message"
                                            rows="1"
                                            placeholder="Order Notes"
                                            value={billingDetails.orderNotes}
                                            onChange={handleInputChange}
                                        ></textarea>
                                    </div>

                                    <div className="col-md-12 form-group">
                                        <label htmlFor="paymentMethod">Payment Method</label>
                                        <select
                                            id="paymentMethod"
                                            className="form-control"
                                            value={selectedOption}
                                            onChange={(e) => setSelectedOption(e.target.value)}
                                        >
                                            <option value="COD">Cash on Delivery (COD)</option>
                                            <option value="PayPal">PayPal</option>
                                        </select>
                                    </div>

                                    <div className="col-md-12 form-group">
                                        {selectedOption === 'PayPal' ? (
                                            <PayPalButtons
                                                createOrder={(data, actions) => {
                                                    return actions.order.create({
                                                        purchase_units: [{
                                                            amount: {
                                                                value: subTotal.toFixed(2),
                                                            },
                                                        }],
                                                    });
                                                }}
                                                onApprove={(data, actions) => {
                                                    return actions.order.capture().then(handlePayPalSuccess);
                                                }}
                                                onError={(err) => {
                                                    console.error('PayPal Checkout Error:', err);
                                                    alert('Payment failed');
                                                }}
                                            />
                                        ) : (
                                            <button className="primary-btn" type="submit">Proceed to Checkout</button>
                                        )}
                                    </div>
                                </form>
                            </div>
                            <div className="col-lg-4">
                                <div className="order_box">
                                    <h2>Your Order</h2>
                                    <ul className="list">
                                        <li><a style={{ fontWeight: "bold" }}>Product <span>Total</span></a></li>
                                        {cart.map((item, index) => (
                                            <li key={index}>
                                                <a>
                                                    <div className="product-details" style={{ display: "flex", flexDirection: "column" }}>
                                                        <div className="product-name" style={{ fontWeight: "bold", overflowWrap: "break-word" }}>{item.variant.product.name}  </div>
                                                        <div className="product-color" style={{ fontSize: "0.9em", color: "#777" }}>Color: {getColorName(item.variant.colorId)} <span className="middle">× {item.quantity}</span> <span className="last">{item.price * item.quantity} $</span></div>
                                                        <div className="product-size" style={{ fontSize: "0.9em", color: "#777" }}>Size: {getSizeName(item.variant.sizeId)}</div>
                                                    </div>
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                    <ul className="list list_2">
                                        <li><a href="#">Shipping <span>{selectedOption}</span></a></li>
                                        <li><a href="#">Total <span>${(subTotal).toFixed(2)}</span></a></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </PayPalScriptProvider>
    );
}
