import type { NextApiRequest, NextApiResponse } from 'next'
import { connectDB, disconnectDB } from '../../../database/db';
import User from '../../../models/User';
import bcrypt from 'bcryptjs';
import { isValidToken, signToken } from '../../../utils/jwt';

type Data = 
| {message: string}
| {
    token: string;
    user: {
        email: string;
        role: string;
        name: string;
    }
}

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    
    switch (req.method) {
        case 'GET':
            return renewToken(req, res);
    
        default:
            res.status(400).json({
                message: 'Bad request'
            })
    }

}

const renewToken = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
    
    const {token = ''} = req.cookies;

    let userId = '';

    try {
        userId = await isValidToken(token);
    
    } catch (error) {
        return res.status(401).json({
            message: 'Token de autorizacion no es valido'
        })
    }    

    await connectDB();

    const user = await User.findById(userId);

    await disconnectDB();

    if(!user){
        return res.status(400).json({message: 'No existe un usuario con ese ID'});
    }

    const {role, email, name} = user;

    return res.status(200).json({
        token: signToken(userId, email),
        user: {
            email, role, name
        }
    })

}

