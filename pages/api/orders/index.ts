import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react';
import { IOrder } from '../../../interfaces/order';
import { connectDB, disconnectDB } from '../../../database/db';
import Product from '../../../models/Product';
import Order from '../../../models/Order';

type Data = 
| { message: string }
| IOrder;

export default function handler (req: NextApiRequest, res: NextApiResponse<Data>) {

    switch(req.method){
        case 'POST': 
            return createOrder(req, res);
        default:
            return res.status(400).json({message: 'Bad Request'});
    }

}

const createOrder = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
    
    const {orderItems, total} = req.body as IOrder;

    const session: any = await getSession({req});

    if(!session){
        return res.status(401).json({message: 'Debe de estar autenticado para hacer esto'});
    }

    const productsIds = orderItems.map(product => product._id);
    await connectDB();

    const dbProducts = await Product.find({_id: {$in: productsIds}});

    try {
        
        const subtotal = orderItems.reduce((prev, current) => { 

            const currentPrice = dbProducts.find(prod => prod.id === current._id)?.price;
            if(!currentPrice){
                throw new Error('Verifique el carrito de nuevo, producto no existe');
            }

            return (currentPrice * current.quantity) + prev
        }, 0);

        const taxRate = Number(process.env.NEXT_PUBLIC_TAX_RATE || 0);
        const backendTotal = subtotal * (taxRate + 1);

        if(total !== backendTotal){
            throw new Error('El total no cuadra con el monto');
        }

        const userId = session.user._id;
        const newOrder = new Order({...req.body, isPaid: false, user: userId});
        newOrder.total = Math.round(newOrder.total*100) / 100;
        await newOrder.save();
        await disconnectDB();

        return res.status(201).json(newOrder);

    } catch (error: any) {
        await disconnectDB();
        console.log(error);
        res.status(400).json({
            message: error.message || 'Revise logs del servidor'
        })
        
    }
    
}
