
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, ChevronDown, ChevronsUpDown, ChevronUp, KeyRound, Plus, Upload, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import Editor from "@/components/ui/editor";

import toast from "react-hot-toast";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

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

import { ScrollArea } from "@/components/ui/scroll-area";
import moment from "moment";
import { combineDateAndTimeToTimestamp } from "@/service/DateTimeService";
import { createContest, getContestByIDForAdmin, updateContestByID } from "@/service/API/Contest";
import Loader2 from "@/components/ui/loader2";
import Loader from "@/components/ui/loader";

function EditContest() {

    const navigate = useNavigate();

    const { id } = useParams<{ id: string }>();

    // Mặc định ngày bắt đầu là ngày mai
    const [startDate, setStartDate] = useState<Date>();
    const [startTime, setStartTime] = useState<string>();

    const [duration, setDuration] = useState<{ hours: number, minutes: number }>({
        hours: 2,
        minutes: 0
    });

    const [name, setName] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [slug, setSlug] = useState<string>('');

    const [checkSlugEdited, setCheckSlugEdited] = useState<boolean>(false);

    const [isPublic, setIsPublic] = useState(true);
    const [enrolKey, setEnrolKey] = useState("");

    const [contest, setContest] = useState<any>();
    const [loading, setLoading] = useState(true);

    const getData = async () => {
        setLoading(true);
        const response = await getContestByIDForAdmin(id as any);
        console.log(response);
        setName(response.name);
        setDescription(response.description);
        setSlug(response.slug);
        setStartDate(new Date(response.start_time * 1000));
        setStartTime(moment(response.start_time * 1000).format("HH:mm"));
        setDuration({
            hours: Math.floor(response.duration / 3600),
            minutes: Math.floor((response.duration % 3600) / 60)
        });
        setIsPublic(!response.public);
        setEnrolKey(response.join_key);
        setIsPublic(response.public);
        setLoading(false);
    }

    useEffect(() => {
        getData();
    }, []);

    const handleChangePublicCourse = () => {
        setIsPublic(!isPublic);
    }

    const handleAutoFillSlug = (e: any) => {

        if (checkSlugEdited) {
            return;
        }

        const new_slug = e.target.value.trim().toLowerCase().replace(/ /g, '-');

        setSlug(new_slug);
    }

    const handleUpdateContest = async () => {

        // kiểm tra nếu !isPublic mà enrolKey rỗng thì báo lỗi
        if (!isPublic && (!enrolKey || enrolKey.trim() === '')) {
            toast.error('Mật khẩu tham gia không được để trống',
                {
                    style: {
                        borderRadius: '8px',
                        background: '#222',
                        color: '#fff',
                        paddingLeft: '15px',
                        fontFamily: 'Plus Jakarta Sans',
                        maxWidth: '600px',
                    }
                });
            return;
        }

        const data = {
            name,
            description,
            slug,
            start_time: combineDateAndTimeToTimestamp(startDate as any, startTime as any),
            end_time: combineDateAndTimeToTimestamp(startDate as any, startTime as any) + duration.hours * 60 * 60 + duration.minutes * 60,
            duration: duration.hours * 60 * 60 + duration.minutes * 60,
            public: isPublic,
            join_key: enrolKey
        }

        console.log(data);

        const response = await toast.promise(
            updateContestByID(id as any, data),
            {
                loading: 'Đang cập nhật cuộc thi...',
                success: 'Cập nhật cuộc thi thành công',
                error: 'Cập nhật cuộc thi không thành công, hãy thử lại'
            },
            {
                style: {
                    borderRadius: '8px',
                    background: '#222',
                    color: '#fff',
                    paddingLeft: '15px',
                    fontFamily: 'Plus Jakarta Sans',
                    maxWidth: '600px',
                }
            });

        setTimeout(() => {
            navigate('/admin/contests');
        }, 500);
    }

    const handleCancelUpdate = () => {
        toast.error('Đã huỷ cập nhật',
            {
                style: {
                    borderRadius: '8px',
                    background: '#222',
                    color: '#fff',
                    paddingLeft: '15px',
                    fontFamily: 'Plus Jakarta Sans',
                }
            });
        navigate(`/admin/contests`);
    }

    return (
        <>
            {
                loading ?
                    <Loader /> :
                    <div className="EditContest p-5 pl-2 flex flex-col gap-8 pb-10">
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem>
                                    Quản trị
                                </BreadcrumbItem>
                                <BreadcrumbSeparator />
                                <BreadcrumbItem>
                                    <BreadcrumbLink asChild>
                                        <Link to="/admin/contests">Quản lý cuộc thi</Link>
                                    </BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator />
                                <BreadcrumbItem>
                                    Chỉnh sửa cuộc thi
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                        <div className="flex flex-col gap-14">
                            <div className="flex flex-col gap-6">
                                <h1 className="font-bold text-xl after:content-['*'] after:ml-1 after:text-green-500">
                                    1. Thông tin cơ bản
                                </h1>
                                <div className="flex gap-2 flex-col">
                                    <h4 className="font-medium after:content-['*'] after:ml-1 after:text-green-500">Tên cuộc thi</h4>
                                    <Input
                                        placeholder="Nhập tiêu đề bài viết"
                                        className="placeholder:italic bg-secondary/20"
                                        spellCheck="false"
                                        value={name}
                                        onChange={(e) => {
                                            setName(e.target.value);
                                            handleAutoFillSlug(e)
                                        }}
                                        onInput={(e) => handleAutoFillSlug(e)}
                                    />
                                </div>
                                <div className="flex gap-2 flex-col">
                                    <h4 className="font-medium after:content-['*'] after:ml-1 after:text-green-500">Mã cuộc thi</h4>
                                    <Input
                                        placeholder="Nhập mã cuộc thi"
                                        className="placeholder:italic bg-secondary/20"
                                        value={slug}
                                        spellCheck="false"
                                        onChange={(e) => {
                                            setSlug(e.target.value);
                                            if (e.target.value.trim() === '') {
                                                setCheckSlugEdited(false);
                                            } else setCheckSlugEdited(true);
                                        }}
                                    />
                                </div>
                                <div className="flex gap-2 flex-col">
                                    <h4 className="font-medium after:content-['*'] after:ml-1 after:text-green-500">Mô tả cuộc thi</h4>
                                    <Editor
                                        value={description}
                                        onChange={(event: any, editor: any) => {
                                            const data = editor.getData();
                                            setDescription(data);
                                        }}
                                        placeholder="Nhập nội dung bài viết"
                                    />
                                </div>
                            </div>
                            <div className="flex flex-col gap-6">
                                <h1 className="font-bold text-xl after:content-['*'] after:ml-1 after:text-green-500">2. Thông tin chi tiết</h1>
                                <div className="flex gap-2 flex-col">
                                    <h4 className="font-medium after:content-['*'] after:ml-1 after:text-green-500">Thời gian bắt đầu</h4>
                                    <div className="flex gap-2">
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant={"outline"}
                                                    className={cn(
                                                        "w-[280px] justify-start text-left font-normal bg-secondary/20 hover:bg-secondary/50",
                                                        !startDate && "text-muted-foreground"
                                                    )}
                                                >
                                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                                    {startDate ? moment(startDate).format("DD [tháng] MM, YYYY") : <span className="italic">Chọn ngày bắt đầu</span>}
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0">
                                                <Calendar
                                                    mode="single"
                                                    selected={startDate}
                                                    // Kiểm tra ngày kết thúc phải sau ngày bắt đầu
                                                    onSelect={(date) => {
                                                        if (combineDateAndTimeToTimestamp(date as any, startTime as any) < moment(new Date()).unix()) {
                                                            toast.error("Không được chọn thời điểm trong quá khứ", {
                                                                style: {
                                                                    borderRadius: '8px',
                                                                    background: '#222',
                                                                    color: '#fff',
                                                                    paddingLeft: '15px',
                                                                    fontFamily: 'Plus Jakarta Sans',
                                                                    maxWidth: '400px',
                                                                }
                                                            });
                                                            return;
                                                        }
                                                        setStartDate(date as any);
                                                    }}
                                                    initialFocus
                                                />
                                            </PopoverContent>
                                        </Popover>
                                        <Select
                                            value={startTime!}
                                            onValueChange={(e) => {
                                                if (combineDateAndTimeToTimestamp(startDate as any, e) < moment(new Date()).unix()) {
                                                    toast.error("Không được chọn thời điểm trong quá khứ", {
                                                        style: {
                                                            borderRadius: '8px',
                                                            background: '#222',
                                                            color: '#fff',
                                                            paddingLeft: '15px',
                                                            fontFamily: 'Plus Jakarta Sans',
                                                            maxWidth: '400px',
                                                        }
                                                    });
                                                    return;
                                                }
                                                setStartTime(e);
                                            }}
                                        >
                                            <SelectTrigger className="font-normal w-[120px] bg-secondary/20 hover:bg-secondary/50">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <ScrollArea className="h-[15rem]">
                                                    {Array.from({ length: 96 }).map((_, i) => {
                                                        const hour = Math.floor(i / 4)
                                                            .toString()
                                                            .padStart(2, "0");
                                                        const minute = ((i % 4) * 15)
                                                            .toString()
                                                            .padStart(2, "0");
                                                        return (
                                                            <SelectItem key={i} value={`${hour}:${minute}`}>
                                                                {hour}:{minute}
                                                            </SelectItem>
                                                        );
                                                    })}
                                                </ScrollArea>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <div className="flex gap-2 flex-col">
                                    <h4 className="font-medium after:content-['*'] after:ml-1 after:text-green-500">Thời gian làm bài</h4>
                                    <div className="flex gap-2 items-center">
                                        <div className="relative flex items-center group/input">
                                            <Input className="w-[70px] bg-secondary/20" value={duration.hours.toString().padStart(2, "0")} readOnly />
                                            <div className="flex flex-col gap-0 absolute right-1 invisible group-hover/input:visible">
                                                <Button className="w-6 h-4 rounded" variant="ghost" size="icon" onClick={() => setDuration({ ...duration, hours: duration.hours + 1 })}>
                                                    <ChevronUp className="size-[14px]" />
                                                </Button>
                                                <Button className="w-6 h-4 rounded" variant="ghost" size="icon" onClick={() => setDuration({ ...duration, hours: Math.max(0, duration.hours - 1) })}>
                                                    <ChevronDown className="size-[14px]" />
                                                </Button>
                                            </div>
                                        </div>
                                        <span className="mx-1 opacity-50 italic">giờ</span>
                                        <div className="relative flex items-center group/input">
                                            <Input className="w-[70px] bg-secondary/20" value={duration.minutes.toString().padStart(2, "0")} readOnly />
                                            <div className="flex flex-col gap-0 absolute right-1 invisible group-hover/input:visible">
                                                <Button className="w-6 h-4 rounded" variant="ghost" size="icon" onClick={() => {
                                                    if (duration.minutes === 50) {
                                                        setDuration({ ...duration, hours: duration.hours + 1, minutes: 0 });
                                                    } else {
                                                        setDuration({ ...duration, minutes: duration.minutes + 10 })
                                                    }
                                                }}>
                                                    <ChevronUp className="size-[14px]" />
                                                </Button>
                                                <Button className="w-6 h-4 rounded" variant="ghost" size="icon" onClick={() => {
                                                    if (duration.minutes === 0) {
                                                        if (duration.hours === 0) {
                                                            setDuration({ ...duration, hours: 0, minutes: 0 });
                                                        } else {
                                                            setDuration({ ...duration, hours: duration.hours - 1, minutes: 50 });
                                                        }
                                                    } else {
                                                        setDuration({ ...duration, minutes: duration.minutes - 10 });
                                                    }
                                                }}>
                                                    <ChevronDown className="size-[14px]" />
                                                </Button>
                                            </div>
                                        </div>
                                        <span className="mx-1 opacity-50 italic">phút</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col gap-6">
                                <h1 className="font-bold text-xl after:content-['*'] after:ml-1 after:text-green-500">3. Cài đặt khác</h1>
                                <div className="flex flex-col gap-4 border p-4 px-5 w-[50%] min-w-[600px] rounded-md bg-secondary/20">
                                    <div className="flex gap-5 justify-between items-center">
                                        <Label className="flex-1 flex flex-col gap-1 cursor-pointer" htmlFor="public-course-switch">
                                            <h3 className="text-base">Cuộc thi riêng tư</h3>
                                            <p className="text-sm opacity-50 font-medium">Chỉ những ai có mật khẩu mới được tham gia cuộc thi này.</p>
                                        </Label>
                                        <Switch checked={!isPublic} onCheckedChange={handleChangePublicCourse} id="public-course-switch" />
                                    </div>
                                    {
                                        !isPublic &&
                                        <>
                                            <div className="relative">
                                                <KeyRound className="absolute left-3 top-[11px] h-4 w-4 text-muted-foreground ml-1" />
                                                <Input
                                                    type="search"
                                                    placeholder="Đặt mật khẩu tham gia"
                                                    className="w-full pl-11 bg-transparent"
                                                    value={enrolKey}
                                                    onChange={e => setEnrolKey(e.target.value)}
                                                />
                                            </div>
                                        </>
                                    }
                                </div>
                            </div>
                            <div className="mt-2 flex gap-3">
                                <Dialog>
                                    <DialogTrigger>
                                        <Button className="w-fit px-5" variant="secondary">
                                            <ArrowLeft className="size-4 mr-2" />
                                            Huỷ thay đổi
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>Huỷ cập nhật?</DialogTitle>
                                        </DialogHeader>
                                        <DialogDescription>
                                            Mọi thay đổi chưa được lưu lại, bạn có chắc muốn huỷ cập nhật.
                                        </DialogDescription>
                                        <DialogFooter className="mt-2">
                                            <DialogClose asChild>
                                                <Button variant="ghost">Tiếp tục chỉnh sửa</Button>
                                            </DialogClose>
                                            <Button variant="destructive" onClick={() => handleCancelUpdate()}>Huỷ cập nhật</Button>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
                                <Dialog>
                                    <DialogTrigger>
                                        <Button className="w-fit">Cập nhật cuộc thi</Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>Cập nhật cuộc thi này?</DialogTitle>
                                        </DialogHeader>
                                        <DialogDescription>
                                            Các thông tin đã chỉnh sửa sẽ được lưu lại.
                                        </DialogDescription>
                                        <DialogFooter className="mt-2">
                                            <DialogClose asChild>
                                                <Button variant="ghost">Tiếp tục chỉnh sửa</Button>
                                            </DialogClose>
                                            <DialogClose asChild>
                                                <Button onClick={() => handleUpdateContest()}>Cập nhật</Button>
                                            </DialogClose>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
                            </div>
                        </div>
                    </div >
            }
        </>
    );
};

export default EditContest;