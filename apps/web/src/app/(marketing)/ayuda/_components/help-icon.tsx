type HelpIconName = 'document' | 'edit' | 'payment' | 'send' | 'search' | 'chat' | 'mail' | 'phone';

const paths: Record<HelpIconName, string> = {
  document: 'M7 3h7l4 4v14H7z M14 3v5h4 M10 12h5 M10 16h5',
  edit: 'm4 17 1 4 4-1L21 8l-5-5z M13 6l5 5 M4 21h17',
  payment: 'M3 6h18v13H3z M3 10h18 M6 15h4',
  send: 'm3 11 18-8-7 18-3-7z M11 14 21 3',
  search: 'M10 3a7 7 0 1 0 0 14 7 7 0 0 0 0-14 M15 15l6 6',
  chat: 'M21 11a9 8 0 0 1-9 8H8l-5 3 1-6a8 8 0 0 1-1-5 9 8 0 0 1 18 0 M8 11h.1 M12 11h.1 M16 11h.1',
  mail: 'M3 5h18v14H3z M3 6l9 7 9-7',
  phone: 'M6 3l4 4-2 3c2 3 3 4 6 6l3-2 4 4-2 3C10 23 1 14 3 5z',
};

export function HelpIcon({
  name,
  className = '',
}: Readonly<{ name: HelpIconName; className?: string }>) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.4"
      viewBox="0 0 24 24"
    >
      <path d={paths[name]} />
    </svg>
  );
}
