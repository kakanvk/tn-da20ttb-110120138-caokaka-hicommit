import { Link, useParams } from "react-router-dom";

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"

import { Badge } from "@/components/ui/badge"
import RingProgress from "@/components/ui/ringProcess";
import { CornerDownRight, CalendarDays, UsersRound, GitMerge, Copy, ChevronRight, MessageCircle, Share2, History, Activity, BarChartBig } from 'lucide-react';
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import { Button } from "@/components/ui/button";

import { Separator } from "@/components/ui/separator"

import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card"

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
    Command,
    CommandEmpty,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"

import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { useEffect, useState } from "react";
import { getCourseById, joinToCourse } from "@/service/API/Course";
import { formatTimeAgo } from "@/service/DateTimeService";
import { Input } from "@/components/ui/input";
import { useLogin } from "@/service/LoginContext";
import { toggleFavouriteCourse } from "@/service/API/User";
import toast from "react-hot-toast";
import { getMySubmited } from "@/service/API/Submission";
import BlurFade from "@/components/magicui/blur-fade";
import Loader from "@/components/ui/loader";

function Course() {

    const { course_id } = useParams();
    const [courseData, setCourseData] = useState<any>({});
    const [mySubmited, setMySubmited] = useState<any>({});
    const [mergedProblems, setMergedProblems] = useState<any>([]);
    const [inputKey, setInputKey] = useState<string>("");

    const [loading, setLoading] = useState(false);

    const loginContext = useLogin();

    const handleGetCourseData = async () => {
        const response = await getCourseById(course_id as string);
        setCourseData(response);
        console.log(response);
    };

    const handleGetMySubmited = async () => {
        const response = await getMySubmited();
        setMySubmited(response);
    }

    const handleMergeProblem = async () => {
        let mergedProblems: any = [];

        courseData?.units?.map((unit: any) => {
            unit?.children?.map((problem: any) => {
                mergedProblems.push({
                    slug: problem.slug,
                    status: mySubmited[problem.slug] ? mySubmited[problem.slug] : "NONE"
                });
            });
        });

        setMergedProblems(mergedProblems);
    }

    const handleJoinCourse = async () => {
        try {
            setLoading(true);
            const response = await toast.promise(
                joinToCourse(courseData.id as string, inputKey as string),
                {
                    loading: 'Đang kiểm tra...',
                    success: 'Tham gia khoá học thành công!',
                    error: 'Mã tham gia không chính xác!'
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
            console.log(response);
            handleGetCourseData();
            setInputKey("");
            setTimeout(() => {
                setLoading(false);
            }, 1000);
        } catch (error) {
            setInputKey("");
            setTimeout(() => {
                setLoading(false);
            }, 1000);
            console.error('Error joining course:', error);
        }
    }

    const handleAddFavouriteCourse = async (e: any, courseId: string) => {
        e.preventDefault();
        try {
            const response = await toast.promise(
                toggleFavouriteCourse(courseId),
                {
                    loading: 'Đang lưu...',
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
                });
            loginContext.setUser({
                ...loginContext.user,
                favourite_course: response.favourite_course
            });
        } catch (error) {
            console.error('Error adding favourite course:', error);
        }
    }

    useEffect(() => {
        handleMergeProblem();
    }, [courseData, mySubmited]);

    useEffect(() => {
        handleGetCourseData();
        handleGetMySubmited();
    }, []);

    return (
        <div className="Course p-6 px-8 flex flex-col gap-8">
            {
                loading &&
                <Loader />
            }
            <Breadcrumb>
                <BlurFade delay={0.1} yOffset={0}>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink asChild>
                                <Link to="/courses">Các khoá học</Link>
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbLink href="">
                                {courseData?.name}
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </BlurFade>
            </Breadcrumb>
            <div className="flex gap-8 items-start relative mb-4">
                <div className="flex-1 flex flex-col gap-8 mb-8">
                    <BlurFade delay={0.15} yOffset={0}>
                        <div className="flex flex-col gap-5">
                            <div className="flex justify-between items-start">
                                <div className="flex flex-col gap-2">
                                    <h1 className="text-3xl font-bold">
                                        <span className="mr-2.5">{courseData?.name}</span>
                                        {
                                            courseData.class_name &&
                                            <Badge variant="default" className="rounded px-1.5 -translate-y-1.5">{courseData?.class_name}</Badge>
                                        }
                                    </h1>
                                    <div className="flex gap-2 items-center text-sm">
                                        <span className="opacity-70 flex items-center gap-2"><CornerDownRight className="w-3" />Được tạo bởi</span>
                                        <HoverCard openDelay={300}>
                                            <HoverCardTrigger>
                                                <Badge className="gap-1.5 p-1 pr-2 hover:bg-secondary cursor-pointer" variant="outline">
                                                    <Avatar>
                                                        <AvatarImage className="w-5 aspect-square rounded-full border" src={courseData?.author?.avatar_url} />
                                                    </Avatar>
                                                    <span className="font-semibold text-[13px] -translate-y-[1px]">{courseData?.author?.username}</span>
                                                </Badge>
                                            </HoverCardTrigger>
                                            <HoverCardContent className="w-70" side="bottom" align="start">
                                                <div className="flex gap-4">
                                                    <Avatar>
                                                        <AvatarImage className="w-14 rounded-full" src={courseData?.author?.avatar_url} />
                                                    </Avatar>
                                                    <div className="space-y-1">
                                                        <h4 className="text-sm font-semibold text-green-600 dark:text-green-500">
                                                            @{courseData?.author?.username}
                                                            {(courseData?.author?.role === "ADMIN" || courseData?.author?.role === "TEACHER") && <i className="fa-solid fa-circle-check text-[10px] text-primary ml-1 -translate-y-[1px]"></i>}
                                                        </h4>
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
                                        <span className="opacity-70 flex items-center gap-2">
                                            <i className="fa-solid fa-circle text-[3px]"></i>
                                            {formatTimeAgo(courseData?.createdAt, "vi")}
                                        </span>
                                        <Dialog>
                                            <TooltipProvider delayDuration={100}>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <DialogTrigger>
                                                            <Badge className="text-green-600 dark:text-green-500 flex gap-1.5 border-primary px-2 py-0 rounded-md hover:bg-secondary cursor-pointer ml-2" variant="outline">
                                                                <UsersRound className="w-3.5" />
                                                                <span>{courseData?.members?.length}</span>
                                                            </Badge>
                                                        </DialogTrigger>
                                                    </TooltipTrigger>
                                                    <TooltipContent side="bottom">
                                                        Đã tham gia
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                            <DialogContent className="max-w-[600px]">
                                                <DialogHeader className="mb-3">
                                                    <DialogTitle className="mb-2 flex items-center">
                                                        Danh sách tham gia
                                                        <Badge className="w-fit text-green-600 dark:text-green-500 flex gap-1.5 border-primary px-1.5 py-0 rounded-sm ml-2 translate-y-[1px]" variant="outline">
                                                            <span>{courseData?.members?.length}</span>
                                                        </Badge>
                                                    </DialogTitle>
                                                    <DialogDescription>
                                                        <Command className="bg-transparent">
                                                            <CommandInput placeholder="Tìm kiếm..." />
                                                            <CommandList className="mt-2">
                                                                <CommandEmpty>Không có kết quả phù hợp.</CommandEmpty>
                                                                {
                                                                    courseData?.members && courseData?.members.map((member: any) => (
                                                                        <CommandItem className="gap-2.5 p-2.5 px-3 mb-1" key={member?.id}>
                                                                            <div className="flex gap-3 items-center">
                                                                                <Avatar>
                                                                                    <AvatarImage className="w-10 rounded-full border" src={member?.User ? member?.User?.avatar_url : 'https://img.freepik.com/premium-vector/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-vector-illustration_561158-3383.jpg'} />
                                                                                </Avatar>
                                                                                <div className="flex flex-col">
                                                                                    {
                                                                                        member?.User ?
                                                                                            <p className="text-sm font-medium">
                                                                                                {member?.User?.username}
                                                                                                {(member?.User?.role === "ADMIN" || member?.User?.role === "TEACHER") && <i className="fa-solid fa-circle-check text-[10px] text-primary ml-1 -translate-y-[1px]"></i>}
                                                                                                {member?.User?.username === loginContext?.user?.username && <span className="text-primary font-medium italic"> (Bạn)</span>}
                                                                                            </p> :
                                                                                            <p className="text-[13px] font-medium italic text-primary">(Chờ đăng nhập)</p>
                                                                                    }
                                                                                    <p className="opacity-50">
                                                                                        {member?.email}
                                                                                    </p>
                                                                                </div>
                                                                            </div>
                                                                        </CommandItem>
                                                                    ))
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
                                </div>
                                <div className="flex gap-2">
                                    {/* <TooltipProvider delayDuration={100}>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button size="icon" variant="outline"><MessageCircle className="w-4" /></Button>
                                            </TooltipTrigger>
                                            <TooltipContent side="bottom">
                                                Mở đoạn chat
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                    <TooltipProvider delayDuration={100}>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button size="icon" variant="outline"><Share2 className="w-4" /></Button>
                                            </TooltipTrigger>
                                            <TooltipContent side="bottom">
                                                Chia sẻ khoá học
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider> */}
                                    <TooltipProvider delayDuration={100}>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Link to={`analysis`}>
                                                    <Button size="icon" variant="outline"><BarChartBig className="w-4" /></Button>
                                                </Link>
                                            </TooltipTrigger>
                                            <TooltipContent side="bottom">
                                                Phân tích dữ liệu
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                    <TooltipProvider delayDuration={100}>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button variant={`${loginContext.user.favourite_course.includes(courseData?.id) ? 'default' : 'outline'}`} size="icon" onClick={(e) => handleAddFavouriteCourse(e, courseData?.id)}>
                                                    <i className="fa-regular fa-star"></i>
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent side="bottom">
                                                Đánh dấu khoá học này
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                </div>
                            </div>
                            <Separator />
                        </div>
                    </BlurFade>

                    <BlurFade delay={0.15} >
                        <div className="w-full flex flex-col gap-2">
                            <span className="text-sm font-medium text-green-600 dark:text-green-500">Thông tin khoá học:</span>
                            <div
                                className="ck-content hicommit-content leading-7 text-justify flex-1"
                                dangerouslySetInnerHTML={{ __html: courseData?.description }}
                            />
                        </div>
                    </BlurFade>
                    {
                        courseData.isJoined &&
                        <div className="flex flex-col gap-4">
                            <span className="text-[16px] font-medium text-green-600 dark:text-green-500">Bài tập thực hành:</span>
                            <Accordion type="multiple">
                                {
                                    courseData?.units && courseData?.units.map((unit: any, index: number) => (
                                        <BlurFade delay={0.15 + index * 0.05} >
                                            <AccordionItem value={unit?.id} key={unit?.id}>
                                                <AccordionTrigger className="hover:no-underline">
                                                    <span className="flex items-center font-semibold text-lg">
                                                        <GitMerge className="w-5 mr-2 text-green-600 dark:text-green-500" />{unit?.name}
                                                    </span>
                                                </AccordionTrigger>
                                                <AccordionContent className="text-base flex flex-col gap-1.5">
                                                    {
                                                        unit?.children.length > 0 ? unit?.children.map((problem: any, index: number) => (
                                                            <Link className="hover:bg-zinc-100 dark:hover:bg-zinc-900 p-2 pl-3.5 rounded-lg flex items-center justify-between group/work" to={`/problem/${problem?.slug || problem?.id}`} key={problem?.id}>
                                                                <div className="flex items-center gap-2">
                                                                    {mySubmited[problem?.slug] === "PASSED" && <i className="fa-solid fa-circle-check text-green-600"></i>}
                                                                    {mySubmited[problem?.slug] === "FAILED" && <i className="fa-solid fa-circle-xmark text-red-500"></i>}
                                                                    {mySubmited[problem?.slug] === "ERROR" && <i className="fa-solid fa-circle-exclamation text-amber-500"></i>}
                                                                    {mySubmited[problem?.slug] === "COMPILE_ERROR" && <i className="fa-solid fa-triangle-exclamation text-zinc-400"></i>}
                                                                    {(mySubmited[problem?.slug] === "PENDING" || !mySubmited[problem?.slug]) && <i className="fa-solid fa-circle-minus text-zinc-400"></i>}
                                                                    <span className="line-clamp-1">{problem.name}</span>
                                                                    <div className="flex gap-2 items-center">
                                                                        {
                                                                            problem?.tags?.length > 0 && problem?.tags.map((tag: any) => (
                                                                                <Badge variant="secondary" className="px-1.5 rounded-sm">
                                                                                    {tag}
                                                                                </Badge>
                                                                            ))
                                                                        }
                                                                    </div>
                                                                </div>
                                                                <ChevronRight className="w-4 invisible group-hover/work:visible" />
                                                            </Link>
                                                        )) : <span className="text-sm text-muted-foreground py-2">Không có bài tập nào trong phần này</span>
                                                    }
                                                </AccordionContent>
                                            </AccordionItem>
                                        </BlurFade>
                                    ))
                                }
                            </Accordion>
                        </div>
                    }
                </div>
                {
                    courseData.isJoined ?
                        <BlurFade delay={0.3} className="sticky top-6 w-[270px] bg-zinc-100/80 dark:bg-zinc-900 border rounded-lg flex flex-col items-center p-5 px-6">
                            <span className="font-semibold">Tiến độ khoá học</span>
                            <RingProgress radius={90} stroke={12} progress={mergedProblems.length > 0 ? ((mergedProblems.filter((problem: any) => problem.status === "PASSED").length / mergedProblems.length) * 100).toFixed(0) : 0 as any} textSize={28} />
                            <div className="w-full font-medium flex flex-col gap-4 mt-5">
                                <div className="flex gap-3 justify-start items-center">
                                    <div className="flex items-center gap-2.5">
                                        <i className="fa-solid fa-circle-check text-green-600"></i>
                                        <span className="text-sm">Kết quả chính xác:</span>
                                    </div>
                                    <Badge variant="secondary" className="rounded px-1.5">
                                        {mergedProblems.filter((problem: any) => problem.status === "PASSED").length}/{mergedProblems.length}
                                    </Badge>
                                </div>
                                <div className="flex gap-3 justify-start items-center">
                                    <div className="flex items-center gap-2.5">
                                        <i className="fa-solid fa-circle-xmark text-red-500"></i>
                                        <span className="text-sm">Sai kết quả:</span>
                                    </div>
                                    <Badge variant="secondary" className="rounded px-1.5">
                                        {mergedProblems.filter((problem: any) => problem.status === "FAILED").length}/{mergedProblems.length}
                                    </Badge>
                                </div>
                                <div className="flex gap-3 justify-start items-center">
                                    <div className="flex items-center gap-2.5">
                                        <i className="fa-solid fa-circle-exclamation text-amber-500"></i>
                                        <span className="text-sm">Gặp vấn đề:</span>
                                    </div>
                                    <Badge variant="secondary" className="rounded px-1.5">
                                        {mergedProblems.filter((problem: any) => problem.status === "ERROR").length}/{mergedProblems.length}
                                    </Badge>
                                </div>
                                <div className="flex gap-3 justify-start items-center">
                                    <div className="flex items-center gap-2.5">
                                        <i className="fa-solid fa-triangle-exclamation text-zinc-400"></i>
                                        <span className="text-sm">Lỗi biên dịch:</span>
                                    </div>
                                    <Badge variant="secondary" className="rounded px-1.5">
                                        {mergedProblems.filter((problem: any) => problem.status === "COMPILE_ERROR").length}/{mergedProblems.length}
                                    </Badge>
                                </div>
                                <div className="flex gap-3 justify-start items-center">
                                    <div className="flex items-center gap-2.5">
                                        <i className="fa-solid fa-circle-minus text-zinc-400"></i>
                                        <span className="text-sm">Chưa nộp bài:</span>
                                    </div>
                                    <Badge variant="secondary" className="rounded px-1.5">
                                        {mergedProblems.filter((problem: any) => problem.status === "NONE").length}/{mergedProblems.length}
                                    </Badge>
                                </div>
                            </div>
                        </BlurFade> :
                        <BlurFade delay={0.3} className="sticky top-6 w-[320px] flex flex-col items-center gap-2">
                            <div className="bg-secondary dark:bg-secondary/30 w-full aspect-[3/2] relative rounded-lg overflow-hidden border">
                                <img src={courseData?.thumbnail} />
                            </div>
                            <h1 className="font-semibold w-full">
                                <Badge variant="secondary" className="rounded px-1.5 -translate-y-[1px] mr-2">{courseData?.class_name}</Badge>
                                {courseData?.name}
                            </h1>
                            <p className="text-[13px] w-full mt-3">
                                <i className="fa-solid fa-circle-info mr-2 opacity-40 text-xs"></i>
                                <span className="opacity-60">Bạn chưa tham gia khoá học này</span>
                            </p>
                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button className="w-full">
                                        {!courseData?.isPublic && <i className="fa-solid fa-lock mr-2 text-xs"></i>}
                                        Tham gia ngay
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Xác nhận tham gia khoá học</DialogTitle>
                                    </DialogHeader>
                                    <DialogDescription className="-mt-0.5 leading-6">
                                        Bạn có chắc chắn rằng bạn muốn tham gia khoá học này. {courseData?.join_key && 'Vui lòng nhập mã tham gia để tiếp tục.'}
                                    </DialogDescription>
                                    {
                                        !courseData?.isPublic &&
                                        <Input
                                            placeholder="Mã tham gia"
                                            className="placeholder:italic"
                                            value={inputKey}
                                            onChange={(e) => setInputKey(e.target.value)}
                                        />
                                    }
                                    <DialogFooter className="mt-4">
                                        <DialogClose asChild>
                                            <Button variant="ghost">
                                                Đóng
                                            </Button>
                                        </DialogClose>
                                        <DialogClose asChild>
                                            <Button onClick={() => handleJoinCourse()}>Xác nhận</Button>
                                        </DialogClose>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </BlurFade>
                }
            </div>
        </div>
    );
};

export default Course;