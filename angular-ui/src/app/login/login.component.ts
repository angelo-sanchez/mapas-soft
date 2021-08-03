import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl} from '@angular/forms';
import { LoginService } from './login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public formulario : FormGroup;

  constructor(
    private loginService : LoginService,
  ) { 
    this.formulario = new FormGroup({});
  }

  ngOnInit(): void {
    this.formulario = new FormGroup({
      'email': new FormControl(''),
      'password' : new FormControl(''),
    });
  }
  
  login(){
    let email = this.formulario.controls.email.value;
    let password = this.formulario.controls.password.value;

    this.loginService.login(email, password).subscribe(data => {
      console.log("status login: ");
      console.log(data);
    }, error => {
      console.log('Se produjo un error al intentar iniciar sesion.');
      console.log(error);
    });
  }

}
