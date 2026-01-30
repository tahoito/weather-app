// components/Modal.tsx
import { useState, useEffect, ReactNode } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  showOverlay?: boolean;
}

export default function Modal({
  isOpen,
  onClose,
  children,
  showOverlay = true,
}: ModalProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [shouldAnimate, setShouldAnimate] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      // DOMに追加された後にアニメーションを開始
      setTimeout(() => setShouldAnimate(true), 10);
    } else {
      setShouldAnimate(false);
      const timer = setTimeout(() => setIsVisible(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      {/* オーバーレイ */}
      {showOverlay && (
        <div
          className={`absolute inset-0 bg-black transition-opacity duration-300 ${
            shouldAnimate ? "opacity-50" : "opacity-0"
          }`}
          onClick={onClose}
        />
      )}

      {/* モーダルコンテンツ */}
      <div
        className={`relative w-full max-w-lg bg-back rounded-t-2xl shadow-xl transition-transform duration-300 ${
          shouldAnimate ? "translate-y-0" : "translate-y-full"
        }`}
      >
        {children}
      </div>
    </div>
  );
}
