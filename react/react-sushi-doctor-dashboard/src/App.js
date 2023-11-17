import React from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';


/** import all components */
import Username from './components/Username';
import Password from './components/Password';
import Register from './components/Register';
import Profile from './components/Profile';
import Sidebar from './components/Sidebar';
import Home from './Home';
import Recovery from './components/Recovery';
import Reset from './components/Reset';
import PageNotFound from './components/PageNotFound';
import Patient from './Patient';
import Managment from './Managment';
import Outpatients from './view/Outpatients'

import OP_OPEMR from './view/OP_OPEMR';



/** auth middleware */
import { AuthorizeUser, ProtectRoute } from './middleware/auth'

/** root routes */
const router = createBrowserRouter([
    {
        path: '/',
        element: <Username></Username>
    },
    {
        path: '/register',
        element: <Register></Register>
    },
    {
        path: '/password',
        element: <ProtectRoute><Password /></ProtectRoute>
    },
    {
        path: '/profile',
        element: <AuthorizeUser><Profile /></AuthorizeUser>
    },
    {
        path: '/recovery',
        element: <Recovery></Recovery>
    },
    {
        path: '/reset',
        element: <Reset></Reset>
    },
    {
        path: '*',
        element: <PageNotFound></PageNotFound>
    },
    {
        path: '/Home',
        element: <AuthorizeUser><Sidebar /><Home /></AuthorizeUser>
    },
    {
        path: '/Patient',
        element: <AuthorizeUser><Sidebar /><Patient /></AuthorizeUser>
    },
    {
        path: '/Managment',
        element: <AuthorizeUser><Sidebar /><Managment /></AuthorizeUser>
    },
    {
        path: '/Outpatients',
        element: <AuthorizeUser><Sidebar /><Outpatients /></AuthorizeUser>
    },
    {
        path: '/opemr/:inpatientID',
        element: <AuthorizeUser><Sidebar /><OP_OPEMR /></AuthorizeUser>
    },
])

export default function App() {
    return (
        <main>
            <RouterProvider router={router}></RouterProvider>
            {/* <Router>
                <Route exact path="/" component={HomePage} />
                <Route path="/person/:personId" component={PersonPage} />
            </Router> */}
        </main>


    )
}
