import type { NextApiRequest, NextApiResponse } from 'next'
import { connectDB, disconnectDB } from '../../../database/db';
import User from '../../../models/User';
import { IUser } from '../../../interfaces/users';
import { isValidObjectId } from 'mongoose';
import { getToken } from 'next-auth/jwt';

type Data = 
| {message: string}
| IUser[]

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {

    const session: any = await getToken({req, secret: process.env.NEXTAUTH_SECRET});
    const validRoles = ['admin', 'super-user', 'SEO'];
    if(!session || !validRoles.includes(session.user.role)){
        return res.status(400).json({message: 'No autorizado'});
    }

    switch(req.method){
        case 'GET': 
            return getUsers(req, res);

        case 'PUT': 
            return updateUser(req, res);
        
        default:
            return res.status(400).json({message: 'Bad Request'});
    }
    
}

const getUsers = async (req: NextApiRequest, res: NextApiResponse<Data>) => {

    await connectDB();

    const users = await User.find().select('-password').lean();

    await disconnectDB();

    return res.status(200).json(users);

}

const updateUser = async (req: NextApiRequest, res: NextApiResponse<Data>) => {

    const {userId = '', role = ''} = req.body;

    if(!isValidObjectId(userId)){
        return res.status(400).json({message: 'No existe usuario por ese ID'});
    }

    const validRoles = ['admin', 'super-user', 'SEO', 'client'];

    if(!validRoles.includes(role)){
        return res.status(400).json({message: 'Rol no permitido'});
    }

    await connectDB();

    const user = await User.findById(userId);

    if(!user){
        await disconnectDB();
        return res.status(404).json({message: 'Usuario no encontrado'});
    }

    user.role = role;
    await user.save();

    await disconnectDB();

    return res.status(200).json({message: 'Usuario actualizado'});

}