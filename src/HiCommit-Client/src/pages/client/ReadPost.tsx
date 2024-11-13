import { getPostBySlug, getPosts } from "@/service/API/Post";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookmarkCheck, Braces, CalendarDays, Ellipsis, EllipsisVertical, Pencil, Star, Tag, Tags } from "lucide-react";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { formatTimeAgo } from "@/service/DateTimeService";
import { Separator } from "@/components/ui/separator";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import BlurFade from "@/components/magicui/blur-fade";

function ReadPost() {

    const { slug } = useParams<{ slug: string }>();

    const [postData, setPostData] = useState<any>();
    const [relatedPosts, setRelatedPosts] = useState<any[]>([]);

    const handleGetPostData = async () => {
        try {
            const response = await getPostBySlug(slug as any);
            setPostData(response);
            console.log(response);
        } catch (error) {
            console.error('Error getting post:', error);
        }
    };

    const handleGetRelatedPosts = async () => {
        try {
            const response = await getPosts();
            setRelatedPosts(response);
            console.log(response);
        } catch (error) {
            console.error('Error getting post:', error);
        }
    }

    useEffect(() => {
        handleGetPostData();
        handleGetRelatedPosts();
    }, [slug]);

    return (
        <div className="ReadPost p-6 px-8 flex flex-col gap-8">
            <Breadcrumb>
                <BlurFade delay={0.1} yOffset={0} blur="2px">
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink asChild>
                                <Link to="/forum">Diễn đàn</Link>
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BlurFade delay={0.25} yOffset={0} blur="2px">
                            <BreadcrumbItem>
                                {postData?.title}
                            </BreadcrumbItem>
                        </BlurFade>
                    </BreadcrumbList>
                </BlurFade>
            </Breadcrumb>
            <div className="flex flex-col gap-8">
                <BlurFade delay={0.3} yOffset={0} blur="2px">
                    <div className="flex-1 flex gap-4 border-b-[1.5px] pb-6 ">
                        <div className="flex flex-col gap-1 flex-1">
                            <div className="flex gap-2 items-center text-sm">
                                <span className="opacity-70">Đăng bởi</span>
                                <Avatar className="w-6 h-6">
                                    <AvatarImage className="w-full h-full rounded-full" src={postData?.author.avatar_url} />
                                </Avatar>
                                <p className="font-bold text-[15px]">
                                    {postData?.author.username}
                                    {(postData?.author.role === "ADMIN" || postData?.author.role === "TEACHER") && <i className="fa-solid fa-circle-check text-[10px] text-primary ml-1.5 -translate-y-[1px]"></i>}
                                </p>
                                <p className="opacity-70 flex items-center gap-3 ml-2"><i className="fa-solid fa-circle text-[3px]"></i>{formatTimeAgo(postData?.createdAt, "vi")}</p>
                                <DropdownMenu>
                                    <DropdownMenuTrigger>
                                        <Button variant="ghost" size="icon" className="w-7 h-7">
                                            <Ellipsis className="w-4 h-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent side="right" align="start" className="w-[160px] dark:bg-zinc-900">
                                        <DropdownMenuLabel>Tuỳ chọn</DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem>
                                            <Pencil className="mr-2 w-4 h-4" />Chỉnh sửa
                                        </DropdownMenuItem>
                                        <DropdownMenuItem>
                                            <Star className="mr-2 w-4 h-4" />Đánh dấu
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                            <h1 className="text-3xl font-bold">{postData?.title}</h1>
                            <div className="flex gap-2 mt-3">
                                <span className="text-sm opacity-80 translate-y-[2px]">
                                    <BookmarkCheck className="w-4 h-4 inline mr-1 text-green-600 dark:text-green-500" />
                                    Chủ đề:
                                </span>
                                {postData?.tags.map((tag: any, index: number) => (
                                    <BlurFade delay={0.25 + index * 0.05} yOffset={0}>
                                        <Badge key={tag} variant="secondary" className="border- bg-secondary/50 dark:bg-secondary/60 text-[12px] p-0.5 px-3 font-normal leading-5 cursor-pointer">{tag}</Badge>
                                    </BlurFade>
                                ))}
                            </div>
                        </div>
                        <div className="h-[120px] aspect-[3/2] overflow-hidden border rounded-lg">
                            <img src={postData?.thumbnail} alt="avatar" className="w-full h-full object-cover" />
                        </div>
                    </div>
                </BlurFade>
                <BlurFade delay={0.4} yOffset={0} blur="2px">
                    <div className="flex gap-12 items-start relative">
                        <div
                            className="ck-content hicommit-content leading-7 text-justify flex-1"
                            dangerouslySetInnerHTML={{ __html: postData?.content }}
                        />
                        <div className="w-[340px] aspect-[2/3] border hidden 2xl:flex rounded-md bg-secondary/10 sticky top-6">

                        </div>
                    </div>
                </BlurFade>
                <div className="flex flex-col gap-6 mt-16">
                    <h2 className="font-bold text-xl border-b-[1.5px] pb-3">Các bài viết liên quan</h2>
                    <div className="flex flex-col gap-6 relative">
                        {relatedPosts.map((post: any, index) => (
                            <BlurFade delay={0.1 + index * 0.05} inView>
                                <div key={post.id} className="flex items-start gap-5">
                                    <Link className="h-[180px] aspect-[3/2] overflow-hidden border rounded-lg" to={`/forum/${post.slug}`}>
                                        <img src={post.thumbnail} alt="avatar" className="w-full h-full object-cover" />
                                    </Link>
                                    <div className="flex-1 flex justify-between">
                                        <div className="flex-1 max-w-[80%]">
                                            <Link className="font-bold text-lg line-clamp-2" to={`/forum/${post.slug}`}>{post.title}</Link>
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
                                    </div>
                                </div>
                            </BlurFade>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReadPost;