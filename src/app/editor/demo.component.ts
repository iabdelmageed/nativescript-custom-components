import { Component, OnInit } from '@angular/core'


@Component({
  selector: 'ns-demo',
  templateUrl: 'demo.component.html',
})
export class DemoComponent implements OnInit {

  students: any[] = [];
  itemTemplate: string;

  constructor() { }

  ngOnInit(): void {
    this.students.push(
      {
        "id": 1,
        "firstName": "ABC",
        "lastName": "DEF",
        "profileImageURL": "https://gravatar.com/avatar/d1d4ce8096905a65ba11ca83aa8786e7?s=400&d=robohash&r=x"
      },
      {
        "id": 2,
        "firstName": "KLM",
        "lastName": "NOP",
        "profileImageURL": "https://gravatar.com/avatar/10e3cd50c9688722805b326540301306?s=400&d=robohash&r=x"
      },
      {
        "id": 3,
        "firstName": "QYZ",
        "lastName": "THJ",
        "profileImageURL": "https://gravatar.com/avatar/5c45b656fd4ea615d9d2c0b384d44e57?s=400&d=robohash&r=x"
      }
    );
    this.students.forEach(student => student.label = student.firstName + ' ' + student.lastName); // for the search to work
    this.itemTemplate = `<StackLayout (tap)="chat(item)" orientation="vertical" style="padding:15 0 ; margin:0 15;">
      <StackLayout orientation="horizontal">
          <Image stretch="aspectFill" borderRadius="50%" width="40" height="40" src="{{profileImageURL}}"></Image>
          <Label fontSize="15" marginLeft="20" text="{{firstName}}" verticalAlignment="center"></Label>
          <Label fontSize="15" text="{{lastName}}" verticalAlignment="center"></Label>
      </StackLayout>
  </StackLayout>`;
  }

  onSelect(args) {
    console.log(`Item selected ${args}`);
  }
}
