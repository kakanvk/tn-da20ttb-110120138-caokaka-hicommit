import { Button } from "@/components/ui/button";
import RingProgress from "@/components/ui/ringProcess";

import { ChevronRight } from 'lucide-react';
import { Link } from "react-router-dom";

function HomePage() {
    return (
        <div className="HomePage p-7">
            <div className="flex flex-col gap-5">
                <h1 className="text-xl font-bold">Các khoá học gần đây</h1>
                <div className="flex flex-col gap-4">
                    <div className="flex gap-2 rounded-lg items-center justify-between dark:bg-zinc-900 bg-zinc-100 p-5 px-7">
                        <div className="flex flex-col gap-5 flex-1">
                            <div className="flex flex-col gap-2">
                                <h2 className="font-semibold text-lg">Kỹ thuật lập trình</h2>
                                <p className="opacity-70 dark:opacity-50 text-sm dark:font-light">Sau khi học khoá học này, sẽ có được các kỹ năng cần thiết để lập trình.</p>
                            </div>
                            <div className="flex">
                                <Button className="pl-5" asChild>
                                    <Link to="course/KTLT_24TTA">
                                        Vào khoá học<ChevronRight className="ml-3 w-4" />
                                    </Link>
                                </Button>
                            </div>
                        </div>
                        <div>
                            <RingProgress radius={55} stroke={9} progress={60} label="3/5" />
                        </div>
                    </div>
                    <div className="flex gap-2 rounded-lg items-center justify-between dark:bg-zinc-900 bg-zinc-100 p-5 px-7">
                        <div className="flex flex-col gap-5 flex-1">
                            <div className="flex flex-col gap-2">
                                <h2 className="font-semibold text-lg">An toàn và bảo mật thông tin - Cơ bản</h2>
                                <p className="opacity-70 dark:opacity-50 text-sm dark:font-light">Sau khi học khoá học này, sẽ có được các kỹ năng cần thiết để lập trình.</p>
                            </div>
                            <div className="flex">
                                <Link to="course/ATBMTT">
                                    <Button className="pl-5" variant="secondary">Vào khoá học<ChevronRight className="ml-3 w-4" /></Button>
                                </Link>
                            </div>
                        </div>
                        <div>
                            <RingProgress radius={55} stroke={9} progress={30} label="1/3" />
                        </div>
                    </div>
                    <div className="flex gap-2 rounded-lg items-center justify-between dark:bg-zinc-900 bg-zinc-100 p-5 px-7">
                        <div className="flex flex-col gap-5 flex-1">
                            <div className="flex flex-col gap-2">
                                <h2 className="font-semibold text-lg">Lập trình hướng đối tượng</h2>
                                <p className="opacity-70 dark:opacity-50 text-sm dark:font-light">Sau khi học khoá học này, sẽ có được các kỹ năng cần thiết để lập trình.</p>
                            </div>
                            <div className="flex">
                                <Link to="course/79d1f2c520">
                                    <Button className="pl-5" variant="secondary">Vào khoá học<ChevronRight className="ml-3 w-4" /></Button>
                                </Link>
                            </div>
                        </div>
                        <div>
                            <RingProgress radius={55} stroke={9} progress={10} label="1/10" />
                        </div>
                    </div>
                    <div className="flex gap-2 rounded-lg items-center justify-between dark:bg-zinc-900 bg-zinc-100 p-5 px-7">
                        <div className="flex flex-col gap-5 flex-1">
                            <div className="flex flex-col gap-2">
                                <h2 className="font-semibold text-lg">Công nghệ phần mềm</h2>
                                <p className="opacity-70 dark:opacity-50 text-sm dark:font-light">Sau khi học khoá học này, sẽ có được các kỹ năng cần thiết để lập trình.</p>
                            </div>
                            <div className="flex">
                                <Button className="pl-5" variant="secondary">Vào khoá học<ChevronRight className="ml-3 w-4" /></Button>
                            </div>
                        </div>
                        <div>
                            <RingProgress radius={55} stroke={9} progress={10} label="1/10" />
                        </div>
                    </div>
                    
                </div>
            </div>
        </div>
    );
};

export default HomePage;