import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './core/guard/auth.guard';

const routes: Routes = [
  {
    path: '', loadChildren: './layout/layout.module#LayoutModule',
    data: {
      title: 'BanaoApp – The best app maker for creating a celebrated brand.',
      description: 'app maker, create Android app, mobile app development, iPhone app development company, Android mobile app, best mobile apps, latest mobile apps, iOS app development, mobile app development services',
      keywords: 'BanaoApp is your one-stop solution for creating Android phone app and iOS app development at an unimaginably low price. It’s the best way to build your brand'
    }
  },
  {
    path: 'dashboard', loadChildren: './dashboard/dashboard.module#DashboardModule', canActivate: [AuthGuard],
    data: {
      title: 'BanaoApp – The best app maker for creating a celebrated brand.',
      description: 'app maker, create Android app, mobile app development, iPhone app development company, Android mobile app, best mobile apps, latest mobile apps, iOS app development, mobile app development services',
      keywords: 'BanaoApp is your one-stop solution for creating Android phone app and iOS app development at an unimaginably low price. It’s the best way to build your brand'
    }
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
