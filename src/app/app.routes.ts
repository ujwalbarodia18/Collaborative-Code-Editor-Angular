import { Routes } from '@angular/router';
import { authGuard } from '../collaborative-code-editor/auth/auth.guard';

export const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: '',
                loadComponent: () => import('../collaborative-code-editor/feature-collaborative-code-editor/landing-page/landing-page-component.component')
                .then(m => m.LandingPageComponentComponent),
                canActivate: [authGuard],
            },
            {
                path: 'auth',
                loadComponent: () => import('../collaborative-code-editor/auth/components/auth-page-component/auth-page.component')
                .then(m => m.AuthPage),
            },
            {
                path: 'editor',
                loadComponent: () => import('../collaborative-code-editor/feature-collaborative-code-editor/editor-home/editor-home-component.component')
                .then(m => m.EditorHomeComponentComponent),
                canActivate: [authGuard],
                children: [
                    {
                        path: ':id',
                        loadComponent: () => import('../collaborative-code-editor/feature-collaborative-code-editor/editor-room/editor-room-component.component')
                        .then(m => m.EditorRoomComponentComponent)
                    }
                ]
            }
        ]
    }
];
