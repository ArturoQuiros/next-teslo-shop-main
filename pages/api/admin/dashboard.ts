import type { NextApiRequest, NextApiResponse } from 'next'
import { connectDB, disconnectDB } from '../../../database/db';
import Order from '../../../models/Order';
import Product from '../../../models/Product';
import User from '../../../models/User';
import { getToken } from 'next-auth/jwt';

type Data = 
| {
    numberOfOrders: number;
    paidOrders: number; //isPaid true
    notPaidOrders: number;
    numberOfClients: number; //role client
    numberOfProducts: number;
    productsWithNoInventory: number; // 0
    lowInventory: number; // 10 o menos
}
| {message: string;}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {

    const session: any = await getToken({req, secret: process.env.NEXTAUTH_SECRET});
    const validRoles = ['admin', 'super-user', 'SEO'];
    if(!session || !validRoles.includes(session.user.role)){
        return res.status(400).json({message: 'No autorizado'});
    }

    await connectDB();

    // const numberOfOrders = await Order.count();
    // const paidOrders = await Order.find({isPaid: true}).count();
    // const numberOfClients = await User.find({role: 'client'}).count();
    // const numberOfProducts = await Product.count();
    // const productsWithNoInventory = await Product.find({inStock: 0}).count();
    // const lowInventory = await Product.find({inStock: {$lte: 10}}).count();

    const [
        numberOfOrders,
        paidOrders,
        numberOfClients,
        numberOfProducts,
        productsWithNoInventory,
        lowInventory,
    ] = await Promise.all([
        Order.count(),
        Order.find({isPaid: true}).count(),
        User.find({role: 'client'}).count(),
        Product.count(),
        Product.find({inStock: 0}).count(),
        Product.find({inStock: {$lte: 10}}).count(),
    ])

    const notPaidOrders = numberOfOrders - paidOrders;

    await disconnectDB();

    res.status(200).json({ 
        numberOfOrders,
        paidOrders,
        notPaidOrders,
        numberOfClients,
        numberOfProducts,
        productsWithNoInventory,
        lowInventory,
     })
}