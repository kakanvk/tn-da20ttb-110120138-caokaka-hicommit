import { useState } from 'react';
import { Link } from "react-router-dom";

import { Medal, Home, MessageCircle, Package, Album, PieChart, Github, Star, ChevronLeft, ChevronRight, Atom, Milestone, Flame, Podcast, MessageCircleCode, Pyramid, BarChart, AlignStartVertical } from 'lucide-react';

import { Button } from './ui/button';

import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"

import { Badge } from "@/components/ui/badge"

import { motion } from "framer-motion";
import { useClientUI } from '@/service/ClientUIContext';
import { Separator } from './ui/separator';
import { useLogin } from '@/service/LoginContext';

function Navbar() {

    const { expanded, setExpanded } = useClientUI();
    const loginContext = useLogin();

    const toggleNav = () => {
        setExpanded(!expanded);
    };

    return (
        <div className="Navbar">
            <motion.div
                className={`bg-white dark:bg-zinc-950 h-full border-r relative`}
                initial={{ width: "280px" }}
                animate={{ width: expanded ? "280px" : "fit-content" }}
                transition={{ duration: 0.2 }}
            >
                <div className={`flex flex-col ${expanded ? 'gap-10' : 'gap-3'} p-4`}>
                    <div className="flex flex-col gap-3">
                        {/* {
                            expanded &&
                            <div className='flex gap-3 items-center'>
                                <span className="text-[12px] font-medium opacity-50">Khám phá</span>
                                <Separator className='flex-1' />
                            </div>
                        } */}
                        <div className="flex flex-col gap-3 font-medium">
                            <TooltipProvider delayDuration={100}>
                                <Tooltip>
                                    <TooltipTrigger>
                                        <Link className={`flex rounded-lg p-2 px-4 ${location.pathname === "/" ? 'bg-zinc-200 dark:bg-zinc-800' : 'hover:bg-zinc-100 dark:hover:bg-zinc-900'}`} to="">
                                            <Home className={`${expanded && 'mr-3'} w-4 aspect-square`} />
                                            <motion.span
                                                initial={{ opacity: 1 }}
                                                animate={{
                                                    opacity: !expanded ? 0 : 1,
                                                }}
                                                transition={{
                                                    duration: !expanded ? 0 : 0.4,
                                                    delay: !expanded ? 0 : 0.4,
                                                    ease: "easeInOut",
                                                }}
                                                style={{ whiteSpace: "nowrap" }}
                                            >
                                                {expanded && "Trang chủ"}
                                            </motion.span>
                                        </Link>
                                    </TooltipTrigger>
                                    {
                                        !expanded &&
                                        <TooltipContent side="right">
                                            <p>Trang chủ</p>
                                        </TooltipContent>
                                    }
                                </Tooltip>
                            </TooltipProvider>
                            <TooltipProvider delayDuration={100}>
                                <Tooltip>
                                    <TooltipTrigger>
                                        <Link className={`flex rounded-lg p-2 px-4 ${location.pathname.startsWith('/courses') ? 'bg-zinc-200 dark:bg-zinc-800' : 'hover:bg-zinc-100 dark:hover:bg-zinc-900'}`} to="courses">
                                            <Package className={`${expanded && 'mr-3'} w-4 aspect-square`} />
                                            <motion.span
                                                initial={{ opacity: 1 }}
                                                animate={{
                                                    opacity: !expanded ? 0 : 1,
                                                }}
                                                transition={{
                                                    duration: !expanded ? 0 : 0.4,
                                                    delay: !expanded ? 0 : 0.4,
                                                    ease: "easeInOut",
                                                }}
                                                style={{ whiteSpace: "nowrap" }}
                                            >
                                                {expanded && "Khoá học"}
                                            </motion.span>
                                        </Link>
                                    </TooltipTrigger>
                                    {
                                        !expanded &&
                                        <TooltipContent side="right">
                                            <p>Khoá học</p>
                                        </TooltipContent>
                                    }
                                </Tooltip>
                            </TooltipProvider>
                            <TooltipProvider delayDuration={100}>
                                <Tooltip>
                                    <TooltipTrigger>
                                        <Link className={`flex rounded-lg p-2 px-4 ${location.pathname.startsWith('/problems') ? 'bg-zinc-200 dark:bg-zinc-800' : 'hover:bg-zinc-100 dark:hover:bg-zinc-900'}`} to="problems">
                                            <Pyramid className={`${expanded && 'mr-3'} w-4 aspect-square`} />
                                            <motion.span
                                                initial={{ opacity: 1 }}
                                                animate={{
                                                    opacity: !expanded ? 0 : 1,
                                                }}
                                                transition={{
                                                    duration: !expanded ? 0 : 0.4,
                                                    delay: !expanded ? 0 : 0.4,
                                                    ease: "easeInOut",
                                                }}
                                                style={{ whiteSpace: "nowrap" }}
                                            >
                                                {expanded && "Luyện tập"}
                                            </motion.span>
                                        </Link>
                                    </TooltipTrigger>
                                    {
                                        !expanded &&
                                        <TooltipContent side="right">
                                            <p>Luyện tập</p>
                                        </TooltipContent>
                                    }
                                </Tooltip>
                            </TooltipProvider>
                            <TooltipProvider delayDuration={100}>
                                <Tooltip>
                                    <TooltipTrigger>
                                        <Link className={`flex rounded-lg p-2 px-4 ${location.pathname.startsWith('/contest') ? 'bg-zinc-200 dark:bg-zinc-800' : 'hover:bg-zinc-100 dark:hover:bg-zinc-900'}`} to="contest">
                                            <Medal className={`${expanded && 'mr-3'} w-4 aspect-square`} />
                                            <motion.span
                                                initial={{ opacity: 1 }}
                                                animate={{
                                                    opacity: !expanded ? 0 : 1,
                                                }}
                                                transition={{
                                                    duration: !expanded ? 0 : 0.4,
                                                    delay: !expanded ? 0 : 0.4,
                                                    ease: "easeInOut",
                                                }}
                                                style={{ whiteSpace: "nowrap" }}
                                            >
                                                {expanded && "Cuộc thi"}
                                            </motion.span>
                                        </Link>
                                    </TooltipTrigger>
                                    {
                                        !expanded &&
                                        <TooltipContent side="right">
                                            <p>Cuộc thi</p>
                                        </TooltipContent>
                                    }
                                </Tooltip>
                            </TooltipProvider>
                            {/* <TooltipProvider delayDuration={100}>
                                <Tooltip>
                                    <TooltipTrigger>
                                        <Link className={`flex rounded-lg p-2 px-4 ${location.pathname.startsWith('/message') ? 'bg-zinc-200 dark:bg-zinc-800' : 'hover:bg-zinc-100 dark:hover:bg-zinc-900'}`} to="message">
                                            <MessageCircleCode className={`${expanded && 'mr-3'} w-[17px]`} />
                                            <motion.span
                                                initial={{ opacity: 1 }}
                                                animate={{
                                                    opacity: !expanded ? 0 : 1,
                                                }}
                                                transition={{
                                                    duration: !expanded ? 0 : 0.4,
                                                    delay: !expanded ? 0 : 0.4,
                                                    ease: "easeInOut",
                                                }}
                                                style={{ whiteSpace: "nowrap" }}
                                            >
                                                {expanded && "Cuộc trò chuyện"}
                                            </motion.span>
                                        </Link>
                                    </TooltipTrigger>
                                    {
                                        !expanded &&
                                        <TooltipContent side="right">
                                            <p>Cuộc trò chuyện</p>
                                        </TooltipContent>
                                    }
                                </Tooltip>
                            </TooltipProvider> */}
                            {/* <TooltipProvider delayDuration={100}>
                                <Tooltip>
                                    <TooltipTrigger>
                                        <Link className={`flex rounded-lg p-2 px-4 ${location.pathname.startsWith('/leaderboard') ? 'bg-zinc-200 dark:bg-zinc-800' : 'hover:bg-zinc-100 dark:hover:bg-zinc-900'}`} to="leaderboard">
                                            <AlignStartVertical className={`${expanded && 'mr-3'} w-4 aspect-square`} />
                                            <motion.span
                                                initial={{ opacity: 1 }}
                                                animate={{
                                                    opacity: !expanded ? 0 : 1,
                                                }}
                                                transition={{
                                                    duration: !expanded ? 0 : 0.4,
                                                    delay: !expanded ? 0 : 0.4,
                                                    ease: "easeInOut",
                                                }}
                                                style={{ whiteSpace: "nowrap" }}
                                            >
                                                {expanded && "Bảng xếp hạng"}
                                            </motion.span>
                                        </Link>
                                    </TooltipTrigger>
                                    {
                                        !expanded &&
                                        <TooltipContent side="right">
                                            <p>Bảng xếp hạng</p>
                                        </TooltipContent>
                                    }
                                </Tooltip>
                            </TooltipProvider> */}
                            <TooltipProvider delayDuration={100}>
                                <Tooltip>
                                    <TooltipTrigger>
                                        <Link className={`flex rounded-lg p-2 px-4 ${location.pathname.startsWith('/forum') ? 'bg-zinc-200 dark:bg-zinc-800' : 'hover:bg-zinc-100 dark:hover:bg-zinc-900'}`} to="forum">
                                            <Podcast className={`${expanded && 'mr-3'} w-4 aspect-square`} />
                                            <motion.span
                                                initial={{ opacity: 1 }}
                                                animate={{
                                                    opacity: !expanded ? 0 : 1,
                                                }}
                                                transition={{
                                                    duration: !expanded ? 0 : 0.4,
                                                    delay: !expanded ? 0 : 0.4,
                                                    ease: "easeInOut",
                                                }}
                                                style={{ whiteSpace: "nowrap" }}
                                            >
                                                {expanded && "Diễn đàn"}
                                            </motion.span>
                                        </Link>
                                    </TooltipTrigger>
                                    {
                                        !expanded &&
                                        <TooltipContent side="right">
                                            <p>Diễn đàn</p>
                                        </TooltipContent>
                                    }
                                </Tooltip>
                            </TooltipProvider>
                        </div>
                    </div>
                    {
                        loginContext.user.role !== "STUDENT" &&
                        <div className="flex flex-col gap-3">
                            <div className='flex gap-3 items-center'>
                                {
                                    expanded &&
                                    <span className="text-[12px] font-medium opacity-50">Dành cho giáo viên</span>
                                }
                                <Separator className='flex-1' />
                            </div>
                            <div className="flex flex-col gap-3 font-medium">
                                <TooltipProvider delayDuration={100}>
                                    <Tooltip>
                                        <TooltipTrigger>
                                            <Link className={`flex rounded-lg p-2 px-4 ${location.pathname.startsWith('/course-manager') ? 'bg-zinc-200 dark:bg-zinc-800' : 'hover:bg-zinc-100 dark:hover:bg-zinc-900'}`} to="/course-manager">
                                                <Atom className={`${expanded && 'mr-3'} w-4 aspect-square`} />
                                                <motion.span
                                                    initial={{ opacity: 1 }}
                                                    animate={{
                                                        opacity: !expanded ? 0 : 1,
                                                    }}
                                                    transition={{
                                                        duration: !expanded ? 0 : 0.4,
                                                        delay: !expanded ? 0 : 0.4,
                                                        ease: "easeInOut",
                                                    }}
                                                    style={{ whiteSpace: "nowrap" }}
                                                >
                                                    {expanded && "Quản lý khoá học"}
                                                </motion.span>
                                            </Link>
                                        </TooltipTrigger>
                                        {
                                            !expanded &&
                                            <TooltipContent side="right">
                                                <p>Quản lý khoá học</p>
                                            </TooltipContent>
                                        }
                                    </Tooltip>
                                </TooltipProvider>
                                {/* <TooltipProvider delayDuration={100}>
                                    <Tooltip>
                                        <TooltipTrigger>
                                            <Link className={`flex rounded-lg p-2 px-4 ${location.pathname.startsWith('/analysis') ? 'bg-zinc-200 dark:bg-zinc-800' : 'hover:bg-zinc-100 dark:hover:bg-zinc-900'}`} to="analysis">
                                                <PieChart className={`${expanded && 'mr-3'} w-4 aspect-square`} />
                                                <motion.span
                                                    initial={{ opacity: 1 }}
                                                    animate={{
                                                        opacity: !expanded ? 0 : 1,
                                                    }}
                                                    transition={{
                                                        duration: !expanded ? 0 : 0.4,
                                                        delay: !expanded ? 0 : 0.4,
                                                        ease: "easeInOut",
                                                    }}
                                                    style={{ whiteSpace: "nowrap" }}
                                                >
                                                    {expanded && "Thống kê"}
                                                </motion.span>
                                            </Link>
                                        </TooltipTrigger>
                                        {
                                            !expanded &&
                                            <TooltipContent side="right">
                                                <p>Thống kê</p>
                                            </TooltipContent>
                                        }
                                    </Tooltip>
                                </TooltipProvider> */}
                            </div>
                        </div>
                    }
                    <TooltipProvider delayDuration={100}>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button variant="ghost" onClick={toggleNav} className='absolute bottom-3 right-4'>
                                    {
                                        expanded ?
                                            <ChevronLeft className='w-4' />
                                            : <ChevronRight className='w-4' />
                                    }
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent side="right" align='center'>
                                {
                                    expanded ?
                                        <p>Thu gọn</p>
                                        : <p>Mở rộng</p>
                                }
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
            </motion.div >
        </div >
    );
};

export default Navbar;