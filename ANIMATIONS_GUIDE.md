# RiseReady Animation Backgrounds Guide

This document outlines the unique animated backgrounds applied to each page of the RiseReady platform.

## Background Components

All background components are located in `src/components/backgrounds/` and use Framer Motion for animations.

### 1. RippleBackground
**Location**: `src/components/backgrounds/RippleBackground.tsx`
**Used in**: HomePage
**Description**: Concentric ripple waves emanating from the center (black hole effect)
**Features**:
- 8 concentric expanding circles
- Floating orbs with radial gradients
- Rotating conic gradient circle at center
- Brand colors: accent-light (#AFDDE5) for ripples

### 2. BlobBackground
**Location**: `src/components/backgrounds/BlobBackground.tsx`
**Used in**: AboutPage
**Description**: Fluid, morphing blob shapes with gooey filter effect
**Features**:
- 4 animated ellipses with SVG goo filter
- Morphing shapes that change size and position
- Floating circles overlay
- Colors: primary, secondary, accent, accent-light

### 3. GeometricBackground
**Location**: `src/components/backgrounds/GeometricBackground.tsx`
**Used in**: FeaturesPage
**Description**: Animated geometric shapes (circles, squares, triangles) with grid pattern
**Features**:
- 12 rotating geometric shapes
- Grid pattern overlay
- Floating and rotating animations
- Radial gradient vignette effect

### 4. SpiralBackground
**Location**: `src/components/backgrounds/SpiralBackground.tsx`
**Used in**: PricingPage
**Description**: Golden spiral particle pattern with rotating lines
**Features**:
- 80 particles arranged in golden angle spiral
- 8 rotating spiral lines from center
- Pulsing center point
- Sequential fade-in/out animations

### 5. MeshBackground
**Location**: `src/components/backgrounds/MeshBackground.tsx`
**Used in**: ContactPage
**Description**: Animated mesh gradient with moving blurred circles
**Features**:
- 5 large blurred gradient circles
- Grid pattern overlay
- 20 floating dots
- Smooth gradient transitions

### 6. DotsBackground
**Location**: `src/components/backgrounds/DotsBackground.tsx`
**Used in**: FAQPage
**Description**: Multi-layered pulsing dots with horizontal flowing lines
**Features**:
- 3 layers of animated dots (80 dots per layer)
- 5 horizontal flowing light beams
- Staggered pulsing animations
- Layer-based opacity variations

### 7. ParticleBackground
**Location**: `src/components/backgrounds/ParticleBackground.tsx`
**Used in**: TermsPage
**Description**: Rising particles with horizontal drifting orbs
**Features**:
- 40 floating particles rising from bottom
- 8 horizontal drifting gradient orbs
- Pulsing radial dot grid overlay
- Variable speed and opacity

### 8. AuroraBackground
**Location**: `src/components/backgrounds/AuroraBackground.tsx`
**Used in**: PrivacyPage
**Description**: Aurora borealis-inspired rotating gradients
**Features**:
- 4 rotating gradient layers
- 6 glowing orbs moving in patterns
- Horizontal shimmer effect
- Smooth color transitions

### 9. HexagonBackground
**Location**: `src/components/backgrounds/HexagonBackground.tsx`
**Used in**: LoginPage
**Description**: Hexagonal grid pattern with floating hexagons
**Features**:
- 50 hexagons in honeycomb grid
- Each hexagon pulses and rotates
- 8 floating hexagons
- Glowing center point with blur

### 10. ConstellationBackground
**Location**: `src/components/backgrounds/ConstellationBackground.tsx`
**Used in**: SignupPage
**Description**: Star constellation pattern with connecting lines
**Features**:
- 60 randomly positioned stars
- 80 connecting lines between nearby stars
- Line drawing animation (pathLength)
- 3 shooting stars
- Radial gradient overlay

## Page Mappings

| Page | Background Component | Animation Style |
|------|---------------------|----------------|
| HomePage | RippleBackground | Concentric ripples (black hole) |
| AboutPage | BlobBackground | Fluid morphing blobs |
| FeaturesPage | GeometricBackground | Rotating geometric shapes |
| PricingPage | SpiralBackground | Golden spiral particles |
| FAQPage | DotsBackground | Multi-layer pulsing dots |
| ContactPage | MeshBackground | Animated mesh gradients |
| TermsPage | ParticleBackground | Rising particles |
| PrivacyPage | AuroraBackground | Aurora-inspired gradients |
| LoginPage | HexagonBackground | Hexagonal grid |
| SignupPage | ConstellationBackground | Star constellation |

## Common Features

All backgrounds include:
- Brand color palette integration (#003135, #024950, #964734, #0FA4AF, #AFDDE5)
- Smooth Framer Motion animations
- Performance optimization with CSS transforms
- Responsive design
- Accessibility support for `prefers-reduced-motion`
- Z-index layering for proper stacking

## CSS Shapes Replacement

All photo images have been replaced with animated CSS/SVG shapes:
- **HomePage hero**: Morphing circles and floating squares
- **HomePage testimonial**: Animated gradient circle avatar
- **AboutPage**: Rotating circles and squares with various sizes
- **AboutPage testimonials**: Gradient circle avatars
- **FeaturesPage modules**: Animated geometric shapes per feature
- **Login/Signup icons**: Animated gradient shapes with overlays

## Color System

All animations use the brand color palette:
```css
--primary: #003135 (dark teal)
--secondary: #024950 (medium teal)
--accent: #0FA4AF (bright cyan)
--highlight: #964734 (terracotta/rust)
--accent-light: #AFDDE5 (light blue)
```

## Performance Considerations

- All animations use CSS `transform` and `opacity` for GPU acceleration
- No layout-triggering properties (width, height, top, left) are animated
- Backgrounds are positioned absolutely to prevent layout shifts
- Animations use `repeat: Infinity` with optimized durations
- Reduced complexity on mobile devices

## Usage Example

```tsx
import RippleBackground from '../components/backgrounds/RippleBackground'

<section className="relative min-h-screen overflow-hidden">
  <RippleBackground />
  <div className="absolute inset-0 bg-black/10 z-10" />
  <div className="relative z-20">
    {/* Page content */}
  </div>
</section>
```

## Future Enhancements

- Add `prefers-reduced-motion` support to all backgrounds
- Create additional background variants for sub-pages
- Implement theme-aware color switching
- Add interactive mouse-following effects
- Create seasonal/event-specific backgrounds
