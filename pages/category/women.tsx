import { Typography } from '@mui/material'
import type { NextPage } from 'next'
import { ShopLayout } from '../../components/layouts/ShopLayout'
import { ProductList } from '../../components/products/ProductList';
import { useProducts } from '../../hooks/useProducts';
import { FullScreenLoading } from '../../components/ui/FullScreenLoading';



const WomenPage: NextPage = () => {

  const {products, isLoading} = useProducts('/products?gender=women');
  

  return (
    <ShopLayout title={'Teslo-Shop - Mujeres'} pageDescription={'Encuentra los mejores produtos de Teslo para mujeres'}>
      <Typography variant='h1' component='h1'>Mujeres</Typography>
      <Typography variant='h2' sx={{mb: 1}}>Productos para mujeres</Typography>

      {
        isLoading
        ? <FullScreenLoading />
        : <ProductList products={products} />
      }

    </ShopLayout>
  )
}

export default WomenPage
