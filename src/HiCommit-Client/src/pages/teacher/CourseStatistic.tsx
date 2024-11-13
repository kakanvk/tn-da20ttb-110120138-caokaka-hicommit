import { getProblemByIDorSlug } from "@/service/API/Problem";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BlurFade from "@/components/magicui/blur-fade";
import { AlignLeft, ArrowBigUpDash, BetweenHorizontalStart, Box, CircleCheckBig, Eye, Info, Lollipop, Search, SquareDashedKanban, Zap } from "lucide-react";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

import { TrendingUp } from "lucide-react"
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

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
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"
import { analysisSubmissionOfCourse, countSubmissions60daysAgo, getCourseAnalysis, getProblemAnalysisOfCourse } from "@/service/API/Analysis";

import leaderboard_art from "@/assets/imgs/LeaderBoard_Art.png";
import time_art from "@/assets/imgs/Time_Art.png";
import search_art from "@/assets/imgs/Search_Art.png";
import { getCourseById } from "@/service/API/Course";

import {
    ColumnDef,
    ColumnFiltersState,
    SortingState,
    VisibilityState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table"
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Command,
    CommandEmpty,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const chartConfig = {
    index: {
        label: "Bài tập",
        color: "hsl(var(--chart-1))",
    },
    userAttemptsBeforePassed: {
        label: "Số lần thử:",
        color: "hsl(var(--chart-2))",
    },
    total: {
        label: "Số lượt nộp bài: ",
        color: "hsl(var(--chart-3))",
    },
    PASSED: {
        label: "Hoàn thành: ",
        color: "hsl(var(--chart-4))",
    },

} satisfies ChartConfig

export type Payment = {
    id: string
    name: string
    email: string
    units: object
    slug: string
    submissionCount: number
    firstSubmission: object
    firstPassedSubmission: object
    userSubmissions: object[]
}

function CourseStatistic() {

    const { course_id } = useParams<{ course_id: string }>();

    const [course, setCourse] = useState<any>({});

    const [submissionsAnalysis, setSubmissionsAnalysis] = useState<any>({});
    const [submissionsAnalysisOfCourse, setSubmissionsAnalysisOfCourse] = useState<any>({});
    const [problemAnalysisOfCourse, setProblemAnalysisOfCourse] = useState<any>({});

    const [dataForPassedAnalysis, setDataForPassedAnalysis] = useState<any>([]);
    const [dataForSubmissionsAnalysis, setDataForSubmissionsAnalysis] = useState<any>([]);
    const [countSubmissions, setCountSubmissions] = useState<any>({
        total: 0,
        PASSED: 0,
        FAILED: 0,
        ERROR: 0,
        COMPILE_ERROR: 0
    });

    const [dayFilter, setDayFilter] = useState<string>("all_time");
    const [userFilter, setUserFilter] = useState<string>("all_user");

    const [sorting, setSorting] = useState<SortingState>([])
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
        unit: false,
        userSubmissions: false,
    })
    const [rowSelection, setRowSelection] = useState({});

    const columns: ColumnDef<Payment>[] = [
        {
            accessorKey: "unit",
            enableHiding: false,
        },
        {
            accessorKey: "userSubmissions",
            enableHiding: false,
        },
        {
            id: "index",
            header: ({ column }) => {
                return (
                    <div className="flex">
                        <span className='text-nowrap'>#</span>
                    </div>
                )
            },
            cell: ({ row }) => (
                <div className="font-medium">
                    {row.index + 1}
                </div>
            ),
        },
        {
            accessorKey: "name",
            header: ({ column }) => {
                return (
                    <p>
                        Tên bài tập
                    </p>
                )
            },
            cell: ({ row }) =>
                <div className="flex flex-col gap-1">
                    <span className="text-nowrap opacity-60 dark:opacity-40 text-xs">{(row.getValue("unit") as any).name}</span>
                    <p className="text-sm line-clamp-1">{row.getValue("name")}</p>
                </div>,
        },
        {
            accessorKey: "firstSubmission",
            header: ({ column }) => {
                return (
                    <p>
                        Nộp đầu tiên
                    </p>
                )
            },
            cell: ({ row }) => {
                if (row.getValue("firstSubmission") === null) {
                    return <p className="text-sm line-clamp-1 opacity-50">
                        Chưa có
                    </p>
                }
                else {
                    return <div className="flex items-center gap-2">
                        <Avatar className="size-6">
                            <AvatarImage className="rounded-full border" src={((row.getValue("firstSubmission") as any)?.avatar_url) ? ((row.getValue("firstSubmission") as any)?.avatar_url) : 'https://img.freepik.com/premium-vector/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-vector-illustration_561158-3383.jpg'} />
                        </Avatar>
                        <p className="text-sm line-clamp-1">{((row.getValue("firstSubmission") as any)?.username)}</p>
                    </div>
                }
            },
        },
        {
            accessorKey: "firstPassedSubmission",
            header: ({ column }) => {
                return (
                    <p>
                        Hoàn thành đầu tiên
                    </p>
                )
            },
            cell: ({ row }) => {
                if (row.getValue("firstPassedSubmission") === null) {
                    return <p className="text-sm line-clamp-1 opacity-50">
                        Chưa có
                    </p>
                }
                else {
                    return <div className="flex items-center gap-2">
                        <Avatar className="size-6">
                            <AvatarImage className="rounded-full border" src={((row.getValue("firstPassedSubmission") as any)?.avatar_url) ? ((row.getValue("firstPassedSubmission") as any)?.avatar_url) : 'https://img.freepik.com/premium-vector/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-vector-illustration_561158-3383.jpg'} />
                        </Avatar>
                        <p className="text-sm line-clamp-1">{((row.getValue("firstPassedSubmission") as any)?.username)}</p>
                    </div>
                }
            },
        },
        {
            accessorKey: "submissionCount",
            header: () => <div className="text-center">Lượt nộp bài</div>,
            cell: ({ row }) => {
                return <div className="text-center font-medium">
                    {row.getValue("submissionCount")}
                    <Dialog>
                        <DialogTrigger>
                            <Button variant="secondary" className="px-2 h-6 ml-2 text-xs">Chi tiết</Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-[600px]">
                            <DialogHeader className="mb-3">
                                <DialogTitle className="mb-2 flex items-center">
                                    Danh sách nộp bài
                                    <Badge className="w-fit text-green-600 dark:text-green-500 flex gap-1.5 border-primary px-1.5 py-0 rounded-sm ml-2 translate-y-[1px]" variant="outline">
                                        <span>{row.getValue("submissionCount")} lượt nộp</span>
                                    </Badge>
                                </DialogTitle>
                                <DialogDescription>
                                    <Command className="bg-transparent">
                                        <CommandInput placeholder="Tìm kiếm..." />
                                        <CommandList className="mt-2">
                                            <CommandEmpty>Không có kết quả phù hợp.</CommandEmpty>
                                            {
                                                (row.getValue("userSubmissions") as any)?.map((member: any) => (
                                                    <CommandItem className="p-2.5 px-0 mb-1 pb-4 justify-between items-center aria-selected:bg-transparent rounded-none border-b" key={member?.id}>
                                                        <div className="flex gap-3 items-center">
                                                            <Avatar>
                                                                <AvatarImage className="w-10 rounded-full border" src={member?.avatar_url ? member?.avatar_url : 'https://img.freepik.com/premium-vector/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-vector-illustration_561158-3383.jpg'} />
                                                            </Avatar>
                                                            <div className="flex flex-col">
                                                                <p className="text-sm font-medium">
                                                                    {member?.username}
                                                                    {(member?.role === "ADMIN" || member?.role === "TEACHER") && <i className="fa-solid fa-circle-check text-[10px] text-primary ml-1 -translate-y-[1px]"></i>}
                                                                </p>
                                                                <p className="opacity-50">
                                                                    {member?.email}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div className="flex flex-col items-end gap-1">
                                                            {
                                                                member?.lastStatus === "PASSED" && <p className="text-primary">Đã hoàn thành</p>
                                                            }
                                                            {
                                                                member?.lastStatus === "FAILED" && <p className="text-red-500">Chưa hoàn thành</p>
                                                            }
                                                            {
                                                                member?.lastStatus === "ERROR" && <p className="text-red-500">Lỗi không xác định</p>
                                                            }
                                                            {
                                                                member?.lastStatus === "COMPILE_ERROR" && <p className="text-red-500">Lỗi biên dịch</p>
                                                            }
                                                            <p className="text-xs opacity-50">({member?.submissions} lần nộp)</p>
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
            },
        },
    ]

    const table = useReactTable({
        data: problemAnalysisOfCourse,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
        },
    })

    const handleGetCourse = async () => {
        const response = await getCourseById(course_id as any);
        setCourse(response);
    }

    const handleGetCourseAnalysis = async () => {
        const response = await getCourseAnalysis(course_id as any);
        setSubmissionsAnalysis(response);
        handleFilterChangeForPassedAnalysis(userFilter);
    }

    const handleGetProblemAnalysisOfCourse = async () => {
        const response = await getProblemAnalysisOfCourse(course_id as any);
        console.log(response.problems);
        setProblemAnalysisOfCourse(response.problems);
    }

    const handleGetSubmissionsAnalysis = async () => {
        const response = await analysisSubmissionOfCourse(course_id as any);
        setSubmissionsAnalysisOfCourse(response);
        handleFilterChangeForSubmissionsAnalysis(dayFilter, userFilter);
    }

    const handleFilterChangeForPassedAnalysis = async (_userFilter: string) => {
        if (_userFilter === "only_me") {
            const filteredData = submissionsAnalysis.problems.map((problem: any) => ({
                slug: problem.slug,
                index: problem.name,
                userAttemptsBeforePassed: problem.userAttemptsBeforePassed,
            }));
            setDataForPassedAnalysis(filteredData);
        } else if (_userFilter === "all_user") {
            const filteredData = submissionsAnalysis.problems.map((problem: any) => ({
                slug: problem.slug,
                index: problem.name,
                userAttemptsBeforePassed: problem?.courseAttemptsBeforePassed,
            }));
            setDataForPassedAnalysis(filteredData);
        }
    }

    const handleFilterChangeForSubmissionsAnalysis = async (_dayFilter: string, _userFilter: string) => {

        // tôi muốn là data._userFilter._dayFilter
        const newData = submissionsAnalysisOfCourse[_userFilter][_dayFilter];
        setDataForSubmissionsAnalysis(newData);

        // Duyệt qua từng phần tử trong newData, đếm số total, PASSED, FAILED, ERROR, COMPILE_ERROR
        let total = 0;
        let passed = 0;
        let failed = 0;
        let error = 0;
        let compileError = 0;

        newData?.map((item: any) => {
            total += item.total;
            passed += item.PASSED;
            failed += item.FAILED;
            error += item.ERROR;
            compileError += item.COMPILE_ERROR;
        });

        console.log(total, passed, failed, error, compileError);

        setCountSubmissions({
            total,
            PASSED: passed,
            FAILED: failed,
            ERROR: error,
            COMPILE_ERROR: compileError
        });
    }

    useEffect(() => {
        handleGetCourse();
        handleGetCourseAnalysis();
        handleGetSubmissionsAnalysis();
        handleGetProblemAnalysisOfCourse();
    }, []);

    useEffect(() => {
        handleFilterChangeForPassedAnalysis(userFilter);
    }, [submissionsAnalysis, userFilter]);

    useEffect(() => {
        handleFilterChangeForSubmissionsAnalysis(dayFilter, userFilter);
    }, [submissionsAnalysisOfCourse, dayFilter, userFilter]);

    return (
        <div className="CourseStatistic p-6 px-8 flex flex-col gap-8">
            <Breadcrumb>
                <BlurFade delay={0.1} yOffset={0}>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink asChild>
                                <Link to="/course-manager">Quản lý khoá học</Link>
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbLink asChild>
                                <Link to={`/course-manager/${course?.id}`}>{course?.name}</Link>
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            Phân tích dữ liệu khoá học
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </BlurFade>
            </Breadcrumb>
            <h2 className="text-2xl font-bold">Phân tích số liệu khoá học<TrendingUp className="size-6 inline ml-3 -translate-y-[1px] text-primary" /></h2>
            <div className="flex flex-col gap-6">
                <BlurFade delay={0.3} yOffset={0} blur="2px">
                    <Tabs defaultValue="problem_analysis" className="w-full">
                        <TabsList className="bg-transparent justify-start rounded-none pb-3 px-0 border-b-[2px] border-secondary/40 w-full">
                            <TabsTrigger
                                value="problem_analysis"
                                className="px-1 border-b-2 border-b-transparent drop-shadow-none data-[state=active]:border-b-primary rounded-none bg-transparent data-[state=active]:bg-transparent duration-500"
                            >
                                <Button variant="ghost" size="sm" className="hover:bg-secondary/60">
                                    <Box className="w-4 mr-2" />Bài tập
                                </Button>
                            </TabsTrigger>
                            <TabsTrigger
                                value="submissions"
                                className="px-1 border-b-2 border-b-transparent drop-shadow-none data-[state=active]:border-b-primary rounded-none bg-transparent data-[state=active]:bg-transparent duration-500"
                            >
                                <Button variant="ghost" size="sm" className="hover:bg-secondary/60">
                                    <SquareDashedKanban className="w-4 mr-2" />Tuần suất nộp bài
                                </Button>
                            </TabsTrigger>
                            <TabsTrigger
                                value="passed_analysis"
                                className="px-1 border-b-2 border-b-transparent drop-shadow-none data-[state=active]:border-b-primary rounded-none bg-transparent data-[state=active]:bg-transparent duration-500"
                            >
                                <Button variant="ghost" size="sm" className="hover:bg-secondary/60">
                                    <Zap className="w-4 mr-2" />Độ khó
                                </Button>
                            </TabsTrigger>
                        </TabsList>
                        <TabsContent value="passed_analysis">
                            <div className="flex flex-col pt-8 relative">
                                <div className="ml-auto absolute -top-14 right-0">
                                    <div className="flex gap-4">
                                        {/* <Select value={userFilter} onValueChange={(value) => {
                                            setUserFilter(value);
                                        }}>
                                            <SelectTrigger className="w-fit gap-3 border-none focus:ring-0 focus:ring-offset-0">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all_user" className="pr-6">Tất cả</SelectItem>
                                                <SelectItem value="only_me" className="pr-6">Chỉ mình tôi</SelectItem>
                                            </SelectContent>
                                        </Select> */}
                                    </div>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <ChartContainer config={chartConfig} className="aspect-[10/3] w-full">
                                        <AreaChart
                                            accessibilityLayer
                                            data={dataForPassedAnalysis}
                                            margin={{
                                                left: -20,
                                                right: 12,
                                                top: 5,
                                            }}
                                        >
                                            <CartesianGrid vertical={false} />
                                            <XAxis
                                                dataKey="index"
                                                tickLine={false}
                                                axisLine={false}
                                                tickMargin={12}
                                                className="invisible"
                                            />
                                            <YAxis
                                                tickLine={false}
                                                axisLine={false}
                                                tickMargin={8}
                                                tickCount={3}
                                            />
                                            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                                            <defs>
                                                <linearGradient id="fillDesktop" x1="0" y1="0" x2="0" y2="1">
                                                    <stop
                                                        offset="5%"
                                                        stopColor="#22c55e"
                                                        stopOpacity={0.8}
                                                    />
                                                    <stop
                                                        offset="95%"
                                                        stopColor="#22c55e"
                                                        stopOpacity={0.1}
                                                    />
                                                </linearGradient>
                                            </defs>
                                            <Area
                                                dataKey="userAttemptsBeforePassed"
                                                // type="natural"
                                                fill="url(#fillDesktop)"
                                                fillOpacity={0.4}
                                                stroke="#22c55e"
                                            />
                                        </AreaChart>
                                    </ChartContainer>
                                    <p className="text-sm ml-4 opacity-70">
                                        <Info className="size-[14px] inline mr-2 -translate-y-[1px]" />
                                        Biểu đồ này thống kê số lượt nộp bài cần thiết để hoàn thành các bài tập (Hay mức độ khó của bài tập)
                                    </p>
                                </div>
                            </div>
                        </TabsContent>
                        <TabsContent value="submissions">
                            <div className="flex flex-col pt-8 relative">
                                <div className="ml-auto absolute -top-14 right-0">
                                    <div className="flex gap-4">
                                        <Select value={dayFilter} onValueChange={(value) => {
                                            setDayFilter(value);
                                        }}>
                                            <SelectTrigger className="w-fit gap-3 border-none focus:ring-0 focus:ring-offset-0">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="1_days" className="pr-6">1 ngày gần nhất</SelectItem>
                                                <SelectItem value="7_days" className="pr-6">7 ngày gần nhất</SelectItem>
                                                <SelectItem value="28_days" className="pr-6">28 ngày gần nhất</SelectItem>
                                                <SelectItem value="60_days" className="pr-6">60 ngày gần nhất</SelectItem>
                                                <SelectItem value="all_time" className="pr-6">Toàn thời gian</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        {/* <Select value={userFilter} onValueChange={(value) => {
                                            setUserFilter(value);
                                        }}>
                                            <SelectTrigger className="w-fit gap-3 border-none focus:ring-0 focus:ring-offset-0">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all_user" className="pr-6">Tất cả</SelectItem>
                                                <SelectItem value="only_me" className="pr-6">Chỉ mình tôi</SelectItem>
                                            </SelectContent>
                                        </Select> */}
                                    </div>
                                </div>
                                <div className="flex flex-col gap-8">
                                    <div className="flex flex-col gap-2">
                                        <ChartContainer config={chartConfig} className="aspect-[10/3] w-full">
                                            <AreaChart
                                                accessibilityLayer
                                                data={dataForSubmissionsAnalysis}
                                                margin={{
                                                    left: -20,
                                                    right: 12,
                                                    top: 5,
                                                }}
                                            >
                                                <CartesianGrid vertical={false} />
                                                <XAxis
                                                    dataKey="name"
                                                    tickLine={false}
                                                    axisLine={false}
                                                    tickMargin={8}
                                                    className="invisible"
                                                />
                                                <YAxis
                                                    tickLine={false}
                                                    axisLine={false}
                                                    tickMargin={8}
                                                    tickCount={3}
                                                />
                                                <ChartTooltip
                                                    cursor={false}
                                                    content={<ChartTooltipContent className="min-w-[150px]" />}
                                                />
                                                <defs>
                                                    <linearGradient id="fillSubmissions" x1="0" y1="0" x2="0" y2="1">
                                                        <stop
                                                            offset="5%"
                                                            stopColor="#38bdf8"
                                                            stopOpacity={0.8}
                                                        />
                                                        <stop
                                                            offset="95%"
                                                            stopColor="#38bdf8"
                                                            stopOpacity={0.1}
                                                        />
                                                    </linearGradient>
                                                    <linearGradient id="fillPassed" x1="0" y1="0" x2="0" y2="1">
                                                        <stop
                                                            offset="5%"
                                                            stopColor="#22c55e"
                                                            stopOpacity={0.8}
                                                        />
                                                        <stop
                                                            offset="95%"
                                                            stopColor="#22c55e"
                                                            stopOpacity={0.1}
                                                        />
                                                    </linearGradient>
                                                </defs>
                                                <Area
                                                    dataKey="total"
                                                    // type="natural"
                                                    fill="url(#fillSubmissions)"
                                                    fillOpacity={0.4}
                                                    stroke="#38bdf8"
                                                    stackId="a"
                                                />
                                                <Area
                                                    dataKey="PASSED"
                                                    // type="natural"
                                                    fill="url(#fillPassed)"
                                                    fillOpacity={0.4}
                                                    stroke="#22c55e"
                                                    stackId="b"
                                                />
                                            </AreaChart>
                                        </ChartContainer>
                                        <p className="text-sm ml-4 opacity-70">
                                            <Info className="size-[14px] inline mr-2 -translate-y-[1px]" />
                                            Biểu đồ này thống kê số lượt nộp bài của khoá học
                                        </p>
                                    </div>
                                    <div className="flex gap-6 w-full">
                                        <div className="flex flex-col p-4 pb-5 px-5 gap-6 border bg-secondary/10 rounded-md flex-1">
                                            <h2 className="font-bold">Kết quả nộp bài</h2>
                                            <div className="flex flex-col gap-5">
                                                <div className="flex items-start flex-col gap-1">
                                                    <div className="w-full flex items-center justify-between">
                                                        <span className="text-xs font-medium opacity-80">Hoàn thành</span>
                                                        <span className="text-xs font-medium opacity-80">{(((countSubmissions.PASSED / countSubmissions.total) || 0) * 100).toFixed(1)}%</span>
                                                    </div>
                                                    <div className={`w-full h-2 rounded-[2px] bg-secondary/60`}>
                                                        <div className="h-full rounded-[2px] bg-green-500" style={{ width: `${(((countSubmissions.PASSED / countSubmissions.total) || 0) * 100).toFixed(1)}%` }}></div>
                                                    </div>
                                                </div>
                                                <div className="flex items-start flex-col gap-1">
                                                    <div className="w-full flex items-center justify-between">
                                                        <span className="text-xs font-medium opacity-80">Sai kết quả</span>
                                                        <span className="text-xs font-medium opacity-80">{(((countSubmissions.FAILED / countSubmissions.total) || 0) * 100).toFixed(1)}%</span>
                                                    </div>
                                                    <div className={`w-full h-2 rounded-[2px] bg-secondary/60`}>
                                                        <div className="h-full rounded-[2px] bg-red-500" style={{ width: `${(((countSubmissions.FAILED / countSubmissions.total) || 0) * 100).toFixed(1)}%` }}></div>
                                                    </div>
                                                </div>
                                                <div className="flex items-start flex-col gap-1">
                                                    <div className="w-full flex items-center justify-between">
                                                        <span className="text-xs font-medium opacity-80">Gặp vấn đề</span>
                                                        <span className="text-xs font-medium opacity-80">{(((countSubmissions.ERROR / countSubmissions.total) || 0) * 100).toFixed(1)}%</span>
                                                    </div>
                                                    <div className={`w-full h-2 rounded-[2px] bg-secondary/60`}>
                                                        <div className={`h-full rounded-[2px] bg-yellow-500`} style={{ width: `${(((countSubmissions.ERROR / countSubmissions.total) || 0) * 100).toFixed(1)}%` }}></div>
                                                    </div>
                                                </div>
                                                <div className="flex items-start flex-col gap-1">
                                                    <div className="w-full flex items-center justify-between">
                                                        <span className="text-xs font-medium opacity-80">Lỗi biên dịch</span>
                                                        <span className="text-xs font-medium opacity-80">{(((countSubmissions.COMPILE_ERROR / countSubmissions.total) || 0) * 100).toFixed(1)}%</span>
                                                    </div>
                                                    <div className={`w-full h-2 rounded-[2px] bg-secondary/60`}>
                                                        <div className={`h-full rounded-[2px] bg-slate-400`} style={{ width: `${(((countSubmissions.COMPILE_ERROR / countSubmissions.total) || 0) * 100).toFixed(1)}%` }}></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        {/* <div className="flex flex-col items-center justify-around gap-4 p-5 py-6 border bg-secondary/10 rounded-md flex-1">

                                        </div> */}
                                    </div>
                                </div>
                            </div>
                        </TabsContent>
                        <TabsContent value="problem_analysis">
                            <div className="w-full flex flex-col gap-6 pt-3 relative">
                                <div className="flex items-center justify-end absolute -top-14 right-0">
                                    <div className="relative max-w-[300px] flex-1">
                                        <Search className="absolute left-3 top-[12px] h-4 w-4 text-muted-foreground" />
                                        <Input
                                            type="search"
                                            placeholder="Tìm kiếm bài tập..."
                                            value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
                                            onChange={(event) =>
                                                table.getColumn("name")?.setFilterValue(event.target.value)
                                            }
                                            className="bg-transparent flex-1 rounded-md pl-9"
                                        />
                                    </div>
                                </div>
                                <div className="rounded-md border">
                                    <Table>
                                        <TableHeader>
                                            {table.getHeaderGroups().map((headerGroup) => (
                                                <TableRow key={headerGroup.id}>
                                                    {headerGroup.headers.map((header) => {
                                                        return (
                                                            <TableHead key={header.id}>
                                                                {header.isPlaceholder
                                                                    ? null
                                                                    : flexRender(
                                                                        header.column.columnDef.header,
                                                                        header.getContext()
                                                                    )}
                                                            </TableHead>
                                                        )
                                                    })}
                                                </TableRow>
                                            ))}
                                        </TableHeader>
                                        <TableBody>
                                            {table.getRowModel().rows?.length ? (
                                                table.getRowModel().rows.map((row) => (
                                                    <TableRow
                                                        key={row.id}
                                                        data-state={row.getIsSelected() && "selected"}
                                                    >
                                                        {row.getVisibleCells().map((cell) => (
                                                            <TableCell key={cell.id}>
                                                                {flexRender(
                                                                    cell.column.columnDef.cell,
                                                                    cell.getContext()
                                                                )}
                                                            </TableCell>
                                                        ))}
                                                    </TableRow>
                                                ))
                                            ) : (
                                                <TableRow>
                                                    <TableCell
                                                        colSpan={columns.length}
                                                        className="h-24 text-center"
                                                    >
                                                        Không có kết quả phù hợp.
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                        </TableBody>
                                    </Table>
                                </div>
                                <div className="flex items-center justify-end space-x-2 py-4">
                                    <div className="space-x-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => table.previousPage()}
                                            disabled={!table.getCanPreviousPage()}
                                        >
                                            Trước
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => table.nextPage()}
                                            disabled={!table.getCanNextPage()}
                                        >
                                            Sau
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </TabsContent>
                    </Tabs>
                </BlurFade>

            </div>
        </div >
    );
};

export default CourseStatistic;