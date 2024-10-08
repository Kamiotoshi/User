import { useAddCart } from '../../js/useAddCart';
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useCheckUserLogin } from '../../js/useCheckUserLogin';
import useProductSearch from '../../js/useProductSearch';

export default function  () {
    const { handleWishlistClick, isFavorite } = useCheckUserLogin() || {};
    const { addToCart } = useAddCart();
    const [products, setProducts] = useState([]);

    const _getProducts = async () => {
        const url = 'https://projectky320240926105522.azurewebsites.net/api/Product?limit=12';
        let response = await fetch(url);
        response = await response.json();

        const productsWithDefaultQuantity = Array.isArray(response)
            ? response.map(product => ({
                ...product,
                quantity: 1,
                image: product.image || '',
            }))
            : []; 
        setProducts(productsWithDefaultQuantity);
    };

    useEffect(() => {
        _getProducts();
    }, []);

    // const handleAddToCart = (product) => {
    //     const productWithDefaultQuantity = { ...product, quantity: 1 };
    //     addToCart(productWithDefaultQuantity);
    // };

    // Sử dụng custom hook cho tìm kiếm sản phẩm
    const { searchTerm, setSearchTerm, filteredProducts } = useProductSearch(products);

    return (
        <div className="col-xl-9 col-lg-8 col-md-7">
            {/* Nút tìm kiếm */}
            <div className="search-area mb-4">
                <input 
                    type="text" 
                    placeholder="Search for products..." 
                    value={searchTerm} 
                    onChange={(e) => setSearchTerm(e.target.value)} 
                    className="form-control" 
                />
            </div>

            {/* Start Best Seller */}
            <section className="lattest-product-area pb-40 category-list">
                <div className="row">
                    {/* Single product */}
                    {filteredProducts.length > 0 ? (
                        filteredProducts.map((product) => (
                            <div className="col-lg-4 col-md-6" key={product.productId}>
                                <div className="single-product">
                                    <img className="img-fluid" src={product.image} alt={product.name} />
                                    <div className="product-details">
                                        <h6>{product.name}</h6>
                                        <p>Brand: {product.brand?.name || 'N/A'}</p>
                                        <div className="price">
                                            {/* <h6>${product.price}</h6> */}
                                        </div>
                                        <div className="prd-bottom">
                                            {/* <button onClick={() => handleAddToCart(product)} className="social-info">
                                                <span className="ti-bag"></span>
                                                <p className="hover-text">add to bag</p>
                                            </button> */}
                                            <a
                                                className={`social-info ${isFavorite && isFavorite(product.productId) ? 'favorite-active' : ''}`} 
                                                onClick={() => handleWishlistClick && handleWishlistClick(product)}
                                            >
                                                <span className="lnr lnr-heart"></span>
                                                <p className="hover-text">
                                                    {isFavorite && isFavorite(product.productId) ? 'Remove' : 'Wishlist'}
                                                </p>
                                            </a>
                                            <a className="social-info">
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
                        ))
                    ) : (
                        <p>No products available</p>
                    )}
                </div>
            </section>
            {/* End Best Seller */}
        </div>
    );
}
