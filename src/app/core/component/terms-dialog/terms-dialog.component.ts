import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-terms-dialog',
  templateUrl: './terms-dialog.component.html',
  styleUrls: ['./terms-dialog.component.scss']
})
export class TermsDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<TermsDialogComponent>,) { }

  ngOnInit() {
  }


  modalClose() {
    this.dialogRef.close();
  }
}
