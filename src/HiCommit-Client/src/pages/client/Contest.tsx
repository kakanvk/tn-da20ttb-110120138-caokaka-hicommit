import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Link, useNavigate, useParams } from "react-router-dom";

import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

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

import RingProgress from "@/components/ui/ringProcess";
import { AlignEndHorizontal, AlignLeft, ArrowRight, BarChartBig, Eye, History, LogOut, MessagesSquare, MoveRight, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useEffect, useState } from "react";
import Ranking from "./Ranking";
import { Button } from "@/components/ui/button";
import { exitContest, getContestByID, getContestDescriptionByID, getJoinedContest, getMembersByContestID, getSubmissionsByContestID, joinContest } from "@/service/API/Contest";
import BlurFade from "@/components/magicui/blur-fade";
import { formatTimeAgo, timestampChange, timestampToDateTime } from "@/service/DateTimeService";
import moment from "moment";
import toast from "react-hot-toast";
import { Input } from "@/components/ui/input";
import { getMySubmited } from "@/service/API/Submission";
import { GitGraph, GitGraphBody, GitGraphFree, GitGraphHead, GitGraphNode } from "@/components/ui/git-graph";
import { useLogin } from "@/service/LoginContext";
import { useSocket } from "@/service/SocketContext";

// Function to calculate the remaining time and the progress percentage
const calculateTimeLeft = (endTime: number, totalTime: number): { timeLeft: string; percent: number } => {
    const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
    let timeLeft = endTime - currentTime; // Time left in seconds

    if (timeLeft < 0) timeLeft = 0; // If time has passed, set timeLeft to 0

    // Calculate hours, minutes, and seconds left
    const hours = Math.floor(timeLeft / 3600);
    const minutes = Math.floor((timeLeft % 3600) / 60);
    const seconds = timeLeft % 60;

    // Calculate the percentage of time left
    const percent = Math.min(100, (timeLeft / totalTime) * 100);

    return {
        timeLeft: `${hours < 10 ? "0" + hours : hours}:${minutes < 10 ? "0" + minutes : minutes}:${seconds < 10 ? "0" + seconds : seconds}`,
        percent,
    };
};

// Function to calculate the countdown time until the event starts
const calculateCountdown = (startTime: number): string => {
    const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
    let countdownTime = startTime - currentTime; // Time left until the event starts

    if (countdownTime < 0) countdownTime = 0; // If the event has already started, set countdownTime to 0

    // Calculate hours, minutes, and seconds left
    const hours = Math.floor(countdownTime / 3600);
    const minutes = Math.floor((countdownTime % 3600) / 60);
    const seconds = countdownTime % 60;

    return `${hours < 10 ? "0" + hours : hours}:${minutes < 10 ? "0" + minutes : minutes}:${seconds < 10 ? "0" + seconds : seconds}`;
};

