import { Link } from "react-router-dom";
import { BlogContext } from "../pages/blog.page";
import { useContext } from "react";
import { UserContext } from "../App";
import { Toaster, toast } from "react-hot-toast";
import axios from "axios";
import { useEffect } from "react";

const BlogInteraction = () => {
    const { blog, setBlog, isLikedByUser, setLikedByUser,setCommentsWrapper } = useContext(BlogContext);
    const { title, blog_id, activity, author: { personal_info: { username: author_username } } } = blog;
    const { userAuth: { username, access_token } } = useContext(UserContext);
    const { total_likes, total_comments } = activity;
    
    //let { blog : { blog_id , activity : { total_likes}, author:{personal_info :{ username: author_username}}},setBlog,isLikedByUser,setLikedByUser}= useContext(BlogContext);

    useEffect(() => {
        const checkIfLiked = async () => {
            if (access_token && blog_id) {
                try {
                    const { data: { result } } = await axios.post(
                        'http://localhost:3000/isLiked-by-user',
                        { blog_id },
                        {
                            headers: {
                                'Authorization': `Bearer ${access_token}`,
                                'Content-Type': 'application/json'
                            }
                        }
                    );
                    setLikedByUser(Boolean(result));
                } catch (err) {
                    console.error('Error fetching like status:', err.response ? err.response.data : err.message);
                }
            }
        };
        checkIfLiked();
    }, [access_token, blog_id, setLikedByUser]);

    const handleLike = async () => {
        if (access_token) {
            const updatedLikes = isLikedByUser ? total_likes - 1 : total_likes + 1;
            setLikedByUser(prevVal => !prevVal);

            setBlog(prevBlog => ({
                ...prevBlog,
                activity: {
                    ...prevBlog.activity,
                    total_likes: updatedLikes
                }
            }));

            try {
                await axios.post('http://localhost:3000/like-blog', { blog_id, isLikedByUser }, {
                    headers: {
                        'Authorization': `Bearer ${access_token}`
                    }
                });
            } catch (err) {
                console.log(err);
            }
        } else {
            toast.error("Please log in to like this blog");
        }
    };

    return (
        <>
            <Toaster />
            <hr className="border-grey my-2" />
            <div className="flex gap-6 justify-between">
                <div className="flex gap-3 items-center">
                    <button
                        onClick={handleLike}
                        className={`text-xl w-10 h-10 rounded-full flex items-center justify-center ${isLikedByUser ? "bg-red/20 text-red" : "bg-grey/80"}`}
                    >
                        <i className={`fi ${isLikedByUser ? "fi-rr-heart" : "fi-sr-heart"}`}></i>
                    </button>
                    <p className="text-xl text-dark-grey">{total_likes}</p>

                    <button
                        onClick={() => setCommentsWrapper(preVal =>!preVal)}
                        className="text-xl w-10 h-10 rounded-full flex items-center justify-center bg-grey/80"
                    >
                        <i className="fi fi-rr-comment-dots"></i>
                    </button>
                    <p className="text-xl text-dark-grey">{total_comments}</p>
                </div>,
                <div className="flex gap-6 items-center">
                    {username === author_username && (
                        <Link to={`/editor/${blog_id}`} className="text-xl hover:text-purple">Edit</Link>
                    )}
                    <Link to={`https://twitter.com/intent/tweet?text=Read ${title}&url=${location.href}`}>
                        <i className="fi fi-brands-twitter text-xl hover:text-twitter"></i>
                    </Link>
                </div>
            </div>
            <hr className="border-grey my-2" />
        </>
    );
};

export default BlogInteraction;
