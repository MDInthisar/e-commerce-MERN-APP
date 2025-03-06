import multer from 'multer';
// import path from 'path'
// import { fileURLToPath } from 'url';

// const __dirname = path.dirname(fileURLToPath(import.meta.url));

// const storage = multer.diskStorage({
//   destination: (req, file, cb)=>{
//     cb(null, path.resolve(__dirname, '../admin-products-img'));
//   },
//   filename:(req, file, cb)=>{
//     if(!file.mimetype.startsWith('image')) return cb(new Error('only Image file accepted'), false)
//     cb(null, Date.now()+'.'+file.originalname.split('.').pop())
//   }
// });

const storage = multer.memoryStorage();
const ownerProductImages = multer({storage});

export default ownerProductImages;