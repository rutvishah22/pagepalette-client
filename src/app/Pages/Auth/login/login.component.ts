import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm : FormGroup;
  public loginUser: any;
  constructor(private formBuilder: FormBuilder,
    private commonApiServices:ApiService,
    private router:Router,
    ) {
    this.loginForm = this.formBuilder.group({
      email: ['',[Validators.email,Validators.required]],
      password: ['',[Validators.required]],
    });
  }

  onSubmit(){
    this.commonApiServices.postRequest('auth/login',this.loginForm.value).subscribe({
      next: (response) => {
        const token = response.Authorization
        console.log(response)
        if(response.loginStatus == 'success'){
          this.getLoginUser(token);
        }
        if(response.loginStatus == 'failed'){
          alert('incorrect username or password')
        }
      }
    })
  }

  getLoginUser(token:any){
    this.commonApiServices.postRequest('user/getLoginUser',{'token':token}).subscribe({
      next:(response)=>{
        localStorage.setItem('user', JSON.stringify(response));
        localStorage.setItem('jwt', token);
        this.router.navigate(['/home']);
      }
    })
  }
}
