import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HttpClientModule } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxSpinnerModule } from 'ngx-spinner';
import { NgxPageScrollModule } from 'ngx-page-scroll';

import { HeaderComponent } from './component/header/header.component';
import { FooterComponent } from './component/footer/footer.component';
import { OnlyNumberDirective } from './directive/only-number.directive';

//----------------Material----------------//
import {
  MatAutocompleteModule, MatButtonModule, MatButtonToggleModule, MatCardModule, MatCheckboxModule,
  MatChipsModule, MatDatepickerModule, MatDialogModule, MatExpansionModule, MatGridListModule,
  MatIconModule, MatInputModule, MatListModule, MatMenuModule, MatNativeDateModule, MatPaginatorModule,
  MatProgressBarModule, MatProgressSpinnerModule, MatRadioModule, MatRippleModule, MatSelectModule,
  MatSidenavModule, MatSliderModule, MatSlideToggleModule, MatSnackBarModule,
  MatSortModule, MatTableModule, MatTabsModule, MatToolbarModule, MatTooltipModule, MatStepperModule,
} from '@angular/material';
//----------------Services----------------//
import { LoginService } from './services/login.service';
import { CreateAppService } from './services/create-app.service';
import { FranchiseUserService } from './services/franchise-user.service';
import { GeneralService } from './services/general.service';

// guard
import { AuthGuard } from './guard/auth.guard';
import { LoginComponent } from './component/login/login.component';
import { ConfirmDialogComponent } from './component/confirm-dialog/confirm-dialog.component';
import { OtpDialogComponent } from './component/otp-dialog/otp-dialog.component';
import { CouponDialogComponent } from './component/coupon-dialog/coupon-dialog.component';
import { LoadingComponent } from './component/loading/loading.component';
import { SiteHeaderComponent } from './component/site-header/site-header.component';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    NgbModule.forRoot(),
    RouterModule,
    NgxSpinnerModule,
    NgxPageScrollModule,
    FormsModule,
    ReactiveFormsModule,
    //----------------Material----------------//
    MatAutocompleteModule, MatButtonModule, MatButtonToggleModule,
    MatCardModule, MatCheckboxModule, MatChipsModule, MatStepperModule, MatDatepickerModule,
    MatDialogModule, MatExpansionModule, MatGridListModule, MatIconModule, MatInputModule, MatListModule,
    MatMenuModule, MatNativeDateModule, MatPaginatorModule, MatProgressBarModule,
    MatProgressSpinnerModule, MatRadioModule, MatRippleModule, MatSelectModule, MatSidenavModule,
    MatSliderModule, MatSlideToggleModule, MatSnackBarModule, MatSortModule, MatTableModule,
    MatTabsModule, MatToolbarModule, MatTooltipModule,
    //----------------Material----------------//
  ],
  declarations: [
    HeaderComponent,
    FooterComponent,
    OnlyNumberDirective, LoginComponent, ConfirmDialogComponent, OtpDialogComponent, CouponDialogComponent,
    LoadingComponent,
    SiteHeaderComponent
  ],
  providers: [],
  exports: [
    HeaderComponent,
    FooterComponent,
    NgxSpinnerModule,
    NgxPageScrollModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    OnlyNumberDirective,
    LoadingComponent,
    SiteHeaderComponent,
    //----------------Material----------------//
    MatAutocompleteModule, MatButtonModule, MatButtonToggleModule,
    MatCardModule, MatCheckboxModule, MatChipsModule, MatStepperModule, MatDatepickerModule,
    MatDialogModule, MatExpansionModule, MatGridListModule, MatIconModule, MatInputModule, MatListModule,
    MatMenuModule, MatNativeDateModule, MatPaginatorModule, MatProgressBarModule,
    MatProgressSpinnerModule, MatRadioModule, MatRippleModule, MatSelectModule, MatSidenavModule,
    MatSliderModule, MatSlideToggleModule, MatSnackBarModule, MatSortModule, MatTableModule,
    MatTabsModule, MatToolbarModule, MatTooltipModule,
    //----------------Material----------------//
  ],
  entryComponents: [
    LoginComponent,
    ConfirmDialogComponent,
    OtpDialogComponent,
    CouponDialogComponent
  ]
})
export class CoreModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: CoreModule,
      providers: [
        AuthGuard,
        LoginService,
        CreateAppService,
        FranchiseUserService,
        GeneralService
      ]

    };
  }
}
