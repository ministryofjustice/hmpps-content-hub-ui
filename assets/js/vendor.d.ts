declare module 'govuk-frontend' {
  export function initAll(): void
}

declare module '@ministryofjustice/frontend' {
  export function initAll(): void
}

declare module '*/components/lazyLoading' {
  export function initAll(): void
}

declare module '*/components/feedbackWidget' {
  export default function initFeedbackWidget(): void
}

interface Window {
  gtag?: (...args: unknown[]) => void
}
