export const navigationItems = [
  {
    label: 'Dashboard',
    path: '/dashboard',
    exact: true,
    roles: ['ADMIN', 'USER', 'EMPLOYEE']
  },

  // User (Customer) specific routes
  {
    label: 'My Accounts',
    path: '/dashboard/accounts',
    roles: ['USER']
  },
  {
    label: 'Transfer Money',
    path: '/dashboard/transactions/new',
    roles: ['USER']
  },
  {
    label: 'Transaction History',
    path: '/dashboard/transactions',
    roles: ['USER']
  },
  {
    label: 'Apply for Loan',
    path: '/dashboard/loans/apply',
    roles: ['USER']
  },
  {
    label: 'My Loans',
    path: '/dashboard/loans',
    roles: ['USER']
  },
  {
    label: 'Bill Payments',
    path: '/dashboard/bills',
    roles: ['USER']
  },

  // Admin specific routes
  {
    label: 'User Management',
    path: '/dashboard/users',
    roles: ['ADMIN']
  },
  {
    label: 'Account Management',
    path: '/dashboard/accounts',
    roles: ['ADMIN']
  },
  {
    label: 'Loan Management',
    path: '/dashboard/admin/loans',
    roles: ['ADMIN']
  },
  {
    label: 'System Reports',
    path: '/dashboard/admin/reports',
    roles: ['ADMIN']
  },

  // Employee specific routes
  {
    label: 'Client Accounts',
    path: '/dashboard/employee/accounts',
    roles: ['EMPLOYEE']
  },
  {
    label: 'Pending Transactions',
    path: '/dashboard/employee/transactions',
    roles: ['EMPLOYEE']
  },
  {
    label: 'Loan Applications',
    path: '/dashboard/employee/loans',
    roles: ['EMPLOYEE']
  }
];
