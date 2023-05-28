import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import RootHeaderContainer from './components/Headers/RootHeaderContainer';
import Admin from './components/Headers/Admin/Admin';
import User from './components/Headers/Users/User';
import { Routes, Route } from 'react-router-dom';
import SearchVulnerability from './components/SearchVulnerability';
import SearchUser from './components/SearchUser';
import Error from './components/Error';
import ForgetPassword from './components/ForgetPassword';

function App() {
  return (
    <>
      <Routes>
        <Route path='/*' element={<RootHeaderContainer />} />
        <Route path='/admin/:userType/:uID/*' element={<Admin />} />
        <Route path='/user/:userType/:uID/*' element={<User />} />
        <Route path="/search/:uID" element={<SearchUser />} />
        <Route path="/error" element={<Error />} />
        <Route path="/forgetPassword" element={<ForgetPassword />} />
        <Route path='/searchVulnerability/:vID' element={<SearchVulnerability />} />
      </Routes>
    </>
  );
}

export default App;
