import { deleteDiscussion, getDiscussionById, updateDiscussion, updateDiscussionStatus } from "@/service/API/Discussion";
import { Http2ServerResponse } from "http2";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

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
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogOverlay,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

import BlurFade from "@/components/magicui/blur-fade";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { formatTimeAgo } from "@/service/DateTimeService";
import { Button } from "@/components/ui/button";
import { ArrowUp, Ellipsis, Flag, Gem, Heart, Pencil, Settings, Settings2, ThumbsUp, Trash2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { useLogin } from "@/service/LoginContext";
import { AutosizeTextarea } from "@/components/ui/auto-resize-text-area";
import { createComment, deleteComment, getCommentsByDiscussionID, togleLikeComment, updateComment } from "@/service/API/Comment";
import toast from "react-hot-toast";
import { useSocket } from "@/service/SocketContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import AvatarCircles from "@/components/magicui/avatar-circles";
import NoRecored from "@/assets/imgs/no-record.svg";

const avatarUrls = [
    "https://avatars.githubusercontent.com/u/16860528",
    "https://avatars.githubusercontent.com/u/20110627",
    "https://avatars.githubusercontent.com/u/106103625",
    "https://avatars.githubusercontent.com/u/59228569",
];

function Discussion() {

    const { socket } = useSocket() as any;
    const navigate = useNavigate();

    const { discussion_id } = useParams<{ discussion_id: string }>();
    const loginContext = useLogin();

    const [discussion, setDiscussion] = useState<any>();
    const [comments, setComments] = useState<any[]>([]);
    const [filteredComments, setFilteredComments] = useState<any[]>([]);

    const [newComment, setNewComment] = useState<string>("");
    const [newDiscussion, setNewDiscussion] = useState<any>({
        title: "",
        description: ""
    });

    const [filter, setFilter] = useState<string>("useful");

    const [showEditCommentDialog, setShowEditCommentDialog] = useState<boolean>(false);
    const [editComment, setEditComment] = useState<any>({
        id: "",
        description: ""
    });

    const getDiscussion = async () => {
        const response = await getDiscussionById(discussion_id as string);
        setDiscussion(response);
        setNewDiscussion({
            title: response.title,
            description: response.description
        });
    };

    const getComments = async () => {
        const response = await getCommentsByDiscussionID(discussion_id as string);
        setComments(response);
        filterComments(response, filter);
        console.log(response);
    };

    const filterComments = (_comments: any[], _filter: string) => {
        if (_filter === "useful") {
            setFilteredComments(_comments.sort((a, b) => b.liked_by.length - a.liked_by.length));
        } else if (_filter === "lastest") {
            setFilteredComments(_comments.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
        } else if (_filter === "oldest") {
            setFilteredComments(_comments.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()));
        }
    };

    const handleCreateComment = async () => {
        const response = await createComment(discussion_id as string, newComment);
        setNewComment("");
    };

    const handleToggleLikeComment = async (comment_id: string) => {
        const response = await togleLikeComment(comment_id);
    };

    const handleDeleteComment = async (comment_id: string) => {
        await toast.promise(
            deleteComment(comment_id),
            {
                loading: 'Đang xoá...',
                success: 'Xoá bình luận thành công',
                error: 'Xoá bình luận thất bại'
            },
            {
                style: {
                    borderRadius: '8px',
                    background: '#222',
                    color: '#fff',
                    paddingLeft: '15px',
                    fontFamily: 'Plus Jakarta Sans',
                }
            });
    };

    const handleEditComment = async (comment_id: string) => {
        await toast.promise(
            updateComment(comment_id, editComment.description),
            {
                loading: 'Đang chỉnh sửa...',
                success: 'Chỉnh sửa bình luận thành công',
                error: 'Chỉnh sửa bình luận thất bại'
            },
            {
                style: {
                    borderRadius: '8px',
                    background: '#222',
                    color: '#fff',
                    paddingLeft: '15px',
                    fontFamily: 'Plus Jakarta Sans',
                }
            }
        );
    };

    const handleUpdateDiscussion = async () => {
        await toast.promise(
            updateDiscussion(discussion_id as string, newDiscussion),
            {
                loading: 'Đang cập nhật...',
                success: 'Thay đổi đã được lưu lại',
                error: 'Thay đổi thất bại'
            },
            {
                style: {
                    borderRadius: '8px',
                    background: '#222',
                    color: '#fff',
                    paddingLeft: '15px',
                    fontFamily: 'Plus Jakarta Sans',
                }
            }
        );
        getDiscussion();
    };

    const handleToggleDiscussionStatus = async () => {
        await toast.promise(
            updateDiscussionStatus(discussion_id as string),
            {
                loading: 'Đang cập nhật...',
                success: 'Cập nhật thành công',
                error: 'Cập nhật thất bại'
            },
            {
                style: {
                    borderRadius: '8px',
                    background: '#222',
                    color: '#fff',
                    paddingLeft: '15px',
                    fontFamily: 'Plus Jakarta Sans',
                }
            }
        );
        getDiscussion();
    };

    const handleDeleteDiscussion = async () => {
        await toast.promise(
            deleteDiscussion(discussion_id as string),
            {
                loading: 'Đang xoá...',
                success: 'Xoá cuộc thảo luận thành công',
                error: 'Xoá cuộc thảo luận thất bại'
            },
            {
                style: {
                    borderRadius: '8px',
                    background: '#222',
                    color: '#fff',
                    paddingLeft: '15px',
                    fontFamily: 'Plus Jakarta Sans',
                }
            }
        );
        setTimeout(() => {
            navigate(`/problem/${discussion?.problem?.slug}`);
        }, 500);
    };

    useEffect(() => {
        getDiscussion();
        getComments();
    }, [discussion_id]);

    useEffect(() => {
        socket.on('updateComment', () => {
            getComments();
        });

        return () => {
            socket.off('updateComment');
        };
    }, []);

    return (
        <div className="Discussion p-6 px-8 flex flex-col gap-6">
            <Breadcrumb>
                <BlurFade delay={0.1} yOffset={0} blur="2px">
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <Link to={`/problem/${discussion?.problem?.slug}`}>{discussion?.problem?.name}</Link>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            Thảo luận
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </BlurFade>
            </Breadcrumb>
            <div className="flex flex-col gap-10 pb-14">
                <BlurFade className="flex flex-col gap-4" delay={0.2} yOffset={0} blur="2px">
                    <div className="flex justify-between items-start">
                        <h1 className="pt-1">
                            <span className="text-2xl font-bold mr-2">{discussion?.title}</span>
                            {discussion?.status === "OPEN" && <Badge className="-translate-y-[4px]">Đang mở</Badge>}
                            {discussion?.status === "CLOSED" && <Badge variant="destructive" className="-translate-y-[4px]">Đã đóng</Badge>}
                        </h1>
                        {
                            discussion?.author?.username === loginContext?.user?.username &&
                            <Dialog>
                                <DialogTrigger>
                                    <Button size="icon" variant="ghost">
                                        <Settings className="w-4 h-4" />
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-[60%] ">
                                    <DialogHeader>
                                        <DialogTitle>Cài đặt</DialogTitle>
                                    </DialogHeader>
                                    <div className="mt-1 -ml-2">
                                        <Tabs defaultValue="content" className="w-full flex gap-10" orientation="vertical">
                                            <TabsList className="flex flex-col h-fit bg-tranparent gap-2 p-0">
                                                <TabsTrigger value="content" className="pr-16 data-[state=active]:bg-secondary w-full justify-start rounded-md">
                                                    <Settings className="size-4 mr-2" />Chung
                                                </TabsTrigger>
                                                <TabsTrigger value="status" className="pr-16 data-[state=active]:bg-secondary w-full justify-start rounded-md">
                                                    <Gem className="w-4 h-4 mr-2" />Nâng cao
                                                </TabsTrigger>
                                            </TabsList>
                                            <div className="py-1 flex-1">
                                                <TabsContent value="content" className="mt-0 min-h-[400px]">
                                                    <div className="flex flex-col gap-5">
                                                        <div className="flex flex-col gap-2">
                                                            <span className="font-semibold">Tiêu đề</span>
                                                            <Input
                                                                value={newDiscussion.title}
                                                                className="w-full bg-secondary/10 dark:bg-secondary/20 placeholder:italic"
                                                                onChange={(e) => setNewDiscussion({ ...newDiscussion, title: e.target.value })}
                                                            />
                                                        </div>
                                                        <div className="flex flex-col gap-2">
                                                            <span className="font-semibold">Nội dung</span>
                                                            <AutosizeTextarea
                                                                placeholder="Nội dung bình luận"
                                                                className="bg-secondary/10 dark:bg-secondary/20 placeholder:italic"
                                                                value={newDiscussion.description}
                                                                onChange={(e) => setNewDiscussion({ ...newDiscussion, description: e.target.value })}
                                                            />
                                                        </div>
                                                        {
                                                            (newDiscussion.title.trim() !== discussion?.title.trim() || newDiscussion.description.trim() !== discussion?.description.trim()) &&
                                                            <Button className="mr-auto mt-2" onClick={() => handleUpdateDiscussion()}>Cập nhật thay đổi</Button>
                                                        }
                                                    </div>
                                                </TabsContent>
                                                <TabsContent value="status" className="mt-0 min-h-[400px]">
                                                    <div className="flex flex-col gap-8">
                                                        <div className="flex justify-between gap-10 items-center">
                                                            <Label className="flex-1 flex flex-col gap-2 cursor-pointer" htmlFor="close-discussion-switch">
                                                                <h3 className="text-[16px] font-semibold">Đóng cuộc thảo luận</h3>
                                                                <p className="text-sm opacity-50 dark:font-light">Khi đóng cuộc thảo luận, người dùng sẽ không thể tham gia vào cuộc thảo luận này.</p>
                                                            </Label>
                                                            <Switch checked={discussion?.status === "CLOSED"} id="close-discussion-switch" onCheckedChange={() => handleToggleDiscussionStatus()} />
                                                        </div>
                                                        <div className="flex justify-between gap-5 items-center">
                                                            <Label className="flex-1 flex flex-col gap-1.5">
                                                                <h3 className="text-[16px] font-semibold">Xoá cuộc thảo luận này</h3>
                                                                <p className="text-sm opacity-50 dark:font-light">Sau khi xoá, sẽ không thể truy cập được.</p>
                                                            </Label>
                                                            <Dialog>
                                                                <DialogTrigger>
                                                                    <Button variant="destructive" size="sm" className="border border-destructive/70 bg-destructive/10 hover:bg-destructive/20 dark:bg-destructive/40 dark:hover:bg-destructive/50 text-destructive dark:text-white">
                                                                        <Trash2 className="w-4 h-4 mr-2" />Xoá cuộc thảo luận
                                                                    </Button>
                                                                </DialogTrigger>
                                                                <DialogContent>
                                                                    <DialogHeader>
                                                                        <DialogTitle>Xoá cuộc thảo luận này?</DialogTitle>
                                                                    </DialogHeader>
                                                                    <DialogDescription>
                                                                        Sau khi xoá, cuộc thảo luận này và mọi dữ liệu liên quan sẽ không thể truy cập được nữa.
                                                                    </DialogDescription>
                                                                    <DialogFooter>
                                                                        <DialogClose asChild>
                                                                            <Button variant="ghost">Đóng</Button>
                                                                        </DialogClose>
                                                                        <DialogClose asChild onClick={() => handleDeleteDiscussion()}>
                                                                            <Button variant="destructive">Xoá cuộc thảo luận</Button>
                                                                        </DialogClose>
                                                                    </DialogFooter>
                                                                </DialogContent>
                                                            </Dialog>
                                                        </div>
                                                    </div>
                                                </TabsContent>
                                            </div>
                                        </Tabs>
                                    </div>
                                </DialogContent>
                            </Dialog>
                        }
                    </div>
                    <div className="flex flex-col gap-4 bg-secondary/40 dark:bg-secondary/50 border p-4 px-5 rounded-lg">
                        <div className="flex justify-between items-center">
                            <div className="flex gap-2 items-center text-sm">
                                <Avatar className="size-6">
                                    <AvatarImage className="w-full h-full rounded-full border" src={discussion?.author?.avatar_url} />
                                </Avatar>
                                <p className="font-bold text-[15px]">
                                    {discussion?.author?.username}
                                </p>
                                <p className="opacity-70 flex items-center gap-3 ml-1"><i className="fa-solid fa-circle text-[3px]"></i>{formatTimeAgo(discussion?.createdAt, "vi")}</p>
                            </div>
                        </div>
                        <p className="mb-0.5">
                            {discussion?.description}
                        </p>
                    </div>
                </BlurFade>
                <BlurFade className="flex flex-col gap-4" delay={0.3} yOffset={0} blur="2px">
                    <div className="flex justify-between items-center">
                        <span className="font-semibold">
                            Các câu trả lời
                            <Badge variant="secondary" className="px-1.5 rounded-sm ml-2 inline">
                                {comments?.length}
                            </Badge>
                        </span>
                        <Select value={filter} onValueChange={(value) => {
                            setFilter(value);
                            filterComments(comments, value);
                        }}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="useful">Được đề xuất</SelectItem>
                                <SelectItem value="lastest">Mới nhất</SelectItem>
                                <SelectItem value="oldest">Cũ nhất</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        {
                            filteredComments.length > 0 ?
                                <div className="flex flex-col gap-5">
                                    {
                                        filteredComments.map((comment, index) => (
                                            <BlurFade key={comment.id} delay={0.15 + index * 0.1} yOffset={0} className="flex flex-col gap-4 bg-secondary/30 dark:bg-secondary/30 border p-4 px-5 rounded-lg">
                                                <div className="flex justify-between items-center">
                                                    <div className="flex gap-2 items-center text-sm">
                                                        <Avatar className="size-6">
                                                            <AvatarImage className="w-full h-full rounded-full border" src={comment?.author?.avatar_url} />
                                                        </Avatar>
                                                        <p className="font-bold text-[15px]">
                                                            {comment?.author?.username}
                                                        </p>
                                                        <p className="opacity-70 flex items-center gap-3 ml-1"><i className="fa-solid fa-circle text-[3px]"></i>{formatTimeAgo(comment?.createdAt, "vi")}</p>
                                                    </div>
                                                    {
                                                        comment?.author?.username === loginContext?.user?.username ?
                                                            <Dialog>
                                                                <DropdownMenu>
                                                                    <DropdownMenuTrigger>
                                                                        <Button size="icon" variant="ghost" className="size-7">
                                                                            <Ellipsis className="w-4 h-4" />
                                                                        </Button>
                                                                    </DropdownMenuTrigger>
                                                                    <DropdownMenuContent side="bottom" align="end">
                                                                        <DropdownMenuItem className="cursor-pointer pr-4" onClick={() => {
                                                                            setShowEditCommentDialog(!showEditCommentDialog);
                                                                            setEditComment({
                                                                                id: comment.id,
                                                                                description: comment.description
                                                                            });
                                                                        }}><Pencil className="size-[14px] mr-2" />Chỉnh sửa</DropdownMenuItem>
                                                                        <DialogTrigger asChild className="cursor-pointer pr-4">
                                                                            <DropdownMenuItem><Trash2 className="size-[14px] mr-2" />Xoá bình luận</DropdownMenuItem>
                                                                        </DialogTrigger>
                                                                    </DropdownMenuContent>
                                                                </DropdownMenu>
                                                                <DialogContent>
                                                                    <DialogHeader>
                                                                        <DialogTitle>Bạn có chắc có muốn xoá bình luận này?</DialogTitle>
                                                                    </DialogHeader>
                                                                    <DialogDescription>
                                                                        Sau khi xoá, bình luận này sẽ không thể hiển thị trở lại.
                                                                    </DialogDescription>
                                                                    <DialogFooter className="mt-4">
                                                                        <DialogClose asChild>
                                                                            <Button variant="ghost">Hủy</Button>
                                                                        </DialogClose>
                                                                        <DialogClose asChild onClick={() => handleDeleteComment(comment.id)}>
                                                                            <Button variant="destructive">Tôi hiểu và muốn xoá</Button>
                                                                        </DialogClose>
                                                                    </DialogFooter>
                                                                </DialogContent>
                                                            </Dialog> :
                                                            <DropdownMenu>
                                                                <DropdownMenuTrigger>
                                                                    <Button size="icon" variant="ghost" className="size-7">
                                                                        <Ellipsis className="w-4 h-4" />
                                                                    </Button>
                                                                </DropdownMenuTrigger>
                                                                <DropdownMenuContent side="bottom" align="end">
                                                                    <DropdownMenuItem className="cursor-pointer pr-4"><Flag className="size-[14px] mr-2" />Báo cáo</DropdownMenuItem>
                                                                </DropdownMenuContent>
                                                            </DropdownMenu>
                                                    }
                                                </div>
                                                <p>{comment.description}</p>
                                                <div className="flex gap-3 items-center">
                                                    <Button
                                                        variant={comment?.liked_by.includes(loginContext?.user?.username as string) ? "default" : "outline"}
                                                        size="sm"
                                                        className="p-2.5 pr-3 h-8"
                                                        onClick={() => handleToggleLikeComment(comment.id)}
                                                    >
                                                        <ThumbsUp className="size-4 mr-1.5" />
                                                        <span>
                                                            {comment?.liked_by.length}
                                                        </span>
                                                    </Button>
                                                    <AvatarCircles numPeople={comment?.liked_by.length - 5} avatarUrls={comment?.liked_avatar.slice(0, 5)} size={8} showPlus={comment?.liked_by.length > 5} />
                                                </div>
                                            </BlurFade>
                                        ))
                                    }
                                </div> :
                                <BlurFade delay={0.1} yOffset={0} className="min-h-[300px] flex items-center justify-center flex-col gap-5 border rounded-lg bg-secondary/10">
                                    <img src={NoRecored} className="size-[120px] bg-secondary/60 dark:bg-secondary/20 rounded-full" />
                                    <span className="text-sm opacity-60">Chưa có câu trả lời nào</span>
                                </BlurFade>
                        }
                    </div>
                </BlurFade>
                {
                    discussion?.status === "OPEN" &&
                    <BlurFade className="flex flex-col gap-3" delay={0.4} yOffset={0} blur="2px">
                        <span className="font-semibold">Viết câu trả lời của bạn</span>
                        <AutosizeTextarea
                            placeholder="Nội dung câu trả lời"
                            className="rounded-lg bg-secondary/10 dark:bg-secondary/20 placeholder:italic"
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            spellCheck={false}
                        />
                        <Button className="ml-auto px-4" size="sm" disabled={newComment.length === 0} onClick={() => handleCreateComment()}>Gửi câu trả lời</Button>
                    </BlurFade>
                }
                <Dialog open={showEditCommentDialog} onOpenChange={() => setShowEditCommentDialog(!showEditCommentDialog)}>
                    <DialogContent className="max-w-[600px]">
                        <DialogHeader>
                            <DialogTitle>Chỉnh sửa bình luận</DialogTitle>
                        </DialogHeader>
                        <AutosizeTextarea
                            placeholder="Nội dung bình luận"
                            className="rounded-lg bg-secondary/10 dark:bg-secondary/20 placeholder:italic max-h-"
                            value={editComment.description}
                            onChange={(e) => setEditComment({ ...editComment, description: e.target.value })}
                        />
                        <DialogFooter className="mt-4">
                            <DialogClose asChild>
                                <Button variant="ghost">Hủy</Button>
                            </DialogClose>
                            <DialogClose asChild onClick={() => handleEditComment(editComment.id)}>
                                <Button>Chỉnh sửa</Button>
                            </DialogClose>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
};

export default Discussion;