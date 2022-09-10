import User from '../models/User';
import { connectDB, disconnectDB } from './db';
import bcrypt from 'bcryptjs';


export const checkUserEmailPassword = async(email: string, password: string) => {

    await connectDB();

    const user = await User.findOne({email}).lean();

    await disconnectDB();

    if(!user){
        return null;
    }

    if(!bcrypt.compareSync(password, user.password!)){
        return null;
    }

    const {role, name, _id} = user;

    return {
        _id,
        email: email.toLocaleLowerCase(),
        role, 
        name,
    }

}

export const oAuthToDbUser = async(oAuthEmail: string, oAuthName: string) => {

    await connectDB();

    const user = await User.findOne({email: oAuthEmail}).lean();

    if(user){
        await disconnectDB();
        const {_id, name, email, role} = user;
        return {_id, name, email, role};
    }

    const newUser = new User({email: oAuthEmail, name: oAuthName, password: '@', role: 'client'});
    await newUser.save();
    await disconnectDB();

    const {_id, name, email, role} = newUser;

    return {_id, name, email, role};

}