// Site-wide constants. Components read values from here so they carry no loose numbers.
export const COPYRIGHT_YEAR = 2026;
export const COPY_FLASH_MS = 1500;
export const FAVICON_SIZE = 128;

// Walkthrough replay pacing: per line stream cadence and the fleet log length.
export const WALKTHROUGH = {
  tickMs: 40,
  fleetTickMs: 40,
  fleetLines: 100,
};

// Homepage logo wall rotation: fixed slots cycle through the full catalog,
// staggered so the row never blinks at once. Paused on hover; static under
// reduced motion.
export const LOGO_ROTATION = {
  slots: 4,
  visibleMs: 3500,
  fadeMs: 500,
  staggerMs: 90,
};

// Worlds whose favicons are black or near-black and disappear on the black
// background; the homepage logo wall skips them.
export const WALL_EXCLUDED_IDS = ["github", "square", "kustomer", "linear", "ups", "uber"];

// Hero point-cloud Earth. Desktop tracks the cursor; coarse pointers get a
// smaller, auto-rotating globe with fewer points. `candidates` are sampled on
// the sphere and kept densely on land, sparsely on ocean.
export const SPHERE = {
  size: 680,
  mobileSize: 400,
  candidates: 14000,
  mobileCandidates: 7000,
  oceanKeep: 0.12,
  radiusRatio: 0.72,
  spinPerFrame: 0.0022,
  easing: 0.045,
};
