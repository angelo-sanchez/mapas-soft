import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { LoginService } from '../login/login.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {

  public formulario : FormGroup;
  public errorMsg : string = '';

  constructor(
    private loginService : LoginService,
  ) { 
    this.formulario = new FormGroup({});
  }

  ngOnInit(): void {
    this.initFormulario();
  }

  initFormulario(){
    this.formulario = new FormGroup({
      'email': new FormControl(''),
      'password' : new FormControl(''),
    });
  }

  signin(){
    let email = this.formulario.controls.email.value;
    let password = this.formulario.controls.password.value;
    this.loginService.register(email,password);
  }

}
