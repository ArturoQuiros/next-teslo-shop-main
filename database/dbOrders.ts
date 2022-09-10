import { isValidObjectId } from "mongoose";
import { IOrder } from "../interfaces/order";
import Order from "../models/Order";
import { connectDB, disconnectDB } from './db';

export const getOrderById = async(id: string): Promise<IOrder | null> => {

    if(!isValidObjectId(id)){
        return null;
    }

    await connectDB();

    const order = await Order.findById(id).lean();

    await disconnectDB();

    if(!order){
        return null;
    }

    return JSON.parse(JSON.stringify(order));

}

export const getOrdersByUser = async(id: string): Promise<IOrder[]> => {

    if(!isValidObjectId(id)){
        return [];
    }

    await connectDB();

    const orders = await Order.find({user: id}).lean();

    await disconnectDB();

    return JSON.parse(JSON.stringify(orders));

}

