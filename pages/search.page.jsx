import { useParams } from "react-router-dom";
import InPageNavigation from "../components/inpage-navigation.component";
import { useState, useEffect } from "react";
import Loader from "../components/loader.component";
import LoadMoreData from "../components/load-more.component";
import BlogPostCard from "../components/blog-post.component";
import NoDataMessage from "../components/nodata.component";
import axios from "axios";
import { filterPaginationData } from "../common/filter-pagination-data";

const SearchPage = () => {
    const { query } = useParams();
    const [blogs, setBlogs] = useState({ results: [], totalDocs: 0 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);

    const searchBlogs = async (page = 1) => {
        setLoading(true);
        setError(null);
        console.log("Searching for blogs with query:", query, "on page:", page); // Log the query and page
        try {
            const { data } = await axios.post('http://localhost:3000/search-blogs', { query, page });
            const formattedData = await filterPaginationData({
                state: blogs,
                data: data.blogs,
                page,
                countRoute: "/search-blogs-count",
                data_to_send: { query },
                create_new_arr: false
            });
            setBlogs(formattedData);
        } catch (err) {
            console.error("Error fetching blogs:", err.message); // Log the error
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const loadMoreBlogs = () => {
        if (blogs.results.length < blogs.totalDocs) {
            setPage((prevPage) => prevPage + 1);
        }
    };

    useEffect(() => {
        searchBlogs({page:1,create_new_arr: true});
    }, [query, page]);

    const resetstate=()=>{
        setBlogs(null);
    }

    return (
        <section className="h-cover flex justify-center gap-10">
            <div className="w-full">
                <InPageNavigation routes={[`Search results for "${query}"`, "Accounts Matched"]} defaultHidden={["Accounts Matched"]}>
                    <>
                        {loading ? (
                            <Loader />
                        ) : error ? (
                            <NoDataMessage message={error} />
                        ) : (
                            blogs.results.length > 0 ? (
                                blogs.results.map((blog, i) => (
                                    <BlogPostCard key={blog.id || i} content={blog} author={blog.author.personal_info} />
                                ))
                            ) : (
                                <NoDataMessage message="No blogs published" />
                            )
                        )}
                        {blogs.results.length < blogs.totalDocs && !loading && (
                            <LoadMoreData state={blogs} fetchDataFun={loadMoreBlogs} />
                        )}
                    </>
                </InPageNavigation>
            </div>
        </section>
    );
};

export default SearchPage;
