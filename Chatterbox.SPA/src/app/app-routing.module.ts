import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChatWithUserComponent } from './chat-with-user/chat-with-user.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { MyProfileComponent } from './my-profile/my-profile.component';
import { RegisterComponent } from './register/register.component';
import { RoomListComponent } from './room-list/room-list.component';
import { ChannelListResolver } from './_resolvers/channel-list.resolver';
import { AuthGuard } from './_guards/auth.guard';

const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'my-profile', component: MyProfileComponent},
  {path: 'room-list', component: RoomListComponent, resolve: {rooms: ChannelListResolver}},
  {path: 'chat-with-user', component: ChatWithUserComponent, canActivate: [AuthGuard]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
