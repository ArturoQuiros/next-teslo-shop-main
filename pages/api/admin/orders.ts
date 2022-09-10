import type { NextApiRequest, NextApiResponse } from 'next'
import { connectDB, disconnectDB } from '../../../database/db';
import Order from '../../../models/Order';
import { IOrder } from '../../../interfaces/order';
import { getToken } from 'next-auth/jwt';

type Data = 
| {message: string}
| IOrder[]

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {

    const session: any = await getToken({req, secret: process.env.NEXTAUTH_SECRET});
    const validRoles = ['admin', 'super-user', 'SEO'];
    if(!session || !validRoles.includes(session.user.role)){
        return res.status(400).json({message: 'No autorizado'});
    }

    switch(req.method){
        case 'GET': 
            return getOrders(req, res);
        
        default:
            return res.status(400).json({message: 'Bad Request'});
    }

}

const getOrders = async (req: NextApiRequest, res: NextApiResponse<Data>) => {

    await connectDB();

    const orders = await Order.find().sort({createdAt: 'desc'}).populate('user', 'name email').lean();

    await disconnectDB();

    return res.status(200).json(orders);

}