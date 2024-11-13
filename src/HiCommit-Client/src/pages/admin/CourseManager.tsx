
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

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
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

import { Link } from "react-router-dom";
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
import { ArrowUpDown, BarChartBig, ChevronDown, Ellipsis, FileText, GitMerge, ListFilter, MoreHorizontal, Pencil, Pin, PinOff, Plus, Trash2, TrendingUp, UserRoundPlus, UsersRound } from "lucide-react"

import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"

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
import { useEffect, useState } from "react";
import { getUsers, updateRole, updateStatus } from "@/service/API/User";
import toast from "react-hot-toast";
import { useLogin } from "@/service/LoginContext";
import { AlertDialogFooter } from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { getCoursesForAdmin, togglePublishCourse } from "@/service/API/Course";
import ReactHtmlParser from "react-html-parser";
import { Switch } from "@/components/ui/switch";
import { formatTimeAgo } from "@/service/DateTimeService";

function transform(node: any) {
    if (node.name === 'figure' || node.name === 'table') {
        return null;
    }
}

const labelArr = {
    name: "Tên khoá học",
    units: "Bài tập",
    members: "Tham gia",
    public: "Trạng thái",
    slug: "Mã khoá học",
    author: "Người tạo",
    publish: "Công bố",
    createdAt: "Ngày tạo",
    actions: "Hành động"
}

