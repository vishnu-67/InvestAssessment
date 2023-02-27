import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './core/_guards/auth.guard';

const appRoutes: Routes = [
    {
        path: 'user',
        canActivate: [AuthGuard],
        loadChildren: () =>
            import('./main/assesstment/assessment.module').then((m) => m.AssessmentModule),
    },
    {
        path: 'auth',
        loadChildren: () =>
            import('./main/login/login.module').then((m) => m.LoginModule),
    },
    {
        path: '**',
        redirectTo: 'auth/login'
    },
];

@NgModule({
    imports: [RouterModule.forRoot(appRoutes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
