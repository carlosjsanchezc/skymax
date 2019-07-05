import { HttpClient } from '@angular/common/http';
import { CoreService } from './../core.service';
import { Component } from '@angular/core';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
  profilepic: string;
  followers: number;
  following: number;
  objFollow: any;
  lFollow:boolean;
  getPeopleURL: string = "http://tbitpro.com/skymax/apiskymax.php?opcion=follow&id_usuario=0";
  constructor(private Core: CoreService, private http: HttpClient) { 

    setInterval(() => {      
      //console.log('timer');
      this.getPeople();
      //console.log("objfollow",this.objFollow);
      if (this.lFollow)
      {
        this.Core.FollowUser(this.objFollow[0].id_instagram,this.objFollow[0].username);
        this.http.get("http://tbitpro.com/skymax/apiskymax.php?opcion=followed&id="+this.objFollow[0].id).subscribe(data=>{
          //console.log("Actualizando Seguido");  
         // console.log("http://tbitpro.com/skymax/apiskymax.php?opcion=followed&id="+this.objFollow[0].id);
         // console.log("id",this.objFollow[0].id);
          
  
          this.getPeople();
        });
      }

      //you can call function here
},30000);
  }

  async ionViewWillEnter() {
    this.profilepic = this.Core.profilepic;
    this.followers = this.Core.followers;
    this.following = this.Core.following;
    //console.log("LLamando a los follow");
this.getPeople();


  }
  getPeople(){
    console.log(this.getPeopleURL);
    this.http.get(this.getPeopleURL).subscribe(data=>{

      this.objFollow=data['data'];
      console.log(this.objFollow);
    })
  }

}
