import { ModeToggle } from "@/components/mode-toggle";
import { Search, Bell, Settings, UserRound, LogOut, ShieldCheck, SquareArrowOutUpRight, Star, Gem, ScanEye, Users } from 'lucide-react';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

import { Button } from "./ui/button";
import { Input } from "@/components/ui/input"

import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"

import { handleLogout } from "@/service/firebase";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import { useLogin } from "@/service/LoginContext";
import { DialogClose } from "@radix-ui/react-dialog";
import { Link } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";
import { useState } from "react";

function Header() {

    const loginContext = useLogin();

    const [showSettingDialog, setShowSettingDialog] = useState(false);

    const handleLogoutClick = async () => {
        await handleLogout();
        window.location.reload();
    }

    return (
        <div className="flex gap-[10%] items-center justify-between p-3 px-6 border-b dark:bg-zinc-950">
            <div className="flex text-2xl font-black gap-[2px]">
                <span className="text-green-600 dark:text-green-500">
                    Hi
                </span>
                <span className="">
                    Commit
                </span>
            </div>
            <div className="relative ml-auto flex-1">
                <Search className="absolute left-3 top-[11px] h-4 w-4 text-muted-foreground" />
                <Input
                    type="search"
                    placeholder="Tìm kiếm khoá học, bài tập..."
                    className="w-full rounded-md pl-9 flex-1  bg-transparent"
                />
            </div>
            <div className="flex gap-3">
                <ModeToggle />
                <DropdownMenu>
                    <DropdownMenuTrigger>
                        <TooltipProvider delayDuration={200}>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button variant="outline" size="icon" className="bg-transparent">
                                        <Bell className="h-[1.2rem] w-[1.2rem]" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    Thông báo
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="min-w-[180px]">
                        <DropdownMenuLabel>
                            <div>
                                Thông báo
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem >Tin nhắn 1</DropdownMenuItem>
                        <DropdownMenuItem >Tin nhắn 2</DropdownMenuItem>
                        <DropdownMenuItem >Tin nhắn 3</DropdownMenuItem>
                        <DropdownMenuItem >Tin nhắn 4</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
                <Dialog>
                    <DropdownMenu>
                        <DropdownMenuTrigger className="rounded-full">
                            <Avatar>
                                <AvatarImage className="w-10 aspect-square rounded-full border" src={loginContext?.user.avatar_url} alt="@shadcn" />
                            </Avatar>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="min-w-[180px] dark:bg-zinc-900">
                            <DropdownMenuLabel>
                                <div className="flex items-center gap-2">
                                    <Avatar>
                                        <AvatarImage className="w-10 aspect-square rounded-full border" src={loginContext?.user.avatar_url} alt="@shadcn" />
                                    </Avatar>
                                    <div>
                                        <div className="font-bold">
                                            {loginContext?.user.name ? loginContext?.user.name : loginContext?.user.login}
                                            {(loginContext?.user.role === "ADMIN" || loginContext?.user.role === "TEACHER") && <i className="fa-solid fa-circle-check text-primary text-[10px] ml-1 -translate-y-[1px]"></i>}
                                        </div>
                                        <div className="text-sm opacity-50 font-medium">{loginContext?.user.email}</div>
                                    </div>
                                </div>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            {
                                loginContext?.user.role === "ADMIN" &&
                                <Link to="/admin" target="blank">
                                    <DropdownMenuItem className="group/link hover:cursor-pointer dark:hover:bg-zinc-800">
                                        <ShieldCheck className="mr-2 w-4 aspect-square" />Dành cho quản trị viên<SquareArrowOutUpRight className="absolute right-2.5 w-3.5 aspect-square opacity-0 group-hover/link:opacity-40" />
                                    </DropdownMenuItem>
                                </Link>
                            }
                            <Link to={`/profile/${loginContext?.user.login}`}>
                                <DropdownMenuItem className=" dark:hover:bg-zinc-800 hover:cursor-pointer">
                                    <UserRound className="mr-2 w-4 aspect-square" />Tài khoản của tôi
                                </DropdownMenuItem>
                            </Link>
                            <DropdownMenuItem className=" dark:hover:bg-zinc-800"><Star className="mr-2 w-4 aspect-square" />Được đánh dấu</DropdownMenuItem>
                            <DropdownMenuItem className=" dark:hover:bg-zinc-800"><Bell className="mr-2 w-4 aspect-square" />Thông báo</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setShowSettingDialog(true)} className=" dark:hover:bg-zinc-800">
                                <Settings className="mr-2 w-4 aspect-square" />Cài đặt
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DialogTrigger asChild>
                                <DropdownMenuItem >
                                    <LogOut className="mr-2 w-4 aspect-square" />Đăng xuất
                                </DropdownMenuItem>
                            </DialogTrigger>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle className="mb-1">Đăng xuất khỏi tài khoản này?</DialogTitle>
                            <DialogDescription>
                                Bạn sẽ không thể truy cập vào HiCommit, đến khi đăng nhập trở lại.
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button variant="outline" size="sm">Đóng</Button>
                            </DialogClose>
                            <Button variant="destructive" size="sm" onClick={() => handleLogoutClick()}>Đăng xuất</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
            <Dialog open={showSettingDialog} onOpenChange={() => setShowSettingDialog(!showSettingDialog)}>
                <DialogContent className="max-w-[50%]" onInteractOutside={(e) => e.preventDefault()}>
                    <DialogHeader>
                        <DialogTitle>Cài đặt</DialogTitle>
                    </DialogHeader>
                    <div className="mt-1 -ml-2">
                        <Tabs defaultValue="general" className="w-full flex gap-10" orientation="vertical">
                            <TabsList className="flex flex-col h-fit bg-tranparent gap-2 p-0">
                                <TabsTrigger value="general" className="pr-6 data-[state=active]:bg-secondary w-full justify-start">
                                    <Settings className="w-4 h-4 mr-2" />Chung
                                </TabsTrigger>
                                <TabsTrigger value="advance" className="pr-6 data-[state=active]:bg-secondary w-full justify-start">
                                    <Gem className="w-4 h-4 mr-2" />Nâng cao
                                </TabsTrigger>
                                <TabsTrigger value="access" className="pr-6 data-[state=active]:bg-secondary w-full justify-start">
                                    <ScanEye className="w-4 h-4 mr-2" />Quyền truy cập
                                </TabsTrigger>
                                <TabsTrigger value="member" className="pr-6 data-[state=active]:bg-secondary w-full justify-start">
                                    <Users className="w-4 h-4 mr-2" />Thành viên
                                </TabsTrigger>
                            </TabsList>
                            <div className="py-1 flex-1">
                                <TabsContent value="general" className="mt-0  min-h-[400px]">

                                </TabsContent>
                                <TabsContent value="access" className="mt-0 min-h-[400px]">

                                </TabsContent>
                                <TabsContent value="advance" className="mt-0 min-h-[400px]">
                                    Advance Setting here
                                </TabsContent>
                                <TabsContent value="member" className="mt-0 min-h-[400px]">
                                    Member Setting here
                                </TabsContent>
                            </div>
                        </Tabs>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default Header;