import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import {
  FaSearch,
  FaHome,
  FaUserFriends,
  FaBriefcase,
  FaComments,
  FaBell,
  FaUserCircle,
  FaTh,
} from "react-icons/fa";

const Navbar = () => {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    navigate("/");
  };
  return (
    <div className="container">
      <nav className="navbar">
        <div className="navbar-content">
          {/* Left Section */}
          <div className="left-section">
            <h2 className="logo">cn</h2>
            <div className="search">
              <FaSearch className="search-icon" />
              <input type="text" placeholder="Search" className="search-box" />
            </div>
          </div>

          {/* Center Section */}
          <div className="center-section">
            <Link to="/home" className="nav">
              <FaHome className="nav-icon" />
              <span>Home</span>
            </Link>
            <Link to="/network" className="nav">
              <FaUserFriends className="nav-icon" />
              <span>My Network</span>
            </Link>
            <Link to="/jobs" className="nav">
              <FaBriefcase className="nav-icon" />
              <span>Jobs</span>
            </Link>
            <Link to="/messaging" className="nav">
              <FaComments className="nav-icon" />
              <span>Messaging</span>
            </Link>
            <Link to="/notifications" className="nav">
              <FaBell className="nav-icon" />
              <span>Notifications</span>
            </Link>
            <Link to="/me" className="nav">
              <FaUserCircle className="nav-icon" />
              <span>Me</span>
            </Link>
            <Link to="/business" className="nav">
              <FaTh className="nav-icon" />
              <span>For Business</span>
            </Link>

            <div className="logout-btn">
              <span className="logout" onClick={handleLogout}>
                Logout
              </span>
            </div>
          </div>
        </div>
      </nav>
      <style>
        {`
                 body, html {
  background: rgba(243, 242, 237, 0.82); /* Apply background to the entire page */
  margin: 0;
  padding: 0;
  height: 100%;
}
          .navbar {
            width: 100%;
            background-color: white;
            border-bottom: 1px solid #ddd;
            position: fixed;
            top: 0;
            left: 0;
            z-index: 9999;
            height: 60px;
            display: flex;
            align-items: center;
          }

          .navbar-content {
            max-width: 1128px;
            margin: 0 auto;
            display: flex;
            align-items: center;
            justify-content: space-between;
            width: 100%;
          }

          .left-section {
            display: flex;
            align-items: center;

          }

       .logo {
  font-size: 26px;
  font-weight: bold;
  color: rgb(235, 240, 242);
  background-color: rgb(12, 99, 146);
  padding: 2px 10px; 
  border-radius: 6px;
  margin-right: 8px;
  letter-spacing: 1px; 
  display: inline-block;
  text-align: center;
}



          .search {
            display: flex;
            align-items: center;
            background: #eef3f8;
            padding: 0px 10px;
            border-radius: 5px;
            height: 35px;
            padding-right:90px;
                        

          }

          .search-box {
            border: none;
            outline: none;
            background: none;
            padding-left: 5px;
          }

          .search-icon {
            color: gray;
            font-size: 18px; 
          }

          .center-section {
            display: flex;
            align-items: center;
            
          }

          .nav {
            display: flex;
            flex-direction: column;
            align-items: center;
            margin: 0 15px;
            font-size: 12px;
            color: #666;
            cursor: pointer;
          }

          .nav:hover {
            color:rgb(8, 8, 8);
          }

          .nav-icon {
            font-size: 22px; 
          }
          
  .logout {
  background-color: #0073b1;
  color: white;
  border: none;
  padding: 6px 20px;
  border-radius: 6px;
  font-size: 15px;
  cursor: pointer;
  display: flex;
  align-items: center;
  font-weight: bold;
}
              `}
      </style>
    </div>
  );
};

export default Navbar;
