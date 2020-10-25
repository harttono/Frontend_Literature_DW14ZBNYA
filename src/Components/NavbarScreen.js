import React from 'react';
import {Link} from 'react-router-dom';
import {RiLogoutBoxRLine} from 'react-icons/ri';
import {MdLibraryAdd} from 'react-icons/md';
import {BsListUl,BsCollection} from 'react-icons/bs';
import {Dropdown,DropdownButton} from 'react-bootstrap';
import {useAuth} from './Provider/authProvider';
import {USER_LOGOUT} from './Provider/constants/Constant';
import Brand from './BrandScreen';


function NavbarScreen() {
  const {state,dispatch} = useAuth();
  const {userInfo} = state;
  const handleLogout = () => {
      dispatch({
          type:USER_LOGOUT
      })
  }

  console.log('isi state',state)
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
            <form className="form-inline my-2 my-lg-0">
            {userInfo && userInfo.isAdmin ? 
            <div className="dropdown-container">
                <Link className="dropdown-item" to="/profile"> {userInfo && <img src={userInfo.picture}></img>}</Link>
              <DropdownButton id="dropdown-basic-button" >
                <Link className="dropdown-item" to="/mycollection"><BsCollection/> My Collection</Link>
                <Link className="dropdown-item" to="/addliterature"><MdLibraryAdd/> Add Literature</Link>
                <Link className="dropdown-item" to="/category"><BsListUl/> List Category</Link>
                <Link className="dropdown-item" to="#" onClick={handleLogout}><RiLogoutBoxRLine/> Logout</Link>
              </DropdownButton>
            </div>
              :<Brand/>}
            </form>
        </div>
      </nav>               
    )
}

export default NavbarScreen;