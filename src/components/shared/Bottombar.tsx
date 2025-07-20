import { bottombarLinks } from "@/constants"
import { Link, useLocation } from "react-router-dom"

const Bottombar = () => {
    const { pathname } = useLocation()
    return (
        <section className="z-50 flex items-center justify-around w-full sticky bottom-0 rounded-t-[20px] bg-[#09090A] px-5 py-4 md:hidden">
            {bottombarLinks.map((link) => {
                const isActive = pathname === link.route
                return (
                    <Link 
                        to={link.route}
                        key={`bottombar-${link.label}`}
                        className={`${isActive && 'rounded-[10px] bg-[#877EFF]'} flex items-center justify-center flex-col gap-1 p-2 transition`}
                    >
                        <img 
                            src={link.imgURL} 
                            alt={link.label}
                            width={16}
                            height={16}
                            className={`${isActive && 'invert brightness-0 transition'}`} 
                        />
                        <p className="text-[10px] font-medium leading-[140%] text-[#efefef]">{link.label}</p>
                    </Link>
                )
            })}
        </section>
    )
}

export default Bottombar