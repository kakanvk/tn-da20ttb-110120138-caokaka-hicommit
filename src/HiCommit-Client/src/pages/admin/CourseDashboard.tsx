import { Link, useNavigate, useParams } from "react-router-dom";

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

import { Badge } from "@/components/ui/badge"

import { CornerDownRight, CalendarDays, UsersRound, GitMerge, TrendingUp, Copy, ChevronRight, MessageCircle, Share2, GripVertical, AreaChartIcon, PieChart, Info, KeyRound, EllipsisVertical, Settings, ScanEye, Gem, Users, Key, Plus, Activity, Pencil, ArrowUp, ArrowDown, Trash2, ArrowRight, EyeOff, Eye, Link2, UserPlus, FileUp, FileInput, FileDown } from 'lucide-react';
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import { Button } from "@/components/ui/button";

import { Separator } from "@/components/ui/separator"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

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

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useEffect, useRef, useState } from "react";
import { Label } from "@/components/ui/label";
import { deleteCourseByID, getCourseByIDForAdmin, updateKey, togglePublishCourse, updateUnits, toggleAutoJoin, togglePublicCourse, deleteMemberFromCourse, addMemberToCourse, addMultipleMembersToCourse } from "@/service/API/Course";
import { formatTimeAgo } from "@/service/DateTimeService";
import { set } from "date-fns";
import { createUnit, updateUnitById } from "@/service/API/Unit";
import toast from "react-hot-toast";
import { se } from "date-fns/locale";
import { NodeRendererProps, Tree, useSimpleTree } from "react-arborist";
import CourseTree from "../teacher/CourseTree";
import { useLogin } from "@/service/LoginContext";
import { login } from "@/service/API/Auth";

import Papa from 'papaparse';
import { ScrollArea } from "@/components/ui/scroll-area";
import { handleCopyText } from "@/service/UIService";

const chartData = [
    {
        date: "2024-01-01",
        completed: 85,
    },
    {
        date: "2024-01-02",
        completed: 72,
    },
    {
        date: "2024-01-03",
        completed: 81,
    },
    {
        date: "2024-01-04",
        completed: 62,
    },
    {
        date: "2024-01-05",
        completed: 52,
    },
    {
        date: "2024-01-06",
        completed: 81,
    },
    {
        date: "2024-01-07",
        completed: 70,
    },
]

const chartConfig = {
    desktop: {
        label: "Desktop",
        color: "hsl(var(--chart-1))",
    },
} satisfies ChartConfig;

