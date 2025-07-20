import { useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import type { Models } from "appwrite"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

import { useUserContext } from "@/context/AuthContext"
import { useCreatePost, useUpdatePost } from "@/lib/react-query/queries"
import { PostValidation } from "@/lib/validation"
import { FileUploader, Loader } from "../shared"
import { Button } from "../ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { Input } from "../ui/input"
import { Textarea } from "../ui/textarea"
import { useToast } from "../ui/use-toast"

type PostFormProps = {
    post?: Models.Document;
    action: 'Create' | 'Update';
}

const PostForm = ({ action, post }: PostFormProps) => {
    const navigate = useNavigate()
    const { toast } = useToast()

    const { user } = useUserContext()

    const form = useForm<z.infer<typeof PostValidation>>({
        resolver: zodResolver(PostValidation),
        defaultValues: {
            caption: post ? post?.caption : '',
            file: [],
            location: post ? post?.location : '',
            tags: post ? post?.tags.join(',') : '',
        }
    })

    const { mutateAsync: createPost, isPending: isLoadingCreate } = useCreatePost()    
    const { mutateAsync: updatePost, isPending: isLoadingUpdate } = useUpdatePost()    

    const handleSubmit = async (value: z.infer<typeof PostValidation>) => {
        //ACTION == UPDATE
        if(post && action === 'Update') {
            const updatedPost = await updatePost({
                ...value,
                postId: post.$id,
                imageId: post.imageId,
                imageUrl: post.imageUrl
            })
            
            if(!updatedPost) {
                toast({ title: `${action} Post Failed. Please Try Again` })
            }
            return navigate(`/posts/${post.$id}`)
        }
        //ACTION == CREATE
        const newPost = await createPost({
            ...value,
            userId: user.id
        })

        if(!newPost) {
            toast({ title: `${action} Post Failed. Please Try Again` })
        }
        navigate('/')
    }


    return (
        <Form { ...form }>
            <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className="flex flex-col gap-9 w-full max-w-5xl"
            >
                <FormField
                    control={form.control}
                    name="caption"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-white">
                                Caption
                            </FormLabel>
                            <FormControl>
                                <Textarea
                                    className="custom-scrollbar h-36 bg-[#101012] rounded-xl border-none focus-visible:ring-1 focus-visible:ring-offset-1 ring-offset-[#7878A3]"
                                    { ...field }
                                />
                            </FormControl>
                            <FormMessage className="text-[#FF5A5A]" />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="file"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-white">Add Photos</FormLabel>
                            <FormControl>
                                <FileUploader
                                    fieldChange={field.onChange}
                                    mediaUrl={post?.imageUrl}
                                />
                            </FormControl>
                            <FormMessage className="text-[#FF5A5A]" />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-white">Add Location</FormLabel>
                            <FormControl>
                                <Input
                                    type="text"
                                    className="h-12 bg-[#1F1F22] border-none placeholder:text-[#5C5C7B] focus-visible:ring-1 focus-visible:ring-offset-1 ring-offset-[#7878A3]"
                                    { ...field }
                                />
                            </FormControl>
                            <FormMessage className="text-[#FF5A5A]" />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="tags"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-white">
                                Add Tags (separated by comma " , ")
                            </FormLabel>
                            <FormControl>
                                <Input
                                    type="text"
                                    placeholder="Art, Expression, Learn"
                                    className="h-12 bg-[#1F1F22] border-none placeholder:text-[#5C5C7B] focus-visible:ring-1 focus-visible:ring-offset-1 ring-offset-[#7878A3]"
                                    { ...field }
                                />
                            </FormControl>
                            <FormMessage className="text-[#FF5A5A]" />
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
                        disabled={isLoadingCreate || isLoadingUpdate}
                    >
                        {isLoadingCreate || isLoadingUpdate ? (
                            <div className="flex items-center px-2 justify-center gap-2">
                                {action.slice(0,-1)}ing Post
                                <Loader />
                            </div>
                        ) : (
                            <div className="px-6">
                                {action} Post
                            </div>
                        )}
                    </Button>
                </div>
            </form>
        </Form>
    )
}

export default PostForm