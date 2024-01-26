import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators ,ValidatorFn } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {

  registerForm!:FormGroup;

  constructor(
    private formBuilder:FormBuilder, 
    private commonApiServices:ApiService,
    private router:Router
    ){}

  ngOnInit(){
    this.registerForm = this.formBuilder.group({
      userName:['',[Validators.required]],
      email:['',[Validators.required,Validators.email]],
      password:['',[Validators.required]],
      confirmPassword:['',[Validators.required]]
    },{
      validators: this.passwordMatch('password','confirmPassword')
    })
  }

  passwordMatch(controlName:string,matchingControlName:string) : ValidatorFn{
    return (formGroup: AbstractControl): ValidationErrors | null => {
      const passwordControl = formGroup.get(controlName);
      const confirmPasswordControl = formGroup.get(matchingControlName);
  
      if (passwordControl?.value !== confirmPasswordControl?.value && passwordControl?.value !== '' ) {
        confirmPasswordControl?.setErrors({ passwordMismatch: true });
        return { passwordMismatch: true };
      } else {
        confirmPasswordControl?.setErrors(null);
        return null;
      }}
  }

  onRegister(){
    console.log(this.registerForm.value)
    let registerData = {
      username: this.registerForm.value.userName,
      email: this.registerForm.value.email,
      password: this.registerForm.value.password
    };
    this.commonApiServices.postRequest('auth/register',registerData).subscribe({
      next:(response)=>{
        if(response.loginStatus == 'success'){
          alert("user Regestered Succesfully");
          this.getLoginUser(response.Authorization)
          this.router.navigate(['/']);
        }
        else{
          alert(response.errors);
        }
      },
      error:(error)=>{
        console.log(error);
      }
    })
  }

  getLoginUser(token:any){
    this.commonApiServices.postRequest('user/getLoginUser',{'token':token}).subscribe({
      next:(response)=>{
        localStorage.setItem('user', JSON.stringify(response));
        localStorage.setItem('jwt', token);
        this.router.navigate(['/']);
      }
    })
  }
}
