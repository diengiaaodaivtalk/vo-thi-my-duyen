"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import {
  X,
  ZoomIn,
  ZoomOut,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
} from "lucide-react";

interface CertificateLightboxItem {
  id?: string;
  img: string;
}

interface CertificateLightboxProps {
  items: CertificateLightboxItem[];
  index: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

const MIN_SCALE = 1;
const MAX_SCALE = 4;

export function CertificateLightbox({
  items,
  index,
  onClose,
  onNavigate,
}: CertificateLightboxProps) {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);

  const dragState = useRef<{
    startX: number;
    startY: number;
    originX: number;
    originY: number;
  } | null>(null);

  const item = items[index];

  const resetView = useCallback(() => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  }, []);

  const handleNavigate = useCallback(
    (newIndex: number) => {
      resetView();
      onNavigate(newIndex);
    },
    [onNavigate, resetView],
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft")
        handleNavigate((index - 1 + items.length) % items.length);
      if (e.key === "ArrowRight") handleNavigate((index + 1) % items.length);
    };
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [onClose, handleNavigate, index, items.length]);

  const zoomIn = () => setScale((prev) => Math.min(MAX_SCALE, prev + 0.5));
  const zoomOut = () =>
    setScale((prev) => {
      const next = Math.max(MIN_SCALE, prev - 0.5);
      if (next === MIN_SCALE) setPosition({ x: 0, y: 0 });
      return next;
    });

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    if (e.deltaY < 0) zoomIn();
    else zoomOut();
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    if (scale <= MIN_SCALE) return;
    setIsDragging(true);
    dragState.current = {
      startX: e.clientX,
      startY: e.clientY,
      originX: position.x,
      originY: position.y,
    };
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging || !dragState.current) return;
    const deltaX = e.clientX - dragState.current.startX;
    const deltaY = e.clientY - dragState.current.startY;
    setPosition({
      x: dragState.current.originX + deltaX,
      y: dragState.current.originY + deltaY,
    });
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  const handleDoubleClick = () => {
    if (scale > MIN_SCALE) resetView();
    else setScale(2);
  };

  if (!item) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/90 flex flex-col"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="flex items-center justify-between px-4 py-3 sm:px-6">
        <span className="text-white/70 text-sm">
          {index + 1} / {items.length}
        </span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={zoomOut}
            disabled={scale <= MIN_SCALE}
            aria-label="Zoom out"
            className="size-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
          >
            <ZoomOut size={18} />
          </button>
          <button
            type="button"
            onClick={zoomIn}
            disabled={scale >= MAX_SCALE}
            aria-label="Zoom in"
            className="size-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
          >
            <ZoomIn size={18} />
          </button>
          <button
            type="button"
            onClick={resetView}
            disabled={scale === MIN_SCALE}
            aria-label="Reset view"
            className="size-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
          >
            <RotateCcw size={16} />
          </button>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="size-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      <div
        className="relative flex-1 overflow-hidden select-none"
        onWheel={handleWheel}
        onDoubleClick={handleDoubleClick}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        style={{ cursor: scale > MIN_SCALE ? "grab" : "default" }}
      >
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{
            transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
            transition: isDragging ? "none" : "transform 150ms ease-out",
          }}
        >
          <div className="relative w-[80vw] h-[70vh] sm:w-[70vw] sm:h-[75vh]">
            <Image
              src={item.img}
              alt="Certificate"
              fill
              className="object-contain pointer-events-none"
              sizes="80vw"
              priority
            />
          </div>
        </div>
      </div>

      {items.length > 1 && (
        <>
          <button
            type="button"
            onClick={() =>
              handleNavigate((index - 1 + items.length) % items.length)
            }
            aria-label="Previous image"
            className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 size-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            type="button"
            onClick={() => handleNavigate((index + 1) % items.length)}
            aria-label="Next image"
            className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 size-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer"
          >
            <ChevronRight size={20} />
          </button>
        </>
      )}
    </div>
  );
}
