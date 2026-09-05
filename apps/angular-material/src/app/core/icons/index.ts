import type { IconMap, IconSetName } from './types';
import { heroicons } from './heroicons';
import { lucideIcons } from './lucide';
import { nativeIcons } from './native';
import { phosphorIcons } from './phosphor';
import { tablerIcons } from './tabler';

export const iconSets: Record<IconSetName, IconMap> = {
  native: nativeIcons,
  lucide: lucideIcons,
  tabler: tablerIcons,
  phosphor: phosphorIcons,
  heroicons,
};

export const iconNames = Object.keys(nativeIcons);
