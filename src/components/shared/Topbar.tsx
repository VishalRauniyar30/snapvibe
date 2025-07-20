import { useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"

import { INITIAL_USER, useUserContext } from "@/context/AuthContext"
import { useSignOutAccount } from "@/lib/react-query/queries"
import { Button } from "../ui/button"

const Topbar = () => {
    const navigate = useNavigate()
    const { user, setIsAuthenticated, setUser } = useUserContext()

    const { mutate: signOut, isSuccess } = useSignOutAccount()

    const handleSignOut = async(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault()
        signOut()
        setIsAuthenticated(false)
        setUser(INITIAL_USER)
        navigate('/sign-in')
    }
    useEffect(() => {
        if(isSuccess) navigate(0)
    }, [isSuccess])


    return (
        <section className="sticky top-0 z-50 md:hidden bg-[#09090A] w-full">
            <div className="flex items-center justify-between py-4 px-5">
                <Link to='/' className="flex gap-3 items-center">
                    <img 
                        src="/assets/images/logo.svg" 
                        alt="logo"
                        width={130}
                        height={325} 
                    />
                </Link>
                <div className="flex gap-4">
                    <Button
                        variant='ghost'
                        onClick={(e) => handleSignOut(e)}
                        className="flex gap-4 cursor-pointer items-center justify-start hover:bg-transparent hover:text-white"
                    >
                        <img src="/assets/icons/logout.svg" alt="logout" />
                    </Button>
                    <Link to={`/profile/${user.id}`} className="flex items-center justify-center gap-3">
                        <img 
                            src={user.imageUrl || '/assets/icons/profile-placeholder.svg'} 
                            alt="profile"
                            className="w-8 h-8 rounded-full" 
                        />
                    </Link>
                </div>
            </div>
        </section>
    )
}

export default Topbar