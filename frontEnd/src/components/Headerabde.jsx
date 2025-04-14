import { use, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import Auth from '../assets/api/auth/Auth';
import { logout } from './Redux/slices/AuthSlice';
import { Outlet } from 'react-router-dom';
import { ScanLine } from 'lucide-react';

export default function Headerabde() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user, token} = useSelector((state) => state.auth);
    const [isOpen, setIsOpen] = useState(false);
    const [isOpenSc, setIsOpenSc] = useState(false);
    
    let color = "primary"
    if (token)
    {color = getColor(user.first_name);}
    
    const logoutUser = async () => {
      const res = await Auth.Logout();
      if (res.success) {
        dispatch(logout());
        navigate("/");
      }
    };
    const navLinkClass = ({ isActive }) =>
      `px-3 py-2 transition duration-200 ${
        isActive
          ? "text-blue-500 border-b-2 border-blue-500"
          : "text-gray-700 hover:text-blue-500 hover:border-b-2 "
      }`;

    function getColor(str) {
      const colors = ["neutral", "primary", "secondary", "accent", "info", "success", "warning", "error"]
      let hash = 0;
      for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
      }
      const index = Math.abs(hash) % colors.length;
      return colors[index];
    }

    return (
      <>
        <div className="navbar bg-base-100 shadow-sm">
          <div className="navbar-start">
            <NavLink ><img className='h-12' src="/Logo/logo.png" alt="" /></NavLink>
          </div>
          
            {user?.role === "admin" && (
              <div className="gap-5 hidden md:inline-flex">
              <NavLink className={navLinkClass} to="/dashboard">Dashborad</NavLink>
              <NavLink className={navLinkClass} to="/admin/users">users</NavLink>
              <NavLink className={navLinkClass} to="/admin/roles">roles</NavLink>
              </div>
            )}
            {user?.role === "employe" && (
              <div className="gap-5 hidden md:inline-flex">
              <NavLink className={navLinkClass} to="/overview">Overview</NavLink>
              </div>
            )}
            
          <div className="navbar-end">
          <button className="btn btn-ghost btn-neutral btn-circle md:hidden hover:scale-105 transition-transform duration-100" onClick={() => setIsOpen(!isOpen)}><Menu/></button>
          
          { token ?
            <div className="dropdown dropdown-end hidden md:inline-block">
              <div className='flex items-center gap-1'>
                  {user?.role === "employe" && (
                      <button className="btn btn-ghost btn-circle avatar hover:scale-105 transition-transform duration-100" aria-label="Open Scan" onClick={() => setIsOpenSc(true)}>
                      <ScanLine  size={24} />
                      </button>
                  )}
                  <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar hover:scale-105 transition-transform duration-100">
                    <div className={`hover:ring ring-offset-2 ring-neutral ring-offset-base-100 w-10 rounded-full bg-${color} text-${color}-content flex! items-center justify-center text-lg font-bold`}>
                      {user.first_name[0]}{user.last_name[0]}
                    </div>
                  </div>
              </div>
              <ul tabIndex={0} className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
                <li className='text-center font-semibold mb-2'>Welcome {user.first_name}</li>
                <li><a className="justify-between">Profile</a></li>
                <li><a>Settings</a></li>
                <li><button onClick={logoutUser}>Logout</button></li>
              </ul>
            </div>
            : <NavLink className={({ isActive }) => `btn btn-sm btn-neutral mx-2 hover:bg-base-100 hover:text-neutral ${isActive ? "btn-active" : ""}`} to="/sign">Login</NavLink>
          }
          
          </div>
        </div>
        {/* sidebar */}
        <div className={`fixed inset-0 z-10 bg-black bg-opacity-50 transition-opacity ${isOpen ? "opacity-100 visible" : "opacity-0 invisible"}`} onClick={() => setIsOpen(false)} >
        <aside className={`fixed top-0 left-0 w-full h-fit bg-white shadow-lg p-4 transform transition-transform ${isOpen ? "translate-y-0" : "-translate-y-full"}`}>
          <div className='flex justify-between items-center mb-2'>
          { token &&
            <div className="btn btn-ghost btn-circle avatar hover:scale-105 transition-transform duration-100">
              <div className={`hover:ring ring-offset-2 ring-neutral ring-offset-base-100 w-10 rounded-full bg-${color} text-${color}-content flex! items-center justify-center text-lg font-bold`}>
                <NavLink to="/profile">{user.first_name[0]}{user.last_name[0]}</NavLink>
              </div>
            </div>
          }
            <button className="btn btn-ghost btn-neutral btn-circle hover:scale-105 transition-transform duration-100" onClick={() => setIsOpen(false)}><X/></button>
          </div>
          <div className='flex flex-col items-center gap-2 px-2'>
            { token && <div className='text-center font-semibold mb-2'>Welcome {user.first_name}</div>}
            {user?.role === "admin" &&
              <>
                <NavLink className={({ isActive }) => `btn btn-ghost btn-neutral mx-2 w-full ${isActive ? "btn-active" : ""}`} to="/admin/users">Users</NavLink>
                <NavLink className={({ isActive }) => `btn btn-ghost btn-neutral mx-2 w-full ${isActive ? "btn-active" : ""}`} to="/admin/roles">Roles</NavLink>
                <NavLink className={({ isActive }) => `btn btn-ghost btn-neutral mx-2 w-full ${isActive ? "btn-active" : ""}`} to="/admin/SettingsAdmin">Settings</NavLink>
              </>
            }
            {user?.role === "employe" &&
              <>
              <button className="p-2  text-black rounded-md " aria-label="Open Scan" onClick={() => setIsOpenSc(true)}><ScanLine  size={24} /></button>
              <NavLink className={({ isActive }) => `btn btn-ghost btn-neutral mx-2 w-full ${isActive ? "btn-active" : ""}`} to="/overview">Overview</NavLink>
              <NavLink className={({ isActive }) => `btn btn-ghost btn-neutral mx-2 w-full ${isActive ? "btn-active" : ""}`} to="/admin/SettingsAdmin">Settings</NavLink>
              </>
            }
            { token ? <button className="btn btn-outline btn-neutral mx-2 w-full mt-2" onClick={logoutUser} >Logout</button>
            : <NavLink className={({ isActive }) => `btn btn-outline btn-neutral mx-2 w-full mt-2 ${isActive ? "btn-active" : ""}`} to="/sign">Login</NavLink>}
          </div>
        </aside>


        {/* <aside className={`fixed top-0 left-0 w-full h-fit bg-white shadow-lg p-4 transform transition-transform ${isOpen ? "translate-y-0" : "-translate-y-full"}`}>
          <div className='flex justify-between items-center mb-2'>
            <div className="btn btn-ghost btn-circle avatar hover:scale-105 transition-transform duration-100">
              <div className={`hover:ring ring-offset-2 ring-neutral ring-offset-base-100 w-10 rounded-full bg-${color} text-${color}-content flex! items-center justify-center text-lg font-bold`}>
                <NavLink to="/profile">
                </NavLink>
              </div>
            </div>
            <button className="btn btn-ghost btn-neutral btn-circle hover:scale-105 transition-transform duration-100" onClick={() => setIsOpen(false)}><X/></button>
          </div>
            {user?.role === "admin" && (
              <div className='flex flex-col items-center gap-2 px-2'>
                <div className='text-center font-semibold mb-2'>Welcome </div>
                <NavLink className={({ isActive }) => `btn btn-ghost btn-neutral mx-2 w-full ${isActive ? "btn-active" : ""}`} to="/admin/users">Users</NavLink>
                <NavLink className={({ isActive }) => `btn btn-ghost btn-neutral mx-2 w-full ${isActive ? "btn-active" : ""}`} to="/admin/roles">Roles</NavLink>
                <NavLink className={({ isActive }) => `btn btn-ghost btn-neutral mx-2 w-full ${isActive ? "btn-active" : ""}`} to="/admin/SettingsAdmin">Settings</NavLink>
                { token ? <button className="btn btn-outline btn-neutral mx-2 w-full mt-2" onClick={logoutUser} >Logout</button>
                : <NavLink className={({ isActive }) => `btn btn-outline btn-neutral mx-2 w-full mt-2 ${isActive ? "btn-active" : ""}`} to="/sign">Login</NavLink>}
              </div>
            )}
            {user?.role === "employe" && (
              <div className='flex flex-col items-center gap-2 px-2'>
                <div className='text-center font-semibold mb-2'>Welcome </div>
                <button className="p-2  text-black rounded-md " aria-label="Open Scan" onClick={() => setIsOpenSc(true)}><ScanLine  size={24} /></button>
                <NavLink className={({ isActive }) => `btn btn-ghost btn-neutral mx-2 w-full ${isActive ? "btn-active" : ""}`} to="/overview">Overview</NavLink>
                <NavLink className={({ isActive }) => `btn btn-ghost btn-neutral mx-2 w-full ${isActive ? "btn-active" : ""}`} to="/admin/SettingsAdmin">Settings</NavLink>
                { token ? <button className="btn btn-outline btn-neutral mx-2 w-full mt-2" onClick={logoutUser} >Logout</button>
                : <NavLink className={({ isActive }) => `btn btn-outline btn-neutral mx-2 w-full mt-2 ${isActive ? "btn-active" : ""}`} to="/sign">Login</NavLink>}
              </div>
            )}
        </aside> */}

      </div>
      <Outlet />
        

    </>
    )
    }