import { Component, OnInit } from '@angular/core';
import { User } from '../../model/user';
import { UserService } from '../../services/user/user.service';

@Component({
  selector: 'app-add-member',
  templateUrl: './add-member.page.html',
  styleUrls: ['./add-member.page.scss'],
})
export class AddMemberPage implements OnInit {

  user: User;
  submitted = false;

  constructor(private userService: UserService) {
    this.today = new Date().toISOString();
   }

  saveUser(): void {
    this.userService.createUser(this.user).then(() => {
      console.log('Created new item successfully!');
      this.submitted = true;
    });
  }
  newUser(): void {
    this.submitted = false;
    this.user = new User();
  }
  today: any;
  selectedDate: any;
  age: any; 
  
  ngOnInit() {
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
