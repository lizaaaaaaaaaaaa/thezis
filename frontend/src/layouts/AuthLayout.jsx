import React from 'react'
import { Outlet } from 'react-router-dom'
import HeaderAuth from '../components/header-auth/HeaderAuth';

const AuthLayout = () => {
  return (
    <>
        <HeaderAuth/>
        <Outlet/>
    </>
  )
}

export default AuthLayout;