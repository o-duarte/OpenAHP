import React from 'react';

import { Logout } from '../auth';

const sideBarMenuItems = [
  {
    type: 'divider'
  },
  {
    type: 'header',
    text: 'texto',
    elements: [
      {
        type: 'button',
        link: '/dashboard/docs',
        icon: 'content_copy',
        text: 'Documentos'
      },
      {
        type: 'button',
        link: '/dashboard/ahp',
        icon: 'settings',
        text: 'Problemas'
      },
    ]
  },
  {
    type: 'divider'
  },
  
  
  
];

const headerMenuItems = [
  /*{
    type: 'button',
    link: '/dashboard',
    icon: 'dashboard',
    text: 'Dashboard'
  },
  {
    type: 'button',
    link: '/profile',
    icon: 'account_box',
    text: 'Perfil'
  },*/
  {
    type: 'divider'
  },
  {
    type: 'custom',
    component: <Logout forMenuList />
  }
];

const problemsTabItems = [
  {
    value: 'all',
    label: 'Todos'
  },
  {
    value: 'draft',
    label: 'Borradores'
  },
  {
    value: 'solved',
    label: 'Resueltos'
  }
];
const documentsTabItems = [
  /*
  {
    value: 'all',
    label: 'Todos'
  },*/
  {
    value: 'draft',
    label: 'Todos'
  },/*
  {
    value: 'resolved',
    label: 'Resueltos'
  }*/
];

export { sideBarMenuItems, headerMenuItems, documentsTabItems,  problemsTabItems };
