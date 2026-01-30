type Props = {
  className?: string;
};

export function SunnyIcon({ className }: Props) {
  return (
    <svg
      viewBox="0 0 66 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M57.8566 62H24.7354C12.4015 59.3842 16.9875 40.9621 29.831 44.0754C32.3789 25.6536 61.9333 29.6365 57.8566 47.0626C68.0478 47.0626 68.0478 62 57.8566 62Z"
        fill="#9CA3AF"
      />
      <path
        d="M26.3564 12C13.9289 12 9.5 22.1429 9.5 28.4286C9.5 34.2869 12.7594 46 26.3564 46C39.9534 46 43.3978 34.5714 43.4985 28.4286C43.5991 22.2857 38.7838 12 26.3564 12Z"
        fill="#F3F3F3"
      />
      <path
        d="M26.5 54.4853L26.5166 46"
        stroke="#F3F3F3"
        strokeWidth={8}
        strokeLinecap="round"
      />
      <path
        d="M44.5 47L38.5 41"
        stroke="#F3F3F3"
        strokeWidth={8}
        strokeLinecap="round"
      />
      <path
        d="M51.5 28.5H44"
        stroke="#F3F3F3"
        strokeWidth={8}
        strokeLinecap="round"
      />
      <path
        d="M26.3817 15C16.1474 15 12.5 23.3529 12.5 28.5294C12.5 33.3539 15.1842 43 26.3817 43C37.5792 43 40.4158 33.5882 40.4987 28.5294C40.5816 23.4706 36.6161 15 26.3817 15Z"
        fill="#F7A531"
      />
      <path
        d="M39.0632 16.687L44.1393 11.6933M8.98705 46.4315L13.9363 41.3139M39.0632 41.3139L44.3931 46.7865M8.35254 11.2144L13.9363 16.687"
        stroke="#F7A531"
        strokeWidth={3}
        strokeLinecap="round"
      />
      <path
        d="M26.5 11.7115V4M26.5 54V46.2886M44.1396 28.6094H51.5M1.5 28.6094L8.86041 28.6094"
        stroke="#F7A531"
        strokeWidth={3}
        strokeLinecap="round"
      />
    </svg>
  );
}
