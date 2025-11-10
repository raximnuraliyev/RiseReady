declare module 'framer-motion' {
  interface Transition {
    // Allow tuple-based cubic-bezier definitions like [0.22, 1, 0.36, 1]
    ease?: number[] | string | ((t: number) => number)
  }
}