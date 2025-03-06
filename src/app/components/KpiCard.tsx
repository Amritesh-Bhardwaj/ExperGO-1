"use client";
import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown } from 'lucide-react';

type KpiCardProps = {
  title: string;
  value: string | number;
  change: number;
  unit?: string;
  isExpandable?: boolean;
  children?: React.ReactNode;
};

export default function KpiCard({
  title,
  value,
  change,
  unit = '%',
  isExpandable = false,
  children
}: KpiCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const isPositive = change >= 0;
  const changeText = `${isPositive ? '+' : ''}${change}${unit} from last month`;
  const animationTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const handleCardClick = () => {
    if (isExpandable && !isAnimating) {
      if (isExpanded) {
        // Start fadeOut animation
        handleFadeOut();
      } else {
        setIsExpanded(true);
      }
    }
  };
  
  const handleFadeOut = () => {
    if (title === "WIP") {
      const wipChildrenContainer = document.getElementById('wip-children');
      if (wipChildrenContainer) {
        setIsAnimating(true);
        // Rotate the chevron immediately when starting fadeOut
        setIsExpanded(false);
        
        wipChildrenContainer.classList.remove('animate-fadeIn');
        wipChildrenContainer.classList.add('animate-fadeOut');
        
        // Wait for animation to complete before cleaning up
        if (animationTimeoutRef.current) {
          clearTimeout(animationTimeoutRef.current);
        }
        
        animationTimeoutRef.current = setTimeout(() => {
          setIsAnimating(false);
          wipChildrenContainer.style.display = 'none';
          wipChildrenContainer.classList.remove('animate-fadeOut');
        }, 300); // Match animation duration
      }
    } else {
      // For non-WIP cards
      setIsAnimating(true);
      // Rotate the chevron immediately when starting fadeOut
      setIsExpanded(false);
      
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
      }
      
      animationTimeoutRef.current = setTimeout(() => {
        setIsAnimating(false);
      }, 300); // Match animation duration
    }
  };
  
  // Effect for handling WIP container display
  useEffect(() => {
    if (title === "WIP" && isExpanded) {
      const wipChildrenContainer = document.getElementById('wip-children');
      if (wipChildrenContainer) {
        wipChildrenContainer.style.display = 'block';
        wipChildrenContainer.classList.remove('animate-fadeOut');
        void wipChildrenContainer.offsetWidth; // Trigger reflow
        wipChildrenContainer.classList.add('animate-fadeIn');
      }
    }
  }, [isExpanded, title]);
  
  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
      }
    };
  }, []);
  
  return (
    <div className="flex flex-col">
      <div
        className={`bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow ${isExpandable ? 'cursor-pointer' : ''}`}
        onClick={handleCardClick}
      >
        <div className="flex justify-between items-start">
          <h3 className="text-gray-600 text-sm font-medium mb-1">{title}</h3>
          {isExpandable && (
            <span className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
              <ChevronDown size={24} className="text-black" />
            </span>
          )}
        </div>
        <p className="text-3xl font-bold mb-2">{value}</p>
        <p className={`text-sm ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
          {changeText}
        </p>
      </div>
      
      {/* Expandable children section - only for children OTHER than WIP */}
      {isExpandable && (isExpanded || isAnimating) && title !== "WIP" && (
        <div className={`mt-2 pl-4 border-l-2 border-gray-200 space-y-2 ${isExpanded ? 'animate-fadeIn' : 'animate-fadeOut'}`}>
          {children}
        </div>
      )}
    </div>
  );
}
