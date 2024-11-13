import { useClientUI } from "@/service/ClientUIContext";
import { useLogin } from "@/service/LoginContext";
import { useEffect, useState } from "react";

import { ScrollArea } from "@/components/ui/scroll-area"

import {
    Command,
    CommandEmpty,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose
} from "@/components/ui/dialog"

import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import CodeMirror from '@uiw/react-codemirror';
import { githubLightInit, githubDarkInit } from '@uiw/codemirror-theme-github';
import { javascript } from '@codemirror/lang-javascript';

import { useTheme } from "@/components/theme-provider";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { ArrowRight, Image, Paperclip, CirclePlus, Search, UsersRound, Code, Link2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

function Chat() {

    const { theme } = useTheme();

    const { user } = useLogin();
    const { expanded, setExpanded } = useClientUI();

    // const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");
    const [code, setCode] = useState("");

    const users = [
        {
            id: 1,
            name: "baoanth",
            avatar: "https://avatars.githubusercontent.com/u/17537969?s=80&v=4",
        },
        {
            id: 2,
            name: "kakanvk",
            avatar: "https://avatars.githubusercontent.com/u/93561031?v=4",
        },
        {
            id: 3,
            name: "vhiep",
            avatar: "https://avatars.githubusercontent.com/u/112191296?v=4",
        },
        {
            id: 4,
            name: "nguyenducmanh",
            avatar: "https://avatars.githubusercontent.com/u/93963527?v=4",
        },
        {
            id: 5,
            name: "lntaivn",
            avatar: "https://avatars.githubusercontent.com/u/94955437?v=4",
        },
        {
            id: 6,
            name: "thaihunghung",
            avatar: "https://avatars.githubusercontent.com/u/116266818?v=4",
        },
        {
            id: 7,
            name: "nnsang1309",
            avatar: "https://avatars.githubusercontent.com/u/92458482?v=4",
        },
        {
            id: 8,
            name: "nguyenvanhieu",
            avatar: "https://avatars.githubusercontent.com/u/116266818?v=4",
        }
    ]

    const messages = [
        {
            from: {
                id: 2,
                name: "kakanvk",
                avatar: "https://avatars.githubusercontent.com/u/93561031?v=4",
            },
            message: {
                id: 2,
                content: "Hi, I'm Kaka.",
            }
        },
        {
            from: {
                id: 1,
                name: "baoanth",
                avatar: "https://avatars.githubusercontent.com/u/17537969?s=80&v=4",
            },
            message: {
                id: 1,
                content: "Hello, I'm Bao Anh.",
            }
        },
        {
            from: {
                id: 3,
                name: "vhiep",
                avatar: "https://avatars.githubusercontent.com/u/112191296?v=4",
            },
            message: {
                id: 3,
                content: "Hi, I'm Vhiep.",
            }
        },
        {
            from: {
                id: 4,
                name: "nguyenducmanh",
                avatar: "https://avatars.githubusercontent.com/u/93963527?v=4",
            },
            message: {
                id: 4,
                content: "Hi, I'm Manh.",
            }
        },
        {
            from: {
                id: 5,
                name: "lntaivn",
                avatar: "https://avatars.githubusercontent.com/u/94955437?v=4",
            },
            message: {
                id: 5,
                content: "Hi, I'm Tai.",
            }
        },
        {
            from: {
                id: 6,
                name: "thaihunghung",
                avatar: "https://avatars.githubusercontent.com/u/116266818?v=4",
            },
            message: {
                id: 6,
                content: "Hi, I'm Hung.",
            }
        },
        {
            from: {
                id: 7,
                name: "nnsang1309",
                avatar: "https://avatars.githubusercontent.com/u/92458482?v=4",
            },
            message: {
                id: 7,
                content: "Hi, I'm Sang.",
            }
        },
        {
            from: {
                id: 8,
                name: "nguyenvanhieu",
                avatar: "https://avatars.githubusercontent.com/u/116266818?v=4",
            },
            message: {
                id: 8,
                content: "Hi, I'm Hieu.",
            }
        }
    ]

    const handleTypeMessage = (e: any) => {
        setMessage(e.target.value);
    }

    useEffect(() => {
        setExpanded(false);

    }, []);

    return (
        <div className="Message h-full flex">
            <div className="p-4 pr-0">
                <div className="flex flex-col gap-4 w-[330px] h-full p-4 pb-0 pr-0 border rounded-lg bg-zinc-100/50 dark:bg-zinc-900/50">
                    <div className="flex items-center gap-2">
                        <h2 className="text-xl font-bold">Cuộc trò chuyện</h2>
                        <Badge className="px-1.5">99+</Badge>
                    </div>

                    <div className="relative pr-4 mt-3">
                        <Search className="absolute left-3 top-[11px] h-4 w-4 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Tìm kiếm đoạn chat..."
                            className="w-full rounded-md pl-9 flex-1"
                        />
                    </div>

                    <ScrollArea className="[&_[data-radix-scroll-area-viewport]]:max-h-[calc(100vh-230px)] h-full w-full pr-4 rounded-md">
                        {
                            users?.map(us => {
                                return (
                                    <Link to={`/message/${us.id}`} className="p-3 px-3 mb-2 flex items-center gap-3 hover:bg-zinc-200/80 dark:hover:bg-zinc-900 rounded-md" key={us.id}>
                                        <Avatar className="w-6 h-6">
                                            <AvatarImage className="w-full rounded-full" src={us.avatar} />
                                        </Avatar>
                                        {us.name}
                                    </Link>
                                )
                            })
                        }
                    </ScrollArea>
                </div>
            </div>
            <div className="flex-1 h-full py-4 pl-0">
                <div className="flex flex-col h-full">
                    <div className="border-b flex items-center justify-between pb-3 gap-4 px-6">
                        <div>
                            <h2 className="text-lg font-bold">Kỹ thuật lập trình</h2>
                            <Dialog>
                                <TooltipProvider delayDuration={100}>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <DialogTrigger>
                                                <span className="text-sm text-green-600 dark:text-green-500 flex items-center gap-2 font-medium"><UsersRound className="w-3.5" />{users.length} người tham gia</span>
                                            </DialogTrigger>
                                        </TooltipTrigger>
                                        <TooltipContent side="bottom">
                                            Đã tham gia
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                                <DialogContent>
                                    <DialogHeader className="mb-3">
                                        <DialogTitle className="mb-2 flex items-center">
                                            Danh sách tham gia
                                            <Badge className="w-fit text-green-600 dark:text-green-500 flex gap-1.5 border-primary px-1.5 py-0 rounded-sm ml-2 translate-y-[1px]" variant="outline">
                                                <span>{users.length}</span>
                                            </Badge>
                                        </DialogTitle>
                                        <DialogDescription>
                                            <Command className="bg-transparent">
                                                <CommandInput placeholder="Tìm kiếm..." />
                                                <CommandList className="mt-2">
                                                    <CommandEmpty>Không có kết quả phù hợp.</CommandEmpty>
                                                    {
                                                        users?.map(us => {
                                                            return (
                                                                <CommandItem className="p-3 px-3 mb-2 flex items-center gap-3 rounded-md" key={us.id}>
                                                                    <Avatar className="w-6 h-6">
                                                                        <AvatarImage className="w-full rounded-full" src={us.avatar} />
                                                                    </Avatar>
                                                                    {us.name}
                                                                </CommandItem>
                                                            )
                                                        })
                                                    }
                                                </CommandList>
                                            </Command>
                                        </DialogDescription>
                                    </DialogHeader>
                                    <DialogFooter>
                                        <DialogClose asChild>
                                            <Button variant="secondary" size="sm">Đóng</Button>
                                        </DialogClose>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </div>
                        <div>
                            <Button variant="outline" size="sm">Truy cập khoá học<ArrowRight className="w-4 ml-2" /></Button>
                        </div>
                    </div>
                    <div className="flex-1">
                        <div className="rounded-lg h-full w-full pl-4">
                            <ScrollArea className="[&_[data-radix-scroll-area-viewport]]:max-h-[calc(100vh-225px)] h-full w-full pr-5 rounded-md">
                                <div className="flex flex-col-reverse gap-5 py-5 px-1">
                                    {
                                        messages?.map((item, index) => {
                                            return (
                                                <Message key={item.message.id} messageInfo={item} fromMe={index === 0} />
                                            )
                                        })
                                    }
                                </div>
                            </ScrollArea>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 px-4 border-t pt-4">
                        <div className="flex items-center">
                            <Button variant="ghost" size="icon" className="rounded-full"><Image className="w-[18px]" /></Button>
                            <Button variant="ghost" size="icon" className="rounded-full"><Paperclip className="w-[18px]" /></Button>
                            <DropdownMenu>
                                <DropdownMenuTrigger>
                                    <Button variant="ghost" size="icon" className="rounded-full"><CirclePlus className="w-[20px]" /></Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="start" className="flex flex-col">
                                    <Dialog>
                                        <DialogTrigger>
                                            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                                <Link2 className="w-[18px] mr-2" />
                                                <span className="pr-6">Tạo liên kết</span>
                                            </DropdownMenuItem>
                                        </DialogTrigger>
                                        <DialogContent>
                                            <DialogHeader>
                                                <DialogTitle>Gửi liên kết đến mọi người</DialogTitle>
                                            </DialogHeader>
                                            <DialogDescription>
                                                <span>Dán liên kết vào ô bên dưới</span>
                                                <Input placeholder="https://example.com" className="w-full mt-2" />
                                            </DialogDescription>
                                            <DialogFooter className="mt-2">
                                                <DialogClose asChild>
                                                    <Button variant="secondary">Đóng</Button>
                                                </DialogClose>
                                                <Button>Gửi liên kết<i className="fa-solid fa-paper-plane ml-2"></i></Button>
                                            </DialogFooter>
                                        </DialogContent>
                                    </Dialog>
                                    <Dialog>
                                        <DialogTrigger>
                                            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                                <Code className="w-[18px] mr-2" />Mã nguồn
                                            </DropdownMenuItem>
                                        </DialogTrigger>
                                        <DialogContent className="min-w-[650px]"> 
                                            <DialogHeader>
                                                <DialogTitle>Tạo khối Code</DialogTitle>
                                            </DialogHeader>
                                            <DialogDescription>
                                                <span>Dán mã nguồn vào ô bên dưới</span>
                                                <div className="border rounded-lg overflow-hidden mt-2">
                                                    <CodeMirror
                                                        value={code}
                                                        placeholder="Please enter your code here..."
                                                        theme={theme === "dark" ?
                                                            githubDarkInit({
                                                                settings: {
                                                                    background: 'rgb(15 15 15)',
                                                                }
                                                            }) :
                                                            githubLightInit({
                                                                settings: {
                                                                    gutterBackground: "rgb(235 235 235)",
                                                                    background: 'rgb(248 248 248)',
                                                                    lineHighlight: '#8a91991a',
                                                                }
                                                            })
                                                        }
                                                        onChange={(value) => setCode(value)}
                                                        extensions={[javascript({ jsx: true })]}
                                                        height="350px"
                                                        autoFocus
                                                    />
                                                </div>
                                            </DialogDescription>
                                            <DialogFooter className="mt-2">
                                                <DialogClose asChild>
                                                    <Button variant="secondary">Đóng</Button>
                                                </DialogClose>
                                                <Button>Gửi mã nguồn<i className="fa-solid fa-paper-plane ml-2"></i></Button>
                                            </DialogFooter>
                                        </DialogContent>
                                    </Dialog>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                        <Input placeholder="Nhập tin nhắn..." autoFocus className="rounded-full pl-4 flex-1" value={message} onChange={handleTypeMessage} />
                        <Button className="rounded-full" disabled={message === ""} size="icon"><i className="fa-solid fa-paper-plane text-lg"></i></Button>
                    </div>
                </div>
            </div>
        </div >
    );
};

export default Chat;

function Message(props: any) {

    const { messageInfo, fromMe } = props;

    return (
        <div className="Message">
            <div className={`flex gap-3 items-start ${fromMe && "flex-row-reverse"}`}>
                <Avatar className="w-7 h-7">
                    <AvatarImage className="w-full rounded-full" src={messageInfo.from.avatar} />
                </Avatar>
                <p className="bg-secondary p-2 px-3 rounded-lg text-[15px]">{messageInfo.message.content}</p>
            </div>
        </div>
    );
}