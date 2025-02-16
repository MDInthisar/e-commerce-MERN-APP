import orderModel from "../models/orderSchema.js";
import productModel from "../models/productModel.js";
import userModel from "../models/userModel.js";
import cloudinary from "cloudinary";
import nodemailer from "nodemailer";

export const allProduct = async (req, res) => {
  const products = await productModel.find();
  if (products) {
    res.json(products);
  } else {
    res.json([]);
  }
};

export const singleProduct = async (req, res) => {  
  console.log(req.params.id);
  
  const product = await productModel.findOne({ _id: req.params.id }).populate({
    path: "productOwner",
    select: "-password",
  });

  if (!product) return res.json({ error: "product not found" });
  res.json(product);
};

export const profile = async (req, res) => {
  try {
    if (!req.user || !req.user.userID) {
      return res.status(401).json({ error: "Unauthorized access" });
    }

    const user = await userModel
      .findOne({ _id: req.user.userID })
      .select("-password");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error. Please try again later." });
  }
};

export const profileUpdate = async (req, res) => {
  const { name, username, doorNo, streetName, pincode, phonoNo } = req.body;
  const file = req.file;  
  let profilePic;
  const user = await userModel.findOne({ _id: req.user.userID });

  if (!user) return res.json({ error: "user not found" });

  if (file) {
    if (user.profilePic) {
      await cloudinary.v2.uploader.destroy(
        user.profilePic.split("/").pop().split(".")[0]
      );
    }
    const uploadedResponse = await cloudinary.uploader.upload(file.path);
    profilePic = uploadedResponse.secure_url;
  }

  user.name = name || user.name;
  user.username = username || user.username;
  user.profilePic = profilePic || user.profilePic;
  user.address.doorNo = doorNo || user.address.doorNo;
  user.address.streetName = streetName || user.address.streetName;
  user.address.pincode = pincode || user.address.pincode;
  user.address.phonoNo = phonoNo || user.address.phonoNo;

  await user.save();

  res.json({ message: "profile updated" });
};

export const allCart = async (req, res) => {
  const user = await userModel
    .findOne({ _id: req.user.userID })
    .populate("cart.product");

  let total = 0;
  user.cart.forEach((item) => {
    total = total + item.product.productPrice * item.quantity;
  });
  res.json({ carts: user.cart, total });
};

export const addToCart = async (req, res) => {
  const { productID, quantity } = req.body;

  const product = await productModel.findOne({ _id: productID });
  const user = await userModel.findOne({ _id: req.user.userID });

  if (!product || !user) {
    return res.json({ error: "Product or user details do not exist" });
  }

  let isInCart = user.cart.find((data) => {
    return data.product.toString() === productID;
  });

  if (isInCart) {
    //add the quantity

    isInCart.quantity += Number(quantity);
    await user.save();

    res.json({ message: "Product quantity updated in cart" });
  } else {
    // Product is not in the cart, push the new product
    await userModel.findByIdAndUpdate(
      { _id: req.user.userID },
      { $push: { cart: { product: productID, quantity: quantity } } }
    );

    res.json({ message: "Product added to cart" });
  }
};

export const removeCart = async (req, res) => {
  try {
    await userModel.findByIdAndUpdate(
      { _id: req.user.userID },
      { $pull: { cart: { product: req.params.id } } }
    );
    res.json({ message: "cart deleted " });
  } catch (err) {
    res.json({ error: "something went wrong" });
  }
};

