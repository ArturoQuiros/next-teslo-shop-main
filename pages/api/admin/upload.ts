import type { NextApiRequest, NextApiResponse } from 'next'
import formidable from 'formidable';
import fs from 'fs';
import { getToken } from 'next-auth/jwt';
import { v2 as cloudinary } from 'cloudinary'

cloudinary.config(process.env.CLOUDINARY_URL || '');

export const config = {
    api: {
        bodyParser: false,
    }
}

type Data = {
    message: string
}


export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {

    const session: any = await getToken({req, secret: process.env.NEXTAUTH_SECRET});
    const validRoles = ['admin', 'super-user', 'SEO'];
    if(!session || !validRoles.includes(session.user.role)){
        return res.status(400).json({message: 'No autorizado'});
    }

    switch(req.method){
        case 'POST': 
            return uploadFile(req, res);
        
        default:
            return res.status(400).json({message: 'Bad Request'});
    }
}

const saveFile = async (file: formidable.File): Promise<string> => {
    // const data = fs.readFileSync(file.filepath);
    // fs.writeFileSync(`./public/${file.originalFilename}`, data);
    // fs.unlinkSync(file.filepath);
    // return;

    const x = Math.floor(Math.random() * (Math.floor(9999999999) - Math.ceil(999999999) + 1) + Math.ceil(999999999));
    const name = '' + x;

    const {secure_url} = await cloudinary.uploader.upload(file.filepath, {public_id: `teslo-shop/${name}`});
    return secure_url;
    
}

const parseFiles = async (req: NextApiRequest): Promise<string> => {
    
    return new Promise((resolve, reject) => {

        const form = new formidable.IncomingForm();
        form.parse(req, async(err, fields, files) => {
            //console.log({err, fields, files});
            if(err){
                return reject(err);
            }
            const filePath = await saveFile(files.file as formidable.File);
            resolve(filePath);
        })

    })

}

const uploadFile = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
    
    const imageURL = await parseFiles(req);    

    return res.status(200).json({message: imageURL});

}