import { Col, Row } from 'react-bootstrap';
import { Link, useParams } from 'react-router-dom';
import Loader from '../components/Loader';
import Message from '../components/Message';
import Paginate from '../components/Paginate';
import Product from '../components/Product';
import { useGetProductsQuery } from '../slices/productsApiSlice';

const HomeScreen = () => {
    const { pageNumber, keyword } = useParams();
    const { data, isLoading, error } = useGetProductsQuery({
        keyword,
        pageNumber,
    });

    if (isLoading) return <Loader />;

    if (error)
        return (
            <Message variant="danger">
                Error. Try Refreshing. {error?.data?.message || error?.error}
            </Message>
        );

    return (
        <>
            {keyword && (
                <Link to="/" className="btn btn-light mb-4">
                    Go Back
                </Link>
            )}
            <h1>Products</h1>
            <Row>
                {data.products.map((product) => (
                    <Col sm={12} md={6} lg={4} xl={3} key={product._id}>
                        <Product product={product} />
                    </Col>
                ))}
            </Row>
            <Paginate
                page={data.page}
                pages={data.pages}
                keyword={keyword ? keyword : ''}
            />
        </>
    );
};
export default HomeScreen;
