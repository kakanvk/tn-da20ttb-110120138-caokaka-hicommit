import { getProblemByIDorSlug } from "@/service/API/Problem";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BlurFade from "@/components/magicui/blur-fade";
import { Button } from "@/components/ui/button";
import { AlignLeft, ArrowBigUpDash, CircleCheckBig, Lollipop, SquareDashedKanban } from "lucide-react";

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
import { countSubmissions60daysAgo } from "@/service/API/Analysis";

import leaderboard_art from "@/assets/imgs/LeaderBoard_Art.png";
import time_art from "@/assets/imgs/Time_Art.png";
import search_art from "@/assets/imgs/Search_Art.png";

const chartConfig = {
    submissions: {
        label: "Lượt nộp bài:",
        color: "hsl(var(--chart-2))",
    },
    PASSED: {
        label: "Chính xác",
        color: "hsl(var(--chart-2))",
    },
    FAILED: {
        label: "Sai kết quả",
        color: "hsl(var(--chart-3))",
    },
    ERROR: {
        label: "Gặp vấn đề",
        color: "hsl(var(--chart-4))",
    },
    COMPILE_ERROR: {
        label: "Lỗi biên dịch",
        color: "hsl(var(--chart-5))",
    },
} satisfies ChartConfig;

function ProblemAnalysis() {

    const { problem_id } = useParams<{ problem_id: string }>();

    const [problem, setProblem] = useState<any>({});

    const [submissionsAnalysis, setSubmissionsAnalysis] = useState<any>({});
    const [dayFilter, setDayFilter] = useState<string>("60");
    const [userFilter, setUserFilter] = useState<string>("all");

    const [submissionsAnalysisFiltered, setSubmissionsAnalysisFiltered] = useState<any>([]);
    const [percentSubmissions, setPercentSubmissions] = useState<any>({
        TOTAL: 0,
        PASSED: 0,
        FAILED: 0,
        ERROR: 0,
        COMPILE_ERROR: 0,
    });

    const handleGetProblem = async () => {
        const response = await getProblemByIDorSlug(problem_id as any);
        setProblem(response);
    }

    const handleGetSubmissionsAnalysis = async () => {
        const response = await countSubmissions60daysAgo(problem_id as any);
        setSubmissionsAnalysis(response);
        console.log(response);
    }

    const handleFilterSubmissionsAnalysis = (_dayFilter: string, _userFilter: string) => {

        let filtered = [];

        if (!submissionsAnalysis) return;

        if (_userFilter === "me") {
            filtered = submissionsAnalysis.me;
        } else {
            filtered = submissionsAnalysis.all;
        }

        // Cắt từ cuối mảng
        filtered = filtered?.slice(-parseInt(_dayFilter));
        setSubmissionsAnalysisFiltered(filtered);

        let total = filtered?.reduce((acc: any, curr: any) => acc + curr.submissions, 0);
        let passed = filtered?.reduce((acc: any, curr: any) => acc + curr.PASSED, 0);
        let failed = filtered?.reduce((acc: any, curr: any) => acc + curr.FAILED, 0);
        let error = filtered?.reduce((acc: any, curr: any) => acc + curr.ERROR, 0);
        let compileError = filtered?.reduce((acc: any, curr: any) => acc + curr.COMPILE_ERROR, 0);

        setPercentSubmissions({
            TOTAL: total,
            PASSED: passed,
            FAILED: failed,
            ERROR: error,
            COMPILE_ERROR: compileError,
        });

    }

    useEffect(() => {
        handleGetProblem();
        handleGetSubmissionsAnalysis();
    }, []);

    useEffect(() => {
        handleFilterSubmissionsAnalysis(dayFilter, userFilter);
    }, [submissionsAnalysis]);

    return (
        <div className="ProblemAnalysis p-6 px-8 flex flex-col gap-6">
            <Breadcrumb>
                <BlurFade delay={0.1} yOffset={0} blur="2px">
                    <BreadcrumbList>
                        {
                            problem?.type === "COURSE" &&
                            <>
                                <BreadcrumbItem>
                                    <BreadcrumbLink asChild>
                                        <Link to="/">Khoá học của tôi</Link>
                                    </BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator />
                                <BreadcrumbItem>
                                    <BreadcrumbLink>
                                        <Link to={`/course/${problem?.parent?.id}`}>{problem?.parent?.name}</Link>
                                    </BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator />
                            </>
                        }
                        {
                            problem?.type === "CONTEST" &&
                            <>
                                <BreadcrumbItem>
                                    <BreadcrumbLink asChild>
                                        <Link to="/contest">Các cuộc thi</Link>
                                    </BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator />
                                <BreadcrumbItem>
                                    <BreadcrumbLink>
                                        <Link to={`/contest/${problem?.parent?.id}`}>{problem?.parent?.name}</Link>
                                    </BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator />
                            </>
                        }
                        {
                            problem?.type === "FREE" &&
                            <>
                                <BreadcrumbItem>
                                    <BreadcrumbLink asChild>
                                        <Link to="/problems">Các bài tập</Link>
                                    </BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator />
                            </>
                        }
                        <BreadcrumbItem>
                            <BreadcrumbLink asChild>
                                <Link to={`/problem/${problem?.slug}`}>{problem?.name}</Link>
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            Phân tích
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </BlurFade>
            </Breadcrumb>
            <h2 className="text-2xl font-bold">Phân tích số liệu</h2>
            <div className="flex flex-col gap-6">
                <BlurFade delay={0.3} yOffset={0} blur="2px">
                    <Tabs defaultValue="submissions" className="w-full">
                        <TabsList className="bg-transparent justify-start rounded-none pb-3 px-0 border-b-[2px] border-secondary/40 w-full">
                            <TabsTrigger
                                value="submissions"
                                className="px-1 border-b-2 border-b-transparent drop-shadow-none data-[state=active]:border-b-primary rounded-none bg-transparent data-[state=active]:bg-transparent duration-500"
                            >
                                <Button variant="ghost" size="sm" className="hover:bg-secondary/60">
                                    <SquareDashedKanban className="w-4 mr-2" />Tần suất nộp bài
                                </Button>
                            </TabsTrigger>
                            {/* <TabsTrigger
                                value="accuracy"
                                className="px-1 border-b-2 border-b-transparent drop-shadow-none data-[state=active]:border-b-primary rounded-none bg-transparent data-[state=active]:bg-transparent duration-500"
                            >
                                <Button variant="ghost" size="sm" className="hover:bg-secondary/60">
                                    <CircleCheckBig className="w-4 mr-2" />Tỷ lệ chính xác
                                </Button>
                            </TabsTrigger> */}
                        </TabsList>
                        <TabsContent value="submissions">
                            <div className="flex flex-col pt-8 relative">
                                <div className="ml-auto absolute -top-14 right-0">
                                    <div className="scale-90 flex gap-2.5">
                                        <Select value={dayFilter} onValueChange={(value) => {
                                            setDayFilter(value);
                                            handleFilterSubmissionsAnalysis(value, userFilter);
                                        }}>
                                            <SelectTrigger className="w-[210px]">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="7">7 ngày gần nhất</SelectItem>
                                                <SelectItem value="14">14 ngày gần nhất</SelectItem>
                                                <SelectItem value="30">30 ngày gần nhất</SelectItem>
                                                <SelectItem value="60">60 ngày gần nhất</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <Select value={userFilter} onValueChange={(value) => {
                                            setUserFilter(value);
                                            handleFilterSubmissionsAnalysis(dayFilter, value);
                                        }}>
                                            <SelectTrigger className="w-[180px]">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">Tất cả</SelectItem>
                                                <SelectItem value="me">Chỉ mình tôi</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-8">
                                    <ChartContainer config={chartConfig} className="aspect-[10/3] w-full">
                                        <AreaChart
                                            accessibilityLayer
                                            data={submissionsAnalysisFiltered}
                                            margin={{
                                                left: -20,
                                                right: 0,
                                            }}
                                        >
                                            <CartesianGrid vertical={false} />
                                            <XAxis
                                                dataKey="date"
                                                tickLine={false}
                                                axisLine={false}
                                                tickMargin={8}
                                            />
                                            <YAxis
                                                tickLine={false}
                                                axisLine={false}
                                                tickMargin={8}
                                                tickCount={3}
                                            />
                                            <ChartTooltip
                                                cursor={false}
                                                content={<ChartTooltipContent className="max-w-[130px]" />}
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
                                                dataKey="submissions"
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
                                    <div className="flex gap-6 w-full">
                                        <div className="flex flex-col p-4 pb-5 px-5 gap-6 border bg-secondary/10 rounded-md flex-1">
                                            <h2 className="font-bold">Kết quả nộp bài</h2>
                                            <div className="flex flex-col gap-5">
                                                <div className="flex items-start flex-col gap-1">
                                                    <div className="w-full flex items-center justify-between">
                                                        <span className="text-xs font-medium opacity-80">Hoàn thành</span>
                                                        <span className="text-xs font-medium opacity-80">{(((percentSubmissions.PASSED / percentSubmissions.TOTAL) || 0) * 100).toFixed(1)}%</span>
                                                    </div>
                                                    <div className={`w-full h-2 rounded-[2px] bg-secondary/60`}>
                                                        <div className="h-full rounded-[2px] bg-green-500" style={{ width: `${(((percentSubmissions.PASSED / percentSubmissions.TOTAL) || 0) * 100).toFixed(1)}%` }}></div>
                                                    </div>
                                                </div>
                                                <div className="flex items-start flex-col gap-1">
                                                    <div className="w-full flex items-center justify-between">
                                                        <span className="text-xs font-medium opacity-80">Sai kết quả</span>
                                                        <span className="text-xs font-medium opacity-80">{(((percentSubmissions.FAILED / percentSubmissions.TOTAL) || 0) * 100).toFixed(1)}%</span>
                                                    </div>
                                                    <div className={`w-full h-2 rounded-[2px] bg-secondary/60`}>
                                                        <div className="h-full rounded-[2px] bg-red-500" style={{ width: `${(((percentSubmissions.FAILED / percentSubmissions.TOTAL) || 0) * 100).toFixed(1)}%` }}></div>
                                                    </div>
                                                </div>
                                                <div className="flex items-start flex-col gap-1">
                                                    <div className="w-full flex items-center justify-between">
                                                        <span className="text-xs font-medium opacity-80">Gặp vấn đề</span>
                                                        <span className="text-xs font-medium opacity-80">{((percentSubmissions.ERROR / percentSubmissions.TOTAL) || 0 * 100).toFixed(1)}%</span>
                                                    </div>
                                                    <div className={`w-full h-2 rounded-[2px] bg-secondary/60`}>
                                                        <div className={`h-full rounded-[2px] bg-yellow-500`} style={{ width: `${(((percentSubmissions.ERROR / percentSubmissions.TOTAL) || 0) * 100).toFixed(1)}%` }}></div>
                                                    </div>
                                                </div>
                                                <div className="flex items-start flex-col gap-1">
                                                    <div className="w-full flex items-center justify-between">
                                                        <span className="text-xs font-medium opacity-80">Lỗi biên dịch</span>
                                                        <span className="text-xs font-medium opacity-80">{(((percentSubmissions.COMPILE_ERROR / percentSubmissions.TOTAL) || 0) * 100).toFixed(1)}%</span>
                                                    </div>
                                                    <div className={`w-full h-2 rounded-[2px] bg-secondary/60`}>
                                                        <div className={`h-full rounded-[2px] bg-slate-400`} style={{ width: `${(((percentSubmissions.COMPILE_ERROR / percentSubmissions.TOTAL) || 0) * 100).toFixed(1)}%` }}></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-center justify-around gap-4 p-5 py-6 border bg-secondary/10 rounded-md flex-1">
                                            {/* <img src={search_art} alt="search_art" className="w-[80px] object-contain opacity-90" /> */}
                                            <ChartContainer config={chartConfig} className="aspect-[10/3] w-full">
                                                <AreaChart
                                                    accessibilityLayer
                                                    data={submissionsAnalysisFiltered}
                                                    margin={{
                                                        left: -20,
                                                        right: 0,
                                                        top: 20,
                                                        bottom: 20,
                                                    }}
                                                >

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
                                                        dataKey="submissions"
                                                        type="natural"
                                                        fill="url(#fillSubmissions)"
                                                        fillOpacity={0.4}
                                                        stroke="#38bdf8"
                                                        stackId="a"
                                                    />
                                                </AreaChart>
                                            </ChartContainer>
                                            <div className="flex flex-wrap items-start justify-around w-full gap-2">
                                                <div className="flex flex-col items-center justify-center gap-1">
                                                    <h2 className="text-xs opacity-60">Lượt nộp bài</h2>
                                                    <h2 className="font-semibold text-2xl primary">{percentSubmissions.TOTAL}</h2>
                                                </div>
                                                <div className="flex flex-col items-center justify-center gap-1">
                                                    <h2 className="text-xs opacity-60">Hoàn thành</h2>
                                                    <h2 className="font-semibold text-2xl primary">{percentSubmissions.PASSED}</h2>
                                                </div>
                                                <div className="flex flex-col items-center justify-center gap-1">
                                                    <h2 className="text-xs opacity-60">Sai kết quả</h2>
                                                    <h2 className="font-semibold text-2xl primary">{percentSubmissions.FAILED}</h2>
                                                </div>
                                                <div className="flex flex-col items-center justify-center gap-1">
                                                    <h2 className="text-xs opacity-60">Gặp vấn đề</h2>
                                                    <h2 className="font-semibold text-2xl primary">{percentSubmissions.ERROR}</h2>
                                                </div>
                                                <div className="flex flex-col items-center justify-center gap-1">
                                                    <h2 className="text-xs opacity-60">Lỗi biên dịch</h2>
                                                    <h2 className="font-semibold text-2xl primary">{percentSubmissions.COMPILE_ERROR}</h2>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </TabsContent>
                        <TabsContent value="accuracy">
                            <div className="flex flex-col pt-8">

                            </div>
                        </TabsContent>
                    </Tabs>
                </BlurFade>

            </div>
        </div >
    );
};

export default ProblemAnalysis;