import { Card, CardContent, Grid, Typography, Divider, Chip } from '@mui/material';
import { Box } from '@mui/system';
import { CartList } from '../../../components/cart/CartList';
import { OrderSummary } from '../../../components/cart/OrderSummary';
import { AirplaneTicketOutlined, CreditCardOffOutlined, CreditScoreOutlined } from '@mui/icons-material';
import { GetServerSideProps, NextPage } from 'next'
import { getOrderById } from '../../../database/dbOrders';
import { IOrder } from '../../../interfaces/order';
import { countries } from '../../../utils/countries';
import { AdminLayout } from '../../../components/layouts/AdminLayout';


interface Props {
    order: IOrder
}

const OrderPage: NextPage<Props> = ({order}) => {
    
    const {shippingAddress} = order;

  return (
    <AdminLayout title='Resumen de orden' subtitle={`Orden ID: ${order._id}`} icon={<AirplaneTicketOutlined />} >

        {
            order.isPaid ? (
                <Chip sx={{my:2}} label="Orden ya fue pagada" variant="outlined" color="success" icon={<CreditScoreOutlined />} />
            ) : (
                <Chip sx={{my:2}} label="Pendiente de pago" variant="outlined" color="error" icon={<CreditCardOffOutlined />} />
            )
        }

        <Grid container className='fadeIn'>
            <Grid item xs={12} sm={7} sx={{mt:2}}>
                <CartList products={order.orderItems} />
            </Grid>
            <Grid item xs={12} sm={5} sx={{mt:2}}>
                <Card className='summary-card'>
                    <CardContent>
                        <Typography variant='h2'>Resumen ({order.numberOfItems} {order.numberOfItems > 1 ? 'productos' : 'producto'})</Typography>
                        <Divider sx={{my:1}} />

                        <Box display='flex' justifyContent='space-between'>
                            <Typography variant='subtitle1'>Direccion de entrega</Typography>
                        </Box>

                        
                        <Typography>{shippingAddress.firstName} {shippingAddress.lastName}</Typography>
                        <Typography>{shippingAddress.address}{shippingAddress.address2 ? `, ${shippingAddress.address2}` : ''}</Typography>
                        <Typography>{shippingAddress.city}, {shippingAddress.zip}</Typography>
                        <Typography>{countries.find(c => c.code === shippingAddress.country)?.name}</Typography>
                        <Typography>{shippingAddress?.phone}</Typography>

                        <Divider sx={{my:1}} />

                        <OrderSummary order={order} />

                        <Box sx={{mt: 3}} display='flex' flexDirection='column'>

                            <Box display='flex' flexDirection='column' justifyContent='center' className='fadeIn'>
                                {
                                    order.isPaid ? (
                                        <Chip sx={{my:2}} label="Orden ya fue pagada" variant="outlined" color="success" icon={<CreditScoreOutlined />} />
                                    ) : (
                                        <Chip sx={{my:2}} label="Orden pendiente de pago" variant="outlined" color="error" icon={<CreditCardOffOutlined />} />
                                    )
                                }
                            </Box>

                            
                        </Box>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    </AdminLayout>
  )
}

export const getServerSideProps: GetServerSideProps = async ({req, query}) => {
    
    const {id = ''} = query;

    const order = await getOrderById(id.toString());

    if(!order){
        return {
            redirect: {
                destination: '/admin/orders',
                permanent: false
            }
        }
    }

    return {
        props: {
            order
        }
    }
}

export default OrderPage