import { Accordion, Collapsible } from "radix-ui"
import {
  AccessibleIcon,
  AlertDialog,
  AspectRatio,
  Avatar,
  Badge,
  Blockquote,
  Box,
  Button,
  Callout,
  Card,
  Checkbox,
  CheckboxCards,
  CheckboxGroup,
  Code,
  Container,
  ContextMenu,
  DataList,
  Dialog,
  DropdownMenu,
  Em,
  Flex,
  Grid,
  Heading,
  HoverCard,
  IconButton,
  Inset,
  Kbd,
  Link,
  Popover,
  Portal,
  Progress,
  Quote,
  RadioCards,
  RadioGroup,
  Reset,
  ScrollArea,
  Section,
  SegmentedControl,
  Select,
  Separator,
  Skeleton,
  Slider,
  Slot,
  Spinner,
  Strong,
  Switch,
  TabNav,
  Table,
  Tabs,
  Text,
  TextArea,
  TextField,
  Theme,
  ThemePanel,
  Tooltip,
  VisuallyHidden,
} from "@radix-ui/themes"
import { useCallback, useRef, useState } from "react"
import nav from "@ui-gallery/spec/mock/nav.json"
import { coverage, type CoverageStatus } from "@/coverage"
import { Icon } from "@/icons"
import { useToast } from "@/toast"
import { PageHeader } from "./shared"

const exportsList = [
  "AccessibleIcon",
  "AlertDialog",
  "Blockquote",
  "Box",
  "Callout",
  "CheckboxCards",
  "CheckboxGroup",
  "ContextMenu",
  "DataList",
  "Em",
  "HoverCard",
  "Inset",
  "Portal",
  "Quote",
  "RadioCards",
  "Reset",
  "Section",
  "Slot",
  "Strong",
  "TabNav",
  "ThemePanel",
  "VisuallyHidden",
]

function statusColor(status: CoverageStatus) {
  return status === "implemented"
    ? "green"
    : status === "composed"
      ? "blue"
      : "red"
}

const variants = [
  "classic",
  "solid",
  "soft",
  "surface",
  "outline",
  "ghost",
] as const
const colors = ["gray", "red", "green"] as const
const sizes = ["1", "2", "3", "4"] as const

function ButtonMatrix({ iconOnly = false }: { iconOnly?: boolean }) {
  return (
    <Flex direction="column" gap="3">
      {variants.map((variant) => (
        <Flex key={variant} align="center" gap="2" wrap="wrap">
          <Text size="1" color="gray" style={{ width: "64px" }}>
            {variant}
          </Text>
          {sizes.map((size) =>
            iconOnly ? (
              <IconButton key={size} size={size} variant={variant}>
                <Icon name="plus" />
              </IconButton>
            ) : (
              <Button key={size} size={size} variant={variant}>
                {size}
              </Button>
            )
          )}
        </Flex>
      ))}
      <Flex align="center" gap="2" wrap="wrap">
        <Text size="1" color="gray" style={{ width: "64px" }}>
          states
        </Text>
        {iconOnly ? (
          <>
            <IconButton disabled>
              <Icon name="x" />
            </IconButton>
            <IconButton loading>
              <Icon name="refresh" />
            </IconButton>
          </>
        ) : (
          <>
            <Button disabled>disabled</Button>
            <Button loading>loading</Button>
          </>
        )}
      </Flex>
      <Flex align="center" gap="2" wrap="wrap">
        <Text size="1" color="gray" style={{ width: "64px" }}>
          colors
        </Text>
        {colors.map((color) =>
          iconOnly ? (
            <IconButton key={color} color={color} variant="soft">
              <Icon name="check" />
            </IconButton>
          ) : (
            <Button key={color} color={color}>
              {" "}
              {color}{" "}
            </Button>
          )
        )}
        {iconOnly ? (
          <IconButton highContrast>
            <Icon name="star" />
          </IconButton>
        ) : (
          <Button highContrast>high contrast</Button>
        )}
      </Flex>
    </Flex>
  )
}

function BadgeMatrix() {
  return (
    <Flex direction="column" gap="2">
      {["1", "2", "3"].map((size) => (
        <Flex key={size} align="center" gap="2" wrap="wrap">
          <Text size="1" color="gray" style={{ width: "48px" }}>
            size {size}
          </Text>
          {(["solid", "soft", "surface", "outline"] as const).map((variant) =>
            colors.map((color) => (
              <Badge
                key={`${variant}-${color}`}
                size={size as "1"}
                variant={variant}
                color={color}
                highContrast
              >
                {variant} {color}
              </Badge>
            ))
          )}
        </Flex>
      ))}
    </Flex>
  )
}

