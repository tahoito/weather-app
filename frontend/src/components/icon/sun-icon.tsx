type Props = {
  className?: string;
};

export function SunIcon({ className }: Props) {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 17 17"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M8.46621 4.5C5.5421 4.5 4.5 6.88655 4.5 8.36555C4.5 9.74398 5.26691 12.5 8.46621 12.5C11.6655 12.5 12.4759 9.81092 12.4996 8.36555C12.5233 6.92017 11.3903 4.5 8.46621 4.5Z"
        fill="#F7A531"
      />
      <path
        d="M12.2767 4.56579L13.9011 2.9678M2.65234 14.0781L4.2361 12.4404M12.5204 12.4404L14.2259 14.1917M2.69295 2.80859L4.47976 4.55984"
        stroke="#F7A531"
        strokeLinecap="round"
      />
      <path
        d="M8.45939 2.96767V0.5M8.45939 16.5V14.0323M14.1447 8.34081H16.5M0.5 8.3408L2.85533 8.34081"
        stroke="#F7A531"
        strokeLinecap="round"
      />
    </svg>
  );
}
