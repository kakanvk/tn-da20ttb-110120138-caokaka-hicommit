import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import RingProgress from "@/components/ui/ringProcess";
import { ArrowRight, CalendarDays, ChevronRight, CornerDownRight, Eye, Filter, History, Lock, PencilLine, Pin, Play, Search, UsersRound } from "lucide-react";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card"
import { Avatar, AvatarImage } from "@/components/ui/avatar";
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

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { DialogClose } from "@radix-ui/react-dialog";
import { Link, useNavigate } from "react-router-dom";
import ShineBorder from "@/components/magicui/shine-border";
import BlurFade from "@/components/magicui/blur-fade";
import { useEffect, useState } from "react";
import { getContests, getJoinedContest, joinContest } from "@/service/API/Contest";
import { formatTimeAgo, timestampChange, timestampToDateTime } from "@/service/DateTimeService";
import moment from "moment";
import toast from "react-hot-toast";

import timeart from "@/assets/imgs/Time_Art.png";
import flashart from "@/assets/imgs/Flash_Art.png";

function Contests() {

    const navigate = useNavigate();

    const [data, setData] = useState<any[]>([]);
    const [joinKey, setJoinKey] = useState<string>("");
    const [joinedContest, setJoinedContest] = useState<any>();

    const [filteredContests, setFilteredContests] = useState<any[]>([]);
    const [searchKeyword, setSearchKeyword] = useState<string>("");

    const getData = async () => {
        const response = await getContests();
        console.log(response);
        setData(response);
        setFilteredContests(response);
    }

    const filterContests = () => {
        const filtered = data.filter((contest) =>
            contest.name.toLowerCase().includes(searchKeyword.toLowerCase())
        );
        setFilteredContests(filtered);
    }

    useEffect(() => {
        filterContests();
    }, [searchKeyword, data]);

    const getJoinedContestData = async () => {
        const response = await getJoinedContest();
        console.log(response);
        setJoinedContest(response);
    }

    useEffect(() => {
        getData();
        getJoinedContestData();
    }, []);

    const pushError = (message: string) => {
        toast.error(message, {
            style: {
                borderRadius: '8px',
                background: '#222',
                color: '#fff',
                paddingLeft: '15px',
                fontFamily: 'Plus Jakarta Sans',
                maxWidth: '700px',
            }
        });
    }

    const handleConfirmJoinContest = async (_id: any, _public: any) => {
        if (!_public && joinKey === "") {
            pushError("Mã tham gia không được để trống");
            return;
        }

        setJoinKey("");

        const response = await toast.promise(
            joinContest(_id as any, joinKey),
            {
                loading: 'Đang kiểm tra...',
                success: 'Tham gia cuộc thi thành công',
                error: (err) => `${err.response.data.message}`,
            },
            {
                style: {
                    borderRadius: '8px',
                    background: '#222',
                    color: '#fff',
                    paddingLeft: '15px',
                    fontFamily: 'Plus Jakarta Sans',
                    maxWidth: '600px',
                }
            });

        setTimeout(() => {
            navigate(`/contest/${_id}`);
        }, 500);

    }

    return (
        <div className="Contest p-6 px-7">
            <div className="flex flex-col gap-10">
                <ShineBorder
                    className="p-0 flex w-full flex-col items-center justify-center overflow-hidden rounded-lg border bg-background md:shadow-lg"
                    color={["#84cc16", "#22c55e", "#16a34a"]}
                >
                    <div className="p-4 pt-3 flex justify-between items-center w-full">
                        <div className="flex items-center gap-3">
                            <img src={flashart} alt="flashart" className="w-[25px]" />
                            <div>
                                <h2 className="text-lg font-bold">Olympic Tin học sinh viên Việt Nam 2024</h2>
                                <p className="text-sm dark:opacity-70">Cuộc thi lập trình dành cho học sinh, sinh viên lớn nhất Việt Nam được tổ chức hằng năm</p>
                            </div>
                        </div>
                        <Button>Tìm hiểu thêm<ArrowRight className="w-4 h-4 ml-2" /></Button>
                    </div>
                    {/* <div className="w-full text-white border rounded-lg bg-secondary/30 flex items-center bg-gradient-to-r from-primary via-primary/50 dark:via-primary/30 via-40% to-transparent to-90%">
                    </div> */}
                </ShineBorder>
                <div className="flex flex-col gap-6 relative">
                    <div className="flex items-end justify-between">
                        <div className="flex gap-2 items-center">
                            <h2 className="text-lg font-semibold">Các cuộc thi trên hệ thống</h2>
                            <Badge variant="secondary" className="px-1.5 rounded-sm inline">
                                {data?.length}
                            </Badge>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="relative max-w-[400px] flex-1">
                                <Search className="absolute left-3 top-[11px] h-4 w-4 text-muted-foreground" />
                                <Input
                                    type="search"
                                    placeholder="Tìm kiếm cuộc thi"
                                    className="w-full rounded-md pl-9 flex-1 bg-transparent"
                                    value={searchKeyword}
                                    onChange={(e) => setSearchKeyword(e.target.value)}
                                />
                            </div>
                            <Select defaultValue="all">
                                <SelectTrigger className="w-[200px] bg-transparent">
                                    <div className="flex items-center">
                                        <Filter className="w-[14px] h-[14px] mr-2 mt-0.5" /><SelectValue />
                                    </div>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Tất cả</SelectItem>
                                    <SelectItem value="lastest">Mới nhất</SelectItem>
                                    <SelectItem value="public">Công khai</SelectItem>
                                    <SelectItem value="private">Không công khai</SelectItem>
                                    <SelectItem value="open">Đang diễn ra</SelectItem>
                                    <SelectItem value="closed">Đã kết thúc</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="flex flex-col gap-5">
                        {
                            data.map((contest, index) => {
                                return (
                                    <BlurFade key={index} delay={0.15 + index * 0.1}>
                                        <div className="w-full flex gap-6 rounded-lg items-center justify-between bg-secondary/30 p-5 px-7 pb-7 border">
                                            <div className="flex flex-col items-start gap-4 flex-1">
                                                <div className="flex flex-col gap-2 items-start justify-start">
                                                    <Link className="font-semibold text-lg hover:text-primary dark:hover:text-green-500" to={`/contest/${contest?.id}`}>
                                                        {
                                                            contest?.pinned &&
                                                            <Badge variant="secondary" className="border border-foreground/10 italic rounded-md bg-secondary/50 dark:bg-secondary/60 text-[12px] p-0.5 px-2 font-normal leading-5 text-nowrap mr-1.5">
                                                                <Pin className="size-[12px] mr-1 inline" /> Đã ghim
                                                            </Badge>
                                                        }
                                                        <span className="mr-2 font-bold">{contest?.name}</span>
                                                        {
                                                            contest.public &&
                                                            <Badge variant="outline" className="text-[11px] p-0 px-1.5 pr-2 font-normal leading-5">
                                                                <Eye className="size-[11px] mr-1.5" />Công khai
                                                            </Badge>
                                                        }
                                                    </Link>
                                                    <div className="flex gap-2 items-center text-sm justify-start flex-wrap">
                                                        <span className="opacity-70 flex items-center gap-2">Được tạo bởi</span>
                                                        <HoverCard openDelay={300}>
                                                            <HoverCardTrigger>
                                                                <Badge className="gap-1.5 p-1 pr-2 hover:bg-secondary cursor-pointer" variant="outline">
                                                                    <Avatar className="w-5 h-5">
                                                                        <AvatarImage className="rounded-full border" src={contest?.creator?.avatar_url} />
                                                                    </Avatar>
                                                                    <span className="font-semibold text-[13px] -translate-y-[1px]">{contest?.creator?.username}</span>
                                                                </Badge>
                                                            </HoverCardTrigger>
                                                            <HoverCardContent className="w-70" side="bottom" align="start">
                                                                <div className="flex gap-4">
                                                                    <Avatar>
                                                                        <AvatarImage className="w-14 rounded-full" src={contest?.creator?.avatar_url} />
                                                                    </Avatar>
                                                                    <div className="space-y-1">
                                                                        <h4 className="text-sm font-semibold text-green-600 dark:text-green-500">@{contest?.creator?.username}</h4>
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
                                                        <span className="opacity-70 flex items-center gap-2"><i className="fa-solid fa-circle text-[3px]"></i>{formatTimeAgo(contest.createdAt, "vi")}</span>
                                                        {
                                                            contest.members > 0 &&
                                                            <Badge variant="secondary" className="text-[12px] p-1 px-3 font-normal">
                                                                <UsersRound className="h-3 w-3 mr-2" />{contest.members} người tham gia
                                                            </Badge>
                                                        }
                                                    </div>
                                                </div>
                                                {
                                                    contest?.start_time > moment(new Date().getTime()).unix() ?
                                                        <p className="mt-3 italic">
                                                            <Play className="size-3 inline -translate-y-[1px] mr-2" />Bắt đầu sau
                                                            <span className="font-semibold text-green-600 dark:text-green-500 mx-1.5">
                                                                {timestampChange(contest.start_time - moment(new Date().getTime()).unix()).hours > 0 && `${timestampChange(contest.start_time - moment(new Date().getTime()).unix()).hours} giờ `}{`${timestampChange(contest.start_time - moment(new Date().getTime()).unix()).minutes.toString().padStart(2, "0")} phút`}
                                                            </span>
                                                            nữa
                                                        </p> :
                                                        contest?.end_time > moment(new Date().getTime()).unix() ?
                                                            contest.id === joinedContest?.id as any ?
                                                                <Link to={`/contest/${contest?.id}`}>
                                                                    <Button className="mt-3 px-5 pr-3">
                                                                        Tiếp tục làm bài<ChevronRight className="w-4 h-4 ml-3" />
                                                                    </Button>
                                                                </Link> :
                                                                <div className="flex gap-3 items-center mt-3">
                                                                    <Dialog>
                                                                        <DialogTrigger>
                                                                            <Button className="px-5">Tham gia cuộc thi</Button>
                                                                        </DialogTrigger>
                                                                        <DialogContent>
                                                                            <DialogHeader>
                                                                                <DialogTitle>Xác nhận tham gia cuộc thi</DialogTitle>
                                                                            </DialogHeader>
                                                                            <DialogDescription className="-mt-0.5 leading-6">
                                                                                Bạn có
                                                                                <Badge variant="secondary" className="text-[11px] p-0 px-1 pr-2 leading-5 mx-1">
                                                                                    <History className="size-[14px] mr-1.5" />
                                                                                    {timestampChange(contest.duration).hours > 0 && `${timestampChange(contest.duration).hours} giờ `}
                                                                                    {`${timestampChange(contest.duration).minutes.toString().padStart(2, "0")} phút `}
                                                                                </Badge>để hoàn thành bài thi này. Sau khi hết thời gian, bạn sẽ không thể tiếp tục tham gia cuộc thi này. Bạn chỉ có thể tham gia cuộc thi một lần và trong cùng một thời điểm chỉ có thể tham gia 1 cuộc thi.
                                                                            </DialogDescription>
                                                                            {
                                                                                !contest.public &&
                                                                                <Input placeholder="Mã tham gia" type="search" value={joinKey} className="placeholder:italic" onChange={(e) => setJoinKey(e.target.value)} />
                                                                            }
                                                                            <DialogFooter className="mt-4">
                                                                                <DialogClose asChild>
                                                                                    <Button variant="ghost">
                                                                                        Đóng
                                                                                    </Button>
                                                                                </DialogClose>
                                                                                <DialogClose asChild>
                                                                                    <Button onClick={() => handleConfirmJoinContest(contest?.id, contest?.public)}>Xác nhận</Button>
                                                                                </DialogClose>
                                                                            </DialogFooter>
                                                                        </DialogContent>
                                                                    </Dialog>
                                                                    <Link to={`/contest/${contest?.id}`}>
                                                                        <Button className="px-5 pr-3" variant="secondary">Chi tiết<ChevronRight className="w-4 h-4 ml-2" /></Button>
                                                                    </Link>
                                                                </div> :
                                                            <Link to={`/contest/${contest?.id}`}>
                                                                <Button className="px-5 pr-3 mt-2" variant="secondary">Xem kết quả<ChevronRight className="w-4 h-4 ml-2" /></Button>
                                                            </Link>
                                                }
                                            </div>
                                            <div className="flex flex-col gap-4">
                                                <div className="flex flex-col items-end pr-2 text-sm">
                                                    {
                                                        contest?.start_time > moment(new Date().getTime()).unix() ?
                                                            <span className="italic text-amber-600 dark:text-amber-500 font-semibold dark:font-medium mb-1.5">
                                                                Sắp diễn ra
                                                            </span> :
                                                            contest?.end_time > moment(new Date().getTime()).unix() ?
                                                                <span className="italic text-green-600 dark:text-green-500 font-semibold dark:font-medium mb-1.5">
                                                                    Đang diễn ra
                                                                    <span className="relative inline-flex h-3 w-3 ml-2.5">
                                                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                                                        <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
                                                                    </span>
                                                                </span> :
                                                                <span className="italic text-red-500 font-semibold mb-1">Đã kết thúc</span>
                                                    }
                                                    <p className="text-nowrap font-semibold dark:font-medium my-0.5">
                                                        <span className="text-xs opacity-60 mr-1 italic">Bắt đầu từ </span>
                                                        <span className='text-foreground/70 font-semibold border border-foreground/30 rounded text-[12px] px-0.5 mr-1.5'>{timestampToDateTime(contest?.start_time).time}</span>
                                                        {timestampToDateTime(contest?.start_time).date}
                                                    </p>
                                                    <p className="text-nowrap font-semibold dark:font-medium">
                                                        <span className="text-xs opacity-60 mr-1 italic">đến </span>
                                                        <span className='text-foreground/70 font-semibold border border-foreground/30 rounded text-[12px] px-0.5 mr-1.5'>{timestampToDateTime(contest?.end_time).time}</span>
                                                        {timestampToDateTime(contest?.end_time).date}
                                                    </p>
                                                </div>
                                                <div className="flex flex-col gap-1.5 items-end pr-2">
                                                    <span className="italic font-medium text-sm">Thời gian làm bài</span>
                                                    <Badge variant="secondary" className="text-[11px] p-1 px-3">
                                                        <History className="h-3 w-3 mr-1.5" />
                                                        <span className="text-nowrap">
                                                            {timestampChange(contest.duration).hours > 0 && `${timestampChange(contest.duration).hours} giờ `}
                                                            {`${timestampChange(contest.duration).minutes.toString().padStart(2, "0")} phút `}
                                                        </span>
                                                    </Badge>
                                                </div>
                                            </div>
                                        </div>
                                    </BlurFade>
                                )
                            })
                        }
                    </div>
                    <Pagination className="mt-6">
                        <PaginationContent>
                            <PaginationItem>
                                <PaginationPrevious href="#" />
                            </PaginationItem>
                            <PaginationItem>
                                <PaginationLink href="#">1</PaginationLink>
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

export default Contests;