import { Component } from '@angular/core';
import { NzTypographyModule } from 'ng-zorro-antd/typography';

@Component({
  standalone: true,
  imports: [NzTypographyModule],
  template: '<h1 nz-typography>组件全集</h1>',
})
export class ComponentsPage {}
