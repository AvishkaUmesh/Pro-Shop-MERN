import { useState } from 'react';
import { Card, Col, Form, Image, ListGroup, Row } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Loader from '../components/Loader';
import Message from '../components/Message';
import Rating from '../components/Rating';
import { addToCart } from '../slices/cartSlice';
import { useGetProductQuery } from '../slices/productsApiSlice';

const ProductScreen = () => {
    const { id: productId } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [qty, setQty] = useState(1);
    const { data: product, isLoading, error } = useGetProductQuery(productId);

    const addToCartHandler = () => {
        dispatch(addToCart({ ...product, qty }));
        navigate('/cart');
    };

    if (isLoading) return <Loader />;

    if (error)
        return (
            <Message variant="danger">
                Error. Try Refreshing. {error?.data?.message || error?.error}
            </Message>
        );

    return (
        <>
            <Link to="/" className="btn btn-light my-3">
                Go Back
            </Link>
            <Row>
                <Col md={5}>
                    <Image src={product.image} alt={product.name} fluid />
                </Col>
                <Col md={4}>
                    <ListGroup variant="flush">
                        <ListGroup.Item>
                            <h3>{product.name}</h3>
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <Rating
                                value={product.rating}
                                text={`${product.numReviews} reviews`}
                            />
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <strong>Price:</strong> ${product.price}
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <strong>Description:</strong> {product.description}
                        </ListGroup.Item>
                    </ListGroup>
                </Col>
                <Col md={3}>
                    <Card>
                        <ListGroup variant="flush">
                            <ListGroup.Item>
                                <Row>
                                    <Col>Price:</Col>
                                    <Col>
                                        <strong>${product.price}</strong>
                                    </Col>
                                </Row>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row>
                                    <Col>Status:</Col>
                                    <Col>
                                        {product.countInStock > 0
                                            ? 'In Stock'
                                            : 'Out Of Stock'}
                                    </Col>
                                </Row>
                            </ListGroup.Item>
                            {product.countInStock > 0 && (
                                <ListGroup.Item>
                                    <Row>
                                        <Col>Qty</Col>
                                        <Col>
                                            <Form.Control
                                                as="select"
                                                value={qty}
                                                onChange={(e) =>
                                                    setQty(
                                                        Number(e.target.value)
                                                    )
                                                }
                                            >
                                                {[
                                                    ...Array(
                                                        product.countInStock
                                                    )
                                                        .keys()
                                                        .map((i) => (
                                                            <option
                                                                key={i + 1}
                                                                value={i + 1}
                                                            >
                                                                {i + 1}
                                                            </option>
                                                        )),
                                                ]}
                                            </Form.Control>
                                        </Col>
                                    </Row>
                                </ListGroup.Item>
                            )}
                            <ListGroup.Item>
                                <button
                                    className="btn btn-primary btn-block"
                                    disabled={product.countInStock === 0}
                                    onClick={addToCartHandler}
                                >
                                    Add To Cart
                                </button>
                            </ListGroup.Item>
                        </ListGroup>
                    </Card>
                </Col>
            </Row>
        </>
    );
};
export default ProductScreen;
