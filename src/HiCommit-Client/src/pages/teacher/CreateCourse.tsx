
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
import { Eye, EyeOff, KeyRound, Plus, TriangleAlert, Upload, X } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import Editor from "@/components/ui/editor";

import Cropper from 'react-easy-crop';
import { se } from "date-fns/locale";
import Loader2 from "@/components/ui/loader2";

import getCroppedImg from "../client/cropImage";
import { set } from "date-fns";
import { createPost } from "@/service/API/Post";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { createCourse } from "@/service/API/Course";
import toast from 'react-hot-toast';

function CreateCourse() {

    const navigate = useNavigate();

    const [name, setName] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [className, setClassName] = useState<string>('');
    const [slug, setSlug] = useState<string>('');
    const [thumbnail, setThumbnail] = useState<string>('');
    const [showCropModal, setShowCropModal] = useState<boolean>(false);

    const [isPublicCourse, setIsPublicCourse] = useState(false);
    const [enrolKey, setEnrolKey] = useState("");

    const handleChangePublicCourse = () => {
        setIsPublicCourse(!isPublicCourse);
    }

    // For image cropping
    const [uploadedImage, setUploadedImage] = useState<string>('');
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [rotation, setRotation] = useState(0);
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
    const [loadingImage, setLoadingImage] = useState(false);

    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

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

    const handleCreateCourse = async () => {

        const data = {
            name,
            description,
            slug,
            thumbnail,
            class_name: className,
            join_key: isPublicCourse ? enrolKey : null
        }

        // console.log(data);

        try {
            // Call createPost API
            const response = await toast.promise(
                createCourse(data),
                {
                    loading: 'Đang lưu...',
                    success: 'Tạo khoá học thành công',
                    error: 'Tạo khoá học thất bại'
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
            setTimeout(() => {
                navigate(`/course-manager`);
            }, 500);
        } catch (error) {
            console.error('Error creating post:', error);
        }
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
                        Tạo khoá học mới
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
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-2 flex-col">
                        <h4 className="font-medium after:content-['*'] after:ml-1 after:text-green-500">Mô tả khoá học</h4>
                        <AutosizeTextarea
                            placeholder="Nhập mô tả khoá học"
                            className="placeholder:italic"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-2 flex-col">
                        <h4 className="font-medium">Mã lớp</h4>
                        <Input
                            placeholder="Nhập mã lớp của khoá học này"
                            className="placeholder:italic "
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
                            <h4 className="font-medium">Tuỳ chỉnh đường dẫn (URL)</h4>
                            <Input
                                placeholder="Nhập đường dẫn tùy chỉnh"
                                className="placeholder:italic"
                                value={slug}
                                onChange={(e) => {
                                    setSlug(e.target.value);
                                }}
                            />
                        </div>
                        <div className="flex flex-col gap-4 border p-4 px-5 w-[50%] min-w-[600px] rounded-md bg-secondary/20">
                            <div className="flex gap-5 justify-between items-center">
                                <Label className="flex-1 flex flex-col gap-1 cursor-pointer" htmlFor="public-course-switch">
                                    <h3 className="text-base"><i className="fa-solid fa-triangle-exclamation mr-2 text-sm text-amber-500/80"></i>Hạn chế truy cập</h3>
                                    <p className="text-sm opacity-50 font-medium">Chỉ những ai có mật khẩu mới được tham gia khoá học này.</p>
                                </Label>
                                <Switch defaultChecked={isPublicCourse} onCheckedChange={handleChangePublicCourse} id="public-course-switch" />
                            </div>
                            {
                                isPublicCourse &&
                                <>
                                    <div className="relative flex items-center">
                                        <KeyRound className="absolute left-3 h-4 w-4 text-muted-foreground ml-1" />
                                        <Input
                                            type={isPasswordVisible ? "text" : "password"}
                                            placeholder="Đặt mật khẩu tham gia"
                                            className="w-full pl-11 bg-transparent"
                                            value={enrolKey}
                                            onChange={e => setEnrolKey(e.target.value)}
                                        />
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                                            className="absolute right-1 size-8"
                                        >
                                            {isPasswordVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </Button>
                                    </div>
                                </>
                            }
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
                                    <img src={thumbnail} alt="Thumbnail" className="object-cover w-full h-full rounded-md border-secondary/50 border" />
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
                <Button className="w-fit px-5 mt-2" onClick={() => handleCreateCourse()}>Tạo khoá học</Button>
            </div>
        </div >
    );
};

export default CreateCourse;