
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"
import { Separator } from "@/components/ui/separator";
import { ArrowRight, ArrowUpDown, ChevronDown, EllipsisVertical, Eye, MoveRight, Plus, Search, Shuffle, Tag } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

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
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

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

import { useEffect, useState } from "react";
import { getAllTags, getProblems } from "@/service/API/Problem";
import { handleCopyText } from "@/service/UIService";
import { Checkbox } from "@/components/ui/checkbox";
import { formatTimeAgo } from "@/service/DateTimeService";
import Loader2 from "@/components/ui/loader2";
import { getMySubmited } from "@/service/API/Submission";
import BlurFade from "@/components/magicui/blur-fade";

import leaderboard from "@/assets/imgs/Star_Art.png";

// Problem(id, name, slug, tags, language, description, input, output, limit, examples, testcases, created_by, type, level, score, parent)
export type Problem = {
    id: string
    name: string
    slug: string
    tags: string[]
    language: string
    description: string
    input: string
    output: string
    limit: number
    examples: string[]
    testcases: string[]
    created_by: string
    type: "COURSE" | "CONTEST" | "FREE"
    level: string
    score: number
    parent: Object,
    ac_rate: number
}

const labelArr = {
    index: "Số thứ tự",
    name: "Tên bài tập",
    slug: "Mã bài tập",
    creator: "Người tạo",
    tags: "Dạng bài",
    language: "Ngôn ngữ",
    level: "Cấp độ",
    ac_rate: "Tỷ lệ AC",
    score: "Điểm",
    createdAt: "Ngày tạo",
    actions: "Hành động"
}

