const { getQuantityBySize } = require("../../../../helpers/getQuantityBySize");
const Cart = require("../../models/carts.model");
const Product = require("../../models/product.model");

// [GET] /cart/get-cart
module.exports.getCart = async (req, res) => {
  try {
    const userId = req.user.id;

    // Tìm giỏ hàng
    const recordsCart = await Cart.findOne({ user_id: userId }).lean();

    if (recordsCart) {
      let totalQuantity = 0;
      if (recordsCart.products.length > 0) {
        for (const item of recordsCart.products) {
          const productInfo = await Product.findOne({
            _id: item.product_id,
          }).select("price discountPercentage title thumbnail slug");
          item.price = productInfo.price;
          item.discountPercentage = productInfo.discountPercentage;
          item.title = productInfo.title;
          item.thumbnail = productInfo.thumbnail;
          item.slug = productInfo.slug;

          totalQuantity += item.quantity;
        }
      }

      return res.json({
        code: 200,
        message: "Giỏ hàng",
        data: recordsCart,
        totalQuantity: totalQuantity,
      });
    } else {
      return res.json({
        code: 201,
        message: "Không tìm thấy giỏ hàng!",
      });
    }
  } catch (error) {
    console.log(error.message);

    res.json({
      code: 500,
      message: "Đã xảy ra lỗi trong khi lấy giỏ hàng",
    });
  }
};

// [PATCH] /cart/add/:productId
module.exports.addPatch = async (req, res) => {
  try {
    const productId = req.params.productId;
    const quantity = parseInt(req.body.quantity) || 1;
    const userId = req.user.id;

    const cart = await Cart.findOne({ user_id: userId });

    // tìm sản phẩm trong cart
    const existsProductCart = cart.products.find(
      (item) => item.product_id.toString() === productId
    );

    if (existsProductCart) {
      // đã tồn tại → cộng thêm quantity
      let quantityNew = quantity + existsProductCart.quantity;

      // nếu bạn vẫn có stock tổng
      const product = await Product.findById(productId).select("stock");

      if (product && product.stock !== undefined) {
        if (quantityNew > product.stock) {
          quantityNew = product.stock;
        }
      }

      await Cart.updateOne(
        {
          user_id: userId,
          "products.product_id": productId,
        },
        {
          $set: { "products.$.quantity": quantityNew },
        }
      );
    } else {
      // ✅ chưa tồn tại → thêm mới
      const objCart = {
        product_id: productId,
        quantity: quantity,
      };

      await Cart.updateOne(
        { user_id: userId },
        { $push: { products: objCart } }
      );
    }

    // ✅ tính tổng quantity
    const cartExists = await Cart.findOne({ user_id: userId });

    let totalQuantity = 0;
    if (cartExists?.products?.length > 0) {
      for (const item of cartExists.products) {
        totalQuantity += item.quantity;
      }
    }

    res.json({
      code: 200,
      message: "Thêm vào giỏ hàng thành công",
      totalQuantity,
    });
  } catch (error) {
    res.json({
      code: 400,
      message: "Lỗi",
    });
  }
};

// [PATCH] /cart/delete/:idProduct
module.exports.delPatch = async (req, res) => {
  try {
    const productId = req.params.idProduct;
    const userId = req.user.id;

    await Cart.updateOne(
      {
        user_id: userId,
      },
      {
        $pull: { products: { product_id: productId } },
      }
    );

    const cart = await Cart.findOne({ user_id: userId });
    let totalQuantity = 0;
    if (cart.products.length > 0) {
      for (const item of cart.products) {
        const productId = item.product_id;
        totalQuantity += item.quantity;
        // Kiểm tra và lấy thông tin sản phẩm
        const productInfo = await Product.findOne({
          _id: productId,
          deleted: false,
          status: "active",
        }).select("title thumbnail price slug discountPercentage");

        if (productInfo) {
          // Tính toán giá và tổng giá
          productInfo.priceNew = (
            (productInfo.price * (100 - productInfo.discountPercentage)) /
            100
          ).toFixed(0);

          item.totalPrice = productInfo.priceNew * item.quantity;
          item.productInfo = productInfo;
        }
      }
    }

    res.json({
      code: 200,
      message: "Xóa sản phẩm thành công",
      totalQuantity: totalQuantity,
    });
  } catch (error) {
    res.json({
      code: 400,
      message: "Lỗi",
    });
  }
};

