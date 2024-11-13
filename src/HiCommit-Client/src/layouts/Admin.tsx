import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import { useLogin } from "@/service/LoginContext";
import Loader from "@/components/ui/loader";
import { AdminFooter } from "@/components/Footer";

import { Route, Routes, useLocation } from "react-router-dom";

import { useEffect, useRef, useState } from "react";
import Dashboard from "@/pages/admin/Dashboard";
import AdminNavbar from "@/pages/admin/AdminNavbar";
import UserManager from "@/pages/admin/UserManager";
import PostManager from "@/pages/admin/PostManager";
import CreatePost from "@/pages/admin/CreatePost";
import EditPost from "@/pages/admin/EditPost";
import ProblemManager from "@/pages/admin/ProblemManager";
import CreateProblem from "@/pages/admin/CreateProblem";
import EditProblem from "@/pages/admin/EditProblem";
import ContestManager from "@/pages/admin/ContestManager";
import CreateContest from "@/pages/admin/CreateContest";
import EditContest from "@/pages/admin/EditContest";
import ContestDashboard from "@/pages/admin/ContestDashboard";
import CreateProblemForContest from "@/pages/admin/CreateProblemForContest";
import CourseManager from "@/pages/admin/CourseManager";
import CourseDashboard from "@/pages/admin/CourseDashboard";
import EditCourse from "@/pages/admin/EditCourse";
import CreateCourse from "@/pages/admin/CreateCourse";
import CreateProblemForCourse from "@/pages/admin/CreateProblemForCourse";
import CourseStatistic from "@/pages/admin/CourseStatistic";

function AdminLayout() {

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

    return (
        <div className="AdminLayout flex flex-col h-[100vh] bg-white dark:bg-zinc-950">
            {
                loginContext.loading ? <Loader /> :
                    loginContext.user ?
                        <>
                            <Header />
                            <div className="flex flex-1 overflow-hidden">
                                <AdminNavbar />
                                <div className="flex flex-col flex-1 h-full overflow-auto justify-between" ref={clientContentRef}>
                                    <div className="flex-1">
                                        <Routes>
                                            <Route path="" element={<Dashboard />} />
                                            <Route path="users">
                                                <Route path="" element={<UserManager />} />
                                            </Route>
                                            <Route path="courses">
                                                <Route path="" element={<CourseManager />} />
                                                <Route path="create" element={<CreateCourse />} />
                                                <Route path=":id/statistic" element={<CourseStatistic/>}/>
                                                <Route path=":id/edit" element={<EditCourse />} />
                                                <Route path=":id/problem/create" element={<CreateProblemForCourse/> }/>
                                                <Route path=":id" element={<CourseDashboard />} />
                                            </Route>
                                            <Route path="posts">
                                                <Route path="" element={<PostManager />} />
                                                <Route path="create" element={<CreatePost />} />
                                                <Route path=":id/edit" element={<EditPost />} />
                                            </Route>
                                            <Route path="problems">
                                                <Route path="" element={<ProblemManager />} />
                                                <Route path="create" element={<CreateProblem />} />
                                                <Route path=":id/edit" element={<EditProblem />} />
                                            </Route>
                                            <Route path="contests">
                                                <Route path="" element={<ContestManager />} />
                                                <Route path="create" element={<CreateContest />} />
                                                <Route path=":id/problem/create" element={<CreateProblemForContest/> }/>
                                                <Route path=":id/edit" element={<EditContest />} />
                                                <Route path=":id" element={<ContestDashboard />} />
                                            </Route>
                                        </Routes>
                                    </div>
                                    <AdminFooter />
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

export default AdminLayout;