function Problems() {

    const navigate = useNavigate();

    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
        id: false,
        slug: false,
        createdAt: false,
        language: false,
    });
    const [rowSelection, setRowSelection] = useState({});
    const [data, setData] = useState<Problem[]>([]);
    const [dataFiltered, setDataFiltered] = useState<Problem[]>([]);
    const [loading, setLoading] = useState(true);

    const [tags, setTags] = useState<string[]>([]);
    const [filteredTags, setFilteredTags] = useState(tags);
    const [searchTagValue, setSearchTagValue] = useState("");
    const [mySubmited, setMySubmited] = useState<any[]>([]);
    const [filterByStatus, setFilterByStatus] = useState("all");
    const [filterByTags, setFilterByTags] = useState<string[]>([]);

    useEffect(() => {
        setFilteredTags(tags.filter(tag => tag.toLowerCase().includes(searchTagValue.trim().toLowerCase())))
    }, [searchTagValue])

    const getData = async () => {
        const problems = await getProblems();
        // console.log(problems);
        setData(problems);
        setDataFiltered(problems);
        setLoading(false);
    }

    const handleGetMySubmited = async () => {
        const response = await getMySubmited();
        setMySubmited(response);
    }

    const handleOnClickTag = (tag: string) => {
        const newFilterByTags = [...filterByTags];

        if (newFilterByTags.includes(tag)) {
            newFilterByTags.splice(newFilterByTags.indexOf(tag), 1);
        } else {
            newFilterByTags.push(tag);
        }
        setFilterByTags(newFilterByTags);

        const newDataFiltered = data.filter(problem => problem.tags.some(tag => newFilterByTags.includes(tag)));
        if (newFilterByTags.length === 0) {
            setDataFiltered(data);
        } else {
            setDataFiltered(newDataFiltered);
        }
    }

    const handleFilterByStatus = (value: string) => {
        setFilterByStatus(value);
        if (value === "completed") {
            setDataFiltered(data.filter(problem => mySubmited[problem.slug as keyof typeof mySubmited] === "PASSED"));
        } else if (value === "uncomplete") {
            setDataFiltered(data.filter(problem => mySubmited[problem.slug as keyof typeof mySubmited] !== "PASSED"));
        } else {
            setDataFiltered(data);
        }
    }

    const handleSelectRandomProblem = () => {
        const randomIndex = Math.floor(Math.random() * dataFiltered.length);
        const randomProblem = dataFiltered[randomIndex];
        navigate(`/problem/${randomProblem.slug}`);
    }

    const getTags = async () => {
        const tags = await getAllTags();
        setTags(tags);
        setFilteredTags(tags);
    }

    useEffect(() => {
        getData();
        getTags();
        handleGetMySubmited();
    }, []);

    const columns: ColumnDef<Problem>[] = [
        {
            accessorKey: "id",
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
            accessorKey: "slug",
            header: ({ column }) => {
                return (
                    <div className="flex items-center">
                        <span className='text-nowrap'>ID</span>
                    </div>
                )
            },
            cell: ({ row }) => (
                <Badge variant="secondary" className="uppercase rounded-md bg-secondary/50 dark:bg-secondary/60 text-[12px] p-0.5 px-2 font-normal leading-5 cursor-pointer text-nowrap" onClick={() => handleCopyText(row.getValue("slug"))}>
                    {row.getValue("slug")}
                </Badge>
            ),
        },
        {
            accessorKey: "name",
            header: ({ column }) => {
                return (
                    <div className="flex items-center gap-1">
                        <span className='text-nowrap'>Tên bài tập</span>
                    </div>
                )
            },
            cell: ({ row }) => (
                <Link to={`/problem/${row.getValue("slug")}`} className="w-fit flex items-center gap-2 hover:text-green-600 dark:hover:text-green-500">
                    <p className="line-clamp-1 font-medium">{row.getValue("name")}</p>
                    {mySubmited[row.getValue("slug") as keyof typeof mySubmited] === "PASSED" && <i className="text-[12px] translate-y-[1px] fa-solid fa-circle-check text-green-600"></i>}
                    {mySubmited[row.getValue("slug") as keyof typeof mySubmited] === "FAILED" && <i className="text-[12px] translate-y-[1px] fa-solid fa-circle-xmark text-red-500"></i>}
                    {mySubmited[row.getValue("slug") as keyof typeof mySubmited] === "ERROR" && <i className="text-[12px] translate-y-[1px] fa-solid fa-circle-exclamation text-amber-500"></i>}
                    {mySubmited[row.getValue("slug") as keyof typeof mySubmited] === "COMPILE_ERROR" && <i className="text-[12px] translate-y-[1px] fa-solid fa-triangle-exclamation text-zinc-400"></i>}
                </Link>
            ),
        },
        {
            accessorKey: "tags",
            header: () => { return (<div>Dạng bài</div>) },
            cell: ({ row }) => (
                <div className="flex flex-wrap gap-2 max-w-[120px] xl:max-w-[150px] 2xl:max-w-[250px]">
                    {(row.getValue("tags") as any)?.map((tag: any) => (
                        <Badge key={tag} variant="outline" className="text-[12px] p-0.5 px-3 font-medium leading-5 cursor-pointer text-nowrap">{tag}</Badge>
                    ))}
                </div>
            ),
        },
        {
            accessorKey: "language",
            header: ({ column }) => {
                return (
                    <div className="flex items-center gap-1 text-nowrap">
                        <span>Ngôn ngữ</span>
                    </div>
                )
            },
            cell: ({ row }) => (
                <Badge variant="secondary" className="rounded-md bg-secondary/50 dark:bg-secondary/60 text-[12px] p-0.5 px-2 font-semibold dark:font-normal leading-5 cursor-pointer text-nowrap">
                    {row.getValue("language") === "c" && "C"}
                    {row.getValue("language") === "cpp" && "C++"}
                    {row.getValue("language") === "java" && "Java"}
                </Badge>
            ),
        },
        {
            accessorKey: "ac_rate",
            header: ({ column }) => {
                return (
                    <div className="flex items-center gap-1">
                        <span className='text-nowrap'>Tỷ lệ AC</span>
                        <Button
                            variant="ghost"
                            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                            size="icon"
                            className="h-7 w-7 dark:hover:bg-zinc-500/20"
                        >
                            <ArrowUpDown className="h-4 w-4 opacity-40" />
                        </Button>
                    </div>
                )
            },
            cell: ({ row }) => (
                <div className="flex items-center gap-1.5">
                    <div className="w-[60px] 2xl:w-[80px] h-1.5 bg-secondary/90 rounded-full overflow-hidden">
                        <div className="h-1.5 bg-primary rounded-full" style={{ width: `${(row.getValue("ac_rate") as any).toFixed(0)}%` }}>
                        </div>
                    </div>
                    <span className="text-[12px] font-semibold">
                        {(row.getValue("ac_rate") as any).toFixed(0) + "%"}
                    </span>
                </div>
            ),
        },
        {
            accessorKey: "level",
            header: ({ column }) => {
                return (
                    <div className="flex items-center gap-1 text-nowrap">
                        <span>Cấp độ</span>
                    </div>
                )
            },
            cell: ({ row }) => {
                return (
                    <>
                        {
                            row.getValue("level") === "EASY" &&
                            <span className={`rounded-md bg-green-500/20 border border-green-500 text-green-600 dark:text-green-400 text-[12px] p-1 px-2 font-medium leading-5 text-nowrap`} >
                                Dễ
                            </span >
                        }
                        {
                            row.getValue("level") === "MEDIUM" &&
                            <span className={`rounded-md bg-sky-500/20 border border-sky-500 text-sky-600 dark:text-sky-400 text-[12px] p-1 px-2 font-medium leading-5 text-nowrap`} >
                                Trung bình
                            </span >
                        }
                        {
                            row.getValue("level") === "HARD" &&
                            <span className={`rounded-md bg-orange-500/20 border border-orange-500 text-orange-600 dark:text-orange-400 text-[12px] p-1 px-2 font-medium leading-5 text-nowrap`} >
                                Khó
                            </span >
                        }
                    </>
                )
            },
        },
        {
            accessorKey: "score",
            header: ({ column }) => {
                return (
                    <div className="flex items-center gap-1 justify-end">
                        <span>Điểm</span>
                        <Button
                            variant="ghost"
                            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                            size="icon"
                            className="h-7 w-7 dark:hover:bg-zinc-500/20"
                        >
                            <ArrowUpDown className="h-4 w-4 opacity-40" />
                        </Button>
                    </div>
                )
            },
            cell: ({ row }) => (
                <div className="flex justify-end mr-1">
                    <Badge variant="secondary" className="rounded-md bg-secondary/50 dark:bg-secondary/60 text-[12px] p-0.5 px-2 font-semibold leading-5 cursor-pointer text-nowrap">
                        {row.getValue("score")}
                    </Badge>
                </div>
            ),
        }
    ]

    const table = useReactTable({
        data: dataFiltered,
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
    });

    return (
        <div className="Problems p-6 px-8">
            <div>
                <div className="w-full relative flex items-start gap-6">
                    <div className="flex-1 flex flex-col gap-4">
                        <div className="w-full">
                            <BlurFade delay={0.1} yOffset={0} blur="2px">
                                <div className="flex items-center mb-4 gap-3 justify-end">
                                    <p className="flex-1 text-lg pt-2 w-fit">
                                        <span className="font-semibold">Danh sách bài tập</span>
                                        <Badge variant="secondary" className="px-1.5 rounded-sm ml-2 inline">
                                            {data.length}
                                        </Badge>
                                    </p>
                                    <div className="relative max-w-[300px] flex-1">
                                        <Search className="absolute left-3 top-[12px] h-4 w-4 text-muted-foreground" />
                                        <Input
                                            type="search"
                                            placeholder="Tìm kiếm bài tập ..."
                                            value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
                                            onChange={(event) =>
                                                table.getColumn("name")?.setFilterValue(event.target.value)
                                            }
                                            className="bg-transparent flex-1 rounded-md pl-9"
                                        />
                                    </div>
                                    <Select value={filterByStatus} onValueChange={(value) => handleFilterByStatus(value)}>
                                        <SelectTrigger className="w-[180px] bg-transparent">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">Tất cả</SelectItem>
                                            <SelectItem value="completed">Đã hoàn thành</SelectItem>
                                            <SelectItem value="uncomplete">Chưa hoàn thành</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <div className="flex items-center">
                                                <Button variant="outline" className="bg-transparent flex 2xl:hidden" size="icon">
                                                    <EllipsisVertical className="size-4" />
                                                </Button>
                                                <Button variant="outline" className="justify-between w-[180px] pr-3 bg-transparent hidden 2xl:flex">
                                                    Tuỳ chọn hiển thị <ChevronDown className="ml-2 h-4 w-4" />
                                                </Button>
                                            </div>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="start" className="w-[180px]">
                                            {table
                                                .getAllColumns()
                                                .filter((column) => column.getCanHide())
                                                .map((column) => {
                                                    return (
                                                        <DropdownMenuCheckboxItem
                                                            key={column.id}
                                                            className="w-full"
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
                            </BlurFade>
                            <BlurFade delay={0.15} yOffset={0} blur="2px" duration={0.6}>
                                <div className="rounded-md border overflow-hidden">
                                    <Table>
                                        <TableHeader className="bg-secondary/70 dark:bg-secondary">
                                            {table.getHeaderGroups().map((headerGroup) => (
                                                <TableRow key={headerGroup.id} className="hover:bg-secondary/70 dark:hover:bg-secondary">
                                                    {headerGroup.headers.map((header) => {
                                                        return (
                                                            <TableHead key={header.id} className="text-black dark:text-white">
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
                                            {loading ?
                                                <TableRow>
                                                    <TableCell
                                                        colSpan={columns.length}
                                                        className="h-24 text-center"
                                                    >
                                                        <div className="w-full flex justify-center p-5">
                                                            <Loader2 />
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                                :
                                                table.getRowModel().rows?.length ? (
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
                            </BlurFade>
                            <div className="flex items-center justify-end space-x-2 py-4">
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
                    <BlurFade delay={0.3} yOffset={0} blur="2px" className="flex flex-col gap-4">
                        <Link to="/leaderboard" className="border rounded-md p-4 px-6 flex items-center gap-5 bg-secondary/30 hover:bg-secondary/60">
                            <img src={leaderboard} alt="leaderboard" className="w-[45px] opacity-90" />
                            <div>
                                <h2 className="text-lg font-bold">Bảng xếp hạng</h2>
                                <Link to="/leaderboard" className="text-sm text-primary">Khám phá ngay<ArrowRight className="size-4 inline ml-1"/></Link>
                            </div>
                        </Link>
                        <div className="w-[280px] 2xl:w-[320px] sticky top-6">
                            <div className="border bg-secondary/10 rounded-md p-4 px-5 flex flex-col gap-4">
                                <div className="flex flex-col gap-4">
                                    <h2 className="font-bold text-lg">
                                        <span>Các dạng bài tập</span>
                                        <Badge variant="secondary" className="px-1.5 rounded-sm ml-2 inline">
                                            {filteredTags.length}
                                        </Badge>
                                    </h2>
                                    <div className="relative flex-1">
                                        <Search className="absolute left-3 top-[11px] h-4 w-4 text-muted-foreground" />
                                        <Input
                                            type="search"
                                            placeholder="Tìm kiếm"
                                            value={searchTagValue}
                                            onChange={(e) => setSearchTagValue(e.target.value)}
                                            className="w-full rounded-md pl-9 flex-1 bg-transparent"
                                        />
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {
                                            filteredTags.map((tag, index) => (
                                                <BlurFade key={index} delay={0.15 + 0.05 * index} yOffset={0} blur="2px">
                                                    <Badge variant={filterByTags.includes(tag) ? "default" : "secondary"} className={`text-[12px] p-0.5 px-3 font-normal leading-5 cursor-pointer ${filterByTags.includes(tag) ? "text-white" : "text-black dark:text-white bg-secondary/50 dark:bg-secondary/60"}`} onClick={() => handleOnClickTag(tag)}>
                                                        {tag}
                                                    </Badge>
                                                </BlurFade>
                                            ))
                                        }
                                        {
                                            filteredTags.length === 0 && <span className="text-sm text-muted-foreground">Không có kết quả phù hợp</span>
                                        }
                                    </div>
                                    <Button size="sm" className="mt-1" onClick={handleSelectRandomProblem}><Shuffle className="w-4 h-4 mr-3" />Lấy ngẫu nhiên</Button>
                                </div>
                            </div>
                        </div>
                    </BlurFade>
                </div>
            </div>
        </div>
    );
};

export default Problems;