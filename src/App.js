import './App.css';
import { Routes, Route} from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import "react-toastify/dist/ReactToastify.css";

import Login from './Pages/Login/Login'
import Signup from './Pages/Signup/Signup';
import ForgotPassword from './Pages/ForgotPassword/ForgotPassword'
import VerifyOtp from './Pages/VerifyOtp/VerifyOtp'
import CreateNewPassword from './Pages/CreateNewPassword/CreateNewPassword'
import Home from './Pages/Home/Home'
import SettingPage from './Pages/SettingPage/SettingPage';
import Product from './Pages/Product/Product'
import IndividualProduct from './Pages/NewProduct/IndividualProduct/IndividualProduct';
import Invoice from './Pages/Invoice/Invoice';
import Statistics from './Pages/Statistics/Statistics';

function App() {
  return (
    <>
      <Routes>
        <Route path='/' element={<Login/>}/>
        <Route path='/signup' element={<Signup/>}/>
        <Route path='/forgot-password' element={<ForgotPassword/>}/>
        <Route path='/verify-otp' element={<VerifyOtp />} />
        <Route path='/reset-password' element={<CreateNewPassword />} />
        <Route path='/home' element={<Home/>}/>
        <Route path='/setting' element={<SettingPage/>}/>
        <Route path='/product' element={<Product/>}/>
        <Route path='/product/new' element={<IndividualProduct/>}/>
        <Route path='/invoice' element={<Invoice/>}/>
        <Route path='/statistics' element={<Statistics/>}/>
      </Routes>
      <ToastContainer position='top-center' autoClose={2000} closeButton={false}/>
    </>
  );
}

export default App;
