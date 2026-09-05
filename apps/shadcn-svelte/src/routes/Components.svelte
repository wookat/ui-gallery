<script lang="ts">
  import * as Badge from "$lib/components/ui/badge"
  import * as Card from "$lib/components/ui/card"
  import * as Empty from "$lib/components/ui/empty"
  import { coverage } from "../coverage"
  import Typography from "./components/Typography.svelte"
  import Buttons from "./components/Buttons.svelte"
  import FormControls from "./components/FormControls.svelte"
  import DataDisplay from "./components/DataDisplay.svelte"
  import Feedback from "./components/Feedback.svelte"
  import Navigation from "./components/Navigation.svelte"
  import LayoutDemos from "./components/LayoutDemos.svelte"
  import Extras from "./components/Extras.svelte"

  const sections = Object.entries(coverage)
  const typography = new Set(["Typography", "Code", "Kbd", "Link", "Divider", "ThemeProvider"])
  const buttons = new Set([
    "Button",
    "ButtonGroup",
    "IconButton",
    "Toggle",
    "ToggleGroup",
    "Segmented",
  ])
  const forms = new Set([
    "Input",
    "Textarea",
    "NumberInput",
    "Select",
    "Checkbox",
    "Radio",
    "Switch",
    "Slider",
    "DatePicker",
    "DateRangePicker",
    "PinInput",
    "MultiSelect",
    "Combobox",
    "Autocomplete",
    "Rating",
    "TimePicker",
    "Upload",
    "Cascader",
    "Form",
    "ColorPicker",
    "NativeSelect",
  ])
  const data = new Set([
    "Table",
    "DataGrid",
    "Descriptions",
    "List",
    "Card",
    "Avatar",
    "AvatarGroup",
    "Badge",
    "Tag",
    "Statistic",
    "Timeline",
    "Tree",
    "Calendar",
    "Image",
    "Carousel",
    "Empty",
    "Tooltip",
    "Popover",
    "HoverCard",
    "QRCode",
  ])
  const feedback = new Set([
    "Alert",
    "Toast",
    "Notification",
    "Dialog",
    "Drawer",
    "Progress",
    "Skeleton",
    "Spinner",
    "Result",
    "Popconfirm",
  ])
  const navigation = new Set([
    "Menu",
    "Dropdown",
    "Breadcrumb",
    "Tabs",
    "Pagination",
    "Steps",
    "Anchor",
    "BackTop",
    "Navbar",
    "Sidebar",
    "CommandPalette",
    "ContextMenu",
  ])
  const layout = new Set([
    "Grid",
    "Stack",
    "Layout",
    "Container",
    "AspectRatio",
    "Resizable",
    "ScrollArea",
    "Accordion",
  ])
  const extras = [
    "Toggle",
    "ToggleGroup",
    "Collapsible",
    "HoverCard",
    "ContextMenu",
    "Menubar",
    "NavigationMenu",
    "InputGroup",
    "Field",
    "Item",
    "Marker",
    "Bubble",
    "Message",
    "Attachment",
    "Label",
    "Sonner",
  ]
</script>

<div id="components" class="space-y-8">
  <div>
    <p class="text-sm text-muted-foreground">Kitchen sink</p>
    <h1 class="text-2xl font-semibold">组件全集</h1>
    <p class="mt-2 text-muted-foreground">每个适配组件都提供可以直接操作的默认、尺寸和状态示例。</p>
  </div>

  <nav class="flex max-h-48 flex-wrap gap-2 overflow-y-auto rounded-xl border bg-card p-4">
    {#each sections as [name, status]}
      <a href={`#${name}`} class="rounded-md bg-muted px-2 py-1 text-xs hover:bg-accent">
        {name}<span class="ml-1 text-muted-foreground">·{status}</span>
      </a>
    {/each}
  </nav>

  <div class="space-y-6">
    {#each sections as [name, status]}
      <section id={name} class="scroll-mt-6">
        <Card.Root>
          <Card.Header class="flex flex-row items-center justify-between gap-3">
            <div>
              <Card.Title>{name}</Card.Title><Card.Description
                >{status === "composed"
                  ? "由多个 primitives 组合实现。"
                  : "shadcn-svelte 组件适配。"}</Card.Description
              >
            </div>
            <Badge.Root
              variant={status === "missing"
                ? "destructive"
                : status === "composed"
                  ? "secondary"
                  : "default"}>{status}</Badge.Root
            >
          </Card.Header>
          <Card.Content>
            {#if status === "missing"}
              <Empty.Root class="border-0 p-4"
                ><Empty.Header
                  ><Empty.Title>shadcn-svelte 无此组件</Empty.Title><Empty.Description
                    >页面保留契约锚点，等待库提供原生实现。</Empty.Description
                  ></Empty.Header
                ></Empty.Root
              >
            {:else if typography.has(name)}
              <Typography {name} />
            {:else if buttons.has(name)}
              <Buttons {name} />
            {:else if forms.has(name)}
              <FormControls {name} />
            {:else if data.has(name)}
              <DataDisplay {name} />
            {:else if feedback.has(name)}
              <Feedback {name} />
            {:else if navigation.has(name)}
              <Navigation {name} />
            {:else if layout.has(name)}
              <LayoutDemos {name} />
            {:else}
              <Extras {name} />
            {/if}
          </Card.Content>
        </Card.Root>
      </section>
    {/each}
  </div>

  <section id="registry-extra" class="scroll-mt-6 space-y-4">
    <div>
      <h2 class="text-xl font-semibold">registry 额外组件</h2>
      <p class="text-sm text-muted-foreground">官方 registry 中常用的补充 primitive。</p>
    </div>
    <div class="grid gap-6">
      {#each extras as name}
        <Card.Root
          ><Card.Header><Card.Title>{name}</Card.Title></Card.Header><Card.Content
            ><Extras {name} /></Card.Content
          ></Card.Root
        >
      {/each}
    </div>
  </section>
</div>
