import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment'

@Injectable({
  providedIn: 'root'
})
export class AssesstmentService {
  base_url:"/assets/investmentQuestions/assessment.json"
  constructor(private http: HttpClient, private router: Router) { }

  getData(){
    return this.http.get<any>(this.base_url)
  }

  writeFile(data: any) {
    console.log('Api call',`${environment.baseAPIUrl}writeFile`)
    return this.http.post(`${environment.baseAPIUrl}writeFile`, data)
  }
}
