import { useNavigate } from 'react-router-dom';
import { ChatboxEllipses, Notifications, SearchOutline } from "react-ionicons";
export function Navbar() {
  const navigate = useNavigate(); // Initialize the useNavigate hook

  function Logout() {
    localStorage.clear();
    navigate("/login"); // Navigate to the login page
  }

  return (
		<div className="fixed left-0 top-0 w-full h-[70px] bg-white py-5 pl-20 pr-5 flex items-center justify-between z-[100]">
			<span className="text-[28px] font-black absolute left-[26px] text-[#4379EE]">D.</span>
			<div className="w-[450px] flex items-center px-4">
				<SearchOutline color={"#454545"} />
				<input
					type="text"
					placeholder="Search"
					className="w-[450px] outline-none px-4 py-2 placeholder:text-[#454545] border-b border-transparent focus:border-[#4379EE] bg-white"
				/>
			</div>
			<div className="flex items-center gap-5">
				<Notifications
					color={`#bfbfbf`}
					width="23px"
					height="23px"
					cssClasses={"cursor-pointer"}
				/>
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
                className="menu menu-sm dropdown-content bg-white rounded-box z-[1] mt-3 w-52 p-2 shadow"
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
				<ChatboxEllipses
					color={`#bfbfbf`}
					width="23px"
					height="23px"
					cssClasses={"cursor-pointer"}
				/>
			</div>
		</div>
	);
}

export default Navbar;

