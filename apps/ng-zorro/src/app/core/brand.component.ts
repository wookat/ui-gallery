import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NzTypographyModule } from 'ng-zorro-antd/typography';

@Component({
  selector: 'ui-brand',
  standalone: true,
  imports: [RouterLink, NzTypographyModule],
  template: `
    <a class="brand" routerLink="/" queryParamsHandling="preserve">
      <span class="brand-mark">A</span>
      <span nz-typography>Acme Console</span>
    </a>
  `,
  styles: `
    .brand { display: inline-flex; align-items: center; gap: 10px; text-decoration: none; white-space: nowrap; }
    .brand-mark { display: grid; width: 32px; height: 32px; place-items: center; border-radius: 7px; background: #1677ff; color: #fff; font-weight: 700; }
  `,
})
export class BrandComponent {}
