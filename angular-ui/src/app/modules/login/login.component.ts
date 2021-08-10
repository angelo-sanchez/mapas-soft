import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators} from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from './login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  public errorMsg : string = '';
  public errorMail : boolean = false;

  public formulario : FormGroup;

  constructor(
    private loginService : LoginService,
    private route : Router,
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
    });
  }

  login(){
    if(!this.formulario.invalid){
      let email = this.formulario.controls.email.value;
      let password = this.formulario.controls.password.value;
      this.loginService.login(email, password).subscribe((data : any) => {
        this.errorMsg = '';
        this.loginService.setToken(data.token);
        //this.loginService.setUser(data.user);
        this.route.navigate(['/maps']);
      }, error => {
        console.log('Se produjo un error al iniciar sesion.');
        console.log(error);   
        this.errorMsg = error.error.msg;
      });
    }
  }

}
