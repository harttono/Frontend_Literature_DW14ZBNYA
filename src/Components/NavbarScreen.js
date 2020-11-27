import React from 'react';
import {Link} from 'react-router-dom';
import {RiLogoutBoxRLine} from 'react-icons/ri';
import {MdLibraryAdd} from 'react-icons/md';
import {BsListUl,BsCollection} from 'react-icons/bs';
import {Dropdown,DropdownButton} from 'react-bootstrap';
import {useAuth} from './Provider/authProvider';
import {USER_LOGOUT} from './Provider/constants/Constant';
import Brand from './BrandScreen';


function NavbarScreen(props) {
  const {state,dispatch} = useAuth();
  const {userInfo} = state;
  const handleLogout = () => {
      dispatch({
          type:USER_LOGOUT
      })
  }

 

    return (
      <nav className="navbar navbar-expand-lg text-white bg-navbar_dark">
        <div className="container navbar-menu">
            {userInfo && userInfo.isAdmin ?
            <Brand/> :
            <ul className="navbar-nav mr-auto">
              <li className="nav-item">
                <Link to="/profile" className="nav-link">Profile</Link>
              </li>
              <li className="nav-item">
                <Link to ="/mycollection" className="nav-link">My Collection</Link>
              </li>
              <li className="nav-item">
                <Link to="/addliterature" className="nav-link">Add Literature</Link>
              </li>
              <li className="nav-item">
                <button className="mt-2" onClick={handleLogout}>Logout</button>
              </li>
            </ul>}
            {userInfo && userInfo.isAdmin ? 
            <form className="form-inline my-2 my-lg-0">
            <div className="dropdown-container">
                <Link to="/profile"> {userInfo && <img src={userInfo.picture}></img>}</Link>
                <Dropdown>
                  <Dropdown.Toggle variant="dark" id="dropdown-basic">
                    {" "}
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item href="#"><Link to="/mycollection"><BsCollection/> My Collection</Link></Dropdown.Item>
                    <Dropdown.Item href="#"><Link to="/addliterature" ><MdLibraryAdd/> Add Literature</Link></Dropdown.Item>
                    <Dropdown.Item href="#"><Link to="/category"><BsListUl/> List Category</Link></Dropdown.Item>
                    <Dropdown.Item href="#" onClick={handleLogout}><RiLogoutBoxRLine/> Logout</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
            </div>
            </form>
            :<Brand/>}
        </div>
      </nav>               
    )
}

export default NavbarScreen;