function CourseManager() {

    const loginContext = useLogin();

    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
        id: false,
        thumbnail: false,
        description: false,
        class_name: false,
    });
    const [rowSelection, setRowSelection] = useState({});
    const [data, setData] = useState<Course[]>([]);

    const getData = async () => {
        const courses = await getCoursesForAdmin();
        setData(courses);
    }

    const handleTogglePublish = async (id: string) => {
        await toast.promise(
            togglePublishCourse(id),
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

    const columns: ColumnDef<Course>[] = [
        {
            id: "select",
            header: ({ table }) => (
                <Checkbox
                    checked={
                        table.getIsAllPageRowsSelected() ||
                        (table.getIsSomePageRowsSelected() && "indeterminate")
                    }
                    onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                    aria-label="Select all"
                />
            ),
            cell: ({ row }) => (
                <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={(value) => row.toggleSelected(!!value)}
                    aria-label="Select row"
                />
            ),
            enableSorting: false,
            enableHiding: false,
        },
        {
            accessorKey: "id",
            enableHiding: false,
        },
        {
            accessorKey: "thumbnail",
            enableHiding: false,
        },
        {
            accessorKey: "description",
            enableHiding: false,
        },
        {
            accessorKey: "class_name",
            enableHiding: false,
        },
        {
            accessorKey: "name",
            header: ({ column }) => {
                return <div className="ml-2">Khoá học</div>
            },
            cell: ({ row }) => (
                <div className="flex items-start gap-2 ml-2 max-w-[800px]">
                    <img src={row.getValue("thumbnail")} className="w-[100px] rounded-lg inline mr-2 border" />
                    <div className="flex flex-col gap-2">
                        <Link className="font-medium line-clamp-1" to={`/admin/courses/${row.getValue("id")}`}>
                            <Badge variant="default" className="rounded text-[9px] px-[5px] py-[1px] mr-2 font-bold leading-4">{row.getValue("class_name")}</Badge>
                            {row.getValue("name")}
                        </Link>
                        <p className="text-xs opacity-50 line-clamp-2 dark:font-light">{ReactHtmlParser(row.getValue("description"), { transform })}</p>
                    </div>
                </div>
            ),
        },
        {
            accessorKey: "author",
            header: () => {
                return (<div className="text-nowrap">Tác giả</div>)
            },
            cell: ({ row }) => (
                <div className="flex justify-start mr-2">
                    <div className="flex items-center gap-2">
                        <img src={(row.getValue("author") as any).avatar_url} className="w-6 h-6 rounded-full" />
                        <span className="text-nowrap">
                            {(row.getValue("author") as any).username}
                            {((row.getValue("author") as any).role === "ADMIN" || (row.getValue("author") as any).role === "TEACHER") && <i className="fa-solid fa-circle-check text-primary text-[10px] ml-1 -translate-y-[1px]"></i>}
                        </span>
                    </div>
                </div>
            )
        },
        {
            accessorKey: "units",
            header: () => {
                return (<div className="text-nowrap text-center">Bài tập</div>)
            },
            cell: ({ row }) => (
                <div className="flex justify-center items-center">
                    <Badge variant="secondary" className="rounded-md bg-secondary/50 dark:bg-secondary/60 text-[12px] p-0.5 px-2 font-medium leading-5 cursor-pointer text-nowrap">
                        <GitMerge className='size-3 mr-1.5' />{(row.getValue("units") as any[]).length} bài tập
                    </Badge>
                </div>
            )
        },
        {
            accessorKey: "members",
            header: () => {
                return (<div className="text-nowrap text-center">Tham gia</div>)
            },
            cell: ({ row }) => (
                <div className="flex justify-center items-center">
                    <Badge variant="secondary" className="rounded-md bg-secondary/50 dark:bg-secondary/60 text-[12px] p-0.5 px-2 font-medium leading-5 cursor-pointer text-nowrap">
                        <UsersRound className='size-3 mr-2' />{(row.getValue("members") as any[]).length}
                    </Badge>
                </div>
            )
        },
        {
            accessorKey: "publish",
            header: () => {
                return (<div className="text-nowrap text-center">Công bố</div>)
            },
            cell: ({ row }) => (
                <div className="flex justify-center">
                    <Switch checked={row.getValue("publish")} className="scale-90" onCheckedChange={() => handleTogglePublish(row.getValue("id") as string)} />
                </div>
            )
        },
        {
            accessorKey: "createdAt",
            header: () => {
                return (<div className="text-nowrap text-left">Ngày tạo</div>)
            },
            cell: ({ row }) => (
                <div className="flex justify-center flex-col gap-0.5">
                    <span className="text-xs opacity-60">Được tạo</span>
                    <span className="text-nowrap">{formatTimeAgo(row.getValue("createdAt"), "vi")}</span>
                </div>
            )
        },
        {
            id: "actions",
            enableHiding: false,
            header: () => <div className="text-center flex justify-center"><ListFilter className="size-[14px]" /></div>,
            cell: ({ row }) => {
                return (
                    <div className="m-auto">
                        <div className='flex items-center justify-center gap-2'>
                            <Dialog>
                                <DropdownMenu>
                                    <DropdownMenuTrigger>
                                        <Button variant="outline" size="icon" className="w-8 h-8">
                                            <Ellipsis className="w-[14px]" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent side="top" align="end">
                                        <Link to={`/admin/courses/${row.getValue("id")}/statistic`} className="cursor-pointer">
                                            <DropdownMenuItem className="cursor-pointer">
                                                <TrendingUp className="size-[13px] mr-3" />Phân tích
                                            </DropdownMenuItem>
                                        </Link>
                                        <Link to={`/admin/courses/${row.getValue("id")}`} className="cursor-pointer">
                                            <DropdownMenuItem className="cursor-pointer">
                                                <BarChartBig className="size-[14px] mr-3" />Chi tiết
                                            </DropdownMenuItem>
                                        </Link>
                                        <Link to={`/admin/courses/${row.getValue("id")}/edit`} className="cursor-pointer">
                                            <DropdownMenuItem className="cursor-pointer">
                                                <Pencil className="size-[13px] mr-3" />Chỉnh sửa
                                            </DropdownMenuItem>
                                        </Link>
                                        <DialogTrigger asChild>
                                            <DropdownMenuItem className="focus:bg-destructive focus:text-white cursor-pointer">
                                                <Trash2 className="size-[14px] mr-3" />Xoá
                                            </DropdownMenuItem>
                                        </DialogTrigger>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Xác nhận xoá khoá học này</DialogTitle>
                                    </DialogHeader>
                                    <DialogDescription>
                                        Sau khi xoá, khoá học này sẽ không thể khôi phục.
                                    </DialogDescription>
                                    <AlertDialogFooter className="mt-2">
                                        <DialogClose>
                                            <Button variant="ghost">
                                                Đóng
                                            </Button>
                                        </DialogClose>
                                        <DialogClose>
                                            <Button className="w-fit px-4" variant="destructive">
                                                Xoá
                                            </Button>
                                        </DialogClose>
                                    </AlertDialogFooter>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </div>
                )
            },
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

    return (
        <div className="CourseManager p-5 pl-2 flex flex-col gap-1">
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                            <Link to="/admin">Quản trị</Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        Quản lý khoá học
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            <div>
                <div className="flex flex-col gap-5">
                    <div className="w-full">
                        <div className="flex items-center py-4 gap-3 justify-end">
                            <p className="flex-1 text-lg pt-2">
                                <span className="font-semibold">Danh sách khoá học</span>
                                <Badge variant="secondary" className="px-1.5 rounded-sm ml-2 inline">
                                    {data.length}
                                </Badge>
                            </p>
                            <Link to="/admin/courses/create">
                                <Button size="icon"><Plus className="w-[18px] h-[18px]" /></Button>
                            </Link>
                            <Input
                                placeholder="Tìm kiếm khoá học ..."
                                value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
                                onChange={(event) =>
                                    table.getColumn("name")?.setFilterValue(event.target.value)
                                }
                                className="max-w-sm bg-transparent"
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
        </div >
    );
};

export default CourseManager;

// Course(id, created_by, name, description, class_name, join_key, slug, created_at, thumbnail, members, publish, units)
export type Course = {
    id: string
    created_by: string
    name: string
    description: string
    class_name: string
    join_key: string
    slug: string
    created_at: string
    thumbnail: string
    members: string[]
    publish: boolean
    units: string[]
    author: object
}