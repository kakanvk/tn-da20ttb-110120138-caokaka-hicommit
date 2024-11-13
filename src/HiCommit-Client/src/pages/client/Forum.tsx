
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";

import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card"
import { CalendarDays, CornerDownRight, Filter, Plus, Search, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"
import { Button } from "@/components/ui/button";

import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getPosts } from "@/service/API/Post";
import { formatTimeAgo } from "@/service/DateTimeService";
import BlurFade from "@/components/magicui/blur-fade";

function Forum() {

    const [posts, setPosts] = useState<any[]>([]);
    const [filteredPosts, setFilteredPosts] = useState<any[]>([]);
    const [searchKeyword, setSearchKeyword] = useState<string>("");

    const handleGetPosts = async () => {
        try {
            const response = await getPosts();
            setPosts(response);
            setFilteredPosts(response);
            console.log(response);
        } catch (error) {
            console.error('Error getting posts:', error);
        }
    }

    useEffect(() => {
        const filtered = posts.filter((post) =>
            post.title.toLowerCase().includes(searchKeyword.toLowerCase())
        );
        setFilteredPosts(filtered);
    }, [searchKeyword, posts]);

    useEffect(() => {
        handleGetPosts();
    }, []);

    return (
        <div className="Forum p-7 pt-5">
            <div className="flex flex-col gap-7">
                <BlurFade delay={0.1} yOffset={0} blur="2px">
                    <div className="flex items-end justify-between">
                        <div className="flex gap-2 items-center">
                            <h2 className="text-lg font-semibold">Tất cả bài viết</h2>
                            <Badge className="px-2 min-w-[22px] flex justify-center" variant="secondary">18</Badge>
                        </div>
                        <div className="flex-1 flex items-center gap-3 justify-end">
                            <div className="relative max-w-[300px] flex-1">
                                <Search className="absolute left-3 top-[11px] h-4 w-4 text-muted-foreground" />
                                <Input
                                    type="search"
                                    placeholder="Tìm kiếm bài viết"
                                    className="w-full rounded-md pl-9 flex-1 bg-transparent"
                                    value={searchKeyword}
                                    onChange={(e) => setSearchKeyword(e.target.value)}
                                />
                            </div>
                            <Dialog>
                                <TooltipProvider delayDuration={100}>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <DialogTrigger asChild>
                                                <Button size="icon" variant="outline" className="bg-transparent">
                                                    <Filter className="h-4 w-4" />
                                                </Button>
                                            </DialogTrigger>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            Lọc
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Lọc bài viết</DialogTitle>
                                    </DialogHeader>
                                    <DialogDescription>
                                        This action cannot be undone. This will permanently delete your account
                                        and remove your data from our servers.
                                    </DialogDescription>
                                    <DialogFooter className="mt-4">
                                        <DialogClose asChild>
                                            <Button variant="ghost">
                                                Hủy
                                            </Button>
                                        </DialogClose>
                                        <Button>
                                            Xác nhận
                                        </Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                            <TooltipProvider delayDuration={100}>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Link to="create">
                                            <Button size="icon" className="dark:bg-green-500">
                                                <Plus className="h-[18px] w-[18px] stroke-[2.5px]" />
                                            </Button>
                                        </Link>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        Tạo bài viết
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>
                    </div>
                </BlurFade>
                <div className="flex flex-col gap-6 relative">
                    {filteredPosts.map((post: any, index) => (
                        <BlurFade key={post.id} delay={0.1 * index} inView>
                            <div className="flex items-start gap-5">
                                <Link className="h-[180px] aspect-[3/2] overflow-hidden border rounded-xl" to={post.slug}>
                                    <img src={post.thumbnail} alt="avatar" className="w-full h-full object-cover" />
                                </Link>
                                <div className="flex-1 flex justify-between">
                                    <div className="flex-1 max-w-[80%]">
                                        <Link className="font-bold text-lg line-clamp-2" to={post.slug}>{post.title}</Link>
                                        <div className="flex gap-2 items-center text-sm mt-1">
                                            <span className="opacity-70 flex items-center gap-2">Đăng bởi</span>
                                            <HoverCard openDelay={300}>
                                                <HoverCardTrigger>
                                                    <span className="font-semibold text-green-600 dark:text-green-500 cursor-pointer hover:underline">{post.author.username}</span>
                                                </HoverCardTrigger>
                                                <HoverCardContent className="w-70" side="bottom" align="start">
                                                    <div className="flex gap-4">
                                                        <Avatar>
                                                            <AvatarImage className="w-14 rounded-full" src={post.author.avatar_url} />
                                                        </Avatar>
                                                        <div className="space-y-1">
                                                            <h4 className="text-sm font-semibold text-green-600 dark:text-green-500">@{post.author.username}</h4>
                                                            <p className="text-sm">
                                                                Khoa Kỹ thuật & Công nghệ
                                                            </p>
                                                            <div className="flex items-center pt-2">
                                                                <CalendarDays className="mr-2 h-4 w-4 opacity-70" />{" "}
                                                                <span className="text-xs text-muted-foreground">
                                                                    Tham gia từ tháng 10, 2023
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </HoverCardContent>
                                            </HoverCard>
                                            <span className="opacity-70 flex items-center gap-2"><i className="fa-solid fa-circle text-[3px]"></i>{formatTimeAgo(post.createdAt, "vi")}</span>
                                        </div>
                                        <p className="opacity-50 mt-2 text-sm line-clamp-2 2xl:line-clamp-3">{post.description}</p>
                                        <div className="flex flex-wrap gap-2 mt-4">
                                            {post.tags.map((tag: any) => (
                                                <Badge key={tag} variant="secondary" className="bg-secondary/50 dark:bg-secondary/60 text-[12px] p-0.5 px-3 font-normal leading-5 cursor-pointer">{tag}</Badge>
                                            ))}
                                        </div>
                                    </div>
                                    <Button size="icon" variant="outline" className="bg-transparent">
                                        <Star className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </BlurFade>
                    ))}
                    <Pagination className="mt-10">
                        <PaginationContent>
                            <PaginationItem>
                                <PaginationPrevious href="#" />
                            </PaginationItem>
                            <PaginationItem>
                                <PaginationLink href="#">1</PaginationLink>
                                <PaginationLink href="#">2</PaginationLink>
                            </PaginationItem>
                            <PaginationItem>
                                <PaginationEllipsis />
                            </PaginationItem>
                            <PaginationItem>
                                <PaginationNext href="#" />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                </div>
            </div>
        </div>
    );
};

export default Forum;