import { AddOutlined, CategoryOutlined } from '@mui/icons-material';
import { Box, Button, capitalize, CardMedia, Grid, Link, Typography } from '@mui/material';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import { AdminLayout } from '../../../components/layouts/AdminLayout'
import useSWR from 'swr';
import { IProduct } from '../../../interfaces/products';
import { currencyFormat } from '../../../utils/currency';
import NextLink from "next/link"

const columns: GridColDef[] = [
    {field: 'img', headerName: 'Foto', renderCell: ({row}: GridValueGetterParams) => {
        return (
            <a href={`/product/${row.slug}`} target="_blank" rel="noreferrer">
                <CardMedia alt={row.title} component="img" className='fadeIn' image={row.img} />
            </a>
        )
    }},
    {field: 'title', headerName: 'Titulo', width: 400, renderCell: ({row}: GridValueGetterParams) => {
        return (
            <NextLink href={`/admin/products/${row.slug}`} passHref>
                <Link underline='always'>
                    {row.title}
                </Link>
            </NextLink>
        )
    }},
    {field: 'gender', headerName: 'Genero'},
    {field: 'type', headerName: 'Tipo'},
    {field: 'inStock', headerName: 'Inventario'},
    {field: 'price', headerName: 'Precio'},
    {field: 'sizes', headerName: 'Tallas', width: 200},
];

const ProductsPage = () => {

    const {data, error} = useSWR<IProduct[]>('/api/admin/products');

    if(!error && !data){
        return <></>
    }

    if(error){
        console.log(error);
        return <Typography>Error al cargar la informacion</Typography>
    }

    const rows = data!.map( (product) => ({
        id: product._id,
        img: product.images[0],
        title: product.title,
        gender: capitalize(product.gender),
        type: capitalize(product.type),
        inStock: product.inStock,
        price: currencyFormat(product.price),
        sizes: product.sizes.join(', '),
        slug: product.slug,
    }))

  return (
    <AdminLayout title={`Productos (${data?.length})`} subtitle='Mantenimiento de productos' icon={<CategoryOutlined />}>

        <Box display='flex' justifyContent='end' sx={{mb: 2}}>
            <Button startIcon={<AddOutlined />} href="/admin/products/new"
                color='info' sx={{width: '150px', backgroundColor: 'secondary.main', "&:hover": {backgroundColor: '#274494'} }}>
                Crear producto
            </Button>
        </Box>

        <Grid container className='fadeIn'>
            <Grid item xs={12} sx={{height: 650, width: '100%'}}>
                <DataGrid rows={rows} columns={columns} pageSize={10} rowsPerPageOptions={[10]} />
            </Grid>
        </Grid>

    </AdminLayout>
  )
}

export default ProductsPage