import { IProduct } from '../interfaces/products';
import Product from '../models/Product';
import { connectDB, disconnectDB } from './db';

export const getProductBySlug = async(slug: string): Promise<IProduct | null> => {
  
    await connectDB();
    const product = await Product.findOne({slug}).lean();
    await disconnectDB();

    if(!product){
        return null;
    }

    product.images = product.images.map((image) => {
        return image.includes('http') ? image : `${process.env.HOST_NAME}/products/${image}`
    })

    return JSON.parse(JSON.stringify(product));

}

export const getProductsByTerm = async(term: string): Promise<IProduct[]> => {

    term = term.toString().toLowerCase();

    await connectDB();
    const products = await Product.find({
        $text: {$search: term}
    })
    .select('title images price inStock slug -_id')
    .lean();
    await disconnectDB();

    const updatedProducts = products.map(product => {
        product.images = product.images.map((image) => {
            return image.includes('http') ? image : `${process.env.HOST_NAME}/products/${image}`
        })
        return product;
    })

    return updatedProducts;

}

export const getAllProducts = async(): Promise<IProduct[]> => {

    await connectDB();
    const products = await Product.find().lean();
    await disconnectDB();

    const updatedProducts = products.map(product => {
        product.images = product.images.map((image) => {
            return image.includes('http') ? image : `${process.env.HOST_NAME}/products/${image}`
        })
        return product;
    })

    return JSON.parse(JSON.stringify(updatedProducts));

}

interface productSlug {
    slug: string;
}

export const getAllProductSlugs = async(): Promise<productSlug[]> => {
    
    await connectDB();
    const slugs = await Product.find().select('slug -_id').lean();
    await disconnectDB();

    return slugs;

}