import { Component } from '@angular/core';
import { Card } from "primeng/card";
import { AppInput } from "../../components/app-input/app-input";

@Component({
  selector: 'app-login',
  imports: [Card, AppInput],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {

}
