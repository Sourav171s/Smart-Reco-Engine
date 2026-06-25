import express from "express";
import {
  generateAndSave,
  getRecommendations,
} from "../controllers/recommendationController.js";

const router = express.Router();

router.post("/generate-recommendations", generateAndSave);
router.get("/:productId", getRecommendations);

export default router;
