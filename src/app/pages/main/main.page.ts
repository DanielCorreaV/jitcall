import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-main',
  templateUrl: './main.page.html',
  styleUrls: ['./main.page.scss'],
  standalone: false
})
export class MainPage implements OnInit {
  selectedTab = 'home';
  constructor() { }

  ngOnInit() {
  }

  selectTab(tab: string) {
    this.selectedTab = tab;
  }

}
