
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { getContestByID, getMembersByContestID, getSubmissionsByContestID } from "@/service/API/Contest";
import { useLogin } from "@/service/LoginContext";
import { useSocket } from "@/service/SocketContext";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";


function Ranking() {

    const { id: contest_id } = useParams<{ id: string }>();

    const loginContext = useLogin();

    const { socket } = useSocket() as any;

    const statusPriority = {
        "PASSED": 5,
        "PENDING": 4,
        "FAILED": 3,
        "ERROR": 2,
        "COMPILE_ERROR": 1,
    };

    const [leaderboard, setLeaderboard] = useState<any[]>([]);
    const [problems, setProblems] = useState<any[]>([]);
    const [problemMap, setProblemMap] = useState<any>({});

    const fetchData = async () => {
        const submissions = await getSubmissionsByContestID(contest_id as any);
        const participants = await getMembersByContestID(contest_id as any);
        const contestData = await getContestByID(contest_id as any);
        const problems = contestData.problems;

        // Tạo bản đồ từ slug của bài tập sang ký tự A, B, C...
        const problemMap = problems.reduce((map: any, problem: any, index: number) => {
            const char = String.fromCharCode(65 + index); // 65 là mã ASCII của 'A'
            map[problem.slug] = { char, index: index + 1 };
            return map;
        }, {});

        setProblemMap(problemMap);

        // Gộp dữ liệu và tính toán thành tích
        const calculatedLeaderboard = participants.map((participant: any) => {
            const userSubmissions = submissions.filter((sub: any) => sub.username === participant.username);

            let highestStatus = "COMPILE_ERROR";
            let tryCount = 0;
            let totalScore = 0;
            let penalty = 0;

            const problemResults: any = {}; // Lưu trữ kết quả của từng câu hỏi
            const solvedProblems = new Set();

            if (userSubmissions.length === 0) {
                highestStatus = "NONE";
            } else {
                userSubmissions.forEach((sub: any) => {
                    tryCount++;

                    if (statusPriority[sub.status as keyof typeof statusPriority] > statusPriority[highestStatus as keyof typeof statusPriority]) {
                        highestStatus = sub.status;
                    }

                    if (!problemResults[sub.problem_slug]) {
                        problemResults[sub.problem_slug] = {
                            score: 0,
                            status: sub.status,
                            time: sub.duration,
                            try: 1,
                            char: problemMap[sub.problem_slug].char, // Ký tự của câu hỏi (A, B, C...)
                            order: problemMap[sub.problem_slug].index // Thứ tự của câu hỏi
                        };
                    } else {
                        problemResults[sub.problem_slug].try += 1;
                        // Cập nhật status nếu cần thiết
                        if (statusPriority[sub.status as keyof typeof statusPriority] > statusPriority[problemResults[sub.problem_slug].status as keyof typeof statusPriority]) {
                            problemResults[sub.problem_slug].status = sub.status;
                        }
                    }

                    if (sub.status === "PASSED" && !solvedProblems.has(sub.problem_slug)) {
                        totalScore += sub.score;
                        penalty += sub.duration;
                        solvedProblems.add(sub.problem_slug);
                        problemResults[sub.problem_slug].score = sub.score; // Cập nhật điểm của câu hỏi nếu được chấp nhận
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
                role: participant.role,
                id: participant.id,
                status: highestStatus,
                try: tryCount,
                score: totalScore,
                penalty,
                problemResults // Thêm kết quả của từng câu hỏi
            };
        });

        // Sắp xếp bảng xếp hạng theo tổng điểm và số lần nộp bài
        calculatedLeaderboard.sort((a: any, b: any) => {
            if (a.status === "NONE") return 1; // Đưa người có status là "NONE" xuống cuối
            if (b.status === "NONE") return -1;

            if (b.score === a.score) {
                return a.penalty - b.penalty;
            }
            return b.score - a.score;
        });

        console.log(calculatedLeaderboard);

        setLeaderboard(calculatedLeaderboard);
        setProblems(problems);
    };

    useEffect(() => {
        fetchData();
    }, [contest_id]);

    useEffect(() => {
        socket.on('new_submission', () => {
            fetchData();
        });

        return () => {
            socket.off('new_submission');
        };
    }, []);

    return (
        <div className="Ranking w-full">
            <div className="border overflow-hidden rounded-md">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-secondary hover:bg-secondary">
                            <TableHead className="w-[70px] text-center font-bold">Hạng</TableHead>
                            <TableHead className="border-x border-white/70 dark:border-white/10 font-bold">Tài khoản</TableHead>
                            {problems.map((problem: any, index: number) => (
                                <TableHead key={index} className="border-x border-white/70 dark:border-white/10 text-center font-bold hover:text-primary hover:underline">
                                    <Link to={`/problem/${problem.slug}`} className="flex flex-col gap-0 leading-4">
                                        {problemMap[problem.slug]?.char}
                                    </Link>
                                </TableHead>
                            ))}
                            <TableHead className="w-[90px] text-center font-bold">Điểm</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {leaderboard.map((participant, index) => (
                            <TableRow key={index} className="hover:bg-secondary/10 h-[60px] 2xl:h-[70px]">
                                <TableCell className="text-center">{index + 1}</TableCell>
                                <TableCell className="border-x">
                                    <div className="flex items-center">
                                        <img src={participant.avatar_url} className="w-6 h-6 rounded-full inline mr-2" />
                                        <span className="lowercase">
                                            {participant.username}
                                        </span>
                                        {
                                            loginContext.user?.username === participant.username &&
                                            <span className="ml-1 text-primary italic">(Bạn)</span>
                                        }
                                    </div>
                                </TableCell>
                                {problems.map((problem: any, problemIndex: number) => (
                                    <TableCell key={problemIndex} className={`
                                        ${participant.problemResults[problem.slug]?.status === "PASSED" && "bg-primary text-white"}
                                        ${(participant.problemResults[problem.slug]?.status === "FAILED" ||
                                            participant.problemResults[problem.slug]?.status === "ERROR" ||
                                            participant.problemResults[problem.slug]?.status === "COMPILE_ERROR") &&
                                        "bg-red-500 text-white"}
                                        ${participant.problemResults[problem.slug]?.status === "PENDING" && "bg-indigo-500 text-white"}
                                        text-center border-x border-secondary p-0 w-[64px] 2xl:w-[74px]`
                                    }>
                                        <Link className="flex flex-col gap-0.5 2xl:gap-0 leading-4" to={`/problem/${problem.slug}`}>
                                            {
                                                participant.problemResults[problem.slug]?.status === "PASSED" ?
                                                    <span className="font-bold text-[14px] 2xl:text-base">
                                                        {participant.problemResults[problem.slug]?.score}
                                                    </span> :
                                                    participant.problemResults[problem.slug]?.status === "FAILED" &&
                                                    <span className="font-bold text-[14px] 2xl:text-base">
                                                        0
                                                    </span>
                                            }
                                            {
                                                participant.problemResults[problem.slug] &&
                                                <p className="text-[11px] font-medium italic">
                                                    ({participant.problemResults[problem.slug]?.try} lần)
                                                </p>
                                            }
                                        </Link>
                                    </TableCell>
                                ))}
                                <TableCell className="text-center font-bold">{participant.score}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                    <TableFooter>
                        <TableRow className="bg-secondary hover:bg-secondary">
                            <TableCell colSpan={2} className="text-left pl-5">Tổng cộng số lượt đúng</TableCell>
                            {problems.map((problem: any, index: number) => (
                                <TableCell key={index} className="text-center border-x border-white/90 dark:border-white/10">
                                    {leaderboard.filter(participant => participant.problemResults[problem.slug]?.status === "PASSED").length}
                                </TableCell>
                            ))}
                            <TableCell className="text-center">...</TableCell>
                        </TableRow>
                    </TableFooter>
                </Table>
            </div>
        </div>
    );
};

export default Ranking;