type Props = {
  className?: string;
};

export function MapPinSimpleIcon({ className }: Props) {
  return (
    <svg
      width="8"
      height="15"
      viewBox="0 0 8 15"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M4 7.5V14" stroke="#222222" strokeLinecap="round" />
      <path
        d="M3.96621 0C1.0421 0 0 2.38655 0 3.86555C0 5.24398 0.766914 8 3.96621 8C7.1655 8 7.97594 5.31092 7.99964 3.86555C8.02333 2.42017 6.89031 0 3.96621 0Z"
        fill="#E94B4B"
      />
    </svg>
  );
}
