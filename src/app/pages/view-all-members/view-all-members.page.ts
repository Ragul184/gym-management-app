import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingController, AlertController, Platform } from '@ionic/angular';
import { map } from 'rxjs/operators';

import { User } from '../../model/user';
import { UserService } from '../../services/user/user.service';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { TDocumentDefinitions } from 'pdfmake/interfaces';
import { formatDate } from '@angular/common';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { FileOpener } from '@awesome-cordova-plugins/file-opener/ngx';
import { AuthService } from 'src/app/services/auth.service';
(pdfMake as any).vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-view-all-members',
  templateUrl: './view-all-members.page.html',
  styleUrls: ['./view-all-members.page.scss'],
})
export class ViewAllMembersPage implements OnInit {
  users?: User[] = [];
  public loading: HTMLIonLoadingElement;
  show = false;
  userName: string;
  userPass: string;
  status: string;
  currentUser?: User;
  currentIndex = -1;
  title = '';
  searchTerm: string;
  isShow = false;
  pdfObj: pdfMake.TCreatedPdf;
  retrievedUser: any;
  testUser: any;

  constructor(private router: Router, private route: ActivatedRoute, private userService: UserService,
    private loadingController: LoadingController, private alertController: AlertController,
    private plt: Platform, private fileOpener: FileOpener, private authService: AuthService) {
    this.status = this.route.snapshot.paramMap.get('status');
  }

  ngOnInit() {
    this.retrieveUsers(this.status);
  }

  async doRefresh(event) {
    console.log('Refresh Started');

    await this.retrieveUsers(this.status);

    await event.target.complete();
    console.log('Async operation has ended');
  }

  async retrieveUsers(status?: string): Promise<void> {
    try {

      await this.showLoading();

      const userDoc = await this.authService.getCurrentUserProfile();
      this.retrievedUser = { id: userDoc.id, ...userDoc.data() };
      console.log('Retrieved User: ', this.retrievedUser);

      this.userService.getAllUsers(status).snapshotChanges().pipe(
        map(changes =>
          changes.map(c =>
            ({ id: c.payload.doc.id, ...c.payload.doc.data() })
          )
        )
      ).subscribe(data => {
        this.users = data;
        console.log('u', this.users);
        // this.testUser = this.users.sort((a, b) => a.memberId.localeCompare(b.memberId))[5];
        // console.log('TEST USER: ', this.testUser);
        console.log(...this.users.sort((a, b) => a.memberId.localeCompare(b.memberId))
          .map((p, index) => ([
            index + 1,
            p.memberId,
            this.titleCase(p.memberName),
            p.phoneNumber,
            this.formatDate(p.birthDt.toDate()),
            p.address,
            this.formatDate(p.joiningDt.toDate()),
            p.feesPaid.toString().toUpperCase(),
            p.feesPaid === 'yes' ? this.formatDate(new Date(p.subscriptionEndDt)) : ''
          ])));

        this.isShow = true;
      });

      await this.hideLoading();

    } catch (error) {
      console.error(error);
      this.handleError(error);
      await this.hideLoading();
    }
  }

  editMember(id: string) {
    console.log(`From EditMember: ID: ${id}`);
    this.router.navigate(['edit-member', id.toLowerCase()]);
  }

  updatePayment(id: string) {
    console.log(`From UpdatePayment: ID: ${id}`);
    this.router.navigate(['update-payment', id.toLowerCase()]);
  }

