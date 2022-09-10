import type { NextApiRequest, NextApiResponse } from 'next'
import { IProduct } from '../../../interfaces/products';
import { connectDB, disconnectDB } from '../../../database/db';
import Product from '../../../models/Product';
import { isValidObjectId } from 'mongoose';
import { getToken } from 'next-auth/jwt';
import { v2 as cloudinary } from 'cloudinary'

cloudinary.config(process.env.CLOUDINARY_URL || '');

type Data = 
| {message: string}
| IProduct[]
| IProduct

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {

    const session: any = await getToken({req, secret: process.env.NEXTAUTH_SECRET});
    const validRoles = ['admin', 'super-user', 'SEO'];
    if(!session || !validRoles.includes(session.user.role)){
        return res.status(400).json({message: 'No autorizado'});
    }

    switch(req.method){
        case 'GET': 
            return getProducts(req, res);

        case 'PUT': 
            return updateProduct(req, res);

        case 'POST': 
            return createProduct(req, res);
        
        default:
            return res.status(400).json({message: 'Bad Request'});
    }

}

const getProducts = async (req: NextApiRequest, res: NextApiResponse<Data>) => {

    await connectDB();

    const products = await Product.find().sort({title: 'asc'}).lean();

    await disconnectDB();

    const updatedProducts = products.map(product => {
        product.images = product.images.map((image) => {
            return image.includes('http') ? image : `${process.env.HOST_NAME}/products/${image}`
        })
        return product;
    })

    return res.status(200).json(updatedProducts);

}

const updateProduct = async (req: NextApiRequest, res: NextApiResponse<Data>) => {

    const {_id = '', images = []} = req.body as IProduct;

    if(!isValidObjectId(_id)){
        return res.status(400).json({message: 'El ID del producto no es valido'});
    }

    if(images.length < 2){
        return res.status(400).json({message: 'Es necesario al menos 2 imagenes'});
    }

    try {

        await connectDB();

        const product = await Product.findById(_id);

        if(!product){
            await disconnectDB();
            return res.status(400).json({message: 'No existe un producto con ese ID'});
        }

        product.images.forEach(async(image) => {
            if(!images.includes(image)){
                const [fileId, extension] = image.substring(image.lastIndexOf('/') + 1).split('.');
                //console.log({fileId, extension, image});
                
                await cloudinary.uploader.destroy('teslo-shop/' + fileId);
            }
        })

        await product.update(req.body);
        await disconnectDB();

        return res.status(200).json(product);
        
    } catch (error) {
        console.log(error);
        await disconnectDB();
        return res.status(400).json({message: 'Revisar la consola del servidor'});
    }

}

const createProduct = async (req: NextApiRequest, res: NextApiResponse<Data>) => {

    const {images = []} = req.body as IProduct;

    if(images.length < 2){
        return res.status(400).json({message: 'Es necesario al menos 2 imagenes'});
    }

    try {

        await connectDB();

        const productInDB = await Product.findOne({slug: req.body.slug});

        if(productInDB){
            await disconnectDB();
            return res.status(400).json({message: 'Ya existe un producto con ese slug'});
        }

        const product = new Product(req.body);
        await product.save();
        await disconnectDB();

        return res.status(201).json(product);
        
    } catch (error) {
        console.log(error);
        await disconnectDB();
        return res.status(400).json({message: 'Revisar la consola del servidor'});
    }

}