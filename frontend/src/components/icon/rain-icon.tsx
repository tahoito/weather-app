type Props = {
  className?: string;
};

export function RainIcon({ className }: Props) {
  return (
    <svg
      width="19"
      height="17"
      viewBox="0 0 19 17"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M5.07141 13.1284L3.22729 16.0001M7.49181 13.1284L5.6477 16.0001M9.91221 13.1284L8.0681 16.0001M12.3326 13.1284L10.4885 16.0001M14.753 13.1284L12.9089 16.0001"
        stroke="#439DEC"
        strokeWidth={0.5}
        strokeLinecap="round"
      />
      <path
        d="M15.9745 12.3594H2.864C-2.01816 11.2817 -0.202849 3.69221 4.881 4.97483C5.88958 -2.61457 17.5882 -0.973728 15.9745 6.20548C20.0085 6.20548 20.0085 12.3594 15.9745 12.3594Z"
        fill="#B7C3D0"
      />
    </svg>
  );
}
