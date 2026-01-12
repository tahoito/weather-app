type Props = {
  className?: string;
};

export function MapPinSimpleIcon({ className }: Props) {
  return (
    <svg viewBox="6 3 12 18" className={className} fill="none">
      {/* 丸（赤・塗りつぶし） */}
      <circle cx="12" cy="8" r="4" fill="var(--color-favorite)" />

      {/* 線（黒） */}
      <path
        d="M12 11 v7"
        stroke="var(--color-fg)"
        strokeWidth="1"
        strokeLinecap="round"
      />
    </svg>
  );
}
