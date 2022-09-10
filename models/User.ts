import mongoose, {Model, Schema} from 'mongoose';
import { IUser } from '../interfaces/users';

const userSchema = new Schema({
    //id: {type: Schema.Types.ObjectId, required: true},

    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    role: {
        type: String, 
        enum: {
            values: ['admin','client', 'super-user', 'SEO'],
            message: '{VALUE} no es un rol válido',
            default: 'client',
            required: true
        }
    },
},{
    timestamps: true
});



const User: Model<IUser> = mongoose.models.User || mongoose.model('User', userSchema);

export default User;