import { GridPostList, Loader } from "@/components/shared"
import { useGetCurrentUser } from "@/lib/react-query/queries"

const LikedPosts = () => {
    const { data: currentUser } = useGetCurrentUser()

    if(!currentUser) {
        return (
            <div className="flex items-center justify-center w-full h-full">
                <Loader />
            </div>
        )
    }

    return (
        <>
            {currentUser.liked.length === 0 ? (
                <p className="text-[#5c5c7b]">
                    No Liked Posts
                </p>
            ) : (
                <GridPostList posts={currentUser.liked} showStats={false} />
            )}   
        </>
    )
}

export default LikedPosts