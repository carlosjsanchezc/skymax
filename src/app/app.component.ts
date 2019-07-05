import { CoreService } from './core.service';
import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private Core:CoreService
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.Core.followers=397;
      this.Core.following=127;
      this.Core.profilepic="https://scontent-dfw5-1.cdninstagram.com/vp/2e1dcaec1e9c99500ae895ec947c3a1b/5DB110CF/t51.2885-19/11849228_497893633711441_1317626720_a.jpg?_nc_ht=scontent-dfw5-1.cdninstagram.com";
      //this.Core.LastLogin();
    });
  }
}
