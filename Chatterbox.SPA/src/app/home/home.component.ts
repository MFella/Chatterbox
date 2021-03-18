import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

export interface Section {
  name: string;
  updated: Date;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  folders: Section[] = [
    {
      name: 'Photos',
      updated: new Date('1/1/16'),
    },
    {
      name: 'Recipes',
      updated: new Date('1/17/16'),
    },
    {
      name: 'Work',
      updated: new Date('1/28/16'),
    },
    {
      name: 'Work',
      updated: new Date('1/28/16'),
    },
    {
      name: 'Work',
      updated: new Date('1/28/16'),
    },
    // {
    //   name: 'Work',
    //   updated: new Date('1/28/16'),
    // },
    // {
    //   name: 'Work',
    //   updated: new Date('1/28/16'),
    // },
    // {
    //   name: 'Work',
    //   updated: new Date('1/28/16'),
    // },
    // {
    //   name: 'Work',
    //   updated: new Date('1/28/16'),
    // },
    // {
    //   name: 'Work',
    //   updated: new Date('1/28/16'),
    // }
  ];
  notes: Section[] = [
    {
      name: 'Vacation Itinerary',
      updated: new Date('2/20/16'),
    },
    {
      name: 'Kitchen Remodel',
      updated: new Date('1/18/16'),
    }
  ];

 constructor(){}

  ngOnInit() {
  }

}
