import multer from 'multer';
import path from 'path';
import { exec } from 'child_process';
import { NextApiRequest, NextApiResponse } from 'next';

// Set up path to save uploaded files
const uploadPath = path.join(process.cwd(), 'uploads');

// Multer storage configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        cb(null, 'image.jpg');
    }
});

const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        const fileTypes = /jpeg|jpg|png|gif/;
        const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = fileTypes.test(file.mimetype);
        if (extname && mimetype) {
            cb(null, true);
        } else {
            cb(new Error('File type not supported'), false);
        }
    }
});

export const config = {
    api: {
        bodyParser: false
    }
};

// Main handler
export default function handler(req, res) {
    if (req.method === 'POST') {
        upload.single('image')(req, {}, (err) => {
            if (err) {
                return res.status(400).json({ error: err.message });
            }
            const imagePath = path.join(uploadPath, 'image.jpg');
            const scriptPath = path.join(process.cwd(), 'Python2', 'script.py');
            const command = `python ${scriptPath} --image ${imagePath}`;

            exec(command, (error, stdout, stderr) => {
                if (error || stderr) {
                    console.error(`Error: ${error || stderr}`);
                    return res.status(500).json({ error: 'Error executing Python script' });
                }
                try {
                    const jsonOutput = JSON.parse(stdout);
                    return res.status(200).json({ output: jsonOutput });
                } catch (parseError) {
                    return res.status(500).json({ error: 'Error parsing Python output' });
                }
            });
        });
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}