  generatePDF() {
    (pdfMake.fonts as any) = {
      lato: {
        normal: 'https://cdnjs.cloudflare.com/ajax/libs/lato-font/3.0.0/fonts/lato-normal/lato-normal.woff',
        bold: 'https://cdnjs.cloudflare.com/ajax/libs/lato-font/3.0.0/fonts/lato-bold/lato-bold.woff',
        italics: 'https://cdnjs.cloudflare.com/ajax/libs/lato-font/3.0.0/fonts/lato-light-italic/lato-light-italic.woff',
        bolditalics: 'https://cdnjs.cloudflare.com/ajax/libs/lato-font/3.0.0/fonts/lato-bold-italic/lato-bold-italic.woff'
      }
    };

    const docDefinition: TDocumentDefinitions = {
      content: [
        {
          text: 'EXTREME GYM',
          fontSize: 16,
          alignment: 'center',
          color: '#047886'
        },
        {
          text: 'LIST OF USERS',
          fontSize: 20,
          bold: true,
          alignment: 'center',
          decoration: 'underline',
          color: 'skyblue'
        },
        {
          table: {
            headerRows: 1,
            widths: ['auto', 'auto', 'auto', 'auto', 'auto', 'auto'],
            body: [
              ['memberId', 'memberName', 'gender', 'subscriptionEndDate', 'Phone Number', 'Active'],
              ...this.users.map(p => ([p.memberId, p.memberName, p.gender, p.subscriptionEndDt, p.phoneNumber, p.active])),
            ]
          }
        }
      ],
      defaultStyle: {
        font: 'lato'
      }
    };

    const docDefinition1: TDocumentDefinitions = {
      pageOrientation: 'landscape',
      content: [
        { text: this.retrievedUser.gymName.toUpperCase(), style: 'title' },
        { text: this.retrievedUser.gymAddress, style: 'address' },
        // { text: 'EXTREME GYM', style: 'title' },
        // { text: 'Old No: 3, New No: 5,', style: 'address' },
        // { text: '2nd Floor, Rama Iyer Street,', style: 'address' },
        // { text: 'Vandavasi, Tiruvannamalai', style: 'address' },
        // { text: 'PIN: 604408', style: 'address' },

        { text: 'MEMBERS LIST', style: 'subcentered' },
        { text: '\n' },
        {
          columns: [
            { width: '*', text: '' },
            {
              width: 'auto',
              table: {
                headerRows: 1,
                body: [
                  [{ text: 'S.No.', style: 'tableHeader' },
                  { text: 'Member ID', style: 'tableHeader' },
                  { text: 'Member Name', style: 'tableHeader' },
                  { text: 'Phone Number', style: 'tableHeader' },
                  { text: 'DOB', style: 'tableHeader' },
                  { text: 'Address', style: 'tableHeader' },
                  { text: 'Date of Joining', style: 'tableHeader' },
                  { text: 'Fees Paid', style: 'tableHeader' },
                  { text: 'Sub End Date', style: 'tableHeader' },
                  ],
                  ...this.users.sort((a, b) => a.memberId.localeCompare(b.memberId))
                    .map((p, index) => ([
                      index + 1,
                      p.memberId,
                      this.titleCase(p.memberName),
                      p.phoneNumber,
                      this.formatDate(p.birthDt.toDate()),
                      p.address,
                      this.formatDate(p.joiningDt.toDate()),
                      p.feesPaid.toString().toUpperCase(),
                      p.feesPaid === 'yes' ? this.formatDate(new Date(p.subscriptionEndDt)) : ''
                    ])),
                ]
              }
            },
            { width: '*', text: '' },
          ]
        },
      ],
      styles: {
        title: {
          fontSize: 14,
          bold: true,
          characterSpacing: 0.5
        },
        subcentered: {
          fontSize: 16,
          bold: true,
          alignment: 'center',
          decoration: 'underline',
          margin: [0, 10, 0, 5]
        },
        tableExample: {
          margin: [0, 5, 0, 15]
        },
        tableHeader: {
          bold: true,
          fontSize: 13,
          color: 'black',
          alignment: 'center',
        }
      },
      defaultStyle: {
        alignment: 'justify',
        font: 'lato',
      }

    };

    // alert(this.plt.platforms());
    this.pdfObj = pdfMake.createPdf(docDefinition1);
    // this.pdfObj.open();
    this.downloadPDF();
  }

  async downloadPDF() {
    try {
      await this.showLoading();

      if (this.plt.is('android') || this.plt.is('cordova') || this.plt.is('capacitor') || this.plt.is('mobile')) {
        this.pdfObj.getBase64(async (data) => {
          try {
            const path = `Gym Manager/pdf/${this.status}_members_list-${formatDate(new Date(), 'yyyyMMdd_HHmmss', 'en-IN')}.pdf`;
            // const readResult = await Filesystem.readdir({ directory: Directory.Documents, path: '' });
            // console.log('READ RESULT: ', readResult.files);
            const result = await Filesystem.writeFile({
              path, data, directory: Directory.Documents, recursive: true
            });
            // console.log(result.uri);
            this.fileOpener.open(`${result.uri}`, 'application/pdf');
          } catch (e) {
            console.error('Unable to write file', e);
          }
        });
      } else {
        const path = `${this.status}_members_list-${formatDate(new Date(), 'yyyyMMdd', 'en-IN')}.pdf`;
        this.pdfObj.download(path);
      }

      await this.hideLoading();
    } catch (error) {
      console.error(error);
      this.handleError(error);
      await this.hideLoading();
    }
  }

  formatDate(date) {
    const year = date.getFullYear().toString();
    const month = (date.getMonth() + 101).toString().substring(1);
    const day = (date.getDate() + 100).toString().substring(1);
    return day + '-' + month + '-' + year;
  }

  titleCase(str) {
    return str.toLowerCase().split(' ').map((word) => word.replace(word[0], word[0].toUpperCase())).join(' ');
  }

  async deleteMember(user: User) {
    console.log(`From DeleteMember: ID: ${user.id}`);
    await this.showLoading();
    const inputAlert = await this.alertController.create({
      message: `Are you sure want to delete this member ${user.memberName} with id: ${user.memberId}?`,
      buttons: [{
        text: 'Delete', handler: async () => {
          await this.showLoading();
          // DELETE USER HERE!
          await this.userService.deleteUser(user.id);
          await this.hideLoading();
          await this.retrieveUsers(this.status);
          await this.handleError({ message: 'Member Succesfully Deleted!' });
        }
      }, { text: 'Cancel', role: 'cancel', }]
    });
    await this.hideLoading();
    await inputAlert.present();
  }

  async showLoading(): Promise<void> {
    try {
      this.loading = await this.loadingController.create({
        message: 'Just a moment...',
        mode: 'ios'
      });
      await this.loading.present();
    } catch (error) {
      this.handleError(error);
    }
  }

  hideLoading(): Promise<boolean> {
    return this.loading.dismiss();
  }

  async handleError(error): Promise<void> {
    const alert = await this.alertController.create({
      message: error.message,
      buttons: [{ text: 'Ok', role: 'cancel' }]
    });
    await alert.present();
  }
}
