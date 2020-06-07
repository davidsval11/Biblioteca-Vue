export default [
  {
    _name: 'CSidebarNav',
    _children: [
      {
        _name: 'CSidebarNavItem',
        name: 'Dashboard',
        to: '/dashboard',
        icon: 'cil-speedometer'
      },
      {
        _name: 'CSidebarNavTitle',
        _children: ['Menu Principal']
      },
      
      {
        _name: 'CSidebarNavDropdown',
        name: 'Library',
        route: '/library',
        icon: 'cil-bank',
        items: [
          {
            name: 'Books',
            icon: 'cil-address-book',
            to: '/library/Books'
          },
          {
            name: 'Reader',
            icon: 'cil-people',
            to: '/library/Reader'
          },
        ]
      },
      {
        _name: 'CSidebarNavDropdown',
        name: 'Loan Books',
        route: '/loan',
        icon: 'cil-calendar',
        items: [
          {
            name: 'Loan',
            icon: 'cil-layers',
            to: '/loan/Loan'
          },
        ]
      }
    ]
  }
]