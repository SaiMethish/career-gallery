import { Component } from '@angular/core';
import { Card } from "primeng/card";
import { AppInput } from "../../components/app-input/app-input";
import { AppButton } from "../../components/app-button/app-button";

@Component({
  selector: 'app-login',
  imports: [Card, AppInput, AppButton],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {

}
