/**
 * animationConfig.js
 * Centralized animation constants for the NextGen Interiors website
 * Ensures consistent motion design across all components
 * Based on premium design principles (Apple, Studio Freight, Locomotive)
 */

// Duration constants (in milliseconds)
export const DURATIONS = {
  QUICK: 300,           // Quick micro-interactions
  STANDARD: 600,        // Standard transitions and hovers
  MEDIUM: 900,          // Section reveals and medium animations
  SLOW: 1200,           // Image zooms and large transitions
  SCROLL_MOMENTUM: 1400, // Lenis smooth scroll momentum
  EXTENDED: 1800,       // Complex multi-step animations
};

// Premium easing functions (cubic-bezier format)
export const EASING = {
  // Main easing - smooth, elegant, premium feel
  PRIMARY: [0.22, 1, 0.36, 1],      // Used for primary transitions
  
  // Secondary easing - slightly more energetic
  SECONDARY: [0.23, 1, 0.32, 1],   // Used for complementary animations
  
  // Emphasis easing - strong ease-out
  EMPHASIS: [0.77, 0, 0.18, 1],    // Used for emphasis animations
  
  // Subtle easing - very smooth
  SUBTLE: [0.25, 0.46, 0.45, 0.94], // Used for subtle transitions
  
  // Spring-like easing
  SPRING: [0.34, 1.56, 0.64, 1],   // Bouncy, energetic
};

// Standard easing function for JS-based animations
export const EASING_FUNCTIONS = {
  // Exponential ease-out (used by Lenis)
  exponentialEaseOut: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  
  // Cubic ease-out
  cubicEaseOut: (t) => 1 - Math.pow(1 - t, 3),
  
  // Quadratic ease-out
  quadraticEaseOut: (t) => 1 - (1 - t) * (1 - t),
  
  // Linear (no easing)
  linear: (t) => t,
};

// Scroll animation margins (triggers when element is X pixels from viewport)
export const SCROLL_MARGINS = {
  EARLY: -150,      // Triggers 150px before element enters
  STANDARD: -80,    // Triggers 80px before element enters
  LATE: -30,        // Triggers just as element enters
  AT_CENTER: 0,     // Triggers at center of viewport
};

// Stagger delays for sequential animations
export const STAGGER = {
  TIGHT: 0.04,      // Very tight stagger for word reveals
  STANDARD: 0.08,   // Standard stagger for list items
  RELAXED: 0.12,    // Relaxed stagger for cards
  LOOSE: 0.2,       // Loose stagger for major sections
};

// Scale animations
export const SCALE = {
  MICRO: 0.98,      // Subtle scale for micro-interactions
  SLIGHT: 1.02,     // Slight scale for hover effects
  MEDIUM: 1.06,     // Medium scale for image zooms
  LARGE: 1.15,      // Large scale for hero parallax
};

// Opacity animations (fade in/out)
export const OPACITY = {
  HIDDEN: 0,
  ALMOST_HIDDEN: 0.1,
  FADED: 0.5,
  BRIGHT: 1,
};

// Standard animation variants for Framer Motion
export const VARIANTS = {
  // Simple fade in
  fadeIn: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  },

  // Fade in with upward reveal
  revealUp: {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0 },
  },

  // Fade in with slight scale
  scaleUp: {
    hidden: { opacity: 0, scale: 0.98 },
    visible: { opacity: 1, scale: 1 },
  },

  // Fade in from side
  slideIn: {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
  },

  // Blur in reveal
  blurIn: {
    hidden: { opacity: 0, filter: "blur(10px)" },
    visible: { opacity: 1, filter: "blur(0px)" },
  },
};

// Transition configs for Framer Motion
export const TRANSITIONS = {
  // Quick interaction
  quick: { duration: DURATIONS.QUICK / 1000, ease: EASING.PRIMARY },
  
  // Standard transition
  standard: { duration: DURATIONS.STANDARD / 1000, ease: EASING.PRIMARY },
  
  // Medium transition
  medium: { duration: DURATIONS.MEDIUM / 1000, ease: EASING.PRIMARY },
  
  // Slow transition
  slow: { duration: DURATIONS.SLOW / 1000, ease: EASING.PRIMARY },
  
  // Extended transition
  extended: { duration: DURATIONS.EXTENDED / 1000, ease: EASING.PRIMARY },
  
  // Spring-based animation
  spring: { type: "spring", stiffness: 100, damping: 15 },
};

// WhileHover effects
export const WHILE_HOVER = {
  scale: { scale: SCALE.SLIGHT },
  lift: { scale: SCALE.SLIGHT, y: -4 },
  glow: { boxShadow: "0 20px 40px rgba(0, 0, 0, 0.15)" },
};

// WhileTap effects
export const WHILE_TAP = {
  scale: { scale: 0.98 },
};

// Export preset hover configurations
export const HOVER_CONFIGS = {
  // For buttons and interactive elements
  button: {
    whileHover: WHILE_HOVER.scale,
    whileTap: WHILE_TAP.scale,
    transition: TRANSITIONS.quick,
  },
  
  // For images
  image: {
    whileHover: { scale: SCALE.MEDIUM },
    transition: TRANSITIONS.standard,
  },
  
  // For cards
  card: {
    whileHover: WHILE_HOVER.lift,
    transition: TRANSITIONS.quick,
  },
};

// Scroll-triggered animation config
export const SCROLL_ANIMATION = {
  // Fade in on scroll
  fadeInScroll: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    viewport: { once: true, margin: `0px 0px ${SCROLL_MARGINS.STANDARD}px 0px` },
    transition: TRANSITIONS.standard,
  },
  
  // Reveal up on scroll
  revealUpScroll: {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0 },
    viewport: { once: true, margin: `0px 0px ${SCROLL_MARGINS.STANDARD}px 0px` },
    transition: TRANSITIONS.medium,
  },
  
  // Scale up on scroll
  scaleUpScroll: {
    hidden: { opacity: 0, scale: 0.98 },
    visible: { opacity: 1, scale: 1 },
    viewport: { once: true, margin: `0px 0px ${SCROLL_MARGINS.STANDARD}px 0px` },
    transition: TRANSITIONS.medium,
  },
};

export default {
  DURATIONS,
  EASING,
  EASING_FUNCTIONS,
  SCROLL_MARGINS,
  STAGGER,
  SCALE,
  OPACITY,
  VARIANTS,
  TRANSITIONS,
  WHILE_HOVER,
  WHILE_TAP,
  HOVER_CONFIGS,
  SCROLL_ANIMATION,
};
