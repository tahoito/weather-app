type Props = {
  className?: string;
};

export function CloudDrizzleIcon({ className }: Props) {
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
        d="M15 49L13 52M26 46L24 49M11 55L9 58M22 52L20 55M18 58L16 61M32.9999 49L30.9999 52M28.9999 55L27 58M44 46L42 49M40 52L38 55M36 58L34 61M51 49L49 52M47 55L45 58"
        stroke="#439DEC"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
