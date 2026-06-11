import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/Login',
      name: 'Login',
      component: () => import('../views/LoginView.vue'),
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('../views/DashboardView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/agenda',
      name: 'agenda',
      component: () => import('../views/AgendaView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/consultas',
      name: 'consultas',
      component: () => import('../views/ConsultasView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/consultas/novo',
      name: 'consultas-novo',
      component: () => import('../views/ConsultaNovaView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/consultas/:id',
      name: 'consulta-detalhe',
      component: () => import('../views/ConsultaDetalheView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/consultas/:id/atendimento',
      name: 'atendimento',
      component: () => import('../views/AtendimentoView.vue'),
      meta: { requiresAuth: true, perfil: ['medico'] },
    },
    {
      path: '/pacientes',
      name: 'pacientes',
      component: () => import('../views/PacientesView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/pacientes/novo',
      name: 'pacientes-novo',
      component: () => import('../views/PacienteNovoView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/pacientes/:id',
      name: 'paciente-detalhe',
      component: () => import('../views/PacienteDetalheView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/medicos',
      name: 'medicos',
      component: () => import('../views/MedicosView.vue'),
      meta: { requiresAuth: true, perfil: ['admin'] },
    },
    {
      path: '/profissionais',
      name: 'profissionais',
      component: () => import('../views/ProfissionaisView.vue'),
      meta: { requiresAuth: true, perfil: ['admin'] },
    },
    {
      path: '/relatorios',
      name: 'relatorios',
      component: () => import('../views/RelatoriosView.vue'),
      meta: { requiresAuth: true, perfil: ['admin', 'medico'] },
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/login',
    },
  ],
})
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  const user = JSON.parse(localStorage.getItem('user') || '{}')

  if (to.meta.requiresAuth && !token) {
    return next('/login')
  }
  if (to.name === 'login' && token) {
    return next('/dashboard')
  }

  if (to.meta.perfil && !to.meta.perfil.includes(user.perfil)) {
    return next('/dashboard')
  }

  next()
})

export default router
