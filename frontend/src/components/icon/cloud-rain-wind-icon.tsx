type Props = {
  className?: string;
};

export function CloudRainWindIcon({ className }: Props) {
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
        d="M53.8088 44H9.64717C-6.79801 40.5122 -0.683281 15.9495 16.4413 20.1005C19.8386 -4.46181 59.2444 0.848626 53.8088 24.0834C67.3971 24.0834 67.3971 44 53.8088 44Z"
        fill="#9CA3AF"
      />
      <path
        d="M12 48L4 60M18 48L14 54M24 48L16 60M30 48L24 57M36 48L28 60M42 48L38 54M48 48L40 60M54 48L48 57"
        stroke="#439DEC"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