function Contest() {

    const { contest_id } = useParams<{ contest_id: string }>();

    const loginContext = useLogin();

    const { socket } = useSocket() as any;

    const navigate = useNavigate();

    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(0, 0));
    const [countdown, setCountdown] = useState<any>(null);

    const [contest, setContest] = useState<any>(null);
    const [joinedContest, setJoinedContest] = useState<any>(null);
    const [description, setDescription] = useState<any>(null);
    const [mySubmited, setMySubmited] = useState<any>(null);

    const [submissions, setSubmissions] = useState<any[]>([]);
    const [submissionsFiltered, setSubmissionsFiltered] = useState<any[]>([]);
    const [problemMap, setProblemMap] = useState<any>({});
    const [members, setMembers] = useState<any[]>([]);
    const [selectedMember, setSelectedMember] = useState<string>("all");

    const [warningShow, setWarningShow] = useState(true);
    const [inputKey, setInputKey] = useState<string>("");

    const [topThree, setTopThree] = useState<any[]>([]);

    const statusPriority = {
        "PASSED": 5,
        "FAILED": 4,
        "ERROR": 3,
        "COMPILE_ERROR": 2,
        "PENDING": 1
    };

    const fetchData = async () => {
        const submissions = await getSubmissionsByContestID(contest_id as any);
        const participants = await getMembersByContestID(contest_id as any);

        const calculatedLeaderboard = participants.map((participant: any) => {
            const userSubmissions = submissions.filter((sub: any) => sub.username === participant.username);

            let highestStatus = "PENDING";
            let totalScore = 0;
            let penalty = 0;

            const solvedProblems = new Set();

            if (userSubmissions.length === 0) {
                highestStatus = "NONE";
            } else {
                userSubmissions.forEach((sub: any) => {
                    if (statusPriority[sub.status as keyof typeof statusPriority] > statusPriority[highestStatus as keyof typeof statusPriority]) {
                        highestStatus = sub.status;
                    }

                    if (sub.status === "PASSED" && !solvedProblems.has(sub.problem_slug)) {
                        totalScore += sub.score;
                        penalty += sub.duration;
                        solvedProblems.add(sub.problem_slug);
                        // problemResults[sub.problem_slug].score = sub.score;
                    } else if (sub.status === "FAILED") {
                        penalty += 5;
                    } else if (sub.status === "ERROR") {
                        penalty += 10;
                    } else if (sub.status === "COMPILE_ERROR") {
                        penalty += 20;
                    }
                });
            }

            return {
                username: participant.username,
                avatar_url: participant.avatar_url,
                id: participant.id,
                status: highestStatus,
                try: userSubmissions.length,
                score: totalScore,
                penalty
            };
        });

        calculatedLeaderboard.sort((a: any, b: any) => {
            if (a.status === "NONE") return 1;
            if (b.status === "NONE") return -1;

            if (b.score === a.score) {
                return a.penalty - b.penalty;
            }
            return b.score - a.score;
        });

        // Cắt lấy top 3 có score lớn nhất và score > 0
        const topThreePlayers = calculatedLeaderboard.filter((player: any) => player.score > 0).slice(0, 3);
        setTopThree(topThreePlayers);

        console.log(topThreePlayers);
    };

    const getData = async () => {
        const data = await getContestByID(contest_id as any);
        console.log(data);
        setContest(data);

        if (loginContext.user) {
            const userIndex = data.members.findIndex((member: any) => member.username === loginContext.user.username);
            if (userIndex > -1) {
                const user = data.members.splice(userIndex, 1);
                data.members.unshift(user[0]);
            }
        }

        setMembers(data.members);

        const problems = data.problems.map((problem: any, index: number) => {
            return {
                [problem.slug]: problem.name
            }
        });

        setProblemMap(Object.assign({}, ...problems));

        setTimeLeft(calculateTimeLeft(data.end_time as any, data.duration as any));
    }

    const getDescription = async () => {
        const data = await getContestDescriptionByID(contest_id as any);
        // console.log(data);
        setDescription(data);
    }

    const getJoinedContestData = async () => {
        const response = await getJoinedContest();
        console.log(response);
        setJoinedContest(response);
    }

    const handleGetMySubmited = async () => {
        const response = await getMySubmited();
        setMySubmited(response);
    }

    const handleFilterSubmissions = () => {
        if (selectedMember === "all") {
            setSubmissionsFiltered(submissions);
        } else {
            const data = submissions.filter((submission: any) => submission.username === selectedMember);
            setSubmissionsFiltered(data);
        }
    }

    const getSubmissions = async () => {
        const data = await getSubmissionsByContestID(contest_id as any);
        // console.log(data);
        setSubmissions(data);
    }

    const handleExitContest = async () => {
        const response = await toast.promise(
            exitContest(contest_id as any),
            {
                loading: 'Đang kiểm tra...',
                success: 'Rời cuộc thi thành công',
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
            navigate(`/contest`);
        }, 500);
    }

    useEffect(() => {
        socket.on('new_submission', () => {
            getSubmissions();
        });

        return () => {
            socket.off('new_submission');
        };
    }, []);

    useEffect(() => {
        handleFilterSubmissions();
    }, [selectedMember, submissions]);

    useEffect(() => {
        Promise.allSettled([getData(), getDescription(), getJoinedContestData(), handleGetMySubmited(), getSubmissions(), fetchData()]);
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setTimeLeft(calculateTimeLeft(contest.end_time, contest.duration));
            setCountdown(calculateCountdown(contest.start_time));
        }, 1000);

        return () => clearInterval(interval);
    }, [contest]);

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

    const handleJoinContest = async () => {

        if (!contest?.public && inputKey === "") {
            pushError("Mã tham gia không được để trống");
            return;
        }

        setInputKey("");

        const response = await toast.promise(
            joinContest(contest_id as any, inputKey),
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
            window.location.reload();
        }, 500);

    }

    return (
        <div className="Contest p-6 px-8 flex flex-col gap-8">
            <Breadcrumb>
                <BlurFade delay={0} yOffset={0}>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink asChild>
                                <Link to="/contest">Các cuộc thi</Link>
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            {contest ? contest?.name : "..."}
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </BlurFade>
            </Breadcrumb>
            <div className="flex w-full gap-8 2xl:gap-10 relative items-start">
                <div className="flex-1 flex flex-col gap-3">
                    {
                        timeLeft.percent <= 0 && warningShow && (
                            <div className="flex items-center justify-between border rounded-md p-2 px-3 pr-2 text-[13px] italic text-amber-500 font-medium dark:text-amber-400 border-amber-400/50 bg-amber-500/10">
                                <span>
                                    <i className="fa-solid fa-circle-info mr-2"></i>
                                    Cuộc thi này đã kết thúc
                                </span>
                                <Button size="icon" variant="ghost" className="size-5" onClick={() => setWarningShow(false)}>
                                    <X className="size-4" />
                                </Button>
                            </div>
                        )
                    }
                    <BlurFade delay={0.1} yOffset={0}>
                        <h1 className="text-2xl font-bold">
                            <span className="mr-2">{contest?.name}</span>
                            {
                                contest?.public &&
                                <Badge variant="outline" className="text-[12px] p-0 px-2 pr-3 font-normal leading-6 -translate-y-0.5">
                                    <Eye className="h-3 w-3 mr-2" />Công khai
                                </Badge>
                            }
                        </h1>
                    </BlurFade>
                    <div className="flex flex-col gap-2">
                        <Tabs defaultValue="content" className="w-full">
                            <BlurFade delay={0.25} yOffset={0} blur="2px">
                                <TabsList className="mt-3 bg-transparent justify-start rounded-none pb-3 px-0 border-b-[2px] border-secondary/40 w-full">
                                    <TabsTrigger
                                        value="content"
                                        className="px-1 border-b-2 border-b-transparent drop-shadow-none data-[state=active]:border-b-primary rounded-none bg-transparent data-[state=active]:bg-transparent duration-500"
                                    >
                                        <Button variant="ghost" size="sm" className="hover:bg-secondary/60">
                                            <AlignLeft className="w-4 mr-2" />Chi tiết
                                        </Button>
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="ranking"
                                        className="px-1 border-b-2 border-b-transparent drop-shadow-none data-[state=active]:border-b-primary rounded-none bg-transparent data-[state=active]:bg-transparent duration-500"
                                    >
                                        <Button variant="ghost" size="sm" className="hover:bg-secondary/60">
                                            <BarChartBig className="w-4 mr-2" />Bảng xếp hạng
                                        </Button>
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="history"
                                        className="px-1 border-b-2 border-b-transparent drop-shadow-none data-[state=active]:border-b-primary rounded-none bg-transparent data-[state=active]:bg-transparent duration-500"
                                    >
                                        <Button variant="ghost" size="sm" className="hover:bg-secondary/60">
                                            <History className="w-4 mr-2" />Các bài nộp
                                        </Button>
                                    </TabsTrigger>
                                </TabsList>
                            </BlurFade>
                            <TabsContent value="content" className="w-full">
                                <div className="flex flex-col gap-5 py-3">
                                    {
                                        description &&
                                        <BlurFade delay={0.2} yOffset={0}>
                                            <div
                                                className="ck-content hicommit-content leading-7 text-justify flex-1"
                                                dangerouslySetInnerHTML={{ __html: description }}
                                            />
                                        </BlurFade>
                                    }
                                    {
                                        joinedContest?.id === contest_id ?
                                            <BlurFade delay={0.3} yOffset={0} blur="2px">
                                                <div className="w-full flex flex-col gap-2">
                                                    <h2 className="">Đề bài:</h2>
                                                    <div className="border rounded-lg overflow-hidden">
                                                        <Table>
                                                            <TableHeader className="bg-secondary/50">
                                                                <TableRow className="hover:bg-transparent">
                                                                    <TableHead className="w-[60px]">ID</TableHead>
                                                                    <TableHead>Tên bài</TableHead>
                                                                    <TableHead>Ngôn ngữ</TableHead>
                                                                    <TableHead className="text-right">Điểm</TableHead>
                                                                </TableRow>
                                                            </TableHeader>
                                                            <TableBody>
                                                                {
                                                                    contest?.problems.map((problem: any, index: number) => (
                                                                        <TableRow key={index} className="hover:bg-transparent">
                                                                            <TableCell className="font-medium">
                                                                                {String.fromCharCode(65 + index)}
                                                                            </TableCell>
                                                                            <TableCell>
                                                                                <Link to={`/problem/${problem?.slug}`} className="hover:text-green-600 dark:hover:text-green-500 font-semibold">
                                                                                    <span className="mr-2">{problem.name}</span>
                                                                                    {mySubmited[problem?.slug as keyof typeof mySubmited] === "PASSED" && <i className="text-[12px] fa-solid fa-circle-check text-green-600"></i>}
                                                                                    {mySubmited[problem?.slug as keyof typeof mySubmited] === "FAILED" && <i className="text-[12px] fa-solid fa-circle-xmark text-red-500"></i>}
                                                                                    {mySubmited[problem?.slug as keyof typeof mySubmited] === "ERROR" && <i className="text-[12px] fa-solid fa-circle-exclamation text-amber-500"></i>}
                                                                                    {mySubmited[problem?.slug as keyof typeof mySubmited] === "COMPILE_ERROR" && <i className="text-[12px] fa-solid fa-triangle-exclamation text-zinc-400"></i>}
                                                                                    {(mySubmited[problem?.slug] === "PENDING" || !mySubmited[problem?.slug]) && <i className="text-[12px] fa-solid fa-circle-minus text-zinc-400"></i>}
                                                                                </Link>
                                                                            </TableCell>
                                                                            <TableCell>
                                                                                <Badge variant="secondary" className="text-[11px] p-0 px-1.5 leading-5 rounded-sm">
                                                                                    {problem.language === "c" && "C"}
                                                                                    {problem.language === "cpp" && "C++"}
                                                                                    {problem.language === "java" && "Java"}
                                                                                </Badge>
                                                                            </TableCell>
                                                                            <TableCell className="text-right">
                                                                                <Badge variant="secondary" className="text-[11px] p-0 px-1.5 leading-5 rounded-sm">
                                                                                    {problem.score}
                                                                                </Badge>
                                                                            </TableCell>
                                                                        </TableRow>
                                                                    ))
                                                                }
                                                            </TableBody>
                                                        </Table>
                                                    </div>
                                                </div>
                                            </BlurFade> :
                                            <BlurFade delay={0.3} yOffset={0} blur="2px">
                                                <div className="w-full flex flex-col gap-2">
                                                    <h2 className="">Đề bài:</h2>
                                                    <div className="h-[200px] border rounded-lg bg-secondary/40 dark:bg-secondary/10 flex flex-col items-center justify-center gap-2">
                                                        <i className="fa-solid fa-lock mr-3 text-2xl opacity-50"></i>
                                                        <span className="opacity-60 text-sm">Chỉ hiển thị trong thời gian diễn ra cuộc thi</span>
                                                    </div>
                                                </div>
                                            </BlurFade>
                                    }
                                </div>
                            </TabsContent>
                            <TabsContent value="ranking" className="w-full">
                                <div className="flex flex-col gap-5 py-3">
                                    {
                                        contest?.start_time <= moment(new Date().getTime()).unix() ?
                                            <BlurFade delay={0.2} yOffset={0} blur="2px">
                                                <Ranking />
                                            </BlurFade> :
                                            <BlurFade delay={0.2} yOffset={0} blur="2px">
                                                <div className="w-full flex flex-col gap-2">
                                                    <div className="h-[200px] border rounded-lg bg-secondary/40 dark:bg-secondary/10 flex flex-col items-center justify-center gap-2">
                                                        <i className="fa-solid fa-lock mr-3 text-2xl opacity-50"></i>
                                                        <span className="opacity-60 text-sm">Chỉ hiển thị trong thời gian diễn ra cuộc thi</span>
                                                    </div>
                                                </div>
                                            </BlurFade>
                                    }
                                </div>
                            </TabsContent>
                            <TabsContent value="history" className="w-full">
                                <div className="flex flex-col gap-5 py-3">
                                    <div>
                                        <Select value={selectedMember} onValueChange={(value) => setSelectedMember(value)}>
                                            <SelectTrigger className="w-[180px] rounded-lg bg-secondary/10">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">Tất cả</SelectItem>
                                                {
                                                    members?.map((member: any, index: number) => (
                                                        <SelectItem key={index} value={member.username}>
                                                            {member.username}
                                                            {loginContext.user.username === member.username &&
                                                                <span className="italic text-primary ml-1 text-sm">(Bạn)</span>
                                                            }
                                                        </SelectItem>
                                                    ))
                                                }
                                            </SelectContent>
                                        </Select>
                                        {
                                            (submissionsFiltered?.length > 0) ?
                                                <div>
                                                    <GitGraph>
                                                        <GitGraphBody className="pl-6">
                                                            <BlurFade delay={0.1} yOffset={0}>
                                                                <GitGraphFree className="h-3" />
                                                            </BlurFade>
                                                            {
                                                                submissionsFiltered?.map((submission, index) => {
                                                                    return (
                                                                        <BlurFade key={submission?.id} delay={0.15 + index * 0.05} yOffset={0}>
                                                                            <GitGraphNode end={index === submissionsFiltered?.length - 1 ? true : false} className="py-0">
                                                                                <Link className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border bg-zinc-100/80 dark:bg-zinc-900 hover:bg-zinc-200/50 hover:dark:bg-zinc-800/70 p-3 px-5 rounded-lg duration-100" to={`/submission/${submission.id}`}>
                                                                                    <div className="flex-1 flex flex-col gap-2">
                                                                                        <p className="font-semibold text-base">
                                                                                            {
                                                                                                problemMap[submission?.problem_slug] ?
                                                                                                    <span className="text-sm">{problemMap[submission?.problem_slug]}</span> :
                                                                                                    <span className="text-sm">{submission?.problem_slug}</span>
                                                                                            }
                                                                                            {submission?.status === "PENDING" &&
                                                                                                <span className="relative inline-flex h-3 w-3 ml-2.5">
                                                                                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                                                                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
                                                                                                </span>
                                                                                            }
                                                                                            {submission?.status === "PASSED" && <i className="fa-solid fa-circle-check text-green-600 ml-2.5 text-[14px]"></i>}
                                                                                            {(submission?.status === "FAILED" || submission?.status === "ERROR" || submission?.status === "COMPILE_ERROR") && <i className="fa-solid fa-circle-xmark text-red-500 ml-2.5 text-[14px]"></i>}
                                                                                        </p>
                                                                                        <div className="text-[14px] flex items-baseline gap-1.5 flex-wrap">
                                                                                            <span className="opacity-70">Commit bởi</span>
                                                                                            <strong className="font-semibold hover:underline cursor-pointer">{submission?.username}</strong>
                                                                                            <span className="opacity-50 text-[13px] font-medium dark:font-normal ml-0.5">
                                                                                                <i className="fa-solid fa-circle text-[3px] -translate-y-[3.5px] mr-2"></i>
                                                                                                {formatTimeAgo(submission.createdAt, "vi")}
                                                                                            </span>
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="flex flex-col items-start sm:items-end gap-1">
                                                                                        <span className="text-xs opacity-60">Thời gian</span>
                                                                                        <strong>
                                                                                            {
                                                                                                submission.status === "PENDING" ? (
                                                                                                    <span className="text-sm text-amber-500">Đang chấm</span>
                                                                                                ) : submission.duration + "s"

                                                                                            }
                                                                                        </strong>
                                                                                    </div>
                                                                                </Link>
                                                                            </GitGraphNode>
                                                                        </BlurFade>
                                                                    )
                                                                })
                                                            }
                                                        </GitGraphBody>
                                                    </GitGraph>
                                                    <div className="mt-8">
                                                        <p className="text-sm">
                                                            <i className="fa-solid fa-circle-info mr-2 opacity-50"></i>
                                                            <span className="opacity-70">Được thực hiện bởi</span>
                                                            <Badge variant="secondary" className="rounded px-1.5 -translate-y-[2px] ml-2">
                                                                <i className="fa-regular fa-circle-play mr-1"></i>GitHub Actions
                                                            </Badge>
                                                        </p>
                                                    </div>
                                                </div> :
                                                <div className="w-full flex justify-center py-10 bg-secondary/30 dark:bg-secondary/10 border rounded-lg mt-5">
                                                    <p className="text-center">Chưa có bài nộp nào.</p>
                                                </div>
                                        }
                                    </div>
                                </div>
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>
                {
                    contest?.start_time > moment(new Date().getTime()).unix() ?
                        <BlurFade delay={0.2} yOffset={0} className="w-[280px] 2xl:w-[300px] p-7 border rounded-lg bg-secondary/10 sticky top-4">
                            <div className="relative flex flex-col items-center justify-center gap-2">
                                <h2 className="font-bold text-lg">Bắt đầu sau</h2>
                                {
                                    countdown &&
                                    <span className="font-semibold text-green-600 dark:text-green-500 mx-1.5 border p-2 px-4 rounded-lg border-2 border-primary bg-primary/10">
                                        <span className="text-3xl font-extrabold">{countdown}</span>
                                    </span>
                                }
                            </div>
                            <div className="flex flex-col mt-4 gap-1">
                                <p className="text-nowrap font-semibold dark:font-medium my-0.5">
                                    <span className="text-xs opacity-60 mr-1 italic">Diễn ra từ </span>
                                    <span className='text-foreground/70 font-semibold border border-foreground/30 rounded text-[12px] px-0.5 mr-1.5'>{timestampToDateTime(contest?.start_time).time}</span>
                                    {timestampToDateTime(contest?.start_time).date}
                                </p>
                                <p className="text-nowrap font-semibold dark:font-medium">
                                    <span className="text-xs opacity-60 mr-1 italic">Kết thúc </span>
                                    <span className='text-foreground/70 font-semibold border border-foreground/30 rounded text-[12px] px-0.5 mr-1.5'>{timestampToDateTime(contest?.end_time).time}</span>
                                    {timestampToDateTime(contest?.end_time).date}
                                </p>
                            </div>
                        </BlurFade> :
                        timeLeft.percent <= 0 ? (
                            <BlurFade delay={0.2} yOffset={0} className="w-[290px] 2xl:w-[320px] p-4 pb-2 border rounded-lg bg-secondary/10 sticky top-4">
                                <div className="relative flex flex-col items-center justify-center gap-6">
                                    <h2 className="font-bold text-lg">Kết quả cuộc thi</h2>
                                    <div className="flex flex-col gap-2.5 w-full">
                                        {
                                            topThree[0] &&
                                            <BlurFade delay={0.25}>
                                                <div className="flex items-center gap-2 w-full border rounded-lg p-3 pl-4 bg-primary text-white">
                                                    <span className="w-4 text-sm font-bold">1</span>
                                                    <div className="flex items-center">
                                                        <img src={topThree[0]?.avatar_url} className="size-[26px] rounded-full inline mr-2 border border-white" />
                                                        <span className="lowercase text-sm font-semibold line-clamp-1 break-words">{topThree[0]?.username}</span>
                                                    </div>
                                                    <Badge variant="secondary" className="ml-auto rounded-md bg-white text-primary text-[12px] p-0.5 px-2 font-black leading-5 text-nowrap">
                                                        {topThree[0]?.score}
                                                    </Badge>
                                                </div>
                                            </BlurFade>
                                        }
                                        {
                                            topThree[1] &&
                                            <BlurFade delay={0.3}>
                                                <div className="flex items-center gap-2 w-full border border-foreground/10 rounded-lg p-3 pl-4 bg-secondary">
                                                    <span className="w-4 text-sm font-bold opacity-70">2</span>
                                                    <div className="flex items-center">
                                                        <img src={topThree[1]?.avatar_url} className="size-[26px] rounded-full inline mr-2 border border-foreground/20" />
                                                        <span className="lowercase text-sm font-semibold text-l line-clamp-1 break-words">{topThree[1]?.username}</span>
                                                    </div>
                                                    <Badge variant="secondary" className="ml-auto rounded-md bg-foreground/10 dark:bg-foreground/20 text-[12px] p-0.5 px-2 font-black leading-5 text-nowrap">
                                                        {topThree[1]?.score}
                                                    </Badge>
                                                </div>
                                            </BlurFade>
                                        }
                                        {
                                            topThree[2] &&
                                            <BlurFade delay={0.35}>
                                                <div className="flex items-center gap-2 w-full border rounded-lg p-3 pl-4 bg-secondary/10">
                                                    <span className="w-4 text-sm font-bold opacity-70">3</span>
                                                    <div className="flex items-center">
                                                        <img src={topThree[2]?.avatar_url} className="size-[26px] rounded-full inline mr-2 border border-foreground/20" />
                                                        <span className="lowercase text-sm font-semibold text-l line-clamp-1 break-words">{topThree[2]?.username}</span>
                                                    </div>
                                                    <Badge variant="secondary" className="ml-auto rounded-md bg-secondary/50 dark:bg-secondary/60 text-[12px] p-0.5 px-2 font-black leading-5 text-nowrap">
                                                        {topThree[2]?.score}
                                                    </Badge>
                                                </div>
                                            </BlurFade>
                                        }
                                        <BlurFade delay={0.4}>
                                            <Button variant="ghost" className="group/more w-full">
                                                Xem tất cả<ArrowRight className="size-[14px] ml-2 duration-100 group-hover/more:ml-3" />
                                            </Button>
                                        </BlurFade>
                                    </div>
                                </div>
                            </BlurFade>
                        ) :
                            <BlurFade delay={0.2} yOffset={0} className="w-[280px] sticky top-6 flex flex-col gap-4">
                                <div className="relative border p-4 rounded-lg bg-secondary/10 aspect-square flex flex-col items-center justify-center">
                                    <RingProgress radius={120} stroke={10} progress={timeLeft.percent} textSize={25} label=" " />
                                    <div className="flex flex-col items-center absolute">
                                        <span className="text-[14px] opacity-80 font-light">Thời gian còn lại</span>
                                        <span className="text-3xl font-extrabold">{timeLeft.timeLeft}</span>
                                        <span className="text-nowrap italic opacity-60 text-sm mt-1">
                                            <History className="size-[14px] mr-1 inline -translate-y-[1px]" />
                                            {timestampChange(contest?.duration).hours > 0 && `${timestampChange(contest?.duration).hours.toString().padStart(2, "0")} giờ `}
                                            {`${timestampChange(contest?.duration).minutes.toString().padStart(2, "0")} phút `}
                                        </span>
                                    </div>
                                </div>
                                {
                                    joinedContest?.id === contest_id ?
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <Button variant="destructive" className="w-full">
                                                    Rời khỏi cuộc thi<ArrowRight className="size-[14px] ml-2 duration-100 group-hover/more:ml-3" />
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent>
                                                <DialogHeader>
                                                    <DialogTitle>Xác nhận rời khỏi cuộc thi này</DialogTitle>
                                                </DialogHeader>
                                                <DialogDescription>
                                                    Sau khi rời khỏi, mọi kết quả sẽ bị huỷ và bạn sẽ không thể tham gia lại cuộc thi này.
                                                </DialogDescription>
                                                <DialogFooter className="mt-2">
                                                    <DialogClose>
                                                        <Button variant="ghost">
                                                            Đóng
                                                        </Button>
                                                    </DialogClose>
                                                    <DialogClose>
                                                        <Button className="w-fit px-4" variant="destructive" onClick={() => handleExitContest()}>
                                                            Tôi hiểu và muốn rời khỏi
                                                        </Button>
                                                    </DialogClose>
                                                </DialogFooter>
                                            </DialogContent>
                                        </Dialog> :
                                        <BlurFade delay={0.3}>
                                            <div className="sticky top-6 w-full flex flex-col items-center gap-2">
                                                <p className="text-[13px] w-full mt-3">
                                                    <i className="fa-solid fa-circle-info mr-2 opacity-40 text-xs"></i>
                                                    <span className="opacity-60">Bạn chưa tham gia cuộc thi này</span>
                                                </p>
                                                <Dialog>
                                                    <DialogTrigger asChild>
                                                        <Button className="w-full">
                                                            {!contest?.public && <i className="fa-solid fa-lock mr-3 text-xs translate-y-[1px]"></i>}
                                                            Tham gia ngay
                                                        </Button>
                                                    </DialogTrigger>
                                                    <DialogContent>
                                                        <DialogHeader>
                                                            <DialogTitle>Xác nhận tham gia cuộc thi này</DialogTitle>
                                                        </DialogHeader>
                                                        <DialogDescription className="-mt-0.5 leading-6">
                                                            Bạn có chắc chắn rằng bạn muốn tham gia cuộc thi này. {contest?.join_key && 'Vui lòng nhập mã tham gia để tiếp tục.'}
                                                        </DialogDescription>
                                                        {
                                                            !contest?.public &&
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
                                                                <Button onClick={() => handleJoinContest()}>Xác nhận</Button>
                                                            </DialogClose>
                                                        </DialogFooter>
                                                    </DialogContent>
                                                </Dialog>
                                            </div>
                                        </BlurFade>
                                }
                            </BlurFade>
                }
            </div>
        </div>
    );
};

export default Contest;