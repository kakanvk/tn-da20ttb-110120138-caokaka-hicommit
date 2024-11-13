import { Link, useNavigate, useParams } from "react-router-dom";
import ReactDOMServer from 'react-dom/server';

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogPortal,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"

import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
    HoverCardPortal
} from "@/components/ui/hover-card"

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CalendarDays, Clock, Code, CornerDownRight, ArrowLeft, RefreshCcw, TriangleAlert, SquareCode, Bug, SquareArrowOutUpRight, Copy, Check, ArrowRight } from "lucide-react";
import { DialogClose } from "@radix-ui/react-dialog";
import RingProgress from "@/components/ui/ringProcess";
import { Avatar, AvatarImage } from "@/components/ui/avatar";

import CodeMirror from '@uiw/react-codemirror';
import { githubLightInit, githubDarkInit } from '@uiw/codemirror-theme-github';
import { javascript } from '@codemirror/lang-javascript';

import { useTheme } from "@/components/theme-provider";
import { useEffect, useState } from "react";
import { getSubmissionsByID, togglePublicCode } from "@/service/API/Submission";
import { formatDistanceToNow, parseISO } from "date-fns";
import { vi } from "date-fns/locale";
import CodeArea from "@/components/ui/code-area";

import { useSocket } from "@/service/SocketContext";
import toast from "react-hot-toast";
import BlurFade from "@/components/magicui/blur-fade";
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useLogin } from "@/service/LoginContext";

const timeAgo = (isoDate: any) => {
    try {
        const date = parseISO(isoDate);
        return formatDistanceToNow(date, { addSuffix: true, locale: vi });
    } catch (error) {
        console.error('Error parsing date:', error);
        return 'Invalid date';
    }
};

