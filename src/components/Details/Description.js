import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import '../../assets/css/ReviewForm.css';
import axios from 'axios';

const Description = () => {
  const { id } = useParams(); // Gets the productId from URL params
  const [reviews, setReviews] = useState([]);
  const [users, setUsers] = useState([]);
  const [averageRating, setAverageRating] = useState(0); // For overall rating
  const [starCounts, setStarCounts] = useState({
    5: 0,
    4: 0,
    3: 0,
    2: 0,
    1: 0,
  }); // For counting the number of reviews per star rating


  //review
  useEffect(() => {
    const fetchReview = async () => {
      try {
        const reviewResponse = await fetch(`https://projectky320240926105522.azurewebsites.net/api/Review/product/${id}`);
        const reviewData = await reviewResponse.json();
        setReviews(reviewData || []); // Ensure reviewData is set to an array if null or undefined
         // Calculate overall rating and breakdown by star
         calculateRatings(reviewData);
      } catch (error) {
        console.error('Error fetching reviews:', error);
        setReviews([]); // Set to an empty array in case of error
      }
    };

    fetchReview();
  }, []);

  const calculateRatings = (reviewData) => {
    if (!reviewData || reviewData.length === 0) return;

    let totalRating = 0;
    const starCountsTemp = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };

    // Calculate total rating and count stars
    reviewData.forEach((review) => {
      totalRating += review.rating;
      starCountsTemp[review.rating] += 1;
    });

    // Set the calculated values
    setAverageRating((totalRating / reviewData.length).toFixed(1)); // Average rating
    setStarCounts(starCountsTemp); // Breakdown of star counts
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <i
          key={i}
          className={`fa fa-star ${i <= rating ? 'selected' : ''}`}
          style={{ color: i <= rating ? '#ffc107' : '#e4e5e9' }} // Example color styling
        ></i>
      );
    }
    return stars;
  };
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('https://projectky320240926105522.azurewebsites.net/api/User');
        setUsers(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchUsers();
  }, []);
  const getUserName = (userId) => {
    const user = users.find((user) => user.userId === userId);
    return user ? user.name : 'Unknown';
  };

  return (
    <div>
      <section className="product_description_area">
        <div className="container">
          <ul className="nav nav-tabs" id="myTab" role="tablist">
            <li className="nav-item">
              <a
                className="nav-link"
                id="home-tab"
                data-toggle="tab"
                href="#home"
                role="tab"
                aria-controls="home"
                aria-selected="true"
              >
                Description
              </a>
            </li>
            <li className="nav-item">
              <a
                className="nav-link"
                id="profile-tab"
                data-toggle="tab"
                href="#profile"
                role="tab"
                aria-controls="profile"
                aria-selected="false"
              >
                Specification
              </a>
            </li>
            <li className="nav-item">
              <a
                className="nav-link"
                id="contact-tab"
                data-toggle="tab"
                href="#contact"
                role="tab"
                aria-controls="contact"
                aria-selected="false"
              >
                Comments
              </a>
            </li>
            <li className="nav-item">
              <a
                className="nav-link active"
                id="review-tab"
                data-toggle="tab"
                href="#review"
                role="tab"
                aria-controls="review"
                aria-selected="false"
              >
                Reviews
              </a>
            </li>
          </ul>
          <div className="tab-content" id="myTabContent">
            <div
              className="tab-pane fade"
              id="home"
              role="tabpanel"
              aria-labelledby="home-tab"
            >
              <p>
                Beryl Cook is one of Britain’s most talented and amusing artists
                .Beryl’s pictures feature women of all shapes and sizes enjoying
                themselves .Born between the two world wars, Beryl Cook eventually
                left Kendrick School in Reading at the age of 15, where she went to
                secretarial school and then into an insurance office. After moving to
                London and then Hampton, she eventually married her next door
                neighbour from Reading, John Cook. He was an officer in the Merchant
                Navy and after he left the sea in 1956, they bought a pub for a year
                before John took a job in Southern Rhodesia with a motor company.
                Beryl bought their young son a box of watercolours, and when showing
                him how to use it, she decided that she herself quite enjoyed
                painting. John subsequently bought her a child’s painting set for her
                birthday and it was with this that she produced her first significant
                work, a half-length portrait of a dark-skinned lady with a vacant
                expression and large drooping breasts. It was aptly named ‘Hangover’
                by Beryl’s husband and
              </p>
              <p>
                It is often frustrating to attempt to plan meals that are designed for
                one. Despite this fact, we are seeing more and more recipe books and
                Internet websites that are dedicated to the act of cooking for one.
                Divorce and the death of spouses or grown children leaving for college
                are all reasons that someone accustomed to cooking for more than one
                would suddenly need to learn how to adjust all the cooking practices
                utilized before into a streamlined plan of cooking that is more
                efficient for one person creating less
              </p>
            </div>
            <div
              className="tab-pane fade"
              id="profile"
              role="tabpanel"
              aria-labelledby="profile-tab"
            >
              <div className="table-responsive">
                <table className="table">
                  <tbody>
                    <tr>
                      <td>
                        <h5>Width</h5>
                      </td>
                      <td>
                        <h5>128mm</h5>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <h5>Height</h5>
                      </td>
                      <td>
                        <h5>508mm</h5>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <h5>Depth</h5>
                      </td>
                      <td>
                        <h5>85mm</h5>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <h5>Weight</h5>
                      </td>
                      <td>
                        <h5>52gm</h5>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <h5>Quality checking</h5>
                      </td>
                      <td>
                        <h5>yes</h5>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <h5>Freshness Duration</h5>
                      </td>
                      <td>
                        <h5>03days</h5>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <h5>When packeting</h5>
                      </td>
                      <td>
                        <h5>Without touch of hand</h5>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <h5>Each Box contains</h5>
                      </td>
                      <td>
                        <h5>60pcs</h5>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div
              className="tab-pane fade"
              id="contact"
              role="tabpanel"
              aria-labelledby="contact-tab"
            >
              <div className="row">
                <div className="col-lg-6">
                  <div className="comment_list">
                    <div className="review_item">
                      <div className="media">
                        <div className="d-flex">
                          <img src="img/product/review-1.png" alt="" />
                        </div>
                        <div className="media-body">
                          <h4>Blake Ruiz</h4>
                          <h5>12th Feb, 2018 at 05:56 pm</h5>
                          <a className="reply_btn" href="#">
                            Reply
                          </a>
                        </div>
                      </div>
                      <p>
                        Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed
                        do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                        Ut enim ad minim veniam, quis nostrud exercitation ullamco
                        laboris nisi ut aliquip ex ea commodo
                      </p>
                    </div>
                    <div className="review_item reply">
                      <div className="media">
                        <div className="d-flex">
                          <img src="img/product/review-2.png" alt="" />
                        </div>
                        <div className="media-body">
                          <h4>Blake Ruiz</h4>
                          <h5>12th Feb, 2018 at 05:56 pm</h5>
                          <a className="reply_btn" href="#">
                            Reply
                          </a>
                        </div>
                      </div>
                      <p>
                        Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed
                        do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                        Ut enim ad minim veniam, quis nostrud exercitation ullamco
                        laboris nisi ut aliquip ex ea commodo
                      </p>
                    </div>
                    <div className="review_item">
                      <div className="media">
                        <div className="d-flex">
                          <img src="img/product/review-3.png" alt="" />
                        </div>
                        <div className="media-body">
                          <h4>Blake Ruiz</h4>
                          <h5>12th Feb, 2018 at 05:56 pm</h5>
                          <a className="reply_btn" href="#">
                            Reply
                          </a>
                        </div>
                      </div>
                      <p>
                        Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed
                        do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                        Ut enim ad minim veniam, quis nostrud exercitation ullamco
                        laboris nisi ut aliquip ex ea commodo
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-lg-6">
                  <div className="review_box">
                    <h4>Post a comment</h4>
                    <form
                      className="row contact_form"
                      action="contact_process.php"
                      method="post"
                      id="contactForm"
                      noValidate="novalidate"
                    >
                      <div className="col-md-12">
                        <div className="form-group">
                          <input
                            type="text"
                            className="form-control"
                            id="name"
                            name="name"
                            placeholder="Your Full name"
                          />
                        </div>
                      </div>
                      <div className="col-md-12">
                        <div className="form-group">
                          <input
                            type="email"
                            className="form-control"
                            id="email"
                            name="email"
                            placeholder="Email Address"
                          />
                        </div>
                      </div>
                      <div className="col-md-12">
                        <div className="form-group">
                          <input
                            type="text"
                            className="form-control"
                            id="number"
                            name="number"
                            placeholder="Phone Number"
                          />
                        </div>
                      </div>
                      <div className="col-md-12">
                        <div className="form-group">
                          <textarea
                            className="form-control"
                            name="message"
                            id="message"
                            rows={1}
                            placeholder="Message"
                            defaultValue={""}
                          />
                        </div>
                      </div>
                      <div className="col-md-12 text-right">
                        <button type="submit" value="submit" className="btn primary-btn">
                          Submit Now
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
            <div
              className="tab-pane fade show active"
              id="review"
              role="tabpanel"
              aria-labelledby="review-tab"
            >
              <div className="row">
                <div className="col-lg-6">
                  <div className="row total_rate">
                    <div className="col-6">
                      <div className="box_total">
                        <h5>Overall</h5>
                        <h4>{averageRating}</h4> {/* Display overall average rating */}
                        <h6>({reviews.length} Reviews)</h6> {/* Display number of reviews */}
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="rating_list">
                        <h3>Based on {reviews.length} Reviews</h3>
                        <ul className="list">
                          <li>
                            <a href="#">
                              5 Star {renderStars(5)} {starCounts[5]}
                            </a>
                          </li>
                          <li>
                            <a href="#">
                              4 Star {renderStars(4)} {starCounts[4]}
                            </a>
                          </li>
                          <li>
                            <a href="#">
                              3 Star {renderStars(3)} {starCounts[3]}
                            </a>
                          </li>
                          <li>
                            <a href="#">
                              2 Star {renderStars(2)} {starCounts[2]}
                            </a>
                          </li>
                          <li>
                            <a href="#">
                              1 Star {renderStars(1)} {starCounts[1]}
                            </a>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div className="review_list">
                    {/* Safely check if reviews exist */}
                    {reviews && reviews.length > 0 ? (
                      reviews.map((review) => (
                        <div className="review_item" key={review.reviewId}>
                          <div className="media">
                            <div className="d-flex">
                              <img src="img/product/review-1.png" alt="" /> {/* Placeholder image */}
                            </div>
                            <div className="media-body">
                              <h4>{getUserName(review.userId)}</h4> {/* Use the reviewer's name */}
                              {/* Render stars based on review.rating */}
                              {renderStars(review.rating)}
                            </div>
                          </div>
                          <p>{review.comment}</p> {/* Display review comment */}
                        </div>
                      ))
                    ) : (
                      <p>No reviews available.</p>
                    )}
                  </div>
                </div>
                {/* <div className="col-lg-6">
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
                            <i
                              className={`fa fa-star ${
                                star <= (hoverRating || selectedRating) ? 'selected' : ''
                              }`}
                            ></i>
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
                        <button type="submit" className="primary-btn">
                          Submit Now
                        </button>
                      </div>
                    </form>
                  </div>
                </div> */}
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}

export default Description