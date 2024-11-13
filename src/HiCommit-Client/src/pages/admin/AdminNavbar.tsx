import { useState } from 'react';
import { Link } from "react-router-dom";

import { Medal, Home, MessageCircle, Package, Album, PieChart, Github, Star, ChevronLeft, ChevronRight, Atom, Milestone, Flame, Podcast, MessageCircleCode, Pyramid, UserRoundCog, UserRound } from 'lucide-react';

import { Button } from '@/components/ui/button';

import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"

import { Badge } from "@/components/ui/badge"

import { motion } from "framer-motion";
import { useClientUI } from '@/service/ClientUIContext';
import { Separator } from '@/components/ui/separator';
import { useLogin } from '@/service/LoginContext';

function AdminNavbar() {

    const { expanded, setExpanded } = useClientUI();
    const loginContext = useLogin();

    const toggleNav = () => {
        setExpanded(!expanded);
    };

    return (
        <div className="AdminNavbar p-4">
            <motion.div
                className={`bg-zinc-100 dark:bg-zinc-900 h-full border border-secondary/80 rounded-2xl relative`}
                initial={{ width: "250px" }}
                animate={{ width: expanded ? "250px" : "fit-content" }}
                transition={{ duration: 0.2 }}
            >
                <div className={`flex flex-col ${expanded ? 'gap-10' : 'gap-3'} p-2`}>
                    <div className="flex flex-col gap-3">
                        <div className="flex flex-col gap-2 font-medium">
                            {
                                expanded &&
                                <motion.span
                                    initial={{ opacity: 0.5 }}
                                    animate={{
                                        opacity: !expanded ? 0 : 0.5,
                                    }}
                                    transition={{
                                        duration: !expanded ? 0 : 0.4,
                                        delay: !expanded ? 0 : 0.4,
                                        ease: "easeInOut",
                                    }}
                                    className='text-sm font-bold border-b px-3 py-1 pb-3'
                                    style={{ whiteSpace: "nowrap" }}
                                >
                                    {expanded && "Admin Dashboard"}
                                </motion.span>
                            }
                            <TooltipProvider delayDuration={100}>
                                <Tooltip>
                                    <TooltipTrigger>
                                        <Link className={`flex rounded-lg p-2 px-3.5 ${(location.pathname === "/admin" || location.pathname === "/admin/") ? 'bg-zinc-300/60 dark:bg-zinc-800 text-green-600 dark:text-green-500' : 'hover:bg-zinc-300/30 dark:hover:bg-zinc-800/40'}`} to="">
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
                                                {expanded && "Tổng quan"}
                                            </motion.span>
                                        </Link>
                                    </TooltipTrigger>
                                    {
                                        !expanded &&
                                        <TooltipContent side="right">
                                            <p>Tổng quan</p>
                                        </TooltipContent>
                                    }
                                </Tooltip>
                            </TooltipProvider>
                            <TooltipProvider delayDuration={100}>
                                <Tooltip>
                                    <TooltipTrigger>
                                        <Link className={`flex rounded-lg p-2 px-3.5 ${location.pathname.startsWith('/admin/users') ? 'bg-zinc-300/60 dark:bg-zinc-800 text-green-600 dark:text-green-500' : 'hover:bg-zinc-300/30 dark:hover:bg-zinc-800/40'}`} to="users">
                                            <UserRound className={`${expanded && 'mr-3'} w-4 aspect-square`} />
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
                                                {expanded && "Quản lý người dùng"}
                                            </motion.span>
                                        </Link>
                                    </TooltipTrigger>
                                    {
                                        !expanded &&
                                        <TooltipContent side="right">
                                            <p>Quản lý người dùng</p>
                                        </TooltipContent>
                                    }
                                </Tooltip>
                            </TooltipProvider>
                            <TooltipProvider delayDuration={100}>
                                <Tooltip>
                                    <TooltipTrigger>
                                        <Link className={`flex rounded-lg p-2 px-3.5 ${location.pathname.startsWith('/admin/courses') ? 'bg-zinc-300/60 dark:bg-zinc-800 text-green-600 dark:text-green-500' : 'hover:bg-zinc-300/30 dark:hover:bg-zinc-800/40'}`} to="courses">
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
                            <TooltipProvider delayDuration={100}>
                                <Tooltip>
                                    <TooltipTrigger>
                                        <Link className={`flex rounded-lg p-2 px-3.5 ${location.pathname.startsWith('/admin/problems') ? 'bg-zinc-300/60 dark:bg-zinc-800 text-green-600 dark:text-green-500' : 'hover:bg-zinc-300/30 dark:hover:bg-zinc-800/40'}`} to="problems">
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
                                                {expanded && "Quản lý bài tập"}
                                            </motion.span>
                                        </Link>
                                    </TooltipTrigger>
                                    {
                                        !expanded &&
                                        <TooltipContent side="right">
                                            <p>Quản lý bài tập</p>
                                        </TooltipContent>
                                    }
                                </Tooltip>
                            </TooltipProvider>
                            <TooltipProvider delayDuration={100}>
                                <Tooltip>
                                    <TooltipTrigger>
                                        <Link className={`flex rounded-lg p-2 px-3.5 ${location.pathname.startsWith('/admin/contests') ? 'bg-zinc-300/60 dark:bg-zinc-800 text-green-600 dark:text-green-500' : 'hover:bg-zinc-300/30 dark:hover:bg-zinc-800/40'}`} to="contests">
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
                                                {expanded && "Quản lý cuộc thi"}
                                            </motion.span>
                                        </Link>
                                    </TooltipTrigger>
                                    {
                                        !expanded &&
                                        <TooltipContent side="right">
                                            <p>Quản lý cuộc thi</p>
                                        </TooltipContent>
                                    }
                                </Tooltip>
                            </TooltipProvider>
                            <TooltipProvider delayDuration={100}>
                                <Tooltip>
                                    <TooltipTrigger>
                                        <Link className={`flex rounded-lg p-2 px-3.5 ${location.pathname.startsWith('/admin/posts') ? 'bg-zinc-300/60 dark:bg-zinc-800 text-green-600 dark:text-green-500' : 'hover:bg-zinc-300/30 dark:hover:bg-zinc-800/40'}`} to="posts">
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
                                                {expanded && "Quản lý bài viết"}
                                            </motion.span>
                                        </Link>
                                    </TooltipTrigger>
                                    {
                                        !expanded &&
                                        <TooltipContent side="right">
                                            <p>Quản lý bài viết</p>
                                        </TooltipContent>
                                    }
                                </Tooltip>
                            </TooltipProvider>
                        </div>
                    </div>
                    <TooltipProvider delayDuration={100}>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button variant="ghost" onClick={toggleNav} className='rounded-lg absolute bottom-2.5 right-2.5 hover:bg-zinc-300/70 dark:hover:bg-zinc-800/70' size="icon">
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

export default AdminNavbar;