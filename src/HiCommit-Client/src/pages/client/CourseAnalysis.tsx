import { getProblemByIDorSlug } from "@/service/API/Problem";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BlurFade from "@/components/magicui/blur-fade";
import { Button } from "@/components/ui/button";
import { AlignLeft, ArrowBigUpDash, BetweenHorizontalStart, CircleCheckBig, Info, Lollipop, SquareDashedKanban, Zap } from "lucide-react";

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
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"
import { analysisSubmissionOfCourse, countSubmissions60daysAgo, getCourseAnalysis } from "@/service/API/Analysis";

import leaderboard_art from "@/assets/imgs/LeaderBoard_Art.png";
import time_art from "@/assets/imgs/Time_Art.png";
import search_art from "@/assets/imgs/Search_Art.png";
import { getCourseById } from "@/service/API/Course";

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

function CourseAnalysis() {

    const { course_id } = useParams<{ course_id: string }>();

    const [course, setCourse] = useState<any>({});

    const [submissionsAnalysis, setSubmissionsAnalysis] = useState<any>({});
    const [submissionsAnalysisOfCourse, setSubmissionsAnalysisOfCourse] = useState<any>({});

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

    const handleGetCourse = async () => {
        const response = await getCourseById(course_id as any);
        setCourse(response);
    }

    const handleGetCourseAnalysis = async () => {
        const response = await getCourseAnalysis(course_id as any);
        setSubmissionsAnalysis(response);
        handleFilterChangeForPassedAnalysis(userFilter);
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
    }, []);

    useEffect(() => {
        handleFilterChangeForPassedAnalysis(userFilter);
    }, [submissionsAnalysis, userFilter]);

    useEffect(() => {
        handleFilterChangeForSubmissionsAnalysis(dayFilter, userFilter);
    }, [submissionsAnalysisOfCourse, dayFilter, userFilter]);

    return (
        <div className="CourseAnalysis p-6 px-8 flex flex-col gap-6">
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
                            <BreadcrumbLink asChild>
                                <Link to={`/course/${course?.slug || course?.id}`}>{course?.name}</Link>
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            Phân tích dữ liệu khoá học
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </BlurFade>
            </Breadcrumb>
            <h2 className="text-2xl font-bold">Phân tích số liệu khoá học</h2>
            <div className="flex flex-col gap-6">
                <BlurFade delay={0.3} yOffset={0} blur="2px">
                    <Tabs defaultValue="submissions" className="w-full">
                        <TabsList className="bg-transparent justify-start rounded-none pb-3 px-0 border-b-[2px] border-secondary/40 w-full">
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
                                    <Zap className="w-4 mr-2" />Mức độ hoàn thành
                                </Button>
                            </TabsTrigger>
                        </TabsList>
                        <TabsContent value="passed_analysis">
                            <div className="flex flex-col pt-8 relative">
                                <div className="ml-auto absolute -top-14 right-0">
                                    <div className="flex gap-4">
                                        <Select value={userFilter} onValueChange={(value) => {
                                            setUserFilter(value);
                                        }}>
                                            <SelectTrigger className="w-fit gap-3 border-none focus:ring-0 focus:ring-offset-0">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all_user" className="pr-6">Tất cả</SelectItem>
                                                <SelectItem value="only_me" className="pr-6">Chỉ mình tôi</SelectItem>
                                            </SelectContent>
                                        </Select>
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
                                        <Select value={userFilter} onValueChange={(value) => {
                                            setUserFilter(value);
                                        }}>
                                            <SelectTrigger className="w-fit gap-3 border-none focus:ring-0 focus:ring-offset-0">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all_user" className="pr-6">Tất cả</SelectItem>
                                                <SelectItem value="only_me" className="pr-6">Chỉ mình tôi</SelectItem>
                                            </SelectContent>
                                        </Select>
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
                                        <div className="flex flex-col items-center justify-around gap-4 p-5 py-6 border bg-secondary/10 rounded-md flex-1">

                                        </div>
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

export default CourseAnalysis;