import { useState, useEffect, createContext } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/navbar.component"; // Ensure your Navbar includes <Outlet />
import UserAuthForm from "./pages/userAuthForm.page";
import { lookInSession } from "./common/session";
import Editor from "./pages/editor.pages.jsx"; 
import HomePage from "./pages/home.page";
import SearchPage from "./pages/search.page";
import ProfilePage from "./pages/profile.page.jsx";
import BlogPage from "./pages/blog.page.jsx";

export const UserContext = createContext({});

const App = () => {
    const [userAuth, setUserAuth] = useState({});

    useEffect(() => {
        const userInSession = lookInSession("user");
        userInSession ? setUserAuth(JSON.parse(userInSession)) : setUserAuth({ access_token: null });
    }, []);

    return (
        <UserContext.Provider value={{ userAuth, setUserAuth }}>
            <Navbar /> {/* Render the Navbar once */}
            <Routes>
                
            <Route index element={<HomePage />} />

                <Route path="editor" element={<Editor />} />
                
                <Route path="signin" element={<UserAuthForm type="sign-in" />} />
                <Route path="signup" element={<UserAuthForm type="sign-up" />} />
                <Route path="search/:query" element={<SearchPage />} />
                <Route path="user/:id" element={<ProfilePage />} />
                <Route path="blog/:blog_id" element={<BlogPage />} />
                
            </Routes>
        </UserContext.Provider>
    );
};

export default App;