import { HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { environment } from '../../../environments/environment';
import { APIInterceptor } from './api.interceptor';

describe('APIInterceptor', () => {
    let httpClient: HttpClient;
    let httpMock: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [
                { provide: HTTP_INTERCEPTORS, useClass: APIInterceptor, multi: true }
            ]
        });
        httpClient = TestBed.inject(HttpClient);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => httpMock.verify());

    it('should add correct Content-Security-Policy', () => {
        const header = 'Content-Security-Policy';
        const expectedHeader = `frame-ancestors ${environment.security.allowedOrigins}`;

        httpClient.get('/').subscribe(() => { });
        httpMock
            .expectOne(req => (req.headers.has(header) && req.headers.get(header) === expectedHeader))
            .flush({});
    });

    it('should add correct X-Frame-Options', () => {
        const header = 'X-Frame-Options';
        const expectedHeader = `ALLOW-FROM ${environment.security.allowedOrigins}`;

        httpClient.get('/').subscribe(() => { });
        httpMock
            .expectOne(req => (req.headers.has(header) && req.headers.get(header) === expectedHeader))
            .flush({});
    });

    it('should add correct X-XSS-Protection', () => {
        const header = 'X-XSS-Protection';
        const expectedHeader = '1; mode=block';

        httpClient.get('/').subscribe(() => { });
        httpMock
            .expectOne(req => (req.headers.has(header) && req.headers.get(header) === expectedHeader))
            .flush({});
    });
});
