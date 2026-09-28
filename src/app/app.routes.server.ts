import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  { path: 'login', renderMode: RenderMode.Prerender },
  { path: 'businesses', renderMode: RenderMode.Prerender },
  { path: 'businesses/:id', renderMode: RenderMode.Server },
  { path: '**', renderMode: RenderMode.Server },
];
