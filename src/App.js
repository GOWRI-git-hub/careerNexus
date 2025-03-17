// import logo from './logo.svg';
// import './App.css';

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }
// export default App;
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import Navbar from "./Navbar";
import Logins from "./Logins";
import Home from "./Home";
import Profile from "./Profile";

const Layout = ({ children }) => {
  const location = useLocation();
  const hideNavbarPages = ["/"]; 

  return (
    <>
      {!hideNavbarPages.includes(location.pathname) && <Navbar />}
      {children}
    </>
  );
};
function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Logins />} />
          <Route path="/Home" element={<Home />} />
          <Route path="/me" element={<Profile />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
