import ClientSubscription from './client/ClientSubscription';
import { useEffect, useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import Auth from '../assets/api/auth/Auth';
import { logout } from './Redux/slices/AuthSlice';
import { Outlet } from 'react-router-dom';
import { ScanLine } from 'lucide-react';
import { motion, useAnimation } from "framer-motion";
import { FaCar, FaMapMarkerAlt, FaSearch, FaUserCircle, FaSignInAlt, FaStar, FaArrowLeft,FaCalendarAlt,FaCheck } from 'react-icons/fa';


export default function Header() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const controls = useAnimation();
    const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
    const { user, token, isLoading } = useSelector((state) => state.auth);
    const [isOpen, setIsOpen] = useState(false);
    const [color, setColor] = useState("bg-neutral text-neutral-content");
    
    const switchTab = (el) => {
      const activeTab = el?.getBoundingClientRect ? el : document.querySelector(`[data-path="${location.pathname}"]`);
      if (activeTab) {
        const { offsetLeft, offsetWidth } = activeTab;
        controls.start({
          x: offsetLeft,
          width: offsetWidth,
          transition: { type: "spring", stiffness: 500, damping: 50 },
        });
      }
    };

    useEffect(() => {
      if (user) {
        const colors = [
          "bg-info text-info-content",
          "bg-error text-error-content",
          "bg-accent text-accent-content",
          "bg-neutral text-neutral-content",
          "bg-primary text-primary-content",
          "bg-success text-success-content",
          "bg-warning text-warning-content",
          "bg-secondary text-secondary-content",
        ]
        setColor(colors[user.id % colors.length]);
      }
    }, [user]);
    
    
    const logoutUser = async () => {
      const res = await Auth.Logout();
      if (res.success) {
        dispatch(logout());
        navigate("/home");
      }
    };
    const navLinkClass = ({ isActive }) => {
      if (isActive) { switchTab()}
      return `px-3 py-2 text-neutral hover:text-primary font-semibold transition-colors duration-200 whitespace-nowrap ${isActive ? "text-primary": ""}`;
    }

    return (
      <>
        <div className="navbar bg-base-100 shadow-sm">
          <div className="navbar-start">
            <NavLink ><img className='h-12' src="/Logo/logo.png" alt="" /></NavLink>
          </div>
          <div className="gap-5 hidden md:inline-flex relative items-center">
            {!token && (
              <>
                <div data-path="/home" onClick={e => switchTab(e.target)}><NavLink className={navLinkClass} to="/home">Home</NavLink></div>
                { location.pathname !== "/sign" && <>
                  <div data-path="#avp" onClick={e => switchTab(e.target)}><a className="px-3 py-2 text-neutral hover:text-primary font-semibold transition-colors duration-200 whitespace-nowrap" href="#avp">Available&nbsp;Parks</a></div>
                  <div data-path="#pracing" onClick={e => switchTab(e.target)}><a className="px-3 py-2 text-neutral hover:text-primary font-semibold transition-colors duration-200 whitespace-nowrap" href="#pracing">Pricing</a></div>
                </>
                }
              </>
            )}
            {user?.role === "admin" && (
              <>
                <div data-path="/dashboard" onClick={e => switchTab(e.target)}><NavLink className={navLinkClass} to="/dashboard">Dashboard</NavLink></div>
                <div data-path="/users" onClick={e => switchTab(e.target)}><NavLink className={navLinkClass} to="/users">Users</NavLink></div>
                <div data-path="/parks" onClick={e => switchTab(e.target)}><NavLink className={navLinkClass} to="/parks">Parks</NavLink></div>
                <div data-path="/roles" onClick={e => switchTab(e.target)}><NavLink className={navLinkClass} to="/roles">Roles</NavLink></div>
                <div data-path="/parkigtickets" onClick={e => switchTab(e.target)}><NavLink className={navLinkClass} to="/parkigtickets">Park&nbsp;Tickets</NavLink></div>
              </>
            )}
            {user?.role === "employe" && (
              <>
                <div data-path="/overview" onClick={e => switchTab(e.target)}><NavLink className={navLinkClass} to="/overview">Overview</NavLink></div>
                <div data-path="/demand-cards" onClick={e => switchTab(e.target)}><NavLink className={navLinkClass} to="/demand-cards">Demand Cards</NavLink></div>
              </>
              )}
            {user?.role === "client" && (
              <>
                <div data-path="/home" onClick={e => switchTab(e.target)}><NavLink className={navLinkClass} to="/home">Home</NavLink></div>
                <div data-path="/parks-list" onClick={e => switchTab(e.target)}><NavLink className={navLinkClass} to="/parks-list">Available Parks</NavLink></div>
                <div data-path="/history" onClick={e => switchTab(e.target)}><NavLink className={navLinkClass} to="/history">Parking History</NavLink></div>
                {!user?.role_data?.cart && (
                  
                  <button
                  onClick={() => setShowSubscriptionModal(true)}
                  className={`w-full flex items-center gap-3 px-4 py-2 rounded-md bg-primary text-white transition hover:bg-gray-100`}
                  >
                  <span>Subscription</span>
                </button>
                )}
                
              </>)}
              {showSubscriptionModal && (
                <ClientSubscription onClose={() => setShowSubscriptionModal(false)} />
            )}
              {user && <motion.div className={`absolute ${user.role === "client" ? "top-9" : "top-7"} left-0 h-0.5 bg-primary under`} animate={controls} initial={{ x: 0, width: 0 }} />}

              </div>
            
          <div className="navbar-end">
          {!isLoading && <button className="btn btn-ghost btn-neutral btn-circle md:hidden hover:scale-105 transition-transform duration-100" onClick={() => setIsOpen(!isOpen)}><Menu/></button>}
          { isLoading ? (
              <span className="loading loading-spinner loading-md text-neutral" />
            ) : token ? (
              <div className="dropdown dropdown-end hidden md:inline-block">
                <div className='flex items-center gap-1'>
                  <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar hover:scale-105 transition-transform duration-100">
                    <div className={`hover:ring ring-offset-2 ring-neutral ring-offset-base-100 w-10 rounded-full ${color} flex! items-center justify-center text-lg font-bold`}>
                      {user.first_name[0]}{user.last_name[0]}
                    </div>
                  </div>
                </div>
                <ul tabIndex={0} className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
                  <li className='text-center font-semibold mb-2'>Welcome {user.first_name} ({user.role})</li>
                  <li><NavLink to="/profile" className="justify-between">Profile</NavLink></li>
                  <li><NavLink to='/settings'>Settings</NavLink></li>
                  <li><button onClick={logoutUser}>Logout</button></li>
                </ul>
              </div>
            ) : (
              
                <>
                  {/* <NavLink to="/sign" className="flex items-center space-x-1 hover:text-primary px-3 py-2 rounded-md font-medium">
                      <FaSignInAlt className="mr-1" /> <span className="hidden sm:inline">Login</span>
                  </NavLink> */}
                  <NavLink to="/sign" className="btn btn-primary font-medium px-4 py-2 rounded-md">
                      <span className="hidden sm:inline">Sign Up</span>
                      <span className="sm:hidden">Join</span>
                  </NavLink>
                </>
              
            )
          }
          </div>
        </div>
        {/* sidebar */}
        <div className={`fixed inset-0 z-10 bg-black/50 transition-opacity duration-300 ${isOpen ? "opacity-100 visible" : "opacity-0 invisible"}`} onClick={() => setIsOpen(false)} />
        <aside className={`fixed top-0 z-20 left-0 w-full h-fit bg-white shadow-lg p-4 transform transition-transform duration-300 ${isOpen ? "translate-y-0" : "-translate-y-full"}`} onClick={() => setIsOpen(false)}>
          <div className='flex justify-between items-center mb-2'>
          { token &&
            <div className="btn btn-ghost btn-circle avatar hover:scale-105 transition-transform duration-100">
              <div className={`hover:ring ring-offset-2 ring-neutral ring-offset-base-100 w-10 rounded-full ${color} flex! items-center justify-center text-lg font-bold`}>
                <NavLink to="/profile">{user.first_name[0]}{user.last_name[0]}</NavLink>
              </div>
            </div>
          }
            <button className="btn btn-ghost btn-neutral btn-circle hover:scale-105 transition-transform duration-100" onClick={() => setIsOpen(false)}><X/></button>
          </div>
          <div className='flex flex-col items-center gap-2 px-2'>
            { token && <div className='text-center font-semibold mb-2'>Welcome {user.first_name} ({user.role})</div>}
            {user?.role === "admin" &&
              <>
                <NavLink className={({ isActive }) => `btn btn-ghost btn-primary mx-2 w-full ${isActive ? "btn-active" : ""}`} to="/users">Users</NavLink>
                <NavLink className={({ isActive }) => `btn btn-ghost btn-primary mx-2 w-full ${isActive ? "btn-active" : ""}`} to="/roles">Roles</NavLink>
                <NavLink className={({ isActive }) => `btn btn-ghost btn-primary mx-2 w-full ${isActive ? "btn-active" : ""}`} to="/parks">Parks</NavLink>
                <NavLink className={({ isActive }) => `btn btn-ghost btn-primary mx-2 w-full ${isActive ? "btn-active" : ""}`} to="/SettingsAdmin">Settings</NavLink>
              </>
            }
            {user?.role === "employe" &&
              <>
              <NavLink className={({ isActive }) => `btn btn-ghost btn-neutral mx-2 w-full ${isActive ? "btn-active" : ""}`} to="/overview">Overview</NavLink>
              <NavLink className={({ isActive }) => `btn btn-ghost btn-neutral mx-2 w-full ${isActive ? "btn-active" : ""}`} to="/demand-cards">Demand Cards</NavLink>
              <NavLink className={({ isActive }) => `btn btn-ghost btn-neutral mx-2 w-full ${isActive ? "btn-active" : ""}`} to="/SettingsAdmin">Settings</NavLink>
              </>
            }
            {user?.role === "client" &&
              <>
              <NavLink className={({ isActive }) => `btn btn-ghost btn-neutral mx-2 w-full ${isActive ? "btn-active" : ""}`} to="/home">Home</NavLink>
              <NavLink className={({ isActive }) => `btn btn-ghost btn-neutral mx-2 w-full ${isActive ? "btn-active" : ""}`} to="/parks-list">Available Parks</NavLink>
              <NavLink className={({ isActive }) => `btn btn-ghost btn-neutral mx-2 w-full ${isActive ? "btn-active" : ""}`} to="/history">Parking History</NavLink>
              </>
            }
            { token ? <button className="btn btn-outline btn-neutral mx-2 w-full mt-2" onClick={logoutUser} >Logout</button>
            : (
            <>
              <NavLink className={({ isActive }) => `btn btn-ghost btn-neutral mx-2 w-full ${isActive ? "btn-active" : ""}`} to="/home">Home</NavLink>
              <NavLink className={({ isActive }) => `btn btn-outline btn-neutral mx-2 w-full mt-2 ${isActive ? "btn-active" : ""}`} to="/sign">Login</NavLink>
            </>
                          )}
          </div>
        </aside>
      
      <Outlet />
        

    </>
    )
    }