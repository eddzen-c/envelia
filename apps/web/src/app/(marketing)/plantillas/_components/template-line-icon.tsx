export type TemplateLineIconName =
  | 'briefcase'
  | 'cake'
  | 'cross'
  | 'crown'
  | 'diamond'
  | 'dove'
  | 'grid'
  | 'heart'
  | 'monitor'
  | 'rings';

type TemplateLineIconProps = Readonly<{
  className?: string;
  name: TemplateLineIconName;
}>;

const IconPaths = ({ name }: Readonly<{ name: TemplateLineIconName }>) => {
  if (name === 'grid') {
    return <path d="M4 4h6v6H4V4Zm10 0h6v6h-6V4ZM4 14h6v6H4v-6Zm10 0h6v6h-6v-6Z" />;
  }

  if (name === 'rings') {
    return (
      <>
        <circle cx="9" cy="12" r="6" />
        <circle cx="15" cy="12" r="6" />
      </>
    );
  }

  if (name === 'crown') {
    return <path d="m3 7 5 4 4-7 4 7 5-4-2 12H5L3 7Zm3 9h12" />;
  }

  if (name === 'cake') {
    return (
      <path d="M5 11h14v9H5v-9Zm-2 9h18M8 11V8m4 3V8m4 3V8M7 6c0-1 1-2 1-3 1 1 1 2 1 3a1 1 0 0 1-2 0Zm4 0c0-1 1-2 1-3 1 1 1 2 1 3a1 1 0 0 1-2 0Zm4 0c0-1 1-2 1-3 1 1 1 2 1 3a1 1 0 0 1-2 0Z" />
    );
  }

  if (name === 'dove') {
    return (
      <path d="M4 15c5 1 8-1 9-5-3 1-5 0-7-2 1 5 4 8 9 9 3 .6 5-.5 6-3-2 1-4 1-6 0m-2-4 5-5m-1 6 4-1" />
    );
  }

  if (name === 'cross') {
    return <path d="M12 3v18M7 8h10" />;
  }

  if (name === 'briefcase') {
    return <path d="M4 8h16v11H4V8Zm5 0V5h6v3M4 12h16M10 12v2h4v-2" />;
  }

  if (name === 'heart') {
    return (
      <path d="M12 20.5S4 15.4 4 9.4A4.4 4.4 0 0 1 12 7a4.4 4.4 0 0 1 8 2.4c0 6-8 11.1-8 11.1Z" />
    );
  }

  if (name === 'diamond') {
    return <path d="m4 8 3-4h10l3 4-8 12L4 8Zm0 0h16M9 4l-2 4 5 12 5-12-2-4" />;
  }

  return <path d="M3 4h18v13H3V4Zm6 16h6m-3-3v3M7 8h10" />;
};

export function TemplateLineIcon({ className = 'size-5', name }: TemplateLineIconProps) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
      viewBox="0 0 24 24"
    >
      <IconPaths name={name} />
    </svg>
  );
}
