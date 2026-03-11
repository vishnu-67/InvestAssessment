import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './core/_guards/auth.guard';

const appRoutes: Routes = [
    // {
    //     path: 'user',
    //     canActivate: [AuthGuard],
    //     loadChildren: () =>
    //         import('./main/assesstment/assessment.module').then((m) => m.AssessmentModule),
    // },
    // {
    //     path: 'auth',
    //     loadChildren: () =>
    //         import('./main/login/login.module').then((m) => m.LoginModule),
    // },
    {
        path: 'customer',
        loadChildren: () =>
            import('./main/chatGpt/chatgpt.module').then((m) => m.ChatgptModule),
    },
    {
        path: '**',
        redirectTo: 'customer/strategic'
    },
];

@NgModule({
    imports: [RouterModule.forRoot(appRoutes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
