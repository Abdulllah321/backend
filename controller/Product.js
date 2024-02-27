const { default: mongoose } = require("mongoose");
const { Product } = require("../model/Product");
const { Rating } = require("../model/Rating");

exports.createProduct = async (req, res) => {
  // this product we have to get from API body
  const product = new Product(req.body);
  product.discountPrice = Math.round(
    product.price * (1 - product.discountPercentage / 100)
  );
  try {
    const doc = await product.save();
    res.status(201).json(doc);
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.fetchAllProducts = async (req, res) => {
  try {
    let condition = {};
    let query = Product.find(condition).lean();
    const ratings = await Rating.find({}, { rating: 1, productId: 1 }).exec();
    let totalProductsQuery = Product.find(condition);

    const averageRatings = ratings.reduce((acc, rating) => {
      if (!acc[rating.productId]) {
        acc[rating.productId] = { sum: 0, count: 0 };
      }

      acc[rating.productId].sum += rating.rating;
      acc[rating.productId].count += 1;

      return acc;
    }, {});

    const formattedAverageRatings = Object.keys(averageRatings).map(
      (productId) => ({
        productId,
        averageRating:
          averageRatings[productId].sum / averageRatings[productId].count,
      })
    );

    if (req.query.rating) {
      const targetRating = parseFloat(req.query.rating);

      let minRating, maxRating;

      if (targetRating === 5) {
        minRating = 5;
        maxRating = 5;
      } else if (targetRating === 4) {
        minRating = 4;
        maxRating = 5;
      } else if (targetRating === 3) {
        minRating = 3;
        maxRating = 5;
      } else if (targetRating === 2) {
        minRating =2;
        maxRating = 5;
      } else if (targetRating === 1) {
        minRating = 1;
        maxRating = 5;
      }

      const filteredRatings = formattedAverageRatings.filter(
        (rating) =>
          rating.averageRating >= minRating && rating.averageRating <= maxRating
      );

      const filteredProductIds = filteredRatings.map(
        (rating) => rating.productId
      );

      query = query.find({ _id: { $in: filteredProductIds } });
      totalProductsQuery = totalProductsQuery.find({ _id: { $in: filteredProductIds } });
    }

    if (!req.query.admin) {
      condition.deleted = { $ne: true };
    }

    if (req.query.category) {
      query = query.find({ category: req.query.category });
      totalProductsQuery = totalProductsQuery.find({
        category: req.query.category,
      });
    }

    if (req.query.brand) {
      query = query.find({ brand: req.query.brand });
      totalProductsQuery = totalProductsQuery.find({ brand: req.query.brand });
    }

    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search, "i");

      query = query.find({
        $or: [
          { title: { $regex: searchRegex } },
          { category: { $regex: searchRegex } },
          { brand: { $regex: searchRegex } },
          { keywords: { $in: [searchRegex] } },
          {
            subCategory: {
              $elemMatch: {
                $or: [
                  { id: { $regex: searchRegex } },
                  { value: { $regex: searchRegex } },
                  { label: { $regex: searchRegex } },
                ],
              },
            },
          },
        ],
      });
    }

    const maxPrice = await Product.find(condition)
      .sort({ price: -1 })
      .limit(1)
      .select("price")
      .lean()
      .exec();

    const minPrice = await Product.find(condition)
      .sort({ price: 1 })
      .limit(1)
      .select("price")
      .lean()
      .exec();

    if (req.query.minPrice || req.query.maxPrice) {
      query = query.find({
        price: {
          $gte: req.query.minPrice ? req.query.minPrice : minPrice,
          $lte: req.query.maxPrice ? req.query.maxPrice : maxPrice,
        },
      });
      totalProductsQuery = totalProductsQuery.find({
        price: {
          $gte: req.query.minPrice ? req.query.minPrice : minPrice,
          $lte: req.query.maxPrice ? req.query.maxPrice : maxPrice,
        },
      });
    }

    if (req.query._sort && req.query._order) {
      query = query.sort({ [req.query._sort]: req.query._order });
    }

    const totalDocs = await totalProductsQuery.count().exec();
    if (req.query._page && req.query._limit) {
      const pageSize = req.query._limit;
      const page = req.query._page;
      const lastId = req.query.lastId;

      if (lastId) {
        query = query.find({ ...condition, _id: { $gt: lastId } });
      } else {
        query = query.skip(pageSize * (page - 1));
      }
      query = query.limit(pageSize);
    }

    const docs = await query.lean().exec();
    res.set("X-Total-Count", totalDocs);

    const response = {
      searchQuery: req.query.search,
      results: docs,
      minPrice: minPrice.length > 0 ? minPrice[0].price : null,
      maxPrice: maxPrice.length > 0 ? maxPrice[0].price : null,
    };

    res.status(200).json(response);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.searchResults = async (req, res) => {
  try {
    const searchQuery = req.query.search;

    const results = await Product.find({
      $or: [
        { title: { $regex: searchQuery, $options: "i" } },
        { category: { $regex: searchQuery, $options: "i" } },
        { brand: { $regex: searchQuery, $options: "i" } },
        { keywords: { $in: [new RegExp(searchQuery, "i")] } },
        {
          subCategory: {
            $elemMatch: {
              $or: [
                { id: { $regex: searchQuery, $options: "i" } },
                { value: { $regex: searchQuery, $options: "i" } },
                { label: { $regex: searchQuery, $options: "i" } },
              ],
            },
          },
        },
      ],
    });

    const processedResults = results.map((result) => {
      let response = {};

      if (
        result.title &&
        result.title.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        response.title = result.title;
      }

      if (
        result.category &&
        result.category.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        response.category = result.category;
      }

      if (
        result.brand &&
        result.brand.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        response.brand = result.brand;
      }

      if (
        result.keywords &&
        Array.isArray(result.keywords) &&
        result.keywords.length > 0
      ) {
        const filteredKeywords = result.keywords.filter((keyword) =>
          keyword.toLowerCase().includes(searchQuery.toLowerCase())
        );

        // Include the filtered keywords in the response
        if (filteredKeywords.length > 0) {
          response.keywords = filteredKeywords;
        }
      }
      if (result.subCategory) {
        const filteredSubCategory = result.subCategory.filter((subCategory) =>
          subCategory.label.toLowerCase().includes(searchQuery.toLowerCase())
        );
        const filteredSubCategories = filteredSubCategory.map(
          (subCategory) => subCategory.label
        );
        if (filteredSubCategory.length > 0) {
          response.subCategory = filteredSubCategories;
        }
      }
      return response;
    });

    res.json({ success: true, results: processedResults });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

exports.fetchProductById = async (req, res) => {
  const { id } = req.params;

  try {
    const product = await Product.findById(id);
    res.status(200).json(product);
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.updateProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    product.discountPrice = Math.round(
      product.price * (1 - product.discountPercentage / 100)
    );
    const updateProduct = await product.save();
    res.status(200).json(updateProduct);
  } catch (err) {
    res.status(400).json(err);
  }
};
