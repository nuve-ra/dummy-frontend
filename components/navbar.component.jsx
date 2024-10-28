import logo from "../imgs/logo.png"; // Ensure the logo path is correct
import { Link, Outlet, useNavigate } from "react-router-dom"; 
import { useState, useContext } from "react";
import { UserContext } from "../App"; // Ensure this path is correct
import UserNavigationPanel from "../components/user-navigation.component.jsx"; // Ensure this path is correct

const Navbar = () => {
    const [searchBoxVisibility, setSearchBoxVisibility] = useState(false);
    const [userNavPanel, setUserNavPanel] = useState(false);
    const navigate = useNavigate();
    const { userAuth } = useContext(UserContext) || {}; // Safe destructuring
    const access_token = userAuth?.access_token; // Safe access to access_token
    const profile_img = userAuth?.profile_img; // Safe access to profile_img

    const handleUserNavPanel = () => {
        setUserNavPanel(currentVal => !currentVal);
    };

    const handleSearch = (e) => {
        const query = e.target.value;

        if (e.keyCode === 13 && query.length) {
            navigate(`/search/${query}`);
        }
    };

    const handleBlur = () => {
        setTimeout(() => {
            setUserNavPanel(false);
        }, 200);
    };

    return (
        <>
            <nav className="navbar">
                <Link to="/" className="flex-none w-10">
                    <img src={logo} className="flex-none w-10" alt="Logo" />
                </Link>

                <div className={`absolute bg-white w-full left-0 top-full mt-0.5 border-b border-grey 
                    py-4 px-[5vw] md:border-0 md:block md:relative 
                    md:inset-0 md:p-0 md:w-auto ${searchBoxVisibility ? 'block' : 'hidden'}`}>
                    <input
                        type="text"
                        placeholder="Search"
                        className="w-full md:w-auto bg-grey p-4 pl-6 pr-[12%] 
                        md:pr-6 rounded-full placeholder:text-dark-grey"
                        onKeyDown={handleSearch}
                    />
                    <i className="fi fi-rr-search absolute right-[60%] md:pointer-events-none 
                        md:right-5 top-1/2 -translate-y-1/2 text-2xl text-dark-grey"></i>
                </div>

                <div className="flex items-center gap-3 md:gap-6 ml-auto">
                    <button 
                        className="md:hidden bg-grey w-12 h-12 rounded-full flex-center justify-center"
                        onClick={() => setSearchBoxVisibility(currentVal => !currentVal)}>
                        <i className="fi fi-rr-search text-xl"></i>
                    </button>
                    <Link to="/editor" className="md:flex gap-2 link">
                        <i className="fi fi-rr-edit"></i>
                        <p>Write</p>
                    </Link>

                    {!access_token ? (
                        <>
                            <Link className="btn-dark py-2" to="/signin">Sign In</Link>
                            <Link className="btn-light py-2" to="/signup">Sign Up</Link>
                        </>
                    ) : (
                        <>
                            <Link to="/dashboard/notification">
                                <button className="w-12 h-12 rounded-full bg-grey relative hover:bg-black/10">
                                    <i className="fi fi-rr-bell text-2xl block mt-1"></i>
                                </button>
                            </Link>
                            <div className="relative" onClick={handleUserNavPanel} onBlur={handleBlur}>
                                <button className="w-12 h-12 mt-1">
                                    {profile_img ? (
                                        <img src={profile_img} className="w-full h-full object-cover rounded-full" alt="Profile" />
                                    ) : (
                                        <i className="fi fi-rr-user text-2xl"></i> // Fallback if no profile image
                                    )}
                                    {userNavPanel && <UserNavigationPanel />}
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </nav>
          <Outlet />
        </>
    );
};

export default Navbar;