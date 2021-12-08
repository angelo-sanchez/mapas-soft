import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-upload-file-options',
  templateUrl: './upload-file-options.component.html',
  styleUrls: ['./upload-file-options.component.css']
})
export class UploadFileOptionsComponent implements OnInit {
  public formulario : FormGroup;
  public textoOpciones : string = '';

  constructor(
    public dialogRef: MatDialogRef<UploadFileOptionsComponent>
  ) {
    this.formulario = new FormGroup({});
    
  }

  ngOnInit(): void {
    this.textoOpciones = '';
    this.initFormulario();
  }

  initFormulario(){
    this.formulario = new FormGroup({
      'opciones' : new FormControl('')
    });
  }

  enviar(){
    this.textoOpciones = this.formulario.get('opciones')?.value;
    // console.log(this.textoOpciones);
    this.dialogRef.close(this.textoOpciones);
  }

}
