import { useParams } from "react-router-dom"

import PostForm from "@/components/forms/PostForm"
import { Loader } from "@/components/shared"
import { useGetPostById } from "@/lib/react-query/queries"

const EditPost = () => {
    const { id } = useParams()

    const { data: post, isLoading } = useGetPostById(id)
    
    if(isLoading) {
        return (
            <div className=" flex items-center justify-center w-full h-full">
                <Loader />
            </div>
        )
    }
    return (
        <div className="flex flex-1">
            <div className="flex flex-col flex-1 items-center gap-10 overflow-scroll py-10 px-5 md:px-8 lg:p-14 custom-scrollbar">
                <div className="flex items-center justify-start gap-3 w-full max-w-5xl">
                    <img 
                        src="/assets/icons/edit.svg"
                        width={36}
                        height={36}
                        about="edit"
                        className="invert brightness-0 transition"
                    />
                    <h2 className="text-[24px] md:text-[30px] text-left w-full font-bold leading-[140%] tracking-tighter">
                        Edit Post
                    </h2>
                </div>
                {isLoading ? (
                    <Loader />
                ) : (
                    <PostForm action="Update" post={post} />
                )}
            </div>
        </div>
    )
}

export default EditPost