import { Link, useNavigate, useParams } from "react-router-dom"

import { useUserContext } from "@/context/AuthContext"
import { useDeletePost, useGetPostById, useGetUserPosts } from "@/lib/react-query/queries"
import { Button } from "@/components/ui/button"
import { GridPostList, Loader, PostStats } from "@/components/shared"
import { multiFormatDateString } from "@/lib/utils"

const PostDetails = () => {
    const navigate = useNavigate()
    const { id } = useParams()

    const { user } = useUserContext()

    const { data: post, isLoading } = useGetPostById(id)

    const { data: userPosts, isLoading: isUserPostLoading } = useGetUserPosts(post?.creator.$id)

    const { mutate: deletePost } = useDeletePost()

    const relatedPosts = userPosts?.documents.filter((userPost) => userPost.$id !== id)

    const handleDeletePost = () => {
        deletePost({ postId: id, imageId: post?.imageId })
        navigate(-1)
    }
    const isOwner = user?.id === post?.creator.$id
    return (
        <div className="flex flex-col flex-1 gap-10 overflow-scroll custom-scrollbar py-10 px-5 md:p-14 items-center">
            <div className="hidden md:flex max-w-5xl w-full">
                <Button
                    variant='ghost'
                    onClick={() => navigate(-1)}
                    className="flex gap-4 cursor-pointer bg-[#1f1f22] items-center justify-start hover:bg-[#2d2d30] hover:text-white"
                >
                    <img 
                        src="/assets/icons/back.svg"
                        about="back"
                        width={24}
                        height={24}
                    />
                    <p className="text-[14px] lg:text-base font-medium leading-[140%]">
                        Back
                    </p>
                </Button>
            </div>
            {isLoading || !post ? (
                <Loader />
            ) : (
                <div className="bg-[#09090A] w-full max-w-5xl rounded-[30px] flex-col flex xl:flex-row border border-[#1f1f22] xl:rounded-l-[24px]">
                    <img 
                        src={post?.imageUrl}
                        alt="post-image"
                        className="lg:h-[480px] h-[600px] xl:w-[48%] xl:rounded-l-[24px] xl:rounded-r-none object-cover p-5 bg-black"
                    />
                    <div className="bg-[#09090A] flex flex-col gap-5 lg:gap-7 flex-1 items-start p-8 rounded-[30px]">
                        <div className="flex items-center justify-between">
                            <Link 
                                to={`/profile/${post?.creator.$id}`}
                                className="flex items-center gap-3"
                            >   
                                <img 
                                    src={post?.creator.imageUrl || '/assets/icons/profile-placeholder.svg'}
                                    about="creator"
                                    className="w-8 h-8 rounded-full lg:w-12 lg:h-12"
                                />
                                <div className="flex gap-1 flex-col">
                                    <p className="text-base font-medium leading-[140%] lg:text-[18px] lg:font-bold text-white">
                                        {post?.creator.name}
                                    </p>
                                    <div className="flex items-center justify-center gap-2 text-[#7878A3]">
                                        <p className="text-[12px] font-semibold leading-[140%] lg:text-[14px] lg:font-normal">
                                            {multiFormatDateString(post?.$createdAt)}
                                        </p>
                                        •
                                        <p className="text-[12px] font-semibold leading-[140%] lg:text-[14px] lg:font-normal">
                                            {post.location}
                                        </p>
                                    </div>
                                </div>
                            </Link>
                        </div>
                        {isOwner && (
                            <div className="flex items-center justify-center gap-10">
                                <Link 
                                    to={`/update-post/${post?.$id}`}
                                    className={`${user.id !== post?.creator.$id && 'hidden'} flex gap-3`}
                                >
                                    <img 
                                        src="/assets/icons/edit.svg"
                                        about="edit"
                                        width={24}
                                        height={24}
                                    />
                                    Edit
                                </Link>
                                <Button
                                    onClick={handleDeletePost}
                                    variant='ghost'
                                    className={`${user.id !== post?.creator.$id && 'hidden'} p-0 flex gap-3 hover:bg-transparent hover:text-white  text-white text-[14px] font-medium leading-[140%] lg:text-base`}
                                >
                                    <img 
                                        src="/assets/icons/delete.svg"
                                        about="edit"
                                        width={24}
                                        height={24}
                                    />
                                    Delete
                                </Button>
                            </div>
                        )}
                        <hr className="border w-full border-[#1f1f22]/80" />

                        <div className="flex flex-col flex-1 w-full text-[14px] font-medium leading-[140%] lg:text-base lg:font-normal">
                            <p>
                                {post?.caption}
                            </p>
                            <ul className="flex gap-1 mt-2">
                                {post?.tags.map((tag: string, index: string) => (
                                    <li key={`${tag}-${index}`} className="text-[#7878a3] text-[14px] leading-[140%] font-normal">
                                        #{tag}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="w-full">
                            <PostStats post={post} userId={user.id} />
                        </div>
                    </div>
                </div>
            )}
            {relatedPosts && relatedPosts.length > 0 && (
                <div className="w-full max-w-5xl">
                    <hr className="border w-full border-[#1f1f22]/80" />
                    <h3 className="text-[18px] font-bold leading-[140%] lg:text-[24px] w-full my-10">
                        More Related Posts
                    </h3>
                    {isUserPostLoading || !relatedPosts ? (
                        <Loader />
                    ) : (
                        <GridPostList posts={relatedPosts} />
                    )}
                </div>
            )}
        </div>
    )
}

export default PostDetails