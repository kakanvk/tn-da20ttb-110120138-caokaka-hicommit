import ReactHtmlParser from "react-html-parser";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, ChevronRight, Eye, Filter, MoveRight, Plus, RotateCcw, Search, UsersRound, X } from "lucide-react";
import { Link } from "react-router-dom";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

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

import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip } from "@radix-ui/react-tooltip";
import { TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useEffect, useState } from "react";
import { getCreatedCourses } from "@/service/API/Course";
import { formatTimeAgo } from "@/service/DateTimeService";
import BlurFade from "@/components/magicui/blur-fade";

function transform(node: any) {
    if (node.name === 'figure' || node.name === 'table') {
        return null;
    }
}

function CourseManager() {

    const [createdCourses, setCreatedCourses] = useState<any[]>([]);
    const [filteredCourses, setFilteredCourses] = useState<any[]>([]);
    const [searchKeyword, setSearchKeyword] = useState<string>("");

    const handleGetCreatedCourse = async () => {
        try {
            const response = await getCreatedCourses();
            setCreatedCourses(response);
            setFilteredCourses(response);
            console.log(response);
        } catch (error) {
            console.error('Error getting post:', error);
        }
    };

    useEffect(() => {
        handleGetCreatedCourse();
    }, []);

    useEffect(() => {
        const filtered = createdCourses.filter((course) => {
            return course.name.toLowerCase().includes(searchKeyword.toLowerCase());
        });
        setFilteredCourses(filtered);
    }, [searchKeyword, createdCourses]);

    return (
        <div className="CourseManager p-7">
            <div className="flex flex-col gap-5 items-start">
                <Link to="create">
                    <Button className="w-fit pr-4" size="sm"><Plus className="w-4 mr-1.5 aspect-square" />Tạo khoá học mới</Button>
                </Link>
                <div className="flex flex-col gap-5 w-full relative">
                    <div className="-mx-7 px-7 sticky top-0 z-10 bg-white/60 dark:bg-zinc-950/50 backdrop-blur-xl">
                        <div className="py-2.5 flex items-center justify-between gap-4 border-b">
                            <div className="flex gap-2 items-center">
                                <h2 className="font-semibold text-lg">Tất cả khoá học</h2>
                                <div className="flex gap-2">
                                    <Badge variant="secondary" className="text-[11px] p-1 px-1.5 pl-2.5">
                                        DA20TTB
                                        <X className="w-4 h-4 ml-3 hover:bg-zinc-700 rounded-full p-[1px] duration-100 cursor-pointer" />
                                    </Badge>
                                    <Badge variant="secondary" className="text-[11px] p-1 px-1.5 pl-2.5">
                                        C++
                                        <X className="w-4 h-4 ml-3 hover:bg-zinc-700 rounded-full p-[1px] duration-100 cursor-pointer" />
                                    </Badge>
                                </div>
                                <Badge className="px-1.5 min-w-[22px] flex justify-center">{createdCourses.length}</Badge>
                                <TooltipProvider delayDuration={200}>
                                    <Tooltip>
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <TooltipTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="w-8 h-8">
                                                        <Filter className="w-4 aspect-square" />
                                                    </Button>
                                                </TooltipTrigger>
                                            </DialogTrigger>
                                            <DialogContent className="max-w-[350px] flex flex-col gap-6">
                                                <DialogHeader>
                                                    <DialogTitle>
                                                        Tuỳ chỉnh lọc
                                                    </DialogTitle>
                                                </DialogHeader>
                                                <DialogDescription className="flex flex-col gap-4">
                                                    <div className="flex flex-col gap-1.5">
                                                        <span>Ngôn ngữ lập trình</span>
                                                        <Select defaultValue="all">
                                                            <SelectTrigger className="bg-secondary" >
                                                                <SelectValue />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="all">Tất cả</SelectItem>
                                                                <SelectItem value="DA20TTB">C</SelectItem>
                                                                <SelectItem value="DA21TTB">C++</SelectItem>
                                                                <SelectItem value="DA21TTB">Java</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                    <div className="flex flex-col gap-1.5">
                                                        <span>Lớp học</span>
                                                        <Select defaultValue="all">
                                                            <SelectTrigger className="bg-secondary">
                                                                <SelectValue />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="all">Tất cả</SelectItem>
                                                                <SelectItem value="DA20TTB">DA20TTB</SelectItem>
                                                                <SelectItem value="DA21TTB">DA21TTB</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                    <div className="flex flex-col gap-1.5">
                                                        <span>Trạng thái khoá học</span>
                                                        <Select defaultValue="all">
                                                            <SelectTrigger className="bg-secondary">
                                                                <SelectValue />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="all">Tất cả</SelectItem>
                                                                <SelectItem value="DA20TTB">Chưa kết thúc</SelectItem>
                                                                <SelectItem value="DA21TTB">Đã kết thúc</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                </DialogDescription>
                                                <DialogFooter className="mt-3">
                                                    <div className="flex gap-2.5">
                                                        <DialogClose asChild>
                                                            <Button type="button" variant="secondary">
                                                                Đóng
                                                            </Button>
                                                        </DialogClose>
                                                        <Button>Lọc</Button>
                                                    </div>
                                                </DialogFooter>
                                            </DialogContent>
                                        </Dialog>
                                        <TooltipContent>
                                            Lọc
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </div>
                            <div className="relative max-w-[400px] flex-1">
                                <Search className="absolute left-3 top-[11px] h-4 w-4 text-muted-foreground" />
                                <Input
                                    type="search"
                                    placeholder="Tìm kiếm khoá học"
                                    className="w-full rounded-md pl-9 flex-1 bg-transparent"
                                    value={searchKeyword}
                                    onChange={(e) => setSearchKeyword(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    {
                        filteredCourses.length > 0 ?
                            <div className="grid grid-cols-1 lg:grid-cols-1 2xl:grid-cols-2 gap-4 w-full">
                                {
                                    filteredCourses.map((course, index) => (
                                        <BlurFade key={course?.id} delay={0.15 * index}>
                                            <Link className="flex rounded-lg gap-4 dark:bg-zinc-900 bg-zinc-100 p-4 px-5 border h-full" to={`${course?.id}`}>
                                                <div className="h-[120px] aspect-[3/2] border rounded-md bg-secondary/50 overflow-hidden">
                                                    <img src={course?.thumbnail} />
                                                </div>
                                                <div className="flex flex-col gap-2 flex-1 h-full justify-between pb-1">
                                                    <div className="flex flex-col gap-2 flex-1">
                                                        <h2 className="font-semibold line-clamp-2">
                                                            {
                                                                course.class_name &&
                                                                <Badge variant="default" className="rounded text-[9px] px-[5px] py-[1px] mr-2 -translate-y-[2.5px] font-bold">{course?.class_name}</Badge>
                                                            }
                                                            <span className="mr-2 text-[17px]">{course?.name}</span>
                                                            {
                                                                course.public &&
                                                                <Badge variant="outline" className="text-[11.5px] p-0 px-2 pr-3 font-normal leading-5">
                                                                    <Eye className="h-3 w-3 mr-1.5" />Công khai
                                                                </Badge>
                                                            }
                                                        </h2>
                                                        <p
                                                            className="opacity-70 dark:opacity-50 text-sm dark:font-light text-xs line-clamp-2"
                                                        >
                                                            {ReactHtmlParser(course?.description, { transform })}
                                                        </p>
                                                    </div>
                                                    <div className="w-full flex items-end justify-between">
                                                        <div className="flex gap-2 items-center">
                                                            <Badge variant="secondary" className="text-[11px] p-1 px-3">
                                                                {course?.problem_count > 0 ? course?.problem_count : "Chưa có"} bài tập
                                                            </Badge>
                                                            <Badge variant="secondary" className="text-[11px] p-1 px-3">
                                                                <UsersRound className="h-3 w-3 mr-2" />{course?.members?.length || 123}
                                                            </Badge>
                                                            {
                                                                course?.publish &&
                                                                <Badge className="text-[11px] p-1 px-3">
                                                                    <Check className="w-3.5 h-3.5 mr-1.5" />Đã công bố
                                                                </Badge>
                                                            }
                                                        </div>
                                                        <span className="text-[11px] opacity-60 font-light">Được tạo {formatTimeAgo(course?.createdAt, "vi")}</span>
                                                    </div>
                                                </div>
                                            </Link>
                                        </BlurFade>
                                    ))
                                }
                            </div>
                            :
                            <div className="flex flex-col items-center justify-center w-full mt-4">
                                <span className="">
                                    Bạn chưa tạo khoá học nào. <Link to="create" className="text-green-500 font-bold">
                                        Tạo ngay<MoveRight className="w-5 h-5 inline ml-2" />
                                    </Link>
                                </span>
                            </div>
                    }
                </div>
            </div>
        </div>
    );
};

export default CourseManager;