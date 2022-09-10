import type { NextApiRequest, NextApiResponse } from 'next'
import { connectDB, disconnectDB } from '../../database/db';
import { initialData } from '../../database/seed-data';
import Order from '../../models/Order';
import Product from '../../models/Product';
import User from '../../models/User';

//SOLO PARA DESARROLLO

type Data = {
    message: string
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {

    if(process.env.NODE_ENV === 'production'){
        return res.status(401).json({message: 'No tiene acceso a este servicio'});
    }

    await connectDB();

    await User.deleteMany();
    await User.insertMany(initialData.users);
    
    await Product.deleteMany();
    await Product.insertMany(initialData.products);    

    await Order.deleteMany();

    await disconnectDB();

    res.status(200).json({ message: 'Proceso realizado correctamente' })
}