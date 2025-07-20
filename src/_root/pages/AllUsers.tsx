import { Loader, UserCard } from "@/components/shared"
import { useToast } from "@/components/ui/use-toast"
import { useGetUsers } from "@/lib/react-query/queries"

const AllUsers = () => {
    const { toast } = useToast()
    const { data: creators, isLoading, isError } = useGetUsers()

    if(isError) {
        toast({ title: 'Something Went Wrong' })
        return
    }

    return (
        <div className="flex flex-col flex-1 items-center gap-10 overflow-scroll custom-scrollbar py-10 px-5 md:px-8 lg:p-14">
            <div className="max-w-5xl flex flex-col items-start w-full gap-6 md:gap-9">
                <h2 className="text-[24px] md:text-[30px] text-left w-full font-bold leading-[140%]">
                    All Users
                </h2>
                {isLoading && !creators ? (
                    <Loader />
                ) : (
                    <ul className="w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-7 max-w-5xl">
                        {creators?.documents.map((creator) => (
                            <li key={creator.$id} className="flex-1 min-w-[200px] w-full">
                                <UserCard user={creator} />
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    )
}

export default AllUsers