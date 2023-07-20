import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import * as jsonData from '../../../assets/investmentQuestions/assessment.json';
import * as fs from 'fs' 
import { LoginService, SpinnerService } from 'app/core/_services';
import { Router } from '@angular/router';
import { AssesstmentService } from 'app/core/_services/assesstment.service';
import { ToastrService } from 'ngx-toastr';

interface step{
  stepName:String;
  stepId:Number;
  sessionContent:Array<Object>;
  formGroup:FormGroup;
  id:number;
  header:String;
  subHeader:String;
  sessionScore:number;
  ansScore:number;
}

@Component({
  selector: 'app-assesstment',
  templateUrl: './assesstment.component.html',
  styleUrls: ['./assesstment.component.scss']
})

export class AssesstmentComponent implements OnInit {
  assesstmentData:any = jsonData;
  sessionList:step[]=[];
  isLinear=true;
  complentSession:any;
  totalScore:number=0;
  subTotalScore:number=0;
  
  totalSession:number;
  
  investmentAssess:any;
  finalFormCtrName={
    currentTotal:"currentTotal",
    TotalScore:"TotalScore"
  }

  userEmailId:string;
  activeTabIndex:number =0;

  constructor(private loginService:LoginService,private router:Router,
    private assessmentService:AssesstmentService, private spinnerService: SpinnerService ) { }

  ngOnInit(): void {
    if(this.loginService.getLocalUser()){
      this.userEmailId = atob(this.loginService.getLocalUser())
      console.log(this.userEmailId,'user Id')
    }
    else{
      this.router.navigate(['/auth/login']);
    }
    console.log(this.assesstmentData?.default,'session Data')
    if(this.assesstmentData?.default){
      this.totalSession =this.assesstmentData?.default.length +1
      this.complentSession= {
        stepName:`Session${this.totalSession}`,
        stepId: this.totalSession,
        id:this.totalSession,
        header:"Completion",
        subHeader:"Are you sure you want to submit the assessment.",
        sessionScore:0,
        sessionContent:[],
        ansScore:0,
        formGroup:FormGroup,
      }
      this.sessionList = this.assesstmentData.default.map((item:any,index:number)=>{
        this.totalScore +=item.totalScore;
        return {
          stepName:`Session${index+1}`,
          stepId:index,
          id:item.id,
          header:item.header,
          subHeader:item.subHeader,
          sessionScore:item.totalScore,
          sessionContent:item.question_session,
          ansScore:0,
        }
      })
      if(this.sessionList.length){
        this.sessionList.push(this.complentSession);
        this.sessionList.forEach((step,index)=>{
          step.formGroup = new FormGroup({});
          console.log((index+1) !== this.sessionList.length)
          if((index+1) !== this.sessionList.length){
            step.sessionContent.forEach((field:any) => {
              step.formGroup.addControl(`${field.qn_id}`, new FormControl(''));
              field.options = [{lable:'Yes',value:1,optionId:1},{lable:'No',value:0,optionId:2},{lable:'Need more info',value:0,optionId:3}]
              field.isSelectOption=''
            });
          }
          else{
            step.formGroup.addControl(this.finalFormCtrName.currentTotal, new FormControl(this.subTotalScore));
            step.formGroup.addControl(this.finalFormCtrName.TotalScore, new FormControl(this.totalScore));
          }
        })
      }
      console.log(this.sessionList,'tt')
      this.investmentAssess=this.sessionList;
    }
  }

  async onNext(id:number){
    this.spinnerService.show()
    console.log(id,'Stepper Id')
    let findFormId=this.sessionList.find(item=> item.id === id);
    console.log(Object.values(findFormId?.formGroup.value))
    if(findFormId){
      console.log(Object.values(findFormId?.formGroup.value),'sub total')
      const total:any = Object.values(findFormId?.formGroup.value).reduce((t:number, n:number) => {
        if (typeof n === 'number' && !isNaN(n)) {
          return Number(t) + Number(n);
        } else {
          return Number(t);
        }
      });
      console.log(total,'current step total')
      this.sessionList.filter(item=>{
        if(item.id === id){
          item.ansScore =total 
        }
      })
      console.log(this.sessionList.find(item=> item.id == id))
      let currentTotal=0
      this.sessionList.map((item) => {
        if(item.ansScore){
          currentTotal+=item.ansScore
        }
      })
      console.log(currentTotal,'currentTotal')
      this.sessionList[this.sessionList.length -1].formGroup.patchValue({
        [this.finalFormCtrName.currentTotal]:Number(currentTotal)
      })
    }
    console.log(this.sessionList[this.sessionList.length -1].formGroup.value)
    
    this.spinnerService.hide()
    // const currentStep = this.sessionList.find((step) => step.id === id);

  //if (currentStep.formGroup.valid) {
    this.activeTabIndex= id++;
    // currentStep.completed = true;
  //}
  }

  onSelect(stepId:number,qnId:number,optionId:number){
    console.log(stepId,'stepId',qnId,'qnId',optionId,'optionId')
    this.sessionList.forEach(step=>{
      if(step.id == stepId){
        step.sessionContent.forEach((qn:any)=>{
          if(qn.qn_id == qnId){
            qn.isSelectOption=optionId
          }
        })
      }
    })
    console.log(this.sessionList)
  }

  onSubmit(id:number){
    console.log(id)
    this.spinnerService.show()
    let findFormId=this.sessionList.find(item=> item.id === id);
    console.log(findFormId?.formGroup.value,'final form mark')
    let totalLength = this.sessionList.length;
    let userAnsRes = []
    this.sessionList.forEach((item,index)=>{
      if(index != (totalLength-1)){
        userAnsRes.push({
          id:item.id,
          header:item.header,
          subHeader:item.subHeader,
          userMark:item.ansScore,
          sessionContent:item.sessionContent,
          sessionTotalScore:item.sessionScore
        }) 
      }
    })
    console.log(userAnsRes)
    let data={
      emailId:this.userEmailId,
      totalMark: findFormId?.formGroup.controls[this.finalFormCtrName.TotalScore].value,
      userGetMark:findFormId?.formGroup.controls[this.finalFormCtrName.currentTotal].value,
      ansSheet:userAnsRes
    }
    this.assessmentService.writeFile(data).subscribe((data:Response)=>{
      console.log(data,'data')
      console.log(data.status,'data.status')
      this.spinnerService.hide()
      if(data.status == 200){
        this.loginService.clearLocalUser();
        this.router.navigate(['/auth/login'])
      }
    },(error)=>{
      console.log(error)
      if(error.status ==200){
        this.loginService.clearLocalUser();
        this.router.navigate(['/auth/login'])
      }
      this.spinnerService.hide()
    })

    //fs.writeFileSync('../../../assets/reportAssessment/userAssessmentAns.json',JSON.stringify([userAnsRes]))    
    //localStorage.clear()
  }
}
