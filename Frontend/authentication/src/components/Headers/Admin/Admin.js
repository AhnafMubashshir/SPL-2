import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import AdminHeader from './AdminHeader';
import Axios from 'axios';
import AuthService from '../../AuthService';

const Admin = () => {
    const navigate = useNavigate();
    const params = useParams()
    console.log("saying from admin profile: ", params.uID)
    const [isAuthenticated, setIsAuthenticated] = useState(null)

    useEffect(() => {
        const token = AuthService.getToken()
        Axios.post('http://localhost:5050/validator/checkValidation', {
            token: token,
            userID: params
        }).then((response) => {
            console.log(response);
            setIsAuthenticated(response.data.sign);
        })
    }, [params, setIsAuthenticated])

    if (isAuthenticated === null) {
        return null; 
      } else if (isAuthenticated === false) {
        navigate('/error');
        return null; 
      }

    return (
        <>
            <AdminHeader />
        </>
    )
}

export default Admin;
