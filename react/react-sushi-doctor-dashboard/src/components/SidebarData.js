import React from 'react';
import * as FaIcons from 'react-icons/fa';
import * as AiIcons from 'react-icons/ai';
import * as IoIcons from 'react-icons/io';
import * as RiIcons from 'react-icons/ri';
import { FcWorkflow } from 'react-icons/fc';
import { RiAdminFill } from 'react-icons/ri';

export const SidebarData = [

  {
    title: 'Home',
    path: '/Home',
    icon: <AiIcons.AiFillHome />,

  },


  {
    title: 'Daily Work Flow ',
    path: '/Home',
    icon: <FcWorkflow />,
    iconClosed: <RiIcons.RiArrowDownSFill />,
    iconOpened: <RiIcons.RiArrowUpSFill />,

    subNav: [
      {
        title: 'OutPatient',
        path: '/',
        icon: <IoIcons.IoIosPaper />
      },
      {
        title: 'Inpatients',
        path: '/Inpatients',
        icon: <IoIcons.IoIosPaper />
      },
      {
        title: 'Follow Up patients',
        path: '/overview/revenue',
        icon: <IoIcons.IoIosPaper />
      },
      {
        title: 'Referrals',
        path: '/overview/revenue',
        icon: <IoIcons.IoIosPaper />
      },
      {
        title: 'Communication',
        path: '/overview/revenue',
        icon: <IoIcons.IoIosPaper />
      },
      {
        title: 'Tele Medicine',
        path: '/overview/revenue',
        icon: <IoIcons.IoIosPaper />
      },
      {
        title: 'Speciality Specific Updates',
        path: '/overview/revenue',
        icon: <IoIcons.IoIosPaper />
      },
      {
        title: 'Health statistics',
        path: '/overview/revenue',
        icon: <IoIcons.IoIosPaper />
      },
    ]
  },
  {
    title: 'Managment',
    path: '/Managment',
    icon: <RiAdminFill />,
    iconClosed: <RiIcons.RiArrowDownSFill />,
    iconOpened: <RiIcons.RiArrowUpSFill />,

    subNav: [
      {
        title: 'Personal Managment',
        path: '/',
        icon: <IoIcons.IoIosPaper />,
        cName: 'sub-nav'
      },
      {
        title: 'Setting',
        path: '/reports/reports2',
        icon: <IoIcons.IoIosPaper />,
        cName: 'sub-nav'
      },
      {
        title: 'Clinic Managment',
        path: '/reports/reports3',
        icon: <IoIcons.IoIosPaper />
      },
      {
        title: 'Templates',
        path: '/reports/reports3',
        icon: <IoIcons.IoIosPaper />
      }
    ]
  },
  {
    title: 'Team',
    path: '/PageNotFound',
    icon: <IoIcons.IoMdPeople />
  },
  {
    title: 'Messages',
    path: '/messages',
    icon: <FaIcons.FaEnvelopeOpenText />,

    iconClosed: <RiIcons.RiArrowDownSFill />,
    iconOpened: <RiIcons.RiArrowUpSFill />,

    subNav: [
      {
        title: 'Message 1',
        path: '/messages/message1',
        icon: <IoIcons.IoIosPaper />
      },
      {
        title: 'Message 2',
        path: '/messages/message2',
        icon: <IoIcons.IoIosPaper />
      }
    ]
  },
  {
    title: 'Support',
    path: '/support',
    icon: <IoIcons.IoMdHelpCircle />
  }
];
