import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  registerForm: FormGroup;

  constructor(
    private authService: AuthService, 
    private router: Router, 
    private alertCtrl: AlertController
  ) {}

  ngOnInit() {
    this.registerForm = new FormGroup({
      username: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(8)])
    });
  }

  onRegister() {
    console.log(this.registerForm);
    if (this.registerForm.valid) {
      this.authService.register(this.registerForm.value).subscribe({
        next: async (resData) => {
          console.log('Registration Successful.');
          
          const alert = await this.alertCtrl.create({
            header: 'Registration Successful',
            message: 'Your account has been successfully registered.',
            buttons: [{
              text: 'OK',
              handler: () => {
                this.router.navigateByUrl('/log-in');
              }
            }]
          });
          alert.present();
        },
        error: async (errRes) => {
          let message = 'Registration failed. Please try again.';

          if (errRes.status === 400 && errRes.error.error.message === 'EMAIL_EXISTS') {
            message = 'Email is already in use. Please try again.';
          }

          const alert = await this.alertCtrl.create({
            header: 'Registration Failed',
            message,
            buttons: ['OK']
          });
          await alert.present();
        }
      });
    }
  }
}
