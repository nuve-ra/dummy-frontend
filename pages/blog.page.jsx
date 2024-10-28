import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Loader from "../components/loader.component.jsx";
import getDay from "../common/date";
import BlogContent from "../components/blog-content.component.jsx";
import BlogInteraction from "../components/blog-interaction.component.jsx";
import  CommentsContainer  from "../components/comments.component.jsx";
import fetchComments  from "../components/comments.component.jsx";


export const blogStructure ={
    title: '',
    banner: '',
    content:[],
    tag:[],
    des: '',
    activity: { personal_info: {}, total_likes: 0 },
    author: { personal_info: { }},
    publishedAt:' '
}

export const BlogContext = createContext({});

const BlogPage = () => {
    let { blog_id } = useParams();
    const [blog, setBlog] = useState(blogStructure);
    const [loading, setLoading] = useState(true);
    let [ isLikedByUser,setLikedByUser] = useState(false);
    let [commentsWrapper,setCommentsWrapper] = useState(false);
    const [totalParentCommentsLoaded,setTotalParentCommentsLoaded] =useState(0);

    const {
        title,
        content= [],
        banner,
        author: { personal_info: { fullname = '', username: author_username = '', profile_img = '' } } = {},
        publishedAt = ''
    } = blog;


    
    const fetchBlog = () => {
        axios.post('http://localhost:3000/get-blog', { blog_id })
            .then(async({ data: { blog } }) => {

             // blog.comments = await fetchComments({blog_id: blog._id, setParentCommentcountFun: setTotalParentCommentsLoaded});
                
                setBlog(blog);
                
                setLoading(false);
            })
            .catch(err => {
                
               setLoading(false);
            });
    };



    useEffect(() => {
        resetStates();
        fetchBlog();
    }, [blog_id]);

    const resetStates = () => {
        setBlog(blogStructure);
        setLoading(true);
        setLikedByUser(false);
        setCommentsWrapper(false);
      //  setTotalParentCommentsLoaded(0);
    };

    return (
        <>
            {loading ? <Loader /> : (
                <BlogContext.Provider value={{ blog, setBlog,isLikedByUser ,setLikedByUser,commentsWrapper,setCommentsWrapper,totalParentCommentsLoaded,setTotalParentCommentsLoaded }}>

                    <CommentsContainer />
                    <div className="max-w-[900px] center py-10 max-lg:px-[5vw]">
                        <img src={banner} className="aspect-video" alt={title} />
                        <div className="mt-12">
                            <h2>{title}</h2>
                            <div className="flex max-sm:flex-col justify-between my-8">
                                <div className="flex gap-5 items-start">
                                    <img src={profile_img} className="w-12 h-12 rounded-full" alt={fullname} />
                                    <p className="capitalize">
                                        {fullname}
                                        <br />
                                        @
                                        <Link to={`/user/${author_username}`} className="underline">{author_username}</Link>
                                    </p>
                                </div>
                                <p className="text-dark-grey opacity-75 max-sm:mt-6 max-sm:ml-12 max-sm:pl-5">
                                    Published on {getDay(publishedAt)}
                                </p>
                            </div>
                        </div>

                        <BlogInteraction />
                        <div className="my-12 font-gelasio blog-page-content">
                            {content.length > 0 && content[0].blocks.map((block, i) => (
                                <div key={i} className="my-4 md:my-8">
                                    <BlogContent block={block} />
                                </div>
                            ))}
                        </div>
                    </div>
                </BlogContext.Provider>
            )}
        </>
    );
};

export default BlogPage;
