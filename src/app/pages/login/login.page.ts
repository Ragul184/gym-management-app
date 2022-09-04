import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  public loading: HTMLIonLoadingElement;
  credentials: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private router: Router
  ) { }

  get email() {
    return this.credentials.get('email');
  }

  get password() {
    return this.credentials.get('password');
  }

  ngOnInit() {
    this.credentials = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  redirectToSignUp() {
    this.router.navigate(['/signup'], { replaceUrl: true });
  }

  async register() {
    try {
      await this.showLoading();
      const user = await this.authService.register(this.credentials.value);
      await this.hideLoading();

      if (user) {
        this.router.navigate(['/tabs/home'], { replaceUrl: true });
      } else {
        this.handleError({ header: 'Registration Failed', message: 'Please try again!' });
      }

    } catch (error) {
      console.error(error);
      this.handleError(error);
      await this.hideLoading();
    }
  }

  async signIn() {
    try {
      await this.showLoading();
      const user = await this.authService.signin(this.credentials.value);
      await this.hideLoading();

      if (user) {
        this.router.navigate(['/home'], { replaceUrl: true });
      } else {
        this.handleError({ header: 'Login Failed', message: 'Please try again!' });
      }

    } catch (error) {
      console.error(error);
      this.handleError(error);
      await this.hideLoading();
    }
  }

  async login() {
    const loading = await this.loadingController.create();
    await loading.present();

    this.authService.login(this.credentials.value).subscribe(
      async (res) => {
        await loading.dismiss();
        this.router.navigateByUrl('/tabs', { replaceUrl: true });
      },
      async (res) => {
        await loading.dismiss();
        const alert = await this.alertController.create({
          header: 'Login Failed!',
          message: res.error.error,
          buttons: ['OK']
        });

        await alert.present();
      }
    );
  }

  // LOADERS AND ALERTS
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

  async handleError(error: { header?: any; message: any }): Promise<void> {
    const alert = await this.alertController.create({
      header: error?.header,
      message: error.message,
      buttons: [{ text: 'Ok', role: 'cancel' }]
    });
    await alert.present();
  }

}
