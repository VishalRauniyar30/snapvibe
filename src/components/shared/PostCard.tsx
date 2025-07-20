import { useUserContext } from "@/context/AuthContext"
import { multiFormatDateString } from "@/lib/utils"
import type { Models } from "appwrite"
import { Link } from "react-router-dom"
import PostStats from "./PostStats"

type PostCardProps = {
    post: Models.Document
}

const PostCard = ({ post }: PostCardProps) => {
    const { user } = useUserContext()

    if(!post.creator) return

    return (
        <div className="bg-[#09090A] rounded-3xl border border-[#1F1F22] p-5 lg:p-7 w-full max-w-screen-sm">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Link to={`/profile/${post.creator.$id}`}>
                        <img 
                            src={post.creator?.imageUrl || '/assets/icons/profile-placeholder.svg'}
                            className="w-12 lg:h-12 rounded-full" 
                            alt="creator" 
                        />
                    </Link>
                    <div className="flex flex-col">
                        <p className="text-base font-medium leading-[140%] lg:text-[18px] lg:font-bold text-white">
                            {post.creator.name}
                        </p>
                        <div className="flex items-center justify-center gap-2 text-[#7878A3]">
                            <p className="text-[12px] font-semibold leading-[140%] lg:text-[14px] lg:font-normal">
                                {multiFormatDateString(post.$createdAt)}
                            </p>
                            •
                            <p className="text-[12px] font-semibold leading-[140%] lg:text-[14px] lg:font-normal">
                                {post.location}
                            </p>
                        </div>
                    </div>
                </div>
                <Link 
                    to={`/update-post/${post.$id}`}
                    className={`${user.id !== post.creator.$id && 'hidden'}`}
                >
                    <img src="/assets/icons/edit.svg" alt="edit" width={20} height={20} />
                </Link>
            </div>
            <Link to={`/posts/${post.$id}`}>
                <div className="text-[14px] font-medium leading-[140%] lg:text-base py-5">
                    <p>{post.caption}</p>
                    <ul className="flex gap-1 mt-2">
                        {post.tags.map((tag: string, index: string) => (
                            <li key={`${tag}${index}`} className="text-[#7878A3] text-[14px] font-normal leading-[140%]">
                                #{tag}
                            </li>
                        ))}
                    </ul>
                </div>
                <img 
                    src={post.imageUrl || '/assets/icons/profile-placeholder.svg'} 
                    alt="post image"
                    className="h-64 md:h-[400px] lg:h-[450px] w-full rounded-3xl object-cover mb-5" 
                />
            </Link>
            <PostStats post={post} userId={user.id} />
        </div>
    )
}

export default PostCard