import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import { useLogin } from "@/service/LoginContext";
import Loader from "@/components/ui/loader";
import { Footer } from "@/components/Footer";

import { Route, Routes, useLocation } from "react-router-dom";

import HomePage from "@/pages/client/Home";
import Chat from "@/pages/client/Chat";
import { useEffect, useRef, useState } from "react";
import Navbar from "@/components/Navbar";
import Course from "@/pages/client/Course";
import Problem from "@/pages/client/Problem";
import SubmitProblem from "@/pages/client/SubmitProblem";
import Result from "@/pages/client/Submission";
import JoinCourse from "@/pages/client/JoinCourse";
import CourseManager from "@/pages/teacher/CourseManager";
import CourseManagerByID from "@/pages/teacher/CourseManagerByID";
import Analysis from "@/pages/teacher/Analysis";
import CreateProblem from "@/pages/teacher/CreateProblem";
import Forum from "@/pages/client/Forum";
import Problems from "@/pages/client/Problems";
import CreatePost from "@/pages/client/CreatePost";
import Courses from "@/pages/client/Courses";
import ReadPost from "@/pages/client/ReadPost";
import CreateCourse from "@/pages/teacher/CreateCourse";
import EditCourse from "@/pages/teacher/EditCourse";
import EditProblem from "@/pages/teacher/EditProblem";
import Contests from "@/pages/client/Contests";
import Contest from "@/pages/client/Contest";
import Discussion from "@/pages/client/Discussion";
import GeminiChat from "@/pages/client/GeminiChat";
import LeaderBoard from "@/pages/client/LeaderBoard";
import Profile from "@/pages/client/Profile";
import ProblemAnalysis from "@/pages/client/ProblemAnalysis";
import CourseAnalysis from "@/pages/client/CourseAnalysis";
import CourseStatistic from "@/pages/teacher/CourseStatistic";

function ClientLayout() {

    const clientContentRef = useRef<HTMLDivElement>(null);
    const [showScrollButton, setShowScrollButton] = useState(false);

    const location = useLocation();

    const loginContext = useLogin();

    useEffect(() => {
        if (clientContentRef.current) {
            clientContentRef.current.scrollTop = 0;
        }
    }, [location]);

    useEffect(() => {
        const handleScroll = () => {
            const scrollY = clientContentRef.current?.scrollTop || 0;
            setShowScrollButton(scrollY > 250);
        };

        clientContentRef.current?.addEventListener('scroll', handleScroll);

        return () => {
            clientContentRef.current?.removeEventListener('scroll', handleScroll);
        };
    }, [loginContext.loading]);

    const scrollToTop = () => {
        clientContentRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const notFooterArr = ["/message", "/gemini-chat"];

    return (
        <div className="ClientLayout flex flex-col h-[100vh]">
            {
                loginContext.loading ? <Loader /> :
                    loginContext.user ?
                        <>
                            <Header />
                            <div className="flex flex-1 overflow-hidden">
                                <Navbar />
                                <div className="flex flex-col flex-1 bg-white dark:bg-zinc-950 h-full overflow-auto justify-between" ref={clientContentRef}>
                                    <div className="flex-1">
                                        <Routes>
                                            <Route path="" element={<HomePage />} />
                                            <Route path="message/*" element={<Chat />} />
                                            <Route path="contest" >
                                                <Route path="" element={<Contests />} />
                                                <Route path=":contest_id" element={<Contest />} />
                                            </Route>
                                            <Route path="courses" element={<Courses />} />
                                            <Route path="course/:course_id">
                                                <Route path="" element={<Course />} />
                                                <Route path="analysis" element={<CourseAnalysis />} />
                                                <Route path="join" element={<JoinCourse />} />
                                            </Route>
                                            <Route path="problems" element={<Problems />} />
                                            <Route path="problem/:problem_id">
                                                <Route path="" element={<Problem />} />
                                                <Route path="submit" element={<SubmitProblem />} />
                                                <Route path="analysis" element={<ProblemAnalysis />} />
                                                <Route path="discussion/:discussion_id" element={<Discussion />} />
                                            </Route>
                                            <Route path="forum">
                                                <Route path="" element={<Forum />} />
                                                <Route path=":slug" element={<ReadPost />} />
                                                <Route path="create" element={<CreatePost />} />
                                            </Route>
                                            <Route path="leaderboard" element={<LeaderBoard />} />
                                            <Route path="profile">
                                                <Route path=":username" element={<Profile />} />
                                            </Route>
                                            <Route path="course-manager/">
                                                <Route path="" element={<CourseManager />} />
                                                <Route path="create" element={<CreateCourse />} />
                                                <Route path=":course_id">
                                                    <Route path="" element={<CourseManagerByID />} />
                                                    <Route path="statistic" element={<CourseStatistic />} />
                                                    <Route path="edit" element={<EditCourse />} />
                                                    <Route path="problem/create" element={<CreateProblem />} />
                                                    <Route path="problem/:problem_id/edit" element={<EditProblem />} />
                                                </Route>
                                            </Route>
                                            <Route path="analysis" element={<Analysis />} />
                                            <Route path="submission/:submission_id" element={<Result />} />
                                            <Route path="gemini-chat" element={<GeminiChat />} />
                                        </Routes>
                                    </div>
                                    {!notFooterArr.includes(location.pathname) && <Footer />}
                                </div>
                            </div>
                            {
                                showScrollButton &&
                                <Button variant="secondary" size="icon" className='scroll-to-top-button fixed bottom-8 right-10' onClick={scrollToTop} style={{ display: showScrollButton ? 'block' : 'none' }}>
                                    <i className='fa-solid fa-chevron-up'></i>
                                </Button>
                            }
                        </>
                        : ""
            }
        </div >
    );
};

export default ClientLayout;