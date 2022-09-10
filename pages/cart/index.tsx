import { Card, CardContent, Grid, Typography, Divider, Button } from '@mui/material';
import { Box } from '@mui/system';
import { CartList } from '../../components/cart/CartList';
import { OrderSummary } from '../../components/cart/OrderSummary';
import { ShopLayout } from '../../components/layouts/ShopLayout';
import { CartContext } from '../../context/cart/CartContext';
import { useContext, useEffect } from 'react';
import { useRouter } from 'next/router';

const CartPage = () => {

    const {isLoaded, cart} = useContext(CartContext);
    const router = useRouter();

    useEffect(() => {
      if(isLoaded && cart.length === 0){
        router.replace('/cart/empty');
      }

    }, [isLoaded, cart, router])
    
    if(!isLoaded || cart.length === 0) {
        return (<></>)
    }

  return (
    <ShopLayout title='Carrito' pageDescription='Carrito de compras de la tienda'>
        <Typography variant='h1' component='h1'>Carrito</Typography>
        <Grid container>
            <Grid item xs={12} sm={7} sx={{mt:2}}>
                <CartList editable />
            </Grid>
            <Grid item xs={12} sm={5} sx={{mt:2}}>
                <Card className='summary-card'>
                    <CardContent>
                        <Typography variant='h2'>Orden</Typography>
                        <Divider sx={{my:1}} />

                        <OrderSummary />

                        <Box sx={{mt: 3}}>
                            <Button color='info' sx={{backgroundColor: 'secondary.main', "&:hover": {backgroundColor: '#274494'} }} className='circular-btn' fullWidth href='/checkout/address'>
                                Checkout
                            </Button>
                        </Box>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    </ShopLayout>
  )
}

export default CartPage