export type PricingLineIconName =
  'crown' | 'diamond' | 'heart' | 'infinity' | 'leaf' | 'phone' | 'shield';

export function PricingLineIcon({ name }: Readonly<{ name: PricingLineIconName }>) {
  if (name === 'diamond') {
    return (
      <svg aria-hidden="true" fill="none" viewBox="0 0 24 24">
        <path d="m3.2 8 3.3-4h11L20.8 8 12 20.2 3.2 8Z" stroke="currentColor" strokeWidth="1.35" />
        <path
          d="M3.5 8h17M7 8l5 12 5-12M6.5 4 9 8l3-4 3 4 2.5-4"
          stroke="currentColor"
          strokeWidth="1.35"
        />
      </svg>
    );
  }

  if (name === 'crown') {
    return (
      <svg aria-hidden="true" fill="none" viewBox="0 0 24 24">
        <path
          d="m3.5 7.2 4.7 3.4L12 4l3.8 6.6 4.7-3.4-1.7 9.1H5.2L3.5 7.2Z"
          stroke="currentColor"
          strokeWidth="1.35"
        />
        <path d="M5.2 19h13.6" stroke="currentColor" strokeWidth="1.35" />
      </svg>
    );
  }

  if (name === 'heart') {
    return (
      <svg aria-hidden="true" fill="none" viewBox="0 0 24 24">
        <path
          d="M20.6 5.8c-1.7-2.2-5-2.2-6.7 0L12 8.3l-1.9-2.5c-1.7-2.2-5-2.2-6.7 0-2.2 2.8-.2 6 1.7 7.8l6.9 6.2 6.9-6.2c1.9-1.8 3.9-5 1.7-7.8Z"
          stroke="currentColor"
          strokeWidth="1.35"
        />
      </svg>
    );
  }

  if (name === 'infinity') {
    return (
      <svg aria-hidden="true" fill="none" viewBox="0 0 24 24">
        <path
          d="M7.2 7.3c3.1 0 4.8 4.7 6.8 7.1 1.8 2.1 5.4 1.7 6.3-.9 1.1-3.2-1.2-6.2-4.1-6.2-3.2 0-5.1 4.7-7.1 7.1-1.8 2.1-5.4 1.7-6.3-.9-1.1-3.2 1.3-6.2 4.4-6.2Z"
          stroke="currentColor"
          strokeWidth="1.35"
        />
      </svg>
    );
  }

  if (name === 'phone') {
    return (
      <svg aria-hidden="true" fill="none" viewBox="0 0 24 24">
        <rect
          height="19"
          rx="2.2"
          stroke="currentColor"
          strokeWidth="1.35"
          width="12"
          x="6"
          y="2.5"
        />
        <path d="M9 5h6M10.5 18.5h3" stroke="currentColor" strokeWidth="1.35" />
      </svg>
    );
  }

  if (name === 'shield') {
    return (
      <svg aria-hidden="true" fill="none" viewBox="0 0 24 24">
        <path
          d="M12 2.8 20 6v5.6c0 4.8-3.2 8.1-8 9.6-4.8-1.5-8-4.8-8-9.6V6l8-3.2Z"
          stroke="currentColor"
          strokeWidth="1.35"
        />
        <path d="m8.5 12 2.2 2.2 4.8-5" stroke="currentColor" strokeWidth="1.35" />
      </svg>
    );
  }

  return (
    <svg aria-hidden="true" fill="none" viewBox="0 0 24 24">
      <path
        d="M5 19c5.7-1.7 10-6.3 13.6-14.5M7.1 15.8c-1.9-.2-3.2-1-4.1-2.4 2.2-.6 4-.2 5.3 1M11 11.4C9.6 10.1 9 8.7 9.2 7c2 .8 3.2 2.1 3.4 3.9M14.5 7.5c-.5-1.8-.2-3.3.9-4.6 1.2 1.8 1.3 3.5.3 5.1M12.9 9.7c1.8-.6 3.3-.3 4.6.8-1.8 1.2-3.6 1.2-5.1.2"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.35"
      />
    </svg>
  );
}
