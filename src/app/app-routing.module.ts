import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { AutoLoginGuard } from './guards/auto-login.guard';
import { IntroGuard } from './guards/intro.guard';
import { canActivate, redirectLoggedInTo, redirectUnauthorizedTo } from '@angular/fire/auth-guard';

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['']);
const redirectLoggedInToHome = () => redirectLoggedInTo(['home']);

const routes: Routes = [
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then(m => m.LoginPageModule),
    ...canActivate(redirectLoggedInToHome),
    canLoad: [IntroGuard]
  },
  {
    path: 'tabs',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule),
    ...canActivate(redirectUnauthorizedToLogin)
  },
  {
    path: 'intro',
    loadChildren: () => import('./pages/intro/intro.module').then(m => m.IntroPageModule)
  },
  {
    path: 'signup',
    loadChildren: () => import('./pages/signup/signup.module').then(m => m.SignupPageModule),
    ...canActivate(redirectLoggedInToHome)
  },
  {
    path: 'forgot-password',
    loadChildren: () => import('./pages/forgot-password/forgot-password.module').then(m => m.ForgotPasswordPageModule),
    ...canActivate(redirectLoggedInToHome)
  },
  {
    path: 'add-member',
    loadChildren: () => import('./pages/add-member/add-member.module').then(m => m.AddMemberPageModule),
    ...canActivate(redirectUnauthorizedToLogin)
  },
  {
    path: 'member-detail/:memberId',
    loadChildren: () => import('./pages/member-detail/member-detail.module').then(m => m.MemberDetailPageModule),
    ...canActivate(redirectUnauthorizedToLogin)
  },
  {
    path: 'view-all-members/:status',
    loadChildren: () => import('./pages/view-all-members/view-all-members.module').then(m => m.ViewAllMembersPageModule),
    ...canActivate(redirectUnauthorizedToLogin)
  },
  {
    path: 'view-all-payments/:filter',
    loadChildren: () => import('./pages/view-all-payments/view-all-payments.module').then(m => m.ViewAllPaymentsPageModule),
    ...canActivate(redirectUnauthorizedToLogin)
  },
  {
    path: 'init-payment',
    loadChildren: () => import('./pages/init-payment/init-payment.module').then(m => m.InitPaymentPageModule),
    ...canActivate(redirectUnauthorizedToLogin)
  },
  {
    path: 'update-payment/:id',
    loadChildren: () => import('./pages/update-payment/update-payment.module').then(m => m.UpdatePaymentPageModule),
    ...canActivate(redirectUnauthorizedToLogin)
  },
  {
    path: 'payment-detail/:paymentId',
    loadChildren: () => import('./pages/payment-detail/payment-detail.module').then(m => m.PaymentDetailPageModule),
    ...canActivate(redirectUnauthorizedToLogin)
  },
  {
    path: 'edit-member/:memberId',
    loadChildren: () => import('./pages/edit-member/edit-member.module').then(m => m.EditMemberPageModule),
    ...canActivate(redirectUnauthorizedToLogin)
  },
  {
    path: 'edit-payment-info/:paymentId',
    loadChildren: () => import('./pages/edit-payment-info/edit-payment-info.module').then(m => m.EditPaymentInfoPageModule),
    ...canActivate(redirectUnauthorizedToLogin)
  },
  {
    path: 'profile',
    redirectTo: 'tabs/profile',
    pathMatch: 'full'
  },
  {
    path: 'home',
    redirectTo: 'tabs/home',
    pathMatch: 'full'
  },
  {
    path: 'more',
    redirectTo: 'tabs/more',
    pathMatch: 'full'
  },
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: '/login',
    pathMatch: 'full'
  },

];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
