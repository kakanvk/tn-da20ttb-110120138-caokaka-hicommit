import { AutosizeTextarea } from "@/components/ui/auto-resize-text-area";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ChevronsLeft, ChevronsRight, CornerDownRight, MessageSquareCode, Pencil, Plus, Trash, Trash2, X } from "lucide-react";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

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

import { Input } from "@/components/ui/input";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import TextAndMathEditor from "@/components/ui/text-math-editor";
import { getCourseByIDForAdmin } from "@/service/API/Course";
import { toast } from "react-hot-toast";

import { createProblem } from "@/service/API/Problem";

function CreateProblem() {

    const course_id = useParams<{ course_id: string }>().course_id;
    const navigate = useNavigate();

    const unit = new URLSearchParams(window.location.search).get('unit');

    const [course, setCourse] = useState<any>({});
    const [tags, setTags] = useState<string[]>([]);
    const [tag, setTag] = useState<string>('');

    const [name, setName] = useState<string>('');
    const [slug, setSlug] = useState<string>('');
    const [language, setLanguage] = useState<string>('c');
    const [input, setInput] = useState<string>('');
    const [output, setOutput] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [limit, setLimit] = useState<string>('');

    const [examples, setExamples] = useState<any[]>([]);
    const [testCases, setTestCases] = useState<any[]>([]);

    const handleAddTag = () => {
        if (tags.includes(tag)) {
            setTag('');
            toast.error(
                'Đã tồn tại tag này',
                {
                    style: {
                        borderRadius: '8px',
                        background: '#222',
                        color: '#fff',
                        paddingLeft: '15px',
                        fontFamily: 'Plus Jakarta Sans',
                    }
                }
            );
            return;
        }

        if (tags.length < 5 && tag.trim() !== '') {
            setTags([...tags, tag.trim()]);
            setTag('');
        }
    }

    const handleGetCourseData = async () => {
        try {
            const response = await getCourseByIDForAdmin(course_id as string);
            setCourse(response);
        } catch (error) {
            console.error('Error getting course:', error);
        }
    }

    const handleCreateProblem = async () => {
        const data = {
            name: name,
            slug: slug.trim(),
            language: language,
            tags: tags,
            description: description,
            input: input,
            output: output,
            limit: limit,
            examples: examples,
            testcases: testCases,
            type: "COURSE",
            unit: unit,
            parent: course_id
        }

        console.log(data);

        try {
            // Call createPost API
            const response = await toast.promise(
                createProblem(data),
                {
                    loading: 'Đang lưu...',
                    success: 'Tạo bài tập thành công',
                    error: 'Tạo bài tập thất bại'
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
            navigate(`/course-manager/${course_id}`);
        } catch (error) {
            console.error('Error creating post:', error);
        }
    }

    const handleAddExample = () => {
        setExamples([...examples, {
            input: '',
            output: ''
        }]);
    }

    const handleAddTestCase = () => {
        setTestCases([...testCases, {
            input: '',
            output: ''
        }]);
    }

    const handleAddNoteForExample = (index: number) => {
        const newExamples = examples.slice();
        newExamples[index].note = 'Ghi chú';
        setExamples(newExamples);
    }

    const handleAddSuggestionForTestCase = (index: number) => {
        const newTestCases = testCases.slice();
        newTestCases[index].suggestion = 'Gợi ý chỉnh sửa';
        setTestCases(newTestCases);
    }

    const handleExampleChange = (index: number, field: string, value: string) => {
        const newExamples = examples.slice();
        newExamples[index][field] = value;
        setExamples(newExamples);
    }

    const handleTestCaseChange = (index: number, field: string, value: string) => {
        const newTestCases = testCases.slice();
        newTestCases[index][field] = value;
        setTestCases(newTestCases);
    }

    const handleDeleteExample = (index: number) => {
        const newExamples = examples.slice();
        newExamples.splice(index, 1);
        setExamples(newExamples);
    }

    const handleDeleteTestCase = (index: number) => {
        const newTestCases = testCases.slice();
        newTestCases.splice(index, 1);
        setTestCases(newTestCases);
    }

    const handleDeleteNoteForExample = (index: number) => {
        const newExamples = examples.slice();
        delete newExamples[index].note;
        setExamples(newExamples);
    }

    const handleDeleteSuggestionForTestCase = (index: number) => {
        const newTestCases = testCases.slice();
        delete newTestCases[index].suggestion;
        setTestCases(newTestCases);
    }

    useEffect(() => {
        handleGetCourseData();
    }, []);

    return (
        <div className="CreateProblem p-6 px-8 flex flex-col gap-8">
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
                        <BreadcrumbLink>
                            Thêm bài tập mới
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            <div className="flex flex-col gap-14">
                <div className="flex flex-col gap-5">
                    <h3 className="text-xl font-bold w-fit after:content-['*'] after:ml-1 after:text-green-500">1. Thông tin cơ bản</h3>
                    <div className="flex flex-col gap-6">
                        <div className="flex gap-2 flex-col">
                            <h4 className="font-medium after:content-['*'] after:ml-1 after:text-green-500">Tên bài tập</h4>
                            <Input placeholder="Nhập tên bài tập" className="placeholder:italic" value={name} onChange={e => setName(e.target.value)} />
                        </div>
                        <div className="flex gap-2 flex-col">
                            <h4 className="font-medium after:content-['*'] after:ml-1 after:text-green-500">Mã bài tập</h4>
                            <Input placeholder="Nhập đường dẫn tuỳ chỉnh" className="placeholder:italic" value={slug} onChange={e => setSlug(e.target.value)} />
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
                        <div className="flex gap-2 flex-col">
                            <h4 className="font-medium after:content-['*'] after:ml-1 after:text-green-500">Ngôn ngữ lập trình</h4>
                            <Select defaultValue="c" onValueChange={(value) => setLanguage(value)}>
                                <SelectTrigger className="w-[350px]">
                                    <SelectValue placeholder="Theme" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="c">C</SelectItem>
                                    <SelectItem value="cpp">C++</SelectItem>
                                    <SelectItem value="java">Java</SelectItem>
                                </SelectContent>
                            </Select>
                            <span className="italic text-xs opacity-50 dark:font-light">* Không thể thay đổi ngôn ngữ nếu đã có người nộp bài</span>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col gap-5">
                    <h3 className="text-xl font-bold w-fit after:content-['*'] after:ml-1 after:text-green-500">2. Thông tin chi tiết</h3>
                    <div className="flex flex-col gap-6">
                        <div className="flex gap-2 flex-col">
                            <h4 className="font-medium after:content-['*'] after:ml-1 after:text-green-500">Mô tả đề bài</h4>
                            <TextAndMathEditor placeholder="Nhập mô tả bài toán" onChange={setDescription} />
                        </div>
                    </div>
                    <div className="flex flex-col gap-6">
                        <div className="flex gap-2 flex-col">
                            <h4 className="font-medium after:content-['*'] after:ml-1 after:text-green-500">Input</h4>
                            <TextAndMathEditor placeholder="Nhập mô tả cho dữ liệu đầu vào (input)" onChange={setInput} />
                        </div>
                    </div>
                    <div className="flex flex-col gap-6">
                        <div className="flex gap-2 flex-col">
                            <h4 className="font-medium after:content-['*'] after:ml-1 after:text-green-500">Output</h4>
                            <TextAndMathEditor placeholder="Nhập mô tả cho dữ liệu đầu ra (output)" onChange={setOutput} />
                        </div>
                    </div>
                    <div className="flex flex-col gap-6">
                        <div className="flex gap-2 flex-col">
                            <h4 className="font-medium">Giới hạn</h4>
                            <TextAndMathEditor placeholder="Nhập các giới hạn về tài nguyên, thời gian (nếu có)" onChange={setLimit} />
                        </div>
                    </div>
                </div>
                <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-2">
                        <h3 className="text-xl font-bold">3. Các ví dụ</h3>
                        {
                            examples.length > 0 &&
                            <Badge className="px-1.5 min-w-[22px] flex justify-center">{examples.length}</Badge>
                        }
                    </div>
                    {
                        examples.length > 0 &&
                        <div className="flex flex-col gap-6">
                            {examples.map((example, index) => (
                                <Example
                                    key={index}
                                    example={example}
                                    index={index}
                                    onChange={handleExampleChange}
                                    onDelete={handleDeleteExample}
                                    handleAddNoteForExample={handleAddNoteForExample}
                                    handleDeleteNoteForExample={handleDeleteNoteForExample}
                                />
                            ))}
                        </div>
                    }
                    <Button className="w-fit px-3.5 pr-4 mt-1 text-base font-medium hover:bg-primary/10 text-primary dark:text-green-500 hover:text-primary" variant="ghost" onClick={() => handleAddExample()}>
                        <Plus className="w-[17px] mr-1.5 h-[17px]" />Thêm ví dụ
                    </Button>
                </div>
                <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-2">
                        <h3 className="text-xl font-bold">4. Các Test-case</h3>
                        {
                            testCases.length > 0 &&
                            <Badge className="px-1.5 min-w-[22px] flex justify-center">{testCases.length}</Badge>
                        }
                    </div>
                    {
                        testCases.length > 0 &&
                        <div className="flex flex-col gap-6">
                            {testCases.map((testCase, index) => (
                                <TestCase
                                    key={index}
                                    testCase={testCase}
                                    index={index}
                                    onChange={handleTestCaseChange}
                                    onDelete={handleDeleteTestCase}
                                    handleAddSuggestionForTestCase={handleAddSuggestionForTestCase}
                                    handleDeleteSuggestionForTestCase={handleDeleteSuggestionForTestCase}
                                />
                            ))}
                        </div>
                    }
                    <Button className="w-fit px-3.5 pr-4 mt-1 text-base font-medium hover:bg-primary/10 text-primary dark:text-green-500 hover:text-primary" variant="ghost" onClick={() => handleAddTestCase()}>
                        <Plus className="w-[17px] mr-1.5 h-[17px]" />Thêm Test-case
                    </Button>
                </div>
                <Button className="w-fit" onClick={() => handleCreateProblem()}>Tạo bài tập</Button>
            </div>
        </div>
    );
};

export default CreateProblem;

const Example = (props: any) => {

    const { example, index, onChange, onDelete, handleAddNoteForExample, handleDeleteNoteForExample } = props;

    return (
        <div className="flex flex-col gap-1 group/test-case">
            <div className="flex justify-start gap-2 items-center">
                <span className="text-sm font-medium">
                    <MessageSquareCode className="inline w-5 h-5 text-primary mr-2" />Ví dụ {index + 1}
                    <Badge className="ml-3 pl-1.5 cursor-pointer" variant="secondary" onClick={() => handleAddNoteForExample(index)}>
                        <Plus className="w-3 h-3 mr-1" />Thêm ghi chú
                    </Badge>
                </span>
                <Dialog>
                    <DialogTrigger asChild>
                        <Button size="icon" className="rounded-full w-7 h-7 hover:bg-red-500/20 dark:hover:bg-red-500/30" variant="ghost">
                            <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Bạn có chắc muốn xoá ví dụ này?</DialogTitle>
                        </DialogHeader>
                        <DialogDescription>
                            Sau khi xoá, ví dụ này sẽ không thể khôi phục.
                        </DialogDescription>
                        <DialogFooter className="mt-2">
                            <DialogClose>
                                <Button variant="ghost">Đóng</Button>
                            </DialogClose>
                            <DialogClose>
                                <Button className="w-fit px-4" variant="destructive" onClick={() => onDelete(index)}>Xoá</Button>
                            </DialogClose>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
            <div className="w-full flex gap-3 rounded-xl duration-200 cursor-pointer">
                <div className="flex-1 relative">
                    <span className="text-[10px] font-normal absolute top-1 right-1 border px-1 pr-1.5 rounded opacity-60 bg-secondary"><ChevronsRight className="inline w-3 h-3 mr-0.5" />Input</span>
                    <AutosizeTextarea
                        className="font-mono disabled:cursor-pointer bg-secondary/30"
                        value={example.input}
                        onChange={(e) => onChange(index, 'input', e.target.value)}
                    />
                </div>
                <div className="flex-1 relative">
                    <span className="text-[10px] font-normal absolute top-1 right-1 border px-1 pr-1.5 rounded opacity-60 bg-secondary"><ChevronsLeft className="inline w-3 h-3 mr-0.5" />Output</span>
                    <AutosizeTextarea
                        className="font-mono disabled:cursor-pointer bg-secondary/30"
                        value={example.output}
                        onChange={(e) => onChange(index, 'output', e.target.value)}
                    />
                </div>
            </div>
            {
                example.note != null &&
                <div className="flex flex-col gap-1 mt-1 group/note">
                    <p className="flex items-center">
                        <span className="text-[12px] font-normal opacity-60 italic">
                            <CornerDownRight className="inline w-[13px] h-[13px] mr-1" />Ghi chú cho Ví dụ {index + 1}
                        </span>
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button size="icon" className="w-[18px] h-[18px] rounded-full ml-2 invisible group-hover/note:visible -translate-y-[1px]" variant="secondary"><X className="w-3 h-3" /></Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Bạn có chắc muốn xoá ghi chú này?</DialogTitle>
                                </DialogHeader>
                                <DialogDescription>
                                    Sau khi xoá, ghi chú này sẽ không thể khôi phục.
                                </DialogDescription>
                                <DialogFooter className="mt-2">
                                    <DialogClose>
                                        <Button variant="ghost">Đóng</Button>
                                    </DialogClose>
                                    <DialogClose>
                                        <Button className="w-fit px-4" variant="destructive" onClick={() => handleDeleteNoteForExample(index)}>
                                            Xoá ghi chú
                                        </Button>
                                    </DialogClose>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </p>
                    <AutosizeTextarea
                        minHeight={38}
                        className="disabled:cursor-pointer bg-secondary/30 placeholder:italic"
                        placeholder="Nhập ghi chú cho ví dụ này"
                        value={example?.note || ''}
                        onChange={(e) => onChange(index, 'note', e.target.value)}
                    />
                </div>
            }
        </div>
    )
}

const TestCase = (props: any) => {

    const { testCase, index, onChange, onDelete, handleAddSuggestionForTestCase, handleDeleteSuggestionForTestCase } = props;

    return (
        <div className="flex flex-col gap-1 group/test-case">
            <div className="flex justify-start gap-2 items-center">
                <span className="text-sm font-medium">
                    <i className="fa-solid fa-seedling text-sm text-primary mr-2"></i>Test-case {index + 1}
                    <Badge className="ml-3 pl-1.5 cursor-pointer" variant="secondary" onClick={() => handleAddSuggestionForTestCase(index)}>
                        <Plus className="w-3 h-3 mr-1" />Thêm gợi ý chỉnh sửa
                    </Badge>
                </span>
                <Dialog>
                    <DialogTrigger asChild>
                        <Button size="icon" className="rounded-full w-7 h-7 hover:bg-red-500/20 dark:hover:bg-red-500/30" variant="ghost">
                            <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Bạn có chắc muốn xoá Test-case này?</DialogTitle>
                        </DialogHeader>
                        <DialogDescription>
                            Sau khi xoá, Test-case này sẽ không thể khôi phục.
                        </DialogDescription>
                        <DialogFooter className="mt-2">
                            <DialogClose>
                                <Button variant="ghost">Đóng</Button>
                            </DialogClose>
                            <DialogClose>
                                <Button className="w-fit px-4" variant="destructive" onClick={() => onDelete(index)}>Xoá</Button>
                            </DialogClose>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
            <div className="w-full flex gap-3 rounded-xl duration-200 cursor-pointer">
                <div className="flex-1 relative">
                    <span className="text-[10px] font-normal absolute top-1 right-1 border px-1 pr-1.5 rounded opacity-60 bg-secondary"><ChevronsRight className="inline w-3 h-3 mr-0.5" />Input</span>
                    <AutosizeTextarea
                        className="font-mono disabled:cursor-pointer bg-secondary/30 placeholder:italic"
                        value={testCase.input}
                        onChange={(e) => onChange(index, 'input', e.target.value)}
                        spellCheck={false}
                    />
                </div>
                <div className="flex-1 relative">
                    <span className="text-[10px] font-normal absolute top-1 right-1 border px-1 pr-1.5 rounded opacity-60 bg-secondary"><ChevronsLeft className="inline w-3 h-3 mr-0.5" />Output</span>
                    <AutosizeTextarea
                        className="font-mono disabled:cursor-pointer bg-secondary/30 placeholder:italic"
                        value={testCase.output}
                        onChange={(e) => onChange(index, 'output', e.target.value)}
                        spellCheck={false}
                    />
                </div>
            </div>
            {
                testCase.suggestion != null &&
                <div className="flex flex-col gap-1 mt-1 group/note">
                    <p className="flex items-center">
                        <span className="text-[12px] font-normal opacity-60 italic">
                            <CornerDownRight className="inline w-[13px] h-[13px] mr-1" />Gợi ý cho cho Test-case {index + 1}
                        </span>
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button size="icon" className="w-[18px] h-[18px] rounded-full ml-2 invisible group-hover/note:visible -translate-y-[1px]" variant="secondary"><X className="w-3 h-3" /></Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Bạn có chắc muốn xoá gợi ý này?</DialogTitle>
                                </DialogHeader>
                                <DialogDescription>
                                    Sau khi xoá, gợi ý này sẽ không thể khôi phục.
                                </DialogDescription>
                                <DialogFooter className="mt-2">
                                    <DialogClose>
                                        <Button variant="ghost">Đóng</Button>
                                    </DialogClose>
                                    <DialogClose>
                                        <Button className="w-fit px-4" variant="destructive" onClick={() => handleDeleteSuggestionForTestCase(index)}>
                                            Xoá gợi ý
                                        </Button>
                                    </DialogClose>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </p>
                    <AutosizeTextarea
                        minHeight={38}
                        className="disabled:cursor-pointer bg-secondary/30 placeholder:italic"
                        placeholder="Nhập gợi ý cho Test-case này"
                        value={testCase?.suggestion || ''}
                        onChange={(e) => onChange(index, 'suggestion', e.target.value)}
                    />
                </div>
            }
        </div>
    )
}