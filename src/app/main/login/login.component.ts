import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfigService } from '@fuse/services/config.service';
import { ErrorHandlerService, LoginService, SpinnerService } from 'app/core/_services';
//import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  emailPattern:'/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,8}$/'
  constructor(
    private _fuseConfigService: FuseConfigService,
    private _formBuilder: FormBuilder,
    public _router: Router,
    private activatedRoute: ActivatedRoute,
    private _errorHandlerService: ErrorHandlerService,
    private _spinnerService: SpinnerService,
    private _loginService:LoginService
) {
    // Configure the layout
    this._fuseConfigService.config = {
        layout: {
            navbar: {
                hidden: true
            },
            toolbar: {
                hidden: true
            },
            footer: {
                hidden: true
            },
            sidepanel: {
                hidden: true
            }
        }
    };
}

  ngOnInit(): void {
    if(this._loginService.getLocalUser()){
      this._loginService.clearLocalUser()
    }
    this.initLogin();
  }

  initLogin(): void {
    try {
        this.loginForm = this._formBuilder.group({
            email: [null, Validators.compose([Validators.required, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,8}$/)])],
        });
    } catch (e) {
        this._errorHandlerService.logUnknownError(e);
    }
}

onLogin(){
  console.log(this.loginForm.value.email)
  if(this.loginForm.valid){
    this._spinnerService.show();
    console.log(this.loginForm.value.email)
    let emailEncrypt = this.loginForm.value.email;
    this._loginService.setLocalUser(emailEncrypt);
    this._spinnerService.hide();
    this._router.navigateByUrl('/user/assesst')
  }
}
}
