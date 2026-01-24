type Props = {
  className?: string;
};

export function CloudIcon({ className }: Props) {
  return (
    <svg
      width="64"
      height="64"
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M53.8088 52H9.64717C-6.79801 48.5122 -0.683281 23.9495 16.4413 28.1005C19.8386 3.53819 59.2444 8.84863 53.8088 32.0834C67.3971 32.0834 67.3971 52 53.8088 52Z"
        fill="#9CA3AF"
      />
    </svg>
  );
}
