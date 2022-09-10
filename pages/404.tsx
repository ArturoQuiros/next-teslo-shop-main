import { Typography } from '@mui/material';
import { Box } from '@mui/system';
import { ShopLayout } from '../components/layouts/ShopLayout';

const Custom404Page = () => {
  return (
    <ShopLayout title={'Pagina no encontrada'} pageDescription={'No hay nada que mostrar aqui'}>
      <Box sx={{flexDirection: {xs: 'column', sm: 'row'}}}
           display='flex' justifyContent='center' alignItems='center' height='calc(100vh - 200px)'>
        <Typography variant='h1' component='h1' fontSize={75} fontWeight={200}>404 |</Typography>
        <Typography marginLeft={2}>No se encontro ninguna pagina aqui</Typography>
      </Box>
    </ShopLayout>
  )
}

export default Custom404Page