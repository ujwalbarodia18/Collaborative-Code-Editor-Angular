import { Routes } from '@angular/router';

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
