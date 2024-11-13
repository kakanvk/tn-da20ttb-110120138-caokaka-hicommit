
import ReactDOMServer from 'react-dom/server';

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
import { ArrowUpDown, BarChartBig, ChevronDown, Ellipsis, Eye, ListFilter, MoreHorizontal, Pencil, Pin, PinOff, Plus, Trash2, UserRound, UserRoundPlus, UsersRound } from "lucide-react"

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
import toast from "react-hot-toast";
import { useLogin } from "@/service/LoginContext";
import { AlertDialogFooter } from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { deleteProblemByID, getProblemsForAdmin, updateLevel } from "@/service/API/Problem";
import { formatTimeAgo, timestampChange, timestampToDateTime } from "@/service/DateTimeService";

import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card"
import Loader2 from '@/components/ui/loader2';
import { deleteContestByID, getContestsForAdmin, togglePinnedContestByID, togglePublishContestByID, updatePublicContestByID } from '@/service/API/Contest';
import { Switch } from '@/components/ui/switch';
import { handleCopyText } from '@/service/UIService';
import ReactHtmlParser from "react-html-parser";
import moment from 'moment';

function transform(node: any) {
    if (node.name === 'figure' || node.name === 'table') {
        return null;
    }
}

// Contest(id, created_by, name, description, start_time, end_time, duration, problems, publish, public, join_key, slug, pinned)
export type Contest = {
    id: string
    created_by: string
    name: string
    description: string
    start_time: number
    end_time: number
    duration: number
    publish: boolean
    public: boolean
    join_key: string
    slug: string
    pinned: boolean
}

const labelArr = {
    name: "Tên cuộc thi",
    time: "Thời gian",
    duration: "Thời lượng",
    members: "Tham gia",
    public: "Trạng thái",
    slug: "Mã cuộc thi",
    creator: "Người tạo",
    publish: "Công bố",
    createdAt: "Ngày tạo",
    actions: "Hành động"
}

