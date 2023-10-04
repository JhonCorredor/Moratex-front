import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ToastrModule } from 'ngx-toastr';
import { UiSwitchModule } from 'ngx-ui-switch';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { TextMaskModule } from 'angular2-text-mask';
import { DatePipe } from '@angular/common';
import { InterceptorInterceptor } from './admin/interceptor/interceptor.interceptor';
import { NgSelectModule } from '@ng-select/ng-select';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ToastrModule.forRoot({
      positionClass: 'toast-bottom-right',
      autoDismiss: true,
      preventDuplicates: true
    }),
    UiSwitchModule.forRoot({
      size: 'small',
      color: '#c22926',
      switchColor: '#c22926',
      defaultBgColor: 'white',
      defaultBoColor : '#c22926',
      checkedLabel: 'Si',
      uncheckedLabel: 'No'
    }),
    NgxSpinnerModule,
    NgSelectModule
  ],
  providers: [
    DatePipe,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: InterceptorInterceptor,
      multi: true
    }
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent]
})
export class AppModule { }