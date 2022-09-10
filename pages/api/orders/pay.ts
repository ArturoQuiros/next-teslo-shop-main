import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios';
import { PaypalOrderStatusResponse } from '../../../interfaces/paypal';
import { connectDB, disconnectDB } from '../../../database/db';
import Order from '../../../models/Order';

type Data = {
    message: string
}

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {

    switch(req.method){
        case 'POST': 
            return payOrder(req, res);
        default:
            return res.status(400).json({message: 'Bad Request'});
    }

}

const getPaypalBearerToken = async():Promise<string | null> => {

    const paypal_client = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
    const paypal_secret = process.env.PAYPAL_SECRET;

    const base64Token = Buffer.from(`${paypal_client}:${paypal_secret}`, 'utf-8').toString('base64');
    const body = new URLSearchParams('grant_type=client_credentials');
    
    try {
        const {data} = await axios.post(process.env.PAYPAL_OAUTH_URL || '', body, {
            headers: { 
                'Authorization': `Basic ${base64Token}`, 
                'Content-Type': 'application/x-www-form-urlencoded'
              }
        })

        return data.access_token;

    } catch (error) {
        if(axios.isAxiosError(error)){
            console.log(error.response?.data);
        }else{
            console.log(error);
        }
        return null;
    }

}

const payOrder = async (req: NextApiRequest, res: NextApiResponse<Data>) => {

    //TODO validar ID es mongoID y validar que la orden es del usuario segun session

    const paypalBearerToken = await getPaypalBearerToken();

    if(!paypalBearerToken){
        return res.status(400).json({message: 'No se pudo confirmar el token de Paypal'});
    }

    const {transactionId = '', orderId = ''} = req.body;

    const {data} = await axios.get<PaypalOrderStatusResponse>(`${process.env.PAYPAL_ORDERS_URL}/${transactionId}`, {
        headers: { 
            'Authorization': `Bearer ${paypalBearerToken}`
        }
    })

    if(data.status !== 'COMPLETED'){
        return res.status(401).json({message: 'Orden no reconocida'});
    }

    await connectDB();

    const dbOrder = await Order.findById(orderId);

    if(!dbOrder){
        await disconnectDB();
        return res.status(400).json({message: 'Orden no existen la base de datos'});
    }

    if(dbOrder.total !== Number(data.purchase_units[0].amount.value)){
        await disconnectDB();
        return res.status(400).json({message: 'Los montos de Paypal y nuestra orden no son iguales'});
    }

    dbOrder.transactionId = transactionId;
    dbOrder.isPaid = true;

    await dbOrder.save();

    await disconnectDB();

    return res.status(200).json({message: 'Orden pagada!'});

}