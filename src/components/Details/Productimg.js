import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

export default function ProductDetail() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [productVariants, setProductVariants] = useState([]);
    const [selectedColor, setSelectedColor] = useState(null);
    const [selectedSize, setSelectedSize] = useState(null);
    const [productImage, setProductImage] = useState(null); // State for selected image
    const [productPrice, setProductPrice] = useState(null); // State for selected price
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProduct = async () => {
            const productResponse = await fetch(`https://projectky320240926105522.azurewebsites.net/api/Product/${id}`);
            const productData = await productResponse.json();
            setProduct(productData);
            setProductImage(productData.image);  // Set initial image
            setProductPrice(productData.price);  // Set initial price
            console.log(productData);  // Original console log

            const variantResponse = await fetch(`https://projectky320240926105522.azurewebsites.net/api/ProductVariant?productId=${id}`);
            const variantData = await variantResponse.json();
            setProductVariants(variantData.filter(variant => variant !== null));
            console.log(variantData);  // Original console log
        };

        fetchProduct();
    }, [id]);

    const handleAddToCart = async () => {
        if (selectedColor && selectedSize) {
            console.log("Selected Color:", selectedColor);  // Debugging selected color
            console.log("Selected Size:", selectedSize);    // Debugging selected size
            console.log("Product Variants:", productVariants);  // Debugging product variants
    
            // Check each variant for debugging
            productVariants.forEach(variant => {
                console.log(`Checking variant - Color: ${variant.color?.colorName}, Size: ${variant.size?.sizeName}, ProductId: ${variant.productId}`);
            });

            const selectedVariant = productVariants.find(variant => {
                console.log("Comparing with:", variant.color?.colorName, variant.size?.sizeName, variant.productId); // Debugging variant comparison
                return (
                    variant.color?.colorName.trim().toLowerCase() === selectedColor.trim().toLowerCase() &&
                    variant.size?.sizeName.trim().toLowerCase() === selectedSize.trim().toLowerCase() &&
                    String(variant.productId) === String(id)
                );
            });

            if (selectedVariant) {
                console.log("Selected Variant:", selectedVariant);  // Debugging selected variant
                const userId = localStorage.getItem('Token');
                const cartItem = {
                    userId,
                    variantId: selectedVariant.variantId,
                    quantity: 1,
                };

                try {
                    const response = await fetch('https://projectky320240926105522.azurewebsites.net/api/Cart/add', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(cartItem),
                    });

                    if (response.ok) {
                        const data = await response.json();
                        alert('Item added to cart successfully!');
                        console.log(data);
                    } else {
                        const errorData = await response.json();
                        alert(`Error: ${errorData.message}`);
                    }
                } catch (error) {
                    console.error('Error adding to cart:', error);
                    alert('An error occurred while adding the item to the cart.');
                }
            } else {
                alert('Out of Stock');
            }
        } else {
            alert('Please select a color and size.');
        }
    };

    const handleColorChange = (color) => {
        setSelectedColor(color);
        setSelectedSize(null);

        // Find the variant for the selected color and productId, update image and price accordingly
        const selectedVariant = productVariants.find(variant => {
            console.log("Matching Variant for Color:", color, "ProductId:", id);  // Debugging color matching
            return (
                variant.color?.colorName === color &&
                String(variant.productId) === String(id)
            );
        });

        if (selectedVariant) {
            setProductImage(selectedVariant.image);  // Update to variant image
            setProductPrice(selectedVariant.price);  // Update to variant price
        } else {
            setProductImage(product.image);  // Fall back to product's default image
            setProductPrice(product.price);  // Fall back to product's default price
        }
    };

    const availableColors = [...new Set(productVariants.map(variant => variant.color?.colorName).filter(Boolean))];
    const availableSizes = [...new Set(productVariants.map(variant => variant.size?.sizeName).filter(Boolean))];

    const stockQuantity = selectedColor && selectedSize
        ? productVariants.find(variant => variant.color?.colorName === selectedColor && variant.size?.sizeName === selectedSize)?.stockQuantity 
        : 0;

    return (
        <div className="product_image_area">
            <div className="container">
            </div>
            <div className="container">
                <div className="row s_product_inner">
                    <div className="col-lg-6">
                        <div className="s_Product_carousel">
                            <div className="single-prd-item">
                                {productImage ? (
                                    <img className="img-fluid" src={productImage} alt={product?.name} />
                                ) : (
                                    <p>Image not available</p>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-5 offset-lg-1">
                        <div className="s_product_text">
                            <h3>{product?.name}</h3>
                            <h5>{product?.description}</h5>
                            <h2>${productPrice}</h2>
                            <div>
                                <h4>Select Color:</h4>
                                <div className="color-options">
                                  {availableColors.map((color, index) => (
                                      <button
                                          key={index}
                                          onClick={() => handleColorChange(color)}
                                          className={`color-button ${color === selectedColor ? 'active' : ''}`}
                                          style={{
                                              backgroundColor: color === selectedColor ? '#ffba00' : '#d9d9d9',
                                              width: '90px',
                                              margin: '0 10px',
                                              padding: '10px',
                                              borderRadius: '5px',
                                          }}
                                      >
                                          {color}
                                      </button>
                                  ))}
                              </div>
                            </div>
                            {availableSizes.length > 0 && (
                                    <div style={{ marginTop: '10px' }}>
                                        <h4>Select Size:</h4>
                                        <div className="size-options">
                                            {availableSizes.map((size, index) => (
                                                <button
                                                    key={index}
                                                    onClick={() => setSelectedSize(size)}
                                                    className={`size-button ${size === selectedSize ? 'active' : ''}`}
                                                    style={{
                                                        backgroundColor: size === selectedSize ? '#ffba00' : '#d9d9d9',
                                                        width: '90px',
                                                        margin: '0 10px',
                                                        padding: '10px',
                                                        borderRadius: '5px',
                                                    }}
                                                >
                                                    {size}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            <div
                                className="card_area d-flex align-items-center"
                                style={{ marginTop: '20px' }}
                            >
                                <a
                                    onClick={handleAddToCart}
                                    className="primary-btn"
                                    href="#"
                                    style={{textDecoration: "none"}}
                                >
                                    Add to Cart
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
