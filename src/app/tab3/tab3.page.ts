import { CoreService } from './../core.service';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { HTTP } from '@ionic-native/http/ngx';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {
  public myForm: FormGroup;
  public myFormSkyMax: FormGroup;
  mensaje: string;
  busy: boolean;
  constructor(public formBuilder: FormBuilder, private Core: CoreService, private webClient: HTTP,private MyStorage:Storage) {

    this.myForm = formBuilder.group({
      user: ['', Validators.compose([Validators.maxLength(30), Validators.pattern('[a-zA-Z ]*'), Validators.required])],
      password: ['', Validators.compose([Validators.maxLength(30), Validators.pattern('[a-zA-Z ]*'), Validators.required])],
      nombres: ['', Validators.compose([Validators.maxLength(30), Validators.pattern('[a-zA-Z ]*'), Validators.required])],


    });
    this.myFormSkyMax = formBuilder.group({
      user: ['', Validators.compose([Validators.maxLength(30), Validators.pattern('[a-zA-Z ]*'), Validators.required])],
      password: ['', Validators.compose([Validators.maxLength(30), Validators.pattern('[a-zA-Z ]*'), Validators.required])],
      nombres: ['', Validators.compose([Validators.maxLength(30), Validators.pattern('[a-zA-Z ]*'), Validators.required])],


    });


    this.Core.getLastLogin().then(data=>{

      console.log("Ya leyo");
      this.Core.LastLogin().then(datas=>{
        this.myForm.controls['user'].setValue(this.Core.user);
        this.myForm.controls['password'].setValue(this.Core.password);
        console.log("User>",this.Core.user);
      });
  
    });



    this.busy = false;
    this.mensaje = "";
  }

  ionViewWillEnter(){
   this.mensaje="";
   this.busy=false;
  }
  async LoginInstagram() {
    this.busy = true;
    this.MyStorage.set('user',this.Core.user);
    this.MyStorage.set('password',this.Core.password);
    this.Core.user = this.myForm.controls['user'].value;
    this.Core.password=this.myForm.controls['password'].value;
    this.mensaje = "";
    let loggeo = await this.Core.Login2();
    if (loggeo) {
      this.mensaje = "Verificado con exito";
      this.MyStorage.set('user',this.Core.user);
      this.MyStorage.set('password',this.Core.password);

    }
    else {
      this.mensaje = "Error en la clave o nombre de usuario";
    }
    this.busy = false;
  }
}
