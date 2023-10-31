import { Col, Row } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import Loader from '../components/Loader';
import Message from '../components/Message';
import Paginate from '../components/Paginate';
import Product from '../components/Product';
import { useGetProductsQuery } from '../slices/productsApiSlice';

const HomeScreen = () => {
    const { pageNumber } = useParams();
    const { data, isLoading, error } = useGetProductsQuery({
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
            <h1>Products</h1>
            <Row>
                {data.products.map((product) => (
                    <Col sm={12} md={6} lg={4} xl={3} key={product._id}>
                        <Product product={product} />
                    </Col>
                ))}
            </Row>
            <Paginate page={data.page} pages={data.pages} />
        </>
    );
};
export default HomeScreen;
