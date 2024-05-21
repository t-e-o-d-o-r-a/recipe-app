import {Component, OnDestroy, OnInit} from '@angular/core';
import {interval, Subscription} from "rxjs";
import {Router} from "@angular/router";

@Component({
  selector: 'app-onboarding',
  templateUrl: './onboarding.page.html',
  styleUrls: ['./onboarding.page.scss'],
})
export class OnboardingPage implements OnInit, OnDestroy {

  aboutApp = [
    {aboutTitle: 'Discover New Recipes', aboutText: 'Explore a wide variety of delicious recipes from around the world.', aboutImage: 'assets/plate.png'},
    {aboutTitle: 'Share Your Own Recipes', aboutText: 'Unleash your culinary creativity by crafting and saving your own unique recipes.', aboutImage: 'assets/chef.png'},
    {aboutTitle: 'Save Your Favorites', aboutText: 'Create your own collection of favorite recipes to revisit anytime. ', aboutImage: 'assets/together.png'},
  ];

  selectedIndex = 0;
  private sub: Subscription;

  constructor(private router: Router) { }

  ngOnInit() {
    this.sub = interval(4000).subscribe(() => {
      this.selectedIndex = (this.selectedIndex + 1) % this.aboutApp.length;
    });
  }

  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }

  toRegister() {
    this.router.navigateByUrl('/register');
  }

  toLogIn() {
    this.router.navigateByUrl('/log-in')
  }

}
