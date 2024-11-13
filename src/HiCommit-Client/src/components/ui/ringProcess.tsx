import React from 'react';

interface RingProgressProps {
    radius: number;
    stroke: number;
    progress: number;
    label?: string;
    textSize?: number;
}

const RingProgress: React.FC<RingProgressProps> = ({ radius, stroke, progress, label, textSize = 17 }) => {
    const normalizedRadius = radius - stroke * 2;
    const circumference = normalizedRadius * 2 * Math.PI;
    const strokeDashoffset = circumference - progress / 100 * circumference;

    // Tính toán vị trí của text
    const textX = radius;
    const textY = radius;

    return (
        <div>
            <svg
                height={radius * 2}
                width={radius * 2}
            >
                {/* Placeholder Circle */}
                <circle
                    fill="transparent"
                    strokeWidth={stroke}
                    strokeDasharray={circumference + ' ' + circumference}
                    style={{ strokeDashoffset: 0, strokeLinecap: 'round', strokeOpacity: 0.1 }}
                    r={normalizedRadius}
                    cx={radius}
                    cy={radius}
                    className="w-full h-full transform -rotate-90 origin-center stroke-zinc-700 dark:stroke-white"
                />
                {/* Progress Circle */}
                <circle
                    fill="transparent"
                    strokeWidth={stroke}
                    strokeDasharray={circumference + ' ' + circumference}
                    style={{ strokeDashoffset, strokeLinecap: 'round' }}
                    r={normalizedRadius}
                    cx={radius}
                    cy={radius}
                    className="w-full h-full transform -rotate-90 origin-center stroke-green-600 dark:stroke-green-500"
                />
                {/* Text */}
                <text
                    x={textX}
                    y={textY}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize={textSize}
                    className='font-bold translate-y-[1px] dark:fill-white'
                >
                    {label ? label : `${progress}%`}
                </text>
            </svg>
        </div>
    );
}

export default RingProgress;