function TypographyMatrix() {
  const textSizes = ["1", "2", "3", "4", "5", "6", "7", "8", "9"] as const
  return (
    <Flex direction="column" gap="3">
      {textSizes.map((size, index) => (
        <Flex key={size} align="baseline" gap="3" wrap="wrap">
          <Text size="1" color="gray">
            size {index + 1}
          </Text>
          <Heading size={size}>Heading {index + 1}</Heading>
          <Text size={size} truncate>
            Text size {index + 1} with truncate
          </Text>
        </Flex>
      ))}
      <Flex gap="3" wrap="wrap">
        <Text weight="light">light</Text>
        <Text weight="regular">regular</Text>
        <Text weight="medium">medium</Text>
        <Text weight="bold">bold</Text>
        <Text color="red">red</Text>
        <Text color="green">green</Text>
      </Flex>
      <Flex gap="3" wrap="wrap">
        <Em>Em</Em>
        <Strong>Strong</Strong>
        <Quote>Quote</Quote>
        <Blockquote>Blockquote</Blockquote>
        <Link href="#" underline="auto">
          auto
        </Link>
        <Link href="#" underline="always">
          always
        </Link>
        <Link href="#" underline="hover" weight="bold">
          hover bold
        </Link>
      </Flex>
      <Flex gap="2" wrap="wrap">
        {textSizes.map((size, index) => (
          <Kbd key={size} size={size}>
            K{index + 1}
          </Kbd>
        ))}
      </Flex>
    </Flex>
  )
}

function FieldMatrix({ area = false }: { area?: boolean }) {
  const Component = area ? TextArea : TextField.Root
  return (
    <Flex direction="column" gap="3">
      {(["classic", "surface", "soft"] as const).map((variant) => (
        <Flex key={variant} align="center" gap="2" wrap="wrap">
          <Text size="1" color="gray" style={{ width: "56px" }}>
            {variant}
          </Text>
          {(["1", "2", "3"] as const).map((size) => (
            <Component
              key={size}
              size={size}
              variant={variant}
              placeholder={`size ${size}`}
            />
          ))}
          <TextField.Root variant={variant} color="red" placeholder="error">
            <TextField.Slot>
              <Icon name="alert-circle" />
            </TextField.Slot>
          </TextField.Root>
          <TextField.Root
            variant={variant}
            disabled
            placeholder="disabled"
            readOnly
            value="readonly"
          />
        </Flex>
      ))}
    </Flex>
  )
}

function ChoiceMatrix() {
  return (
    <Flex direction="column" gap="3">
      {(["classic", "surface", "soft"] as const).map((variant) => (
        <Flex key={variant} align="center" gap="3" wrap="wrap">
          <Text size="1" color="gray">
            {variant}
          </Text>
          {(["1", "2", "3"] as const).map((size) => (
            <Flex key={size} align="center" gap="1">
              <Checkbox size={size} variant={variant} defaultChecked />
              <Text size={size}>checked</Text>
            </Flex>
          ))}
          <Checkbox variant={variant} checked="indeterminate" />
          <Checkbox variant={variant} disabled />
        </Flex>
      ))}
    </Flex>
  )
}

