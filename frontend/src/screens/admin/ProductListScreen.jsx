import { Button, Col, Row, Table } from 'react-bootstrap';
import { FaEdit, FaPlus, FaTrash } from 'react-icons/fa';
import { LinkContainer } from 'react-router-bootstrap';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import Loader from '../../components/Loader';
import Message from '../../components/Message';
import Paginate from '../../components/Paginate';
import {
    useCreateProductMutation,
    useDeleteProductMutation,
    useGetProductsQuery,
} from '../../slices/productsApiSlice';

const ProductListScreen = () => {
    const { pageNumber } = useParams();
    const { data, isLoading, error, refetch } = useGetProductsQuery({
        pageNumber,
    });

    const [createProduct, { isLoading: createLoading, error: createError }] =
        useCreateProductMutation();

    const [deleteProduct, { isLoading: deleteLoading, error: deleteError }] =
        useDeleteProductMutation();

    const createProductHandler = async () => {
        if (window.confirm('Are you sure you want to create a new product?')) {
            try {
                await createProduct();
                toast.success('Product created');
                refetch();
            } catch (error) {
                toast.error(error?.data?.message || error.error);
            }
        }
    };

    const deleteHandler = async (id) => {
        if (window.confirm('Are you sure')) {
            try {
                await deleteProduct(id);
                toast.success('Product deleted');
                refetch();
            } catch (error) {
                toast.error(error?.data?.message || error.error);
            }
        }
    };

    return (
        <>
            <Row className="align-items-center">
                <Col>
                    <h1>Products</h1>
                </Col>
                <Col className="text-end">
                    <Button className="my-3" onClick={createProductHandler}>
                        <FaPlus /> Create Product
                    </Button>
                </Col>
            </Row>

            {(createLoading || deleteLoading || isLoading) && <Loader />}

            {!createLoading && createError && (
                <Message variant="danger">{createError}</Message>
            )}

            {!deleteLoading && deleteError && (
                <Message variant="danger">{deleteError}</Message>
            )}

            {!isLoading && error && <Message variant="danger">{error}</Message>}

            {!isLoading && data.products.length === 0 && (
                <Message variant="info">No products found</Message>
            )}

            {!isLoading && data.products.length > 0 && (
                <>
                    <Table
                        striped
                        bordered
                        hover
                        responsive
                        className="table-sm"
                    >
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>NAME</th>
                                <th>PRICE</th>
                                <th>CATEGORY</th>
                                <th>BRAND</th>

                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.products &&
                                data.products.map((product) => (
                                    <tr key={product._id}>
                                        <td>{product._id}</td>
                                        <td>{product.name}</td>
                                        <td>${product.price}</td>
                                        <td>{product.category}</td>
                                        <td>{product.brand}</td>

                                        <td>
                                            <LinkContainer
                                                to={`/admin/product/${product._id}/edit`}
                                            >
                                                <Button
                                                    variant="light"
                                                    className="btn-sm mx-2"
                                                >
                                                    <FaEdit />
                                                </Button>
                                            </LinkContainer>
                                            <Button
                                                variant="danger"
                                                className="btn-sm"
                                                onClick={() =>
                                                    deleteHandler(product._id)
                                                }
                                            >
                                                <FaTrash
                                                    style={{
                                                        color: 'white',
                                                    }}
                                                />
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </Table>
                    <Paginate
                        pages={data.pages}
                        page={data.page}
                        isAdmin={true}
                    />
                </>
            )}
        </>
    );
};
export default ProductListScreen;
