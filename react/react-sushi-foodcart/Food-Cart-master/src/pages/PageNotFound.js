import React from 'react'
import { Link } from 'react-router-dom'
import{BsArrowLeftShort} from 'react-icons/bs'


const PageNotFound = () => {
  return (
    <div className='error-page'> 
      <h1> Sorry, Page Not Found</h1>
        <Link to='/'> <h3><BsArrowLeftShort/> Home</h3></Link>
    </div>
  )
}

export default PageNotFound