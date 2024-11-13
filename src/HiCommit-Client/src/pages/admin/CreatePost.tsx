
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
import { Plus, Upload, X } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import Editor from "@/components/ui/editor";

import Cropper from 'react-easy-crop';
import { se } from "date-fns/locale";
import Loader2 from "@/components/ui/loader2";

import getCroppedImg from "../client/cropImage";
import { set } from "date-fns";
import { createPost } from "@/service/API/Post";
import toast from "react-hot-toast";

function CreatePost() {

    const navigate = useNavigate();

    const [title, setTitle] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [slug, setSlug] = useState<string>('');
    const [tags, setTags] = useState<string[]>([]);
    const [tag, setTag] = useState<string>('');
    const [content, setContent] = useState<string>('');
    const [thumbnail, setThumbnail] = useState<string>('');
    const [showCropModal, setShowCropModal] = useState<boolean>(false);

    const [checkSlugEdited, setCheckSlugEdited] = useState<boolean>(false);

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

    const handleAddTag = () => {
        if (tags.includes(tag)) {
            setTag('');
            return;
        }

        if (tags.length < 5 && tag.trim() !== '') {
            setTags([...tags, tag.trim()]);
            setTag('');
        }
    }

    const onCropComplete = (croppedArea: any, croppedAreaPixels: any) => {
        setCroppedAreaPixels(croppedAreaPixels)
    }

    const handleAutoFillSlug = (e: any) => {

        if (checkSlugEdited) {
            return;
        }

        const new_slug = e.target.value.trim().toLowerCase().replace(/ /g, '-');

        setSlug(new_slug);
    }

    const handleCreatePost = async () => {

        const data = {
            title,
            description,
            slug,
            tags,
            content,
            thumbnail
        }

        console.log(data);

        const response = await toast.promise(
            createPost(data),
            {
                loading: 'Đang tạo bài viết...',
                success: 'Tạo bài viết thành công',
                error: 'Tạo bài viết không thành công, hãy thử lại'
            },
            {
                style: {
                    borderRadius: '8px',
                    background: '#222',
                    color: '#fff',
                    paddingLeft: '15px',
                    fontFamily: 'Plus Jakarta Sans',
                    maxWidth: '400px',
                }
            });
            
        setTimeout(() => {
            navigate('/admin/posts');
        }, 500);
    }

    return (
        <div className="CreatePost p-5 pl-2 flex flex-col gap-8 pb-10">
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        Quản trị
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                            <Link to="/admin/posts">Quản lý bài viết</Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        Tạo bài viết
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            <div className="flex flex-col gap-14">
                <div className="flex flex-col gap-6">
                    <h1 className="font-bold text-xl after:content-['*'] after:ml-1 after:text-green-500">
                        1. Thông tin cơ bản
                    </h1>
                    <div className="flex gap-2 flex-col">
                        <h4 className="font-medium after:content-['*'] after:ml-1 after:text-green-500">Tiêu đề bài viết</h4>
                        <Input
                            placeholder="Nhập tiêu đề bài viết"
                            className="placeholder:italic "
                            spellCheck="false"
                            value={title}
                            onChange={(e) => {
                                setTitle(e.target.value);
                                handleAutoFillSlug(e)
                            }}
                            onInput={(e) => handleAutoFillSlug(e)}
                        />
                    </div>
                    <div className="flex gap-2 flex-col">
                        <h4 className="font-medium after:content-['*'] after:ml-1 after:text-green-500">Tuỳ chỉnh đường dẫn (URL)</h4>
                        <Input
                            placeholder="Nhập đường dẫn tùy chỉnh"
                            className="placeholder:italic"
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
                        <h4 className="font-medium after:content-['*'] after:ml-1 after:text-green-500">Tag</h4>
                        <div className="flex gap-3">
                            <Input placeholder={tags.length >= 5 ? "Đã đạt giới hạn" : "Nhập tag mới, tối đa 5 tags"} disabled={tags.length >= 5} className="placeholder:italic w-[350px]" value={tag} onChange={e => setTag(e.target.value)} />
                            <Button size='icon' onClick={() => handleAddTag()} disabled={tags.length >= 5}><Plus className="w-5 h-5" /></Button>
                        </div>
                        {
                            tags.length > 0 &&
                            <div className="flex gap-2 mt-1">
                                {
                                    tags.map((tag, index) => (
                                        <Badge key={index} variant="secondary" className="text-[11px] p-1 px-1.5 pl-2.5">
                                            {tag}
                                            <X className="w-4 h-4 ml-2 hover:bg-zinc-700 rounded-full p-[1px] duration-100 cursor-pointer" onClick={() => setTags(tags.filter(t => t !== tag))} />
                                        </Badge>
                                    ))
                                }
                            </div>
                        }
                    </div>
                </div>
                <div className="flex flex-col gap-6">
                    <h1 className="font-bold text-xl after:content-['*'] after:ml-1 after:text-green-500">2. Thông tin chi tiết</h1>
                    <div className="flex gap-2 flex-col">
                        <h4 className="font-medium after:content-['*'] after:ml-1 after:text-green-500">Mô tả bài viết</h4>
                        <AutosizeTextarea
                            placeholder="Nhập mô tả bài viết"
                            className="placeholder:italic"
                            spellCheck="false"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-2 flex-col">
                        <h4 className="font-medium after:content-['*'] after:ml-1 after:text-green-500">Nội dung bài viết</h4>
                        <Editor
                            value={content}
                            onChange={(event: any, editor: any) => {
                                const data = editor.getData();
                                setContent(data);
                            }}
                            placeholder="Nhập nội dung bài viết"
                        />
                    </div>
                </div>
                <div className="flex flex-col gap-6">
                    <h1 className="font-bold text-xl after:content-['*'] after:ml-1 after:text-green-500">3. Thumbnail</h1>
                    <div className="flex gap-2 flex-col">
                        <h4 className="font-medium after:content-['*'] after:ml-1 after:text-green-500">Ảnh Thumbnail</h4>
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
                <Button className="w-fit px-5 mt-2" onClick={() => handleCreatePost()}>Tạo bài viết</Button>
            </div>
        </div >
    );
};

export default CreatePost;