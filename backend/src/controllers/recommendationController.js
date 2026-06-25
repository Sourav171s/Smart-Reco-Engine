import Inventory from "../models/Inventory.js";
import Product from "../models/Product.js";
import Recommendation from "../models/Recommendation.js";
import { generateExplanation } from "../services/aiExplainer.js";
import { recommend } from "../services/recommendationEngine.js";

export const getRecommendations = async (req, res, next) => {
  try {
    const recommendations = await Recommendation.find({
      sourceProductId: req.params.productId,
    })
      .populate("recommendedProductId")
      .sort({ recommendationScore: -1 });

    return res.status(200).json({
      source: "cache",
      recommendations,
    });
  } catch (error) {
    return next(error);
  }
};

export const generateAndSave = async (req, res, next) => {
  try {
    const { productId } = req.body;
    if (!productId) {
      res.status(400);
      throw new Error("productId is required");
    }

    const sourceProduct = await Product.findById(productId);
    if (!sourceProduct) {
      res.status(404);
      throw new Error("Product not found");
    }

    const candidates = await Product.find({
      category: sourceProduct.category,
      _id: { $ne: sourceProduct._id },
    });
    const inventories = await Inventory.find({
      productId: { $in: candidates.map(({ _id }) => _id) },
    }).lean();
    const inventoryMap = new Map(
      inventories.map(({ productId: id, availableQuantity }) => [
        id.toString(),
        availableQuantity,
      ])
    );
    const results = recommend(sourceProduct, candidates, inventoryMap);

    const recommendations = await Promise.all(
      results.map(async ({ product, score, tags }) => ({
        sourceProductId: sourceProduct._id,
        recommendedProductId: product._id,
        recommendationScore: score,
        reason: await generateExplanation(sourceProduct, product, tags),
        tags,
      }))
    );

    const recommendedIds = recommendations.map(
      ({ recommendedProductId }) => recommendedProductId
    );
    const operations = [
      {
        deleteMany: {
          filter: {
            sourceProductId: sourceProduct._id,
            recommendedProductId: { $nin: recommendedIds },
          },
        },
      },
      ...recommendations.map((recommendation) => ({
        updateOne: {
          filter: {
            sourceProductId: recommendation.sourceProductId,
            recommendedProductId: recommendation.recommendedProductId,
          },
          update: { $set: recommendation },
          upsert: true,
        },
      })),
    ];

    await Recommendation.bulkWrite(operations);

    const populated = await Recommendation.find({
      sourceProductId: sourceProduct._id,
    })
      .populate("recommendedProductId")
      .sort({ recommendationScore: -1 });

    return res.status(201).json({
      source: "generated",
      recommendations: populated,
    });
  } catch (error) {
    return next(error);
  }
};
