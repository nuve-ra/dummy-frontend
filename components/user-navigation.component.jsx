import { useContext } from "react"; 
import { Link } from "react-router-dom";
import { UserContext } from "../App"; 
import { removeFromSession } from "../common/session";

const UserNavigationPanel = () => {
    const { userAuth: { username }, setUserAuth } = useContext(UserContext);

    const signOutUser = () => {
        removeFromSession("user");
        setUserAuth({ access_token: null, username: null }); // Clear username as well
    }

    return (
            
            <div className="bg-white absolute right-0 border border-grey shadow-lg w-60 overflow-hidden duration-200">
                <ul className="p-4">
                    <li>
                        <Link to="/editor" className="flex gap-2 link md:hidden pl-8 py-4">
                            <i className="fi fi-rr-file-edit"></i>
                            <p>Write</p>
                        </Link>
                    </li>
                    <li>
                        <Link to={`/user/${username}`} className="link pl-8 py-4">
                            Profile
                        </Link>
                    </li>
                    <li>
                        <Link to="/dashboard/blog" className="link pl-8 py-4">
                            My Blogs
                        </Link>
                    </li>
                    <li>
                        <Link to="/settings/edit-profile" className="link pl-8 py-4">
                            Settings
                        </Link>
                    </li>
                    <li>
                        <button 
                            className="text-left w-full pl-8 py-4 hover:bg-grey"
                            onClick={signOutUser}
                        >
                            <h1 className="font-bold text-xl">Sign Out</h1>
                            <p className="text-dark-grey">@{username}</p>
                        </button>
                    </li>
                </ul>
            </div>
        
    );
};

export default UserNavigationPanel;
