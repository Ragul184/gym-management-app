import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { AutoLoginGuard } from './guards/auto-login.guard';
import { IntroGuard } from './guards/intro.guard';

const routes: Routes = [
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then(m => m.LoginPageModule),
    canLoad: [IntroGuard, AutoLoginGuard]
  },
  {
    path: 'tabs',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule),
    canLoad: [AuthGuard]
  },
  {
    path: 'intro',
    loadChildren: () => import('./pages/intro/intro.module').then(m => m.IntroPageModule)
  },
  {
    path: 'signup',
    loadChildren: () => import('./pages/signup/signup.module').then(m => m.SignupPageModule)
  },
  {
    path: 'forgot-password',
    loadChildren: () => import('./pages/forgot-password/forgot-password.module').then(m => m.ForgotPasswordPageModule)
  },
  {
    path: 'add-member',
    loadChildren: () => import('./pages/add-member/add-member.module').then(m => m.AddMemberPageModule)
  },
  {
    path: 'list-member',
    loadChildren: () => import('./pages/list-member/list-member.module').then(m => m.ListMemberPageModule)
  },
  {
    path: 'member-detail',
    loadChildren: () => import('./pages/member-detail/member-detail.module').then(m => m.MemberDetailPageModule)
  },
  {
    path: 'list-collections',
    loadChildren: () => import('./pages/list-collections/list-collections.module').then(m => m.ListCollectionsPageModule)
  },
  {
    path: 'profile',
    redirectTo: 'tabs/tab1',
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
  {
    path: 'view-all-members',
    loadChildren: () => import('./pages/view-all-members/view-all-members.module').then( m => m.ViewAllMembersPageModule)
  },
  {
    path: 'view-all-payments',
    loadChildren: () => import('./pages/view-all-payments/view-all-payments.module').then( m => m.ViewAllPaymentsPageModule)
  },
  {
    path: 'show-expiring-members',
    loadChildren: () => import('./pages/show-expiring-members/show-expiring-members.module').then( m => m.ShowExpiringMembersPageModule)
  },
  {
    path: 'delete-user',
    loadChildren: () => import('./pages/delete-user/delete-user.module').then( m => m.DeleteUserPageModule)
  }

];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
