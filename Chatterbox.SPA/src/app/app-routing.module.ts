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
import { ProfileComponent } from './profile/profile.component';
import { ProfileResolver } from './_resolvers/profile.resolver';
import { InboxComponent } from './inbox/inbox.component';
import { SendMessageComponent } from './send-message/send-message.component';
import { UserListResolver } from './_resolvers/user-list.resolver';
import { MessagesResolver } from './_resolvers/messages.resolver';
import { ChatWithUserResolver } from './_resolvers/chat-with-user.resolver';

const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'my-profile', component: MyProfileComponent},
  {path: 'profile', component: ProfileComponent, resolve: {profile: ProfileResolver}},
  {path: 'room-list', component: RoomListComponent, resolve: {rooms: ChannelListResolver}},
  {path: 'chat-with-user', component: ChatWithUserComponent, canActivate: [AuthGuard], resolve: {users: ChatWithUserResolver}},
  {path: 'messages', component: InboxComponent, canActivate: [AuthGuard], resolve: {messages: MessagesResolver}},
  {path: 'send-message', component: SendMessageComponent, canActivate: [AuthGuard], resolve: {users: UserListResolver}}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
