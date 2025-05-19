import React, { useState } from 'react';
import { cn } from '@/lib/utils';

interface AnimatedImageProps {
  src: string;
  alt: string;
  className?: string;
}

export function AnimatedImage({ src, alt, className }: AnimatedImageProps) {
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const container = e.currentTarget;
    const rect = container.getBoundingClientRect();
    
    // Calculate mouse position in the element
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Calculate rotation based on mouse position (reduced intensity for subtlety)
    const rotY = ((x / rect.width) - 0.5) * 5; // -2.5 to 2.5 degrees
    const rotX = ((y / rect.height) - 0.5) * -5; // -2.5 to 2.5 degrees
    
    setRotateX(rotX);
    setRotateY(rotY);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    // Smooth reset of rotation
    setRotateX(0);
    setRotateY(0);
    setIsHovered(false);
  };

  return (
    <div 
      className="group relative transition-all duration-700 ease-out cursor-pointer overflow-hidden rounded-3xl shadow-xl"
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        perspective: '1200px',
        height: '100%',
        width: '100%',
        boxShadow: isHovered ? '0 10px 30px -5px rgba(0, 0, 0, 0.3)' : '0 5px 15px -5px rgba(0, 0, 0, 0.2)'
      }}
    >
      <div
        className="relative transition-all duration-500 ease-out w-full h-full"
        style={{
          transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
          transformStyle: 'preserve-3d'
        }}
      >
        <img 
          src={src} 
          alt={alt} 
          className={cn(
            "transition-all duration-700 ease-out rounded-3xl shadow-lg group-hover:scale-110 group-hover:shadow-2xl w-full h-full",
            className
          )}
        />
        
        {/* Overlay with gradient for better visual */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-black/30 opacity-0 group-hover:opacity-40 transition-opacity duration-700 rounded-3xl"></div>
        
        {/* Enhanced shine effect */}
        <div 
          className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-all duration-1500 bg-gradient-to-r from-transparent via-white/30 to-transparent rounded-3xl"
          style={{ 
            transform: "skewX(-20deg)",
            animationDelay: "0.2s"
          }}
        ></div>
        
        {/* Border glow effect on hover */}
        <div 
          className="absolute inset-0 rounded-3xl border-2 border-transparent group-hover:border-cricket-accent/50 transition-all duration-700"
          style={{
            boxShadow: isHovered 
              ? '0 0 20px 2px rgba(255, 215, 0, 0.3), inset 0 0 20px 2px rgba(255, 215, 0, 0.2)' 
              : 'none'
          }}
        ></div>
      </div>
    </div>
  );
} 