function ExportDemo({ name }: { name: string }) {
  const [themePanelOpen, setThemePanelOpen] = useState(false)
  const portalContainerRef = useRef<HTMLDivElement>(null)
  const [portalContainer, setPortalContainer] = useState<HTMLDivElement | null>(
    null
  )
  const setPortalContainerRef = useCallback((node: HTMLDivElement | null) => {
    portalContainerRef.current = node
    if (node) setPortalContainer(node)
  }, [])

  switch (name) {
    case "AccessibleIcon":
      return (
        <AccessibleIcon label="添加">
          <Icon name="plus" />
        </AccessibleIcon>
      )
    case "AlertDialog":
      return (
        <AlertDialog.Root>
          <AlertDialog.Trigger>
            <Button color="red" variant="soft">
              删除项目
            </Button>
          </AlertDialog.Trigger>
          <AlertDialog.Content>
            <AlertDialog.Title>确认删除？</AlertDialog.Title>
            <AlertDialog.Description>此操作无法撤销。</AlertDialog.Description>
            <Flex justify="end" gap="2" mt="4">
              <AlertDialog.Cancel>
                <Button variant="soft">取消</Button>
              </AlertDialog.Cancel>
              <AlertDialog.Action>
                <Button color="red">删除</Button>
              </AlertDialog.Action>
            </Flex>
          </AlertDialog.Content>
        </AlertDialog.Root>
      )
    case "Blockquote":
      return <Blockquote>引用内容支持独立的排版层级。</Blockquote>
    case "Box":
      return (
        <Box p="3" style={{ background: "var(--gray-3)" }}>
          Box layout primitive
        </Box>
      )
    case "Callout":
      return (
        <Flex direction="column" gap="2">
          {(["soft", "surface", "outline"] as const).map((variant) => (
            <Callout.Root key={variant} variant={variant} color="blue" size="2">
              <Callout.Icon>
                <Icon name="alert-circle" />
              </Callout.Icon>
              <Callout.Text>{variant} callout</Callout.Text>
            </Callout.Root>
          ))}
        </Flex>
      )
    case "CheckboxCards":
      return (
        <CheckboxCards.Root defaultValue={["analytics"]}>
          <Flex gap="2" wrap="wrap">
            <CheckboxCards.Item value="analytics">Analytics</CheckboxCards.Item>
            <CheckboxCards.Item value="reports">Reports</CheckboxCards.Item>
          </Flex>
        </CheckboxCards.Root>
      )
    case "CheckboxGroup":
      return (
        <CheckboxGroup.Root defaultValue={["one"]}>
          <Flex direction="column" gap="2">
            <CheckboxGroup.Item value="one">One</CheckboxGroup.Item>
            <CheckboxGroup.Item value="two">Two</CheckboxGroup.Item>
          </Flex>
        </CheckboxGroup.Root>
      )
    case "ContextMenu":
      return (
        <ContextMenu.Root>
          <ContextMenu.Trigger>
            <Card style={{ cursor: "context-menu" }}>右键打开 ContextMenu</Card>
          </ContextMenu.Trigger>
          <ContextMenu.Content>
            <ContextMenu.Item>复制</ContextMenu.Item>
            <ContextMenu.Item>重命名</ContextMenu.Item>
            <ContextMenu.Item color="red">删除</ContextMenu.Item>
          </ContextMenu.Content>
        </ContextMenu.Root>
      )
    case "DataList":
      return (
        <Flex direction="column" gap="3">
          <DataList.Root orientation="horizontal">
            <DataList.Item>
              <DataList.Label>横向</DataList.Label>
              <DataList.Value>value</DataList.Value>
            </DataList.Item>
          </DataList.Root>
          <DataList.Root orientation="vertical">
            <DataList.Item>
              <DataList.Label>纵向</DataList.Label>
              <DataList.Value>value</DataList.Value>
            </DataList.Item>
          </DataList.Root>
        </Flex>
      )
    case "Em":
      return <Em>强调文本</Em>
    case "HoverCard":
      return (
        <HoverCard.Root>
          <HoverCard.Trigger>
            <Link href="#">悬停查看</Link>
          </HoverCard.Trigger>
          <HoverCard.Content>
            <Text>HoverCard 内容</Text>
          </HoverCard.Content>
        </HoverCard.Root>
      )
    case "Inset":
      return (
        <Card>
          <Inset clip="padding-box" side="top">
            <Box height="48px" style={{ background: "var(--accent-4)" }} />
          </Inset>
          <Text as="p" mt="3">
            Inset inside a Card
          </Text>
        </Card>
      )
    case "Portal":
      return (
        <Box
          ref={setPortalContainerRef}
          p="2"
          style={{ border: "1px dashed var(--gray-a7)" }}
        >
          {portalContainer ? (
            <Portal container={portalContainer}>
              <Badge>Portal content</Badge>
            </Portal>
          ) : null}
        </Box>
      )
    case "Quote":
      return <Quote>短引用</Quote>
    case "RadioCards":
      return (
        <RadioCards.Root defaultValue="monthly">
          <Flex gap="2">
            <RadioCards.Item value="monthly">Monthly</RadioCards.Item>
            <RadioCards.Item value="yearly">Yearly</RadioCards.Item>
          </Flex>
        </RadioCards.Root>
      )
    case "Reset":
      return (
        <Reset>
          <Button variant="outline">Reset styles wrapper</Button>
        </Reset>
      )
    case "Section":
      return (
        <Section size="2" p="3" style={{ background: "var(--gray-3)" }}>
          Section content
        </Section>
      )
    case "Slot":
      return (
        <Slot>
          <Button>
            <Icon name="plus" />
            Slot button
          </Button>
        </Slot>
      )
    case "Strong":
      return <Strong>重要文本</Strong>
    case "TabNav":
      return (
        <TabNav.Root>
          <TabNav.Link href="#component-Button" active>
            Button
          </TabNav.Link>
          <TabNav.Link href="#component-Card">Card</TabNav.Link>
        </TabNav.Root>
      )
    case "ThemePanel":
      return (
        <Flex direction="column" gap="2">
          <Button
            style={{ position: "relative", zIndex: 10000 }}
            onClick={() => setThemePanelOpen((open) => !open)}
          >
            {themePanelOpen ? "关闭 ThemePanel" : "打开 ThemePanel"}
          </Button>
          {themePanelOpen ? <ThemePanel defaultOpen /> : null}
        </Flex>
      )
    case "VisuallyHidden":
      return (
        <Flex align="center" gap="2">
          <Button aria-label="隐藏文本示例">
            <VisuallyHidden>屏幕阅读器可见</VisuallyHidden>
            <Icon name="alert-circle" />
          </Button>
          <Text size="1" color="gray">
            VisuallyHidden label
          </Text>
        </Flex>
      )
    default:
      return <Text color="gray">Export demo</Text>
  }
}

