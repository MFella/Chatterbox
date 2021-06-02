import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { faCheck, faTimes, IconDefinition } from '@fortawesome/free-solid-svg-icons';
@Component({
  selector: 'app-inbox',
  templateUrl: './inbox.component.html',
  styleUrls: ['./inbox.component.scss']
})
export class InboxComponent implements OnInit {

  constructor(private route: ActivatedRoute) { }

  public icons: Array<IconDefinition> = [faCheck, faTimes];
  
  ngOnInit() {

    this.route.data.subscribe((res: any) => 
    {
      console.log(res)
    })
  }

}
