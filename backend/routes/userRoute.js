import express from "express";
import {
  allProduct,
  createProduct,
  singleProduct,
  adminProducts,
  editProduct,
  deleteProduct,
  profile,
  profileUpdate,
  allCart,
  addToCart,
  removeCart,
  orderProduct,
  trackOrder,
  upiProduct,
  verifyUpi,
  bookedProduct,
} from "../controllers/userController.js";
import islogedIn from "../middlewares/islogedIn.js";
import isAdmin from "../middlewares/isAdmin.js";
import ownerProductImages from "../config/multerConfig.js";

const router = express.Router();

router.get("/allproduct", allProduct);
router.get("/product/:id", islogedIn, isAdmin("admin", "user"), singleProduct);
router.get("/profile", islogedIn, profile);
router.put("/profileupdate", islogedIn, ownerProductImages.single('profilepic'), profileUpdate);
router.post("/addtocart", islogedIn, addToCart);
router.delete("/removecart/:id", islogedIn, removeCart);
router.get("/allcarts", islogedIn, allCart);
router.post("/orderproduct", islogedIn, orderProduct);
router.post("/upiproduct", islogedIn, upiProduct);
router.post("/verifyupi", islogedIn, verifyUpi);
router.get('/trackorder', islogedIn, trackOrder);

// admin
router.post("/createproduct", islogedIn, isAdmin("admin"),ownerProductImages.single('productPhoto'), createProduct);
router.get("/adminproducts", islogedIn, isAdmin("admin"), adminProducts);
router.put("/editproduct/:id", islogedIn, isAdmin("admin"), ownerProductImages.single('productPhoto'), editProduct);
router.delete("/deleteproduct/:id", islogedIn, isAdmin("admin"), deleteProduct);
router.get('/bookedproduct', islogedIn, isAdmin('admin'), bookedProduct);

export default router;
