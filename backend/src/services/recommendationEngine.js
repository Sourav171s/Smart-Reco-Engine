// Weights sum to 100. Category is a flat baseline because it's already a
// hard filter below (every surviving candidate matches, so it doesn't need
// to "compete" — it just anchors the score scale).
const WEIGHTS = {
  category: 40,
  price: 30,
  rating: 30,
};

// Candidates with less stock than this are excluded entirely — they are
// NOT scored low, they are not recommended at all until restocked.
const DEFAULT_MIN_STOCK_QTY = 1;

function calculatePriceScore(sourcePrice, candidatePrice) {
  if (sourcePrice === 0 && candidatePrice === 0) return 1;

  // Divide by the average of both prices (not just sourcePrice) so a cheap
  // source product doesn't cause every candidate to collapse to score 0
  // from a small absolute price gap.
  const denominator = (sourcePrice + candidatePrice) / 2 || 1;
  const diff = Math.abs(candidatePrice - sourcePrice);
  return 1 - Math.min(diff / denominator, 1);
}

function calculateRatingScore(sourceRating, candidateRating) {
  // Relative to the source, not absolute. Equal ratings -> 0.5 (neutral).
  // A candidate needs to be meaningfully higher to push the score toward 1,
  // and meaningfully lower to push it toward 0. Max possible diff is 5,
  // so /10 keeps the whole thing in [0, 1].
  const diff = candidateRating - sourceRating;
  return Math.min(1, Math.max(0, 0.5 + diff / 10));
}

function buildExplainerTags(source, candidate) {
  const tags = ["Same Category"];
  if (candidate.price < source.price) tags.push("Lower Price");
  if (candidate.rating > source.rating) tags.push("Higher Rating");
  // Every surviving candidate is in stock by construction (see filter below).
  tags.push("In Stock");
  return tags;
}

/**
 * @param {number} minStockQty - candidates with less available quantity than
 *   this are dropped entirely, not down-scored. Defaults to 1 (any stock).
 */
export function recommend(
  source,
  candidates,
  inventoryMap,
  limit = 5,
  minStockQty = DEFAULT_MIN_STOCK_QTY
) {
  const scored = candidates
    // Category is already filtered at the DB query level in the controller;
    // this is just a safety net if `recommend` is ever called with a mixed list.
    .filter((candidate) => candidate.category === source.category)
    // HARD GATE: no stock, no recommendation. Not a score penalty.
    .filter((candidate) => {
      const qty = inventoryMap.get(candidate._id.toString()) ?? 0;
      return qty >= minStockQty;
    })
    .map((candidate) => {
      const qty = inventoryMap.get(candidate._id.toString()) ?? 0;
      const priceScore = calculatePriceScore(source.price, candidate.price);
      const ratingScore = calculateRatingScore(source.rating, candidate.rating);

      const finalScore = Number(
        (
          WEIGHTS.category +
          priceScore * WEIGHTS.price +
          ratingScore * WEIGHTS.rating
        ).toFixed(1)
      );

      return {
        product: candidate,
        score: finalScore,
        inventoryQty: qty,
        tags: buildExplainerTags(source, candidate),
      };
    });

  // No stock tie-breaker needed anymore — every candidate here is in stock.
  return scored.sort((a, b) => b.score - a.score).slice(0, limit);
}

export default recommend;