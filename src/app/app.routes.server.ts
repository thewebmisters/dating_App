import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  // Public pages - server-side rendering for SEO
  { path: '', renderMode: RenderMode.Server },
  { path: 'landing-page', renderMode: RenderMode.Server },
  { path: 'login', renderMode: RenderMode.Server },
  { path: 'signup', renderMode: RenderMode.Server },
  { path: 'forgot-password', renderMode: RenderMode.Server },
  { path: 'reset', renderMode: RenderMode.Server },

  // Dynamic/authenticated pages - client-side rendering
  { path: 'chat-screen/**', renderMode: RenderMode.Client },
  { path: 'client-chat/**', renderMode: RenderMode.Client },
  { path: 'writer-dashboard', renderMode: RenderMode.Client },
  { path: 'client-home', renderMode: RenderMode.Client },
  { path: 'buy-credit', renderMode: RenderMode.Client },
  { path: 'admin-panel', renderMode: RenderMode.Client },

  // Fallback
  { path: '**', renderMode: RenderMode.Client }
];
