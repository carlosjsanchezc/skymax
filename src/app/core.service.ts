import { Injectable } from '@angular/core';
import { HTTP } from '@ionic-native/http/ngx';
import { Storage } from '@ionic/storage';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class CoreService {

  constructor(private webClient: HTTP, private myStorage: Storage, private http: HttpClient) {
    this.mid="";
    this.csrf="";
   }

  user: string;
  password: string;
  csrf: string;
  token: string[];
  userid: string;
  followers: number;
  following: number;
  baseurl: string = "https://www.instagram.com";
  mid: string;
  profilepic: string;
  getPeopleURL: string = "http://tbitpro.com/skymax/apiskymax.php?opcion=follow&id_usuario=0";
  loginurl: string = "https://www.instagram.com/accounts/login/ajax/";
  followingsurl: string = "https://www.instagram.com/graphql/query/?query_id=17874545323001329&id={{accountId}}&first={{count}}&after={{after}}";
  followurl: string = "https://www.instagram.com/web/friendships/{{accountId}}/follow/";
  //useragent: string = "Mozilla/5.0 (Linux; <Android Version>; <Build Tag etc.>) AppleWebKit/<WebKit Rev> (KHTML, like Gecko) Chrome/<Chrome Rev> Mobile Safari/<WebKit Rev>";
  //useragent: string = "Mozilla/5.0 (Linux; Android 8.1.0; motorola one Build/OPKS28.63-18-3; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/70.0.3538.80 Mobile Safari/537.36 Instagram 72.0.0.21.98 Android (27/8.1.0; 320dpi; 720x1362; motorola; motorola one; deen_sprout; qcom; pt_BR; 132081645)";

  useragent:string="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.139 Safari/537.36";
  busy: boolean = false;

  async FollowUser(userid: string, username: string) {

    let myurl = this.followurl;
    myurl = myurl.replace("{{accountId}}", userid);
    console.log("Url Follow->", myurl);
    let headers = {
      'cookie': "ig_cb=1; csrftoken=" + this.csrf + "; mid=" + this.mid + ";",
      'referer': this.baseurl + "/"+username+"/"+userid,
      'x-csrftoken': this.csrf,
      'X-CSRFToken': this.csrf,
      'user-agent': this.useragent,
    };
    console.log("Headers Follow->", JSON.stringify(headers));
    this.webClient.post(myurl, {}, headers).then(data => {


      console.log("Respuesta a follow:", JSON.stringify(data.data));
    });
  }


  async ShowUser(user: string) {
    let url = this.baseurl + "/" + user;
    console.log("url:", url);
    let data = await this.webClient.get(url, {}, {});
    //console.log("data",data.data);
    //console.log("Salio");
    let arr = data.data.match(/"profile_pic_url":"(.*?)"/);
    let MyStringData: string = data.data;
    let pos = MyStringData.indexOf("window._sharedData =");
    if (pos > 0) {
      let pos2 = MyStringData.indexOf("</script>", pos);
      let jsonstr = MyStringData.substr(pos + 20, pos2 - pos - 20);
      console.log("jsonstr", jsonstr);
      let objectinst = JSON.parse(jsonstr);
      //this.profilepic=objectinst.entry_data.ProfilePage[0].graphql.user.profile_pic_url;
    }

    //console.log("arr2",arr2);
    //this.profilepic=arr[1];
    //"150console.log("Foto",this.profilepic);
    return data.data;
  }
  getPeople() {
    //let data = await this.HttpClient.get(this.getPeopleURL);
    return this.http.get(this.getPeopleURL);
    let data = this.http.get(this.getPeopleURL);
    console.log("Data Leida", data);
    return data['data'];


  }
  async getLastLogin(){
    this.user = await this.myStorage.get("user");
    this.password = await this.myStorage.get("password");
    return true;
  }
  async LastLogin() {



    console.log("Viendo problema");

    console.log("Usuario:",this.user);

    let data = await this.webClient.get(this.baseurl + "/" + this.user, {}, {});
    let instOBJ = this.StringJSONaObject(data.data);
    console.log(instOBJ);
    this.profilepic = instOBJ.entry_data.ProfilePage[0].graphql.user.profile_pic_url;
    this.followers = instOBJ.entry_data.ProfilePage[0].graphql.user.edge_followed_by.count;
    this.following = instOBJ.entry_data.ProfilePage[0].graphql.user.edge_follow.count;
    console.log("User", this.user);
  }
  async Login() {
    this.busy = true;
    let data = await this.webClient.get(this.baseurl, {}, {});
    console.log(data.data);
    let relogin: boolean = true;
    let cookies = this.webClient.getCookieString(this.baseurl);
    console.log("Cookies:", cookies);
    let mid = this.ExtraerCookie(cookies, "mid");
    let ds_user_id = this.ExtraerCookie(cookies, "ds_user_id");

    let body: string = data.data
    this.token = body.match(/"csrf_token":"(.*?)"/);
    this.csrf = this.token[1];
    this.mid = mid;
    let headers = {
      'cookie': "ig_cb=1; csrftoken=" + this.csrf + "; mid=" + this.mid + ";",
      'referer': this.baseurl + "/",
      'x-csrftoken': this.csrf,
      'X-CSRFToken': this.csrf,
      'user-agent': this.useragent,
    };
    let params = {
      'username': this.user,
      'password': this.password
    };

    let x = 2;
    if (relogin) {
      this.webClient.post(this.loginurl, params, headers).catch(error => {
        console.log("Hubo un error");
        console.log(error.status);
        console.log(error.error); // error message as string
        console.log(error.headers);
        this.busy = false;
        return false;
      });
      console.log("Params Login:", params);
      console.log("Headers Login:", headers);
      let data2 = await this.webClient.post(this.loginurl, params, headers);
      let datos = JSON.parse(data2.data);
      if (datos.authenticated == true) {
        this.userid = datos.userId;
        data = await this.webClient.get(this.baseurl + "/" + this.user, {}, {});
        let instOBJ = this.StringJSONaObject(data.data);
        console.log(instOBJ);
        this.profilepic = instOBJ.entry_data.ProfilePage[0].graphql.user.profile_pic_url;
        this.followers = instOBJ.entry_data.ProfilePage[0].graphql.user.edge_followed_by.count;
        this.following = instOBJ.entry_data.ProfilePage[0].graphql.user.edge_follow.count;
        return true;
        //console.log("UserId",this.userid);
      }
      else {
        return false;
      }

    }

    this.busy = false;





  }
  ExtraerCookie(cookie: string, nombre: string) {
    let pos: number;
    let pos2: number;
    let lennom: number;
    let result: string;
    result = "";
    pos = cookie.indexOf(nombre, 1);
    if (pos > 0) {
      pos += nombre.length + 1;
      pos2 = cookie.indexOf(";", pos);
      lennom = nombre.length;
      result = cookie.substr(pos, pos2 - pos);

      return result;
    }
    return result;
  }
  async Datos() {
    this.webClient.get('https://www.instagram.com', {}, {}).then(data => {
      console.log("Data>", data);
      console.log("Headers:", data.headers);
      console.log("Status", data.status);
      console.log("Cookies", this.webClient.getCookieString('https://www.instagram.com'));
      let cookies = this.webClient.getCookieString('https://www.instagram.com');
      console.log("Mid", this.ExtraerCookie(cookies, "mid"));

      let body: string = data.data
      this.token = body.match(/"csrf_token":"(.*?)"/);
      this.csrf = this.token[1];
      console.log("CSRF:", this.csrf);


      return this.csrf;
    })
  }
  StringJSONaObject(str: string) {
    let datahttp: string = str;

    let pos = datahttp.indexOf("window._sharedData =");
    if (pos > 0) {
      let pos2 = datahttp.indexOf("</script>", pos);
      let jsonstr = datahttp.substr(pos + 20, pos2 - pos - 21);
      //console.log("jsonstr",jsonstr);
      let objectinst = JSON.parse(jsonstr);
      //this.profilepic=objectinst.entry_data.ProfilePage[0].graphql.user.profile_pic_url;

      return objectinst;
    }
  }
}


