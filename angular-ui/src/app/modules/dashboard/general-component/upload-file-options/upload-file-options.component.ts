import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-upload-file-options',
  templateUrl: './upload-file-options.component.html',
  styleUrls: ['./upload-file-options.component.css']
})
export class UploadFileOptionsComponent implements OnInit {
  public formulario: FormGroup;
  public textoOpciones: string = '';
  public files: string[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { filenames: string[]; },
    public dialogRef: MatDialogRef<UploadFileOptionsComponent>
  ) {
    this.formulario = new FormGroup({});
  }

  ngOnInit(): void {
    this.files = this.data.filenames;
    this.textoOpciones = '';
    this.initFormulario();
  }

  initFormulario() {
    for (const filename of this.files) {
      // Cada option va a estar ligada al archivo.
      this.formulario.addControl(filename, new FormControl(''));
    }
  }

  enviar() {
    const res: { filename: string, options: string; }[] = [];
    for (const filename of this.files) {
      let control = this.formulario.controls[filename];
      let options = (control && control.value) || "";
      res.push({
        filename,
        options
      });
    }
    this.dialogRef.close(JSON.stringify(res));
  }

  cancelar() {
    this.dialogRef.close();
  }

}
