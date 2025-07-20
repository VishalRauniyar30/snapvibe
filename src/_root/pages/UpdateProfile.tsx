import { useNavigate, useParams } from "react-router-dom"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from 'zod'

import { Loader, ProfileUploader } from "@/components/shared"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { useUserContext } from "@/context/AuthContext"
import { useGetUserById, useUpdateUser } from "@/lib/react-query/queries"
import { ProfileValidation } from "@/lib/validation"

const UpdateProfile = () => {
    const { toast } = useToast()
    const navigate = useNavigate()
    const { id } = useParams()
    const { user, setUser } = useUserContext()

    const form = useForm<z.infer<typeof ProfileValidation>>({
        resolver: zodResolver(ProfileValidation),
        defaultValues: {
            file: [],
            name: user.name,
            username: user.username,
            email: user.email,
            bio: user.bio
        }
    })

    const { data: currentUser } = useGetUserById(id || "")

    const { mutateAsync: updateUser, isPending } = useUpdateUser()

    if(!currentUser) {
        return (
            <div className="flex items-center justify-center w-full h-full">
                <Loader />
            </div>
        )
    }

    const handleUpdate = async (value: z.infer<typeof ProfileValidation>) => {
        const updatedUser = await updateUser({
            userId: currentUser.$id,
            name: value.name,
            bio: value.bio,
            file: value.file,
            imageUrl: currentUser.imageUrl,
            imageId: currentUser.imageId
        })

        if(!updatedUser) {
            toast({ title:'Update User Failed, Please Try Again' })
        }

        setUser({
            ...user,
            name: updatedUser?.name,
            bio: updatedUser?.bio,
            imageUrl: updatedUser?.imageUrl
        })

        return navigate(`/profile/${id}`)
    }

    return (
        <div className="flex flex-1">
            <div className="flex flex-col flex-1 items-center gap-10 overflow-scroll py-10 px-5 md:px-8 lg:p-14 custom-scrollbar">
                <div className="flex items-center justify-start gap-3 w-full max-w-5xl">
                    <img 
                        src="/assets/icons/edit.svg"
                        width={36}
                        height={36}
                        alt="edit"
                        className="invert brightness-0 transition"
                    />
                    <h2 className="text-[24px] md:text-[30px] text-left w-full font-bold leading-[140%] tracking-tighter">
                        Edit Profile
                    </h2>
                </div>
                <Form { ...form }>
                    <form
                        onSubmit={form.handleSubmit(handleUpdate)}
                        className="flex flex-col gap-7 w-full mt-4 max-w-5xl"
                    >
                        <FormField
                            control={form.control}
                            name="file"
                            render={({ field }) => (
                                <FormItem className="flex">
                                    <FormControl>
                                        <ProfileUploader
                                            fieldChange={field.onChange}
                                            mediaUrl={currentUser.imageUrl}
                                        />
                                    </FormControl>
                                    <FormMessage className="text-[#FF5A5A]" />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-white">Name</FormLabel>
                                    <FormControl>
                                        <Input 
                                            type="text"
                                            className="h-12 bg-[#1F1F22] border-none placeholder:text-[#5C5C7B] focus-visible:ring-1 focus-visible:ring-offset-1 ring-offset-[#7878A3]"
                                            { ...field }
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="username"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-white">Username</FormLabel>
                                    <FormControl>
                                        <Input 
                                            type="text"
                                            className="h-12 bg-[#1F1F22] border-none placeholder:text-[#5C5C7B] focus-visible:ring-1 focus-visible:ring-offset-1 ring-offset-[#7878A3]"
                                            { ...field }
                                            disabled
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-white">Email</FormLabel>
                                    <FormControl>
                                        <Input 
                                            type="text"
                                            className="h-12 bg-[#1F1F22] border-none placeholder:text-[#5C5C7B] focus-visible:ring-1 focus-visible:ring-offset-1 ring-offset-[#7878A3]"
                                            { ...field }
                                            disabled
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="bio"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-white">Bio</FormLabel>
                                    <FormControl>
                                        <Textarea 
                                            { ...field }
                                            className="custom-scrollbar h-36 bg-[#101012] rounded-xl border-none focus-visible:ring-1 focus-visible:ring-offset-1 ring-offset-[#7878A3]"
                                        />
                                    </FormControl>
                                    <FormMessage className="text-[#ff5a5a]" />
                                </FormItem>
                            )}
                        />

                        <div className="flex gap-4 items-center justify-end">
                            <Button
                                type="button"
                                className="h-12 bg-[#bd1414] cursor-pointer hover:bg-[#FF5A5A] px-5 text-white flex gap-2"
                                onClick={() => navigate(-1)}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                className="whitespace-nowrap cursor-pointer bg-[#877EFF] hover:bg-[#877EFF] h-12 text-white flex gap-2"
                                disabled={isPending}
                            >
                                {isPending ? (
                                    <div className="flex items-center px-2 justify-center gap-2">
                                        <Loader />
                                    </div>
                                ) : (
                                    <div className="px-2">
                                        Update Profile
                                    </div>
                                )}
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    )
}

export default UpdateProfile