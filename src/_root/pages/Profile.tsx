import { GridPostList, Loader } from "@/components/shared"
import { Button } from "@/components/ui/button"
import { useUserContext } from "@/context/AuthContext"
import { useGetUserById } from "@/lib/react-query/queries"
import { Link, Outlet, Route, Routes, useLocation, useParams } from "react-router-dom"
import LikedPosts from "./LikedPosts"

type StatBlockProps = {
    value: string | number
    label: string
}

const StatBlock = ({ value, label }: StatBlockProps) => (
    <div className="flex items-center justify-center gap-2">
        <p className="text-[14px] font-semibold leading-[140%] lg:text-[18px] lg:font-bold text-[#877EFF]">
            {value}
        </p>
        <p className="text-[14px] font-medium leading-[140%] lg:text-base text-[#efefef]">
            {label}
        </p>
    </div>
)
const Profile = () => {
    const { id } = useParams()
    const { user } = useUserContext()

    const { pathname } = useLocation()

    const { data: currentUser } = useGetUserById(id || "")

    if(!currentUser){
        return (
            <div className="flex items-center justify-center w-full h-full">
                <Loader />
            </div>
        )
    }

    return (
        <div className="flex flex-col items-center flex-1 gap-10 overflow-scroll custom-scrollbar py-10 px-5 md:p-14">
            <div className="flex items-center md:mb-8 xl:items-start gap-8 flex-col xl:flex-row relative max-w-5xl w-full">
                <div className="flex flex-col xl:flex-row max-xl:items-center flex-1 gap-7">
                    <img 
                        src={currentUser.imageUrl || '/assets/icons/profile-placeholder.svg'}
                        alt="profile"
                        className="w-28 h-28 lg:h-36 lg:w-36 rounded-full"
                    />
                    <div className="flex flex-col flex-1 justify-between md:mt-2">
                        <div className="flex flex-col w-full">
                            <h1 className="text-center xl:text-left text-[24px] font-bold leading-[140%] tracking-tighter md:text-[36px] md:font-semibold">
                                {currentUser.name}
                            </h1>
                            <p className="text-[14px] leading-[140%] font-normal md:text-[18px] text-[#7878a3] text-center xl:text-left">
                                @{currentUser.username}
                            </p>
                        </div>
                        <div className="flex gap-8 mt-10 items-center justify-center xl:justify-start flex-wrap z-20">
                            <StatBlock value={currentUser.posts.length} label="Posts" />
                            <StatBlock value={20} label="Followers" />
                            <StatBlock value={20} label="Following" />
                        </div>
                        <p className="text-[14px] font-medium leading-[140%] md:text-base text-center xl:text-left mt-7 max-w-screen-sm">
                            {currentUser.bio}
                        </p>
                    </div>
                    <div className="flex justify-center gap-4">
                        <div className={`${user.id !== currentUser.$id && 'hidden'}`}>
                            <Link 
                                to={`/update-profile/${currentUser.$id}`}
                                className={`${user.id !== currentUser.$id && 'hidden'} h-12 bg-[#1f1f22] px-5 text-white flex items-center justify-center gap-2 rounded-lg`}
                            >
                                <img 
                                    src="/assets/icons/edit.svg"
                                    about="edit"
                                    width={20}
                                    height={20}
                                />
                                <p className="flex whitespace-nowrap text-[14px] font-medium leading-[140%]">
                                    Edit Profile
                                </p>
                            </Link>
                        </div>
                        <div className={`${user.id === id && 'hidden'}`}>
                            <Button type="button" className="bg-[#877eff] hover:bg-[#4a5687] text-white flex gap-2 h-12 cursor-pointer px-8">
                                Follow
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
            {currentUser.$id === user.id && (
                <div className="flex max-w-5xl w-full">
                    <Link 
                        to={`/profile/${id}`}
                        className={`${pathname === `/profile/${id}` && "!bg-[#101012]"} rounded-l-lg flex items-center justify-center gap-3 py-4 w-48 bg-[#09090A] transition flex-1 xl:flex-initial`}    
                    >
                        <img 
                            src="/assets/icons/posts.svg"
                            about="posts"
                            width={20}
                            height={20}
                        />
                        Posts
                    </Link>
                    <Link 
                        to={`/profile/${id}/liked-posts`}
                        className={`${pathname === `/profile/${id}/liked-posts` && "!bg-[#101012]"} rounded-r-lg flex items-center justify-center gap-3 py-4 w-48 bg-[#09090A] transition flex-1 xl:flex-initial`}    
                    >
                        <img 
                            src="/assets/icons/like.svg"
                            about="like"
                            width={20}
                            height={20}
                        />
                        Liked Posts
                    </Link>
                </div>
            )}
            
            <Routes>
                <Route index element={<GridPostList posts={currentUser.posts} showUser={false} />} />
                {currentUser.$id === user.id && (
                    <Route path="/liked-posts" element={<LikedPosts />} />
                )}
            </Routes>
            <Outlet />
        </div>
    )
}

export default Profile