"use client";

import { useState, useRef, useEffect } from "react";

interface HoverCardProps {
  trigger: React.ReactNode;
  content: React.ReactNode;
  openDelay?: number;
  closeDelay?: number;
}

const HoverCard = ({ 
  trigger, 
  content, 
  openDelay = 0, 
  closeDelay = 200 
}: HoverCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    
    if (!isHovered) {
      if (openDelay > 0) {
        timeoutRef.current = setTimeout(() => {
          setIsHovered(true);
        }, openDelay);
      } else {
        setIsHovered(true);
      }
    }
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    
    if (isHovered) {
      timeoutRef.current = setTimeout(() => {
        setIsHovered(false);
      }, closeDelay);
    }
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return ( 
    <div 
      className="relative inline-block"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="cursor-pointer">
        {trigger}
      </div>
      {isHovered && (
        <div className="absolute z-10 mt-2 p-4 bg-white border border-gray-200 rounded-lg shadow-lg w-72 max-h-96 overflow-y-auto left-0">
          {content}
        </div>
      )}
    </div>
  );
};

export default HoverCard;