export const orderProduct = async (req, res) => {
  try {
    const user = await userModel.findById(req.user.userID).populate({
      path: "cart.product",
      populate: {
        path: "productOwner",
        model: "user",
      },
    });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const { doorNo, pincode, streetName, phonoNo } = user.address;
    if (
      doorNo === undefined ||
      doorNo === "N/A" ||
      pincode === undefined ||
      pincode === "N/A" ||
      streetName === undefined ||
      streetName === "N/A" ||
      phonoNo === undefined ||
      phonoNo === "N/A"
    ) {
      return res.json({ message: "address need to fill" });
    }

    if (user.cart.length > 0) {
      // Create an array of the products the user is ordering
      const items = user.cart.map((item) => ({
        product: item.product._id,
        quantity: item.quantity,
        productPrice: item.product.productPrice,
      }));

      // Calculate the total amount of the order
      const totalAmount = items.reduce(
        (total, item) => total + item.productPrice * item.quantity,
        0
      );

      // Create the new order
      const order = await orderModel.create({
        orderedUser: user._id,
        orderedProduct: items,
        totalAmount,
        paymentMethods: "COD",
        shippingAddress: user.address,
      });

      await Promise.all(
        user.cart.map(async (data) => {
          const productOwnerEmail = data.product.productOwner.email;
          const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
              user: process.env.EMAIL_ID,
              pass: process.env.EMAIL_PASSWORD,
            },
          });

          await transporter.sendMail({
            from: user.email,
            to: productOwnerEmail,
            subject: "Order Notification",
            text: `The user ${user.name} has placed an order for your product "${data.product.productName}".`,
          });
        })
      );

      // Add this order to the user's order history
      user.orders.push(order._id);
      user.cart = []; // Clear the cart after placing the order

      // Save the updated user
      await user.save();

      // Send the response
      res.json({ message: "Order placed successfully", order });
    } else {
      return res.json({ message: "product not selected" });
    }
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Something went wrong while placing the order" });
  }
};

export const trackOrder = async (req, res) => {
  const userorders = await orderModel
    .find({ orderedUser: req.user.userID })
    .populate("orderedProduct.product");

  if (!userorders || userorders.length < 0) {
    res.json({ message: "order not found" });
  }

  res.json(userorders);
};

// admin functionality

export const createProduct = async (req, res) => {
  const { productName, productDescription, productPrice, stock } = req.body;
  const image = req.file.path;
  try {
    const user = await userModel.findOne({ _id: req.user.userID });

    if (!user) {
      return res.status(404).json({ error: "Admin not found" });
    }
    let uploadedPhotoUrl = "";

    if (image) {
      try {
        const uploader = await cloudinary.v2.uploader.upload(image);
        uploadedPhotoUrl = uploader.secure_url;
      } catch (error) {
        return res.status(500).json({ error: "Error uploading photo" });
      }
    }

    let product = await productModel.create({
      productName,
      productDescription,
      productPrice,
      stock,
      productPhoto: uploadedPhotoUrl,
      productOwner: user._id,
    });
    res.json({ message: "Product created successfully" });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
};

export const adminProducts = async (req, res) => {
  const result = await productModel.find({ productOwner: req.user.userID });
  res.json(result);
};

export const editProduct = async (req, res) => {
  const { productName, productDescription, productPrice, stock } = req.body;
  let productPhoto;
  const file = req.file;

  const { id } = req.params;

  const searchProduct = await productModel.findOne({ _id: id });

  if (file) {
    if (searchProduct.productPhoto) {
      await cloudinary.v2.uploader.destroy(
        searchProduct.productPhoto.split("/").pop().split(".")[0]
      );
    }
    const uploader = await cloudinary.v2.uploader.upload(file.path);
    productPhoto = uploader.secure_url;
  }

  searchProduct.productName = productName || searchProduct.productName;
  searchProduct.productDescription =
    productDescription || searchProduct.productDescription;
  searchProduct.productPrice = productPrice || searchProduct.productPrice;
  searchProduct.stock = stock || searchProduct.stock;
  searchProduct.productPhoto = productPhoto || searchProduct.productPhoto;

  await searchProduct.save();

  res.json({ message: "product edit sucessfull" });
};

export const deleteProduct = async (req, res) => {
  const { id } = req.params;

  const searchProduct = await productModel.findOne({ _id: id });

  if (!searchProduct) return res.json({ error: "product not found" });

  await productModel.findByIdAndDelete({ _id: id });

  res.json({ message: `${searchProduct.productName} deleted sucessfull` });
};

export const bookedProduct = async (req, res) => {
  try {
    const adminProducts = await productModel.find({
      productOwner: req.user.userID,
    });

    const adminProductIds = adminProducts.map((product) => {
      return product._id.toString();
    });

    const orders = await orderModel
      .find({
        "orderedProduct.product": { $in: adminProductIds },
      })
      .populate("orderedProduct.product")
      .populate({
        path: "orderedUser",
        select: "name username email",
      });

    if (!orders || orders.length === 0) {
      return res.json({ message: "No orders found for your products" });
    }
    res.json(orders);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Something went wrong while fetching the orders" });
  }
};
