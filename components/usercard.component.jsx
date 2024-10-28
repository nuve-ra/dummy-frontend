import {Link} from "react-router-dom";

const UserCard=({ user }) =>{
    let {prsonal_info: {fullname,username,profile_img}} =user;
    return(
        <Link to ={`{/user/${username}`} className="flex gap-5 items-center mb-5">
        <img src={profile_img} className="w-14 h-14 roundedfull"/>
        </Link>
    )
}