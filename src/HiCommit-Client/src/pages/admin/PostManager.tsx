
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

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
import { AlignLeft, ArrowUpDown, BarChartBig, BookmarkCheck, Check, ChevronDown, Eye, MoreHorizontal, Pencil, Plus, Trash2 } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

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
import { activePost, deletePostById, getInActivePosts, getPostsForAdmin, togglePublish } from "@/service/API/Post";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { formatTimeAgo } from "@/service/DateTimeService";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import Loader2 from "@/components/ui/loader2";

// Post(id, title, created_by, description, content, slug, created_at, thumbnail, tags, publish, status)
export type Post = {
    id: string
    title: string
    author: Object
    description: string
    content: string
    slug: string
    created_at: string
    thumbnail: string
    tags: string[]
    publish: boolean
    status: "ACTIVE" | "INACTIVE"
}

function PostManager() {

    const loginContext = useLogin();

    const [data, setData] = useState<Post[]>([]);
    const [inActivePosts, setInActivePosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);

    const getData = async () => {
        const response = await getPostsForAdmin();
        console.log(response);
        setData(response);
    }

    const getPendingPosts = async () => {
        const response = await getInActivePosts();
        console.log(response);
        setInActivePosts(response);
    }

    useEffect(() => {
        Promise.all([getData(), getPendingPosts()])
            .then(() => setLoading(false))
            .catch(() => setLoading(false));
    }, []);

    return (
        <div className="PostManager p-5 pl-2 flex flex-col gap-4">
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                            <Link to="">Quản trị</Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        Quản lý bài viết
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            <div className="mt-4">
                <Tabs defaultValue="all" className="w-full">
                    <TabsList className="bg-transparent justify-start rounded-none pb-3 px-0 border-b-[2px] border-secondary/40 w-full">
                        <TabsTrigger
                            value="all"
                            className="px-1 border-b-2 border-b-transparent drop-shadow-none data-[state=active]:border-b-primary rounded-none bg-transparent data-[state=active]:bg-transparent duration-500"
                        >
                            <Button variant="ghost" size="sm" className="hover:bg-secondary/60">
                                Đã duyệt
                                <Badge variant="secondary" className="px-1.5 rounded-sm ml-2">
                                    {data.length}
                                </Badge>
                            </Button>
                        </TabsTrigger>
                        <TabsTrigger
                            value="pending"
                            className="px-1 border-b-2 border-b-transparent drop-shadow-none data-[state=active]:border-b-primary rounded-none bg-transparent data-[state=active]:bg-transparent duration-500"
                        >
                            <Button variant="ghost" size="sm" className="hover:bg-secondary/60">
                                Đang chờ duyệt
                                <Badge variant="secondary" className="px-1.5 rounded-sm ml-2">
                                    {inActivePosts.length}
                                </Badge>
                            </Button>
                        </TabsTrigger>
                    </TabsList>
                    <TabsContent value="all" className="w-full">
                        <ActiveTab data={data} refresh={getData} loading={loading} />
                    </TabsContent>
                    <TabsContent value="pending" className="w-full">
                        <InActiveTab data={inActivePosts} refresh={getPendingPosts} refreshActiveTab={getData} loading={loading} />
                    </TabsContent>
                </Tabs>
            </div>
        </div >
    );
};

export default PostManager;

