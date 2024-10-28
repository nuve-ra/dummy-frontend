import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import Loader from "../components/loader.component";
import AboutUser from "../components/about.component";
import { filterPaginationData } from "../common/filter-pagination-data";
import InPageNavigation from "../components/inpage-navigation.component";
import BlogPostCard from "../components/blog-post.component";
import NoDataMessage from "../components/nodata.component";
import LoadMoreData from "../components/load-more.component";

export const profileDataStructure = {
    personal_info: {
        fullname: "",
        username: "",
        profile_img: "",
        bio: "",
    },
    account_info: {
        total_posts: 0,
        total_reads: 0,
    },
    social_links: {},
    joinedAt: "",
};

const ProfilePage = () => {
    const { id: profileId } = useParams();

    const [profile, setProfile] = useState(profileDataStructure);
    const [loading, setLoading] = useState(true);
    const [blogs, setBlogs] = useState(null);

    const { 
        personal_info: { fullname, username: profileUsername, profile_img, bio }, 
        account_info: { total_posts, total_reads }, 
        social_links, 
        joinedAt 
    } = profile;

    const fetchUserProfile = async () => {
        try {
            const { data: user } = await axios.post('http://localhost:3000/get-profile', { username: profileId });
            setProfile(user);
            getBlogs({ user_id: user._id });
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        resetStates();
        fetchUserProfile();
    }, [profileId]);

    const getBlogs = async ({ page = 1, user_id }) => {
        user_id = user_id === undefined ? blogs?.user_id : user_id;
        try {
            const { data } = await axios.post('http://localhost:3000/search-blogs', { author: user_id, page });
            const formattedData = await filterPaginationData({
                state: blogs,
                data: data.blogs,
                page,
                countRoute: "/search-blogs-count",
                data_to_send: { author: user_id }
            });
            formattedData.user_id = user_id;
            setBlogs(formattedData);
        } catch (err) {
            console.error(err);
        }
    };

    const resetStates = () => {
        setProfile(profileDataStructure);
        setLoading(false);
    };

    return (
        <>
            {loading ? (
                <Loader />
            ) : (
                <section className="h-cover md:flex flex-row-reverse items-start gap-5 min-[1100px]:gap-12">
                    <div className="flex flex-col max-md:items-center gap-5 min-w-[250px]">
                        <img src={profile_img} alt={`${fullname}'s profile`} className="w-48 h-48 bg-grey rounded-full md:w-32 md:h-32" />
                        <h1 className="text-2xl font-medium">@{profileUsername}</h1>
                        <p className="text-xl font-capitalize h-6">{fullname}</p>
                        <p>{total_posts.toLocaleString()} Blogs - {total_reads.toLocaleString()} Views</p>

                        <div className="flex gap-4 mt-2"></div>
                        {profileId === profileUsername && (
                            <Link to="/settings/edit-profile" className="btn-light rounded mt-2">Edit Profile</Link>
                        )}
                    </div>
                    <AboutUser className="max:hidden" bio={bio} social_links={social_links} joinedAt={joinedAt} />
                    <div className="max-md:mt-12">
                        <InPageNavigation routes={["Blogs Published", "About"]} defaultHidden={["About"]}>
                            <>
                                {blogs === null ? (
                                    <Loader />
                                ) : blogs.results.length ? (
                                    blogs.results.map((blog, i) => (
                                        <BlogPostCard key={i} content={blog} author={blog.author.personal_info} />
                                    ))
                                ) : (
                                    <NoDataMessage message="No blogs published" />
                                )}
                                <LoadMoreData state={blogs} fetchDataFun={getBlogs} />
                            </>
                        </InPageNavigation>
                    </div>
                </section>
            )}
        </>
    );
};

export default ProfilePage;
