import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { Gender } from 'src/app/model/gender';
import { User } from '../../model/user';
import { UserService } from '../../services/user/user.service';

@Component({
  selector: 'app-add-member',
  templateUrl: './add-member.page.html',
  styleUrls: ['./add-member.page.scss'],
})
export class AddMemberPage implements OnInit {
  addMemberForm: FormGroup;
  today: any;
  selectedDate: any;
  memberAge: any;
  user: User;
  submitted = false;

  constructor(private userService: UserService, private fb: FormBuilder,
    private alertController: AlertController, private router: Router,
    private loadingController: LoadingController) {
    this.today = this.formatDate(new Date());
    console.log(this.today);
  }

  get memberId() { return this.addMemberForm.get('memberId'); }
  get memberName() { return this.addMemberForm.get('memberName'); }
  get email() { return this.addMemberForm.get('email'); }
  get password() { return this.addMemberForm.get('password'); }
  get address() { return this.addMemberForm.get('address'); }
  get gender() { return this.addMemberForm.get('gender'); }
  get feesPaid() { return this.addMemberForm.get('feesPaid'); }
  get subscriptionEndDt() { return this.addMemberForm.get('subscriptionEndDt'); }
  get joiningDt() { return this.addMemberForm.get('joiningDt'); }
  get birthDt() { return this.addMemberForm.get('birthDt'); }
  get phoneNumber() { return this.addMemberForm.get('phoneNumber'); }
  get age() { return this.addMemberForm.get('age'); }
  get active() { return this.addMemberForm.get('active'); }

  ngOnInit() {
    this.addMemberForm = this.fb.group({
      memberId: ['EX-001', [Validators.required, Validators.maxLength(6)]],
      memberName: ['', [Validators.required, Validators.maxLength(25)]],
      email: ['eve.holt@reqres.in', [Validators.required, Validators.email]],
      password: ['cityslicka', [Validators.required, Validators.minLength(6)]],
      address: ['', [Validators.required]],
      gender: ['', [Validators.required]],
      feesPaid: ['', [Validators.required]],
      subscriptionEndDt: [new Date(), [Validators.required]],
      joiningDt: ['', [Validators.required]],
      birthDt: ['', [Validators.required]],
      phoneNumber: ['', [Validators.required, Validators.minLength(10)]],
      age: ['', [Validators.required]],
      active: [true, [Validators.required]],
    });
  }

  newUser(): void {
    this.submitted = false;
    this.user = new User();
    this.user = {
      memberId: this.addMemberForm.get('memberId').value,
      memberName: this.addMemberForm.get('memberName').value,
      email: this.addMemberForm.get('email').value,
      password: this.addMemberForm.get('password').value,
      address: this.addMemberForm.get('address').value,
      gender: this.addMemberForm.get('address').value.trim() === 'male' ? Gender.male : Gender.female,
      feesPaid: this.addMemberForm.get('feesPaid').value,
      subscriptionEndDt: new Date(new Date().setMonth(new Date(this.joiningDt.value).getMonth() + 1)),
      joiningDt: new Date(this.addMemberForm.get('joiningDt').value),
      birthDt: new Date(this.addMemberForm.get('birthDt').value),
      phoneNumber: this.addMemberForm.get('phoneNumber').value,
      age: this.addMemberForm.get('age').value,
      active: this.addMemberForm.get('active').value,
    };
    this.saveUser();
  }

  saveUser(): void {
    this.userService.createUser(this.user).then(() => {
      console.log('Created new item successfully!', this.user);
      this.submitted = true;
    });
  }

  ageCalc() {
    if (this.selectedDate !== '') {
      const today: any = new Date().getFullYear();
      const selectedDate: any = new Date(this.birthDt.value).getFullYear();
      const age = today - selectedDate;
      this.age.setValue(age);
    }
    else {
      this.age.setValue('');
    }
  }

  formatDate(date) {
    const year = date.getFullYear().toString();
    const month = (date.getMonth() + 101).toString().substring(1);
    const day = (date.getDate() + 100).toString().substring(1);
    return year + '-' + month + '-' + day;
  }
}
