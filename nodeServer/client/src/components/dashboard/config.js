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
        link: '/dashboard/catalogs',
        icon: 'import_contacts',
        text: 'Catálogos'
      },
      {
        type: 'button',
        link: '/dashboard/ahp',
        icon: 'settings',
        text: 'Procesos'
      },
      {
        type: 'button',
        link: '/dashboard/codes',
        icon: 'code',
        text: 'Códigos'
      }
    ]
  },
  {
    type: 'divider'
  },
  {
    type: 'header',
    text: 'texto',
    elements: [
      {
        type: 'button',
        link: '/dashboard/users',
        icon: 'supervisor_account',
        text: 'Usuarios'
      },
      {
        type: 'button',
        link: '/dashboard/teams',
        icon: 'location_city',
        text: 'Equipos'
      }
    ]
  },
  {
    type: 'divider'
  },
  {
    type: 'header',
    text: 'texto',
    elements: [
      {
        type: 'button',
        link: '/dashboard/account',
        icon: 'account_circle',
        text: 'Mi Cuenta'
      },
      {
        type: 'button',
        link: '/dashboard/settings',
        icon: 'build',
        text: 'Opciones'
      }
    ]
  },
  {
    type: 'collapse',
    isOpen: false,
    icon: 'apps',
    text: 'texto',
    elements: [
      {
        type: 'button',
        link: '/dashboard/account',
        icon: 'send',
        text: 'Mi Cuenta'
      }
    ]
  }
];

const headerMenuItems = [
  {
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
  },
  {
    type: 'divider'
  },
  {
    type: 'custom',
    component: <Logout forMenuList />
  }
];

const documentsTabItems = [
  {
    value: 'draft',
    label: 'Borradores'
  },
  {
    value: 'published',
    label: 'Publicados'
  },
  {
    value: 'archived',
    label: 'Archivados'
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
    value: 'resolved',
    label: 'Resueltos'
  }
];

export { sideBarMenuItems, headerMenuItems, documentsTabItems,  problemsTabItems };
