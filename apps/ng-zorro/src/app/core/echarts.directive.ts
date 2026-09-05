import {
  Directive,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  afterNextRender,
} from '@angular/core';
import * as echarts from 'echarts';

@Directive({ selector: '[uiEcharts]', standalone: true })
export class EchartsDirective implements OnDestroy, OnChanges {
  @Input() uiEcharts: echarts.EChartsOption = {};
  private chart?: echarts.ECharts;
  private observer?: ResizeObserver;
  private resizeFrame?: number;

  constructor(private readonly element: ElementRef<HTMLElement>) {
    afterNextRender(() => {
      this.chart = echarts.init(this.element.nativeElement, undefined, { renderer: 'svg' });
      this.render();
      this.observer = new ResizeObserver(() => {
        if (this.resizeFrame !== undefined) {
          return;
        }
        this.resizeFrame = requestAnimationFrame(() => {
          this.resizeFrame = undefined;
          this.chart?.resize();
        });
      });
      this.observer.observe(this.element.nativeElement);
    });
  }

  ngOnChanges(): void {
    this.render();
  }

  private render(): void {
    if (!this.chart) {
      return;
    }
    const dark = document.documentElement.classList.contains('dark');
    this.chart.setOption({ ...this.uiEcharts, backgroundColor: 'transparent' }, true);
    if (dark) {
      this.chart.setOption({ textStyle: { color: '#d9d9d9' } });
    }
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
    if (this.resizeFrame !== undefined) {
      cancelAnimationFrame(this.resizeFrame);
    }
    this.chart?.dispose();
  }
}
