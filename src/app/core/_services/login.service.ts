import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Response } from '../_models/index';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable()
export class LoginService {
    private userInfo = 'userInfo';
    private storeKey = btoa('user');
    constructor(private http: HttpClient, private router: Router) {
    }

    UserLogin(pdata: any): Observable<Response> {
        return this.http.post<Response>(environment.baseAPIUrl + '/user/adminLogin', pdata);
    }

    isAuthenticated(): boolean {
        const token = localStorage.getItem(this.userInfo);
        if (token) {
            return true;
        } else {
            return false;
        }
    }

    removeLocalStorage(): void {
        localStorage.clear();
    }

    logout(): void {
        this.removeLocalStorage();
        this.router.navigate(['/auth/login']);
    }

    getUser(): any {
        return JSON.parse(localStorage.getItem(this.userInfo));
    }

    setUser(userdata: JSON): void {
        localStorage.setItem(this.userInfo, JSON.stringify(userdata));
    }

    setLocalUser(email:string){
        localStorage.setItem(this.storeKey,btoa(email));
    }

    getLocalUser(){
        return localStorage.getItem(this.storeKey);
    }

    clearLocalUser(){
        return localStorage.clear()
    }
}
