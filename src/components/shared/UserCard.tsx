import type { Models } from "appwrite"
import { Link } from "react-router-dom"

import { Button } from "../ui/button"
import { useFollowUser, useUnfollowUser } from "@/lib/react-query/queries"

type UserCardProps = {
    user: Models.Document
}
const UserCard = ({ user }: UserCardProps) => {
    const { mutate: followUser } = useFollowUser()
    const { mutate: unfollowUser } = useUnfollowUser()
    return (
        <Link 
            to={`/profile/${user.$id}`}
            className="flex hover:bg-[#101012] items-center justify-center flex-col gap-4 border border-[#1f1f22] rounded-[20px] px-5 py-8"
        >
            <img 
                src={user.imageUrl || '/assets/icons/profile-placeholder.svg'} 
                alt="creator"
                className="w-14 h-14 rounded-full" 
            />
            <div className="flex items-center justify-center flex-col gap-1">
                <p className="text-base font-medium leading-[140%] text-white text-center line-clamp-1">
                    {user.name}
                </p>
                <p className="text-[14px] font-normal leading-[140%] text-[#7878A3] text-center line-clamp-1">
                    @{user.username}
                </p>
            </div>
            <Button
                type="button"
                size='sm'
                className="px-5 cursor-pointer bg-[#877EFF] hover:bg-[#877EFF] text-white flex gap-2"
            >
                Follow
            </Button>
        </Link>
    )
}

export default UserCard