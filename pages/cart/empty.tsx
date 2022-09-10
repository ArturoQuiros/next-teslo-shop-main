import { RemoveShoppingCartOutlined } from '@mui/icons-material';
import { Box, Link, Typography } from '@mui/material';
import { ShopLayout } from '../../components/layouts/ShopLayout';
import NextLink from "next/link"

const EmptyPage = () => {
  return (
    <ShopLayout title='Carrito vacio' pageDescription='No hay articulos en el carrito de compras'>
      <Box sx={{flexDirection: {xs: 'column', sm: 'row'}}}
           display='flex' justifyContent='center' alignItems='center' height='calc(100vh - 200px)'>
        <RemoveShoppingCartOutlined sx={{fontSize: 100}} />
        <Box display='flex' flexDirection='column' alignItems='cocenterlumn' >
            <Typography>Su carrito esta vacio</Typography>
            <NextLink href='/' passHref>
                <Link underline='none' typography='h6' color='secondary'>
                    Regresar
                </Link>
            </NextLink>
        </Box>
      </Box>
    </ShopLayout>
  )
}

export default EmptyPage