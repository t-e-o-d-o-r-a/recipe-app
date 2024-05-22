import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.page.html',
  styleUrls: ['./log-in.page.scss'],
})
export class LogInPage implements OnInit {
  loginForm: FormGroup;
  isLoading = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private alertCtrl: AlertController
  ) {}

  ngOnInit() {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', Validators.required)
    });

    this.authService.userLoginComplete.subscribe(() => {
      this.router.navigateByUrl('/recipes/tabs/explore');
    });
  }

  onLogin() {
    console.log(this.loginForm);
    this.isLoading = true;
    if (this.loginForm.valid) {
      this.authService.logIn(this.loginForm.value).subscribe({
        next: (resData) => {
          console.log('Login Successful.');
          console.log(this.authService.user)
          this.isLoading = false;
          this.router.navigateByUrl('/recipes/tabs/explore');
        },
        error: async (errRes) => {
          let message = 'Incorrect email or password. Please try again.';

          const alert = await this.alertCtrl.create({
            header: 'Authentication Failed',
            message,
            buttons: ['OK'],
          });
          await alert.present();
          this.isLoading = false;
        },
      });
    }
  }
}
