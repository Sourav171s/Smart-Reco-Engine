// src/services/recommendationEngine.js

const MAX_PRICE_DIFF = 100; // tune based on your seed data

function calculatePriceScore(sourcePrice, candidatePrice) {
  const diff = Math.abs(sourcePrice - candidatePrice);
  const similarity = Math.max(0, 1 - diff / MAX_PRICE_DIFF);
  // Bonus: slightly cheaper alternatives score higher
  const cheaperBonus = candidatePrice < sourcePrice ? 0.1 : 0;
  return Math.min(1, similarity + cheaperBonus);
}

function calculateRatingScore(candidateRating) {
  return candidateRating / 5; // normalized 0–1
}

function calculateInventoryScore(availableQuantity) {
  if (availableQuantity <= 0) return 0;
  if (availableQuantity >= 50) return 1;
  return availableQuantity / 50; // partial credit for low stock
}

function buildExplainerTags(source, candidate, inventoryQty) {
  const tags = [];
  if (candidate.category === source.category) tags.push("Same Category");
  if (candidate.price < source.price)         tags.push("Lower Price");
  if (candidate.rating > source.rating)       tags.push("Higher Rating");
  if (inventoryQty > 0)                       tags.push("In Stock");
  return tags;
}

export function recommend(source, candidates, inventoryMap, limit = 5) {
  const scored = candidates.map((candidate) => {
    const qty = inventoryMap.get(candidate._id.toString()) ?? 0;

    const categoryScore  = 1; // already filtered to same category = full 40pts
    const priceScore     = calculatePriceScore(source.price, candidate.price);
    const ratingScore    = calculateRatingScore(candidate.rating);
    const inventoryScore = calculateInventoryScore(qty);

    const finalScore = Math.round(
      (categoryScore * 40) +
      (priceScore    * 20) +
      (ratingScore   * 20) +
      (inventoryScore* 20)
    );

    return {
      product: candidate,
      score: finalScore,
      inventoryQty: qty,
      tags: buildExplainerTags(source, candidate, qty),
    };
  });

  // Sort descending, return top 5
  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

export default recommend;
