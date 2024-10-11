import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../assets/css/style.css';
import '../../assets/css/popup.css';
import '../../assets/css/ReviewForm.css';
import { useNavigate, useParams } from 'react-router-dom';

const Orderuser = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [userProfile, setUserProfile] = useState(null);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [variants, setVariants] = useState([]);
  const [sizes, setSizes] = useState([]);
  const navigate = useNavigate(); // Hook để điều hướng trang

  // Hàm để điều hướng đến trang sản phẩm
  const handleBuyAgain = (productId) => {
    // Điều hướng đến trang chi tiết sản phẩm, giả sử URL chi tiết là `/product/:productId`
    navigate(`/product-detail/${productId}`);
  };

  const [modalOpen, setModalOpen] = useState(false); //popup
  const [selectedRating, setSelectedRating] = useState(0); //popup
  const [comment, setComment] = useState(''); //popup
  const [hoverRating, setHoverRating] = useState(0); //popup
  const [selectedProductId, setSelectedProductId] = useState(null); // Add state to store the selected productId for popup

  const handleCancelOrder = async (orderId) => {
    try {
      const response = await axios.post(
        `https://projectky320240926105522.azurewebsites.net/api/Order/cancel/${orderId}`
      );
      if (response.status === 200 || response.status === 204) {
        alert('Order has been canceled successfully.');
        // Cập nhật lại danh sách đơn hàng sau khi hủy thành công
        fetchOrders(); // Giả định hàm fetchOrders để lấy lại danh sách đơn hàng
      } else {
        alert('Failed to cancel the order.');
      }
    } catch (error) {
      console.error('Error canceling order:', error);
      alert(`Error occurred while canceling the order: ${error.message}`);
    }
  };
  const handleCompleteOrder = async (orderId) => {
    try {
      const response = await axios.post(
        `https://projectky320240926105522.azurewebsites.net/api/Order/complete/${orderId}`
      );
      if (response.status === 200 || response.status === 204) {
        alert('Order marked as completed successfully.');
        // Cập nhật lại danh sách đơn hàng sau khi cập nhật thành công
        fetchOrders(); // Giả định hàm fetchOrders để lấy lại danh sách đơn hàng
      } else {
        alert('Failed to complete the order.');
      }
    } catch (error) {
      console.error('Error marking order as completed:', error);
      alert(`Error occurred while completing the order: ${error.message}`);
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await axios.get('https://projectky320240926105522.azurewebsites.net/api/Order');
      setOrders(response.data); // Lưu danh sách đơn hàng vào state
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  useEffect(() => {
    // Lấy danh sách đơn hàng khi component render
    fetchOrders();
  }, []);


  const fetchSizes = async () => {
    try {
      const response = await axios.get('https://projectky320240926105522.azurewebsites.net/api/Size');
      setSizes(response.data);
    } catch (error) {
      console.error('Error fetching sizes:', error);
    }
  };

  const getSizeName = (sizeId) => {
    const size = sizes.find(s => s.sizeId === sizeId);
    return size ? size.sizeName : 'Unknown Size';
  };

  useEffect(() => {
    fetchSizes();
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await axios.get('https://projectky320240926105522.azurewebsites.net/api/User/userProfile', {
        withCredentials: true,
      });
      const userData = response.data;
      setUserProfile(userData);
      fetchUserOrders(userData.userId);
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const fetchUserOrders = async (userId) => {
    try {
      const ordersResponse = await axios.get('https://projectky320240926105522.azurewebsites.net/api/Order');
      const userOrders = ordersResponse.data.filter((order) => order.userId === userId);
      setOrders(userOrders);
      await fetchProductDetails();
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };
  const handleRefund = async (orderId) => {
    try {
      // Yêu cầu người dùng nhập lý do
      const reason = prompt("Please enter a reason for the return:");
      if (!reason || reason.trim() === "") {
        alert("Reason is required for the return request.");
        return;
      }

      // 1. Gửi lý do trả hàng
      const requestBody = {
        orderId: orderId,
        reason: reason, // Lý do nhập từ người dùng
        requestDate: new Date().toISOString(),
      };

      const response = await axios.post(
        `https://projectky320240926105522.azurewebsites.net/api/Return/${orderId}`,
        requestBody,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.status === 200 || response.status === 204) {
        alert('Reason for return submitted successfully! Now updating order status...');

        // 2. Cập nhật trạng thái đơn hàng thành "Return Requested"
        const statusResponse = await axios.post(
          `https://projectky320240926105522.azurewebsites.net/api/Order/return/${orderId}`,
          {},
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

        if (statusResponse.status === 200 || statusResponse.status === 204) {
          alert('Order status updated to Return Requested!');
          // Sau khi gửi yêu cầu hoàn trả, gọi lại API để kiểm tra trạng thái đơn hàng
          fetchOrderById(orderId);
        } else {
          alert('Something went wrong while updating the order status!');
        }
      } else {
        alert('Something went wrong while submitting the return reason!');
      }
    } catch (error) {
      console.error('Error processing refund request:', error.response?.data || error.message);
      if (error.response?.data?.errors) {
        console.error('Validation errors:', error.response.data.errors);
      }
      alert(`Error occurred during the refund process: ${error.response?.data?.message || error.message}`);
    }
  };

  // Hàm để lấy lại thông tin đơn hàng và kiểm tra trạng thái
  const fetchOrderById = async (orderId) => {
    try {
      const response = await axios.get(`https://projectky320240926105522.azurewebsites.net/api/Order/${orderId}`);
      console.log('Updated Order Data:', response.data);
    } catch (error) {
      console.error('Error fetching updated order:', error.response?.data || error.message);
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
    const variant = variants.find((variant) => variant.variantId === variantId);
    const product = products.find((product) => product.productId === variant?.productId);
    return product ? product.name : 'Unknown Product';
  };
  //popup
  const openModal = (productId) => {
    setSelectedProductId(productId); // Store the selected productId
    setModalOpen(true); // Open the modal
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const handleStarClick = (rating) => {
    setSelectedRating(rating);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (selectedRating === 0) {
      alert('Please select a rating.');
      return;
    }

    const userId = localStorage.getItem('Token');

    const reviewData = {
      userId: userId,
      productId: selectedProductId, // Use the selected productId from state
      rating: selectedRating,
      comment: comment,
    };

    try {
      const response = await fetch(`https://projectky320240926105522.azurewebsites.net/api/Review/${selectedProductId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(reviewData),
      });

      if (response.ok) {
        alert('Review submitted successfully!');
        setComment('');
        setSelectedRating(0);
      } else {
        alert('Failed to submit review. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('An error occurred while submitting your review.');
    }
  };

  return (
    <div className="orderuser-wrapper">
        <div className="acontainer">
        <div className="one" />
        {/* Sidebar */}
        <div className="asidebar">
          <div className="aprofile-section">
            <img src="https://th.bing.com/th/id/OIP.a9qb_VLfFjvlrDfc-iNLpgHaHa?rs=1&pid=ImgDetMain" alt="Profile Picture" />
            <p className="ausername">{userProfile?.name}</p>

          </div>
          <ul className="amenu">
            <li>
              <a href="/user-settings">My Account</a>
            </li>
          </ul>
        </div>
        {/* Main content */}
        <div className="amain-content">
          <div className="atabs">
            <ul>
              <li>
                <a
                  href="#"
                  className={`tab-link ${activeTab === 'all' ? 'active' : ''}`}
                  onClick={() => setActiveTab('all')}
                >
                  All
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className={`tab-link ${activeTab === 'to-pay' ? 'active' : ''}`}
                  onClick={() => setActiveTab('to-pay')}
                >
                  Confirm
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className={`tab-link ${activeTab === 'to-ship' ? 'active' : ''}`}
                  onClick={() => setActiveTab('to-ship')}
                >
                  Ship
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className={`tab-link ${activeTab === 'to-receive' ? 'active' : ''}`}
                  onClick={() => setActiveTab('to-receive')}
                >
                  Receive
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className={`tab-link ${activeTab === 'Arrived' ? 'active' : ''}`}
                  onClick={() => setActiveTab('Arrived')}
                >
                  Arrived
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className={`tab-link ${activeTab === 'completed' ? 'active' : ''}`}
                  onClick={() => setActiveTab('completed')}
                >
                  Completed
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className={`tab-link ${activeTab === 'cancelled' ? 'active' : ''}`}
                  onClick={() => setActiveTab('cancelled')}
                >
                  Cancelled
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className={`tab-link ${activeTab === 'Return' ? 'active' : ''}`}
                  onClick={() => setActiveTab('Return')}
                >
                  Return
                </a>
              </li>
            </ul>
          </div>

          {/* Content for "All" */}
          {activeTab === 'all' && (
            <div className="tab-content" id="all">
              {orders.length > 0 ? (
                orders.map((order, index) => (
                  <div key={order.orderId} className="aorder-item">
                    <div className="aitem-header">
                      <span className="ashop-name">Status:{order.status}</span>

                      <div className="ashop-actions">
                        <button className="aview-shop">View Shop</button>
                      </div>
                    </div>
                    <div className="aitem-body">
                      <img src={order.orderItems[0]?.variant?.image || 'default-image.jpg'} alt="Product Image" />
                      <div className="aitem-details">
                        <p>{getProductName(order.orderItems[0]?.variantId)}</p>
                        <div className='pos' style={{ display: 'flex', justifyContent: 'space-between' }} >
                          <p style={{ color: 'rgba(0, 0, 0, 0.54)' }} >Size:{getSizeName(order.orderItems[0]?.variant?.sizeId)}</p>
                          <span><span> {order.orderItems[0]?.variant?.price} $</span> </span>
                        </div>
                        <p>x{order.orderItems[0]?.quantity || 'N/A'}</p>
                        <span className="atotal-price">Total: {order.totalAmount} $</span>
                      </div>
                      <br></br>


                    </div>
                    <div className="aitem-footer">
                      {/* //popup */}
                      {order.status === 'Arrived' && (
                        <button
                          onClick={() => handleCompleteOrder(order.orderId)}
                          className="abuy-again"
                        >
                          Completed
                        </button>
                      )}
                      {order.status === 'Arrived' && (
                      <button onClick={() => handleRefund(order.orderId)}>Refund</button>
                      )}
                      {order.status === 'Completed' && (
                        <button
                          onClick={() => openModal(order.orderItems[0]?.variant?.productId)}
                          className="arate"
                        >
                          Rate
                        </button>
                      )}
                      {order.status === 'pending' && (
                        <button className="acontact-seller" onClick={() => handleCancelOrder(order.orderId)} disabled={order.status !== 'pending'}> Cancel Order</button>
                      )}
                      {(order.status === 'completed' || order.status === 'cancelled' || order.status === 'Order cancelled') && (
                        <button
                          className="abuy-again"
                          onClick={() => handleBuyAgain(order.orderItems[0]?.variant?.productId)}
                        >
                          Buy Again
                        </button>
                      )}

                    </div>
                    {order.status === 'Order cancelled' && (
                      <span style={{ color: 'rgba(0, 0, 0, 0.54)' }}>Cancelled by you</span>

                    )}
                  </div>
                ))
              ) : (
                <div>No recent orders found.</div>
              )}
            </div>
          )}
          {/* Modal for rating popup*/}
          {modalOpen && (
            <div className="modal">
              <div className="modal-content">
                <span onClick={closeModal} className="close">&times;</span>
                <div className="review_box">
                  <h4>Add a Review</h4>
                  <p>Your Rating:</p>
                  <ul className="list star-rating">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <li key={star}>
                        <a
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            handleStarClick(star);
                          }}
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                        >
                          <i className={`fa fa-star ${star <= (hoverRating || selectedRating) ? 'selected' : ''}`}></i>
                        </a>
                      </li>
                    ))}
                  </ul>

                  <form className="contact_form" onSubmit={handleSubmit}>
                    <div className="form-group">
                      <textarea
                        className="form-control"
                        name="comment"
                        value={comment}
                        placeholder="Review"
                        rows="1"
                        onChange={(e) => setComment(e.target.value)}
                      ></textarea>
                    </div>
                    <div className="text-right">
                      <button type="submit" className="primary-btn">Submit Now</button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}
          {/* Content for other tabs as needed */}
          {activeTab === 'to-pay' && (
            <div className="tab-content" id="to-pay">
              {/* Lọc các order có status là "Confirmed" */}
              {orders.filter(order => order.status === "Confirmed").length > 0 ? (
                orders.filter(order => order.status === "Confirmed").map((order, index) => (
                  <div key={order.orderId} className="aorder-item">
                    <div className="aitem-header">
                      <span className="ashop-name">Status:{order.status}</span>

                      <div className="ashop-actions">
                        <button className="aview-shop">View Shop</button>
                      </div>
                    </div>
                    <div className="aitem-body">
                      <img src={order.orderItems[0]?.variant?.image || 'default-image.jpg'} alt="Product Image" />
                      <div className="aitem-details">
                        <p>{getProductName(order.orderItems[0]?.variantId)}</p>
                        <p>Size: {getSizeName(order.orderItems[0]?.variant?.sizeId)}</p>
                        <span>  <span>Price {order.orderItems[0]?.variant?.price} $</span> </span>
                        <p>Quantity: {order.orderItems[0]?.quantity || 'N/A'}</p>
                        <span className="atotal-price">Total: {order.totalAmount} $</span>
                      </div>
                    </div>

                  </div>
                ))
              ) : (
                <div>No orders with "Confirmed" status found.</div>
              )}
            </div>
          )}
          {activeTab === 'to-ship' && (
            <div className="tab-content" id="to-ship">
              {/* Lọc các order có status là "Confirmed" */}
              {orders.filter(order => order.status === "Picked up").length > 0 ? (
                orders.filter(order => order.status === "Picked up").map((order, index) => (
                  <div key={order.orderId} className="aorder-item">
                    <div className="aitem-header">
                      <span className="ashop-name">Status:{order.status}</span>

                      <div className="ashop-actions">
                        <button className="aview-shop">View Shop</button>
                      </div>
                    </div>
                    <div className="aitem-body">
                      <img src={order.orderItems[0]?.variant?.image || 'default-image.jpg'} alt="Product Image" />
                      <div className="aitem-details">
                        <p>{getProductName(order.orderItems[0]?.variantId)}</p>
                        <p>Size: {getSizeName(order.orderItems[0]?.variant?.sizeId)}</p>
                        <span>  <span>Price {order.orderItems[0]?.variant?.price} $</span> </span>
                        <p>Quantity: {order.orderItems[0]?.quantity || 'N/A'}</p>
                        <span className="atotal-price">Total: {order.totalAmount} $</span>
                      </div>
                    </div>

                  </div>
                ))
              ) : (
                <div>No orders with "To-Ship" status found.</div>
              )}
            </div>
          )}
          {activeTab === 'to-receive' && (
            <div className="tab-content" id="to-receive">
              {/* Lọc các order có status là "Confirmed" */}
              {orders.filter(order => order.status === "Dispatched").length > 0 ? (
                orders.filter(order => order.status === "Dispatched").map((order, index) => (
                  <div key={order.orderId} className="aorder-item">
                    <div className="aitem-header">
                      <span className="ashop-name">Status:{order.status}</span>

                      <div className="ashop-actions">
                        <button className="aview-shop">View Shop</button>
                      </div>
                    </div>
                    <div className="aitem-body">
                      <img src={order.orderItems[0]?.variant?.image || 'default-image.jpg'} alt="Product Image" />
                      <div className="aitem-details">
                        <p>{getProductName(order.orderItems[0]?.variantId)}</p>
                        <p>Size: {getSizeName(order.orderItems[0]?.variant?.sizeId)}</p>
                        <span>  <span>Price {order.orderItems[0]?.variant?.price} $</span> </span>
                        <p>Quantity: {order.orderItems[0]?.quantity || 'N/A'}</p>
                        <span className="atotal-price">Total: {order.totalAmount} $</span>
                      </div>
                    </div>

                  </div>
                ))
              ) : (
                <div>No orders with "To-Arrived" status found.</div>
              )}
            </div>
          )}
          {activeTab === 'Arrived' && (
            <div className="tab-content" id="Arrived">
              {/* Lọc các order có status là "Confirmed" */}
              {orders.filter(order => order.status === "Arrived").length > 0 ? (
                orders.filter(order => order.status === "Arrived").map((order, index) => (
                  <div key={order.orderId} className="aorder-item">
                    <div className="aitem-header">
                      <span className="ashop-name">Status:{order.status}</span>

                      <div className="ashop-actions">
                        <button className="aview-shop">View Shop</button>
                      </div>
                    </div>
                    <div className="aitem-body">
                      <img src={order.orderItems[0]?.variant?.image || 'default-image.jpg'} alt="Product Image" />
                      <div className="aitem-details">
                        <p>{getProductName(order.orderItems[0]?.variantId)}</p>
                        <p>Size: {getSizeName(order.orderItems[0]?.variant?.sizeId)}</p>
                        <span>  <span>Price {order.orderItems[0]?.variant?.price}$</span> </span>
                        <p>Quantity: {order.orderItems[0]?.quantity || 'N/A'}</p>
                        <span className="atotal-price">Total: {order.totalAmount}$</span>
                      </div>
                    </div>
                    <div className="aitem-footer">
                      {/* //popup */}
                      {order.status === 'Arrived' && (
                        <button
                          onClick={() => handleCompleteOrder(order.orderId)}
                          className="abuy-again"
                        >
                          Completed
                        </button>
                      )}
                      {order.status === 'Completed' && (
                        <button
                          onClick={() => openModal(order.orderItems[0]?.variant?.productId)}
                          className="arate"
                        >
                          Rate
                        </button>
                      )}
                      {order.status === 'Arrived' && (
                      <button onClick={() => handleRefund(order.orderId)}>Refund</button>
        )}
                      {order.status === 'pending' && (
                        <button className="acontact-seller" onClick={() => handleCancelOrder(order.orderId)} disabled={order.status !== 'pending'}> Cancel Order</button>
                      )}
                      {(order.status === 'completed' || order.status === 'cancelled') && (
                        <button
                          className="abuy-again"
                          onClick={() => handleBuyAgain(order.orderItems[0]?.variant?.productId)}
                        >
                          Buy Again
                        </button>
                      )}

                    </div>
                  </div>
                ))
              ) : (
                <div>No orders with "To-Arrived" status found.</div>
              )}
            </div>
          )}
          {activeTab === 'completed' && (
            <div className="tab-content" id="completed">
              {/* Lọc các order có status là "Confirmed" */}
              {orders.filter(order => order.status === "Completed").length > 0 ? (
                orders.filter(order => order.status === "Completed").map((order, index) => (
                  <div key={order.orderId} className="aorder-item">
                    <div className="aitem-header">
                      <span className="ashop-name">Status:{order.status}</span>

                      <div className="ashop-actions">
                        <button className="aview-shop">View Shop</button>
                      </div>
                    </div>
                    <div className="aitem-body">
                      <img src={order.orderItems[0]?.variant?.image || 'default-image.jpg'} alt="Product Image" />
                      <div className="aitem-details">
                        <p>{getProductName(order.orderItems[0]?.variantId)}</p>
                        <p>Size: {getSizeName(order.orderItems[0]?.variant?.sizeId)}</p>
                        <span>  <span>Price {order.orderItems[0]?.variant?.price}$</span> </span>
                        <p>Quantity: {order.orderItems[0]?.quantity || 'N/A'}</p>
                        <span className="atotal-price">Total: {order.totalAmount}$</span>
                      </div>
                    </div>
                    <div className="aitem-footer">
                      {/* //popup */}
                      {order.status === 'Arrived' && (
                        <button
                          onClick={() => handleCompleteOrder(order.orderId)}
                          className="abuy-again"
                        >
                          Completed
                        </button>
                      )}
                      {order.status === 'Completed' && (
                        <button
                          onClick={() => openModal(order.orderItems[0]?.variant?.productId)}
                          className="arate"
                        >
                          Rate
                        </button>
                      )}
                      {order.status === 'Arrived' && (
                        <button className="acontact-seller" onClick={handleRefund}>
                          Refund
                        </button>
                      )}
                      {order.status === 'pending' && (
                        <button className="acontact-seller" onClick={() => handleCancelOrder(order.orderId)} disabled={order.status !== 'pending'}> Cancel Order</button>
                      )}
                      {(order.status === 'completed' || order.status === 'cancelled') && (
                        <button
                          className="abuy-again"
                          onClick={() => handleBuyAgain(order.orderItems[0]?.variant?.productId)}
                        >
                          Buy Again
                        </button>
                      )}

                    </div>
                  </div>
                ))
              ) : (
                <div>No orders with "To-Arrived" status found.</div>
              )}
            </div>
          )}
          {activeTab === 'cancelled' && (
            <div className="tab-content" id="cancelled">
              {/* Lọc các order có status là "Confirmed" */}
              {orders.filter(order => order.status === "Order cancelled").length > 0 ? (
                orders.filter(order => order.status === "Order cancelled").map((order, index) => (
                  <div key={order.orderId} className="aorder-item">
                    <div className="aitem-header">
                      <span className="ashop-name">Status:{order.status}</span>

                      <div className="ashop-actions">
                        <button className="aview-shop">View Shop</button>
                      </div>
                    </div>
                    <div className="aitem-body">
                      <img src={order.orderItems[0]?.variant?.image || 'default-image.jpg'} alt="Product Image" />
                      <div className="aitem-details">
                        <p>{getProductName(order.orderItems[0]?.variantId)}</p>
                        <p>Size: {getSizeName(order.orderItems[0]?.variant?.sizeId)}</p>
                        <span>  <span>Price {order.orderItems[0]?.variant?.price}$</span> </span>
                        <p>Quantity: {order.orderItems[0]?.quantity || 'N/A'}</p>
                        <span className="atotal-price">Total: {order.totalAmount}$</span>
                      </div>
                    </div>
                    <div className="aitem-footer">
                      {/* //popup */}
                      <button
                        className="abuy-again"
                        onClick={() => handleBuyAgain(order.orderItems[0]?.variant?.productId)}
                      >
                        Buy Again
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div>No orders with "To-Arrived" status found.</div>
              )}
            </div>
          )}
          {activeTab === 'Return' && (
            <div className="tab-content" id="Return">
              {/* Lọc các order có status là "Confirmed" */}
              {orders.filter(order => order.status === "Return Approved" || 'Return Denied').length > 0 ? (
                orders.filter(order => order.status === "Return Approved" || 'Return Denied').map((order, index) => (
                  <div key={order.orderId} className="aorder-item">
                    <div className="aitem-header">
                      <span className="ashop-name">Status:{order.status}</span>

                      <div className="ashop-actions">
                        <button className="aview-shop">View Shop</button>
                      </div>
                    </div>
                    <div className="aitem-body">
                      <img src={order.orderItems[0]?.variant?.image || 'default-image.jpg'} alt="Product Image" />
                      <div className="aitem-details">
                        <p>{getProductName(order.orderItems[0]?.variantId)}</p>
                        <p>Size: {getSizeName(order.orderItems[0]?.variant?.sizeId)}</p>
                        <span>  <span>Price {order.orderItems[0]?.variant?.price}$</span> </span>
                        <p>Quantity: {order.orderItems[0]?.quantity || 'N/A'}</p>
                        <span className="atotal-price">Total: {order.totalAmount}$</span>
                      </div>
                    </div>
                    <div className="aitem-footer">
                      {/* //popup */}

                    </div>
                  </div>
                ))
              ) : (
                <div>No orders with "To-Arrived" status found.</div>
              )}
            </div>
          )}

        </div>
        <div className="one" />
      </div>
    </div>
    
  );
};

export default Orderuser;
