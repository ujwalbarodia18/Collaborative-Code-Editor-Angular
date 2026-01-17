import { Routes } from '@angular/router';
import { authGuard } from '../collaborative-code-editor/auth/auth.guard';

export const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: '',
                loadComponent: () => import('../collaborative-code-editor/feature-collaborative-code-editor/landing-page/landing-page-component.component')
                .then(m => m.LandingPageComponentComponent)
            },
            {
                path: 'editor',
                loadComponent: () => import('../collaborative-code-editor/feature-collaborative-code-editor/editor-home/editor-home-component.component')
                .then(m => m.EditorHomeComponentComponent),
                canActivate: [authGuard],
                children: [
                    {
                        path: '',
                        loadComponent: () => import('../collaborative-code-editor/feature-collaborative-code-editor/default-editor-page/default-editor-page.component')
                        .then(m => m.DefaultEditorPage)
                    },
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
