import type { Component } from 'vue'
import type { RouteRecordRaw } from 'vue-router'

import { authMiddleware } from '@/middlewares/auth.middleware'
import { authRoutes } from '@/modules/auth/routes/auth.routes.ts'
import { contactRoutes } from '@/modules/contact/routes/contact.routes'
import type { RoutesProccessed } from '@/types/global/vueRouter'
import { woawzerRoutes } from "@/modules/woawzer/routes/woawzer.routes.ts";
import { notificationRoutes } from "@/modules/notification/routes/notification.routes.ts";
import { cactusRoutes } from "@/modules/cactus/routes/cactus.routes.ts";
import { woawzersRoutes } from "@/modules/woawzers/routes/woawzers.routes.ts";
import { coolioRoutes } from "@/modules/coolio/routes/coolio.routes.ts";

export const routes = [
  {
    path: '',
    component: (): Component => import('@/components/layout/dashboard/AppDashboardLayout.vue'),
    meta: {
      middleware: [
        authMiddleware,
      ],
    },
    children: [
      {
        name: 'index',
        path: '',
        redirect: {
          name: 'contact-overview',
        },
      },
      /**
       * Authenticated routes
       */
      ...contactRoutes,
        ...woawzerRoutes,
        ...notificationRoutes,
        ...cactusRoutes,
        ...woawzersRoutes,
        ...coolioRoutes,
    ],
  },
  /**
   * Unauthenticated routes
   */
  ...authRoutes,
  {
    name: '404',
    path: '/:catchAll(.*)',
    redirect: {
      name: 'index',
    },
  },
] as const satisfies RouteRecordRaw[]

declare module '@wisemen/vue-core-components' {
  interface Routes extends RoutesProccessed {}
}
