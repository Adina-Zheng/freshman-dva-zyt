const adminRoutes = [
  {
    path: '/user',
    models: () => [import('../models')],
    component: () => import('./UserManager')
  },
  {
    path: '/user/detail',
    models: () => [import('../models')],
    component: () => import('./UserDetail')
  }
];

export default adminRoutes;
