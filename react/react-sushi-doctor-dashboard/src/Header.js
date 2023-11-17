import React from 'react'
import './Header.css'
import SearchIcon from '@mui/icons-material/Search';

import DehazeIcon from '@mui/icons-material/Dehaze';

function Header() {
  return (
    <div className = "header">
        <div className= "header_navigator">
                <DehazeIcon />
        </div>
        <div className='app_icon'>
            <span className = 'IconLineOne'>Health App</span>
            <span className = "IconLineTwo">Doctor's Version</span>
        </div>

        <div className='header_home_btn'>
            <a href="/">Home</a>
        </div>
        <div 
        className = "header_search">
            <input 
                className="header_searchInput"
                type = "text"/>

                <SearchIcon 
                    className="header_searchIcon"
        />
        
        
        </div>

        <div className = "header_nav">
            <div className = 'header_option'>
                
                <span className = 'header_optionLineOne'> Hello Guest</span>
                <span className = "header_option_Linetwo">Sign In</span>
            </div>    
        </div>
    </div>
  )
}

export default Header

//<a href="/">Home</a><a href="/patient">Patient</a>