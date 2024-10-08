import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import '../../assets/css/OrderSummary.css';

const OrderSummary = () => {
    const { id } = useParams();  // Extract orderId from URL
    console.log(id)
    const [order, setOrder] = useState(null);  // To store the entire order data
    const [loading, setLoading] = useState(true);  // To handle loading state
    const [colors, setColors] = useState([]);
    const [sizes, setSizes] = useState([]);
    const [images, setImages] = useState([]);
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchOrderData = async () => {
            try {
                const response = await axios.get(`https://projectky320240926105522.azurewebsites.net/api/Order/${id}`);
                setOrder(response.data);  // Set the fetched order data
                setLoading(false);  // Set loading to false after fetching
            } catch (error) {
                console.error("Error fetching order data:", error);
                setLoading(false);
            }
        };
        // Fetch product name
        const fetchProducts = async () => {
            try {
                const response = await axios.get('https://projectky320240926105522.azurewebsites.net/api/Product');
                setProducts(response.data);
            } catch (error) {
                console.log(error);
            }
        };
        // Fetch images
        const fetchImages = async () => {
            try {
                const response = await axios.get('https://projectky320240926105522.azurewebsites.net/api/Product');
                setImages(response.data);
            } catch (error) {
                console.log(error);
            }
        };
        // Fetch colors
        const fetchColors = async () => {
            try {
                const response = await axios.get('https://projectky320240926105522.azurewebsites.net/api/Color');
                setColors(response.data);
            } catch (error) {
                console.log(error);
            }
        };

        // Fetch sizes
        const fetchSizes = async () => {
            try {
                const response = await axios.get('https://projectky320240926105522.azurewebsites.net/api/Size');
                setSizes(response.data);
            } catch (error) {
                console.log(error);
            }
        };

        fetchProducts();
        fetchImages();
        fetchColors();
        fetchSizes();
        fetchOrderData();
    }, [id]);
    const getProductName = (productId) => {
        const product = products.find((product) => product.productId === productId);
        return product ? product.name : 'Unknown';
    };
    const getImageName = (productId) => {
        const image = images.find((image) => image.productId === productId);
        return image ? image.image : 'Unknown';
    };

    const getColorName = (colorId) => {
        const color = colors.find((color) => color.colorId === colorId);
        return color ? color.colorName : 'Unknown';
    };

    const getSizeName = (sizeId) => {
        const size = sizes.find((size) => size.sizeId === sizeId);
        return size ? size.sizeName : 'Unknown';
    };
    if (loading) {
        return <div>Loading...</div>;
    }

    if (!order) {
        return <div>Order not found</div>;
    }

    const { orderItems, totalAmount, shippingMethod, paymentMethod, name, shippingAddress, billingAddress, city, orderNote, telephone, email } = order;

    const subtotal = orderItems.reduce((total, item) => total + item.price * item.quantity, 0);
    const shippingFee = shippingMethod === 'express' ? 5.00 : 0.00;


    return (
        <div className="container order-area">
            <div className="order-details">
                <h3>Order details <span className="circle-text">{orderItems.length}</span></h3>
                {orderItems.map(item => (
                    <div className="d-flex order-item" key={item.orderItemId}>
                        <div className="flex-grow-1 ms-3">
                            <img className="img-fluid" src={item.variant.image} alt={item.name} />
                            <div className="row item-details">
                                <div className="col-md-6 mb-3 mb-md-0">
                                    {/* <span className="h5 d-block">Product ID: {item.variant.productId}</span> */}
                                    <span className="h5 d-block">Product Name: {getProductName(item.variant.productId)}</span>
                                    <div className="fs-6 text-body">
                                        <span>Color ID:</span>
                                        <span className="fw-semibold"> {getColorName(item.variant.colorId)}</span>
                                    </div>
                                    <div className="fs-6 text-body">
                                        <span>Size ID:</span>
                                        <span className="fw-semibold"> {getSizeName(item.variant.sizeId)}</span>
                                    </div>
                                </div>
                                <div className="col col-md-2 align-self-center">
                                    <h5>${item.price.toFixed(2)}</h5>
                                </div>
                                <div className="col col-md-2 align-self-center">
                                    <h5>x{item.quantity}</h5>
                                </div>
                                <div className="col col-md-2 align-self-center text-end">
                                    <h5>${(item.price * item.quantity).toFixed(2)}</h5>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                <div className="total-section">
                    <div className="total-row">
                        <span>Subtotal:</span>
                        <span>${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="total-row">
                        <span>Shipping fee:</span>
                        <span>Free</span>
                    </div>
                    <div className="total-row">
                        <span>Total Amount:</span>
                        <span>${totalAmount.toFixed(2)}</span>
                    </div>
                </div>
            </div>
            {/* // Customer info */}
            <div className="customer-info" style={{ marginTop: "0" }}>
                <div className="card mb-6 customer-details">
                    <div className="card-header">
                        <h5 className="card-title m-0">Customer details</h5>
                    </div>
                    <div className="card-body">
                        <div className="d-flex justify-content-start align-items-center mb-6">

                            <div className="d-flex flex-column">
                                <h6 className="mb-1">Name : {order.name}</h6>


                            </div>

                        </div>


                        <div className="d-flex justify-content-between">
                            <h6 className="mb-1">Contact info</h6>

                        </div>
                        <p className="mb-1">Email: {order.email}</p>
                        <p className="mb-0">Mobile: {order.telephone}</p>
                        <p className="mb-1">ShippingMethod: {order.shippingMethod}</p>
                        <p className="mb-0">PaymentMethod: {order.paymentMethod}</p>
                    </div>
                </div>
                <div className="card mb-6">
                    <div className="card-header d-flex justify-content-between">
                        <h5 className="card-title m-0">Shipping address</h5>

                    </div>
                    <div className="card-body">
                        <p className="mb-0">
                            {order.shippingAddress}<br />
                            {order.city} <br />

                        </p>
                    </div>
                </div>
                <div className="card mb-6">
                    <div className="card-header d-flex justify-content-between pb-2">
                        <h5 className="card-title m-0">Billing address</h5>

                    </div>
                    <div className="card-body">
                        <p className="mb-6">
                            {order.billingAddress} <br />
                            {order.city} <br />

                        </p>
                    </div>
                </div>
                <div className="card mb-6">
                    <div className="card-header d-flex justify-content-between pb-2">
                        <h5 className="card-title m-0">Order Note</h5>

                    </div>
                    <div className="card-body">
                        <p className="mb-6">
                            {order.orderNote}

                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default OrderSummary;
