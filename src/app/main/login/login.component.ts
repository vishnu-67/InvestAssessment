import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfigService } from '@fuse/services/config.service';
import { ErrorHandlerService, LoginService, SpinnerService } from 'app/core/_services';
import { ToastrService } from 'ngx-toastr';
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
  emailPattern: '/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,8}$/';
  inLogin: boolean = false;
  loginUser: any;
  userEmail: string = '';
  userId: string = '';
  userDetailsForm: FormGroup;
  supplyChainList: any = []
  chatGptRes: string = '';
  componentList: any = []

  matchCompoentList: any = [];
  viewChatGptRes: boolean = false;
  isCompleteProfile: boolean = false;
  constructor(
    private _fuseConfigService: FuseConfigService,
    private _formBuilder: FormBuilder,
    public _router: Router,
    private activatedRoute: ActivatedRoute,
    private _errorHandlerService: ErrorHandlerService,
    private _spinnerService: SpinnerService,
    private _loginService: LoginService, private _toastrService: ToastrService
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
    if (_loginService.getLocalUser()) {
      this.loginUser = atob(this._loginService.getLocalUser());
      this.loginUser = JSON.parse(this.loginUser)
      if (this.loginUser.email) {
        this.userEmail = this.loginUser.email
        this.userId = this.loginUser.userId
        //this.inLogin = true;
      }
    }
  }

  ngOnInit(): void {
    if (this._loginService.getLocalUser()) {
      //this._loginService.clearLocalUser()
    }
    this.initLogin();
    this.getMasterData()
  }

  initLogin(): void {
    try {
      this.loginForm = this._formBuilder.group({
        email: [null, Validators.compose([Validators.required, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,8}$/)])],
      });
      this.userDetailsForm = this._formBuilder.group({
        userId: ['', [Validators.required]],
        phoneNo: ['', [Validators.pattern(/^\d{10}$/)]],
        org: ['', [Validators.pattern(/^[a-zA-Z\s]*$/)]],
        jobTitle: ['', [Validators.pattern(/^[a-zA-Z\s]*$/)]],
        country: ['', [Validators.pattern(/^[a-zA-Z\s]*$/)]],
        supplyChain: [[], [Validators.required]],
        component: [[], [Validators.required]]
      })
      this.loginForm.patchValue({
        email: this.userEmail
      })
      this.userDetailsForm.patchValue({
        userId: this.userId
      })
    } catch (e) {
      this._errorHandlerService.logUnknownError(e);
    }
  }

  getMasterData() {
    this._loginService.getMaster({}).subscribe((res: any) => {
      console.log(res)
      if (res?.data?.componentMaster) {
        this.componentList = res?.data?.componentMaster
      }
      if (res?.data?.supplyChainMaster) {
        this.supplyChainList = res?.data?.supplyChainMaster
      }
    }, (err) => {
      console.log(err)
    })
  }

  onChangeSupplyChain() {
    console.log(this.userDetailsForm.value);
    this.matchCompoentList = []; // Reset the matchCompoentList array

    const selectedSupplyChainIds = this.userDetailsForm.get('supplyChain').value;

    for (const supplyChainId of selectedSupplyChainIds) {
      const matchedComponents = this.componentList.filter((component: { supplyChainId: any; }) => component.supplyChainId == supplyChainId);
      matchedComponents.forEach((component: { name: any; }) => {
        if (!this.matchCompoentList.some((c: any) => c.name === component.name)) {
          this.matchCompoentList.push(component);
        }
        // this.matchCompoentList.push(component);
      });
    }
    console.log(this.matchCompoentList)

  }

  onBack(index: any) {
    console.log(index)
    if (index == 1) {
      this.inLogin = false;
    }
    else if (index == 2) {
      this.inLogin = true;
      this.viewChatGptRes = false;
    }
  }

  onLogin() {
    console.log(this.loginForm.value.email)
    if (this.loginForm.valid) {
      this._spinnerService.show();
      this._loginService.registor({ email: this.loginForm.value.email }).subscribe((res: any) => {
        console.log(res.data);
        if (res?.status == 200) {
          //if(res?.data?.isComplete == 0 && res?.data?.isActive == 1){
          this.inLogin = true;
          //}

          this.isCompleteProfile = res?.data?.isComplete == 0 ? false : true;
          console.log(this.loginForm.value.email)
          this.userEmail = this.loginForm.value.email
          let emailEncrypt = {
            email: this.loginForm.value.email,
            userId: res?.data?.id ? res?.data?.id : ''
          };
          this.userId = emailEncrypt.userId
          this.userDetailsForm.patchValue({
            userId: this.userId
          })
          this._loginService.setLocalUser(JSON.stringify(emailEncrypt));
        }
        else {
          this._toastrService.error(res?.message ? res?.message : 'Internal server error', 'Failed', {
            closeButton: true
          })
        }
        this._spinnerService.hide();
      }, (err) => {
        console.log(err)
        this._toastrService.error(err?.message ? err?.message : 'Internal server error', 'Failed', {
          closeButton: true
        })
      })

      //this._router.navigateByUrl('/user/assesst')
    }
  }

  onSaveUserInfo() {
    if (this.userEmail && this.userDetailsForm.valid) {
      this._spinnerService.show();
      let supplyChainQue = '';
      let componentString = '';
      if (this.userDetailsForm.value.supplyChain.length > 0) {
        supplyChainQue = this.userDetailsForm.value.supplyChain
          .map((id: any) => this.supplyChainList.find((obj: { id: any; }) => obj.id == id))
          .filter((obj: any) => obj !== undefined)
          .map((obj: { name: any; }) => obj.name)
          .join(',');
      }
      console.log(supplyChainQue)
      if (this.userDetailsForm.value.component.length > 0) {
        componentString = this.userDetailsForm.value.component
          .map((id: any) => this.matchCompoentList.find((obj: { id: any; }) => obj.id == id))
          .filter((obj: any) => obj !== undefined)
          .map((obj: { name: any; }) => obj.name)
          .join(',');
      }
      console.log(componentString)
      let userDetails = {
        email: this.loginForm.value.email ? this.loginForm.value.email : this.userEmail ? this.userEmail : null,
        userId: this.userDetailsForm.value.userId ? this.userDetailsForm.value.userId : null,
        phoneNo: this.userDetailsForm.value.phoneNo ? this.userDetailsForm.value.phoneNo : null,
        org: this.userDetailsForm.value.org ? this.userDetailsForm.value.org : null,
        jobTitle: this.userDetailsForm.value.jobTitle ? this.userDetailsForm.value.jobTitle : null,
        country: this.userDetailsForm.value.country ? this.userDetailsForm.value.country : null,
        isComplete: this.isCompleteProfile == true ? 1 : 0,
        supplyChain: supplyChainQue,
        component: componentString
      }
      console.log(userDetails);
      this._loginService.updateUserInfo(userDetails).subscribe((res: any) => {
        this._spinnerService.hide()
        console.log(res)
        if (res?.status == 200) {
          this._toastrService.success(res?.message ? res?.message : 'Successfully updated', 'Success', {
            closeButton: true
          })
          if (res?.data.chatGptRes) {
            this.chatGptRes = res?.data.chatGptRes;
            this.viewChatGptRes = true;
            this.isCompleteProfile = true;
          }
        }
        else {
          this._toastrService.error(res?.message ? res?.message : 'Internal server error', 'Failed', {
            closeButton: true
          })
        }
      }, err => {
        console.log(err)
        this._spinnerService.hide()
        this._toastrService.error(err?.message ? err?.message : 'Internal server error', 'Failed', {
          closeButton: true
        })
      })
    }
  }

  onsearch() {
    if (this.userEmail && this.userDetailsForm.valid) {
      this._spinnerService.show();
      let supplyChainQue = '';
      let componentString = '';
      if (this.userDetailsForm.value.supplyChain.length > 0) {
        supplyChainQue = this.userDetailsForm.value.supplyChain
          .map((id: any) => this.supplyChainList.find((obj: { id: any; }) => obj.id == id))
          .filter((obj: any) => obj !== undefined)
          .map((obj: { name: any; }) => obj.name)
          .join(',');
      }
      console.log(supplyChainQue)

      if (this.userDetailsForm.value.component.length > 0) {
        componentString = this.userDetailsForm.value.component
          .map((id: any) => this.matchCompoentList.find((obj: { id: any; }) => obj.id == id))
          .filter((obj: any) => obj !== undefined)
          .map((obj: { name: any; }) => obj.name)
          .join(',');
      }
      console.log(componentString)
      let userDetails = {
        userId: this.userDetailsForm.value.userId ? this.userDetailsForm.value.userId : null,
        supplyChain: supplyChainQue,
        component: componentString
      }
      console.log(userDetails)
      this._loginService.updateUserInfo(userDetails).subscribe((res: any) => {
        this._spinnerService.hide()
        console.log(res)
        if (res?.status == 200) {
          this._toastrService.success(res?.message ? res?.message : 'Successfully updated', 'Success', {
            closeButton: true
          })
        }
        else {
          this._toastrService.error(res?.message ? res?.message : 'Internal server error', 'Failed', {
            closeButton: true
          })
        }
      }, err => {
        console.log(err)
        this._spinnerService.hide()
        this._toastrService.error(err?.message ? err?.message : 'Internal server error', 'Failed', {
          closeButton: true
        })
      })
    }
  }

}
