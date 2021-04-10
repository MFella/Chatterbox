import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import {environment} from "../environments/environment";
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  
  title = 'chatter-box-spa';

  ngOnInit()
  { 
  }

}
