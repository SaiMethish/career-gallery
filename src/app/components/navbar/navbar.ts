import { Component, OnInit } from '@angular/core';
import { MenuItem} from 'primeng/api';
import { Card } from 'primeng/card';
import { Menubar } from 'primeng/menubar';
import { SearchBar } from '../search-bar/search-bar';
import { Avatar } from 'primeng/avatar';


@Component({
  selector: 'app-navbar',
  imports: [Card,Menubar,SearchBar,Avatar],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar implements OnInit{
  items!:MenuItem[];

  ngOnInit(): void {
    this.items=[
      {
        id:'1',
        label:'Jobs',
        //icon:PrimeIcons.BRIEFCASE
      },
      {
        id:'2',
        label:'Saved',
        //icon:PrimeIcons.BOOKMARK
      },
      {
        id:'3',
        label:'Notifications',
        //icon:PrimeIcons.BELL
      }
    ]
  }

}