function Result() {

    const { socket } = useSocket() as any;

    const loginContext = useLogin();
    const navigate = useNavigate();

    const { theme } = useTheme();

    const { submission_id } = useParams();

    const [code, setCode] = useState('');
    const [submission, setSubmission] = useState<any>({});
    const [errorMap, setErrorMap] = useState<any>([]);

    const [isCopied, setIsCopied] = useState(false);

    const handleCopyText = () => {
        const textToCopy = ReactDOMServer.renderToStaticMarkup(<>{code}</>);

        // Tạo một phần tử div ẩn để chứa nội dung cần copy
        const hiddenDiv = document.createElement('div');
        hiddenDiv.innerHTML = textToCopy;

        hiddenDiv.style.position = 'absolute';
        hiddenDiv.style.left = '-9999px';
        hiddenDiv.style.whiteSpace = 'pre-wrap';

        document.body.appendChild(hiddenDiv);

        // Lựa chọn nội dung trong div ẩn
        const range = document.createRange();
        range.selectNode(hiddenDiv);
        window.getSelection()?.removeAllRanges();
        window.getSelection()?.addRange(range);

        // Copy nội dung đã chọn vào clipboard
        try {
            document.execCommand('copy');
            toast.success('Đã copy vào bộ nhớ tạm', {
                style: {
                    borderRadius: '8px',
                    background: '#222',
                    color: '#fff',
                    paddingLeft: '15px',
                    fontFamily: 'Plus Jakarta Sans',
                }
            });

            setIsCopied(true);

            // Ẩn nút check sau 3 giây
            setTimeout(() => {
                setIsCopied(false);
            }, 2000);

        } catch (err) {
            console.error('Copy failed: ', err);
        }

        // Xóa phần tử div ẩn
        document.body.removeChild(hiddenDiv);
    };

    const getSubmission = async () => {
        const submission = await getSubmissionsByID(submission_id as string);
        setSubmission(submission);

        const codeDecoded = atob(submission?.code);
        setCode(codeDecoded);

        if (submission?.review) {
            // Lọc ra các mã lỗi (syntax.category, evaluation.category, style_check.category)
            const syntax = submission?.review?.syntax?.map((review: any) => review.category);
            const evaluation = submission?.review?.evaluation?.map((review: any) => review.category);
            const style_check = submission?.review?.style_check?.map((review: any) => review.category);

            const newErrorMap = new Set([
                ...syntax,
                ...evaluation,
                ...style_check
            ]);

            setErrorMap(Array.from(newErrorMap));

            console.log(errorMap);
        }

        console.log(submission);
    }

    const handleTogglePublicCode = async () => {
        await toast.promise(
            togglePublicCode(submission_id as string),
            {
                loading: 'Đang cập nhật...',
                success: 'Thay đổi thành công',
                error: 'Thay đổi thất bại'
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

        getSubmission();
    }

    const handleReSubmit = async () => {
        navigate(`/problem/${submission?.problem?.slug}/submit`, {
            state: {
                reSubmit: true,
                old_code: code
            }
        });
    }

    useEffect(() => {
        socket.on('new_submission', () => {
            getSubmission();
        });

        return () => {
            socket.off('new_submission');
        };
    }, []);

    useEffect(() => {
        getSubmission();
    }, []);

    return (
        <div className="Result p-6 px-8 pb-[90px] flex flex-col gap-8">
            <Breadcrumb>
                <BlurFade delay={0.1} yOffset={0} blur="2px">
                    <BreadcrumbList>
                        {
                            submission?.problem?.type === "COURSE" &&
                            <>
                                <BreadcrumbItem>
                                    <BreadcrumbLink asChild>
                                        <Link to="/">Khoá học của tôi</Link>
                                    </BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator />
                                <BreadcrumbItem>
                                    <BreadcrumbLink>
                                        <Link to={`/course/${submission?.problem?.parent?.id}`}>{submission?.problem?.parent?.name}</Link>
                                    </BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator />
                            </>
                        }
                        {
                            submission?.problem?.type === "FREE" &&
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
                                <Link to={`/problem/${submission?.problem?.slug}`}>{submission?.problem?.name}</Link>
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbLink>
                                Kết quả chấm bài
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </BlurFade>
            </Breadcrumb>

            <div className="flex flex-col gap-2 mt-2 items-start">
                <div className="w-full flex gap-8 items-start">
                    <div className="flex-1 flex flex-col gap-8">
                        <BlurFade delay={0.2} yOffset={0} blur="2px">
                            <div className="flex justify-between gap-4">
                                <div className="flex-1 flex flex-col items-start gap-2 justify-start">
                                    <div className="flex-1 flex flex-col gap-3">
                                        <p className="text-xl font-bold">
                                            Kết quả chấm bài:
                                            <Link className="ml-1 hover:text-green-600 dark:hover:text-green-500 duration-300 w-fit" to={`/problem/${submission?.problem?.slug || submission?.problem?.id}`}>
                                                {submission?.problem?.name}
                                                {submission?.status === "PASSED" && <i className="fa-solid fa-circle-check text-green-600 ml-2.5 text-[20px]"></i>}
                                                {submission?.status === "ERROR" && <i className="fa-solid fa-circle-exclamation text-amber-500 ml-2.5 text-[20px]"></i>}
                                                {submission?.status === "FAILED" && <i className="fa-solid fa-circle-xmark text-red-500 ml-2.5 text-[20px]"></i>}
                                                {submission?.status === "COMPILE_ERROR" && <i className="fa-solid fa-triangle-exclamation text-zinc-400 ml-2.5 text-[20px]"></i>}
                                                {submission?.status === "PENDING" &&
                                                    <span className="relative inline-flex h-3.5 w-3.5 ml-3">
                                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                                        <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-primary"></span>
                                                    </span>
                                                }
                                            </Link>
                                        </p>
                                    </div>
                                    <p className="font-medium text-base">
                                        <i className="fa-solid fa-code-commit text-primary mr-2"></i>
                                        {submission?.commit}
                                    </p>
                                    <div className="text-[14px] flex items-center gap-2 flex-wrap">
                                        <span className="opacity-70">Commit bởi</span>
                                        <HoverCard openDelay={300}>
                                            <HoverCardTrigger>
                                                <Badge className="gap-1.5 p-1 pr-2 hover:bg-secondary cursor-pointer" variant="outline">
                                                    <Avatar className="h-5 w-5">
                                                        <AvatarImage className="w-full h-full" src={submission?.actor?.avatar_url} />
                                                    </Avatar>
                                                    <span className="font-semibold text-[13px] -translate-y-[1px]">{submission?.actor?.username}</span>
                                                </Badge>
                                            </HoverCardTrigger>
                                            <HoverCardContent className="w-70 z-20" side="bottom" align="start">
                                                <div className="flex gap-4">
                                                    <Avatar>
                                                        <AvatarImage className="w-14 rounded-full" src={submission?.actor?.avatar_url} />
                                                    </Avatar>
                                                    <div className="space-y-1">
                                                        <h4 className="text-sm font-semibold text-green-600 dark:text-green-500">@{submission?.actor?.username}</h4>
                                                        <p className="text-sm">
                                                            Trường Đại học Trà Vinh
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

                                        <span className="text-green-600 dark:text-green-500 text-[13px] font-medium">
                                            <i className="fa-solid fa-circle text-[3px] -translate-y-[3.5px] mr-2"></i>
                                            {timeAgo(submission?.createdAt)}
                                        </span>

                                        {
                                            (submission?.public || loginContext.user?.username === submission?.actor?.username) &&
                                            <Dialog>
                                                <DialogTrigger>
                                                    <Badge className="w-fit text-green-600 dark:text-green-500 flex gap-1.5 border-primary px-2 py-0 font-medium rounded-md hover:bg-secondary cursor-pointer ml-2" variant="outline">
                                                        <Code className="w-3.5" />
                                                        <span>Xem mã nguồn</span>
                                                    </Badge>
                                                </DialogTrigger>
                                                <DialogContent className="min-w-[750px]">
                                                    <DialogHeader>
                                                        <DialogTitle className="flex items-center gap-2">
                                                            <SquareCode className="w-5 text-primary" />Mã nguồn
                                                            <Badge variant="secondary" className="px-1.5 rounded-sm">
                                                                {submission?.problem?.language === "c" && "C"}
                                                                {submission?.problem?.language === "cpp" && "C++"}
                                                                {submission?.problem?.language === "java" && "Java"}
                                                            </Badge>
                                                        </DialogTitle>
                                                    </DialogHeader>
                                                    <div className="relative group/code mt-2">
                                                        <div className="w-full border rounded-lg overflow-hidden z-19">
                                                            <CodeMirror
                                                                value={code}
                                                                placeholder="Please enter your code here..."
                                                                readOnly={true}
                                                                theme={theme === "dark" ?
                                                                    githubDarkInit({
                                                                        settings: {
                                                                            background: 'rgb(15 15 15)',
                                                                        }
                                                                    }) :
                                                                    githubLightInit({
                                                                        settings: {
                                                                            gutterBackground: "rgb(235 235 235)",
                                                                            background: 'rgb(248 248 248)',
                                                                            lineHighlight: '#8a91991a',
                                                                        }
                                                                    })
                                                                }
                                                                onChange={(value) => setCode(value)}
                                                                extensions={[javascript({ jsx: true })]}
                                                                height="350px"
                                                                autoFocus
                                                            />
                                                        </div>
                                                        <Badge
                                                            className='invisible group-hover/code:visible duration-200 absolute top-1 right-1 font-medium rounded-md border bg-background/50 cursor-pointer py-[3px] scale-90'
                                                            variant="outline"
                                                            onClick={() => handleCopyText()}
                                                        >
                                                            {
                                                                isCopied ?
                                                                    <Check className='w-[15px] translate-x-[0.5px]' /> :
                                                                    <Copy className='w-[15px] translate-x-[0.5px]' />
                                                            }
                                                        </Badge>
                                                    </div>
                                                    {
                                                        loginContext.user?.username === submission?.actor?.username &&
                                                        <div className="flex justify-between gap-6 items-center border p-3 px-4 rounded-lg bg-secondary/10">
                                                            <Label className="flex-1 flex flex-col gap-1.5 cursor-pointer" htmlFor="public-code">
                                                                <h3 className="text-[16px]"><i className="fa-solid fa-triangle-exclamation mr-2 text-sm text-amber-500/80"></i>Công khai mã nguồn</h3>
                                                                <p className="text-xs opacity-50 dark:font-light">Mã nguồn này sẽ được công khai với mọi người.</p>
                                                            </Label>
                                                            <Switch id="public-code" checked={submission?.public} onCheckedChange={() => handleTogglePublicCode()} />
                                                        </div>
                                                    }
                                                    <DialogFooter >
                                                        <DialogClose>
                                                            <Button variant="ghost" className="mr-1">Đóng</Button>
                                                        </DialogClose>
                                                        <DialogClose asChild>
                                                            <Button onClick={() => handleReSubmit()}>Nộp lại</Button>
                                                        </DialogClose>
                                                    </DialogFooter>
                                                </DialogContent>
                                            </Dialog>
                                        }
                                    </div>
                                </div>
                                <TooltipProvider delayDuration={100}>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button size="icon" variant="ghost" onClick={() => getSubmission()}><RefreshCcw className="w-5" /></Button>
                                        </TooltipTrigger>
                                        <TooltipContent side="bottom">
                                            Làm mới
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </div>
                        </BlurFade>
                        <BlurFade delay={0.3} yOffset={0} blur="2px" >
                            <div className="flex flex-col border rounded-lg overflow-hidden z-10">
                                <div className="bg-zinc-100 dark:bg-zinc-900 p-3 px-5 flex items-center justify-between gap-4 border-b">
                                    <p className="font-bold">
                                        Kiểm tra đơn vị
                                        <span className="opacity-50 font-medium ml-2 text-sm">(Unit Test)</span>
                                        <Badge className="rounded px-1.5 ml-2 -translate-y-[1px]" variant="secondary">
                                            <span>
                                                {submission?.problem?.language === "c" && "C"}
                                                {submission?.problem?.language === "cpp" && "C++"}
                                                {submission?.problem?.language === "java" && "Java"}
                                            </span>
                                        </Badge>
                                    </p>
                                    <Bug className="w-4 flex-none" />
                                </div>
                                <div className="flex flex-col gap-5 p-5">
                                    {
                                        submission?.status === "PENDING" ?
                                            /* From Uiverse.io by Amerss */
                                            <p>
                                                <span className="mr-2">Đang chấm</span>
                                                <span className="animate-[ping_1.5s_0.5s_ease-in-out_infinite]">.</span>
                                                <span className="animate-[ping_1.5s_0.7s_ease-in-out_infinite]">.</span>
                                                <span className="animate-[ping_1.5s_0.9s_ease-in-out_infinite]">.</span>
                                            </p> :
                                            submission?.testcases?.length > 0 ?
                                                submission?.testcases?.map((testcase: any, index: number) => (
                                                    <BlurFade key={testcase.id} delay={0.15 + index * 0.05} yOffset={0}>
                                                        <div className="flex items-center justify-between">
                                                            <p className="flex items-baseline gap-3">
                                                                {/* <i className={`fa-solid fa-circle-${testcase.status === "PASSED" ? "check" : "xmark"} text-${testcase.status === "PASSED" ? "green-600" : "red-500"}`}></i> */}
                                                                {testcase?.status?.toUpperCase() === "PASSED" && <i className="fa-solid fa-circle-check text-green-600 text-[14px]"></i>}
                                                                {testcase?.status?.toUpperCase() === "ERROR" && <i className="fa-solid fa-circle-exclamation text-amber-500 text-[14px]"></i>}
                                                                {testcase?.status?.toUpperCase() === "FAILED" && <i className="fa-solid fa-circle-xmark text-red-500 text-[14px]"></i>}
                                                                {testcase?.status?.toUpperCase() === "COMPILE_ERROR" && <i className="fa-solid fa-triangle-exclamation text-zinc-400 text-[14px]"></i>}
                                                                <span className="text-sm font-medium opacity-60">Test case {index + 1}</span>
                                                                {
                                                                    testcase.status?.toUpperCase() !== "PASSED" && testcase?.suggestion &&
                                                                    <Dialog>
                                                                        <TooltipProvider delayDuration={100}>
                                                                            <Tooltip>
                                                                                <TooltipTrigger>
                                                                                    <DialogTrigger className="hover:bg-secondary w-6 rounded">
                                                                                        <i className="fa-solid fa-seedling text-sm opacity-60"></i>
                                                                                    </DialogTrigger>
                                                                                </TooltipTrigger>
                                                                                <TooltipContent side="bottom">
                                                                                    Gợi ý
                                                                                </TooltipContent>
                                                                            </Tooltip>
                                                                        </TooltipProvider>
                                                                        <DialogContent>
                                                                            <DialogHeader>
                                                                                <DialogTitle>
                                                                                    <i className="fa-solid fa-seedling text-primary mr-2 translate-y-[-1px]"></i>Gợi ý hoàn thành<Badge variant="secondary" className="rounded px-1.5 py-1 ml-2 -translate-y-[1px] text-[13px]">Test case {index + 1}</Badge>
                                                                                </DialogTitle>
                                                                            </DialogHeader>
                                                                            <DialogDescription>
                                                                                {testcase.suggestion}
                                                                            </DialogDescription>
                                                                            <DialogFooter>
                                                                                <DialogClose>
                                                                                    <Button variant="secondary">Đóng</Button>
                                                                                </DialogClose>
                                                                            </DialogFooter>
                                                                        </DialogContent>
                                                                    </Dialog>
                                                                }
                                                            </p>
                                                            {testcase.status.toUpperCase() === "PASSED" && <span className="text-sm text-green-600 dark:text-green-500">Chính xác</span>}
                                                            {testcase.status.toUpperCase() === "FAILED" &&
                                                                <Dialog>
                                                                    <DialogTrigger>
                                                                        <span className="text-sm text-red-500">Sai kết quả</span>
                                                                    </DialogTrigger>
                                                                    <DialogContent>
                                                                        <DialogHeader>
                                                                            <DialogTitle className="mb-2 flex items-center gap-2 text-red-600 dark:text-red-500">
                                                                                <i className="fa-solid fa-circle-info text-[14px] translate-y-[1px]"></i>Chi tiết
                                                                            </DialogTitle>
                                                                        </DialogHeader>
                                                                        <div className="flex flex-col gap-5">
                                                                            <div className="flex flex-col gap-2">
                                                                                <span className="text-sm font-semibold opacity-60">Kết quả mong muốn (Test case {index + 1}):</span>
                                                                                <CodeArea>
                                                                                    {testcase?.output}
                                                                                </CodeArea>
                                                                            </div>
                                                                            <div className="flex flex-col gap-2">
                                                                                <span className="text-sm font-semibold opacity-60">Kết quả nhận được:</span>
                                                                                <CodeArea className="text-red-600 dark:text-red-400 italic">
                                                                                    {
                                                                                        testcase?.actual_output === "N/A" ? "N/A (Không xác định)" :
                                                                                            testcase?.actual_output === "" ? "(Rỗng)" : testcase?.actual_output
                                                                                    }
                                                                                </CodeArea>
                                                                                <span className="italic text-xs opacity-50 font-medium">* Luôn chú ý đến các khoảng trắng trong dữ liệu đầu ra.</span>
                                                                            </div>
                                                                        </div>
                                                                        <DialogFooter className="mt-4">
                                                                            <DialogClose>
                                                                                <Button variant="secondary">Đóng</Button>
                                                                            </DialogClose>
                                                                        </DialogFooter>
                                                                    </DialogContent>
                                                                </Dialog>
                                                            }
                                                            {testcase.status.toUpperCase() === "ERROR" &&
                                                                <Dialog>
                                                                    <DialogTrigger>
                                                                        <span className="text-sm text-amber-500">Gặp vấn đề</span>

                                                                    </DialogTrigger>
                                                                    <DialogContent>
                                                                        <DialogHeader>
                                                                            <DialogTitle className="mb-2 flex items-center gap-2 text-amber-600 dark:text-amber-500">
                                                                                <i className="fa-solid fa-circle-info text-[14px] translate-y-[1px]"></i>Chi tiết
                                                                            </DialogTitle>
                                                                        </DialogHeader>
                                                                        <div className="flex flex-col gap-5">
                                                                            <div className="flex flex-col gap-2">
                                                                                <span className="text-sm font-semibold opacity-60">Kết quả mong muốn (Test case {index + 1}):</span>
                                                                                <CodeArea>
                                                                                    {testcase?.output}
                                                                                </CodeArea>
                                                                            </div>
                                                                            <div className="flex flex-col gap-2">
                                                                                <span className="text-sm font-semibold opacity-60">Kết quả nhận được:</span>
                                                                                <CodeArea className="text-amber-600 dark:text-amber-400 italic">
                                                                                    {
                                                                                        testcase?.actual_output === "N/A" ? "N/A (Không xác định)" :
                                                                                            testcase?.actual_output === "" ? "(Rỗng)" : testcase?.actual_output
                                                                                    }
                                                                                </CodeArea>
                                                                            </div>
                                                                        </div>
                                                                        <DialogFooter className="mt-4">
                                                                            <DialogClose>
                                                                                <Button variant="secondary">Đóng</Button>
                                                                            </DialogClose>
                                                                        </DialogFooter>
                                                                    </DialogContent>
                                                                </Dialog>
                                                            }
                                                        </div>
                                                    </BlurFade>
                                                )) :
                                                <div className="flex items-center justify-between">
                                                    <p className="flex items-baseline gap-3">
                                                        <span className="text-sm font-medium opacity-60">Không có test case nào được thực hiện</span>
                                                    </p>
                                                </div>
                                    }
                                </div>
                                <div className="flex justify-between items-center p-3.5 px-5 border-t-[1px]">
                                    <div className="flex flex-col gap-1.5">
                                        <span className="text-xs opacity-50 font-medium">Kết quả</span>
                                        <div className="flex items-center gap-3">
                                            {submission?.status?.toUpperCase() === "PENDING" &&
                                                <>
                                                    <span className="relative inline-flex h-3 w-3 ml-1">
                                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                                        <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
                                                    </span>
                                                    <p>
                                                        <span className="mr-2">Đang chấm</span>
                                                        <span className="animate-[ping_1.5s_0.5s_ease-in-out_infinite]">.</span>
                                                        <span className="animate-[ping_1.5s_0.7s_ease-in-out_infinite]">.</span>
                                                        <span className="animate-[ping_1.5s_0.9s_ease-in-out_infinite]">.</span>
                                                    </p>
                                                </>
                                            }
                                            {submission?.status?.toUpperCase() === "PASSED" && <i className="fa-solid fa-circle-check text-green-600"></i>}
                                            {submission?.status?.toUpperCase() === "ERROR" && <i className="fa-solid fa-circle-exclamation text-amber-500"></i>}
                                            {submission?.status?.toUpperCase() === "FAILED" && <i className="fa-solid fa-circle-xmark text-red-500"></i>}
                                            {submission?.status?.toUpperCase() === "COMPILE_ERROR" && <i className="fa-solid fa-triangle-exclamation text-zinc-400"></i>}
                                            {submission?.status?.toUpperCase() === "PASSED" && <span className="font-semibold">Kết quả chính xác</span>}
                                            {submission?.status?.toUpperCase() === "FAILED" && <span className="font-semibold">Sai kết quả</span>}
                                            {submission?.status?.toUpperCase() === "ERROR" && <span className="font-semibold text-amber-500">Có lỗi trong quá trình thực hiện</span>}
                                            {submission?.status?.toUpperCase() === "COMPILE_ERROR" && <span className="font-semibold">Lỗi biên dịch chương trình</span>}
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-1.5 items-end ">
                                        <span className="text-xs opacity-50 font-medium">Thời gian</span>
                                        {
                                            submission?.status === "PENDING" ? (
                                                <p>
                                                    <span className="animate-[ping_1.5s_0.5s_ease-in-out_infinite]">.</span>
                                                    <span className="animate-[ping_1.5s_0.7s_ease-in-out_infinite]">.</span>
                                                    <span className="animate-[ping_1.5s_0.9s_ease-in-out_infinite]">.</span>
                                                </p>
                                            ) : <span className="text-sm font-bold opacity-70">{submission?.duration}s</span>
                                        }
                                    </div>
                                </div>
                            </div>
                        </BlurFade>
                        {
                            submission?.problem?.type !== "CONTEST" &&
                            <BlurFade delay={0.4} yOffset={0} blur="2px">
                                <div className="flex flex-col border rounded-lg overflow-hidden">
                                    <div className="bg-zinc-100 dark:bg-zinc-900 p-3 px-5 flex items-center justify-between gap-4 border-b">
                                        <p className="font-bold">
                                            Đánh giá chất lượng mã nguồn
                                            <span className="opacity-50 font-medium ml-2 text-sm">(Code Quality)</span>
                                            <Badge className="rounded px-1.5 ml-2 -translate-y-[1px]" variant="secondary">
                                                <span>
                                                    {submission?.problem?.language === "c" && "C"}
                                                    {submission?.problem?.language === "cpp" && "C++"}
                                                    {submission?.problem?.language === "java" && "Java"}
                                                </span>
                                            </Badge>
                                        </p>
                                    </div>
                                    <BlurFade delay={0.55} yOffset={0} blur="2px" className="flex flex-col gap-3 p-5">
                                        {
                                            submission?.review?.syntax?.length > 0 &&
                                            submission?.review?.syntax?.map((syntax: any, index: number) => (
                                                <div className="flex items-start justify-between gap-6">
                                                    <p className="leading-7">
                                                        <span className="text-xs font-semibold bg-red-400/20 text-red-500 dark:text-red-400 rounded px-1.5 py-0.5 text-[13px] inline mr-2">{syntax.category}</span>
                                                        <p key={index} className="inline">
                                                            <span className="text-sm font-medium opacity-70">
                                                                {syntax.issue.split('`').map((part: any, i: number) =>
                                                                    i % 2 === 0
                                                                        ? part.replace(/\n/g, '\\n') // Thay thế để hiển thị \n như là một chuỗi
                                                                        : <code key={i} className="inline bg-secondary rounded px-1.5 py-0.5 text-[13px] text-nowrap">{part.replace(/\n/g, '\\n')}</code>
                                                                )}
                                                            </span>
                                                        </p>
                                                    </p>
                                                </div>
                                            ))
                                        }
                                        {
                                            submission?.review?.evaluation?.length > 0 &&
                                            submission?.review?.evaluation?.map((evaluation: any, index: number) => (
                                                <div className="flex items-start justify-between gap-6">
                                                    <p className="leading-7">
                                                        <span className="text-xs font-semibold bg-red-400/20 text-red-500 dark:text-red-400 rounded px-1.5 py-0.5 text-[13px] inline mr-2">{evaluation.category}</span>
                                                        <p key={index} className="inline">
                                                            <span className="text-sm font-medium opacity-70">
                                                                {evaluation.issue.split('`').map((part: any, i: number) =>
                                                                    i % 2 === 0
                                                                        ? part.replace(/\n/g, '\\n') // Thay thế để hiển thị \n như là một chuỗi
                                                                        : <code key={i} className="inline bg-secondary rounded px-1.5 py-0.5 text-[13px] text-nowrap">{part.replace(/\n/g, '\\n')}</code>
                                                                )}
                                                            </span>
                                                        </p>
                                                    </p>
                                                </div>
                                            ))
                                        }
                                        {
                                            submission?.review?.style_check?.length > 0 &&
                                            submission?.review?.style_check?.map((style_check: any, index: number) => (
                                                <div className="flex items-start justify-between gap-6">
                                                    <p className="leading-7">
                                                        <span className="text-xs font-semibold bg-red-400/20 text-red-500 dark:text-red-400 rounded px-1.5 py-0.5 text-[13px] inline mr-2">{style_check.category}</span>
                                                        <p key={index} className="inline">
                                                            <span className="text-sm font-medium opacity-70">
                                                                {style_check.issue.split('`').map((part: any, i: number) =>
                                                                    i % 2 === 0
                                                                        ? part.replace(/\n/g, '\\n') // Thay thế để hiển thị \n như là một chuỗi
                                                                        : <code key={i} className="inline bg-secondary rounded px-1.5 py-0.5 text-[13px] text-nowrap">{part.replace(/\n/g, '\\n')}</code>
                                                                )}
                                                            </span>
                                                        </p>
                                                    </p>
                                                </div>
                                            ))
                                        }
                                        {
                                            submission?.review?.length === 0 ?
                                                /* From Uiverse.io by Amerss */
                                                submission?.status === "PENDING" ?
                                                    <div className="flex items-center gap-3">
                                                        <span className="relative inline-flex h-3 w-3 ml-1">
                                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                                            <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
                                                        </span>
                                                        <p>
                                                            <span className="mr-2">Đang chấm</span>
                                                            <span className="animate-[ping_1.5s_0.5s_ease-in-out_infinite]">.</span>
                                                            <span className="animate-[ping_1.5s_0.7s_ease-in-out_infinite]">.</span>
                                                            <span className="animate-[ping_1.5s_0.9s_ease-in-out_infinite]">.</span>
                                                        </p>
                                                    </div> :
                                                    <p className="text-sm font-medium opacity-70">Không có vấn đề nào trong mã nguồn</p> : null
                                        }
                                    </BlurFade>
                                </div>
                            </BlurFade>
                        }
                        {
                            submission?.problem?.type !== "CONTEST" && submission?.review?.suggestions?.length > 0 &&
                            <BlurFade delay={0.6} yOffset={0} blur="2px" className="flex flex-col gap-2">
                                <h3 className="font-semibold">Các gợi ý chỉnh sửa:</h3>
                                <div className="flex flex-col gap-2 pl-1">
                                    {
                                        submission?.review?.suggestions?.map((suggestion: any, index: number) => (
                                            <BlurFade key={index} delay={0.7 + index * 0.05} yOffset={0} blur="2px" >
                                                <span className="text-sm font-medium opacity-70">
                                                    {index + 1}. {suggestion.split('`').map((part: any, i: number) =>
                                                        i % 2 === 0
                                                            ? part.replace(/\n/g, '\\n') // Thay thế để hiển thị \n như là một chuỗi
                                                            : <code key={i} className="inline bg-secondary rounded px-1.5 py-0.5 text-[13px] text-nowrap">{part.replace(/\n/g, '\\n')}</code>
                                                    )}
                                                </span>
                                            </BlurFade>
                                        ))
                                    }
                                </div>
                            </BlurFade>
                        }
                        <BlurFade delay={0.5} yOffset={0} blur="2px">
                            <div className="mt-10">
                                <p className="text-sm">
                                    <i className="fa-solid fa-circle-info mr-2 opacity-50"></i>
                                    <span className="opacity-70">Được thực hiện bởi</span>
                                    <Link to={`https://github.com/${submission?.actor?.username}/hicommit-problems/actions/runs/${submission?.id}`} target="_blank" className="group/link">
                                        <Badge variant="secondary" className="rounded px-1.5 -translate-y-[2px] ml-2">
                                            <i className="fa-regular fa-circle-play mr-1"></i>GitHub Actions
                                        </Badge>
                                        <SquareArrowOutUpRight className="w-4 ml-1.5 opacity-50 inline -translate-y-[2px] invisible group-hover/link:visible" />
                                    </Link>
                                </p>
                            </div>
                        </BlurFade>
                    </div>
                    <BlurFade delay={0.3} yOffset={0} blur="2px" className="sticky top-6 w-[270px] bg-zinc-100/80 dark:bg-zinc-900 border rounded-lg flex flex-col items-center p-5">
                        <span className="font-semibold">Kết quả chấm bài</span>
                        <RingProgress radius={90} stroke={12} progress={((submission?.pass_count / submission?.problem?.testcase_count) * 100).toFixed(0) as any} label="" textSize={28} />
                        <div className="w-full flex flex-col mt-3">
                            <div className="flex gap-2 justify-start items-center">
                                <span className="text-sm">Tổng thời gian chấm:</span>
                                <Badge variant="secondary" className="rounded px-1 text-xs">{submission?.duration}s</Badge>
                            </div>
                            <Accordion type="multiple" className="flex flex-col gap-1 mb-6">
                                <AccordionItem value="item-1" className="border-0">
                                    <AccordionTrigger className="text-sm font-semibold border-b-[1px] border-zinc-600 pb-1 hover:no-underline">
                                        <span>
                                            Unit Test
                                            {submission?.status?.toUpperCase() === "PASSED" && <i className="fa-solid fa-circle text-[5px] ml-2 text-green-600 dark:text-green-500 -translate-y-1"></i>}
                                            {submission?.status?.toUpperCase() === "ERROR" && <i className="fa-solid fa-circle text-[5px] ml-2 text-amber-500 -translate-y-1"></i>}
                                            {submission?.status?.toUpperCase() === "FAILED" && <i className="fa-solid fa-circle text-[5px] ml-2 text-red-500 -translate-y-1"></i>}
                                            {submission?.status?.toUpperCase() === "COMPILE_ERROR" && <i className="fa-solid fa-circle text-[5px] ml-2 text-zinc-400 -translate-y-1"></i>}
                                        </span>
                                    </AccordionTrigger>
                                    <AccordionContent>
                                        <div className="flex flex-col gap-3 pt-4">
                                            <div className="flex gap-3 justify-start items-center">
                                                <div className="flex items-center gap-2.5">
                                                    <i className="fa-solid fa-circle-check text-green-600"></i>
                                                    <span className="text-sm opacity-70">Số Test case đúng:</span>
                                                </div>
                                                <Badge variant="secondary" className="rounded px-2">{submission?.pass_count || 0}/{submission?.problem?.testcase_count}</Badge>
                                            </div>
                                            <div className="flex gap-3 justify-start items-center">
                                                <div className="flex items-center gap-2.5">
                                                    <i className="fa-solid fa-circle-xmark text-red-500"></i>
                                                    <span className="text-sm opacity-70">Số Test case sai:</span>
                                                </div>
                                                <Badge variant="secondary" className="rounded px-2">
                                                    {submission?.testcases?.filter((testcase: any) => testcase.status === "failed").length}/{submission?.problem?.testcase_count}
                                                </Badge>
                                            </div>
                                            <div className="flex gap-3 justify-start items-center">
                                                <div className="flex items-center gap-2.5">
                                                    <i className="fa-solid fa-circle-exclamation text-amber-500"></i>
                                                    <span className="text-sm opacity-70">Gặp vấn đề:</span>
                                                </div>
                                                <Badge variant="secondary" className="rounded px-2">
                                                    {submission?.testcases?.filter((testcase: any) => testcase.status === "error").length}/{submission?.problem?.testcase_count}
                                                </Badge>
                                            </div>
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                                <AccordionItem value="item-2" className="border-0">
                                    <AccordionTrigger className="text-sm font-semibold border-b-[1px] border-zinc-600 pb-1 hover:no-underline">
                                        <span>Chất lượng mã nguồn<i className="fa-solid fa-circle text-[5px] ml-2 text-green-600 dark:text-green-500 -translate-y-1"></i></span>
                                    </AccordionTrigger>
                                    <AccordionContent>
                                        <div className="flex flex-col gap-3 pt-4">
                                            <div className="flex gap-3 justify-start items-center">
                                                {
                                                    submission?.review?.length === 0 ?
                                                        <div className="flex items-center gap-2.5">
                                                            <i className="fa-solid fa-circle-check text-green-600"></i>
                                                            <span className="text-sm opacity-70">Không có vấn đề nào</span>
                                                        </div> :
                                                        <div className="flex flex-wrap gap-2">
                                                            {
                                                                Array.from(errorMap).map((error: any, index: number) => (
                                                                    <span className="text-xs font-semibold bg-red-400/20 text-red-500 dark:text-red-400 rounded px-1.5 py-0.5 text-[13px]">{error}</span>
                                                                ))
                                                            }
                                                        </div>
                                                }
                                            </div>
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>
                            {
                                submission?.status?.toUpperCase() === "PASSED" &&
                                <Button size="sm" className="border gap-2 bg-green-600 hover:bg-green-600">
                                    <i className="fa-solid fa-circle-check"></i>
                                    <span className="font-semibold">Kết quả chính xác</span>
                                </Button>
                            }
                            {
                                submission?.status?.toUpperCase() === "FAILED" &&
                                <Button size="sm" className="border gap-2 bg-red-500 hover:bg-red-500">
                                    <i className="fa-solid fa-circle-xmark text-[13px]"></i>
                                    <span className="font-semibold">Sai kết quả</span>
                                </Button>
                            }
                            {
                                submission?.status?.toUpperCase() === "ERROR" &&
                                <Button size="sm" className="border gap-2 bg-amber-500 hover:bg-amber-500 text-zinc-900">
                                    <i className="fa-solid fa-circle-exclamation"></i>
                                    <span className="font-bold">Gặp vấn đề</span>
                                </Button>
                            }
                            {
                                submission?.status?.toUpperCase() === "COMPILE_ERROR" &&
                                <Button size="sm" className="border gap-2 bg-secondary hover:bg-secondary text-black dark:text-white">
                                    <i className="fa-solid fa-triangle-exclamation"></i>
                                    <span className="font-semibold">Lỗi biên dịch</span>
                                </Button>
                            }
                        </div>
                    </BlurFade>
                </div>
            </div>
        </div>
    );
};

export default Result;