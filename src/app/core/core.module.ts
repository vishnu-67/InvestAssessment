import { NgModule, Optional, SkipSelf } from '@angular/core';
import {
    HTTP_INTERCEPTORS,
    HttpClient,
    HttpClientModule,
} from '@angular/common/http';

import { AuthGuard } from 'app/core/_guards/auth.guard';
import { APIInterceptor } from 'app/core/_interceptors/api.interceptor';

import { SpinnerService, ErrorHandlerService, LoginService } from 'app/core/_services/index';

@NgModule({
    imports: [HttpClientModule],
    providers: [
        APIInterceptor,
        AuthGuard,
        SpinnerService,
        ErrorHandlerService,
        LoginService
    ],
    exports: [],
    declarations: [],
})
export class CoreModule {
    constructor() {
    }
}