// [PATCH] /cart/update/:idProduct
module.exports.updatePatch = async (req, res) => {
  try {
    const productId = req.params.idProduct;
    const quantity = parseInt(req.body.quantity) || 1;
    const userId = req.user.id;

    const cartExists = await Cart.findOne({ user_id: userId });

    if (!cartExists) {
      return res.json({
        code: 400,
        message: "Giỏ hàng không tồn tại",
      });
    }

    // ✅ tìm sản phẩm trong cart
    const productExists = cartExists.products.find(
      (item) => item.product_id.toString() === productId
    );

    if (!productExists) {
      return res.json({
        code: 400,
        message: "Sản phẩm không tồn tại trong giỏ hàng",
      });
    }

    // ✅ check stock tổng (nếu có)
    let quantityUpdate = quantity;

    const product = await Product.findById(productId).select("stock");

    if (product && product.stock !== undefined) {
      if (quantity > product.stock) {
        quantityUpdate = product.stock;
      }
    }

    // ✅ update quantity
    await Cart.updateOne(
      {
        user_id: userId,
        "products.product_id": productId,
      },
      {
        $set: { "products.$.quantity": quantityUpdate },
      }
    );

    // ✅ tính tổng quantity
    const cart = await Cart.findOne({ user_id: userId });

    let totalQuantity = 0;
    if (cart?.products?.length > 0) {
      for (const item of cart.products) {
        totalQuantity += item.quantity;
      }
    }

    res.json({
      code: 200,
      message: "Cập nhật số lượng thành công",
      totalQuantity,
    });
  } catch (error) {
    res.json({
      code: 400,
      message: "Lỗi",
    });
  }
};

// [PATCH] /cart/merge-cart
module.exports.mergeCartPatch = async (req, res) => {
  try {
    const userId = req.user.id;
    const cartItems = req.body.cartItems; // [{ product_id, quantity }]

    let cart = await Cart.findOne({ user_id: userId });

    if (!cart) {
      cart = new Cart({
        user_id: userId,
        products: [],
      });
    }

    for (const item of cartItems) {
      const { product_id, quantity } = item;

      // ✅ lấy sản phẩm để check stock (nếu có)
      const product = await Product.findById(product_id).select("stock");
      if (!product) continue;

      let quantityAdd = quantity;

      if (product.stock !== undefined) {
        if (quantityAdd > product.stock) {
          quantityAdd = product.stock;
        }
      }

      // ✅ tìm trong cart
      const productExists = cart.products.find(
        (p) => p.product_id.toString() === product_id
      );

      if (productExists) {
        let newQuantity = productExists.quantity + quantityAdd;

        // check stock lần nữa khi cộng dồn
        if (product.stock !== undefined && newQuantity > product.stock) {
          newQuantity = product.stock;
        }

        productExists.quantity = newQuantity;
      } else {
        cart.products.push({
          product_id: product_id,
          quantity: quantityAdd,
        });
      }
    }

    await cart.save();

    // ✅ tính tổng quantity
    let totalQuantity = 0;
    for (const item of cart.products) {
      totalQuantity += item.quantity;
    }

    res.json({
      code: 200,
      message: "Merge giỏ hàng thành công",
      totalQuantity,
    });
  } catch (error) {
    console.error(error);
    res.json({
      code: 400,
      message: "Lỗi merge giỏ hàng",
    });
  }
};
