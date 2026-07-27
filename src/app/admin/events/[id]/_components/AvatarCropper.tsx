"use client";

import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";

interface AvatarCropperProps {
  file: File;
  onCancel: () => void;
  onConfirm: (blob: Blob) => void;
}

const VIEWPORT = 280;
const OUTPUT_SIZE = 500;

export function AvatarCropper({
  file,
  onCancel,
  onConfirm,
}: AvatarCropperProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const dragState = useRef<{
    startX: number;
    startY: number;
    origin: { x: number; y: number };
  } | null>(null);
  const [baseScale, setBaseScale] = useState(1);

  useEffect(() => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      imgRef.current = img;
      const scale = Math.max(VIEWPORT / img.width, VIEWPORT / img.height);
      setBaseScale(scale);
      setOffset({ x: 0, y: 0 });
      setZoom(1);
    };
    img.src = url;
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const draw = () => {
    const canvas = canvasRef.current;
    const img = imgRef.current;
    if (!canvas || !img) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    canvas.width = VIEWPORT;
    canvas.height = VIEWPORT;
    ctx.clearRect(0, 0, VIEWPORT, VIEWPORT);

    const scale = baseScale * zoom;
    const w = img.width * scale;
    const h = img.height * scale;
    const x = (VIEWPORT - w) / 2 + offset.x;
    const y = (VIEWPORT - h) / 2 + offset.y;

    ctx.drawImage(img, x, y, w, h);

    ctx.save();
    ctx.globalCompositeOperation = "destination-in";
    ctx.beginPath();
    ctx.arc(VIEWPORT / 2, VIEWPORT / 2, VIEWPORT / 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  };

  useEffect(() => {
    draw();
  });

  const handlePointerDown = (e: React.PointerEvent) => {
    dragState.current = {
      startX: e.clientX,
      startY: e.clientY,
      origin: { ...offset },
    };
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!dragState.current) return;
    const dx = e.clientX - dragState.current.startX;
    const dy = e.clientY - dragState.current.startY;
    setOffset({
      x: dragState.current.origin.x + dx,
      y: dragState.current.origin.y + dy,
    });
  };

  const handlePointerUp = () => {
    dragState.current = null;
  };

  const handleConfirm = () => {
    const img = imgRef.current;
    if (!img) return;
    const outputCanvas = document.createElement("canvas");
    outputCanvas.width = OUTPUT_SIZE;
    outputCanvas.height = OUTPUT_SIZE;
    const ctx = outputCanvas.getContext("2d");
    if (!ctx) return;

    const ratio = OUTPUT_SIZE / VIEWPORT;
    const scale = baseScale * zoom * ratio;
    const w = img.width * scale;
    const h = img.height * scale;
    const x = (OUTPUT_SIZE - w) / 2 + offset.x * ratio;
    const y = (OUTPUT_SIZE - h) / 2 + offset.y * ratio;

    ctx.beginPath();
    ctx.arc(OUTPUT_SIZE / 2, OUTPUT_SIZE / 2, OUTPUT_SIZE / 2, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(img, x, y, w, h);

    outputCanvas.toBlob(
      (blob) => {
        if (blob) onConfirm(blob);
      },
      "image/png",
      0.95,
    );
  };

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-5">
          <h3 className="text-base font-bold text-gray-800">
            Căn chỉnh ảnh đại diện
          </h3>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex justify-center mb-5">
          <div
            className="relative rounded-full overflow-hidden bg-gray-100 cursor-grab active:cursor-grabbing touch-none"
            style={{ width: VIEWPORT, height: VIEWPORT }}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
          >
            <canvas ref={canvasRef} width={VIEWPORT} height={VIEWPORT} />
            <div className="absolute inset-0 rounded-full border-2 border-white pointer-events-none" />
          </div>
        </div>

        <p className="text-center text-xs text-gray-400 mb-4">
          Kéo để đặt lại vị trí, dùng thanh trượt để phóng to/thu nhỏ
        </p>

        <div className="flex items-center gap-3 mb-6">
          <span className="text-xs text-gray-400">−</span>
          <input
            type="range"
            min={1}
            max={3}
            step={0.01}
            value={zoom}
            onChange={(e) => setZoom(parseFloat(e.target.value))}
            className="flex-1"
          />
          <span className="text-xs text-gray-400">+</span>
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm font-semibold text-gray-600 rounded-lg hover:bg-gray-100 cursor-pointer"
          >
            Hủy
          </button>
          <button
            onClick={handleConfirm}
            className="px-5 py-2 text-sm font-semibold text-white bg-[#0a1b35] rounded-lg hover:bg-[#0a1b35]/90 cursor-pointer"
          >
            Lưu ảnh
          </button>
        </div>
      </div>
    </div>
  );
}
