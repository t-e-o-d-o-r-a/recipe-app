import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { User } from 'src/app/auth/user.model';
import {AlertController} from "@ionic/angular";
import {logOut} from "ionicons/icons";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  user: User;

  constructor(private authService: AuthService, private router: Router, private alertCtrl: AlertController) {}

  ngOnInit() {
    this.user = this.authService.user;
  }

  openAlert() {
    this.alertCtrl.create({
      header: 'Log Out',
      message: 'Are you sure you want to log out?',
      buttons: [
        {
          text: 'Yes',
          handler: () => this.logOut(),
          role: 'confirm',
        },
        {
          text: 'No',
          role: 'cancel'
        }
      ],
    }).then((alert) => {
      alert.present();
    });
  }

  logOut() {
    this.authService.logOut();
    console.log('Logout Successful.');
    this.router.navigateByUrl('/log-in');
  }
}
