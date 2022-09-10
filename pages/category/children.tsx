import { Typography } from '@mui/material'
import type { NextPage } from 'next'
import { ShopLayout } from '../../components/layouts/ShopLayout'
import { ProductList } from '../../components/products/ProductList';
import { useProducts } from '../../hooks/useProducts';
import { FullScreenLoading } from '../../components/ui/FullScreenLoading';



const ChildrenPage: NextPage = () => {

  const {products, isLoading} = useProducts('/products?gender=kid');
  

  return (
    <ShopLayout title={'Teslo-Shop - Niños'} pageDescription={'Encuentra los mejores produtos de Teslo para niños'}>
      <Typography variant='h1' component='h1'>Niños</Typography>
      <Typography variant='h2' sx={{mb: 1}}>Productos para niños</Typography>

      {
        isLoading
        ? <FullScreenLoading />
        : <ProductList products={products} />
      }

    </ShopLayout>
  )
}

export default ChildrenPage