function CourseDashboard() {

    const { id } = useParams();

    const course_id = id;

    const loginContext = useLogin();

    const navigate = useNavigate();

    const [dataFromAPI, setDataFromAPI] = useState<any[]>([]);
    const [key, setKey] = useState(0);

    const [course, setCourse] = useState<any>({});
    const [members, setMembers] = useState<any[]>([]);

    const [enrolKey, setEnrolKey] = useState("");

    const [newLab, setNewLab] = useState('');

    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const [isOpenAddMember, setIsOpenAddMember] = useState(false);
    const [newMember, setNewMember] = useState('');

    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isOpenCSVUpload, setIsOpenCSVUpload] = useState(false);
    const [membersToAdd, setMembersToAdd] = useState<string[]>([]);

    useEffect(() => {
        setKey(prevKey => prevKey + 1);
        handleUpdateUnit(course_id as string, dataFromAPI);
    }, [dataFromAPI]);

    const handleUpdateKey = async () => {
        try {
            const response = await toast.promise(
                updateKey(course_id as string, { join_key: enrolKey }),
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
                });
            handleGetCourseData();
        } catch (error) {
            console.error('Error updating key:', error);
        }
    }

    const handlePublishCourse = async () => {
        try {
            const response = await toast.promise(
                togglePublishCourse(course_id as string),
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
                });
            handleGetCourseData();
        } catch (error) {
            console.error('Error publishing course:', error);
        }
    }

    const handlePublicCourse = async () => {
        try {
            const response = await toast.promise(
                togglePublicCourse(course_id as string),
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
                });
            handleGetCourseData();
        } catch (error) {
            console.error('Error publishing course:', error);
        }
    }

    const handleUpdateAutoJoin = async () => {
        try {
            const response = await toast.promise(
                toggleAutoJoin(course_id as string),
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
                });
            handleGetCourseData();
        } catch (error) {
            console.error('Error publishing course:', error);
        }
    }

    const handleDeleteCourse = async () => {
        try {
            const response = await toast.promise(
                deleteCourseByID(course_id as string),
                {
                    loading: 'Đang xoá...',
                    success: 'Xoá khoá học thành công',
                    error: 'Xoá khoá học thất bại'
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

            setTimeout(() => {
                navigate("/course-manager");
            }, 500);

            // console.log(response);
        } catch (error) {
            console.error('Error creating lab:', error);
        }
    }

    const handleAddMemberToCourse = async () => {
        setNewMember('');
        const response = await toast.promise(
            addMemberToCourse(course_id as string, newMember),
            {
                loading: 'Đang thêm...',
                success: 'Thêm thành viên thành công',
                error: (err) => `${err.response.data.message}`,
            },
            {
                style: {
                    borderRadius: '8px',
                    background: '#222',
                    color: '#fff',
                    paddingLeft: '15px',
                    fontFamily: 'Plus Jakarta Sans',
                    maxWidth: '700px',
                }
            });

        handleGetCourseData();
    }

    const handleAddMultipleMembersToCourse = async () => {
        console.log(membersToAdd);
        const response = await toast.promise(
            addMultipleMembersToCourse(course_id as string, membersToAdd),
            {
                loading: 'Đang thêm...',
                success: 'Thêm thành viên thành công',
                error: (err) => `${err.response.data.message}`,
            },
            {
                style: {
                    borderRadius: '8px',
                    background: '#222',
                    color: '#fff',
                    paddingLeft: '15px',
                    fontFamily: 'Plus Jakarta Sans',
                    maxWidth: '700px',
                }
            });

        handleGetCourseData();
    }

    const handleCSVUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            Papa.parse(file, {
                complete: (results: any) => {
                    const emails = results.data.slice(1).map((row: any) => row[0]).filter(Boolean);
                    // Gọi API để thêm các email này vào khóa học
                    const uniqueEmails = [...new Set(emails)];
                    console.log(uniqueEmails);
                    setMembersToAdd(uniqueEmails as string[]);
                },
                header: false
            });
            setIsOpenCSVUpload(true);
        }
        // clear file input
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const downloadCSVTemplate = () => {
        const csvContent = "Email\nexample1@example.com\nexample2@example.com";
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", "member_template.csv");
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    const exportMembersToCSV = () => {
        // Chuẩn bị dữ liệu
        const data = [
            ['Email'], // Header
            ...members.map(member => [member.email])
        ];

        // Sử dụng Papa Parse để tạo chuỗi CSV
        const csv = Papa.unparse(data);

        // Tạo Blob và tải xuống file
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", `members_${course?.name || course?.slug}.csv`);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    const handleDeleteMemberFromCourse = async (emailToDelete: string) => {
        const response = await toast.promise(
            deleteMemberFromCourse(course_id as string, emailToDelete),
            {
                loading: 'Đang xoá...',
                success: 'Xoá thành viên thành công',
                error: (err) => `${err.response.data.message}`,
            },
            {
                style: {
                    borderRadius: '8px',
                    background: '#222',
                    color: '#fff',
                    paddingLeft: '15px',
                    fontFamily: 'Plus Jakarta Sans',
                    maxWidth: '700px',
                }
            });

        handleGetCourseData();
    }

    const handleGetCourseData = async () => {
        try {
            const response = await getCourseByIDForAdmin(course_id as string);
            setCourse(response);
            setEnrolKey(response.join_key ? response.join_key : "");
            setDataFromAPI(response.units);

            let members_arr = response.members;
            // Đẩy người tạo lên đầu
            members_arr = members_arr.sort((a: any, b: any) => {
                if (a.username === response.author.username) return -1;
                if (b.username === response.author.username) return 1;
                return 0;
            });

            setMembers(members_arr);
            console.log(response);
        } catch (error) {
            console.error('Error getting course:', error);
        }
    }

    const handleRefreshCourseData = async () => {
        try {
            handleGetCourseData();
        } catch (error) {
            console.error('Error refreshing course:', error);
        }
    }

    const handleUpdateUnit = async (unit_id: string, units: any) => {
        try {
            const response = await updateUnits(course_id as string, { units: units });
        } catch (error) {
            // console.error('Error updating lab:', error);
        }
    }

    const handleCreateLab = async () => {
        try {
            if (newLab === '') {
                toast.error('Vui lòng không để trống tên Lab/Chương', {
                    style: {
                        borderRadius: '8px',
                        background: '#222',
                        color: '#fff',
                        paddingLeft: '15px',
                        maxWidth: '800px',
                        fontFamily: 'Plus Jakarta Sans',
                    }
                });
                return;
            }

            const response = await toast.promise(
                createUnit(course_id as string, { name: newLab }),
                {
                    loading: 'Đang lưu...',
                    success: 'Tạo Lab thành công',
                    error: 'Tạo Lab thất bại'
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
            setNewLab('');
            handleGetCourseData();
            // console.log(response);
        } catch (error) {
            console.error('Error creating lab:', error);
        }
    }

    useEffect(() => {
        handleGetCourseData();
    }, []);

    return (
        <div className="Course p-5 pl-2 flex flex-col gap-8">
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                            <Link to="/admin">Quản trị</Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                            <Link to="/admin/courses">Quản lý khoá học</Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        {course?.name}
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            <div className="flex gap-8 items-start relative">
                <div className="flex-1 flex flex-col gap-8">
                    <div className="flex flex-col gap-5">
                        <div className="flex justify-between items-start">
                            <div className="flex flex-col gap-2">
                                <h1 className="text-3xl font-bold">
                                    <span className="mr-3">
                                        {course?.name}
                                    </span>
                                    <Badge variant="default" className="rounded-md py-1 -translate-y-1.5">{course?.class_name}</Badge>
                                </h1>
                                <div className="flex gap-2 items-center text-sm flex-wrap">
                                    <span className="opacity-70 flex items-center gap-2"><CornerDownRight className="w-3" />Được tạo bởi</span>
                                    <HoverCard openDelay={300}>
                                        <HoverCardTrigger>
                                            <Badge className="gap-1.5 p-1 pr-2 hover:bg-secondary cursor-pointer" variant="outline">
                                                <Avatar>
                                                    <AvatarImage className="w-5 aspect-square rounded-full border" src={course?.author?.avatar_url} />
                                                </Avatar>
                                                <span className="font-semibold text-[13px] -translate-y-[1px]">{course?.author?.username}</span>
                                            </Badge>
                                        </HoverCardTrigger>
                                        <HoverCardContent className="w-70" side="bottom" align="start">
                                            <div className="flex gap-4">
                                                <Avatar>
                                                    <AvatarImage className="w-14 rounded-full" src={course?.author?.avatar_url} />
                                                </Avatar>
                                                <div className="space-y-1">
                                                    <h4 className="text-sm font-semibold text-green-600 dark:text-green-500">@{course?.author?.username}</h4>
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
                                    <span className="opacity-70 flex items-center gap-2"><i className="fa-solid fa-circle text-[3px]"></i>{formatTimeAgo(course?.createdAt, "vi")}</span>
                                    <Dialog>
                                        <TooltipProvider delayDuration={100}>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <DialogTrigger>
                                                        <Badge className="text-green-600 dark:text-green-500 flex gap-1.5 border-primary px-2 py-0 rounded-md hover:bg-secondary cursor-pointer ml-2" variant="outline">
                                                            <UsersRound className="w-3.5" />
                                                            <span>{members?.length}</span>
                                                        </Badge>
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
                                                        <span>{members?.length}</span>
                                                    </Badge>
                                                </DialogTitle>
                                                <DialogDescription>
                                                    <Command className="bg-transparent">
                                                        <CommandInput placeholder="Tìm kiếm..." />
                                                        <CommandList className="mt-4">
                                                            <CommandEmpty>Không có kết quả phù hợp.</CommandEmpty>
                                                            {
                                                                members?.map((member: any) => (
                                                                    <CommandItem className="p-2.5 px-0 mb-1 pb-3 justify-between items-center aria-selected:bg-transparent rounded-none border-b">
                                                                        <div className="flex gap-3 items-center">
                                                                            <Avatar>
                                                                                <AvatarImage className="w-10 rounded-full" src={member?.User ? member?.User?.avatar_url : 'https://img.freepik.com/premium-vector/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-vector-illustration_561158-3383.jpg'} />
                                                                            </Avatar>
                                                                            <div className="flex flex-col">
                                                                                {
                                                                                    member?.User ?
                                                                                        <p className="text-sm font-medium">
                                                                                            {member?.User?.username}
                                                                                            {(member?.User?.role === "ADMIN" || member?.User?.role === "TEACHER") && <i className="fa-solid fa-circle-check text-[10px] text-primary ml-1 -translate-y-[1px]"></i>}
                                                                                        </p> :
                                                                                        <p className="text-[13px] font-medium italic text-primary">(Chờ đăng nhập)</p>
                                                                                }
                                                                                <p className="opacity-50">
                                                                                    {member?.email}
                                                                                </p>
                                                                            </div>
                                                                        </div>
                                                                        <div className="pr-3">
                                                                            {(() => {
                                                                                if (member?.User?.username === loginContext?.user?.username) {
                                                                                    return <span className="text-primary font-medium">(Bạn)</span>;
                                                                                }

                                                                                if (member?.status === "INACTIVE") {
                                                                                    return (
                                                                                        <div className="flex gap-2">
                                                                                            <Button size="sm" className="text-xs h-7 px-2" variant="secondary">Xoá</Button>
                                                                                            <Button size="sm" className="text-xs h-7 px-2">Chấp nhận</Button>
                                                                                        </div>
                                                                                    );
                                                                                }
                                                                            })()}
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
                                <TooltipProvider delayDuration={100}>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Link to="edit">
                                                <Button size="icon" variant="outline">
                                                    <Pencil className="w-[1.2rem] h-[1.2rem]" />
                                                </Button>
                                            </Link>
                                        </TooltipTrigger>
                                        <TooltipContent side="bottom">
                                            Chỉnh sửa khoá học
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                                <Dialog>
                                    <DialogTrigger>
                                        <TooltipProvider delayDuration={100}>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Button size="icon" variant="outline"><Settings className="w-[1.2rem] h-[1.2rem]" /></Button>
                                                </TooltipTrigger>
                                                <TooltipContent side="bottom">
                                                    Cài đặt khoá học
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    </DialogTrigger>
                                    <DialogContent className="max-w-[60%] ">
                                        <DialogHeader>
                                            <DialogTitle>Cài đặt khoá học</DialogTitle>
                                        </DialogHeader>
                                        <div className="mt-1 -ml-2">
                                            <Tabs defaultValue="general" className="w-full flex gap-10" orientation="vertical">
                                                <TabsList className="flex flex-col h-fit bg-tranparent gap-2 p-0">
                                                    <TabsTrigger value="general" className="pr-6 data-[state=active]:bg-secondary w-full justify-start rounded-md">
                                                        <Settings className="w-4 h-4 mr-2" />Chung
                                                    </TabsTrigger>
                                                    <TabsTrigger value="access" className="pr-6 data-[state=active]:bg-secondary w-full justify-start rounded-md">
                                                        <ScanEye className="w-4 h-4 mr-2" />Quyền truy cập
                                                    </TabsTrigger>
                                                    <TabsTrigger value="member" className="pr-6 data-[state=active]:bg-secondary w-full justify-start rounded-md">
                                                        <Users className="w-4 h-4 mr-2" />Thành viên
                                                    </TabsTrigger>
                                                </TabsList>
                                                <div className="py-1 flex-1">
                                                    <TabsContent value="general" className="mt-0 min-h-[400px]">
                                                        <div className="flex flex-col gap-8">
                                                            <div className="flex justify-between gap-6 items-center">
                                                                <Label className="flex-1 flex flex-col gap-1.5 cursor-pointer" htmlFor="auto-join">
                                                                    <h3 className="text-[16px]">Tự động xét duyệt</h3>
                                                                    <p className="text-sm opacity-50 dark:font-light">Tự động duyệt tất cả yêu cầu vào khoá học.</p>
                                                                </Label>
                                                                <Switch checked={course?.auto_join} id="auto-join" onCheckedChange={() => handleUpdateAutoJoin()} />
                                                            </div>
                                                            <div className="flex justify-between gap-5 items-center">
                                                                <Label className="flex-1 flex flex-col gap-1.5">
                                                                    <h3 className="text-[16px]">Xoá khoá học này</h3>
                                                                    <p className="text-sm opacity-50 dark:font-light">Sau khi xoá, khoá học này sẽ không thể truy cập được.</p>
                                                                </Label>
                                                                <Dialog>
                                                                    <DialogTrigger>
                                                                        <Button variant="destructive" size="sm" className="border border-destructive/70 bg-destructive/10 hover:bg-destructive/20 dark:bg-destructive/40 dark:hover:bg-destructive/50 text-destructive dark:text-white">
                                                                            <Trash2 className="w-4 h-4 mr-2" />Xoá khoá học
                                                                        </Button>
                                                                    </DialogTrigger>
                                                                    <DialogContent>
                                                                        <DialogHeader>
                                                                            <DialogTitle>Xoá khoá học này?</DialogTitle>
                                                                        </DialogHeader>
                                                                        <DialogDescription>
                                                                            Sau khi xoá, khoá học này và mọi dữ liệu liên quan sẽ không thể truy cập được nữa.
                                                                        </DialogDescription>
                                                                        <DialogFooter>
                                                                            <DialogClose asChild>
                                                                                <Button variant="ghost">Đóng</Button>
                                                                            </DialogClose>
                                                                            <DialogClose asChild>
                                                                                <Button variant="destructive" onClick={() => handleDeleteCourse()}>Xoá khoá học</Button>
                                                                            </DialogClose>
                                                                        </DialogFooter>
                                                                    </DialogContent>
                                                                </Dialog>
                                                            </div>
                                                        </div>
                                                    </TabsContent>
                                                    <TabsContent value="access" className="mt-0 min-h-[400px]">
                                                        <div className="flex flex-col gap-8">
                                                            <div className="flex flex-col gap-4">
                                                                <div className="flex justify-between gap-10 items-center">
                                                                    <Label className="flex-1 flex flex-col gap-1 cursor-pointer" htmlFor="public-course-switch">
                                                                        <h3 className="text-[16px]">Hạn chế truy cập</h3>
                                                                        <p className="text-sm opacity-50 dark:font-light">Yêu cầu người dùng nhập mật khẩu khi đăng ký tham gia khoá học này.</p>
                                                                    </Label>
                                                                    <Switch checked={!course?.public} onCheckedChange={() => handlePublicCourse()} id="public-course-switch" />
                                                                </div>
                                                                {
                                                                    !course?.public &&
                                                                    <>
                                                                        <div className="relative flex items-center">
                                                                            <KeyRound className="absolute left-3 h-4 w-4 text-muted-foreground ml-1" />
                                                                            <Input
                                                                                type={isPasswordVisible ? "text" : "password"}
                                                                                placeholder="Đặt mật khẩu tham gia"
                                                                                className="w-full pl-11 h-[44px]"
                                                                                value={enrolKey}
                                                                                onChange={e => setEnrolKey(e.target.value)}
                                                                            />
                                                                            <Button
                                                                                variant="ghost"
                                                                                size="icon"
                                                                                onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                                                                                className="absolute right-2 size-8"
                                                                            >
                                                                                {isPasswordVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                                            </Button>
                                                                        </div>
                                                                        {
                                                                            enrolKey.length > 0 && enrolKey !== course.join_key &&
                                                                            <Button className="w-fit px-4" onClick={() => handleUpdateKey()}>Cập nhật mật khẩu</Button>
                                                                        }
                                                                    </>
                                                                }
                                                            </div>
                                                            <div className="flex flex-col gap-2">
                                                                <p className="text-[16px] font-medium">Liên kết tham gia khoá học:</p>
                                                                <div className="flex gap-2">
                                                                    <span
                                                                        className="text-sm flex-1 border rounded-md flex items-center justify-start pl-3 italic line-clamp-1"
                                                                    >
                                                                        <Link2 className="size-4 mr-2" />{(import.meta as any).env.VITE_HICOMMIT_HOST}/course/{course?.slug ? course?.slug : course_id}
                                                                    </span>
                                                                    <Button variant="outline" onClick={() => handleCopyText(`${(import.meta as any).env.VITE_HICOMMIT_HOST}/course/${course?.slug ? course?.slug : course_id}`)}>
                                                                        Sao chép
                                                                    </Button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </TabsContent>
                                                    <TabsContent value="member" className="mt-0 min-h-[400px]">
                                                        <div className="flex flex-col gap-3">
                                                            <h2 className="font-medium">Quản lý thành viên</h2>
                                                            <Command className="bg-transparent w-full">
                                                                <div className="flex gap-4 items-center w-full">
                                                                    <CommandInput placeholder="Tìm kiếm..." />
                                                                    <DropdownMenu>
                                                                        <DropdownMenuTrigger>
                                                                            <Button className="pl-4">
                                                                                <UserPlus className="size-4 mr-1.5" />Thêm<i className="fa-solid fa-sort-down mb-1.5 ml-3 text-[12px]"></i>
                                                                            </Button>
                                                                        </DropdownMenuTrigger>
                                                                        <DropdownMenuContent side="bottom" align="start">
                                                                            <DropdownMenuItem className="pr-6 cursor-pointer" onClick={() => setIsOpenAddMember(true)}>
                                                                                <UserPlus className="size-4 mr-2" />Thêm người dùng
                                                                            </DropdownMenuItem>
                                                                            <DropdownMenuItem className="pr-6 cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                                                                                <FileUp className="size-4 mr-2" />Nhập file CSV
                                                                            </DropdownMenuItem>
                                                                            <DropdownMenuItem className="pr-6 cursor-pointer" onClick={() => exportMembersToCSV()}>
                                                                                <FileInput className="size-4 mr-2" />Tải xuống danh sách
                                                                            </DropdownMenuItem>
                                                                            <DropdownMenuItem className="pr-6 cursor-pointer" onClick={downloadCSVTemplate}>
                                                                                <FileDown className="size-4 mr-2" />Tải xuống CSV mẫu
                                                                            </DropdownMenuItem>
                                                                        </DropdownMenuContent>
                                                                    </DropdownMenu>
                                                                </div>
                                                                <Dialog open={isOpenAddMember} onOpenChange={setIsOpenAddMember}>
                                                                    <DialogContent>
                                                                        <DialogHeader>
                                                                            <DialogTitle>Thêm người dùng mới vào khoá học</DialogTitle>
                                                                        </DialogHeader>
                                                                        <div className="mt-2">
                                                                            <Input
                                                                                type="search"
                                                                                className="placeholder:italic"
                                                                                placeholder="Email hoặc tên người dùng"
                                                                                value={newMember}
                                                                                onChange={e => setNewMember(e.target.value)}
                                                                            />
                                                                        </div>
                                                                        <DialogFooter className="mt-3">
                                                                            <DialogClose asChild>
                                                                                <Button variant="ghost">
                                                                                    Đóng
                                                                                </Button>
                                                                            </DialogClose>
                                                                            <DialogClose asChild>
                                                                                <Button disabled={newMember === ''} onClick={() => handleAddMemberToCourse()}>
                                                                                    Thêm người dùng
                                                                                </Button>
                                                                            </DialogClose>
                                                                        </DialogFooter>
                                                                    </DialogContent>
                                                                </Dialog>
                                                                <input
                                                                    type="file"
                                                                    accept=".csv"
                                                                    ref={fileInputRef}
                                                                    style={{ display: 'none' }}
                                                                    onChange={handleCSVUpload}
                                                                />
                                                                <Dialog open={isOpenCSVUpload} onOpenChange={setIsOpenCSVUpload}>
                                                                    <DialogContent>
                                                                        <DialogHeader>
                                                                            <DialogTitle>Thêm nhiều người dùng</DialogTitle>
                                                                        </DialogHeader>
                                                                        <div className="mt-2 ">
                                                                            <ScrollArea className={'[&>[data-radix-scroll-area-viewport]]:max-h-[280px] pr-4 translate-x-1'}>
                                                                                {
                                                                                    membersToAdd?.length > 0 ?
                                                                                        <div className="flex flex-col">
                                                                                            {
                                                                                                membersToAdd?.map((member: any, index: number) => (
                                                                                                    <div className="flex gap-2 items-center justify-between group/item border-b py-2" key={index}>
                                                                                                        <p>{index + 1}. {member}</p>
                                                                                                        <Button variant="secondary" size="sm" className="h-7 px-2 invisible group-hover/item:visible" onClick={() => {
                                                                                                            setMembersToAdd(membersToAdd.filter((_, i) => i !== index));
                                                                                                        }}>
                                                                                                            <Trash2 className="size-[14px]" />
                                                                                                        </Button>
                                                                                                    </div>
                                                                                                ))
                                                                                            }
                                                                                        </div> :
                                                                                        <div className="flex flex-col gap-2">
                                                                                            <p className="text-sm italic">Không tìm thấy người dùng nào.</p>
                                                                                        </div>
                                                                                }
                                                                            </ScrollArea>
                                                                        </div>
                                                                        <DialogFooter className="mt-2">
                                                                            <DialogClose asChild>
                                                                                <Button variant="ghost">
                                                                                    Đóng
                                                                                </Button>
                                                                            </DialogClose>
                                                                            <DialogClose asChild>
                                                                                <Button disabled={membersToAdd?.length === 0} onClick={() => handleAddMultipleMembersToCourse()}>
                                                                                    Thêm tất cả ({membersToAdd?.length})
                                                                                </Button>
                                                                            </DialogClose>
                                                                        </DialogFooter>
                                                                    </DialogContent>
                                                                </Dialog>
                                                                <CommandList className="mt-4">
                                                                    <CommandEmpty>Không có kết quả phù hợp.</CommandEmpty>
                                                                    {
                                                                        members?.map((member: any) => (
                                                                            <CommandItem className="p-2.5 px-0 mb-1 pb-3 justify-between items-center aria-selected:bg-transparent rounded-none border-b">
                                                                                <div className="flex gap-3 items-center">
                                                                                    <Avatar>
                                                                                        <AvatarImage className="w-10 rounded-full" src={member?.User ? member?.User?.avatar_url : 'https://img.freepik.com/premium-vector/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-vector-illustration_561158-3383.jpg'} />
                                                                                    </Avatar>
                                                                                    <div className="flex flex-col">
                                                                                        {
                                                                                            member?.User ?
                                                                                                <p className="text-sm font-medium">
                                                                                                    {member?.User?.username}
                                                                                                    {(member?.User?.role === "ADMIN" || member?.User?.role === "TEACHER") && <i className="fa-solid fa-circle-check text-[10px] text-primary ml-1 -translate-y-[1px]"></i>}
                                                                                                </p> :
                                                                                                <p className="text-[13px] font-medium italic text-primary">(Chờ đăng nhập)</p>
                                                                                        }
                                                                                        <p className="opacity-50">
                                                                                            {member?.email}
                                                                                        </p>
                                                                                    </div>
                                                                                </div>
                                                                                <div className="pr-3">
                                                                                    {(() => {
                                                                                        if (member?.User?.username === loginContext?.user?.username) {
                                                                                            return <span className="text-primary font-medium">(Bạn)</span>;
                                                                                        }

                                                                                        if (member?.status === "INACTIVE") {
                                                                                            return (
                                                                                                <div className="flex gap-2">
                                                                                                    <Button size="sm" className="text-xs h-7 px-2" variant="secondary">Xoá</Button>
                                                                                                    <Button size="sm" className="text-xs h-7 px-2">Chấp nhận</Button>
                                                                                                </div>
                                                                                            );
                                                                                        }

                                                                                        return (
                                                                                            <Dialog>
                                                                                                <DialogTrigger>
                                                                                                    <Button size="sm" className="text-xs h-7 px-2" variant="secondary">Xoá</Button>
                                                                                                </DialogTrigger>
                                                                                                <DialogContent>
                                                                                                    <DialogHeader>
                                                                                                        <DialogTitle>Xoá người dùng này?</DialogTitle>
                                                                                                    </DialogHeader>
                                                                                                    <DialogDescription>
                                                                                                        Bạn có chắc chắn muốn xoá người dùng này khỏi khoá học này?
                                                                                                    </DialogDescription>
                                                                                                    <DialogFooter>
                                                                                                        <DialogClose asChild>
                                                                                                            <Button variant="ghost">Đóng</Button>
                                                                                                        </DialogClose>
                                                                                                        <DialogClose asChild>
                                                                                                            <Button variant="destructive" onClick={() => handleDeleteMemberFromCourse(member?.email)}>Vâng, tôi muốn xoá</Button>
                                                                                                        </DialogClose>
                                                                                                    </DialogFooter>
                                                                                                </DialogContent>
                                                                                            </Dialog>
                                                                                        );
                                                                                    })()}
                                                                                </div>
                                                                            </CommandItem>
                                                                        ))
                                                                    }
                                                                </CommandList>
                                                            </Command>
                                                        </div>
                                                    </TabsContent>
                                                </div>
                                            </Tabs>
                                        </div>
                                    </DialogContent>
                                </Dialog>
                            </div>
                        </div>
                        <Separator />
                    </div>

                    <div className="flex flex-col gap-2">
                        <span className="text-sm font-medium text-green-600 dark:text-green-500">Mô tả khoá học:</span>
                        <div
                            className="ck-content hicommit-content leading-7 text-justify flex-1"
                            dangerouslySetInnerHTML={{ __html: course?.description }}
                        />
                    </div>

                    {
                        dataFromAPI.length > 0 &&
                        <CourseTree dataFromAPI={dataFromAPI} setDataFromAPI={setDataFromAPI} refresh={handleRefreshCourseData} courseId={course_id} key={key} />
                    }

                    <Dialog>
                        <DialogTrigger asChild>
                            <Button className="w-fit px-3.5 pr-4" variant="secondary"><Plus className="w-4 mr-1.5 h-5" />Tạo Lab/Chương mới</Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Tạo Lab/Chương mới</DialogTitle>
                            </DialogHeader>
                            <Input
                                className="w-full mt-2 placeholder:italic"
                                placeholder="Nhập tên Lab/Chương"
                                value={newLab}
                                onChange={e => setNewLab(e.target.value)}
                            />
                            <DialogFooter className="mt-2">
                                <DialogClose>
                                    <Button variant="ghost">
                                        Đóng
                                    </Button>
                                </DialogClose>
                                <DialogClose>
                                    <Button className="w-fit px-4" onClick={() => handleCreateLab()}>Tạo</Button>
                                </DialogClose>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
                <div className="w-1/4 min-w-[300px] relative max-w-[600px] sticky top-6 flex flex-col gap-4">
                    <div className="flex justify-between gap-6 items-center border p-4 px-5 pb-5 rounded-lg bg-secondary/10">
                        <Label className="flex-1 flex flex-col gap-1 cursor-pointer" htmlFor="publish-course">
                            <h3 className="text-lg">Công bố khoá học</h3>
                            <p className="text-sm opacity-50 dark:font-light ">Công khai khoá học này lên hệ thống</p>
                        </Label>
                        <Switch checked={course?.publish} id="publish-course" onCheckedChange={() => handlePublishCourse()} />
                    </div>
                    <div className="bg-zinc-100/30 dark:bg-zinc-900/30 border rounded-lg flex flex-col items-center">
                        <div className="flex justify-between items-start w-full pl-6 2xl:pl-7 pt-4 2xl:pt-5 pr-4">
                            <div className="flex flex-col">
                                <h3 className="font-bold text-xl 2xl:text-2xl align-left">Thống kê</h3>
                                <p className="text-sm 2xl:text-base opacity-60">Trong toàn khoá học</p>
                            </div>
                            <Link to={`/admin/courses/${course_id}/statistic`} className="mt-1 text-sm 2xl:text-base text-primary">
                                Chi tiết<ArrowRight className="size-4 inline -translate-y-[1px] ml-1" />
                            </Link>
                        </div>
                        <ChartContainer
                            config={{
                                time: {
                                    label: "Time",
                                    color: "hsl(var(--chart-2))",
                                },
                            }}
                            className="w-full mt-4"
                        >
                            <AreaChart
                                accessibilityLayer
                                data={chartData}
                                margin={{
                                    left: 0,
                                    right: 0,
                                    top: 0,
                                    bottom: 0,
                                }}
                            >
                                <XAxis dataKey="date" hide />
                                <YAxis domain={["dataMin - 25", "dataMax + 2"]} hide />
                                <defs>
                                    <linearGradient id="fillTime" x1="0" y1="0" x2="0" y2="1">
                                        <stop
                                            offset="5%"
                                            stopColor="var(--color-time)"
                                            stopOpacity={0.8}
                                        />
                                        <stop
                                            offset="95%"
                                            stopColor="var(--color-time)"
                                            stopOpacity={0.1}
                                        />
                                    </linearGradient>
                                </defs>
                                <Area
                                    dataKey="completed"
                                    type="natural"
                                    fill="url(#fillTime)"
                                    fillOpacity={0.4}
                                    stroke="var(--color-time)"
                                />
                                <ChartTooltip
                                    cursor={false}
                                    content={<ChartTooltipContent hideLabel />}
                                    formatter={(value) => (
                                        <div className="flex gap-1 items-center text-xs text-muted-foreground">
                                            Tỷ lệ hoàn thành bài tập
                                            <div className="ml-auto flex items-baseline gap-0.5 font-mono font-medium tabular-nums text-foreground">
                                                {value}
                                                <span className="font-normal text-muted-foreground">
                                                    %
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                />
                            </AreaChart>
                        </ChartContainer>
                        <span className="absolute bottom-3 mt-2.5 text-xs 2xl:text-sm dark:font-light opacity-60"><Activity className="w-3 h-3 mr-2 2xl:w-4 2xl:h-4 inline -translate-y-[1px]" />Mức độ hoàn thành bài tập theo thời gian</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CourseDashboard;