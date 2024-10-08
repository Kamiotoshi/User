/* global $ */
import React, { useEffect } from 'react';
import { useAddCart } from '../../js/useAddCart';
import bannerImg from '../../assets/img/banner/banner-img.png';
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';
import 'owl.carousel';

export default function Banner(props) {
    const { addToCart } = useAddCart();
    const product = props.product;

    useEffect(() => {
        // Khởi tạo Owl Carousel
        $('.active-banner-slider').owlCarousel({
            items: 1,
            loop: true,
            autoplay: true,
            autoplayTimeout: 3000,
            nav: true,
            dots: true,
            navText: ["<img src='img/banner/prev.png'>", "<img src='img/banner/next.png'>"]
        });
    }, []);

    return (
        <section className="banner-area">
            <div className="container">
                <div className="row fullscreen align-items-center justify-content-start" style={{ height: '760px' }}>
                    <div className="col-lg-12">
                        <div className="active-banner-slider owl-carousel">
                            {/* single-slide */}
                            <div className="row single-slide align-items-center d-flex">
                                <div className="col-lg-5 col-md-6">
                                    <div className="banner-content">
                                        <h1>Nike New <br />Collection!</h1>
                                        <p>The radiance lives on in the Nike Air Force 1 '07, the b-ball icon that puts a fresh spin on what you know best: crisp leather, bold colours and the perfect amount of flash to make you shine.</p>
                                        {/* <div className="add-bag d-flex align-items-center">
                                            <a onClick={() => addToCart(product)} className="add-btn" href=""><span className="lnr lnr-cross"></span></a>
                                            <span className="add-text text-uppercase">Add to Bag</span>
                                        </div> */}
                                    </div>
                                </div>
                                <div className="col-lg-7">
                                    <div className="banner-img">
                                        <img className="img-fluid" src={bannerImg} alt="" />
                                    </div>
                                </div>
                            </div>
                            {/* single-slide */}
                            <div className="row single-slide align-items-center d-flex">
                                <div className="col-lg-5 col-md-6">
                                    <div className="banner-content">
                                        <h1>Nike New <br />Collection!</h1>
                                        <p>The radiance lives on in the Nike Air Force 1 '07, the b-ball icon that puts a fresh spin on what you know best: crisp leather, bold colours and the perfect amount of flash to make you shine.</p>
                                        {/* <div className="add-bag d-flex align-items-center">
                                            <a onClick={() => addToCart(product)} className="add-btn" href=""><span className="lnr lnr-cross"></span></a>
                                            <span className="add-text text-uppercase">Add to Bag</span>
                                        </div> */}
                                    </div>
                                </div>
                                <div className="col-lg-7">
                                    <div className="banner-img">
                                        <img className="img-fluid" src={bannerImg} alt="" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