function Demo({ name }: { name: string }) {
  const { show } = useToast()
  if (coverage[name] === "missing")
    return <Text color="red">Radix Themes 未提供，未做替代</Text>
  switch (name) {
    case "Typography":
      return <TypographyMatrix />
    case "Button":
      return <ButtonMatrix />
    case "ButtonGroup":
      return (
        <Flex gap="0">
          <Button>上一页</Button>
          <Button variant="soft">当前</Button>
          <Button>下一页</Button>
        </Flex>
      )
    case "IconButton":
      return <ButtonMatrix iconOnly />
    case "Input":
      return <FieldMatrix />
    case "Textarea":
      return <FieldMatrix area />
    case "NumberInput":
      return <TextField.Root type="number" placeholder="0" />
    case "Select":
      return (
        <Flex direction="column" gap="2">
          {(["classic", "surface", "soft"] as const).map((variant) => (
            <Flex key={variant} gap="2" wrap="wrap">
              {(["1", "2", "3"] as const).map((size) => (
                <Select.Root key={size} defaultValue="one">
                  <Select.Trigger
                    variant={variant}
                    placeholder={`size ${size}`}
                  />
                  <Select.Content>
                    <Select.Group>
                      <Select.Label>选项</Select.Label>
                      <Select.Item value="one">选项一</Select.Item>
                      <Select.Item value="two">选项二</Select.Item>
                    </Select.Group>
                  </Select.Content>
                </Select.Root>
              ))}
              <Select.Root defaultValue="one">
                <Select.Trigger variant={variant} placeholder="禁用" disabled />
              </Select.Root>
            </Flex>
          ))}
        </Flex>
      )
    case "MultiSelect":
      return (
        <Popover.Root>
          <Popover.Trigger>
            <Button variant="outline">选择多个</Button>
          </Popover.Trigger>
          <Popover.Content>
            <Flex direction="column" gap="2">
              <Flex gap="2">
                <Checkbox defaultChecked />
                <Text>Web</Text>
              </Flex>
              <Flex gap="2">
                <Checkbox />
                <Text>iOS</Text>
              </Flex>
              <Flex gap="2">
                <Checkbox />
                <Text>API</Text>
              </Flex>
            </Flex>
          </Popover.Content>
        </Popover.Root>
      )
    case "Combobox":
    case "Autocomplete":
      return (
        <Popover.Root>
          <Popover.Trigger>
            <TextField.Root placeholder="搜索并选择" />
          </Popover.Trigger>
          <Popover.Content>
            <Flex direction="column">
              {["林晓", "王子涵", "Alex Chen"].map((item) => (
                <Button key={item} variant="ghost">
                  {item}
                </Button>
              ))}
            </Flex>
          </Popover.Content>
        </Popover.Root>
      )
    case "Checkbox":
      return <ChoiceMatrix />
    case "Radio":
      return (
        <Flex direction="column" gap="2">
          {(["classic", "surface", "soft"] as const).map((variant) => (
            <RadioGroup.Root key={variant} defaultValue="one" variant={variant}>
              <Flex gap="4">
                <RadioGroup.Item value="one">选项一</RadioGroup.Item>
                <RadioGroup.Item value="two">选项二</RadioGroup.Item>
                <RadioGroup.Item value="disabled" disabled>
                  禁用
                </RadioGroup.Item>
              </Flex>
            </RadioGroup.Root>
          ))}
        </Flex>
      )
    case "Switch":
      return (
        <Flex direction="column" gap="2">
          {(["classic", "surface", "soft"] as const).map((variant) => (
            <Flex key={variant} gap="4">
              <Switch variant={variant} size="1" />
              <Switch variant={variant} size="2" defaultChecked />
              <Switch variant={variant} size="3" disabled />
            </Flex>
          ))}
        </Flex>
      )
    case "Slider":
      return (
        <Flex direction="column" gap="3">
          {(["classic", "surface", "soft"] as const).map((variant) => (
            <Flex key={variant} direction="column" gap="2">
              <Text size="1" color="gray">
                {variant}
              </Text>
              <Slider variant={variant} size="1" defaultValue={[40]} />
              <Slider
                variant={variant}
                size="3"
                defaultValue={[20, 80]}
                disabled
              />
            </Flex>
          ))}
        </Flex>
      )
    case "Rating":
      return (
        <Flex>
          {[1, 2, 3, 4, 5].map((item) => (
            <IconButton key={item} variant="ghost">
              <Icon name="star" />
            </IconButton>
          ))}
        </Flex>
      )
    case "DatePicker":
    case "TimePicker":
    case "DateRangePicker":
      return (
        <Flex gap="2" wrap="wrap">
          <TextField.Root
            type="date"
            style={{ flex: "1 1 140px", minWidth: 0 }}
          />
          <TextField.Root
            type="time"
            style={{ flex: "1 1 140px", minWidth: 0 }}
          />
          <TextField.Root
            type="date"
            style={{ flex: "1 1 140px", minWidth: 0 }}
          />
        </Flex>
      )
    case "ColorPicker":
      return <input type="color" defaultValue="#888888" aria-label="颜色" />
    case "Upload":
      return (
        <Box p="5" style={{ border: "1px dashed var(--gray-a7)" }}>
          <Flex direction="column" align="center" gap="2">
            <Icon name="upload" />
            <Text>拖拽或选择文件</Text>
            <Button variant="outline">选择文件</Button>
          </Flex>
        </Box>
      )
    case "PinInput":
      return (
        <Flex gap="2">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <TextField.Root
              key={item}
              maxLength={1}
              style={{ width: "42px" }}
            />
          ))}
        </Flex>
      )
    case "Form":
      return (
        <Flex direction="column" gap="2">
          <TextField.Root placeholder="字段" />
          <Text size="1" color="gray">
            字段帮助文案
          </Text>
          <Button>提交</Button>
        </Flex>
      )
    case "Table":
    case "DataGrid":
      return (
        <Flex direction="column" gap="3">
          {(["surface", "ghost"] as const).map((variant) => (
            <Table.Root key={variant} variant={variant} size="2">
              <Table.Header>
                <Table.Row>
                  <Table.ColumnHeaderCell>名称</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>状态</Table.ColumnHeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                <Table.Row>
                  <Table.Cell>示例数据</Table.Cell>
                  <Table.Cell>
                    <Badge color="green">正常</Badge>
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            </Table.Root>
          ))}
        </Flex>
      )
    case "Descriptions":
      return (
        <DataList.Root>
          <DataList.Item>
            <DataList.Label>名称</DataList.Label>
            <DataList.Value>示例数据</DataList.Value>
          </DataList.Item>
          <DataList.Item>
            <DataList.Label>状态</DataList.Label>
            <DataList.Value>正常</DataList.Value>
          </DataList.Item>
        </DataList.Root>
      )
    case "List":
      return (
        <Flex direction="column" gap="2">
          <Text>列表项目一</Text>
          <Separator />
          <Text>列表项目二</Text>
        </Flex>
      )
    case "Card":
      return (
        <Grid columns={{ initial: "1", md: "3" }} gap="2">
          {(["surface", "classic", "ghost"] as const).map((variant) => (
            <Card key={variant} variant={variant}>
              {[1, 2, 3, 4, 5].map((size) => (
                <Text
                  key={size}
                  size={(["1", "2", "3", "4", "5"] as const)[size - 1]}
                  as="div"
                >
                  {variant} size {size}
                </Text>
              ))}
            </Card>
          ))}
        </Grid>
      )
    case "Avatar":
      return (
        <Flex align="end" gap="2" wrap="wrap">
          {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((size) => (
            <Avatar
              key={size}
              size={size as "1"}
              variant={Number(size) % 2 ? "solid" : "soft"}
              radius={Number(size) % 2 ? "full" : "none"}
              fallback={size === "9" ? "fallback" : "A"}
            />
          ))}
        </Flex>
      )
    case "AvatarGroup":
      return (
        <Flex>
          {["林", "王", "A", "M"].map((item, index) => (
            <Avatar
              key={item}
              fallback={item}
              style={{ marginLeft: index ? -8 : 0 }}
            />
          ))}
        </Flex>
      )
    case "Badge":
      return <BadgeMatrix />
    case "Tag":
      return (
        <Badge variant="outline">
          标签 <Icon name="x" size={12} />
        </Badge>
      )
    case "Statistic":
      return (
        <Card>
          <Text color="gray">本月收入</Text>
          <Heading size="6">¥128,430</Heading>
          <Badge color="green">+12.4%</Badge>
        </Card>
      )
    case "Timeline":
      return (
        <Flex direction="column" gap="3">
          {["创建项目", "完成配置", "发布上线"].map((item) => (
            <Flex key={item} gap="2">
              <Box
                width="8px"
                height="8px"
                style={{ background: "var(--accent-9)", borderRadius: "50%" }}
              />
              <Text>{item}</Text>
            </Flex>
          ))}
        </Flex>
      )
    case "Tree":
      return (
        <Collapsible.Root>
          <Collapsible.Trigger asChild>
            <Button variant="ghost">项目目录</Button>
          </Collapsible.Trigger>
          <Collapsible.Content>
            <Box pl="4">└ 数据看板</Box>
            <Box pl="4">└ 报表</Box>
          </Collapsible.Content>
        </Collapsible.Root>
      )
    case "Calendar":
      return (
        <Grid columns="7" gap="1">
          {Array.from({ length: 30 }, (_, index) => (
            <Button key={index} size="1" variant="ghost">
              {index + 1}
            </Button>
          ))}
        </Grid>
      )
    case "Image":
      return (
        <AspectRatio ratio={16 / 9}>
          <Box height="100%" style={{ background: "var(--gray-3)" }}>
            <Flex align="center" justify="center" height="100%">
              <Text color="gray">图片占位</Text>
            </Flex>
          </Box>
        </AspectRatio>
      )
    case "Carousel":
      return (
        <ScrollArea scrollbars="horizontal">
          <Flex gap="3" width="max-content">
            <Card>第一页</Card>
            <Card>第二页</Card>
            <Card>第三页</Card>
          </Flex>
        </ScrollArea>
      )
    case "Empty":
      return (
        <Flex direction="column" align="center" gap="3" p="5">
          <Icon name="archive" size={32} />
          <Text color="gray">暂无数据</Text>
          <Button variant="outline">清除筛选</Button>
        </Flex>
      )
    case "Tooltip":
      return (
        <Tooltip content="这是提示">
          <Button>悬停查看</Button>
        </Tooltip>
      )
    case "Popover":
      return (
        <Popover.Root>
          <Popover.Trigger>
            <Button>打开 Popover</Button>
          </Popover.Trigger>
          <Popover.Content>Popover 内容</Popover.Content>
        </Popover.Root>
      )
    case "Segmented":
      return (
        <Flex direction="column" gap="2">
          {(["1", "2", "3"] as const).map((size) => (
            <SegmentedControl.Root key={size} size={size} defaultValue="all">
              <SegmentedControl.Item value="all">全部</SegmentedControl.Item>
              <SegmentedControl.Item value="active">
                进行中
              </SegmentedControl.Item>
            </SegmentedControl.Root>
          ))}
        </Flex>
      )
    case "Alert":
      return (
        <Flex direction="column" gap="2">
          {["blue", "green", "amber", "red"].map((color) => (
            <Callout.Root key={color} color={color as "blue"}>
              <Callout.Icon>
                <Icon name="alert-circle" />
              </Callout.Icon>
              <Callout.Text>{color} 提示</Callout.Text>
            </Callout.Root>
          ))}
        </Flex>
      )
    case "Toast":
    case "Notification":
      return <Button onClick={() => show("操作成功")}>显示通知</Button>
    case "Dialog":
      return (
        <Dialog.Root>
          <Dialog.Trigger>
            <Button>打开 Dialog</Button>
          </Dialog.Trigger>
          <Dialog.Content>
            <Dialog.Title>普通对话框</Dialog.Title>
            <Dialog.Description>这是一个可关闭的对话框。</Dialog.Description>
            <Button mt="4">确认</Button>
          </Dialog.Content>
        </Dialog.Root>
      )
    case "FloatButton":
      return (
        <Box
          position="relative"
          height="96px"
          style={{ border: "1px dashed var(--gray-a7)" }}
        >
          <IconButton
            variant="solid"
            style={{ position: "absolute", right: "12px", bottom: "12px" }}
          >
            <Icon name="plus" />
          </IconButton>
          <Text size="1" color="gray">
            relative demo box · fixed-style action
          </Text>
        </Box>
      )
    case "Drawer":
      return (
        <Dialog.Root>
          <Dialog.Trigger>
            <Button>打开抽屉</Button>
          </Dialog.Trigger>
          <Dialog.Content
            style={{
              position: "fixed",
              inset: "0 0 0 auto",
              width: "320px",
              transform: "none",
            }}
          >
            <Dialog.Title>右侧抽屉</Dialog.Title>
            <Text>抽屉内容</Text>
          </Dialog.Content>
        </Dialog.Root>
      )
    case "Progress":
      return (
        <Flex direction="column" gap="3">
          {(["classic", "surface", "soft"] as const).map((variant) => (
            <Flex key={variant} direction="column" gap="2">
              <Progress variant={variant} size="1" value={25} />
              <Progress variant={variant} size="3" value={65} />
              <Progress variant={variant} size="2" />
            </Flex>
          ))}
        </Flex>
      )
    case "Skeleton":
      return (
        <Flex direction="column" gap="2">
          <Skeleton loading>
            <Text>加载中的文字</Text>
          </Skeleton>
          <Skeleton loading>
            <Box height="40px" />
          </Skeleton>
          <Skeleton loading={false}>
            <Text>已加载文字</Text>
          </Skeleton>
          <Skeleton loading>
            <Text as="span">inline</Text>
          </Skeleton>
        </Flex>
      )
    case "Spinner":
      return (
        <Flex align="center" gap="3">
          <Spinner loading />
          <Button loading>加载中</Button>
        </Flex>
      )
    case "Result":
      return (
        <Callout.Root color="green">
          <Callout.Icon>
            <Icon name="check" />
          </Callout.Icon>
          <Callout.Text>操作成功</Callout.Text>
        </Callout.Root>
      )
    case "Popconfirm":
      return (
        <Popover.Root>
          <Popover.Trigger>
            <Button color="red">删除</Button>
          </Popover.Trigger>
          <Popover.Content>
            <Text>确认删除？</Text>
            <Flex gap="2" mt="3">
              <Button size="1">确认</Button>
              <Button size="1" variant="soft">
                取消
              </Button>
            </Flex>
          </Popover.Content>
        </Popover.Root>
      )
    case "Menu":
      return (
        <Flex gap="2">
          <Button variant="ghost">仪表盘</Button>
          <Button variant="ghost">订单</Button>
          <Button variant="ghost">设置</Button>
        </Flex>
      )
    case "Dropdown":
      return (
        <DropdownMenu.Root>
          <DropdownMenu.Trigger>
            <Button>打开菜单</Button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content>
            <DropdownMenu.Item>编辑</DropdownMenu.Item>
            <DropdownMenu.Item>复制</DropdownMenu.Item>
            <DropdownMenu.Item color="red">删除</DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      )
    case "Breadcrumb":
      return (
        <Flex gap="2">
          <Link href="#">Acme Console</Link>
          <Icon name="chevron-right" />
          <Text color="gray">组件全集</Text>
        </Flex>
      )
    case "Tabs":
      return (
        <Flex direction="column" gap="3">
          {(["1", "2"] as const).map((size) => (
            <Tabs.Root key={size} defaultValue="one">
              <Tabs.List>
                <Tabs.Trigger value="one">
                  <Text size={size}>选项一</Text>
                </Tabs.Trigger>
                <Tabs.Trigger value="two">
                  <Text size={size}>选项二</Text>
                </Tabs.Trigger>
              </Tabs.List>
              <Tabs.Content value="one">
                <Text>内容一</Text>
              </Tabs.Content>
            </Tabs.Root>
          ))}
        </Flex>
      )
    case "Pagination":
      return (
        <Flex direction="column" gap="4">
          {(["1", "2", "3"] as const).map((size) => (
            <Flex key={size} gap="1" align="center" wrap="wrap">
              <IconButton size={size} variant="ghost" aria-label="上一页">
                <Icon name="chevron-left" />
              </IconButton>
              {[1, 2, 3].map((page) => (
                <Button
                  key={page}
                  size={size}
                  variant={page === 2 ? "solid" : "ghost"}
                  aria-current={page === 2 ? "page" : undefined}
                >
                  {page}
                </Button>
              ))}
              <Text size="2" color="gray">
                …
              </Text>
              <Button size={size} variant="ghost">
                12
              </Button>
              <IconButton size={size} variant="ghost" aria-label="下一页">
                <Icon name="chevron-right" />
              </IconButton>
              <Button size={size} variant="ghost" disabled>
                禁用
              </Button>
            </Flex>
          ))}
          <Flex align="center" gap="2" wrap="wrap">
            <Text size="2" color="gray">
              共 120 条
            </Text>
            <Select.Root size="2" defaultValue="10">
              <Select.Trigger />
              <Select.Content>
                <Select.Item value="10">10 / 页</Select.Item>
                <Select.Item value="20">20 / 页</Select.Item>
              </Select.Content>
            </Select.Root>
          </Flex>
        </Flex>
      )
    case "Steps":
      return (
        <Flex direction="column" gap="4">
          <Flex align="center" gap="2">
            {["基本信息", "配置", "确认"].map((label, index) => (
              <Flex key={label} align="center" gap="2" flexGrow="1">
                <Badge
                  size="3"
                  radius="full"
                  color={index < 1 ? "green" : index === 1 ? "indigo" : "gray"}
                  variant={index === 1 ? "solid" : "soft"}
                >
                  {index < 1 ? <Icon name="check" size={14} /> : index + 1}
                </Badge>
                <Text size="2" weight={index === 1 ? "bold" : "regular"}>
                  {label}
                </Text>
                {index < 2 ? (
                  <Separator size="4" style={{ flexGrow: 1 }} />
                ) : null}
              </Flex>
            ))}
          </Flex>
          <Flex direction="column" gap="2">
            {["已完成", "进行中", "出错", "等待"].map((label, index) => (
              <Flex key={label} align="center" gap="2">
                <Badge
                  size="2"
                  radius="full"
                  color={
                    index === 0
                      ? "green"
                      : index === 1
                        ? "indigo"
                        : index === 2
                          ? "red"
                          : "gray"
                  }
                  variant={index === 1 ? "solid" : "soft"}
                >
                  {index + 1}
                </Badge>
                <Text size="2" color={index === 3 ? "gray" : undefined}>
                  {label}
                </Text>
              </Flex>
            ))}
          </Flex>
        </Flex>
      )
    case "Anchor":
      return (
        <Flex direction="column" gap="1">
          <Link href="#component-Button">Button</Link>
          <Link href="#component-Card">Card</Link>
        </Flex>
      )
    case "BackTop":
      return (
        <IconButton
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          <Icon name="arrow-up" />
        </IconButton>
      )
    case "Navbar":
      return (
        <Flex direction="column" gap="3">
          <Flex
            align="center"
            justify="between"
            gap="3"
            p="2"
            style={{
              border: "1px solid var(--gray-a5)",
              borderRadius: "var(--radius-3)",
            }}
          >
            <Text weight="bold">Acme Console</Text>
            <Flex gap="1" display={{ initial: "none", sm: "flex" }}>
              <Button size="2" variant="soft">
                首页
              </Button>
              <Button size="2" variant="ghost">
                订单
              </Button>
              <Button size="2" variant="ghost">
                设置
              </Button>
            </Flex>
            <Flex gap="1" align="center">
              <IconButton size="2" variant="ghost" aria-label="搜索">
                <Icon name="search" />
              </IconButton>
              <IconButton size="2" variant="ghost" aria-label="通知">
                <Icon name="bell" />
              </IconButton>
              <Avatar size="1" fallback="林" />
            </Flex>
          </Flex>
          <Flex
            align="center"
            justify="between"
            p="2"
            style={{
              background: "var(--accent-9)",
              color: "white",
              borderRadius: "var(--radius-3)",
            }}
          >
            <Text weight="bold">Solid Navbar</Text>
            <IconButton size="2" variant="ghost" highContrast aria-label="菜单">
              <Icon name="menu" />
            </IconButton>
          </Flex>
        </Flex>
      )
    case "Sidebar":
      return (
        <Flex gap="3">
          <Flex
            direction="column"
            gap="1"
            p="2"
            width="160px"
            style={{
              border: "1px solid var(--gray-a5)",
              borderRadius: "var(--radius-3)",
            }}
          >
            {nav.slice(0, 5).map((item, index) => (
              <Button
                key={item.key}
                size="2"
                variant={index === 0 ? "soft" : "ghost"}
                style={{ justifyContent: "flex-start" }}
              >
                <Icon name={item.icon} size={16} />
                {item.label}
                {item.badge ? (
                  <Badge size="1" ml="auto">
                    {item.badge}
                  </Badge>
                ) : null}
              </Button>
            ))}
          </Flex>
          <Flex
            direction="column"
            gap="1"
            p="2"
            style={{
              border: "1px solid var(--gray-a5)",
              borderRadius: "var(--radius-3)",
            }}
          >
            {nav.slice(0, 5).map((item, index) => (
              <IconButton
                key={item.key}
                size="2"
                variant={index === 0 ? "soft" : "ghost"}
                aria-label={item.label}
              >
                <Icon name={item.icon} size={16} />
              </IconButton>
            ))}
          </Flex>
        </Flex>
      )
    case "CommandPalette":
      return (
        <Dialog.Root>
          <Dialog.Trigger>
            <Button>
              <Kbd>⌘ K</Kbd> 打开命令
            </Button>
          </Dialog.Trigger>
          <Dialog.Content>
            <Dialog.Title>命令面板</Dialog.Title>
            <TextField.Root placeholder="搜索命令..." mt="3" />
            <Text as="p" mt="3">
              搜索结果
            </Text>
          </Dialog.Content>
        </Dialog.Root>
      )
    case "Grid":
      return (
        <Grid columns={{ initial: "1", md: "3" }} gap="2">
          <Card>1</Card>
          <Card>2</Card>
          <Card>3</Card>
        </Grid>
      )
    case "Stack":
      return (
        <Flex direction="column" gap="2">
          <Button>第一项</Button>
          <Button>第二项</Button>
        </Flex>
      )
    case "Layout":
      return (
        <Flex direction="column" gap="2">
          <Box p="3" style={{ background: "var(--gray-3)" }}>
            Header
          </Box>
          <Flex>
            <Box p="3" width="25%" style={{ background: "var(--gray-4)" }}>
              Aside
            </Box>
            <Box p="3">Content</Box>
          </Flex>
        </Flex>
      )
    case "Container":
      return (
        <Container>
          <Card>Container content</Card>
        </Container>
      )
    case "AspectRatio":
      return (
        <AspectRatio ratio={16 / 9}>
          <Box height="100%" style={{ background: "var(--gray-3)" }} />
        </AspectRatio>
      )
    case "ScrollArea":
      return (
        <ScrollArea scrollbars="vertical" style={{ height: "100px" }}>
          <Box height="240px" p="3">
            可滚动内容
          </Box>
        </ScrollArea>
      )
    case "Accordion":
      return (
        <Accordion.Root type="single" collapsible>
          <Accordion.Item value="one">
            <Accordion.Header>
              <Accordion.Trigger asChild>
                <Button variant="ghost">展开内容</Button>
              </Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Content>
              <Box p="3">Accordion 内容</Box>
            </Accordion.Content>
          </Accordion.Item>
        </Accordion.Root>
      )
    case "ThemeProvider":
      return (
        <Theme accentColor="crimson" appearance="dark" radius="full">
          <Card>
            <Text>嵌套 Theme 会改变颜色与圆角</Text>
          </Card>
        </Theme>
      )
    case "Kbd":
      return (
        <Flex gap="2" wrap="wrap">
          {(["1", "2", "3", "4", "5", "6", "7", "8", "9"] as const).map(
            (size, index) => (
              <Kbd key={size} size={size}>
                K{index + 1}
              </Kbd>
            )
          )}
        </Flex>
      )
    case "Code":
      return (
        <Flex gap="2" wrap="wrap">
          {(["solid", "soft", "outline", "ghost"] as const).map((variant) => (
            <Code key={variant} variant={variant}>
              {variant}
            </Code>
          ))}
          {(["1", "2", "3"] as const).map((size) => (
            <Code key={size} size={size}>
              size {size}
            </Code>
          ))}
        </Flex>
      )
    case "Divider":
      return (
        <Flex direction="column" gap="3">
          <Separator size="4" />
          <Separator size="4" orientation="vertical" />
        </Flex>
      )
    case "Link":
      return (
        <Flex direction="column" gap="2">
          <Link href="#" size="1">
            小链接
          </Link>
          <Link href="#" size="3" weight="bold">
            粗链接
          </Link>
          <Link href="#" underline="always">
            下划线
          </Link>
        </Flex>
      )
    default:
      return <Text color="gray">Radix Themes 组合示例</Text>
  }
}

