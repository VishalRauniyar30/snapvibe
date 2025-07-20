import { INITIAL_USER, useUserContext } from "@/context/AuthContext"
import { useSignOutAccount } from "@/lib/react-query/queries"
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom"
import Loader from "./Loader"
import { sidebarLinks } from "@/constants"
import type { INavLink } from "@/types"
import { Button } from "../ui/button"

const LeftSidebar = () => {
    const navigate = useNavigate()
    const { pathname } = useLocation()

    const { user, setUser, setIsAuthenticated, isLoading } = useUserContext()

    const { mutate: signOut } = useSignOutAccount()

    const handleSignOut = async(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault()
        signOut()
        setIsAuthenticated(false)
        setUser(INITIAL_USER)
        navigate('/sign-in')
    }

    return (
        <nav className="hidden md:flex px-6 py-10 flex-col justify-between min-w-[270px] bg-[#09090A]">
            <div className="flex flex-col gap-11">
                <Link to='/' className="flex gap-3 items-center">
                    <img 
                        src="/assets/images/logo.svg" 
                        alt="logo"
                        width={170}
                        height={36} 
                    />
                </Link>
                {isLoading || !user.email ? (
                    <div className="h-14">
                        <Loader />
                    </div>
                ) : (
                    <Link to={`/profile/${user.id}`} className="flex gap-3 items-center">
                        <img 
                            src={user.imageUrl || '/assets/icons/profile-placeholder.svg'} 
                            alt="profile"
                            className="w-14 h-14 rounded-full" 
                        />
                        <div className="flex flex-col">
                            <p className="text-[18px] font-bold leading-[140%]">{user.name}</p>
                            <p className="text-[14px] font-normal leading-[140%] text-[#7878A3]">@{user.username}</p>
                        </div>
                    </Link>
                )}  
                <ul className="flex flex-col gap-6">
                    {sidebarLinks.map((link: INavLink) => {
                        const isActive = pathname === link.route
                        return(
                            <li
                                key={link.label}
                                className={`${isActive && 'bg-[#877EFF]'} group rounded-lg text-[16px] font-medium leading-[140%] hover:bg-[#877EFF] transition`}
                            >
                                <NavLink
                                    to={link.route}
                                    className='flex gap-4 items-center p-4'
                                >
                                    <img 
                                        src={link.imgURL} 
                                        alt={link.label} 
                                        className={`group-hover:invert group-hover:brightness-0 group-hover:transition ${isActive && 'invert brightness-0 transition'}`} 
                                    />
                                    {link.label}
                                </NavLink>
                            </li>
                        )
                    })}
                </ul>
            </div>
            <Button
                variant='ghost'
                onClick={(e) => handleSignOut(e)}
                className="flex gap-4 cursor-pointer items-center justify-start hover:bg-transparent hover:text-white"
            >
                <img src="/assets/icons/logout.svg" alt="logout" />
                <p className="text-[14px] font-medium leading-[140%] lg:text-[16px]">Logout</p>
            </Button>
        </nav>
    )
}

export default LeftSidebar