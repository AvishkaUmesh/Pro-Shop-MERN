import { useState } from 'react';
import {
    Button,
    Card,
    Col,
    Form,
    Image,
    ListGroup,
    Row,
} from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import Loader from '../components/Loader';
import Message from '../components/Message';
import Meta from '../components/Meta';
import Rating from '../components/Rating';
import { addToCart } from '../slices/cartSlice';
import {
    useCreateProductReviewMutation,
    useGetProductQuery,
} from '../slices/productsApiSlice';

const ProductScreen = () => {
    const { id: productId } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [qty, setQty] = useState(1);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');

    const {
        data: product,
        isLoading,
        error,
        refetch,
    } = useGetProductQuery(productId);
    const [createProductReview, { isLoading: isReviewLoading }] =
        useCreateProductReviewMutation();
    const { userInfo } = useSelector((state) => state.auth);

    const addToCartHandler = () => {
        dispatch(addToCart({ ...product, qty }));
        navigate('/cart');
    };

    const submitHandler = async (e) => {
        e.preventDefault();

        try {
            await createProductReview({
                productId,
                rating,
                comment,
            }).unwrap();
            refetch();
            toast.success('Review created successfully');
            setRating(0);
            setComment('');
        } catch (err) {
            toast.error(err?.data?.message || err.error);
        }
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

            <Meta title={product.name} />

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

            <Row className="review">
                <Col md={6}>
                    <h2>Reviews</h2>
                    {product.reviews.length === 0 && (
                        <Message>No Reviews</Message>
                    )}
                    <ListGroup variant="flush">
                        {product.reviews.map((review) => (
                            <ListGroup.Item key={review._id}>
                                <strong>{review.name}</strong>
                                <Rating value={review.rating} />
                                <p>{review.createdAt.substring(0, 10)}</p>
                                <p>{review.comment}</p>
                            </ListGroup.Item>
                        ))}
                        <ListGroup.Item>
                            <h2>Write a Customer Review</h2>

                            {isReviewLoading && <Loader />}

                            {userInfo ? (
                                <Form onSubmit={submitHandler}>
                                    <Form.Group
                                        className="my-2"
                                        controlId="rating"
                                    >
                                        <Form.Label>Rating</Form.Label>
                                        <Form.Control
                                            as="select"
                                            required
                                            value={rating}
                                            onChange={(e) =>
                                                setRating(e.target.value)
                                            }
                                        >
                                            <option value="">Select...</option>
                                            <option value="1">1 - Poor</option>
                                            <option value="2">2 - Fair</option>
                                            <option value="3">3 - Good</option>
                                            <option value="4">
                                                4 - Very Good
                                            </option>
                                            <option value="5">
                                                5 - Excellent
                                            </option>
                                        </Form.Control>
                                    </Form.Group>
                                    <Form.Group
                                        className="my-2"
                                        controlId="comment"
                                    >
                                        <Form.Label>Comment</Form.Label>
                                        <Form.Control
                                            as="textarea"
                                            row="3"
                                            required
                                            value={comment}
                                            onChange={(e) =>
                                                setComment(e.target.value)
                                            }
                                        ></Form.Control>
                                    </Form.Group>
                                    <Button
                                        disabled={isReviewLoading}
                                        type="submit"
                                        variant="primary"
                                    >
                                        Submit
                                    </Button>
                                </Form>
                            ) : (
                                <Message>
                                    Please <Link to="/login">sign in</Link> to
                                    write a review
                                </Message>
                            )}
                        </ListGroup.Item>
                    </ListGroup>
                </Col>
            </Row>
        </>
    );
};
export default ProductScreen;
