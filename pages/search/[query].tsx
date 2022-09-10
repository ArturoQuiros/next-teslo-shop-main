import { Box, Typography } from '@mui/material'
import type { GetServerSideProps, NextPage } from 'next'
import { ShopLayout } from '../../components/layouts/ShopLayout'
import { ProductList } from '../../components/products/ProductList';
import { useProducts } from '../../hooks/useProducts';
import { FullScreenLoading } from '../../components/ui/FullScreenLoading';
import { getProductsByTerm, getAllProducts } from '../../database/dbProducts';
import { IProduct } from '../../interfaces/products';

interface Props {
    products: IProduct[],
    foundProducts: boolean,
    query: string
}

const SearchPage: NextPage<Props> = ({products, foundProducts, query}) => {

  

  return (
    <ShopLayout title={'Teslo-Shop - Search'} pageDescription={'Encuentra los mejores produtos de Teslo aqui'}>
      <Typography variant='h1' component='h1'>Buscar producto</Typography>
      {
        foundProducts
        ? <Typography variant='h2' sx={{mb: 1}} textTransform='capitalize'>Término: {query}</Typography>
        : (
            <Box display='flex'>
                <Typography variant='h2' sx={{mb: 1}}>No encontramos ningun producto</Typography>
                <Typography variant='h2' sx={{ml: 1}} color='secondary' textTransform='capitalize'>{query}</Typography>
            </Box>
        )
      }

      <ProductList products={products} />

    </ShopLayout>
  )
}

export const getServerSideProps: GetServerSideProps = async ({params}) => {
        
    const {query=''} = params as {query: string};

    if(query.length === 0){
        return {
            redirect: {
                destination: '/',
                permanent: true,
            }
        }
    }

    let products = await getProductsByTerm(query);
    const foundProducts = products.length > 0;

    if(!foundProducts){
        products = await getAllProducts();
    }

    return {
        props: {
            products,
            foundProducts,
            query
        }
    }
}

export default SearchPage
