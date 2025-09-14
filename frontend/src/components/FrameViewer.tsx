"use client";

import { useEffect, useRef, useState } from "react";
import ZoomControls from "./ZoomControls";

type Props = {
  fragmentHtml: string;       // code renvoyé par backend (fragment=true)
  baseWidth: number;          // largeur frame (px)
  baseHeight: number;         // hauteur frame (px)
  className?: string;
};

export default function FrameViewer({ fragmentHtml, baseWidth, baseHeight, className = "" }: Props) {
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const viewportRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Pan (drag) quand zoom > 1
  useEffect(() => {
    const vp = viewportRef.current;
    if (!vp) return;

    let dragging = false;
    let startX = 0, startY = 0;
    let offsetX = 0, offsetY = 0;

    function handleMouseDown(e: MouseEvent) {
      if (zoom <= 1) return;
      dragging = true;
      setIsDragging(true);
      startX = e.clientX;
      startY = e.clientY;
      offsetX = offset.x;
      offsetY = offset.y;
      e.preventDefault();
    }

    function handleMouseMove(e: MouseEvent) {
      if (!dragging) return;
      const deltaX = e.clientX - startX;
      const deltaY = e.clientY - startY;
      setOffset({ 
        x: offsetX + deltaX, 
        y: offsetY + deltaY 
      });
    }

    function handleMouseUp() {
      dragging = false;
      setIsDragging(false);
    }

    vp.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      vp.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [zoom, offset]);

  // Fit / Fit width
  function fit() {
    const vp = viewportRef.current;
    if (!vp) return;
    
    const scaleX = vp.clientWidth / baseWidth;
    const scaleY = vp.clientHeight / baseHeight;
    const scale = Math.min(scaleX, scaleY);
    
    setZoom(Number.isFinite(scale) ? Math.max(0.1, Math.min(scale, 5)) : 1);
    setOffset({ x: 0, y: 0 });
  }

  function fitWidth() {
    const vp = viewportRef.current;
    if (!vp) return;
    
    const scale = vp.clientWidth / baseWidth;
    setZoom(Number.isFinite(scale) ? Math.max(0.1, Math.min(scale, 5)) : 1);
    setOffset({ x: 0, y: 0 });
  }

  // Auto-fit on mount
  useEffect(() => {
    const timer = setTimeout(fit, 100);
    return () => clearTimeout(timer);
  }, [baseWidth, baseHeight]);

  // Injecte le fragment HTML
  useEffect(() => {
    if (!contentRef.current) return;
    contentRef.current.innerHTML = fragmentHtml;
  }, [fragmentHtml]);

  const cursorClass = zoom > 1 ? (isDragging ? "cursor-grabbing" : "cursor-grab") : "cursor-default";

  return (
    <div className={`w-full h-full flex flex-col gap-4 ${className}`}>
      {/* Barre de contrôle */}
      <div className="flex items-center justify-between bg-[#111111] border border-[#1F1F1F] rounded-xl p-4">
        <div className="text-sm text-[#A3A3A3]">
          Zoom: <span className="text-[#EAEAEA] font-mono">{Math.round(zoom * 100)}%</span>
          {baseWidth && baseHeight && (
            <span className="ml-4">
              Taille: <span className="text-[#EAEAEA] font-mono">{baseWidth} × {baseHeight}px</span>
            </span>
          )}
        </div>
        <ZoomControls 
          zoom={zoom} 
          setZoom={setZoom} 
          onFit={fit} 
          onFitWidth={fitWidth} 
        />
      </div>

      {/* Viewport */}
      <div 
        ref={viewportRef}
        className={`relative w-full flex-1 overflow-hidden border border-[#1F1F1F] rounded-xl ${cursorClass}`}
        style={{ 
          background: "linear-gradient(45deg, #0A0A0A 25%, transparent 25%), linear-gradient(-45deg, #0A0A0A 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #0A0A0A 75%), linear-gradient(-45deg, transparent 75%, #0A0A0A 75%)",
          backgroundSize: "20px 20px",
          backgroundPosition: "0 0, 0 10px, 10px -10px, -10px 0px"
        }}
      >
        <div
          style={{
            width: baseWidth,
            height: baseHeight,
            transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom})`,
            transformOrigin: "top left",
            background: "#FFFFFF",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3)",
            borderRadius: "4px",
            overflow: "hidden",
            position: "relative"
          }}
        >
          <div ref={contentRef} className="w-full h-full" />
        </div>
      </div>

      {/* Info sur les contrôles */}
      {zoom > 1 && (
        <div className="text-xs text-[#666666] text-center">
          💡 Glissez pour déplacer la vue
        </div>
      )}
    </div>
  );
}