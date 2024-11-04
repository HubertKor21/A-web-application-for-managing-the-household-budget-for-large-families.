import { useNavigate } from 'react-router-dom';

export function Navbar() {
  const navigate = useNavigate(); // Initialize the useNavigate hook

  function Logout() {
    localStorage.clear();
    navigate("/login"); // Navigate to the login page
  }

  return (
    <div className="navbar bg-base-300">
      <div className="flex-1">
        {/* Button to open the drawer */}
        <label htmlFor="my-drawer" className="btn btn-ghost text-xl">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" viewBox="0 0 24 24" 
            strokeWidth="1.5" 
            stroke="currentColor" 
            className="size-6">
            <path strokeLinecap="round" 
                  strokeLinejoin="round" 
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
        </label>
      </div>
      <div className="flex-none">
        <div className="dropdown dropdown-end">
          <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
            <div className="w-10 rounded-full">
              <img
                alt="Tailwind CSS Navbar component"
                src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
              />
            </div>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
          >
            <li>
              <a className="justify-between">
                Profile
                <span className="badge">New</span>
              </a>
            </li>
            <li><a>Settings</a></li>
            <li><a onClick={Logout}>Logout</a></li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
