import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material/icon';
import { iconNames, iconSets } from './icons';
import type { IconSetName } from './icons/types';
import { UrlSettingsService } from './url-settings.service';

function currentColorSvg(svg: string): string {
  return svg
    .replace(/fill="(?:#000000|#000|black)"/gi, 'fill="currentColor"')
    .replace(/<svg\b(?![^>]*\bfill=)/, '<svg fill="currentColor"');
}

@Injectable({ providedIn: 'root' })
export class IconService {
  private registeredSet: IconSetName | null = null;

  constructor(
    private readonly registry: MatIconRegistry,
    private readonly sanitizer: DomSanitizer,
    private readonly settings: UrlSettingsService,
  ) {
    this.register(settings.iconSet());
  }

  register(setName: IconSetName = this.settings.iconSet()): void {
    if (this.registeredSet === setName) {
      return;
    }
    const icons = iconSets[setName];
    for (const name of iconNames) {
      const svg = icons[name] ?? iconSets.native[name];
      if (svg) {
        this.registry.addSvgIconLiteral(name, this.sanitizer.bypassSecurityTrustHtml(currentColorSvg(svg)));
      }
    }
    this.registeredSet = setName;
  }
}