export function ComponentsPage() {
  const names = Object.keys(coverage)
  return (
    <Box>
      <PageHeader
        title="组件全集"
        description="Radix Themes 3.3.0 组件、组合模式与状态展示。"
      />
      <Flex wrap="wrap" gap="2" mb="6">
        {[...names, ...exportsList].map((name) => (
          <Link key={name} href={`#component-${name}`}>
            <Badge variant="soft">{name}</Badge>
          </Link>
        ))}
      </Flex>
      <Grid columns={{ initial: "1", md: "2" }} gap="4">
        {names.map((name) => (
          <Card
            key={name}
            id={`component-${name}`}
            style={{ scrollMarginTop: "24px", minWidth: 0 }}
          >
            <Flex justify="between" align="center" mb="4">
              <Heading size="4">{name}</Heading>
              <Badge color={statusColor(coverage[name])}>
                {coverage[name]}
              </Badge>
            </Flex>
            <Demo name={name} />
          </Card>
        ))}
      </Grid>
      <Heading size="7" mt="8" mb="4">
        Radix Themes 全部导出
      </Heading>
      <Grid columns={{ initial: "1", md: "2" }} gap="4">
        {exportsList.map((name) => (
          <Card
            key={name}
            id={`component-${name}`}
            style={{ scrollMarginTop: "24px", minWidth: 0 }}
          >
            <Heading size="3" mb="3">
              {name}
            </Heading>
            <ExportDemo name={name} />
          </Card>
        ))}
      </Grid>
    </Box>
  )
}
