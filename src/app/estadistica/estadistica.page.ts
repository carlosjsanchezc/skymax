import { HTTP } from '@ionic-native/http/ngx';
import { HttpClient } from '@angular/common/http';
import { CoreService } from './../core.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-estadistica',
  templateUrl: './estadistica.page.html',
  styleUrls: ['./estadistica.page.scss'],
})
export class EstadisticaPage implements OnInit {

  usernamef:string="marig291";
  useridf:string="8959023386";
  username:string="angelesrestrepo12";
  password:string="14068456";
  miscookies:string;
  cookies: string;
  user: string;
  csrf: string;
  token: string[];
  userid: string;
  followers: number;
  following: number;
  logouturl: string = "https://instagram.com/accounts/logout/";
  baseurl: string = "https://www.instagram.com/";
  mid: string;
  profilepic: string;
  getPeopleURL: string = "http://tbitpro.com/skymax/apiskymax.php?opcion=follow&id_usuario=0";
  loginurl: string = "https://www.instagram.com/accounts/login/ajax/";
  followingsurl: string = "https://www.instagram.com/graphql/query/?query_id=17874545323001329&id={{accountId}}&first={{count}}&after={{after}}";
  useragent: string = "Mozilla/5.0 (Linux; Android 8.1.0; motorola one Build/OPKS28.63-18-3; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/70.0.3538.80 Mobile Safari/537.36 Instagram 72.0.0.21.98 Android (27/8.1.0; 320dpi; 720x1362; motorola; motorola one; deen_sprout; qcom; pt_BR; 132081645)";
  
  followurl: string = "https://www.instagram.com/web/friendships/{{accountId}}/follow/";
  constructor(private Core:CoreService,private webClient:HTTP,private http:HttpClient) { }

  ngOnInit() {
  }
  async Login(){
    let headers2 = { "user-agent":this.useragent
      

    };
    this.webClient.get(this.baseurl,{},headers2).then(datahome=>{
     /* let cookies = this.webClient.getCookieString(this.baseurl);
      console.log("Cookies:", cookies);
      this.cookies = cookies;
      this.miscookies=cookies;
      this.mid = this.ExtraerCookie(cookies, "mid");
      this.csrf=this.ExtraerCookie(cookies, "csrftoken");*/
      let headers = {
        'cookie': "ig_cb=1; csrftoken=" + this.csrf + "; mid=" + this.mid + ";",
        'referer': this.baseurl + "/",
        'x-csrftoken': this.csrf,
        'X-CSRFToken': this.csrf,
  
      };
      let params = {
        'username': this.username,
        'password': this.password
      };
      console.log("Headers:", headers);
      console.log("Params:", params);
      this.webClient.post(this.loginurl, params, headers).then(data=>{
        console.log(data.data);
  
      }).catch(error=>{
        console.log("Error=>",error);
      });
    });




  }
  
  onClick(){
    //this.Login();
    console.log("tradicional");
    let headers = {
      'cookie' : "ig_cb=1; csrftoken="+this.Core.csrf+"; mid=;",
      'referer' : this.Core.baseurl+ "/"+this.username+"/"+this.userid,
      'x-csrftoken' :this.Core.csrf,
      'X-CSRFToken': this.Core.csrf,};
    
    console.log("Nueva forma");
    let myurl=this.Core.followurl;
    myurl=myurl.replace("{{accountId}}",this.userid);
    console.log("UrlX->",myurl);
    console.log("Headers->ll",JSON.stringify(headers));
    this.webClient.post(myurl,{},headers).then(data=>{

      
      console.log("Respuesta:",JSON.stringify( data.data));
    });

    this.Core.FollowUser(this.userid,this.username);
    this.miscookies=this.Core.cookies;
  }

  ExtraerCookie(cookie: string, nombre: string) {
    let pos: number;
    let pos2: number;
    let lennom: number;
    let result: string;
    result = "";
    pos = cookie.indexOf(nombre,0);
    if (pos > -1) {
      pos += nombre.length + 1
      pos2 = cookie.indexOf(";", pos);
      if (pos2==-1) pos2=cookie.length;
      lennom = nombre.length;
      result = cookie.substr(pos, pos2 - pos);
      return result;
    }
    return result;
  }
  async onClick2(){
    this.webClient.clearCookies();
    let data = await this.webClient.get(this.baseurl, {}, {});
    //console.log(data.data);
    let cookies = this.webClient.getCookieString(this.baseurl);
    console.log("Cookies:", cookies);
    this.cookies = cookies;
    let mid = this.ExtraerCookie(cookies, "mid");
    let cs=this.ExtraerCookie(cookies, "csrftoken");
    let ds_user_id = this.ExtraerCookie(cookies, "ds_user_id");
    console.log("cookies",cookies);
    console.log("Mid",mid);
    console.log("cs",cs);
    console.log("Mid",mid);
    let body: string = data.data
    this.token = body.match(/"csrf_token":"(.*?)"/);
    this.csrf = this.token[1];
    this.csrf = cs;
    
    this.mid = mid;
    this.miscookies=cookies;
  }
}
