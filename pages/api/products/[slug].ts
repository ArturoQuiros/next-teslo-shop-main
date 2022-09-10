import type { NextApiRequest, NextApiResponse } from 'next'
import Product from '../../../models/Product';
import { IProduct } from '../../../interfaces/products';
import { connectDB, disconnectDB } from '../../../database/db';

type Data = 
| { message: string }
| IProduct;

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    
    switch( req.method ) {
        case 'GET':
            return getProductBySlug(req, res);

        default:
            return res.status(400).json({
                message: 'Bad request'
            })
    }

}

async function getProductBySlug(req: NextApiRequest, res: NextApiResponse<Data>) {

    try {

        await connectDB();
        const { slug } = req.query;
        const product = await Product.findOne({ slug }).lean();
        await disconnectDB();

        if( !product ) {
            return res.status(404).json({message: 'No hay un producto con ese slug: ' + slug});
        }

        product.images = product.images.map((image) => {
            return image.includes('http') ? image : `${process.env.HOST_NAME}/products/${image}`
        })    

        return res.json( product );
        
    } catch (error) {
        await disconnectDB();
        console.log(error);

        return res.status(400).json({message: 'Algo salio mal'});
    }

}