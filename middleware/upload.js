// backend/config/multer.js (create new file)
import multer from 'multer';

const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 1 * 1024 * 1024 // 1MB
  }
});

export const uploadSingle = upload.single('profileImage');