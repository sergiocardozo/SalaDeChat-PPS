import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController, ToastController } from '@ionic/angular';
import { AuthService } from 'src/app/service/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  authSrv = inject(AuthService);

  formData: FormGroup;
  error: boolean = false;
  message: string = '';
  constructor(private fb: FormBuilder, private router: Router,
    private toastCtrl: ToastController,
    private loading: LoadingController) { }

  ngOnInit() {
    this.formData = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
    
    console.log(this.formData.value); 
  }
  async openToast(msg: string, status: string) {
    const toast = await this.toastCtrl.create({
      message: msg,
      color: status,
      duration: 3000,
      position: 'top'
    });
    toast.present()
  }
  async onLogin() {

    const form = this.formData.value;
    const spinner = await this.loading.create({
      message: 'Procesando...',
      duration: 3000,
      spinner: 'lines',
      showBackdrop: true
    })
    spinner.present();
    const user = await this.authSrv.signIn(form.email, form.password).then(resp => {
      this.openToast('Acceso correcto', 'success');
      setTimeout(() => {
        spinner.dismiss();
        this.router.navigateByUrl('home', { replaceUrl: true });

      }, 3000);
    }).catch(err => {
      console.log(err);
        spinner.dismiss();
        this.error = true;
        this.message = "El usuario no existe";
        setTimeout(() => {
          this.message = '';
          this.error = false;
        }, 2000);
    });
  }

  onRegister(){
    this.router.navigate(['register']);
  }
  
  get email() {
		return this.formData.get('email');
	}
  get password() {
		return this.formData.get('password');
	}

  testLogin() {
    this.formData.setValue({ email: 'admin@admin.com', password: '111111' })

  }

  testLogin1() {
    this.formData.setValue({ email: 'invitado@invitado.com', password: '222222' })
  }

  testLogin2() {
    this.formData.setValue({ email: 'usuario@usuario.com', password: '333333' })

  }
}
