import { Component, input } from '@angular/core';
import { NzTypographyModule } from 'ng-zorro-antd/typography';

@Component({
  selector: 'ui-placeholder-page',
  standalone: true,
  imports: [NzTypographyModule],
  template: '<h1 nz-typography>{{ title() }}</h1>',
})
export class PlaceholderPage {
  readonly title = input('页面');
}
