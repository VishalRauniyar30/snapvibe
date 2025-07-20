import { Link, useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import * as z from 'zod'
import { zodResolver } from "@hookform/resolvers/zod"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { Loader } from "@/components/shared"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"

import { useUserContext } from "@/context/AuthContext"
import { SigninValidation } from "@/lib/validation"
import { useSignInAccount } from "@/lib/react-query/queries"

const SigninForm = () => {
    const { toast } = useToast()
    const navigate = useNavigate()

    const { checkAuthUser, isLoading: isUserLoading } = useUserContext()
    
    const { mutateAsync: signInAccount, isPending } = useSignInAccount()

    const form = useForm<z.infer<typeof SigninValidation>>({
        resolver: zodResolver(SigninValidation),
        defaultValues: {
            email: '',
            password: ''
        } 
    })

    const handleSignin = async (user: z.infer<typeof SigninValidation>) => {
        const session = await signInAccount(user)

        if(!session) {
            toast({ title: 'Login failed, Please try again' })
            return
        }

        const isLoggedIn = await checkAuthUser()


        if (isLoggedIn) {
            form.reset()

            navigate("/")
        } else {
            toast({ title: "Login failed. Please try again." })

            return
        }
    }
    return (
        <Form { ...form }>
            <div className="sm:w-md flex items-center justify-center flex-col">
                <img src="/assets/images/logo.svg" alt="logo" />
                <h2 className="text-[24px] font-bold leading-[140%] tracking-tighter md:text-[30px] pt-5 sm:pt-12">
                    Log in to your account
                </h2>
                <p className="text-[#7878A3] text-[14px] font-medium leading-[140%] md:text-[16px] md:font-normal mt-2">
                    Welcome back! Please enter your details
                </p>
                <form
                    onSubmit={form.handleSubmit(handleSignin)}
                    className="flex flex-col gap-5 w-full mt-4"
                >
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
                        {isPending || isUserLoading ? (
                            <div className="flex items-center justify-center gap-2">
                                <Loader /> Loading...
                            </div>
                        ) : (
                            'Log In'
                        )}
                    </Button>
                    <p className="text-[14px] font-normal leading-[140%] text-[#EFEFEF] text-center mt-2">
                        Don&apos;t have an account?
                        <Link 
                            to='/sign-up'
                            className="text-[#877EFF] text-[14px] font-semibold leading-[140%] tracking-tighter ml-1"
                        >
                            Sign up
                        </Link>
                    </p>
                </form>
            </div>
        </Form>
    )
}

export default SigninForm