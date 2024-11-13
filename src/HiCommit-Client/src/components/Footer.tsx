import { Link } from "react-router-dom";
import { Badge } from "./ui/badge";

function Footer() {
    return (
        <div className="Footer w-full border-t py-10 flex flex-col items-center gap-1">
            <div className="flex justify-center items-baseline h-fit gap-1 text-sm">
                Copyright by
                <div className="flex text-lg font-black gap-[2px]">
                    <span className="text-green-600 dark:text-green-500">
                        Hi
                    </span>
                    <span className="">
                        Commit
                    </span>
                </div>
                <span className="font-medium">2024</span>
            </div>
            <span className="text-sm">A project of the <Link to="https://ithub.vn" target="_blank"><strong className="font-semibold text-green-600 dark:text-green-500">ITHub Club</strong></Link>, Tra Vinh University<img src="https://flagcdn.com/vn.svg" className="inline w-5 -translate-y-[1px] ml-1" /></span>
            <p className="text-sm mt-1">
                Powered by <Badge variant="secondary" className="rounded px-1.5 -translate-y-[2px]">
                    <i className="fa-regular fa-circle-play mr-1"></i>GitHub Actions
                </Badge>
                <span className="mx-2">|</span>
                Developed by <Link to="https://github.com/kakanvk" target="_blank"><strong className="font-semibold text-green-600 dark:text-green-500">kakanvk</strong></Link></p>
        </div>
    );
};

function AdminFooter() {
    return (
        <div className="px-2 pr-5 py-4 mt-6">
            <div className="Footer w-full py-10 flex flex-col items-center gap-1 border rounded-xl bg-secondary/10">
                <div className="flex justify-center items-baseline h-fit gap-1 text-sm">
                    Copyright by
                    <div className="flex text-lg font-black gap-[2px]">
                        <span className="text-green-600 dark:text-green-500">
                            Hi
                        </span>
                        <span className="">
                            Commit
                        </span>
                    </div>
                    <span className="font-medium">2024</span>
                </div>
                <span className="text-sm">A project of the <Link to="https://ithub.vn" target="_blank"><strong className="font-semibold text-green-600 dark:text-green-500">ITHub Club</strong></Link>, Tra Vinh University<img src="https://flagcdn.com/vn.svg" className="inline w-5 -translate-y-[1px] ml-1" /></span>
                <p className="text-sm mt-1">
                    Powered by <Badge variant="secondary" className="rounded px-1.5 -translate-y-[2px]">
                        <i className="fa-regular fa-circle-play mr-1"></i>GitHub Actions
                    </Badge>
                    <span className="mx-2">|</span>
                    Developed by <Link to="https://github.com/kakanvk" target="_blank"><strong className="font-semibold text-green-600 dark:text-green-500">kakanvk</strong></Link></p>
            </div>
        </div>
    );
};

export { Footer, AdminFooter };