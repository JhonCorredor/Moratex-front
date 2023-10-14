import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HelperService, Messages, MessageType } from 'src/app/admin/helper.service';
import { LoginService } from './login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public frmLogin;
  public visibleLogin = true;

  constructor(public router: Router, public message: ToastrService, public _helperService: HelperService, private service: LoginService) { 
    this.frmLogin = new FormGroup({
      Usuario: new FormControl(null, Validators.required),
      Password: new FormControl(null, Validators.required),
      Remember: new FormControl(null)
    })
  }

  ngOnInit(): void {
    if (document.cookie.indexOf("Usuario") > -1 && document.cookie.indexOf("Password") > -1) {
      this.frmLogin.controls["Usuario"].setValue(document.cookie.split("Usuario=")[1].split(";")[0]);
      this.frmLogin.controls["Password"].setValue(document.cookie.split("Password=")[1].split(";")[0]);
      this.frmLogin.controls["Remember"].setValue(true)
    }
  }

  recordar(){
    let isChecked = this.frmLogin.controls["Remember"].value
    let Usuario = this.frmLogin.controls["Usuario"].value
    let Password = this.frmLogin.controls["Password"].value
    if (isChecked) {
      let date = (new Date().getFullYear()) + 1;
      document.cookie = `Usuario=${Usuario}; expires=Thu, 02 Jan ${date} 00:00:00 UTC; path=/;`;
      document.cookie = `Password=${Password}; expires=Thu, 02 Jan ${date} 00:00:00 UTC; path=/;`;
    }
    else{
      let date = (new Date().getFullYear()) - 1;
      document.cookie = `Usuario=${Usuario}; expires=Thu, 02 Jan ${date} 00:00:00 UTC; path=/;`;
      document.cookie = `Password=${Password}; expires=Thu, 02 Jan ${date} 00:00:00 UTC; path=/;`;
    }
  }


  async iniciarSesion() {
    
    if (this.frmLogin.invalid) {
      this.message.warning("Existen campos vacíos", "Mensaje del sistema")
      return
    }
    this._helperService.showLoading()
    
    this.service.IniciarSesion(this.frmLogin.value).subscribe(res => {
      this._helperService.hideLoading()
      if (res.status && res.status == true) {
        this.recordar()
        localStorage.setItem("token", res.data.token)
        localStorage.setItem("menu", JSON.stringify(res.data.menus))
        localStorage.setItem("userId", JSON.stringify(res.data.user.id))
        localStorage.setItem("userName", res.data.user.persona)
        localStorage.setItem("persona_Id", res.data.user.persona_Id)
        this.router.navigateByUrl('/dashboard', { skipLocationChange: true });
        setTimeout(() => {
            return location.reload()
        }, 500);
      }
    } , error => {
      this._helperService.hideLoading()
      setTimeout(() => {
        this._helperService.showMessage(MessageType.ERROR, Messages.INVALIDUSER);
    }, 700);
    });
  }

}
