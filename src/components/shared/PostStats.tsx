import { useDeleteSavedPost, useGetCurrentUser, useLikePost, useSavePost } from "@/lib/react-query/queries";
import { checkIsLiked } from "@/lib/utils";
import type { Models } from "appwrite"
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

type PostStatsProps = {
    post: Models.Document;
    userId: string;
}
const PostStats = ({ post, userId }: PostStatsProps) => {
    const { pathname } = useLocation()
    const likesList = post.likes.map((user: Models.Document) => user.$id)

    const [likes, setLikes] = useState<string[]>(likesList)
    const [isSaved, setIsSaved] = useState(false)

    const { mutate: likePost } = useLikePost()
    const { mutate: savePost } = useSavePost()
    const { mutate: deleteSavePost } = useDeleteSavedPost()

    const { data: currentUser } = useGetCurrentUser()

    const savedPostRecord = currentUser?.save.find((record: Models.Document) => record.post.$id === post.$id)

    useEffect(() => {
        setIsSaved(!!savedPostRecord)
    }, [currentUser])

    const handleLikePost = (e: React.MouseEvent<HTMLImageElement, MouseEvent>) => {
        e.stopPropagation()

        let likesArray = [...likes]

        if(likesArray.includes(userId)) {
            likesArray = likesArray.filter((Id) => Id !== userId)
        } else {
            likesArray.push(userId)
        }

        setLikes(likesArray)
        likePost({ postId: post.$id, likesArray })
    }

    const handleSavePost = (e: React.MouseEvent<HTMLImageElement, MouseEvent>) => {
        e.stopPropagation()

        if(savedPostRecord) {
            setIsSaved(false)
            return deleteSavePost(savedPostRecord.$id)
        }

        savePost({ userId: userId, postId: post.$id })
        setIsSaved(true)
    }

    const containerStyles = pathname.startsWith("/profile") ? "w-full" : ""

    return (
        <div className={`flex justify-between items-center z-20 ${containerStyles}`}>
            <div className="flex gap-2 mr-5">
                <img 
                    src={`
                        ${checkIsLiked(likes, userId) ? 
                        "/assets/icons/liked.svg" : 
                        "/assets/icons/like.svg"}`
                    }
                    alt="like"
                    width={20}
                    height={20}
                    onClick={(e) => handleLikePost(e)}
                    className="cursor-pointer"
                />
                <p className="text-[14px] font-medium leading-[140%] lg:text-base">
                    {likes.length}
                </p>
            </div>
            <div className="flex gap-2">
                <img
                    src={isSaved ? '/assets/icons/saved.svg' : '/assets/icons/save.svg'}
                    alt="save"
                    width={20}
                    height={20}
                    onClick={(e) => handleSavePost(e)}
                    className="cursor-pointer"
                />
            </div>
        </div>
    )
}

export default PostStats