import { bottombarLinks } from "@/constants";
import { Link , useLocation } from "react-router-dom"

const Bottombar = () => {
 
  const { pathname } = useLocation();
  return (
    <section className="bottom-bar">
      {
                  bottombarLinks.map((link,index) => {
                    const isActive : boolean = pathname === link.route;
                      return (
                        <li 
                        key={link.label+index}
                          >
                          <Link
                            to={link.route}
                            
                            className={`${isActive && "bg-primary-500 rounded-[10px]" } flex-center flex-col gap-1 p-2 transition `}
                            >
                              <img 
                                src={link.imgURL} 
                                alt={link.label} 
                                width={16}
                                height={16}
                                className={`group-hover:invert-white ${isActive && "invert-white"}`} />
                                <p className="tiny-medium text-light-2">
                                  {
                                    link.label
                                  }
                                </p>
                            </Link>
                        </li>
                      )
                  })
                }
    </section>
  )
}

export default Bottombar