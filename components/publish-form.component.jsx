import { useContext } from "react";
import { toast, Toaster } from "react-hot-toast";
import { EditorContext } from "../pages/editor.pages";
import Tag from "./tags.component";
import { UserContext } from "../App";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const PublishForm = () => {
    const characterLimit = 200;
    const tagLimit = 10;

    const { blog = { title: '', des: '', content: {}, tags: [], banner: '' }, setEditorState, setBlog } = useContext(EditorContext);
    const { userAuth: { access_token } = {} } = useContext(UserContext);
    const navigate = useNavigate();

    const handleCloseEvent = () => {
        setEditorState("editor");
    };

    const handleBlogTitleChange = (e) => {
        setBlog({ ...blog, title: e.target.value });
    };

    const handleBlogDesChange = (e) => {
        if (e.target.value.length <= characterLimit) {
            setBlog({ ...blog, des: e.target.value });
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" || e.key === ",") {
            e.preventDefault();
            const tag = e.target.value.trim();
            const currentTags = blog.tags || []; // Safely access current tags

            if (currentTags.length < tagLimit && !currentTags.includes(tag) && tag.length) {
                setBlog({ ...blog, tags: [...currentTags, tag] }); // Correctly update the tags
                e.target.value = ""; // Clear the input
            } else {
                toast.error(`You can add a maximum of ${tagLimit} tags.`);
            }
        }
    };

    const publishBlog = async (e) => {
        if (e.target.className.includes('disable')) {
            return;
        }

        if (!blog.title?.length) {
            return toast.error("Write a blog title before publishing");
        }

        const blogContent = blog.content || {};
        if (!Object.keys(blogContent).length) {
            return toast.error("Write some content before publishing");
        }

        const loadingToast = toast.loading("Publishing...");
        e.target.classList.add('disable');

        const { title = '', banner = '', des = '', content = {}, tags = [] } = blog;

        let blogObj = {
            title,
            banner,
            des,
            content,
            tags,
            draft: false,
        };

        try {
            await axios.post('http://localhost:3000/create-blog', blogObj, {
                headers: {
                    'Authorization': `Bearer ${access_token}`,
                },
            });
            toast.dismiss(loadingToast);
            toast.success("Published");
            setTimeout(() => {
                navigate("/"); 
            }, 500);
        } catch (error) {
            e.target.classList.remove('disable');
            toast.dismiss(loadingToast);
            return toast.error(error.response?.data?.error || "An error occurred");
        }
    };

    return (
        <section className="w-screen min-h-screen grid justify-start items-left lg:grid-cols-2 py-16 lg:gap-4">
            <Toaster />

            <button 
                className="w-12 h-12 absolute right-[5vw] z-10 top-[5%] lg:top-[10%]" 
                onClick={handleCloseEvent} 
                aria-label="Close editor"
            >
                <i className="fi fi-rr-cross"></i>
            </button>

            <div className="max-w-[550px] center">
                <p className="text-dark-grey mb-1">Preview</p>
            </div>

            <div className="flex flex-col lg:flex-row w-full items-start mt-4">
                <div className="w-full aspect-video rounded-lg overflow-hidden bg-grey">
                    <img src={blog.banner || ''} alt="Banner" className="w-full h-full object-cover" />
                </div>

                <div className="lg:w-1/2 lg:pl-4 mt-4 lg:mt-0">
                    <h1 className="text-4xl font-medium leading-tight line-clamp-1">{blog.title || 'Untitled'}</h1>
                    <p className="font-gelasio line-clamp-2 text-xl leading-7 mt-4">{blog.des || 'No description provided.'}</p>

                    <div className="border-grey lg:border-1 lg:pl-8 mt-4">
                        <p className="text-dark-grey mb-2">Blog Title</p>
                        <input 
                            type="text" 
                            placeholder="Blog Title" 
                            value={blog.title || ''} 
                            className="input-box pl-4" 
                            onChange={handleBlogTitleChange} 
                        />
                    </div>

                    <div className="border-grey lg:border-1 lg:pl-8 mt-4">
                        <p className="text-dark-grey mb-2">Short description about your blog</p>
                        <textarea
                            maxLength={characterLimit}
                            value={blog.des || ''}
                            className="h-40 resize-none leading-7 input-box pl-4"
                            onChange={handleBlogDesChange}
                            onKeyDown={handleKeyDown}
                        />
                        <p className="mt-1 text-dark-grey text-sm text-right">{characterLimit - (blog.des?.length || 0)} characters left</p>
                        <p className="text-dark-grey mb-2 mt-9">Topics - ( Help in searching and ranking your blog post )</p>
                        <div className="relative input-box pl-2 py-2 pb-4">
                            <input 
                                type="text" 
                                placeholder="Topic" 
                                className="sticky input-box bg-white top-0 left-0 pl-4 mb-3 focus:bg-white" 
                                onKeyDown={handleKeyDown} 
                            />
                            {Array.isArray(blog.tags) && blog.tags.map((tag, i) => (
                                <Tag tag={tag} tagIndex={i} key={i} /> // Pass the correct props
                            ))}
                        </div>
                        <p className="mt-1 mb-4 text-dark-grey text-right">{tagLimit - (blog.tags?.length || 0)} Tags left</p>
                        <button className="btn-dark px-8" onClick={publishBlog}>Publish</button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default PublishForm;
