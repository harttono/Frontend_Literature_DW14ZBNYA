import React from 'react';
import {useAuth} from './Components/Provider/authProvider';
import {Switch,BrowserRouter as Router,Route} from 'react-router-dom';
import LandingPage from './Components/Pages/LandingPage/LandingPage';
import Home from './Components/HomeScreen';
import AddLiterature from './Components/AddLiteratureScreen';
import Profile from './Components/ProfileScreen';
import Detail from './Components/DetailScreen';
import Admin from './Components/AdminScreen';
import Navbar from './Components/NavbarScreen';
import Category from './Components/CategoryScreen';
import NoPage from './Components/NoPage';
import PrivateRoute from './Components/PrivateRoutes';
import {AdminProductProvider} from './Components/Provider/AdminDataProvider';
import {ProductContextProvider} from './Components/Provider/productProvider';
import {BookMarkContextProvider} from './Components/Provider/bookmarkProvider';
import MyCollection from './Components/MyCollectionScreen';

const Routes = [
  {
    path:'/home',
    component:Home
  },
  {
    path:'/profile',
    component:Profile
  },
  {
    path:'/mycollection',
    component:MyCollection
  },
  {
    path:'/admin',
    component:Admin
  },
  {
    path:'/addliterature',
    component:AddLiterature
  },
  {
    path:'/detail/:id',
    component:Detail
  },
  {
    path:'/category',
    component:Category
  },
  {
   path:'*',
   component:NoPage
  }
]


function App() {
  const {state} = useAuth();
  const {userInfo} = state;
 
  return (
              <Router>
                    <Route exact path='/' component={LandingPage}/>
                    <Route path={['/home','/profile','/addliterature','/mycollection','/addbook','/detail/:id','/read/:id','/admin','/category','/read/:id','*']}>
                    <div>
                          <AdminProductProvider>
                              <ProductContextProvider>
                                <BookMarkContextProvider>
                                  <div>
                                  {userInfo &&  <Navbar/>}
                                    <Switch>
                                          {Routes.map ( ({path,component},key) =>{
                                            return <PrivateRoute exact path={path} component={component} key={key}/>
                                            })}  
                                    </Switch>        
                                  </div>   
                                </BookMarkContextProvider>
                              </ProductContextProvider>
                          </AdminProductProvider>
                    </div>
                  </Route>
              </Router>
    );
}

export default App;
