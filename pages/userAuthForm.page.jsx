import { useContext, useRef, useState } from "react";
import InputBox from "../components/input.component";
import googleIcon from "../imgs/google.png";
import { Link, Navigate } from "react-router-dom"; 
import axios from "axios";
import { Toaster, toast } from "react-hot-toast";
import { storeInSession } from "../common/session"; // Ensure the correct path
import { UserContext } from "../App";
import { authWithGoogle } from '../common/firebase'; // Ensure the correct path

const UserAuthForm = ({ type }) => {
    const authForm = useRef();
    const { userAuth, setUserAuth } = useContext(UserContext);
    const [loading, setLoading] = useState(false); // Loading state

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); // Start loading

        const form = new FormData(authForm.current);
        let formData = {};
        
        for (let [key, value] of form.entries()) {
            formData[key] = value;
        }

        let serverRoute = type === "sign-in" ? "/signin" : "/signup";

        // Form validation
        const { fullname, email, password } = formData;

        if (type !== "sign-in" && (!fullname || fullname.length < 3)) {
            toast.error("Fullname should be at least 3 letters long");
            setLoading(false);
            return;
        }
    
        const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (!email || !emailRegex.test(email)) {
            toast.error("Invalid email");
            setLoading(false);
            return;
        }
    
        const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;
        if (!password || !passwordRegex.test(password)) {
            toast.error("Password must be between 6 to 20 characters long, contain at least one numeric digit, one uppercase and one lowercase letter");
            setLoading(false);
            return;
        }

        try {
            const { data } = await axios.post(`${import.meta.env.VITE_SERVER_DOMAIN}${serverRoute}`, formData);
            storeInSession("user", JSON.stringify(data));
            setUserAuth(data);
        } catch ({ response }) {
            toast.error(response.data.error || "An error occurred");
        } finally {
            setLoading(false); // Stop loading
        }
    };

    const handleGoogleAuth = async (e) => {
        e.preventDefault();
        setLoading(true); // Start loading
        try {
            const user = await authWithGoogle();
            const serverRoute = "/google-auth";
            const formData = { access_token: user.user.accessToken };

            const { data } = await axios.post(`${import.meta.env.VITE_SERVER_DOMAIN}${serverRoute}`, formData);
            storeInSession("user", JSON.stringify(data));
            setUserAuth(data);
        } catch (err) {
            toast.error('Trouble logging in through Google');
            console.error(err);
        } finally {
            setLoading(false); // Stop loading
        }
    };

    return (
        userAuth?.access_token ? (
            <Navigate to="/" />
        ) : (
            <section className="h-cover flex items-center justify-center">
                <Toaster />
                <form ref={authForm} className="w-[80%] max-w-[400px]" onSubmit={handleSubmit}>
                    <h1 className="text-4xl font-gelasio capitalize text-center mb-24">
                        {type === "sign-in" ? "Welcome Back" : "Join us Today"}
                    </h1>
                    {type !== "sign-in" && (
                        <InputBox
                            name="fullname"
                            type="text"
                            placeholder="Full Name"
                            icon="fi-rr-user"
                        />
                    )}
                    <InputBox
                        name="email"
                        type="email"
                        placeholder="Email"
                        icon="fi-rr-envelope"
                    />
                    <InputBox
                        name="password"
                        type="password"
                        placeholder="Password"
                        icon="fi-rr-key"
                    />
                    <button className="btn-dark center mt-14" type="submit" disabled={loading}>
                        {loading ? "Loading..." : type.replace("-", "")}
                    </button>
                    <div className="relative w-full flex items-center gap-2 my-10 opacity-10 uppercase text-black font-bold">
                        <hr className="w-1/2 border-black" />
                        or
                        <hr className="w-1/2 border-black" />
                    </div>
                    <button className="btn-dark flex items-center justify-center gap-4 w-[90%] center" onClick={handleGoogleAuth} disabled={loading}>
                        <img src={googleIcon} className="w-5" alt="Google icon" />
                        {loading ? "Loading..." : "Sign in with Google"}
                    </button>
                    {type === "sign-in" ? (
                        <p className="mt-6 text-dark-grey text-xl text-center">
                            Don't have an account?
                            <Link to="/signup" className="underline text-color text-xl ml-1"> Join us today.</Link>
                        </p>
                    ) : (
                        <p className="mt-6 text-dark-grey text-xl text-center">
                            Already have an account?
                            <Link to="/signin" className="underline text-color text-xl ml-1"> Sign in.</Link>
                        </p>
                    )}
                </form>
            </section>
        )
    );
};

export default UserAuthForm;
