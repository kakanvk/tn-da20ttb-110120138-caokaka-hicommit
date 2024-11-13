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
    ColumnDef,
    ColumnFiltersState,
    SortingState,
    VisibilityState,
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table"

import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

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
import { AlignEndHorizontal, AlignLeft, ArrowRight, ArrowUpDown, BarChartBig, ChevronDown, Eye, GripVertical, History, LogOut, MessagesSquare, Pencil, Plus, Trash2, UserRound, UserRoundPlus, Users, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useEffect, useRef, useState } from "react";
import Ranking from "./Ranking";
import { Button } from "@/components/ui/button";
import { exitContest, getContestByID, getProblemsByContestID, getContestByIDForAdmin, getContestDescriptionByID, getJoinedContest, joinContest, updateProblemsByID, deleteProblemInContestByID, getMembersByContestID, updateStatusUserContest } from "@/service/API/Contest";
import BlurFade from "@/components/magicui/blur-fade";
import { formatTimeAgo, timestampChange, timestampToDateTime } from "@/service/DateTimeService";
import moment from "moment";
import toast from "react-hot-toast";
import { Input } from "@/components/ui/input";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { NodeRendererProps, Tree, useSimpleTree } from 'react-arborist';
import { useLogin } from "@/service/LoginContext";
import { Checkbox } from "@/components/ui/checkbox";

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

function ContestDashboard() {

    const { id: contest_id } = useParams<{ id: string }>();

    const navigate = useNavigate();

    const [contest, setContest] = useState<any>(null);
    const [description, setDescription] = useState<any>(null);
    const [warningShow, setWarningShow] = useState(true);
    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(0, 0));

    const [key, setKey] = useState(0);
    const [problems, setProblems] = useState<any>([]);
    const [members, setMembers] = useState<any>([]);

    const getData = async () => {
        const data = await getContestByIDForAdmin(contest_id as any);
        // console.log(data);
        setContest(data);
        setTimeLeft(calculateTimeLeft(data.end_time as any, data.duration as any));
    }

    const getProblems = async () => {
        const data = await getProblemsByContestID(contest_id as any);
        // console.log(data);
        setProblems(data);
    }

    const getDescription = async () => {
        const data = await getContestDescriptionByID(contest_id as any);
        // console.log(data);
        setDescription(data);
    }

    const getMembers = async () => {
        const data = await getMembersByContestID(contest_id as any);
        setMembers(data);
        console.log(data);
    }

    const handleUpdateProblems = async () => {
        await updateProblemsByID(contest_id as string, problems);
    }

    useEffect(() => {
        setKey(prevKey => prevKey + 1);
        handleUpdateProblems();
    }, [problems]);

    useEffect(() => {
        Promise.allSettled([getData(), getDescription(), getProblems(), getMembers()]);
    }, []);

    return (
        <div className="ContestDashboard p-5 pl-2 flex flex-col gap-8">
            <Breadcrumb>
                <BlurFade delay={0} yOffset={0}>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink asChild>
                                <Link to="/admin">Quản trị</Link>
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbLink asChild>
                                <Link to="/admin/contests">Quản lý cuộc thi</Link>
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
                        <div className="flex justify-between">
                            <h1 className="text-2xl font-bold">
                                <span className="mr-2">{contest?.name}</span>
                                {
                                    contest?.public &&
                                    <Badge variant="outline" className="text-[12px] p-0 px-2 pr-3 font-normal leading-6 -translate-y-0.5">
                                        <Eye className="h-3 w-3 mr-2" />Công khai
                                    </Badge>
                                }
                            </h1>
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
                                        Chỉnh sửa cuộc thi
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>
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
                                        value="members"
                                        className="px-1 border-b-2 border-b-transparent drop-shadow-none data-[state=active]:border-b-primary rounded-none bg-transparent data-[state=active]:bg-transparent duration-500"
                                    >
                                        <Button variant="ghost" size="sm" className="hover:bg-secondary/60">
                                            <Users className="w-4 mr-2" />Danh sách tham gia
                                            {
                                                members.length > 0 &&
                                                <Badge variant="secondary" className="px-1.5 rounded-sm ml-2">
                                                    {members.length}
                                                </Badge>
                                            }
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
                                </TabsList>
                            </BlurFade>
                            <TabsContent value="content" className="w-full">
                                <div className="flex flex-col gap-6 py-4">
                                    {
                                        description &&
                                        <BlurFade delay={0.2} yOffset={0}>
                                            <div
                                                className="ck-content hicommit-content leading-7 text-justify flex-1"
                                                dangerouslySetInnerHTML={{ __html: description }}
                                            />
                                        </BlurFade>
                                    }
                                    <BlurFade delay={0.3} yOffset={0} blur="2px">
                                        <div className="w-full flex flex-col gap-2">
                                            <h2 className="">Đề bài:</h2>
                                            <div className="flex flex-col gap-5">
                                                {
                                                    problems && problems?.length > 0 ?
                                                        <ProblemTree problems={problems} setProblems={setProblems} refresh={getProblems} key={key} /> :
                                                        <div className="flex items-center justify-center w-full h-24 border rounded-lg bg-secondary/40 dark:bg-secondary/10">
                                                            <span>Chưa có câu hỏi nào</span>
                                                        </div>
                                                }
                                                <Link to={`problem/create`}>
                                                    <Button className="w-fit pr-5"><Plus className="size-[17px] mr-1.5" /> Thêm câu hỏi mới</Button>
                                                </Link>
                                            </div>
                                        </div>
                                    </BlurFade>
                                </div>
                            </TabsContent>
                            <TabsContent value="ranking" className="w-full">
                                <div className="flex flex-col gap-5 py-3">
                                    <Ranking />
                                </div>
                            </TabsContent>
                            <TabsContent value="members" className="w-full">
                                <div className="flex flex-col gap-5 py-3">
                                    <MemberList />
                                </div>
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>
                <CountDown contest={contest} />
            </div>
        </div>
    );
};

