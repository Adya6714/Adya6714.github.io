/* Site settings, Part D9. */
window.SITE_CONFIG = {
  RESUME_URL: "assets/Resume_Adya_Srivastava.pdf",
  PHOTO_URL: "assets/photo.jpg",
  LEETCODE_URL: "", // paste public LeetCode profile URL; Library hides the card when empty
  // Formspree free plan: https://formspree.io/f/<id>, or FormSubmit (activate via email once):
  SUGGESTION_ENDPOINT: "https://formsubmit.co/ajax/srivastavadya@gmail.com",
  // After `npx wrangler deploy` in /worker, paste the Worker URL ending in /ask:
  GUARDIAN_API: "" // e.g. "https://adya-guardian.<you>.workers.dev/ask"
};
window.ASSETS = {
  plate3x: "assets/scene/plate_3x.webp", // 2544 × 3792
  plate4x: "assets/scene/plate_4x.webp", // 3392 × 5056
  platePlaceholder: "assets/scene/plate_placeholder.webp", // ~400px wide, shown while the full plate loads
  plate: "assets/scene/plate_3x.webp", // fallback alias
  flow:  "assets/scene/flow.png",   // R,G = flow direction, B = water mask
  foam:  "assets/scene/foam.png"    // where white water churns
};