function ActiveTab(props: any) {

    const { data, refresh, loading } = props;

    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
        id: false,
        thumbnail: false,
        description: false,
        content: false,
    });
    const [rowSelection, setRowSelection] = useState({});

    const handleTogglePublish = async (id: string) => {
        await toast.promise(
            togglePublish(id),
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
        refresh();
    }

    const labelArr = {
        title: "Bài viết",
        publish: "Công bố",
        author: "Tác giả",
        createdAt: "Ngày tạo",
        tags: "Tags",
        actions: "Hành động"
    }

    const columns: ColumnDef<Post>[] = [
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
            accessorKey: "title",
            header: ({ column }) => {
                return <div className="ml-2">Bài viết</div>
            },
            cell: ({ row }) => (
                <div className="flex items-start gap-1 ml-2 max-w-[800px]">
                    <img src={row.getValue("thumbnail")} className="w-[120px] rounded-lg inline mr-2 border" />
                    <div className="flex flex-col gap-2">
                        <h4 className="font-medium line-clamp-2">{row.getValue("title")}</h4>
                        <p className="text-xs opacity-50 line-clamp-2 dark:font-light">{row.getValue("description")}</p>
                    </div>
                </div>
            ),
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
            accessorKey: "content",
            enableHiding: false,
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
            accessorKey: "tags",
            header: () => { return (<div>Tags</div>) },
            cell: ({ row }) => (
                <div className="flex flex-wrap gap-2 max-w-[250px]">
                    {(row.getValue("tags") as any)?.map((tag: any) => (
                        <Badge key={tag} variant="secondary" className="bg-secondary/50 dark:bg-secondary/60 text-[12px] p-0.5 px-3 font-normal leading-5 cursor-pointer text-nowrap">{tag}</Badge>
                    ))}
                </div>
            ),
        },
        {
            accessorKey: "publish",
            header: () => {
                return (<div className="text-nowrap text-center">Công bố</div>)
            },
            cell: ({ row }) => (
                <div className="flex justify-center">
                    <Switch defaultChecked={row.getValue("publish")} className="scale-90" onCheckedChange={() => handleTogglePublish(row.getValue("id"))} />
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
            header: () => <div className="text-nowrap">Hành động</div>,
            cell: ({ row }) => {
                return (
                    <div className="m-auto">
                        <div className='flex items-center justify-center gap-2'>
                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button variant="secondary" size="icon" className="w-8 h-8 border border-black/10 dark:border-white/10">
                                        <Eye className="w-[14px]" />
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-[1000px] 2xl:max-w-[1200px]">
                                    <DialogHeader>
                                        <DialogTitle>Xem trước bài viết</DialogTitle>
                                    </DialogHeader>
                                    <div className="h-[400px] 2xl:h-[600px] overflow-auto rounded-md border p-7 px-8">
                                        <div className="flex-1 flex gap-4 border-b-[1.5px] pb-5">
                                            <div className="flex flex-col gap-1 flex-1">
                                                <div className="flex gap-2 items-center text-sm">
                                                    <span className="opacity-70">Đăng bởi</span>
                                                    <Avatar className="w-6 h-6">
                                                        <AvatarImage className="w-full h-full rounded-full" src={(row.getValue("author") as any).avatar_url} />
                                                    </Avatar>
                                                    <p className="font-bold text-[15px]">
                                                        {(row.getValue("author") as any).username}
                                                        {((row.getValue("author") as any).role === "ADMIN" || (row.getValue("author") as any).role === "TEACHER") && <i className="fa-solid fa-circle-check text-[10px] text-primary ml-1.5 -translate-y-[1px]"></i>}
                                                    </p>
                                                    <p className="opacity-70 flex items-center gap-3 ml-2"><i className="fa-solid fa-circle text-[3px]"></i>{formatTimeAgo((row.getValue("createdAt") as any), "vi")}</p>
                                                </div>
                                                <h1 className="text-3xl font-bold">{(row.getValue("title") as any)}</h1>
                                                <div className="flex gap-2 mt-3">
                                                    <span className="text-sm opacity-80 translate-y-[2px]">
                                                        <BookmarkCheck className="w-4 h-4 inline mr-1 text-green-600 dark:text-green-500" />
                                                        Chủ đề:
                                                    </span>
                                                    {(row.getValue("tags") as any).map((tag: any, index: number) => (
                                                        <Badge key={tag} variant="secondary" className="border- bg-secondary/50 dark:bg-secondary/60 text-[12px] p-0.5 px-3 font-normal leading-5 cursor-pointer">{tag}</Badge>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="h-[120px] aspect-[3/2] overflow-hidden border rounded-lg">
                                                <img src={(row.getValue("thumbnail") as any)} alt="avatar" className="w-full h-full object-cover" />
                                            </div>
                                        </div>
                                        <div
                                            className="ck-content hicommit-content leading-7 text-justify flex-1 mt-5"
                                            dangerouslySetInnerHTML={{ __html: row.getValue("content") }}
                                        />
                                    </div>
                                    <DialogFooter className="mt-2">
                                        <DialogClose asChild>
                                            <Button variant="secondary">
                                                Đóng
                                            </Button>
                                        </DialogClose>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                            <Link to={`${row.getValue("id")}/edit`} className='cursor-pointer'>
                                <Button variant="secondary" size="icon" className="w-8 h-8 border border-black/10 dark:border-white/10">
                                    <Pencil className="w-[14px]" />
                                </Button>
                            </Link>
                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button variant="destructive" size="icon" className="w-8 h-8">
                                        <Trash2 className="w-[14px]" />
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Xác nhận xoá bài viết này</DialogTitle>
                                    </DialogHeader>
                                    <DialogDescription>
                                        Sau khi xoá, bài viết này sẽ không thể khôi phục.
                                    </DialogDescription>
                                    <DialogFooter className="mt-2">
                                        <DialogClose>
                                            <Button variant="ghost">
                                                Đóng
                                            </Button>
                                        </DialogClose>
                                        <DialogClose>
                                            <Button className="w-fit px-4" variant="destructive" onClick={() => handleDeleltePost(row.getValue("id"))}>
                                                Xoá
                                            </Button>
                                        </DialogClose>
                                    </DialogFooter>
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

    const handleDeleltePost = async (id: string) => {
        await toast.promise(
            deletePostById(id),
            {
                loading: 'Đang cập nhật...',
                success: 'Xoá bài viết thành công',
                error: 'Xoá bài viết không thành công, hãy thử lại'
            },
            {
                style: {
                    borderRadius: '8px',
                    background: '#222',
                    color: '#fff',
                    paddingLeft: '15px',
                    fontFamily: 'Plus Jakarta Sans',
                    maxWidth: '400px'
                }
            });
        refresh();
    }

    return (
        <div className="relative mt-4">
            <div className="flex items-center gap-2 justify-end absolute -top-16 right-0">
                <Link to="create" className="cursor-pointer">
                    <Button className="pl-3"><Plus className="w-[18px] h-[18px] mr-1.5" />Tạo bài viết</Button>
                </Link>
                <Input
                    placeholder="Tìm kiếm bài viết ..."
                    value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
                    onChange={(event) =>
                        table.getColumn("title")?.setFilterValue(event.target.value)
                    }
                    className="bg-transparent w-[300px] 2xl:w-[400px]"
                />
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="justify-between w-[180px] bg-transparent pr-3">
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
            <div className="rounded-lg border overflow-hidden">
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
    )
}

function InActiveTab(props: any) {

    const { data, refresh, refreshActiveTab } = props;

    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
        id: false,
        thumbnail: false,
        description: false,
        content: false,
    });
    const [rowSelection, setRowSelection] = useState({});

    const handleActivePost = async (id: string) => {
        await toast.promise(
            activePost(id),
            {
                loading: 'Đang cập nhật...',
                success: 'Duyệt thành công',
                error: 'Duyệt không thành công, hãy thử lại'
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
        refreshActiveTab();
    }

    const labelArr = {
        title: "Bài viết",
        publish: "Công bố",
        author: "Tác giả",
        createdAt: "Ngày tạo",
        tags: "Tags",
        actions: "Hành động"
    }

    const columns: ColumnDef<Post>[] = [
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
            accessorKey: "title",
            header: ({ column }) => {
                return <div className="ml-2">Bài viết</div>
            },
            cell: ({ row }) => (
                <div className="flex items-start gap-1 ml-2 max-w-[800px]">
                    <img src={row.getValue("thumbnail")} className="w-[120px] rounded-lg inline mr-2 border" />
                    <div className="flex flex-col gap-2">
                        <h4 className="font-medium line-clamp-2">{row.getValue("title")}</h4>
                        <p className="text-xs opacity-50 line-clamp-2 dark:font-light">{row.getValue("description")}</p>
                    </div>
                </div>
            ),
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
            accessorKey: "content",
            enableHiding: false,
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
            accessorKey: "tags",
            header: () => { return (<div>Tags</div>) },
            cell: ({ row }) => (
                <div className="flex flex-wrap gap-2 max-w-[250px]">
                    {(row.getValue("tags") as any)?.map((tag: any) => (
                        <Badge key={tag} variant="secondary" className="bg-secondary/50 dark:bg-secondary/60 text-[12px] p-0.5 px-3 font-normal leading-5 cursor-pointer text-nowrap">{tag}</Badge>
                    ))}
                </div>
            ),
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
            header: () => <div className="text-nowrap">Hành động</div>,
            cell: ({ row }) => {
                return (
                    <div className="m-auto">
                        <div className='flex items-center justify-center gap-2'>
                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button variant="destructive" size="icon" className="w-8 h-8">
                                        <Trash2 className="w-[14px]" />
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Xác nhận xoá bài viết này</DialogTitle>
                                    </DialogHeader>
                                    <DialogDescription>
                                        Sau khi xoá, bài viết này sẽ không thể khôi phục.
                                    </DialogDescription>
                                    <DialogFooter className="mt-2">
                                        <DialogClose>
                                            <Button variant="ghost">
                                                Đóng
                                            </Button>
                                        </DialogClose>
                                        <DialogClose>
                                            <Button className="w-fit px-4" variant="destructive" onClick={() => handleDeleltePost(row.getValue("id"))}>
                                                Xoá
                                            </Button>
                                        </DialogClose>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button variant="secondary" size="icon" className="w-8 h-8 border border-black/10 dark:border-white/10">
                                        <Eye className="w-[14px]" />
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-[1000px] 2xl:max-w-[1200px]">
                                    <DialogHeader>
                                        <DialogTitle>Xem trước bài viết</DialogTitle>
                                    </DialogHeader>
                                    <div className="h-[400px] 2xl:h-[600px] overflow-auto rounded-md border p-7 px-8">
                                        <div className="flex-1 flex gap-4 border-b-[1.5px] pb-5">
                                            <div className="flex flex-col gap-1 flex-1">
                                                <div className="flex gap-2 items-center text-sm">
                                                    <span className="opacity-70">Đăng bởi</span>
                                                    <Avatar className="w-6 h-6">
                                                        <AvatarImage className="w-full h-full rounded-full" src={(row.getValue("author") as any).avatar_url} />
                                                    </Avatar>
                                                    <p className="font-bold text-[15px]">
                                                        {(row.getValue("author") as any).username}
                                                        {((row.getValue("author") as any).role === "ADMIN" || (row.getValue("author") as any).role === "TEACHER") && <i className="fa-solid fa-circle-check text-[10px] text-primary ml-1.5 -translate-y-[1px]"></i>}
                                                    </p>
                                                    <p className="opacity-70 flex items-center gap-3 ml-2"><i className="fa-solid fa-circle text-[3px]"></i>{formatTimeAgo((row.getValue("createdAt") as any), "vi")}</p>
                                                </div>
                                                <h1 className="text-3xl font-bold">{(row.getValue("title") as any)}</h1>
                                                <div className="flex gap-2 mt-3">
                                                    <span className="text-sm opacity-80 translate-y-[2px]">
                                                        <BookmarkCheck className="w-4 h-4 inline mr-1 text-green-600 dark:text-green-500" />
                                                        Chủ đề:
                                                    </span>
                                                    {(row.getValue("tags") as any).map((tag: any, index: number) => (
                                                        <Badge key={tag} variant="secondary" className="border- bg-secondary/50 dark:bg-secondary/60 text-[12px] p-0.5 px-3 font-normal leading-5 cursor-pointer">{tag}</Badge>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="h-[120px] aspect-[3/2] overflow-hidden border rounded-lg">
                                                <img src={(row.getValue("thumbnail") as any)} alt="avatar" className="w-full h-full object-cover" />
                                            </div>
                                        </div>
                                        <div
                                            className="ck-content hicommit-content leading-7 text-justify flex-1 mt-5"
                                            dangerouslySetInnerHTML={{ __html: row.getValue("content") }}
                                        />
                                    </div>
                                    <DialogFooter className="mt-2">
                                        <DialogClose asChild>
                                            <Button variant="secondary">
                                                Đóng
                                            </Button>
                                        </DialogClose>
                                        <DialogClose asChild>
                                            <Button onClick={() => handleActivePost(row.getValue("id"))}>
                                                Duyệt bài viết này
                                            </Button>
                                        </DialogClose>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button size="icon" className="w-8 h-8">
                                        <Check className="w-[17px]" />
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Xác nhận duyệt bài viết này</DialogTitle>
                                    </DialogHeader>
                                    <DialogDescription>
                                        Sau khi duyệt, người dùng có thể xem được bài viết này.
                                    </DialogDescription>
                                    <DialogFooter className="mt-2">
                                        <DialogClose>
                                            <Button variant="ghost">
                                                Đóng
                                            </Button>
                                        </DialogClose>
                                        <DialogClose>
                                            <Button className="w-fit px-4" onClick={() => handleActivePost(row.getValue("id"))}>
                                                Duyệt bài viết này
                                            </Button>
                                        </DialogClose>
                                    </DialogFooter>
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

    const handleDeleltePost = async (id: string) => {
        await toast.promise(
            deletePostById(id),
            {
                loading: 'Đang cập nhật...',
                success: 'Xoá bài viết thành công',
                error: 'Xoá bài viết không thành công, hãy thử lại'
            },
            {
                style: {
                    borderRadius: '8px',
                    background: '#222',
                    color: '#fff',
                    paddingLeft: '15px',
                    fontFamily: 'Plus Jakarta Sans',
                    maxWidth: '400px'
                }
            });
        refresh();
    }

    return (
        <div className="relative mt-4">
            <div className="flex items-center gap-2 justify-end absolute -top-16 right-0">
                <Link to="create" className="cursor-pointer">
                    <Button className="pl-3"><Plus className="w-[18px] h-[18px] mr-1.5" />Tạo bài viết</Button>
                </Link>
                <Input
                    placeholder="Tìm kiếm bài viết ..."
                    value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
                    onChange={(event) =>
                        table.getColumn("title")?.setFilterValue(event.target.value)
                    }
                    className="bg-transparent w-[300px] 2xl:w-[400px]"
                />
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="justify-between w-[180px] bg-transparent pr-3">
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
            <div className="rounded-lg border overflow-hidden">
                <Table>
                    {
                        data.length > 0 &&
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
                    }
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
                                    {
                                        data.length === 0 ?
                                            "Không có bài viết nào chờ duyệt." :
                                            "Không có kết quả phù hợp."
                                    }
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
    )
}