export default ContestDashboard;

export type User = {
    id: string
    username: string
    email: string
    status: "ACTIVE" | "BANNED"
    avatar_url: string
    createdAt: string
}

function MemberList(props: any) {

    const loginContext = useLogin();
    const { id: contest_id } = useParams<{ id: string }>();

    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
        id: false,
        avatar_url: false,
        role: false,
    });
    const [rowSelection, setRowSelection] = useState({});
    const [data, setData] = useState<User[]>([]);

    const getData = async () => {
        const users = await getMembersByContestID(contest_id as any);
        console.log(users);
        // const currentUser = users.find((user: any) => user.id === loginContext.user?.id);
        // users.splice(users.indexOf(currentUser), 1);
        // users.unshift(currentUser);
        setData(users);
    }

    const handleUpdateStatus = async (_id: string, status: string) => {
        await toast.promise(
            updateStatusUserContest(_id, status),
            {
                loading: 'Đang cập nhật...',
                success: 'Cập nhật thành công',
                error: 'Cập nhật không thành công, hãy thử lại'
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
        getData();
    }

    useEffect(() => {
        getData();
    }, []);

    const columns: ColumnDef<User>[] = [
        {
            accessorKey: "id",
            enableHiding: false,
        },
        {
            accessorKey: "avatar_url",
            enableHiding: false,
        },
        {
            accessorKey: "role",
            enableHiding: false,
        },
        {
            id: "index",
            header: ({ column }) => {
                return (
                    <div className="flex items-center gap-1">
                        <span>#</span>
                    </div>
                )
            },
            cell: ({ row }) => {
                return (
                    <div className="font-medium">
                        {data.indexOf(row.original) + 1}
                    </div>
                )
            },
        },
        {
            accessorKey: "username",
            header: ({ column }) => {
                return (
                    <div className="flex items-center gap-1">
                        <span>Người dùng</span>
                        <Button
                            variant="ghost"
                            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                            size="icon"
                            className="h-7 w-7"
                        >
                            <ArrowUpDown className="h-4 w-4" />
                        </Button>
                    </div>
                )
            },
            cell: ({ row }) => (
                <div className="flex items-center">
                    <img src={row.getValue("avatar_url")} className="w-6 h-6 rounded-full inline mr-2" />
                    <span className="lowercase">
                        {row.getValue("username")}
                        {(row.getValue("role") === "ADMIN" || row.getValue("role") === "TEACHER") && <i className="fa-solid fa-circle-check text-primary text-[10px] ml-1 -translate-y-[1px]"></i>}
                    </span>
                    {
                        loginContext.user?.id === row.getValue("id") &&
                        <span className="ml-1 text-primary italic">(Bạn)</span>
                    }
                </div>
            ),
        },
        {
            accessorKey: "email",
            header: ({ column }) => {
                return (
                    <div className="flex items-center gap-1">
                        <span>Email</span>
                        <Button
                            variant="ghost"
                            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                            size="icon"
                            className="h-7 w-7"
                        >
                            <ArrowUpDown className="h-4 w-4" />
                        </Button>
                    </div>
                )
            },
            cell: ({ row }) => <div className="lowercase">{row.getValue("email")}</div>,
        },
        {
            accessorKey: "status",
            header: ({ column }) => {
                return (
                    <div className="flex items-center gap-1">
                        <span>Trạng thái</span>
                        <Button
                            variant="ghost"
                            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                            size="icon"
                            className="h-7 w-7"
                        >
                            <ArrowUpDown className="h-4 w-4" />
                        </Button>
                    </div>
                )
            },
            cell: ({ row }) => {
                return (
                    <div className="font-medium">
                        <Select value={row.getValue("status")} onValueChange={(value) => handleUpdateStatus(row.getValue("id"), value)}>
                            <SelectTrigger className="w-[130px] bg-transparent p-2 h-8 text-xs items-center">
                                <div>
                                    <SelectValue />
                                    {row.getValue("status") === "ACTIVE" && <i className="fa-solid fa-circle text-[4px] ml-1.5 text-green-600 dark:text-green-500 -translate-y-[3px]"></i>}
                                    {row.getValue("status") === "EXITED" && <i className="fa-solid fa-circle text-[4px] ml-1.5 text-yellow-600 dark:text-yellow-500 -translate-y-[3px]"></i>}
                                    {row.getValue("status") === "BANNED" && <i className="fa-solid fa-circle text-[4px] ml-1.5 text-red-600 dark:text-red-500 -translate-y-[3px]"></i>}
                                </div>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="ACTIVE">Hoạt động</SelectItem>
                                <SelectItem value="EXITED">Đã rời đi</SelectItem>
                                <SelectItem value="BANNED">Bị khoá</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                )
            },
        },
        {
            accessorKey: "createdAt",
            header: () => {
                return (<div className="text-nowrap text-right">Tham gia vào</div>)
            },
            cell: ({ row }) => (
                <div className="flex justify-end flex-col gap-0.5">
                    <span className="text-nowrap text-right">{formatTimeAgo(row.getValue("createdAt"), "vi")}</span>
                </div>
            )
        },
    ]

    const table = useReactTable({
        data,
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

    const labelArr = {
        index: "Số thứ tự",
        username: "Người dùng",
        email: "Email",
        status: "Trạng thái",
        createdAt: "Tham gia vào",
    }

    return (
        <div>
            <div className="flex flex-col gap-5">
                <div className="w-full">
                    <div className="flex items-center pb-4 gap-3 justify-end">
                        <Input
                            placeholder="Tìm kiếm người dùng ..."
                            value={(table.getColumn("username")?.getFilterValue() as string) ?? ""}
                            onChange={(event) =>
                                table.getColumn("username")?.setFilterValue(event.target.value)
                            }
                            className="flex-1 bg-transparent"
                        />
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" className="justify-between w-[180px] pr-3 bg-transparent">
                                    Tuỳ chọn hiển thị <ChevronDown className="ml-2 h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-[180px]">
                                {table
                                    .getAllColumns()
                                    .filter((column) => column.getCanHide())
                                    .map((column) => {
                                        return (
                                            <DropdownMenuCheckboxItem
                                                key={column.id}
                                                className="capitalize w-full"
                                                checked={column.getIsVisible()}
                                                onCheckedChange={(value) =>
                                                    column.toggleVisibility(!!value)
                                                }
                                            >
                                                {
                                                    labelArr[column.id as keyof typeof labelArr] ?? column.id
                                                }
                                            </DropdownMenuCheckboxItem>
                                        )
                                    })}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                    <div className="rounded-md border overflow-hidden">
                        <Table>
                            <TableHeader className="bg-secondary/70 dark:bg-secondary">
                                {table.getHeaderGroups().map((headerGroup) => (
                                    <TableRow key={headerGroup.id} className="hover:bg-secondary/70 dark:hover:bg-secondary">
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
                                            className="data-[state=selected]:bg-secondary/40 dark:data-[state=selected]:bg-secondary/60 hover:bg-secondary/20"
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
                        <div className="flex-1 text-sm text-muted-foreground">
                            {
                                table.getFilteredSelectedRowModel().rows.length > 0 &&
                                <span>Đã chọn <strong>{table.getFilteredSelectedRowModel().rows.length}</strong> dòng (Tổng số: {table.getFilteredRowModel().rows.length} dòng)</span>
                            }
                        </div>
                        <div className="space-x-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => table.previousPage()}
                                disabled={!table.getCanPreviousPage()}
                            >
                                Trang trước
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => table.nextPage()}
                                disabled={!table.getCanNextPage()}
                            >
                                Trang sau
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

function ProblemTree(props: any) {

    const { problems, setProblems, refresh } = props;

    const [data, controller] = useSimpleTree(problems);

    const { id: contest_id } = useParams<{ id: string }>();

    const treeRef = useRef(null);

    // Re-initialize data and controller when dataFromAPI changes

    const getQuanlityNode = (data: any) => {
        let count = 0;
        data.map((item: any) => {
            count++;
            if (item.children) {
                count += item.children.length;
            }
        });
        return count;
    }

    useEffect(() => {
        setProblems(data);
    }, [data])

    function Node({ node, dragHandle }: NodeRendererProps<any>) {

        const handleDeleteProblem = async (problem_id: any) => {

            // Nếu là câu hỏi duy nhất thì không cho xoá
            if (data.length === 1) {
                pushError("Phải có ít nhất một câu hỏi.");
                return;
            }

            try {
                const response = await toast.promise(
                    deleteProblemInContestByID(contest_id as any, problem_id),
                    {
                        loading: 'Đang xoá...',
                        success: 'Xoá thành công',
                        error: 'Xoá thất bại'
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

                refresh();

            } catch (error) {
                console.error('Error creating post:', error);
            }
        }

        return (
            <div ref={dragHandle as any} className="h-[50px] w-full flex items-center">
                <div className="w-full hover:bg-zinc-100 cursor-move dark:hover:bg-zinc-900 p-2.5 pl-4 pr-3 pb-3 rounded-lg flex items-center justify-between group/work">
                    <h3 className="flex items-start gap-3 flex-1">
                        <GripVertical className="w-5 h-5 opacity-70 translate-y-[2.5px]" />
                        <p className="flex-1 line-clamp-1">
                            <span className='mr-2.5'>
                                {node.data.name}
                            </span>
                            <Badge variant="secondary" className="px-1.5 rounded-sm -translate-y-[1px]">
                                {node?.data?.language === "c" && "C"}
                                {node?.data?.language === "cpp" && "C++"}
                                {node?.data?.language === "java" && "Java"}
                            </Badge>
                        </p>
                    </h3>
                    <div className='flex items-center gap-1 invisible group-hover/work:visible'>
                        <Link to={`/admin/problems/${node.data.id}/edit`} className='cursor-pointer size-7'>
                            <Button size="icon" variant="ghost" className="w-full h-full">
                                <Pencil className="w-[13px]" />
                            </Button>
                        </Link>
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button size="icon" variant="ghost" className="size-7 hover:bg-red-500/20 dark:hover:bg-red-500/40">
                                    <Trash2 className="w-[13px]" />
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Xác nhận xoá bài tập này</DialogTitle>
                                </DialogHeader>
                                <DialogDescription>
                                    Sau khi xoá, bài tập này sẽ không thể truy cập.
                                </DialogDescription>
                                <DialogFooter className="mt-2">
                                    <DialogClose>
                                        <Button variant="ghost">
                                            Đóng
                                        </Button>
                                    </DialogClose>
                                    <DialogClose>
                                        <Button className="w-fit px-4" variant="destructive" onClick={() => handleDeleteProblem(node?.data?.id)}>
                                            Xoá
                                        </Button>
                                    </DialogClose>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className='tree-parent'>
            <Tree
                data={data}
                ref={treeRef}
                {...controller}
                indent={10}
                rowHeight={50}
                overscanCount={1}
                disableEdit={true}
                className="w-full"
                openByDefault={true}
                width={"100%"}
                height={getQuanlityNode(data) * 50 + 5}
            >
                {Node as any}
            </Tree>
        </div>
    )
}

function CountDown(props: any) {

    const { contest } = props;

    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(0, 0));
    const [countdown, setCountdown] = useState<any>(null);

    useEffect(() => {
        const interval = setInterval(() => {
            setTimeLeft(calculateTimeLeft(contest.end_time, contest.duration));
            setCountdown(calculateCountdown(contest.start_time));
        }, 1000);

        return () => clearInterval(interval);
    }, [contest]);

    return (
        <div>
            {
                contest?.start_time > moment(new Date().getTime()).unix() ?
                    <BlurFade delay={0.2} yOffset={0}>
                        <div className="w-[280px] 2xl:w-[300px] p-7 border rounded-lg bg-secondary/10 sticky top-4">
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
                        </div>
                    </BlurFade> :
                    timeLeft.percent <= 0 ? (
                        <BlurFade delay={0.3} yOffset={0}>
                            <div className="w-[290px] 2xl:w-[320px] p-4 pb-2 border rounded-lg bg-secondary/10 sticky top-4">
                                <div className="relative flex flex-col items-center justify-center gap-6">
                                    <h2 className="font-bold text-lg">Kết quả cuộc thi</h2>
                                    <div className="flex flex-col gap-2.5 w-full">
                                        <BlurFade delay={0.25}>
                                            <div className="flex items-center gap-2 w-full border rounded-lg p-3 pl-4 bg-primary text-white">
                                                <span className="w-4 text-sm font-bold">1</span>
                                                <div className="flex items-center">
                                                    <img src="https://avatars.githubusercontent.com/u/93561031?v=4" className="size-[26px] rounded-full inline mr-2 border border-white" />
                                                    <span className="lowercase text-sm font-semibold line-clamp-1 break-words">kakanvk</span>
                                                </div>
                                                <Badge variant="secondary" className="ml-auto rounded-md bg-white text-primary text-[12px] p-0.5 px-2 font-black leading-5 text-nowrap">
                                                    500
                                                </Badge>
                                            </div>
                                        </BlurFade>
                                        <BlurFade delay={0.3}>
                                            <div className="flex items-center gap-2 w-full border border-foreground/10 rounded-lg p-3 pl-4 bg-secondary">
                                                <span className="w-4 text-sm font-bold opacity-70">2</span>
                                                <div className="flex items-center">
                                                    <img src="https://avatars.githubusercontent.com/u/168247648?v=4" className="size-[26px] rounded-full inline mr-2 border border-foreground/20" />
                                                    <span className="lowercase text-sm font-semibold text-l line-clamp-1 break-words">kakaintest</span>
                                                </div>
                                                <Badge variant="secondary" className="ml-auto rounded-md bg-foreground/10 dark:bg-foreground/20 text-[12px] p-0.5 px-2 font-black leading-5 text-nowrap">
                                                    300
                                                </Badge>
                                            </div>
                                        </BlurFade>
                                        <BlurFade delay={0.35}>
                                            <div className="flex items-center gap-2 w-full border rounded-lg p-3 pl-4 bg-secondary/10">
                                                <span className="w-4 text-sm font-bold opacity-70">3</span>
                                                <div className="flex items-center">
                                                    <img src="https://avatars.githubusercontent.com/u/167604394?v=4" className="size-[26px] rounded-full inline mr-2 border border-foreground/20" />
                                                    <span className="lowercase text-sm font-semibold text-l line-clamp-1 break-words">nguyenthuhakt</span>
                                                </div>
                                                <Badge variant="secondary" className="ml-auto rounded-md bg-secondary/50 dark:bg-secondary/60 text-[12px] p-0.5 px-2 font-black leading-5 text-nowrap">
                                                    200
                                                </Badge>
                                            </div>
                                        </BlurFade>
                                        <BlurFade delay={0.4}>
                                            <Button variant="ghost" className="group/more w-full">
                                                Xem tất cả<ArrowRight className="size-[14px] ml-2 duration-100 group-hover/more:ml-3" />
                                            </Button>
                                        </BlurFade>
                                    </div>
                                </div>
                            </div>
                        </BlurFade>
                    ) :
                        <BlurFade delay={0.3} yOffset={0}>
                            <div className="w-[280px] sticky top-4 flex flex-col gap-4">
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
                            </div>
                        </BlurFade>
            }
        </div>
    )
}