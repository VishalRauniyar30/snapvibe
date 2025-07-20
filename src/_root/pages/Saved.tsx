import type { Models } from "appwrite"

import { GridPostList, Loader } from "@/components/shared"
import { useGetCurrentUser } from "@/lib/react-query/queries"

const Saved = () => {
    const { data: currentUser } = useGetCurrentUser()
    
    const savePosts = currentUser?.save.map((savePost: Models.Document) => ({
        ...savePost.post,
        creator: {
            imageUrl: currentUser.imageUrl
        }
    })).reverse()


    return (
        <div className="flex flex-col flex-1 items-center gap-10 py-10 px-5 md:px-8 lg:p-14 overflow-scrollbar">
            <div className="flex gap-2 w-full max-w-5xl">
                <img 
                    src="/assets/icons/save.svg"
                    width={36}
                    height={36}
                    about="edit"
                    className="invert brightness-0 transition"
                />
                <h2 className="text-[24px] md:text-[30px] text-left w-full font-bold leading-[140%]">
                    Saved Posts
                </h2>
            </div>
            {!currentUser ? (
                <Loader />
            ) : (
                <ul className="w-full flex justify-center max-w-5xl gap-9">
                    {savePosts.length === 0 ? (
                        <p className="text-[#5C5C7B]">
                            No Available Posts
                        </p>
                    ) : (
                        <GridPostList posts={savePosts} showStats={false} />
                    )}
                </ul>
            )}
        </div>
    )
}

export default Saved