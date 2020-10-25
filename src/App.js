import React from 'react';
import {Switch,BrowserRouter as Router,Route} from 'react-router-dom';
import LandingPage from './Components/Pages/LandingPage/LandingPage';
import Home from './Components/HomeScreen';
import AddLiterature from './Components/AddLiteratureScreen';
import Profile from './Components/ProfileScreen';
import Detail from './Components/DetailScreen';
import Admin from './Components/AdminScreen';
import Navbar from './Components/NavbarScreen';
import Category from './Components/CategoryScreen';
import Reader from './Components/ReaderScreen';
import PrivateRoute from './Components/PrivateRoutes';
import {AuthProvider} from './Components/Provider/authProvider';
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
   path:'/read/:id',
   component:Reader
  }
]


function App() {
 
  return ( 
          <AuthProvider>
              <Router>
                    <Route exact path='/' component={LandingPage}/>
               
                    <Route path={['/home','/profile','/addliterature','/mycollection','/addbook','/detail/:id','/read/:id','/admin','/category','/read/:id']}>
                    <div>
                          <AdminProductProvider>
                              <ProductContextProvider>
                                <BookMarkContextProvider>
                                  <div>
                                  <Navbar/>
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
          </AuthProvider>
    );
}

export default App;
