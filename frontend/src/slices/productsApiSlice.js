import { PRODUCTS_URL } from '../constants';
import { apiSlice } from './apiSclice';

export const productsApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getProducts: builder.query({
            query: () => ({
                url: PRODUCTS_URL,
            }),
            keepUnusedDataFor: 5,
            providesTags: ['Product'],
        }),

        getProduct: builder.query({
            query: (id) => ({
                url: `${PRODUCTS_URL}/${id}`,
            }),
            keepUnusedDataFor: 5,
            providesTags: ['Product'],
        }),
    }),
});

export const { useGetProductsQuery, useGetProductQuery } = productsApiSlice;
