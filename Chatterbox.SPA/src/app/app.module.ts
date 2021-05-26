import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NavComponent } from './nav/nav.component';
import { HomeComponent } from './home/home.component';
import { LayoutModule } from '@angular/cdk/layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ToastrModule } from 'ngx-toastr';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgbHighlight, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AuthInterceptor } from './_services/auth.interceptor';
import { MyProfileComponent } from './my-profile/my-profile.component';
import { RoomListComponent } from './room-list/room-list.component';
import { ChatRoomComponent } from './chat-room/chat-room.component';
import { SocketIoConfig, SocketIoModule } from 'ngx-socket-io';
import {environment} from '../environments/environment'
import { ChatService } from './_services/chat.service';
import { ChannelListResolver } from './_resolvers/channel-list.resolver';
import {PopoverModule} from 'ngx-bootstrap/popover';
import { ToAgoTimePipe } from './_pipes/toAgoTime.pipe';
import { ChatWithUserComponent } from './chat-with-user/chat-with-user.component';
import { ProfileComponent } from './profile/profile.component';
import { InboxComponent } from './inbox/inbox.component';

const config: SocketIoConfig = {url: `${environment.socketBackUrl}/chat`, options: {transports: ['websocket'], allowUpgrades: true}};

@NgModule({
  declarations: [											
    AppComponent,
      NavComponent,
      HomeComponent,
      LoginComponent,
      RegisterComponent,
      MyProfileComponent,
      RoomListComponent,
      ChatRoomComponent,
      ToAgoTimePipe,
      ChatWithUserComponent,
      ProfileComponent,
      InboxComponent
   ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    LayoutModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    FontAwesomeModule,
    ToastrModule.forRoot(),
    NgbModule,
    SocketIoModule.forRoot(config),
    PopoverModule.forRoot()
  ],
  providers: [
    ChannelListResolver,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    ChatService
  ], 
  bootstrap: [AppComponent]
})
export class AppModule { 
}
