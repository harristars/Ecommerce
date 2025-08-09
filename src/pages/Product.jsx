import React, { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import { Link, useParams } from "react-router-dom";
import Marquee from "react-fast-marquee";
import { useDispatch } from "react-redux";
import { addCart } from "../redux/action";

import { Footer, Navbar } from "../components";

const Product = () => {
  const { id } = useParams();
  const [product, setProduct] = useState([]);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);

  const dispatch = useDispatch();

  const addProduct = (product) => {
    dispatch(addCart(product));
  };

  useEffect(() => {
    const getProduct = async () => {
      setLoading(true);
      setLoading2(true);
      const response = await fetch(`https://fakestoreapi.com/products/${id}`);
      const data = await response.json();
      setProduct(data);
      setLoading(false);
      const response2 = await fetch(
        `https://fakestoreapi.com/products/category/${data.category}`
      );
      const data2 = await response2.json();
      setSimilarProducts(data2);
      setLoading2(false);
    };
    getProduct();
  }, [id]);

  const Loading = () => {
    return (
      <>
        <div className="container my-5 py-2">
          <div className="row">
            <div className="col-md-6 py-3">
              <Skeleton height={400} width={400} />
            </div>
            <div className="col-md-6 py-5">
              <Skeleton height={30} width={250} />
              <Skeleton height={90} />
              <Skeleton height={40} width={70} />
              <Skeleton height={50} width={110} />
              <Skeleton height={120} />
              <Skeleton height={40} width={110} inline={true} />
              <Skeleton className="mx-3" height={40} width={110} />
            </div>
          </div>
        </div>
      </>
    );
  };

  const ShowProduct = () => {
    // Temporary variant data (replace with API data if available)
    const variants = ["Small", "Medium", "Large"];

    // Example stock logic: if product.rating.count is 0 → out of stock
    const inStock = product.rating && product.rating.count > 0;

    return (
      <div className="container my-5 py-2">
        <div className="row justify-content-center">
          <div className="col-md-6 col-sm-12 py-3">
            <img
              className="img-fluid rounded shadow-sm"
              src={product.image}
              alt={product.title}
              style={{ maxHeight: "400px", objectFit: "contain" }}
            />
          </div>
          <div className="col-md-6 py-5">
            <h4 className="text-uppercase text-muted">{product.category}</h4>
            <h1 className="display-6 fw-bold">{product.title}</h1>
            <p className="lead">
              {product.rating && product.rating.rate}{" "}
              <i className="fa fa-star text-warning"></i>
            </p>
            <h3 className="display-6 text-success my-4">${product.price}</h3>
            <p className="lead">{product.description}</p>

            {/* Variant Dropdown */}
            {variants.length > 0 && (
              <select className="form-select w-50 my-3">
                {variants.map((v, i) => (
                  <option key={i}>{v}</option>
                ))}
              </select>
            )}

            {/* Add to Cart / Out of Stock */}
            {inStock ? (
              <button
                className="btn btn-primary px-4"
                onClick={() => addProduct(product)}
              >
                Add to Cart
              </button>
            ) : (
              <button className="btn btn-secondary px-4" disabled>
                Out of Stock
              </button>
            )}

            <Link to="/cart" className="btn btn-dark mx-3 px-4">
              Go to Cart
            </Link>
          </div>
        </div>
      </div>
    );
  };


  const Loading2 = () => {
    return (
      <>
        <div className="my-4 py-4">
          <div className="d-flex">
            <div className="mx-4">
              <Skeleton height={400} width={250} />
            </div>
            <div className="mx-4">
              <Skeleton height={400} width={250} />
            </div>
            <div className="mx-4">
              <Skeleton height={400} width={250} />
            </div>
            <div className="mx-4">
              <Skeleton height={400} width={250} />
            </div>
          </div>
        </div>
      </>
    );
  };

  const ShowSimilarProduct = () => {
    return (
      <div className="py-4 my-4 d-flex">
        {similarProducts.map((item) => {
          const variants = ["Small", "Medium"]; // Example variants
          const inStock = item.rating && item.rating.count > 0;

          return (
            <div
              key={item.id}
              className="card mx-4 text-center shadow-sm"
              style={{ minWidth: "250px" }}
            >
              <img
                className="card-img-top p-3"
                src={item.image}
                alt={item.title}
                style={{ height: "200px", objectFit: "contain" }}
              />
              <div className="card-body">
                <h5 className="card-title">{item.title.substring(0, 15)}...</h5>
                <p className="text-success fw-bold">${item.price}</p>

                {/* Variants */}
                {variants.length > 0 && (
                  <select className="form-select form-select-sm mb-2">
                    {variants.map((v, i) => (
                      <option key={i}>{v}</option>
                    ))}
                  </select>
                )}

                {/* Add to Cart / Out of Stock */}
                {inStock ? (
                  <button
                    className="btn btn-primary btn-sm w-100 mb-2"
                    onClick={() => addProduct(item)}
                  >
                    Add to Cart
                  </button>
                ) : (
                  <button className="btn btn-secondary btn-sm w-100 mb-2" disabled>
                    Out of Stock
                  </button>
                )}

                <Link to={`/product/${item.id}`} className="btn btn-dark btn-sm w-100">
                  View Details
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    );
  };
  return (
    <>
      <Navbar />
      <div className="container">
        <div className="row">{loading ? <Loading /> : <ShowProduct />}</div>
        <div className="row my-5 py-5">
          <div className="d-none d-md-block">
          <h2 className="">You may also Like</h2>
            <Marquee
              pauseOnHover={true}
              pauseOnClick={true}
              speed={50}
            >
              {loading2 ? <Loading2 /> : <ShowSimilarProduct />}
            </Marquee>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Product;
