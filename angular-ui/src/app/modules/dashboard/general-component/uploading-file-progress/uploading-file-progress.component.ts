import { Component, Inject, OnInit } from '@angular/core';
import { MatSnackBarRef, MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';

@Component({
  selector: 'app-uploading-file-progress',
  templateUrl: './uploading-file-progress.component.html',
  styleUrls: ['./uploading-file-progress.component.css']
})
export class UploadingFileProgressComponent implements OnInit {
  public message : string = '';
  public archivos : any;

  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: any,
  private _snackRef: MatSnackBarRef<UploadingFileProgressComponent>) { }

  ngOnInit(): void {
    let cantidad = this.data.cantidad;
    if(cantidad > 1){
      this.message = 'Se subieron ' + cantidad + ' elementos';
    } else {
      this.message = 'Se subió ' + cantidad + ' elemento';
    }
    this.archivos = this.data.archivos;
  }

  close(){
    this._snackRef.dismiss();
  }
}