function ContestManager() {

    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
        id: false,
        createdAt: false,
        start_time: false,
        end_time: false,
        slug: false,
        pinned: false,
    });
    const [rowSelection, setRowSelection] = useState({});
    const [data, setData] = useState<Contest[]>([]);
    const [loading, setLoading] = useState(true);

    const getData = async () => {
        const problems = await getContestsForAdmin();
        console.log(problems);
        setData(problems);
        setLoading(false);
    }

    const handleUpdatePublish = async (_id: string) => {
        const response = await toast.promise(
            togglePublishContestByID(_id),
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

        console.log(response);
        getData();
    }

    const handleUpdatePinned = async (_id: string) => {
        const response = await toast.promise(
            togglePinnedContestByID(_id),
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

        console.log(response);
        getData();
    }

    const handleUpdatePublic = async (contest_id: string, status: boolean) => {
        await toast.promise(
            updatePublicContestByID(contest_id, status),
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

    const handleDeleteContest = async (problem_id: string) => {
        await toast.promise(
            deleteContestByID(problem_id),
            {
                loading: 'Đang xoá...',
                success: 'Xoá thành công',
                error: 'Xoá không thành công, hãy thử lại'
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

    const columns: ColumnDef<Contest>[] = [
        {
            accessorKey: "id",
            enableHiding: false,
        },
        {
            accessorKey: "start_time",
            enableHiding: false,
        },
        {
            accessorKey: "end_time",
            enableHiding: false,
        },
        {
            accessorKey: "slug",
            enableHiding: false,
        },
        {
            accessorKey: "pinned",
            enableHiding: false,
        },
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
            accessorKey: "name",
            header: ({ column }) => {
                return (
                    <div className="flex items-center gap-1">
                        <span className='text-nowrap'>Tên cuộc thi</span>
                    </div>
                )
            },
            cell: ({ row }) => (
                <div className='flex flex-col gap-2'>
                    <p className="line-clamp-2 font-medium">
                        <Badge variant="secondary" className="uppercase rounded-md bg-secondary/50 dark:bg-secondary/60 text-[12px] p-0.5 px-2 font-normal leading-5 cursor-pointer text-nowrap mr-1" onClick={() => handleCopyText(row.getValue("slug"))}>
                            {
                                row.getValue("pinned") ? <Pin className="size-[14px] mr-1 inline" /> : null
                            }
                            {row.getValue("slug")}
                        </Badge>
                        <Link to={`/admin/contests/${row.getValue("id")}`} className='leading-6 hover:text-primary'>{row.getValue("name")}</Link>
                    </p>
                    {
                        (row.getValue("start_time") as any) > moment(new Date().getTime()).unix() ?
                            <span className="italic text-amber-600 dark:text-amber-500 font-semibold dark:font-medium mb-1.5">
                                Sắp diễn ra
                            </span> :
                            (row.getValue("end_time") as any) > moment(new Date().getTime()).unix() ?
                                <span className="italic text-green-600 dark:text-green-500 font-semibold dark:font-medium">
                                    <span className="relative inline-flex h-2 w-2 mr-2.5">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                                    </span>
                                    Đang diễn ra
                                </span> :
                                <span className="italic text-red-500 font-semibold dark:font-medium">Đã kết thúc</span>
                    }
                </div>
            ),
        },
        {
            id: "time",
            header: () => {
                return (<div className="text-nowrap text-left">Thời gian</div>)
            },
            cell: ({ row }) => (
                <div className="flex justify-center flex-col gap-0.5">
                    <span className="text-xs opacity-60">Bắt đầu</span>
                    <p className="text-nowrap font-semibold dark:font-medium">
                        {timestampToDateTime(row.getValue("start_time") as any).date}
                        <i className="fa-solid fa-circle text-[3px] mx-1.5 opacity-40 -translate-y-1"></i>
                        <span className='text-green-600 dark:text-green-500 font-bold'>{timestampToDateTime(row.getValue("start_time") as any).time}</span>
                    </p>
                    <span className="text-xs opacity-60 mt-2">Kết thúc</span>
                    <p className="text-nowrap font-semibold dark:font-medium">
                        {timestampToDateTime(row.getValue("end_time") as any).date}
                        <i className="fa-solid fa-circle text-[3px] mx-1.5 opacity-40 -translate-y-1"></i>
                        <span className='text-green-600 dark:text-green-500 font-bold'>{timestampToDateTime(row.getValue("end_time") as any).time}</span>
                    </p>
                </div>
            )
        },
        {
            accessorKey: "duration",
            header: () => {
                return (<div className="text-nowrap text-left">Thời lượng</div>)
            },
            cell: ({ row }) => (
                <div className="flex justify-center items-start flex-col gap-1">
                    <span className="text-xs opacity-60">Làm bài trong</span>
                    <Badge variant="secondary" className="rounded-md bg-secondary/50 dark:bg-secondary/60 text-[12px] p-0.5 px-2 font-medium leading-5 cursor-pointer text-nowrap">
                        <span className="text-nowrap">
                            {timestampChange(row.getValue("duration") as any).hours > 0 && `${timestampChange(row.getValue("duration") as any).hours} giờ `}
                            {timestampChange(row.getValue("duration") as any).minutes > 0 && `${timestampChange(row.getValue("duration") as any).minutes} phút `}
                        </span>
                    </Badge>
                </div>
            )
        },
        {
            accessorKey: "creator",
            header: () => {
                return (<div className="text-nowrap w-8 flex justify-center"><UserRound className='size-4' /></div>)
            },
            cell: ({ row }) => (
                <div className="flex justify-center w-8">
                    <HoverCard openDelay={100}>
                        <HoverCardTrigger>
                            <img src={(row.getValue("creator") as any).avatar_url} className="size-6 rounded-full" />
                        </HoverCardTrigger>
                        <HoverCardContent className='flex items-center justify-between'>
                            <div className="flex items-center gap-2">
                                <img src={(row.getValue("creator") as any).avatar_url} className="size-8 rounded-full" />
                                <div className='flex flex-col'>
                                    <span className='text-xs opacity-70'>Tạo bởi</span>
                                    <span className="text-nowrap">
                                        {(row.getValue("creator") as any).username}
                                        {((row.getValue("creator") as any).role === "ADMIN" || (row.getValue("creator") as any).role === "TEACHER") && <i className="fa-solid fa-circle-check text-primary text-[10px] ml-1 -translate-y-[1px]"></i>}
                                    </span>
                                </div>
                            </div>
                            <Button size="sm" variant="secondary" className='h-7 text-xs'>{(row.getValue("creator") as any).role}</Button>
                        </HoverCardContent>
                    </HoverCard>
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
                        <UsersRound className='size-3 mr-2' />{row.getValue("members")}
                    </Badge>
                </div>
            )
        },
        {
            accessorKey: "public",
            header: ({ column }) => {
                return (
                    <div className="flex items-center gap-1">
                        <span>Trạng thái</span>
                    </div>
                )
            },
            cell: ({ row }) => {
                return (
                    <div className="font-medium">
                        <Select value={row.getValue("public") ? "PUBLIC" : "PRIVATE"} onValueChange={(value) => handleUpdatePublic(row.getValue("id"), value === "PUBLIC" ? true : false)}>
                            <SelectTrigger className="w-[130px] bg-transparent p-2 h-8 text-xs items-center">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="PUBLIC">Công khai</SelectItem>
                                <SelectItem value="PRIVATE">Riêng tư</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                )
            },
        },
        {
            accessorKey: "publish",
            header: () => {
                return (<div className="text-nowrap text-center">Công bố</div>)
            },
            cell: ({ row }) => (
                <div className="flex justify-center">
                    <Switch defaultChecked={row.getValue("publish")} className="scale-90" onCheckedChange={() => handleUpdatePublish(row.getValue("id"))} />
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
                                        {
                                            row.getValue("pinned") ?
                                                <DropdownMenuItem className="cursor-pointer" onClick={() => handleUpdatePinned(row.getValue("id"))}>
                                                    <PinOff className="size-[14px] mr-3" />Bỏ ghim
                                                </DropdownMenuItem>
                                                :
                                                <DropdownMenuItem className="cursor-pointer" onClick={() => handleUpdatePinned(row.getValue("id"))}>
                                                    <Pin className="size-[14px] mr-3" />Ghim
                                                </DropdownMenuItem>
                                        }
                                        <Link to={`/admin/contests/${row.getValue("id")}`} className="cursor-pointer">
                                            <DropdownMenuItem className="cursor-pointer">
                                                <BarChartBig className="size-[14px] mr-3" />Chi tiết
                                            </DropdownMenuItem>
                                        </Link>
                                        <Link to={`/admin/contests/${row.getValue("id")}/edit`} className="cursor-pointer">
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
                                        <DialogTitle>Xác nhận xoá cuộc thi này</DialogTitle>
                                    </DialogHeader>
                                    <DialogDescription>
                                        Sau khi xoá, cuộc thi này sẽ không thể khôi phục.
                                    </DialogDescription>
                                    <AlertDialogFooter className="mt-2">
                                        <DialogClose>
                                            <Button variant="ghost">
                                                Đóng
                                            </Button>
                                        </DialogClose>
                                        <DialogClose>
                                            <Button className="w-fit px-4" variant="destructive" onClick={() => handleDeleteContest(row.getValue("id"))}>
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
        <div className="ContestManager p-5 pl-2 flex flex-col gap-1">
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                            <Link to="/admin">Quản trị</Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        Quản lý cuộc thi
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            <div>
                <div className="flex flex-col gap-5">
                    <div className="w-full">
                        <div className="flex items-center py-4 gap-3 justify-end">
                            <p className="flex-1 text-lg pt-2">
                                <span className="font-semibold">Danh sách cuộc thi</span>
                                <Badge variant="secondary" className="px-1.5 rounded-sm ml-2 inline">
                                    {data.length}
                                </Badge>
                            </p>
                            <Link to="create">
                                <Button size="icon"><Plus className="w-[18px] h-[18px]" /></Button>
                            </Link>
                            <Input
                                placeholder="Tìm kiếm cuộc thi ..."
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

export default ContestManager;