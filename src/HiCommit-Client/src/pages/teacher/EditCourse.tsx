
import { AutosizeTextarea } from "@/components/ui/auto-resize-text-area";
import { Badge } from "@/components/ui/badge";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

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

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, KeyRound, MoveLeft, Plus, TriangleAlert, Upload, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

import Cropper from 'react-easy-crop';
import { se } from "date-fns/locale";
import Loader2 from "@/components/ui/loader2";

import getCroppedImg from "../client/cropImage";
import { set } from "date-fns";
import { createPost } from "@/service/API/Post";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { createCourse, getCourseByIDForAdmin, updateCourse } from "@/service/API/Course";
import toast from 'react-hot-toast';
import { DialogClose } from "@radix-ui/react-dialog";

import Editor from "@/components/ui/editor";

function EditCourse() {

    const { course_id } = useParams<{ course_id: string }>();

    const [course, setCourse] = useState<any>({});

    const navigate = useNavigate();

    const [name, setName] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [className, setClassName] = useState<string>('');
    const [slug, setSlug] = useState<string>('');
    const [thumbnail, setThumbnail] = useState<string>('');
    const [showCropModal, setShowCropModal] = useState<boolean>(false);

    const getCourseData = async () => {
        try {
            const data = await getCourseByIDForAdmin(course_id as any);
            setCourse(data);
            setName(data.name);
            setDescription(data.description);
            setClassName(data.class_name);
            setSlug(data.slug);
            setThumbnail(data.thumbnail);
        } catch (error) {
            console.error('Error fetching course:', error);
        }
    }

    useEffect(() => {
        getCourseData();
    }, []);

    // For image cropping
    const [uploadedImage, setUploadedImage] = useState<string>('');
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [rotation, setRotation] = useState(0);
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
    const [loadingImage, setLoadingImage] = useState(false);

    const handleUploadThumbnail = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = (e: any) => {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                // reset crop state
                setCrop({ x: 0, y: 0 });
                setRotation(0);
                setZoom(1);

                setUploadedImage(reader.result as string);
                setShowCropModal(true);

                setTimeout(() => {
                    setLoadingImage(true);
                }, 1000);
            }
        }
        input.click();
    }

    const showCroppedImage = async () => {
        try {
            const croppedImage = await getCroppedImg(
                uploadedImage,
                croppedAreaPixels,
                rotation
            )
            setThumbnail(croppedImage as any);
            setShowCropModal(false);
            setLoadingImage(false);
        } catch (e) {
            console.error(e)
        }
    }

    const onCropComplete = (croppedArea: any, croppedAreaPixels: any) => {
        setCroppedAreaPixels(croppedAreaPixels)
    }

    const handleUpdateCourse = async () => {

        const data = {
            name,
            description,
            slug,
            thumbnail,
            class_name: className
        }

        try {
            // Call createPost API
            const response = await toast.promise(
                updateCourse(course_id as any, data),
                {
                    loading: 'Đang lưu...',
                    success: 'Cập nhật khoá học thành công',
                    error: 'Cập nhật khoá học thất bại'
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
            // Chờ 1s rồi chuyển hướng
            navigate(`/course-manager/${course_id}`);

        } catch (error) {
            console.error('Error creating post:', error);
        }
    }

    const handleCancelUpdate = () => {
        toast.error('Đã huỷ cập nhật khoá học',
            {
                style: {
                    borderRadius: '8px',
                    background: '#222',
                    color: '#fff',
                    paddingLeft: '15px',
                    fontFamily: 'Plus Jakarta Sans',
                }
            });
        navigate(`/course-manager/${course_id}`);
    }

    return (
        <div className="CreatePost p-6 px-8 flex flex-col gap-8">
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                            <Link to="/course-manager">Quản lý khoá học</Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                            <Link to={`/course-manager/${course?.id}`}>{course?.name}</Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        Chỉnh sửa khoá học
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            <div className="flex flex-col gap-12">
                <div className="flex flex-col gap-6">
                    <h1 className="font-bold text-xl after:content-['*'] after:ml-1 after:text-green-500">
                        1. Thông tin cơ bản
                    </h1>
                    <div className="flex gap-2 flex-col">
                        <h4 className="font-medium after:content-['*'] after:ml-1 after:text-green-500">Tên khoá học</h4>
                        <Input
                            placeholder="Nhập tiêu đề khoá học"
                            className="placeholder:italic "
                            spellCheck={false}
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-2 flex-col">
                        <h4 className="font-medium after:content-['*'] after:ml-1 after:text-green-500">Mô tả khoá học</h4>
                        {/* <AutosizeTextarea
                            placeholder="Nhập mô tả khoá học"
                            className="placeholder:italic"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            spellCheck={false}
                        /> */}
                        {
                            course?.description &&
                            <Editor
                                value={description}
                                onChange={(event: any, editor: any) => {
                                    const data = editor.getData();
                                    setDescription(data);
                                }}
                                placeholder="Nhập nội dung mô tả"
                            />
                        }
                    </div>
                    <div className="flex gap-2 flex-col">
                        <h4 className="font-medium">Mã lớp</h4>
                        <Input
                            placeholder="Nhập mã lớp của khoá học này"
                            className="placeholder:italic "
                            spellCheck={false}
                            value={className}
                            onChange={(e) => {
                                setClassName(e.target.value)
                            }}
                        />
                    </div>
                </div>
                <div className="flex flex-col gap-12">
                    <div className="flex flex-col gap-6">
                        <h1 className="font-bold text-xl after:content-['*'] after:ml-1 after:text-green-500">
                            2. Thông tin chi tiết
                        </h1>
                        <div className="flex gap-2 flex-col">
                            <h4 className="font-medium after:content-['*'] after:ml-1 after:text-green-500">Tuỳ chỉnh đường dẫn (URL)</h4>
                            <Input
                                placeholder="Nhập đường dẫn tùy chỉnh"
                                className="placeholder:italic"
                                spellCheck={false}
                                value={slug}
                                onChange={(e) => {
                                    setSlug(e.target.value);
                                }}
                            />
                        </div>
                    </div>
                </div>
                <div className="flex flex-col gap-6">
                    <h1 className="font-bold text-xl after:content-['*'] after:ml-1 after:text-green-500">3. Khác</h1>
                    <div className="flex gap-2 flex-col">
                        <h4 className="font-medium after:content-['*'] after:ml-1 after:text-green-500">Ảnh minh hoạ</h4>
                        {
                            thumbnail ?
                                <div className="relative w-[250px] aspect-[3/2]">
                                    <img src={thumbnail} alt="Thumbnail" className="object-cover w-full h-full rounded-lg border-secondary/50 border" />
                                    <Button variant="secondary" size="icon" className="absolute top-2 right-2 rounded-full w-6 h-6" onClick={() => setThumbnail('')}>
                                        <X className="w-4 h-4" />
                                    </Button>
                                </div> :
                                <Button variant="secondary" className="w-fit px-5" onClick={() => handleUploadThumbnail()}>
                                    <Upload className="w-4 h-4 mr-2" />Tải lên hình ảnh
                                </Button>
                        }
                        <AlertDialog open={showCropModal}>
                            <AlertDialogContent className="max-w-[50%] min-w-[500px]">
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Điều chỉnh kích thước <span className="italic opacity-60 text-sm dark:font-light">(Tỉ lệ 3:2)</span></AlertDialogTitle>
                                </AlertDialogHeader>
                                <div className="relative aspect-[3/2] w-full">
                                    {
                                        loadingImage ?
                                            <Cropper
                                                image={uploadedImage}
                                                crop={crop}
                                                rotation={rotation}
                                                zoom={zoom}
                                                aspect={3 / 2}
                                                onCropChange={setCrop}
                                                onRotationChange={setRotation}
                                                onCropComplete={onCropComplete}
                                                onZoomChange={setZoom}
                                                zoomSpeed={0.2}
                                            /> :
                                            <div className="flex h-full w-full items-center justify-center bg-secondary/10 rounded-lg">
                                                <Loader2 />
                                            </div>
                                    }
                                </div>
                                <AlertDialogFooter>
                                    <AlertDialogCancel onClick={() => {
                                        setShowCropModal(false);
                                        setLoadingImage(false);
                                    }}>
                                        Huỷ
                                    </AlertDialogCancel>
                                    <AlertDialogAction onClick={() => { showCroppedImage() }}>
                                        Hoàn tất
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                </div>
                <div className="mt-2 flex gap-3">
                    <Dialog>
                        <DialogTrigger>
                            <Button className="w-fit px-5" size="lg">Cập nhật khoá học</Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Cập nhật khoá học này?</DialogTitle>
                            </DialogHeader>
                            <DialogDescription>
                                Các thông tin đã chỉnh sửa sẽ được lưu lại.
                            </DialogDescription>
                            <DialogFooter className="mt-2">
                                <DialogClose asChild>
                                    <Button variant="ghost">Tiếp tục chỉnh sửa</Button>
                                </DialogClose>
                                <Button onClick={() => handleUpdateCourse()}>Cập nhật</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                    <Dialog>
                        <DialogTrigger>
                            <Button className="w-fit px-5" variant="ghost" size="lg">Huỷ thay đổi</Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Huỷ cập nhật khoá học này?</DialogTitle>
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
                </div>
            </div>
        </div >
    );
};

export default EditCourse;