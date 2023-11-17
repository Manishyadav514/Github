import React, { useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import * as FaIcons from 'react-icons/fa';

import { SidebarData } from './SidebarData';
import SubMenu from './SubMenu';
import { IconContext } from 'react-icons/lib';
import './Header.css';
import SearchIcon from '@mui/icons-material/Search';

const Nav = styled.div`
    height: 60px;
    display: flex;
    align-items: center;
    background-color: #000000;
    position: sticky;
    top: 0;
   
    box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
`;

const NavIcon = styled(Link)`
    display: flex;
    margin-left: 20px;
    margin-right: 40px;
    color: white;
    font-size: 1rem;
    height: 20px;
    justify-content: flex-start;
    align-items: center;
    
`;

const SidebarNav = styled.nav`
  background: #000000;
  width: 250px;
  height: 100vh;
  display: flex;
  justify-content: center;
  position: fixed;
  top: 15;
  left: ${({ sidebar }) => (sidebar ? '0' : '-100%')};
	transition: 600ms;
  z-index: 10;
  box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
`;

const SidebarWrap = styled.div`
  width: 80%;
`;

const Sidebar = () => {
  const [sidebar, setSidebar] = useState(false);

  const showSidebar = () => setSidebar(!sidebar);

  return (
    <>
      <IconContext.Provider value={{ color: '#fff' }}>
        <Nav>
          <NavIcon to='#'>
            <FaIcons.FaBars onClick={showSidebar} />
          </NavIcon>
          <div className='app_icon'>
            <span className = 'IconLineOne'>Health App</span>
            <span className = "IconLineTwo">Doctor's Version</span>
          </div>
          <div 
              className = "header_search">
                <input 
                  className="header_searchInput"
                  type = "text"/>

                <SearchIcon 
                      className="header_searchIcon"/>
        
        
          </div>
        <div className = "header_nav">
            
            <Link to = '/profile'>
              <div className = 'header_option'>
                  
                  <span className = 'header_optionLineOne'> Hello Guest</span>
                  <span className = "header_option_Linetwo">Sign In</span>
              </div>
            </Link>    
        </div>
        </Nav>
        <SidebarNav sidebar={sidebar}>
          <SidebarWrap>
            {/* <NavIcon to='#'>
              <AiIcons.AiOutlineClose onClick={showSidebar} />
            </NavIcon> */}
            {SidebarData.map((item, index) => {
              return <SubMenu item={item} key={index} />;
            })}
          </SidebarWrap>
        </SidebarNav>
      </IconContext.Provider>
    </>
  );
};

export default Sidebar;
