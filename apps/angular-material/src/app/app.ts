import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { IconService } from './core';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  template: '<router-outlet />',
})
export class App {
  constructor(_icons: IconService) {}
}
