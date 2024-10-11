import { useAddCart } from '../../js/useAddCart';
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useCheckUserLogin } from '../../js/useCheckUserLogin';
import useProductSearch from '../../js/useProductSearch';

export default function ProductShow() {
    const { handleWishlistClick, isFavorite } = useCheckUserLogin() || {};
    const { addToCart } = useAddCart();
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);

    // Các state cho filter
    const [brands, setBrands] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedBrand, setSelectedBrand] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [priceOrder, setPriceOrder] = useState(''); // 'asc' hoặc 'desc'

    // Lấy sản phẩm từ API
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

        // Lấy danh sách brand và category duy nhất kèm số lượng sản phẩm
        const brandCount = {};
        const categoryCount = {};

        response.forEach(product => {
            brandCount[product.brand.name] = (brandCount[product.brand.name] || 0) + 1;
            categoryCount[product.category.slug] = (categoryCount[product.category.slug] || 0) + 1;
        });

        setBrands(Object.entries(brandCount)); // [{brandName: 'Apple', count: 3}, ...]
        setCategories(Object.entries(categoryCount)); // [{categoryName: 'Phones', count: 5}, ...]
    };

    useEffect(() => {
        _getProducts();
    }, []);

    // Sử dụng custom hook cho tìm kiếm sản phẩm
    const { searchTerm, setSearchTerm, filteredProducts: searchedProducts } = useProductSearch(products);

    // Hàm lọc sản phẩm dựa vào brand, category, và price order
    const filterProducts = () => {
        let filtered = [...searchedProducts]; // Bắt đầu từ sản phẩm sau khi tìm kiếm

        if (selectedBrand) {
            filtered = filtered.filter(product => product.brand.name === selectedBrand);
        }

        if (selectedCategory) {
            filtered = filtered.filter(product => product.category.slug === selectedCategory);
        }

        if (priceOrder === 'asc') {
            filtered = filtered.sort((a, b) => a.price - b.price);
        } else if (priceOrder === 'desc') {
            filtered = filtered.sort((a, b) => b.price - a.price);
        }

        setFilteredProducts(filtered);
    };

    // Gọi hàm filter khi filter thay đổi
    useEffect(() => {
        filterProducts();
    }, [searchedProducts, selectedBrand, selectedCategory, priceOrder]);

    return (
        <div className='container'>
            <div className='row'>
                <div className="col-xl-3 col-lg-4 col-md-5">
                    <div className="sidebar-categories">
                        <div className="head">Browse Categories</div>
                        <ul className="main-categories">
                            {categories.map(([category, count]) => (
                                <li className="main-nav-list" key={category} onClick={() => setSelectedCategory(category)}>
                                    <a style={{fontSize: "20px", textDecoration: "none"}} href="#">{category} <span className="number">({count})</span></a>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="sidebar-filter mt-50">
                        <div className="top-filter-head">Product Filters</div>
                        <div className="common-filter">
                            <div className="head">Brands</div>
                            <form action="#">
                                <ul>
                                    {brands.map(([brand, count]) => (
                                        <li className="filter-list" key={brand}>
                                            <input 
                                                className="pixel-radio" 
                                                type="radio" 
                                                id={brand} 
                                                name="brand" 
                                                onClick={() => setSelectedBrand(brand)} 
                                            />
                                            <label htmlFor={brand}>{brand} <span>({count})</span></label>
                                        </li>
                                    ))}
                                </ul>
                            </form>
                        </div>

                        <div className="top-filter-head mt-3">Sort by Price</div>
                        <select onChange={(e) => setPriceOrder(e.target.value)} style={{width: "100%"}}>
                            <option value="">Default Softing</option>
                            <option value="asc">Low to High</option>
                            <option value="desc">High to Low</option>
                        </select>
                    </div>
                </div>

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
                                                <h6 style={{height: "40px"}}>{product.name}</h6>
                                                <p>Brand: {product.brand?.name || 'N/A'}</p>
                                                <div className="price">
                                                    <h6>${product.price}</h6>
                                                </div>
                                                <div className="prd-bottom">
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
            </div>
        </div>
    );
}
