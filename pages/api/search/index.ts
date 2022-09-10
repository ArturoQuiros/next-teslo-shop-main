import mongoose from 'mongoose';
import type { NextApiRequest, NextApiResponse } from 'next'
import { connectDB, disconnectDB } from '../../../database/db'
import Product from '../../../models/Product';
import { IProduct } from '../../../interfaces/products';

type Data = 
| { message: string }
| IProduct[]

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {

    switch (req.method) {
        case 'GET':
            return searchProducts(req, res)

            
        default:
            return res.status(400).json({ message: 'Bad request' })
    }

}

const searchProducts = async (req: NextApiRequest, res: NextApiResponse<Data>) => {

    let {q= ''} = req.query;

    if(q.length === 0){
        return res.status(400).json({ message: 'Debe de especificar el query de búsqueda' })
    }

    q = q.toString().toLowerCase();

    try {
        await connectDB();
        const products = await Product.find({
            $text: {$search: q}
        })
        .select('title images price inStock slug -_id')
        .lean();
        await disconnectDB();

        return res.status(200).json(products!);

    } catch (error) {
        await disconnectDB();
        console.log(error);

        return res.status(400).json({message: 'Algo salio mal'});
    }

}