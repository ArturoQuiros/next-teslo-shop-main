import { Button, Chip, Grid, Typography } from '@mui/material';
import { Box } from '@mui/system';
import React from 'react'
import { ShopLayout } from '../../components/layouts/ShopLayout';
import { ProductSlideshow } from '../../components/products/ProductSlideshow';
import { ItemCounter } from '../../components/ui/ItemCounter';
import { SizeSelector } from '../../components/products/SizeSelector';
import { IProduct, ISize } from '../../interfaces/products';
import { GetServerSideProps, GetStaticPaths, GetStaticProps, NextPage } from 'next';
import { getAllProductSlugs, getProductBySlug } from '../../database/dbProducts';
import { useState, useContext } from 'react';
import { ICartProduct } from '../../interfaces/cart';
import { useRouter } from 'next/router';
import { CartContext } from '../../context/cart/CartContext';
import { currencyFormat } from '../../utils/currency';

interface Props {
  product: IProduct
}

const ProductPage: NextPage<Props> = ({product}) => {

  const router = useRouter();
  const {addProductToCart} = useContext(CartContext);

    const [tempCartProduct, setTempCartProduct] = useState<ICartProduct>({
      _id: product._id,
      image: product.images[0],
      price: product.price,
      size: undefined,
      slug: product.slug,
      title: product.title,
      gender: product.gender,
      quantity: 1,
    });

    const selectedSize = (size: ISize) => {
      setTempCartProduct(currentProduct => ({
        ...currentProduct,
        size
      }))
      
    }

    const updateQuantity = (quantity: number) => {
      setTempCartProduct(currentProduct => ({
        ...currentProduct,
        quantity
      }))
      
    }

    const onAddProduct = () => {

      if (!tempCartProduct.size) return;

      addProductToCart(tempCartProduct);
      router.push('/cart');
      
    }

  return (
    <ShopLayout title={product.title} pageDescription={product.description}>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={7}>
          <ProductSlideshow images={product.images} />
        </Grid>

        <Grid item xs={12} sm={5}>
          <Box display='flex' flexDirection='column'> 
            <Typography variant='h1' component='h1'>{product.title}</Typography>
            <Typography variant='subtitle1' component='h2'>{currencyFormat(product.price)}</Typography>

            <Box sx={{my:2}}>
              <Typography variant='subtitle2'>Cantidad</Typography>
              <ItemCounter
                currentValue={tempCartProduct.quantity}
                updatedQuantity={(value) => updateQuantity(value)}
                maxValue={product.inStock > 10 ? 10 : product.inStock}
              />
              <SizeSelector 
                //selectedSize={product.sizes[0]} 
                sizes={product.sizes}
                selectedSize={tempCartProduct.size}
                onSelectedSize={(size) => selectedSize(size)}
              />
            </Box>

            {
                (product.inStock > 0) ? (
                  <Button color='info' sx={{backgroundColor: 'secondary.main', "&:hover": {backgroundColor: '#274494'} }} className='circular-btn' onClick={onAddProduct}>
                    {
                      tempCartProduct.size
                      ? 'Agregar al carrito'
                      : 'Seleccione una talla'
                    }
                  </Button>
                ) : (
                  <Chip label="No disponible" color="error" variant="outlined" />
                )
            }
            <Box sx={{mt:3}}>
              <Typography variant='subtitle2'>Descripcion</Typography>
              <Typography variant='body2'>{product.description}</Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>

    </ShopLayout>
  )
}

export const getStaticPaths: GetStaticPaths = async (ctx) => {

    const slugs = await getAllProductSlugs();
      
    //const slugsArray: string[] = slugs.map(({slug}) => slug);

    return {
        paths: slugs.map(({slug}) => ({
            params: {slug}
        })),
        // paths: [
        //     {
        //         params: {
        //             id: '1'
        //         }
        //     }
        // ],
      //fallback: false //Manda al 404 page
      fallback: 'blocking' //deja pasar si no esta en los 649
    }
}

export const getStaticProps: GetStaticProps = async ({params}) => {

    const {slug=''} = params as {slug: string};

    const product = await getProductBySlug(slug);

    if(!product){
        return {
            redirect: {
                destination: '/',
                permanent: false
            }
        }
    }

    return {
      props: {
        product
      }, 
      revalidate: 86400 // 60*60*24, revalidar cada 24 horas
    }
}

// export const getServerSideProps: GetServerSideProps = async ({params}) => {
    
//   const {slug=''} = params as {slug: string};

//   const product = await getProductBySlug(slug);

//   if(!product){
//       return {
//           redirect: {
//               destination: '/',
//               permanent: false,
//           }
//       }
//   }

//   return {
//       props: {
//         product
//       }
//   }
// }

export default ProductPage