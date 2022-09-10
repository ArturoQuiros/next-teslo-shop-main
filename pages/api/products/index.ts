import mongoose from 'mongoose';
import type { NextApiRequest, NextApiResponse } from 'next'
import { connectDB, disconnectDB } from '../../../database/db'
import Product from '../../../models/Product';
import { IProduct } from '../../../interfaces/products';
import { SHOP_CONSTANTS } from '../../../database/constants';

type Data = 
| { message: string }
| IProduct[]
| IProduct

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {

    switch (req.method) {
        case 'GET':
            return getProducts(req, res)

            
        default:
            return res.status(400).json({ message: 'Bad request' })
    }

}

const getProducts = async (req: NextApiRequest, res: NextApiResponse<Data>) => {

    const {slug} = req.query;

    if(slug){ //GetProductsBySlug

        try {
            await connectDB();
            const productToGet = await Product.findOne({slug}).lean();
            await disconnectDB();
    
            if(!productToGet){
                return res.status(404).json({message: 'No hay un producto con ese slug: ' + slug});
            }

            productToGet.images = productToGet.images.map((image) => {
                return image.includes('http') ? image : `${process.env.HOST_NAME}/products/${image}`
            })        
    
            return res.status(200).json(productToGet!);
    
        } catch (error) {
            await disconnectDB();
            console.log(error);
    
            return res.status(400).json({message: 'Algo salio mal'});
        }

    }else{ //GetProductsByGender or getAllProducts

        try {

            const {gender = 'all'} = req.query;

            let condition = {};

            if(gender !== 'all' && SHOP_CONSTANTS.validGenders.includes(`${gender}`)){
                condition = {gender};
            }

            await connectDB();

            const products = await Product.find(condition)
                                        .select('title images price inStock slug -_id')
                                        .lean();

            await disconnectDB();

            const updatedProducts = products.map(product => {
                product.images = product.images.map((image) => {
                    return image.includes('http') ? image : `${process.env.HOST_NAME}/products/${image}`
                })
                return product;
            })

            res.status(200).json(updatedProducts)
            
        } catch (error) {
            await disconnectDB();
            console.log(error);
    
            return res.status(400).json({message: 'Algo salio mal'});
        }

    }

}