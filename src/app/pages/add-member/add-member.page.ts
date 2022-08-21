import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-add-member',
  templateUrl: './add-member.page.html',
  styleUrls: ['./add-member.page.scss'],
})
export class AddMemberPage implements OnInit {

  today: any;
  selectedDate: any;
  age: any; 
  
  ngOnInit() {
  }


  constructor() {
    this.today = new Date().toISOString();
  }

  ageCalc() {
    if (this.selectedDate != "") {
      let today: any = new Date().getFullYear();
      let selectedDate: any = new Date(this.selectedDate).getFullYear();
      let age = today - selectedDate
      this.age = age
    }
    else {
      this.age = ""
    }
  }

}
