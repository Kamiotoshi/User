/* global $ */
import React, { useEffect, useState } from 'react';
import { useAddCart } from '../../js/useAddCart';
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const ExclusiveSection = styled.section`
  .active-product-area .owl-nav button.owl-prev {
    position: absolute !important;
    left: 30% !important;
    top: -14% !important;
    opacity: .5 !important;
  }
  .active-product-area .owl-nav button.owl-next {
    position: absolute !important;
    right: 30% !important;
    top: -14% !important;
    opacity: .5 !important;
  }
  .active-product-area .owl-nav button.owl-prev:hover,
  .active-product-area .owl-nav button.owl-next:hover {
    opacity: 1 !important;
  }
`;

function Product() {
  const [products, setProducts] = useState([]);

  const fetchProducts = async () => {
    const url = 'https://projectky320240926105522.azurewebsites.net/api/Product';
    const response = await fetch(url);
    const data = await response.json();

    const productsWithDefaultQuantity = Array.isArray(data)
      ? data.map(product => ({
        ...product,
        quantity: 1,
        image: product.image || '',
      }))
      : [];

    setProducts(productsWithDefaultQuantity);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Chia sản phẩm thành hai nhóm
  const firstGroup = products.slice(0, 8);
  const secondGroup = products.slice(8, 16);

  useEffect(() => {
    $('.active-product-area').owlCarousel({
      items: 1,
      loop: true,
      autoplay: true,
      autoplayTimeout: 3000,
      nav: true,
      dots: true,
      navText: ["<img src='img/product/prev.png'>", "<img src='img/product/next.png'>"],
    });
  }, []);

  return (
    <ExclusiveSection className='container' style={{ marginTop: "70px" }}>
      <div className="row justify-content-center">
        <div className="col-lg-6 text-center">
          <div className="section-title">
            <h1>Latest Products</h1>
            <p>The radiance lives on in the Nike Air Force 1 '07, the b-ball icon that puts a fresh spin on what you know best: crisp leather, bold colours and the perfect amount of flash to make you shine.</p>
          </div>
        </div>
      </div>
      <section className="owl-carousel active-product-area section_gap" style={{ paddingTop: "0px" }}>
        <div className="single-product-slider">
          <div className="container">
            <div className="row">
              {firstGroup.map((product) => (
                <div key={product.productId} className="col-lg-3 col-md-6">
                  <div className="single-product">
                    <img className="img-fluid" src={product.image} alt={product.name} style={{ width: "255px", height: "255px" }} />
                    <div className="product-details">
                      <Link to={`/product-detail/${product.productId}`} className="social-info" style={{ textDecoration: 'none', color: 'inherit' }}>
                        <h6>{product.name}</h6>
                      </Link>
                      <div className="price">
                        <h6>${product.price}</h6>
                        <h6 className="l-through">{product.oldPrice}</h6>
                      </div>
                      <div className="prd-bottom">
                        <a href="/" className="social-info">
                          <span className="lnr lnr-heart"></span>
                          <p className="hover-text">Wishlist</p>
                        </a>
                        <a href="/" className="social-info">
                          <span className="lnr lnr-sync"></span>
                          <p className="hover-text">compare</p>
                        </a>
                        <Link to={`/product-detail/${product.productId}`} className="social-info">
                          <span className="lnr lnr-move"></span>
                          <p className="hover-text">view more</p>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="single-product-slider">
          <div className="container">
            <div className="row">
              {secondGroup.map((product) => (
                <div key={product.productId} className="col-lg-3 col-md-6">
                  <div className="single-product">
                    <img className="img-fluid" src={product.image} alt={product.name} style={{ width: "255px", height: "255px" }} />
                    <div className="product-details">
                      <Link to={`/product-detail/${product.productId}`} className="social-info" style={{ textDecoration: 'none', color: 'inherit' }}>
                        <h6>{product.name}</h6>
                      </Link>
                      <div className="price">
                        <h6>${product.price}</h6>
                        <h6 className="l-through">{product.oldPrice}</h6>
                      </div>
                      <div className="prd-bottom">
                        <a href="/" className="social-info">
                          <span className="lnr lnr-heart"></span>
                          <p className="hover-text">Wishlist</p>
                        </a>
                        <a href="/" className="social-info">
                          <span className="lnr lnr-sync"></span>
                          <p className="hover-text">compare</p>
                        </a>
                        <Link to={`/product-detail/${product.productId}`} className="social-info">
                          <span className="lnr lnr-move"></span>
                          <p className="hover-text">view more</p>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </ExclusiveSection>
  );
}

export default Product;