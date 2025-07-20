import type { Models } from "appwrite"

import { Loader, PostCard, UserCard } from "@/components/shared"
import { useGetRecentPosts, useGetUsers } from "@/lib/react-query/queries"

const Home = () => {
    const { data: posts, isLoading: isPostLoading, isError: isErrorPosts } = useGetRecentPosts()

    const { data: creators, isLoading: isUserLoading, isError: isErrorCreators } = useGetUsers(10)

    if(isErrorCreators || isErrorPosts) {
        return (
            <div className="flex flex-1">
                <div className="flex flex-col flex-1 items-center gap-10 overflow-scroll py-10 px-5 md:px-8 lg:p-14 custom-scrollbar">
                    <p className="text-[18px] font-medium leading-[140%] text-white">
                        Something Bad Happened
                    </p>
                </div>
                <div className="hidden xl:flex flex-col w-72 2xl:w-[465px] px-6 py-10 gap-10 overflow-scroll custom-scrollbar">
                    <p className="text-[18px] font-medium leading-[140%] text-white">
                        Something Bad Happened
                    </p>
                </div>
            </div>
        )
    }

    return (
       <div className="flex flex-1">
            <div className="flex flex-col flex-1 items-center gap-10 overflow-scroll py-10 px-5 md:px-8 lg:p-14 custom-scrollbar">
                <div className="max-w-screen-sm flex flex-col items-center w-full gap-6 md:gap-9">
                    <h2 className="text-[24px] font-bold leading-[140%] tracking-tighter md:text-[30px] text-left w-full">
                        Home Feed
                    </h2>
                    {isPostLoading && !posts ? (
                        <div className="flex items-center justify-center w-full h-full">
                            <Loader />
                        </div>
                    ) : (
                        <ul className="flex flex-col flex-1 gap-9 w-full">
                            {posts?.documents.map((post: Models.Document) => (
                                <li key={post.$id} className="flex justify-center w-full">
                                    <PostCard post={post} />
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
            <div className="hidden xl:flex flex-col w-72 2xl:w-[465px] px-6 py-10 gap-10 overflow-scroll custom-scrollbar">
                <h3 className="text-[24px] font-bold leading-[140%] tracking-tighter text-white">
                    Top Creators
                </h3>
                {isUserLoading && !creators ? (
                    <Loader />
                ) : (
                    <ul className="grid 2xl:grid-cols-2 gap-6">
                        {creators?.documents.map((creator) => (
                            <li key={creator?.$id}>
                                <UserCard user={creator} />
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    )
}

export default Home