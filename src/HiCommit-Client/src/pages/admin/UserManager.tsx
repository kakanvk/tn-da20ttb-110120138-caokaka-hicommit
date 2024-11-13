
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
import { ArrowUpDown, ChevronDown, MoreHorizontal, Pencil, Plus, Trash2, UserRoundPlus } from "lucide-react"

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

function UserManager() {

    const loginContext = useLogin();

    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
        id: false,
        avatar_url: false,
    });
    const [rowSelection, setRowSelection] = useState({});
    const [data, setData] = useState<User[]>([]);

    const getData = async () => {
        const users = await getUsers();
        // console.log(users);
        const currentUser = users.find((user: any) => user.id === loginContext.user?.id);
        users.splice(users.indexOf(currentUser), 1);
        users.unshift(currentUser);
        setData(users);
    }

    const handleUpdateRole = async (userId: string, role: string) => {
        await toast.promise(
            updateRole(userId, role),
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

    const handleUpdateStatus = async (userId: string, status: string) => {
        await toast.promise(
            updateStatus(userId, status),
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
            accessorKey: "username",
            header: ({ column }) => {
                return (
                    <div className="flex items-center gap-1">
                        <span>Username</span>
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
                    <span className="lowercase">{row.getValue("username")}</span>
                    {
                        loginContext.user?.id === row.getValue("id") &&
                        <span className="ml-1 text-primary italic">(Bạn)</span>
                    }
                </div>
            ),
        },
        {
            accessorKey: "id",
            enableHiding: false,
        },
        {
            accessorKey: "avatar_url",
            enableHiding: false,
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
            accessorKey: "role",
            header: ({ column }) => {
                return (
                    <div className="flex items-center gap-1">
                        <span>Phân quyền</span>
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
                        <Select value={row.getValue("role")} onValueChange={(value) => handleUpdateRole(row.getValue("id"), value)} disabled={loginContext.user?.id === row.getValue("id")}>
                            <SelectTrigger className="w-[130px] bg-transparent p-2 h-8 text-xs items-center">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="ADMIN">ADMIN</SelectItem>
                                <SelectItem value="TEACHER">TEACHER</SelectItem>
                                <SelectItem value="STUDENT">STUDENT</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                )
            },
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
                        <Select value={row.getValue("status")} onValueChange={(value) => handleUpdateStatus(row.getValue("id"), value)} disabled={loginContext.user?.id === row.getValue("id")}>
                            <SelectTrigger className="w-[130px] bg-transparent p-2 h-8 text-xs items-center">
                                <div>
                                    <SelectValue />
                                    {row.getValue("status") === "ACTIVE" && <i className="fa-solid fa-circle text-[4px] ml-1.5 text-green-600 dark:text-green-500 -translate-y-[3px]"></i>}
                                    {row.getValue("status") === "INACTIVE" && <i className="fa-solid fa-circle text-[4px] ml-1.5 text-red-600 dark:text-red-500 -translate-y-[3px]"></i>}
                                </div>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="ACTIVE">Hoạt động</SelectItem>
                                <SelectItem value="INACTIVE">Tạm khoá</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                )
            },
        },
        {
            id: "actions",
            enableHiding: false,
            header: () => <div className="text-center">Hành động</div>,
            cell: ({ row }) => {
                return (
                    <div className="m-auto">
                        <div className='flex items-center justify-center gap-2'>
                            <Link to={``} className='cursor-pointer'>
                                <Button variant="secondary" size="icon" className="w-8 h-8 border border-black/10 dark:border-white/10">
                                    <Pencil className="w-[14px]" />
                                </Button>
                            </Link>
                            {/* <Dialog>
                                <DialogTrigger asChild>
                                    <Button variant="destructive" size="icon" className="w-8 h-8">
                                        <Trash2 className="w-[14px]" />
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Xác nhận xoá người dùng này</DialogTitle>
                                    </DialogHeader>
                                    <DialogDescription>
                                        Sau khi xoá, bài viết này sẽ không thể khôi phục.
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
                            </Dialog> */}
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
        <div className="UserManager p-5 pl-2 flex flex-col gap-1">
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                            <Link to="/admin">Quản trị</Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        Quản lý người dùng
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            <div>
                <div className="flex flex-col gap-5">
                    <div className="w-full">
                        <div className="flex items-center py-4 gap-3 justify-end">
                            <p className="flex-1 text-lg pt-2">
                                <span className="font-semibold">Danh sách người dùng</span>
                                <Badge variant="secondary" className="px-1.5 rounded-sm ml-2 inline">
                                    {data.length}
                                </Badge>
                            </p>
                            <Button size="icon"><UserRoundPlus className="w-[18px] h-[18px]" /></Button>
                            <Input
                                placeholder="Tìm kiếm người dùng ..."
                                value={(table.getColumn("username")?.getFilterValue() as string) ?? ""}
                                onChange={(event) =>
                                    table.getColumn("username")?.setFilterValue(event.target.value)
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
                                                    className="capitalize w-full"
                                                    checked={column.getIsVisible()}
                                                    onCheckedChange={(value) =>
                                                        column.toggleVisibility(!!value)
                                                    }
                                                >
                                                    {
                                                        column.id === "role" ? "Phân quyền" :
                                                            column.id === "status" ? "Trạng thái" :
                                                                column.id
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

export default UserManager;

// User(id, username, email, role, status, avatar_url, createdAt)
export type User = {
    id: string
    username: string
    email: string
    role: "ADMIN" | "TEACHER" | "STUDENT"
    status: "ACTIVE" | "INACTIVE"
    avatar_url: string
    createdAt: string
}