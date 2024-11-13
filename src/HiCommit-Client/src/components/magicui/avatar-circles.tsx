"use client";

import React from "react";

import { cn } from "@/lib/utils";

interface AvatarCirclesProps {
  className?: string;
  numPeople?: number;
  avatarUrls: string[];
  size?: number;
  showPlus?: boolean;
}

const AvatarCircles = ({
  numPeople,
  className,
  avatarUrls,
  size = 10,
  showPlus = true,
}: AvatarCirclesProps) => {
  return (
    <div className={cn("z-10 flex -space-x-4 rtl:space-x-reverse", className)}>
      {avatarUrls.map((url, index) => (
        <img
          key={index}
          className={`size-${size} rounded-full border-2 border-white dark:border-gray-800`}
          src={url}
          width={size * 4}
          height={size * 4}
          alt={`Avatar ${index + 1}`}
        />
      ))}
      {showPlus && (
        <span
          className={`flex size-${size} items-center justify-center rounded-full border-2 border-white bg-primary text-center text-xs font-medium text-white dark:border-gray-800 dark:bg-white dark:text-black`}
        >
          +{numPeople}
        </span>
      )}
    </div>
  );
};

export default AvatarCircles;
