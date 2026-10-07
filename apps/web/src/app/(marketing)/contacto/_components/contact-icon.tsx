type IconName =
  'mail' | 'chat' | 'pin' | 'calendar' | 'send' | 'gem' | 'clock' | 'heart' | 'team' | 'leaf';

const paths: Record<IconName, string> = {
  mail: 'M3 5h18v14H3z M3 6l9 7 9-7',
  chat: 'M20 10a7 7 0 0 1-7 7H9l-5 3 1-5a7 7 0 1 1 15-5 M16 4a7 7 0 0 1 5 12l1 5-4-2',
  pin: 'M12 22 5 12a8 8 0 1 1 14 0z M12 5a3 3 0 1 0 0 6 3 3 0 0 0 0-6',
  calendar: 'M3 5h18v16H3z M3 10h18 M7 2v6 M17 2v6 M7 14h2 M12 14h2 M17 14h1 M7 18h2 M12 18h2',
  send: 'm3 11 18-8-7 18-3-7z M11 14 21 3',
  gem: 'm3 8 4-5h10l4 5-9 13z M3 8h18 M7 3l5 18 5-18',
  clock: 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20 M12 6v7h5',
  heart: 'M12 21 3 12a5 5 0 0 1 9-7 5 5 0 0 1 9 7z',
  team: 'M9 3a3 3 0 1 0 0 6 3 3 0 0 0 0-6 M17 5a3 3 0 1 0 0 6 3 3 0 0 0 0-6 M2 21v-4a7 7 0 0 1 14 0v4z M16 13a5 5 0 0 1 6 5v3h-4',
  leaf: 'M12 22V10 M12 16C3 16 3 8 3 8c8 0 9 8 9 8 M12 11c0-8 8-9 8-9 0 9-8 9-8 9 M12 21c0-7 9-7 9-7-1 7-9 7-9 7',
};

export function ContactIcon({
  name,
  className = '',
}: Readonly<{ name: IconName; className?: string }>) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.25"
      viewBox="0 0 24 24"
    >
      <path d={paths[name]} />
    </svg>
  );
}

export function SocialIcon({ name }: Readonly<{ name: 'instagram' | 'pinterest' | 'facebook' }>) {
  return (
    <svg aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.4" viewBox="0 0 24 24">
      {name === 'instagram' ? (
        <>
          <rect height="16" rx="5" width="16" x="4" y="4" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17" cy="7" fill="currentColor" r=".8" stroke="none" />
        </>
      ) : name === 'facebook' ? (
        <path d="M14 22V12h4l.5-4H14V6c0-2 1-3 4-2V1c-6-1-8 1-8 5v2H7v4h3v10" />
      ) : (
        <path d="m9 22 3-14 M10 17c-4-1-5-4-4-8 1-7 13-8 13 0 0 8-9 9-7 1" />
      )}
    </svg>
  );
}
