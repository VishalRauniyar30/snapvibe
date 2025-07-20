import { useForm } from "react-hook-form"
import { Link, useNavigate } from "react-router-dom"
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Loader } from "@/components/shared"
import { useToast } from "@/components/ui/use-toast"

import { useUserContext } from "@/context/AuthContext"
import { SignupValidation } from "@/lib/validation"
import { useCreateUserAccount, useSignInAccount } from "@/lib/react-query/queries"

const SignupForm = () => {
    const { toast } = useToast()
    const navigate = useNavigate()

    const { checkAuthUser, isLoading: isUserLoading } = useUserContext()


    const form = useForm<z.infer<typeof SignupValidation>>({
        resolver: zodResolver(SignupValidation),
        defaultValues: {
            name: '',
            username: '',
            email: '',
            password: ''
        } 
    })

    const { mutateAsync: createUserAccount, isPending: isCreatingAccount } = useCreateUserAccount()
    const { mutateAsync: signInAccount, isPending: isSigningInUser } = useSignInAccount()


    const handleSignup = async (user: z.infer<typeof SignupValidation>) => {
        try {
            const newUser = await createUserAccount(user)

            if(!newUser) {
                toast({ title: 'Sign up failed. Pleasr try again.' })
                return
            }

            const session = await signInAccount({
                email: user.email,
                password: user.password
            })

            if(!session) {
                toast({ title: 'Something went wrong. Please login your new account' })

                navigate('/sign-in')

                return
            }

            const isLoggedIn = await checkAuthUser()
            console.log(isLoggedIn)
            if(isLoggedIn) {
                form.reset()

                navigate('/')
            } else {
                toast({ title: 'Sign Up Failed, Please Try Again.' })

                return
            }

        } catch (error) {
            console.log({ error })
        }
    }

    return (
        <Form { ...form }>
            <div className="sm:w-md flex items-center justify-center flex-col">
                <img src="/assets/images/logo.svg" alt="logo" />
                <h2 className="text-[24px] font-bold leading-[140%] tracking-tighter md:text-[30px] pt-5 sm:pt-12">
                    Create a new account
                </h2>
                <p className="text-[#7878A3] text-[14px] font-medium leading-[140%] md:text-[16px] md:font-normal mt-2">
                    To use snapgram, Please enter your details
                </p>
                <form
                    onSubmit={form.handleSubmit(handleSignup)}
                    className="flex flex-col gap-5 w-full mt-4"
                >
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
                                    />
                                </FormControl>
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
                                        type="email" 
                                        className="h-12 bg-[#1F1F22] border-none placeholder:text-[#5C5C7B] focus-visible:ring-1 focus-visible:ring-offset-1 ring-offset-[#7878A3]" 
                                        { ...field } 
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-white">Password</FormLabel>
                                <FormControl>
                                    <Input 
                                        type="password" 
                                        className="h-12 bg-[#1F1F22] border-none placeholder:text-[#5C5C7B] focus-visible:ring-1 focus-visible:ring-offset-1 ring-offset-[#7878A3]" 
                                        { ...field } 
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                    <Button
                        type="submit"
                        className="bg-[#877EFF] cursor-pointer hover:bg-[#5D5FEF] text-white flex gap-2"
                    >
                        {isCreatingAccount || isSigningInUser || isUserLoading ? (
                            <div className="flex items-center justify-center gap-2">
                                <Loader /> Loading...
                            </div>
                        ) : (
                            'Sign Up'
                        )}
                    </Button>
                    <p className="text-[14px] font-normal leading-[140%] text-[#EFEFEF] text-center mt-2">
                        Already have an account?
                        <Link 
                            to='/sign-in'
                            className="text-[#877EFF] text-[14px] font-semibold leading-[140%] tracking-tighter ml-1"
                        >
                            Log In
                        </Link>
                    </p>
                </form>
            </div>
        </Form>
    )
}

export default SignupForm