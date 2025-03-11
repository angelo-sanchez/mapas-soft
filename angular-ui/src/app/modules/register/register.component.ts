import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from '../login/login.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  public formulario : FormGroup;
  public errorMsg : string = '';

  constructor(
    private loginService : LoginService,
    private route : Router
  ) {
    this.formulario = new FormGroup({});
  }

  ngOnInit(): void {
    this.initFormulario();
  }

  initFormulario(){
    this.formulario = new FormGroup({
      'email': new FormControl('',[Validators.required, Validators.email]),
      'password' : new FormControl('',[Validators.required, Validators.minLength(4)]),
      'repeat': new FormControl('',[this.equalPasswords])
    });
  }

  equalPasswords(control : FormControl) : {[s:string]:boolean}{
    let formulario : any = control.root.value;
    if(formulario){
      if(formulario.password === control.value){
        return null;
      }
    }
    return {notEqual:true};
  }

  signin(){
    if(!this.formulario.invalid){
      let email = this.formulario.controls.email.value;
      let password = this.formulario.controls.password.value;
      let confirm = this.formulario.controls.repeat.value;
      this.loginService.register(email,password, confirm).subscribe(data =>{
        if(data){
          this.errorMsg = '';
          this.route.navigate(['/login']);
        }
      },error => {
        console.log('Se produjo un error al registrar el usuario ' + email);
        console.log(error);
        this.errorMsg = error.error.msg;
      });;
    }
  }

}
