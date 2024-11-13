import { getProfileByUsername } from "@/service/API/User";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatTimeAgo } from "@/service/DateTimeService";
import { CalendarDays, EllipsisVertical, Flame, SquareActivity, Star } from "lucide-react";
import { getLeaderboard } from "@/service/API/Analysis";
import BlurFade from "@/components/magicui/blur-fade";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import moment from "moment";


function Profile() {

    const { username } = useParams();
    const [profile, setProfile] = useState<any>(null);
    const [leaderboard, setLeaderboard] = useState<any>(null);

    const getProfile = async () => {
        const response = await getProfileByUsername(username as string);
        setProfile(response);
    }

    const getLeaderboardData = async () => {
        const response = await getLeaderboard();
        setLeaderboard(response);
    }

    useEffect(() => {
        getProfile();
        getLeaderboardData();
    }, [username]);

    return (
        <div className="Profile p-7 px-8 flex flex-col gap-10">
            <div className="flex flex-col gap-6">
                <BlurFade className="flex items-start justify-between" delay={0.1} yOffset={0}>
                    <div className="flex items-center gap-3">
                        <img src={profile?.avatar_url} className="size-14 rounded-full border border-secondary/80 border-2" />
                        <div>
                            <h1 className="text-lg font-bold">
                                {profile?.username}
                                {((profile?.role as any) === "ADMIN" || (profile?.role as any) === "TEACHER") && <i className="fa-solid fa-circle-check text-primary text-[12px] ml-1 -translate-y-[1px]"></i>}
                            </h1>
                            <p className="text-sm text-gray-500">{profile?.email}</p>
                        </div>
                    </div>
                    <Button variant="outline" className="bg-transparent flex 2xl:hidden" size="icon">
                        <EllipsisVertical className="size-4" />
                    </Button>
                </BlurFade>
                <BlurFade className="flex items-start gap-3 text-sm flex-col" delay={0.15} yOffset={0}>
                    {
                        leaderboard?.findIndex((user: any) => user.username === profile?.username) + 1 <= 5 && (
                            <Link to="/leaderboard" className="text-primary font-semibold italic">
                                #<span className="text-base font-bold">{leaderboard?.findIndex((user: any) => user.username === profile?.username) + 1}</span> trên Bảng xếp hạng
                            </Link>
                        )
                    }
                    <p className="flex items-center">
                        <Flame className="text-gray-500 text-sm mr-1.5 size-4" />
                        Điểm tích luỹ: <span className="text-sm font-semibold bg-secondary/70 rounded-md px-1.5 py-0.5 ml-1.5">{profile?.score}</span>
                    </p>
                    <p className="flex items-center">
                        <SquareActivity className="text-gray-500 text-sm mr-1.5 size-4" />
                        Tỉ lệ hoàn thành:
                        <div className="flex items-center gap-1.5 ml-2">
                            <div className="w-[90px] h-1.5 bg-secondary/90 rounded-full overflow-hidden">
                                <div className="h-1.5 bg-primary rounded-full" style={{ width: `${Number(profile?.ac_rate).toFixed(1)}%` }}>
                                </div>
                            </div>
                            <span className="text-[12px] font-semibold">
                                {Number(profile?.ac_rate).toFixed(1) + "%"}
                            </span>
                        </div>
                    </p>
                    <p className="flex items-center">
                        <CalendarDays className="text-gray-500 text-sm mr-1.5 size-4" />
                        Đã tham gia {formatTimeAgo(profile?.createdAt, "vi")}
                    </p>
                </BlurFade>
            </div>
            <BlurFade delay={0.2} yOffset={0}>
                <Tabs defaultValue="completed_problems" className="w-full">
                    <TabsList className="bg-transparent justify-start rounded-none pb-3 px-0 border-b-[2px] border-secondary/40 w-full">
                        <TabsTrigger
                            value="completed_problems"
                            className="px-1 border-b-2 border-b-transparent drop-shadow-none data-[state=active]:border-b-primary rounded-none bg-transparent data-[state=active]:bg-transparent duration-500"
                        >
                            <Button variant="ghost" size="sm" className="hover:bg-secondary/60">
                                Bài tập đã giải
                            </Button>
                        </TabsTrigger>
                        <TabsTrigger
                            value="joined_courses"
                            className="px-1 border-b-2 border-b-transparent drop-shadow-none data-[state=active]:border-b-primary rounded-none bg-transparent data-[state=active]:bg-transparent duration-500"
                        >
                            <Button variant="ghost" size="sm" className="hover:bg-secondary/60">
                                Khoá học đã tham gia
                            </Button>
                        </TabsTrigger>
                        <TabsTrigger
                            value="joined_contests"
                            className="px-1 border-b-2 border-b-transparent drop-shadow-none data-[state=active]:border-b-primary rounded-none bg-transparent data-[state=active]:bg-transparent duration-500"
                        >
                            <Button variant="ghost" size="sm" className="hover:bg-secondary/60">
                                Cuộc thi đã tham gia
                            </Button>
                        </TabsTrigger>
                        <TabsTrigger
                            value="posts"
                            className="px-1 border-b-2 border-b-transparent drop-shadow-none data-[state=active]:border-b-primary rounded-none bg-transparent data-[state=active]:bg-transparent duration-500"
                        >
                            <Button variant="ghost" size="sm" className="hover:bg-secondary/60">
                                Bài viết
                            </Button>
                        </TabsTrigger>
                    </TabsList>
                    <TabsContent value="completed_problems">
                        <div className="p-3">
                            <div className="flex gap-4 flex-col">
                                {
                                    profile?.completed_problems?.length > 0 ?
                                        profile?.completed_problems?.map((problem: any, index: number) => (
                                            <BlurFade key={problem.id} delay={0.1 + 0.05 * index} yOffset={0}>
                                                <Link className="font-semibold text-sm" to={`/problem/${problem.slug}`}>
                                                    {
                                                        problem.level === "EASY" &&
                                                        <span className={`mr-1.5 rounded bg-green-500/20 border border-green-500 text-green-600 dark:text-green-400 text-[12px] p-0.5 px-1.5 font-medium leading-5 text-nowrap`} >
                                                            Dễ
                                                        </span >
                                                    }
                                                    {
                                                        problem.level === "MEDIUM" &&
                                                        <span className={`mr-1.5 rounded bg-sky-500/20 border border-sky-500 text-sky-600 dark:text-sky-400 text-[12px] p-0.5 px-1.5 font-medium leading-5 text-nowrap`} >
                                                            Trung bình
                                                        </span >
                                                    }
                                                    {
                                                        problem.level === "HARD" &&
                                                        <span className={`mr-1.5 rounded bg-orange-500/20 border border-orange-500 text-orange-600 dark:text-orange-400 text-[12px] p-0.5 px-1.5 font-medium leading-5 text-nowrap`} >
                                                            Khó
                                                        </span >
                                                    }
                                                    {problem.name}
                                                </Link>
                                            </BlurFade>
                                        )) :
                                        <p className="text-sm text-gray-500">
                                            Chưa tham gia cuộc thi nào
                                        </p>
                                }
                            </div>
                        </div>
                    </TabsContent>
                    <TabsContent value="joined_courses">
                        <div className="p-3">
                            <div className="w-full grid grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 3xl:grid-cols-5 gap-5 2xl:gap-6">
                                {
                                    profile?.courses?.length > 0 ?
                                        profile?.courses?.map((course: any, index: number) => (
                                            <BlurFade key={course?.id} delay={0.15 + index * 0.05} yOffset={0}>
                                                <div className="flex flex-col h-full flex-1 gap-2">
                                                    <Link className="w-full aspect-[3/2]" to={`/course/${course.slug || course.id}`}>
                                                        <img src={course?.thumbnail} className="rounded-xl" />
                                                    </Link>
                                                    <div className="flex flex-col justify-between flex-1 gap-2">
                                                        <Link className="font-semibold text-base line-clamp-1" to={`/course/${course.slug || course.id}`}>
                                                            {
                                                                course.class_name &&
                                                                <Badge className="mr-2 rounded text-[9px] px-[5px] py-[1px] -translate-y-[2px] font-bold leading-4">
                                                                    {course?.class_name}
                                                                </Badge>
                                                            }
                                                            {course?.name}
                                                        </Link>
                                                    </div>
                                                </div>
                                            </BlurFade>
                                        )) :
                                        <p className="text-sm text-gray-500">
                                            Chưa tham gia khoá học nào
                                        </p>
                                }
                            </div>
                        </div>
                    </TabsContent>
                    <TabsContent value="joined_contests">
                        <div className="flex flex-col gap-5 p-3">
                            {
                                profile?.contests?.length > 0 ?
                                    profile?.contests?.map((contest: any, index: number) => (
                                        <BlurFade key={contest.id} delay={0.1 + 0.05 * index} yOffset={0}>
                                            <Link className="font-semibold " to={`/contest/${contest.id}`}>
                                                {
                                                    contest?.start_time > moment(new Date().getTime()).unix() ?
                                                        <span className="text-[13px] p-1 px-2 rounded-md italic text-amber-600 dark:text-amber-500 bg-amber-500/15 font-semibold dark:font-medium mr-1.5">
                                                            Sắp diễn ra
                                                        </span> :
                                                        contest?.end_time > moment(new Date().getTime()).unix() ?
                                                            <span className="text-[13px] p-1 px-2 rounded-md italic text-green-600 dark:text-green-500 bg-green-500/15 font-semibold dark:font-medium mr-1.5">
                                                                Đang diễn ra
                                                            </span> :
                                                            <span className="text-[13px] p-1 px-2 rounded-md italic text-red-500 bg-red-500/15 font-semibold mr-1.5">Đã kết thúc</span>
                                                }
                                                {contest.name}
                                            </Link>
                                        </BlurFade>
                                    )) :
                                    <p className="text-sm text-gray-500">
                                        Chưa tham gia cuộc thi nào
                                    </p>
                            }
                        </div>
                    </TabsContent>
                    <TabsContent value="posts">
                        <div className="flex flex-col gap-5 p-3">
                            {
                                profile?.posts?.length > 0 ?
                                    profile?.posts?.map((post: any, index: number) => (
                                        <BlurFade key={post.id} delay={0.1 + 0.05 * index} yOffset={0}>
                                            <div className="flex items-start gap-5">
                                                <Link className="h-[100px] aspect-[3/2] overflow-hidden border rounded-xl" to={`/forum/${post.slug}`}>
                                                    <img src={post.thumbnail} alt="avatar" className="w-full h-full object-cover" />
                                                </Link>
                                                <div className="flex-1 flex justify-between">
                                                    <div className="flex-1">
                                                        <Link className="font-bold text-base line-clamp-1" to={`/forum/${post.slug}`}>{post.title}</Link>
                                                        <p className="opacity-50 mt-1 text-sm line-clamp-2 2xl:line-clamp-3">{post.description}</p>
                                                        <span className="flex items-center gap-2 text-xs mt-3 text-green-500">{formatTimeAgo(post.createdAt, "vi")}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </BlurFade>
                                    )) :
                                    <p className="text-sm text-gray-500">
                                        Chưa có bài viết nào
                                    </p>
                            }
                        </div>
                    </TabsContent>
                </Tabs>
            </BlurFade>
        </div>
    );
};

export default Profile;