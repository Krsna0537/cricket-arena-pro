import React from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface AnimatedImageProps {
  src: string;
  alt: string;
  className?: string;
}

export function AnimatedImage({ src, alt, className }: AnimatedImageProps) {
  return (
    <motion.div 
      className="relative"
      whileHover={{ 
        scale: 1.02,
        transition: { duration: 0.4 }
      }}
    >
      <motion.img 
        src={src} 
        alt={alt} 
        className={cn(
          "max-w-full rounded-lg",
          className
        )}
        initial={{ scale: 1 }}
        whileHover={{ 
          scale: 1.05,
          transition: { duration: 0.6 }
        }}
        transition={{
          type: "spring",
          stiffness: 260,
          damping: 20
        }}
      />
    </motion.div>
  );
} 