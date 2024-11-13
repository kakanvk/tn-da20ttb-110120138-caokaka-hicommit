import { cn } from '@/lib/utils';
import { CircleDot } from 'lucide-react';
import React from 'react';

interface GitGraphProps {
    className?: string;
    children?: React.ReactNode;
    ref?: React.RefObject<HTMLDivElement>;
}

interface GitGraphHeadProps {
    className?: string;
    children?: React.ReactNode;
    ref?: React.RefObject<HTMLDivElement>;
}

interface GitGraphBodyProps {
    className?: string;
    children?: React.ReactNode;
    ref?: React.RefObject<HTMLDivElement>;
}

interface GitGraphFreeProps {
    className?: string;
    ref?: React.RefObject<HTMLDivElement>;
}

interface GitGraphNodeProps {
    className?: string;
    children?: React.ReactNode;
    ref?: React.RefObject<HTMLDivElement>;
    end?: boolean;
}

const GitGraph: React.FC<GitGraphProps> = ({ children, className, ref }) => {

    return (
        <div
            className={cn(
                `flex justify-between gap-4 flex-col`,
                className
            )}
            ref={ref}
        >
            {children}
        </div>
    );
}

const GitGraphHead: React.FC<GitGraphHeadProps> = ({ children, className, ref }) => {

    return (
        <div
            className={cn(
                ``,
                className
            )}
            ref={ref}
        >
            {children}
        </div>
    );
}

const GitGraphBody: React.FC<GitGraphBodyProps> = ({ children, className, ref }) => {

    return (
        <div
            className={cn(
                `flex flex-col pl-2`,
                className
            )}
            ref={ref}
        >
            {children}
        </div>
    );
}

const GitGraphFree: React.FC<GitGraphFreeProps> = ({ className, ref }) => {

    return (
        <div
            className={cn(
                `pl-10 border-l-2 h-4 after:absolute after:top-0 after:left-0 after:w-[2px] after:h-full after:bg-gradient-to-b after:from-background`,
                className
            )}
            ref={ref}
        ></div>
    );
}

const GitGraphNode: React.FC<GitGraphNodeProps> = ({ children, className, ref, end }) => {

    return (
        <div className={`flex flex-col gap-2 relative ${end ? "translate-y-[-2px] py-3.5 pl-[calc(2rem+2px)]" : "border-l-2 py-2.5 pl-8"}`}>
            <div className={`absolute ${end ? "-left-0" : "-left-0.5"} top-0.5 w-7 h-[50%] border-b-2 border-l-2 rounded-bl-xl`}>
                <CircleDot className="z-20 w-[12px] h-[12px] stroke-[4.5] fa-solid fa-circle text-primary absolute bottom-0 right-0 translate-x-[100%] translate-y-[50%]" />
            </div>
            <div
                className={cn(className)}
                ref={ref}
            >
                {children}
            </div>
        </div>
    );
}

export { GitGraph, GitGraphHead, GitGraphBody, GitGraphFree, GitGraphNode };
