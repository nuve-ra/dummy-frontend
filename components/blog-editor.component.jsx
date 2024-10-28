import { Link } from "react-router-dom";
import logo from "../imgs/logo.png";
import defaultBanner from "../imgs/blog banner.png";
import { useContext, useEffect } from "react";
import uploadImage from "../common/aws";
import { Toaster, toast } from "react-hot-toast";
import EditorJS from "@editorjs/editorjs";
import tools from "./tools.component";
import { EditorContext } from "../pages/editor.pages";

const BlogEditor = () => {
    const {
        blog = { title: '', banner: '', content: {}, tags: [], des: '' }, // Default values
        setBlog,
        textEditor,
        setTextEditor,
        setEditorState,
    } = useContext(EditorContext);

    const { title, banner } = blog; // Destructure for easier access

    useEffect(() => {
        const editor = new EditorJS({
            holder: "textEditor",
            data: Array.isArray(blog.content) ? blog.content : [], // Use blog.content instead of content
            tools: tools,
            placeholder: "Share your story",
        });
    
        setTextEditor(editor); // Save the editor instance to state
    
        return () => {
            editor.destroy(); // Clean up on unmount
        };
    }, [blog.content]); // Add blog.content as a dependency
    
    const handleBannerUpload = (e) => {
        let img = e.target.files[0];
        if (img) {
            const loadingToast = toast.loading("Uploading...");
            uploadImage(img)
                .then(url => {
                    if (url) {
                        toast.dismiss(loadingToast);
                        toast.success("Uploaded");
                        setBlog(blog => ({ ...blog, banner: url }));
                    }
                })
                .catch(err => {
                    toast.dismiss(loadingToast);
                    toast.error(err);
                });
        }
    };

    const handleTitleKeyDown = (e) => {
        if (e.key === 13) {
            e.preventDefault();
        }
    };

    const handleTitleChange = (e) => {
        let input = e.target;
        input.style.height = 'auto';
        input.style.height = input.scrollHeight + "px";
        setBlog(blog => ({ ...blog, title: input.value }));
    };

    const handleError = (e) => {
        e.target.src = defaultBanner;
    };

    const handlePublishEvent = (e) => {
        e.preventDefault();
        console.log("Publishing event triggered");

        // Check if blog is defined
        if (!blog) {
            return toast.error("Blog data is not available.");
        }

        // Ensure banner and title are defined
        if (banner === undefined || banner.length === 0) {
            return toast.error("Upload a banner to publish it");
        }
        console.log("Banner uploaded");

        if (title === undefined || title.length === 0) { 
            return toast.error("Write a blog title to publish it");
        }
        console.log("Title provided");

        if (textEditor) {
            console.log("Text editor is ready, saving...");

            textEditor.save().then(data => {
                console.log("Save response:", data);
                if (data.blocks.length) {
                    setBlog(blog => ({ ...blog, content: data }));
                    setEditorState("publish");
                    console.log("Blog published successfully");
                } else {
                    return toast.error("Write something to publish it");
                }
            }).catch(err => {
                console.error("Error saving:", err);
            });
        } else {
            console.error("Text editor is not initialized");
        }
    };

    return (
        <>
            <nav className="navbar">
                <Link to="/" className="flex-none w-10">
                    <img src={logo} alt="Logo" />
                </Link>
                <p className="max-md:hidden text-black line-clamp-1 w-full">
                    {title.length ? title : "New Blog"}
                </p>
                <div className="flex gap-4 ml-auto">
                    <button className="btn-dark py-2" onClick={handlePublishEvent}>
                        Publish
                    </button>
                    <button className="btn-light py-2" onClick={() => {/* Handle save draft */}}>
                        Save Draft
                    </button>
                </div>
            </nav>
            <Toaster />
            <section>
                <div className="mx-auto max-w-[900px] w-full">
                    <div className="relative aspect-video hover:opacity-80% bg-white border-4 border-grey">
                        <label htmlFor="uploadBanner">
                            <img
                                src={banner}
                                className="z-20"
                                onError={handleError}
                                
                            />
                            <input
                                id="uploadBanner"
                                type="file"
                                accept=".png, .jpg, .jpeg"
                                hidden
                                onChange={handleBannerUpload}
                            />
                        </label>
                    </div>
                    <textarea
                        defaultValue={title}
                        placeholder="Blog title"
                        className="text-4xl font-medium w-full h-20 outline-none resize-none mt-10 leading-tight placeholder:opacity-40 bg-blue"
                        onKeyDown={handleTitleKeyDown}
                        onChange={handleTitleChange}
                    />
                    <hr className="w-full opacity-20 my-5" />
                    <div id="textEditor" className="font-gelasio"></div>
                </div>
            </section>
        </>
    );
};

export default BlogEditor;