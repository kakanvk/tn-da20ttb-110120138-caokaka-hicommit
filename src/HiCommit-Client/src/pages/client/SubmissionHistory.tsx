
import { Link, useLocation, useParams } from "react-router-dom";

import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card"

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { CalendarDays, CircleDot, Code, MoveRight, RefreshCcw } from "lucide-react";
import { GitGraph, GitGraphBody, GitGraphFree, GitGraphHead, GitGraphNode } from "@/components/ui/git-graph";
import { Badge } from "@/components/ui/badge";

import { useEffect, useState } from "react";

import { parseISO, formatDistanceToNow } from 'date-fns';
import { se, vi } from 'date-fns/locale';
import Loader2 from "@/components/ui/loader2";
import { getMySubmissionsByProblemSlug } from "@/service/API/Submission";
import { useSocket } from "@/service/SocketContext";
import BlurFade from "@/components/magicui/blur-fade";

const timeAgo = (isoDate: any) => {
    try {
        const date = parseISO(isoDate);
        return formatDistanceToNow(date, { addSuffix: true, locale: vi });
    } catch (error) {
        console.error('Error parsing date:', error);
        return 'Invalid date';
    }
};

function SubmissionHistory(props: any) {

    const { socket } = useSocket() as any;

    const { problem } = props;

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const status = queryParams.get('status');

    const { problem_id } = useParams<{ problem_id: string }>();

    const [mySubmissions, setMySubmissions] = useState<any[]>([]);
    const [statusState, setStatusState] = useState<string | null>(status);
    const [isInitial, setIsInitial] = useState<boolean>(false);

    const handleGetMySubmissons = async () => {
        const data = await getMySubmissionsByProblemSlug(problem_id as any);
        console.log(data);
        setIsInitial(true);
        setMySubmissions(data);
    }

    useEffect(() => {
        socket.on('new_submission', () => {
            setStatusState(null);
            handleGetMySubmissons();
        });

        return () => {
            socket.off('new_submission');
        };
    }, []);

    useEffect(() => {
        handleGetMySubmissons();
    }, []);

    return (
        <div className="SubmissionHistory flex flex-col gap-8">
            {
                (mySubmissions?.length > 0 || statusState?.toLocaleUpperCase() === "PENDING") ?
                    <>
                        <GitGraph>
                            <GitGraphBody className="">
                                <BlurFade delay={0.1} yOffset={0}>
                                    <GitGraphFree className="h-4" />
                                </BlurFade>
                                {
                                    statusState?.toLocaleUpperCase() === "PENDING" &&
                                    <GitGraphNode end={mySubmissions?.length === 0}>
                                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border bg-zinc-100/80 dark:bg-zinc-900 hover:bg-zinc-200/50 hover:dark:bg-zinc-800/70 p-3 px-5 rounded-lg animate-pulse">
                                            <p className="opacity-70 italic">
                                                Một số tiến trình đang trong hàng đợi
                                                <span className="animate-[ping_1.5s_0.5s_ease-in-out_infinite]">.</span>
                                                <span className="animate-[ping_1.5s_0.7s_ease-in-out_infinite]">.</span>
                                                <span className="animate-[ping_1.5s_0.9s_ease-in-out_infinite]">.</span>
                                            </p>
                                        </div>
                                    </GitGraphNode>
                                }
                                {
                                    mySubmissions?.map((submission, index) => {
                                        return (
                                            <BlurFade key={submission?.id} delay={0.25 + index * 0.05} yOffset={0}>
                                                <GitGraphNode end={index === mySubmissions?.length - 1 ? true : false}>
                                                    <Link className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border bg-zinc-100/80 dark:bg-zinc-900 hover:bg-zinc-200/50 hover:dark:bg-zinc-800/70 p-3 px-5 rounded-lg duration-100" to={`/submission/${submission.id}`}>
                                                        <div className="flex-1 flex flex-col gap-2">
                                                            <p className="font-semibold text-base">
                                                                {submission?.commit}
                                                                {submission?.status === "PENDING" &&
                                                                    <span className="relative inline-flex h-3 w-3 ml-2.5">
                                                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                                                        <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
                                                                    </span>
                                                                }
                                                                {submission?.status === "PASSED" && <i className="fa-solid fa-circle-check text-green-600 ml-2.5 text-[14px]"></i>}
                                                                {submission?.status === "FAILED" && <i className="fa-solid fa-circle-xmark text-red-500 ml-2.5 text-[14px]"></i>}
                                                                {submission?.status === "ERROR" && <i className="fa-solid fa-circle-exclamation text-amber-500 ml-2.5 text-[14px]"></i>}
                                                                {submission?.status === "COMPILE_ERROR" && <i className="fa-solid fa-triangle-exclamation text-zinc-400 ml-2.5 text-[14px]"></i>}
                                                            </p>
                                                            <div className="text-[14px] flex items-baseline gap-1.5 flex-wrap">
                                                                <span className="opacity-70">Commit bởi</span>
                                                                <strong className="font-semibold hover:underline cursor-pointer">{submission?.username}</strong>
                                                                <span className="opacity-50 text-[13px] font-medium dark:font-normal ml-0.5">
                                                                    <i className="fa-solid fa-circle text-[3px] -translate-y-[3.5px] mr-2"></i>
                                                                    {timeAgo(submission.createdAt)}
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
                        <div>
                            <p className="text-sm">
                                <i className="fa-solid fa-circle-info mr-2 opacity-50"></i>
                                <span className="opacity-70">Được thực hiện bởi</span>
                                <Badge variant="secondary" className="rounded px-1.5 -translate-y-[2px] ml-2">
                                    <i className="fa-regular fa-circle-play mr-1"></i>GitHub Actions
                                </Badge>
                            </p>
                        </div>
                    </> : isInitial &&
                    <div className="w-full flex justify-center py-10 bg-secondary/30 dark:bg-secondary/10 border rounded-lg">
                        <p className="text-center">Bạn chưa có bài nộp nào. <Link to={`submit`} className="text-primary font-medium">Nộp bài ngay<MoveRight className="inline w-5 h-5 ml-1.5" /></Link></p>
                    </div>
            }
        </div >
    );
};

export default SubmissionHistory;