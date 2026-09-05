import { Component } from '@angular/core';
import { NzTypographyModule } from 'ng-zorro-antd/typography';

@Component({
  standalone: true,
  imports: [NzTypographyModule],
  template: '<h1 nz-typography>订单</h1>',
})
export class OrdersPage {}
