import { getLeaderboard } from "@/service/API/Analysis";
import { useEffect, useState } from "react";

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
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { ArrowUpDown, Search } from "lucide-react";
import { useLogin } from "@/service/LoginContext";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

const labelArr = {
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

function LeaderBoard() {

    const loginContext = useLogin();

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
        const response = await getLeaderboard();
        setData(response);
        console.log(response);
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
            id: "index",
            header: ({ column }) => {
                return (
                    <div className="flex items-center gap-1">
                        <span>#</span>
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
                <div className="font-medium">
                    {row.index + 1}
                </div>
            ),
        },
        {
            accessorKey: "username",
            header: ({ column }) => {
                return (
                    <div className="flex items-center gap-1">
                        <span>Tài khoản</span>
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
                <Link to={`/profile/${row.getValue("username")}`} className="flex items-center">
                    <img src={row.getValue("avatar_url")} className="w-6 h-6 rounded-full inline mr-2" />
                    <span className="lowercase font-medium text-nowrap">
                        {row.getValue("username")}
                        {((row.getValue("role") as any) === "ADMIN" || (row.getValue("role") as any) === "TEACHER") && <i className="fa-solid fa-circle-check text-primary text-[10px] ml-1 -translate-y-[1px]"></i>}
                    </span>
                    {
                        loginContext.user?.id === row.getValue("id") &&
                        <span className="ml-1 text-primary italic">(Bạn)</span>
                    }
                </Link>
            ),
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
                    <div className="w-[90px] h-1.5 bg-secondary/90 rounded-full overflow-hidden">
                        <div className="h-1.5 bg-primary rounded-full" style={{ width: `${Number(row.getValue("ac_rate")).toFixed(1)}%` }}>
                        </div>
                    </div>
                    <span className="text-[12px] font-semibold">
                        {Number(row.getValue("ac_rate")).toFixed(1) + "%"}
                    </span>
                </div>
            ),
        },
        {
            accessorKey: "completed_problems",
            header: ({ column }) => {
                return (
                    <div className="flex items-center gap-1 justify-center">
                        <span>Số bài đã giải</span>
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
                <div className="flex justify-center mr-1">
                    <span className="text-[12px] font-semibold">
                        {(row.getValue("completed_problems") as string)?.split(",")?.length ?? 0} bài
                    </span>
                </div>
            ),
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
                    <Badge variant="secondary" className="rounded-md bg-secondary/50 dark:bg-secondary/60 text-[12px] p-0.5 px-2 font-bold dark:font-semibold leading-5 cursor-pointer text-nowrap">
                        {row.getValue("score")}
                    </Badge>
                </div>
            ),
        }
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

    return (
        <div className="LeaderBoard p-6 pt-5 px-8 flex flex-col gap-4">
            <div className="w-full">
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <Link to="/problems">Luyện tập</Link>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            Bảng xếp hạng
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
                <div className="flex items-center py-4 gap-3 justify-between">
                    <h1 className="text-xl font-bold">Bảng xếp hạng - Luyện tập</h1>
                    <div className="relative max-w-[400px] flex-1">
                        <Search className="absolute left-3 top-[12px] h-4 w-4 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Tìm kiếm người dùng ..."
                            value={(table.getColumn("username")?.getFilterValue() as string) ?? ""}
                            onChange={(event) =>
                                table.getColumn("username")?.setFilterValue(event.target.value)
                            }
                            className="bg-transparent flex-1 rounded-md pl-9"
                        />
                    </div>
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
    );
};

export default LeaderBoard;

export type User = {
    id: string
    username: string
    avatar_url: string,
    score: number,
    completed_problems: string,
    ac_rate: string
}