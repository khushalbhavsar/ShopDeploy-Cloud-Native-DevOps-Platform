import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Use local file storage instead of Cloudinary
export const saveLocalFile = async (file) => {
    try {
        const uploadDir = path.join(__dirname, '../../uploads');

        // Ensure uploads directory exists
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        const filename = `${Date.now()}-${file.originalname}`;
        const filePath = path.join(uploadDir, filename);

        // Move file to uploads directory
        fs.renameSync(file.path, filePath);

        return {
            url: `/uploads/${filename}`,
            publicId: filename,
        };
    } catch (error) {
        throw new Error(`File upload failed: ${error.message}`);
    }
};

export const deleteLocalFile = async (publicId) => {
    try {
        const filePath = path.join(__dirname, '../../uploads', publicId);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
    } catch (error) {
        throw new Error(`File delete failed: ${error.message}`);
    }
};