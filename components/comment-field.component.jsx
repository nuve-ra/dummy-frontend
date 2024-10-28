import { useContext, useState } from "react";
import { UserContext } from "../App";
import { toast, Toaster } from "react-hot-toast";
import { BlogContext } from "../pages/blog.page";
import axios from "axios";

const CommentField = ({ action }) => {
    const {
        blog,
        blog: {
            _id,
            author: { _id: blog_author },
            comments,
            comments: { results: commentsArr = [] } = {},
            activity,
            activity: { total_comments, total_parent_comments },
        },
        setBlog,
        setTotalParentCommentsLoaded,
    } = useContext(BlogContext);
    
    const { userAuth: { access_token, username, fullname, profile_img } } = useContext(UserContext);
    
    const [comment, setComment] = useState("");
    const [loading, setLoading] = useState(true);

    const handleComment = async () => {
        if (!access_token) {
            return toast.error("Kindly log in to leave a comment.");
        }
        if (!comment.trim().length) {
            return toast.error("Write something to leave a comment.");
        }
    
        try {
            setLoading(true); // Start loading
            const { data } = await axios.post(
                'http://localhost:3000/add-comment',
                { _id: blog._id, blog_author: blog.author._id, comment },
                {
                    headers: {
                        'Authorization': `Bearer ${access_token}`,
                    },
                }
            );
    
            // Reset comment field
            setComment("");

            // Prepare the new comment
            data.commented_by = { personal_info: { username, profile_img, fullname } };
            let newCommentArr;
            data.childrenLevel = 0;
            

            // Update comments array
            newCommentArr = [data, ...commentsArr || []];
            
            let parentCommentIncrementval = 1;

            // Update blog state
            setBlog(prevBlog => ({
                ...prevBlog,
                comments: { ...prevBlog.comments, results: newCommentArr }, // Use prevBlog.comments to avoid issues
                activity: {
                    ...prevBlog.activity,
                    total_comments: prevBlog.activity.total_comments + 1,
                    total_parent_comments: prevBlog.activity.total_parent_comments + parentCommentIncrementval,
                },
            }));
    
            setTotalParentCommentsLoaded(prevVal => prevVal + parentCommentIncrementval);
        } catch (err) {
            console.error("Error adding comment:", err);
            toast.error("There was an error adding your comment. Please try again.");
        } finally {
            setLoading(false); // Ensure loading state is reset
        }

    };
    

    return (
        <>
            <Toaster />
            <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Leave a comment..."
                className="input-box pl-5 placeholder:text-dark-grey resize-none h-[150px] overflow-auto"
                aria-label="Comment"
            />
            <button
                className="btn-dark mt-5 px-10"
                onClick={handleComment}
                aria-label={`Submit ${action} comment`}
            >
                {action}
            </button>
        </>
    );
};

export default CommentField;
