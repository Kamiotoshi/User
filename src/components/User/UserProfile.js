import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../../assets/css/UserProfile.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';

const UserProfile = () => {
    const [user, setUser] = useState({
        userId: '',
        name: '',
        email: '',
        phone: '',
        address: '',
        shippingAddress: '',
        billingAddress: '',
        state: '',
        city: '',
        dateOfBirth: '',
    });

    const [orders, setOrders] = useState([]);
    const [products, setProducts] = useState([]);
    const [variants, setVariants] = useState([]);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userInfoResponse = await axios.get(
                    'https://projectky320240926105522.azurewebsites.net/api/User/userProfile',
                    { withCredentials: true }
                );
                const userData = userInfoResponse.data;
                setUser({
                    userId: userData.userId,
                    name: userData.name,
                    email: userData.email,
                    phone: userData.phone,
                    address: userData.address,
                    shippingAddress: userData.shippingAddress,
                    billingAddress: userData.billingAddress,
                    state: userData.state,
                    city: userData.city,
                    dateOfBirth: userData.dateOfBirth,
                });
                fetchUserOrders(userData.userId);
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchUserData();
    }, []);

    const fetchUserOrders = async (userId) => {
        try {
            const ordersResponse = await axios.get(
                `https://projectky320240926105522.azurewebsites.net/api/Order`
            );
            const userOrders = ordersResponse.data.filter(order => order.userId === userId);
            setOrders(userOrders);
            await fetchProductDetails();
        } catch (error) {
            console.error('Error fetching orders:', error);
        }
    };

    const fetchProductDetails = async () => {
        try {
            const productsResponse = await axios.get('https://projectky320240926105522.azurewebsites.net/api/Product');
            setProducts(productsResponse.data);

            const variantsResponse = await axios.get('https://projectky320240926105522.azurewebsites.net/api/ProductVariant');
            setVariants(variantsResponse.data);
        } catch (error) {
            console.error('Error fetching product/variants:', error);
        }
    };

    const getProductName = (variantId) => {
        const variant = variants.find(variant => variant.variantId === variantId);
        const product = products.find(product => product.productId === variant?.productId);
        return product ? product.name : 'Unknown Product';
    };

    const getProductPrice = (variantId) => {
        const variant = variants.find(variant => variant.variantId === variantId);
        return variant ? variant.price : 'N/A';
    };

    // Handle Return Order based on status
    const handleReturnOrder = async (order) => {
        if (order.status !== 'Arrived') {
            alert('Order has not arrived yet (Packed, not yet arrived).');
            return;
        }

        try {
            const response = await axios.post(
                `https://projectky320240926105522.azurewebsites.net/api/Order/return/${order.orderId}`
            );
            if (response.status === 200 || response.status === 204) {
                alert('Order return requested successfully!');
                fetchUserOrders(user.userId);
            }
        } catch (error) {
            console.error('Error returning order:', error);
            alert('Unable to request return for the order.');
        }
    };

    // Handle Cancel Order based on status
    const handleCancelOrder = async (order) => {
        if (order.status !== 'pending') {
            alert('Order has not been confirmed yet.');
            return;
        }

        try {
            const response = await axios.post(
                `https://projectky320240926105522.azurewebsites.net/api/Order/cancel/${order.orderId}`
            );
            if (response.status === 200 || response.status === 204) {
                alert('Order cancelled successfully!');
                fetchUserOrders(user.userId);
            }
        } catch (error) {
            console.error('Error cancelling order:', error);
            alert('Unable to cancel the order.');
        }
    };

    const formatDate = (isoDate) => {
        if (!isoDate) return '';
        const date = new Date(isoDate);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };


    return (
        <div className="container">
            <div className="main-body">
                <div className="row gutters-sm">
                    <div className="col-md-4 mb-3">
                        <div className="card text-center">
                            <div className="card-body">
                                <img src="img/avatars/default.png" alt="User" className="rounded-circle avatar" width="150" />
                                <h4>{user.name || ''}</h4>
                                <p className="text-secondary mb-1">Full Stack Developer</p>
                                <p className="text-muted">{user.address || ''}</p>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-8">
                        <div className="card mb-3">
                            <div className="card-body">
                                <div className="row mb-2">
                                    <div className="col-sm-3"><h6 className="mb-0">Full Name</h6></div>
                                    <div className="col-sm-9 text-secondary">{user.name || ''}</div>
                                </div>
                                <hr />
                                <div className="row mb-2">
                                    <div className="col-sm-3"><h6 className="mb-0">Email</h6></div>
                                    <div className="col-sm-9 text-secondary">{user.email || ''}</div>
                                </div>
                                <hr />
                                <div className="row mb-2">
                                    <div className="col-sm-3"><h6 className="mb-0">Phone</h6></div>
                                    <div className="col-sm-9 text-secondary">{user.phone || ''}</div>
                                </div>
                                <hr />
                                <div className="row mb-2">
                                    <div className="col-sm-3"><h6 className="mb-0">Address</h6></div>
                                    <div className="col-sm-9 text-secondary">{user.address || ''}</div>
                                </div>
                                <hr />
                                <div className="row mb-2">
                                    <div className="col-sm-3"><h6 className="mb-0">Shipping Address</h6></div>
                                    <div className="col-sm-9 text-secondary">{user.shippingAddress || ''}</div>
                                </div>
                                <hr />
                                <div className="row mb-2">
                                    <div className="col-sm-3"><h6 className="mb-0">Billing Address</h6></div>
                                    <div className="col-sm-9 text-secondary">{user.billingAddress || ''}</div>
                                </div>
                                <hr />
                                <div className="row mb-2">
                                    <div className="col-sm-3"><h6 className="mb-0">State</h6></div>
                                    <div className="col-sm-9 text-secondary">{user.state || ''}</div>
                                </div>
                                <hr />
                                <div className="row mb-2">
                                    <div className="col-sm-3"><h6 className="mb-0">City</h6></div>
                                    <div className="col-sm-9 text-secondary">{user.city || ''}</div>
                                </div>
                                <hr />
                                <div className="row mb-2">
                                    <div className="col-sm-3"><h6 className="mb-0">Birthday</h6></div>
                                    <div className="col-sm-9 text-secondary">{formatDate(user.dateOfBirth)}</div>
                                </div>
                                <hr />
                                <div className="row">
                                    <div className="col-sm-12">
                                        <a className="btn btn-dark" target="__blank" href="profile_edit_data_and_skills.html">Edit Profile</a>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Orders Section */}
                        <div className="card mb-3">
                            <div className="order-section">
                                <h3 style={{ paddingLeft: '10px' }}>Recent Orders</h3>
                                <table className="order-table">
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>Date</th>
                                            <th>Name</th>
                                            <th>Price</th>
                                            <th>Status</th>
                                            <th>Payment</th>
                                            <th>View</th>
                                            <th>Refund</th>
                                            <th>Cancel</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {orders.length > 0 ? (
                                            orders.map((order, index) => (
                                                <tr key={order.orderId}>
                                                    <td>{index + 1}</td>
                                                    <td>{new Date(order.orderDate).toLocaleDateString()}</td>
                                                    <td>{getProductName(order.orderItems[0]?.variantId)}</td>
                                                    <td>${order.totalAmount}</td>
                                                    <td style={{
                                                        color: order.status === 'Refuned' || order.status === 'Denied' || order.status === 'Cancelled' ? 'red' :
                                                            order.status === 'Pending' ? 'orange' : 'green'
                                                    }}>
                                                        {order.status}
                                                    </td>
                                                    <td>{order.paymentMethod}</td>
                                                    <td>
                                                        <button className="btn btn-info">
                                                            <Link to={`/orderDetail/${order.orderId}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                                                                View
                                                            </Link>
                                                        </button>
                                                    </td>
                                                    <td>
                                                        <button
                                                            onClick={() => handleReturnOrder(order)}
                                                            className="btn btn-warning"
                                                        >
                                                            Return
                                                        </button>
                                                    </td>
                                                    <td>
                                                        <button
                                                            onClick={() => handleCancelOrder(order)}
                                                            className="btn btn-danger"
                                                        >
                                                            Cancel
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="9">No recent orders found.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
