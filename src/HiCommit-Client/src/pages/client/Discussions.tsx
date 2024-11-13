import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Filter, MessageSquare, Plus, Search } from "lucide-react";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

import { Textarea } from "@/components/ui/textarea"
import { DialogClose } from "@radix-ui/react-dialog";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge";
import { Link, useParams } from "react-router-dom";
import NoRecored from "@/assets/imgs/no-record.svg";
import { useEffect, useState } from "react";
import { createDiscussion, getDiscussions } from "@/service/API/Discussion";
import { formatTimeAgo } from "@/service/DateTimeService";
import { useSocket } from "@/service/SocketContext";
import { useLogin } from "@/service/LoginContext";
import BlurFade from "@/components/magicui/blur-fade";

function Discussions() {

    const loginContext = useLogin();

    const { socket } = useSocket() as any;

    const { problem_id } = useParams<{ problem_id: string }>();

    const [discussions, setDiscussions] = useState<any[]>([]);
    const [filter, setFilter] = useState<string>("all");
    const [filteredDiscussions, setFilteredDiscussions] = useState<any[]>([]);
    const [title, setTitle] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [searchKeyWord, setSearchKeyWord] = useState<string>("");

    const handleGetDiscussions = async () => {
        const data = await getDiscussions(problem_id as any);
        setDiscussions(data);
        handleFilterDiscussions(data, filter);
    }

    const handleFilterDiscussions = (_discussions: any[], _filter: string) => {
        let filtered = _discussions;
        setFilter(_filter);
        if (_filter === "open") {
            filtered = _discussions.filter((discussion) => discussion.status === "OPEN");
        } else if (_filter === "closed") {
            filtered = _discussions.filter((discussion) => discussion.status === "CLOSED");
        } else if (_filter === "only-me") {
            filtered = _discussions.filter((discussion) => discussion.username === loginContext?.user?.username);
        } else if (_filter === "all") {
            filtered = _discussions;
        }
        setFilteredDiscussions(filtered);
        setSearchKeyWord("");
    }

    const handleSearchDiscussions = () => {
        if (searchKeyWord && searchKeyWord.length > 0) {
            const filtered = discussions.filter((discussion) => discussion.title.toLowerCase().includes(searchKeyWord.toLowerCase()));
            setFilteredDiscussions(filtered);
        } else {
            handleFilterDiscussions(discussions, filter);
        }
    }

    const handlePostDiscussion = async () => {

        const data = {
            title: title,
            description: description,
        }

        const response = await createDiscussion(problem_id as any, data);
        setTitle("");
        setDescription("");
    }

    useEffect(() => {
        socket.on('newDiscussion', () => {
            handleGetDiscussions();
        });

        return () => {
            socket.off('newDiscussion');
        };
    }, []);

    useEffect(() => {
        handleGetDiscussions();
    }, [problem_id]);

    useEffect(() => {
        const debounceTimer = setTimeout(() => {
            handleSearchDiscussions()
        }, 200);

        return () => clearTimeout(debounceTimer);
    }, [searchKeyWord, discussions]);

    return (
        <div className="Discussions">
            <div className="flex flex-col gap-4">
                <div className="flex gap-2">
                    <div className="relative ml-auto flex-1">
                        <Search className="absolute left-3 top-[11px] h-4 w-4 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Tìm kiếm ..."
                            className="w-full rounded-md pl-9 flex-1  bg-transparent"
                            value={searchKeyWord}
                            onChange={(e) => setSearchKeyWord(e.target.value)}
                        />
                    </div>
                    <Select value={filter} onValueChange={(value) => {
                        handleFilterDiscussions(discussions, value);
                    }}>
                        <SelectTrigger className="w-[180px] bg-transparent">
                            <div className="flex items-center">
                                <Filter className="size-[13px] mr-2" /><SelectValue />
                            </div>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Tất cả</SelectItem>
                            <SelectItem value="only-me">Câu hỏi của tôi</SelectItem>
                            <SelectItem value="open">Đang mở</SelectItem>
                            <SelectItem value="closed">Đã đóng</SelectItem>
                        </SelectContent>
                    </Select>
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button>
                                Tạo câu hỏi
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-[700px]">
                            <DialogHeader>
                                <DialogTitle>Tạo câu hỏi thảo luận</DialogTitle>
                            </DialogHeader>
                            <div className="flex flex-col gap-4 mt-1">
                                <div className="flex flex-col gap-2">
                                    <span className="text-sm">Tiêu đề</span>
                                    <Input placeholder="Tiêu đề câu hỏi" className="placeholder:italic" value={title} onChange={(e) => setTitle(e.target.value)} spellCheck={false} />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <span className="text-sm">Mô tả</span>
                                    <Textarea placeholder="Mô tả vấn đề" className="placeholder:italic min-h-[6lh]" value={description} onChange={(e) => setDescription(e.target.value)} spellCheck={false} />
                                </div>
                            </div>
                            <DialogFooter className="mt-5">
                                <DialogClose asChild>
                                    <Button variant="ghost">Đóng</Button>
                                </DialogClose>
                                <DialogClose asChild>
                                    <Button onClick={() => handlePostDiscussion()}>Đăng câu hỏi</Button>
                                </DialogClose>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>

                </div>
                {
                    filteredDiscussions.length > 0 ? (
                        <BlurFade delay={0.1} yOffset={0} className="flex flex-col gap-4">
                            {filteredDiscussions.map((discussion, index) => (
                                <BlurFade key={discussion.id} delay={0.15 + index * 0.1} yOffset={0}>
                                    <Link to={`/problem/${problem_id}/discussion/${discussion.id}`} className="border rounded-lg p-3 pb-4 px-5 bg-secondary/20 flex items-center justify-between cursor-pointer">
                                        <div className="flex flex-col gap-1">
                                            <h3 className="">
                                                {discussion.title}
                                                {discussion.status === "OPEN" && <Badge className="ml-2 -translate-y-[1px]">Đang mở</Badge>}
                                                {discussion.status === "CLOSED" && <Badge variant="destructive" className="ml-2 -translate-y-[1px]">Đã đóng</Badge>}
                                            </h3>
                                            <p className="text-sm">
                                                <strong className="text-primary">{discussion?.username}</strong>
                                                <i className="fa-solid fa-circle text-[3px] -translate-y-[3.5px] mx-2 opacity-50"></i>
                                                <span className="opacity-50">{formatTimeAgo(discussion?.createdAt, "vi")}</span>
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-2 opacity-60">
                                            <MessageSquare className="size-4" />
                                            <span className="-translate-y-[1px]">{discussion?.comment_count}</span>
                                        </div>
                                    </Link>
                                </BlurFade>
                            ))}
                        </BlurFade>
                    ) :
                        <BlurFade delay={0.1} yOffset={0} className="min-h-[300px] flex items-center justify-center flex-col gap-5 border rounded-lg bg-secondary/10">
                            <img src={NoRecored} className="size-[120px] 2xl:size-[150px] bg-secondary/60 dark:bg-secondary/20 rounded-full" />
                            <span className="text-sm opacity-60">Chưa có câu hỏi thảo luận nào</span>
                        </BlurFade>
                }
            </div>
        </div>
    );
};

export default Discussions;