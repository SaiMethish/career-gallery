import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CommonService {

  showNavbar=new BehaviorSubject<boolean>(true);
  $showNavbar=this.showNavbar.asObservable();

  setNavbarVisibility(show:boolean){
    this.showNavbar.next(show);
  }
  
  buildFormContent(){
    
  }
  
}
