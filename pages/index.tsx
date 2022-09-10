import { Typography } from '@mui/material'
import type { NextPage } from 'next'
import { ShopLayout } from '../components/layouts/ShopLayout'
import { ProductList } from '../components/products/ProductList';
import { useProducts } from '../hooks/useProducts';
import { FullScreenLoading } from '../components/ui/FullScreenLoading';

const HomePage: NextPage = () => {

  const {products, isLoading} = useProducts('/products');

  
  

  return (
    <ShopLayout title={'Teslo-Shop - Home'} pageDescription={'Encuentra los mejores produtos de Teslo aqui'}>
      <Typography variant='h1' component='h1'>Tienda</Typography>
      <Typography variant='h2' sx={{mb: 1}}>Todos los productos</Typography>

      {
        isLoading
        ? <FullScreenLoading />
        : <ProductList products={products} />
      }

    </ShopLayout>
  )
}

export default HomePage
