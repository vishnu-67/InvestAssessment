import { NgModule, Optional, SkipSelf } from '@angular/core';
import {
    HTTP_INTERCEPTORS,
    HttpClient,
    HttpClientModule,
} from '@angular/common/http';

import { AuthGuard } from 'app/core/_guards/auth.guard';
import { APIInterceptor } from 'app/core/_interceptors/api.interceptor';

import { SpinnerService, ErrorHandlerService, LoginService } from 'app/core/_services/index';
import { ToastrModule } from 'ngx-toastr';
import { LineBreaksPipe } from './_pipes/textTransfer.pipe';

@NgModule({
    imports: [HttpClientModule,ToastrModule.forRoot({
        timeOut: 15000,
        positionClass: 'toast-bottom-right',
        preventDuplicates: true,
    })],
    providers: [
        APIInterceptor,
        AuthGuard,
        SpinnerService,
        ErrorHandlerService,
        LoginService
    ],
    exports: [ToastrModule],
    declarations: [],
})
export class CoreModule {
    constructor() {
    }
}
