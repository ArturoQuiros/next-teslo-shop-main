import { Typography, Grid, Link, CardActionArea, CardMedia, Button } from '@mui/material';
import NextLink from "next/link"
import { Box } from '@mui/system';
import { ItemCounter } from '../ui/ItemCounter';
import { FC, useContext } from 'react';
import { CartContext } from '../../context/cart/CartContext';
import { ICartProduct } from '../../interfaces/cart';
import { currencyFormat } from '../../utils/currency';
import { IOrderItem } from '../../interfaces/order';

interface Props {
    editable?: boolean;
    products?: IOrderItem[];
}

export const CartList: FC<Props> = ({editable = false, products}) => {

    const {cart, updateCartQuantity, removeCartProduct} = useContext(CartContext);

    const onNewCartQuantity = (product: ICartProduct, newQuantity: number) => {
        product.quantity = newQuantity;
        updateCartQuantity(product);
    }

    const onRemoveProductFromCart = (product: ICartProduct) => {
        removeCartProduct(product);
    }

    const productsToShow = products ? products : cart;

  return (
    <>
        {
            productsToShow.map(product => (
                <Grid container spacing={2} key={product.slug + product.size} sx={{mb: 1}}>
                    <Grid item xs={3}>
                        <NextLink href={`/product/${product.slug}`} passHref>
                            <Link>
                                <CardActionArea>
                                    <CardMedia image={product.image} component='img' sx={{borderRadius: '5px'}} />
                                </CardActionArea>
                            </Link>
                        </NextLink>
                    </Grid>
                    <Grid item xs={7}>
                        <Box display='flex' flexDirection="column">
                            <Typography variant='body1'>{product.title}</Typography>
                            <Typography variant='body1'>Talla: <strong>{product.size}</strong></Typography>

                            {
                                editable
                                ? <ItemCounter currentValue={product.quantity} maxValue={10} updatedQuantity={(value) => onNewCartQuantity(product as ICartProduct, value)} />
                                : <Typography variant='h6'>{product.quantity} {product.quantity > 1 ? 'productos':'producto'}</Typography>
                            }

                            
                        </Box>
                    </Grid>
                    <Grid item xs={2} display='flex' alignItems='center' flexDirection='column'>
                        <Typography variant='subtitle1'>{currencyFormat(product.price)}</Typography>

                        {
                            editable && (
                                <Button variant='text' color='error' onClick={() => onRemoveProductFromCart(product as ICartProduct)}>
                                    Remover
                                </Button>
                            )
                            
                        }
                        
                    </Grid>
                </Grid>
            ))
        }
    </>
  )
}
