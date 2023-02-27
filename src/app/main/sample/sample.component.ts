import { Component, OnInit } from '@angular/core';

import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';

import { locale as english } from './i18n/en';
import { locale as turkish } from './i18n/tr';

import { finalize } from 'rxjs/operators';

import { SpinnerService, ErrorHandlerService, LoginService } from 'app/core/_services/index';

@Component({
    selector: 'sample',
    templateUrl: './sample.component.html',
    styleUrls: ['./sample.component.scss']
})
export class SampleComponent implements OnInit {
    /**
     * Constructor
     *
     * @param {FuseTranslationLoaderService} _fuseTranslationLoaderService
     */
    constructor(
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private _spinnerService: SpinnerService,
        private _errorHandlerService: ErrorHandlerService,
        private _loginService: LoginService
    ) {
        this._fuseTranslationLoaderService.loadTranslations(english, turkish);
    }

    ngOnInit(): void {
        try {
            this._spinnerService.show();
            const pdata = '';
            this._loginService
                .UserLogin(pdata)
                .pipe(
                    finalize(() => {
                        this._spinnerService.hide();
                    })
                )
                .subscribe(
                    response => {
                        console.log(response);
                    },
                    error => {
                        this._errorHandlerService.logUnknownError(error);
                    }
                );

        } catch (e) {
            this._errorHandlerService.logUnknownError(e);
        }
    }
}
