import { useContext, useEffect, useState } from "react";
import { BlogContext } from "../pages/blog.page";
import CommentField from "./comment-field.component";
import axios from "axios";
import CommentCard from "./comment-card.component";

const fetchComments = async ({ skip = 0, blog_id, setParentCommentCountFun, comment_array = [] }) => {
    try {
        const { data } = await axios.post('http://localhost:3000/get-blog-comments', { blog_id, skip });
        data.forEach(comment => {
            comment.childrenLevel = 0; // Set the childrenLevel if needed
        });
        setParentCommentCountFun(prevVal => prevVal + data.length);
        return { results: [...comment_array, ...data] };
    } catch (error) {
        console.error("Error fetching comments:", error);
        return { results: [] };
    }
};

const CommentContainer = ({ id }) => {
    const { blog = {}, commentsWrapper, setCommentsWrapper } = useContext(BlogContext);
    const { title = "", comments: { results: commentsArr = [] } = {} } = blog;
    const [comments, setCommentsArr] = useState([]);
    const [skip, setSkip] = useState(0); // Initialize skip for pagination

    useEffect(() => {
        console.log("im getting triggered")
        if (id) {
            const loadComments = async () => {
                const result = await fetchComments({
                    blog_id: id,
                    skip,
                    setParentCommentCountFun: (count) => setTotalParentCommentsLoaded(count), // Update count logic here
                });
                setCommentsArr(result.results);
            };
            loadComments();
        }
    }, [id, skip]); // Dependency on skip to refetch when it changes

   // const handleLoadMore = () => {
  //      setSkip(prevSkip => prevSkip + 5); // Adjust the number as needed for your pagination
  //  };

    return (
        <div className={`max-sm:w-full fixed ${commentsWrapper ? "top-0" : "top-[100%] sm:right-[-100%]"} duration-700 w-[30%] min-w-[350px] h-full z-50 bg-white shadow-2xl p-8 px-16 overflow-y-auto overflow-x-hidden`}>
            <div className="relative">
                <h1 className="text-xl font-medium">Comments</h1>
                <p className="text-lg mt-2 w-[70%] text-dark-grey line-clamp-1">{title}</p>
                <button
                    onClick={() => setCommentsWrapper(prevVal => !prevVal)}
                    className="absolute top-0 right-0 flex justify-center items-center w-12 h-12 rounded-full bg-grey"
                >
                    <i className="fi fi-br-cross text-2xl mt-1"></i>
                </button>
            </div>
            <hr className="border-grey my-8 w-[120%] -ml -10" />
            
            <CommentField action="comment" />
            <div>                
                {commentsArr.map((comment, index) => (
                    <CommentCard key={index} leftVal={comment.childrenLevel * 4} commentData={comment} />
                ))
            }
                
                    
            </div>
        </div>
    );
};

export default CommentContainer;
