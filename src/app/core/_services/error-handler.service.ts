import { Injectable, OnInit, Injector, ErrorHandler } from '@angular/core';
// import { NotificationService } from './notification.service';
import { SpinnerService } from 'app/core/_services/spinner.service';
import { HttpErrorResponse } from '@angular/common/http';
import { environment } from 'environments/environment';

@Injectable()
export class ErrorHandlerService {
    constructor(
        private injector: Injector,
        private spinnerService: SpinnerService
    ) { }

    log(data: any): void {
        if (!environment.production) {
            console.log(data);
        }
    }

    logUnknownError(error: any): void {
        // const pageLoaderService = this.injector.get(PageLoaderService);
        // const notificationService = this.injector.get(NotificationService);
        // pageLoaderService.displayPageLoader(false);

        if (error && error instanceof Object) {
            error = JSON.parse(JSON.stringify(error));
        }

        if (!environment.production && error) {
            console.error(error);
        } else {
            console.error(error);
            // notificationService.displayAlert('Unexpected error occured while processing request. Kindly contact your administrator');
        }
        this.spinnerService.reset();
    }

    logKnownError(errorCode): void {
        // const pageLoaderService = this.injector.get(PageLoaderService);
        // const notificationService = this.injector.get(NotificationService);
        // pageLoaderService.displayPageLoader(false);
        // if (+errorCode === 504) {
        //     notificationService.displayAlert('Unable to fetch calls due to heavy load. Kindly modify your search criteria and try again');
        // }
    }

    logUserDataErrors(err: any): void {
        const errorList = err.error.errors;
        const errorKeys: any[] = Object.keys(errorList);
        const errors = [];
        const message = err.error.message;
        const errormsgs = errorKeys.map(item => {
            const errorMessages: string[] = errorList[item];
            errorMessages.map(d => {
                errors.push(d);
            });
        });

        // const notificationService = this.injector.get(NotificationService);
        // notificationService.displayUserValidationErrors(errors, message);
    }
}
