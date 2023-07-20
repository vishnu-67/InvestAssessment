import { AfterViewInit, Component, ElementRef, OnInit, Renderer2, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSelect } from '@angular/material/select';
import { ActivatedRoute, Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfigService } from '@fuse/services/config.service';
import { removeSpacesInText, removeWhiteSpaces, rmBetweenWhiteSpaces } from 'app/core/_helper/common.helper';
import { ErrorHandlerService, LoginService, SpinnerService } from 'app/core/_services';
import { ToastrService } from 'ngx-toastr';
//import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-chatgpt',
  templateUrl: './chatgpt.component.html',
  styleUrls: ['./chatgpt.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class ChatgptComponent implements OnInit {
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
  industryMasterList :any =[];

  quesForm:FormGroup;
  userForm:FormGroup;
  showSelect:boolean = false;
  matchCompoentList: any = [];
  viewChatGptRes: boolean = false;
  isCompleteProfile: boolean = false;
  
  isShowQue : boolean =true;
  isShowEMail :boolean =false;
  isShowUserDetails :boolean =false;
  isViewChatres:boolean =false;
  isFirst:boolean=false;

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
        this.userEmail = this.loginUser.email;
        this.userId = this.loginUser.userId;
        this.isCompleteProfile = this.loginUser.isCompleteProfile
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
        phoneNo: ['', [Validators.pattern(/^\d{10}$/)]],
        org: ['', [Validators.pattern(/^[a-zA-Z\s]*$/)]],
        jobTitle: ['', [Validators.pattern(/^[a-zA-Z\s]*$/)]],
        country: ['', [Validators.pattern(/^[a-zA-Z\s]*$/)]]
      });

      this.userDetailsForm = this._formBuilder.group({
        userId: ['', [Validators.required]],
        phoneNo: ['', [Validators.pattern(/^\d{10}$/)]],
        org: ['', [Validators.pattern(/^[a-zA-Z\s]*$/)]],
        jobTitle: ['', [Validators.pattern(/^[a-zA-Z\s]*$/)]],
        country: ['', [Validators.pattern(/^[a-zA-Z\s]*$/)]]
      })

      this.quesForm = this._formBuilder.group({
        userId: ['', []],
        supplyChain: [[], [Validators.required]],
        component: [[], [Validators.required]],
        industry : [[], [Validators.required]],
        details: [[], [Validators.required,removeWhiteSpaces,removeSpacesInText]],
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
      if(res?.data?.industryMaster){
        this.industryMasterList = res?.data?.industryMaster
      }
    }, (err) => {
      console.log(err)
    })
  }

  toggleSelect() {
    this.showSelect = !this.showSelect;
  }

  onChangeSupplyChain(event:any) {
    console.log(event);
    this.matchCompoentList = []; // Reset the matchCompoentList array

    const selectedSupplyChainIds = this.quesForm.get('supplyChain').value;

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
    if(this.quesForm.value.supplyChain.length > 0){
      event.source.close();
    }
  }

  onComponentChange(event:any){
    if(this.quesForm.value.component.length > 0 || this.matchCompoentList.length == 0){
      event.source.close();
    }
  }

  onBack(index: any) {
    console.log(index)
    if (index == 1) {
      this.isShowQue = true;
      this.isShowEMail=false;
      this.isShowUserDetails=false;
      this.isViewChatres=false;
    }
    else if (index == 2) {
      this.isShowQue = false;
      this.isShowEMail=true;
      this.isShowUserDetails=false;
      this.isViewChatres=false;
    }
    else if(index == 3){
      this.isShowQue = true;
      this.isShowEMail=false;
      this.isShowUserDetails=false;
      this.isViewChatres=false;
    }
  }

  onLogin() {
    console.log(this.loginForm.value.email)
    if (this.loginForm.valid) {
      this._spinnerService.show();
      let userdata={
        email: this.loginForm.value.email,
        phoneNo: this.loginForm.value.phoneNo ? this.loginForm.value.phoneNo : null,
        org: this.loginForm.value.org ? this.loginForm.value.org : null,
        jobTitle: this.loginForm.value.jobTitle ? this.loginForm.value.jobTitle : null,
        country: this.loginForm.value.country ? this.loginForm.value.country : null,
        isComplete: 1,
        userId:this.userId ? this.userId : null
      }
      this._loginService.UserRegistor(userdata).subscribe((res: any) => {
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
            userId: res?.data?.id ? res?.data?.id : '',
            isCompleteProfile:this.isCompleteProfile
          };

          this.userId = emailEncrypt.userId
          this.userDetailsForm.patchValue({
            userId: this.userId
          })
          this._loginService.setLocalUser(JSON.stringify(emailEncrypt));
          this.isFirst=res?.isFirst;
          if(this.isCompleteProfile == true || res?.isFirst == true){
            this.isShowEMail=false;
            this.isShowUserDetails=false;
            this.isShowQue=true;
            //this.isCompleteProfile=true
            this.onOpenAI();
          }else{
            //this.isShowEMail=false;
            this.isShowUserDetails=true;
          }
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
      let userDetails = {
        email: this.loginForm.value.email ? this.loginForm.value.email : this.userEmail ? this.userEmail : null,
        userId: this.userDetailsForm.value.userId ? this.userDetailsForm.value.userId : null,
        phoneNo: this.userDetailsForm.value.phoneNo ? this.userDetailsForm.value.phoneNo : null,
        org: this.userDetailsForm.value.org ? this.userDetailsForm.value.org : null,
        jobTitle: this.userDetailsForm.value.jobTitle ? this.userDetailsForm.value.jobTitle : null,
        country: this.userDetailsForm.value.country ? this.userDetailsForm.value.country : null,
        isComplete: 1
      }

      console.log(userDetails);
      this._loginService.updateUserDetails(userDetails).subscribe((res: any) => {
        this._spinnerService.hide()
        console.log(res)
        if (res?.status == 200) {
          this._toastrService.success(res?.message ? res?.message : 'Successfully updated', 'Success', {
            closeButton: true
          })
          this.isCompleteProfile= userDetails.isComplete ==  1 ?  true : false
          let emailEncrypt = {
            email: userDetails.email,
            userId: userDetails.userId,
            isCompleteProfile: this.isCompleteProfile
          };
          this.userId = emailEncrypt.userId;
          this.userEmail= emailEncrypt.email;

          this.userDetailsForm.patchValue({
            userId: this.userId
          })
          this._loginService.setLocalUser(JSON.stringify(emailEncrypt));
          this.isShowEMail=false;
          this.isShowUserDetails=false;
          this.isShowQue=true;
          this.onOpenAI();
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

  onOpenAI(){
    if (this.userEmail && this.userId && this.quesForm.valid 
      && (this.isCompleteProfile == true || this.isFirst == true)) {
      this._spinnerService.show();
      let supplyChainQue = '';
      let componentString = '';
      let industryString = '';
      this.isFirst=false;
      if (this.quesForm.value.supplyChain.length > 0) {
        supplyChainQue = this.quesForm.value.supplyChain
          .map((id: any) => this.supplyChainList.find((obj: { id: any; }) => obj.id == id))
          .filter((obj: any) => obj !== undefined)
          .map((obj: { name: any; }) => obj.name)
          .join(',');
      }
      console.log(supplyChainQue)
      if (this.quesForm.value.component.length > 0) {
        componentString = this.quesForm.value.component
          .map((id: any) => this.matchCompoentList.find((obj: { id: any; }) => obj.id == id))
          .filter((obj: any) => obj !== undefined)
          .map((obj: { name: any; }) => obj.name)
          .join(',');
      }
      console.log(componentString)
      // if (this.quesForm.value.industry.length > 0) {
      //   industryString = this.quesForm.value.industry
      //     .map((id: any) => this.industryMasterList.find((obj: { id: any; }) => obj.id == id))
      //     .filter((obj: any) => obj !== undefined)
      //     .map((obj: { name: any; }) => obj.name)
      //     .join(',');
      // }
      this.industryMasterList.find((obj:any) => {
        if(obj.id == this.quesForm.value.industry){
          industryString = obj.name
      }}
      )

      console.log(industryString)
      let quesDetails = {
        email: this.loginForm.value.email ? this.loginForm.value.email : this.userEmail ? this.userEmail : null,
        userId: this.userDetailsForm.value.userId ? this.userDetailsForm.value.userId : null,
        supplyChain: supplyChainQue,
        component: componentString,
        industry: industryString,
        detailsIssue : this.quesForm.value.details ? this.quesForm.value.details : null,
      }
      console.log(quesDetails);
      this._loginService.callOpenAiToGetAns(quesDetails).subscribe((res: any) => {
        this._spinnerService.hide()
        console.log(res)
        if (res?.status == 200) {
          if (res?.data.chatGptRes) {
            this.chatGptRes = res?.data.chatGptRes;
            this.isShowQue=false;
            this.isViewChatres=true;
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
    else{
     this.isShowEMail=true;
     this.isShowQue=false;
     this.isShowUserDetails= this.loginForm.valid && this.isCompleteProfile == false ? true : false;
     this.isViewChatres =false;
    }
  }
}
