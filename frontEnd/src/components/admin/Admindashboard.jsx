import { Link } from 'react-router-dom';

export default function Headerr() {
    return (
        <>
        <div className="navbar bg-base-100 shadow-sm">
            <div className="navbar-start">
                <div className="dropdown">
                    <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" />
                        </svg>
                    </div>
                    <ul tabIndex={0} className="menu menu-sm dropdown-content bg-base-100 rounded-box z-10 mt-3 w-52 p-2 shadow">
                        <li><Link to="/admin/dashboard">Dashboard</Link></li>
                        <li><Link to="/admin/users">Users</Link></li>
                        <li><Link to="/admin/roles">Roles</Link></li>
                        <li><Link to="/admin/reservations">Reservations</Link></li>
                        <li><Link to="/admin/parcs">Parcs</Link></li>
                        <li><Link to="/admin/test">QR Scanner</Link></li>
                    </ul>
                </div>
            </div>
            <div className="navbar-center">
                <Link to="/admin/dashboard" className="btn btn-ghost text-xl">Admin Dashboard</Link>
            </div>
            <div className="navbar-end">
                <button className="btn btn-ghost btn-circle">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </button>
                <div className="dropdown dropdown-end">
                    <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                        <div className="w-10 rounded-full">
                            <img
                                alt="User avatar"
                                src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" 
                            />
                        </div>
                    </div>
                    <ul tabIndex={0} className="menu menu-sm dropdown-content bg-base-100 rounded-box z-10 mt-3 w-52 p-2 shadow">
                        <li>
                            <a className="justify-between">
                                Profile
                                <span className="badge">New</span>
                            </a>
                        </li>
                        <li><a>Settings</a></li>
                        <li>
                            <a onClick={() => {
                                // Add logout functionality here
                                console.log("Logout clicked");
                                // Example: dispatch(logout());
                                // Example: navigate('/');
                            }}>
                                Logout
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        </>
    )
}