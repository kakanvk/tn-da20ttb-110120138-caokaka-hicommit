import { Button } from "@/components/ui/button";
import { auth, signInWithGithub } from "@/service/firebase";
import { useEffect } from "react";

import { Checkbox } from "@/components/ui/checkbox"
import { ModeToggle } from "@/components/mode-toggle";

import LoginBG from "@/assets/imgs/LoginBG.jpg";

function Login() {

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            if (user) {
                window.location.href = "/";
            }
        });

        return () => unsubscribe();
    }, []);

    const handleLoginWithGithub = async () => {
        try {
            await signInWithGithub();
            window.location.href = "/";
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div className="relative Login flex flex-col gap-10 h-[100vh] w-full items-center justify-center">
            <div className="asolute inset-0 overflow-hidden w-full h-full">
                <img src={LoginBG} className="object-cover h-full w-full" alt="" />
            </div>
            <div className="absolute top-3 right-4">
                <ModeToggle />
            </div>
            <div className="absolute flex flex-col gap-10 bg-white/80 dark:bg-black/70 p-10 rounded-xl backdrop-blur-sm border">
                <div className="flex flex-col items-center">
                    <span className="font-semibold text-lg">Đăng nhập</span>
                    <div className="flex text-3xl font-black gap-[2px]">
                        <span className="text-green-600 dark:text-green-500">
                            Hi
                        </span>
                        <span className="">
                            Commit
                        </span>
                    </div>
                </div>
                <Button size="lg" onClick={() => handleLoginWithGithub()}><i className="fa-brands fa-github text-lg mr-2"></i>Đăng nhập với GitHub</Button>
                <div className="items-top flex space-x-2 border border-zinc-500 rounded-md p-3 dark:border-zinc-500">
                    <Checkbox id="terms1" defaultChecked />
                    <div className="grid gap-1.5 leading-none">
                        <label
                            htmlFor="terms1"
                            className="cursor-pointer text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                            Đồng ý với các Điều khoản dịch vụ
                        </label>
                        <label htmlFor="terms1" className="cursor-pointer text-xs dark:font-light opacity-60 w-[250px]">
                            Bằng cách Đăng nhập, bạn đã đồng ý với các Điều khoản dịch vụ của chúng tôi.
                        </label>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;