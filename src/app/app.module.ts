import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import 'hammerjs';

import { FuseModule } from '@fuse/fuse.module';
import { FuseSharedModule } from '@fuse/shared.module';
import { FuseProgressBarModule, FuseSidebarModule, FuseThemeOptionsModule } from '@fuse/components';

import { fuseConfig } from 'app/fuse-config';

import { AppComponent } from 'app/app.component';
import { CoreModule } from 'app/core/core.module';
import { LayoutModule } from 'app/layout/layout.module';
import { SampleModule } from 'app/main/sample/sample.module';

import { AppRoutingModule } from 'app/app-routing.module';
import { AssessmentModule } from './main/assesstment/assessment.module';
import { MaterialModule } from 'Material.module';
import { LoginComponent } from './main/login/login.component';
import { LoginModule } from './main/login/login.module';
import { MatSpinner } from '@angular/material/progress-spinner';

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        AppRoutingModule,

        TranslateModule.forRoot(),

        // Fuse modules
        FuseModule.forRoot(fuseConfig),
        FuseProgressBarModule,
        FuseSharedModule,
        FuseSidebarModule,
        FuseThemeOptionsModule,

        // App modules
        CoreModule,
        LayoutModule,
        SampleModule,
        AssessmentModule,
        MaterialModule,
        LoginModule
    ],
    bootstrap: [
        AppComponent
    ],
    providers: [
    ],
    entryComponents:[
        MatSpinner
    ]
})
export class AppModule {
}
