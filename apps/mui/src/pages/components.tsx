import { useState } from "react"
import dayjs from "dayjs"
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar"
import { DatePicker } from "@mui/x-date-pickers/DatePicker"
import { TimePicker } from "@mui/x-date-pickers/TimePicker"
import { DataGrid } from "@mui/x-data-grid"
import { SimpleTreeView, TreeItem } from "@mui/x-tree-view"
import { createTheme, ThemeProvider, useTheme } from "@mui/material/styles"
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  AlertTitle,
  AppBar,
  Autocomplete,
  Avatar,
  AvatarGroup,
  Badge,
  Box,
  Breadcrumbs,
  Button,
  ButtonGroup,
  Card,
  CardContent,
  CardHeader,
  CardMedia,
  Checkbox,
  Chip,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Drawer,
  Fab,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  FormLabel,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  LinearProgress,
  Link as MuiLink,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  MenuList,
  MobileStepper,
  Pagination,
  Paper,
  Popover,
  Radio,
  RadioGroup,
  Rating,
  Select,
  Skeleton,
  Slider,
  Snackbar,
  SpeedDial,
  SpeedDialAction,
  Step,
  StepContent,
  StepLabel,
  Stepper,
  Switch,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Toolbar,
  Tooltip,
  Typography,
  useMediaQuery,
} from "@mui/material"
import contract from "@ui-gallery/spec/contract.json"
import activity from "@ui-gallery/spec/mock/activity.json"
import nav from "@ui-gallery/spec/mock/nav.json"
import orders from "@ui-gallery/spec/mock/orders.json"
import plans from "@ui-gallery/spec/mock/plans.json"
import stats from "@ui-gallery/spec/mock/stats.json"
import team from "@ui-gallery/spec/mock/team.json"
import { Icon } from "@/components/icon"
import { FlexStack as Stack } from "@/components/flex-stack"
import { coverage } from "@/coverage"
import { PageHeader } from "./shared"

const descriptions: Record<string, string> = {
  Typography: "标题、正文与辅助文本层级。",
  Button: "文字、描边、填充、颜色、尺寸、禁用与加载。",
  ButtonGroup: "相邻操作按钮组合。",
  IconButton: "图标操作按钮与禁用状态。",
  Input: "标准、错误与禁用输入状态。",
  Textarea: "多行文本与辅助说明。",
  NumberInput: "带增减操作的数字输入。",
  Select: "标准、填充、描边、尺寸、禁用与错误。",
  MultiSelect: "多选下拉与 Chip 值展示。",
  Combobox: "Autocomplete freeSolo 组合框。",
  Autocomplete: "Autocomplete 选项、禁用与小尺寸。",
  Checkbox: "尺寸、颜色、禁用、不确定与错误。",
  Radio: "RadioGroup 尺寸、颜色与禁用。",
  Switch: "开关尺寸、颜色与禁用。",
  Slider: "默认、范围、刻度、禁用与颜色。",
  Rating: "评分尺寸、半星、只读与禁用。",
  DatePicker: "日期选择器尺寸与禁用。",
  TimePicker: "时间选择器的真实 MUI X 实现。",
  Upload: "文件选择、已选文件与上传进度。",
  Transfer: "带复选框和箭头操作的双列表转移。",
  Form: "表单标签、必填、分组与错误提示。",
  Table: "MUI Table 表头、黏性表头、尺寸与空状态。",
  DataGrid: "复选框选择、分页与加载状态。",
  Descriptions: "标签和值的描述信息布局。",
  List: "团队成员列表与角色信息。",
  Card: "CardHeader 与 CardContent。",
  Avatar: "头像尺寸、形状、图标与徽标。",
  AvatarGroup: "团队头像分组与最大显示数。",
  Badge: "标准、点状、颜色、最大值与锚点。",
  Tag: "Chip 颜色、尺寸、头像、图标和操作状态。",
  Statistic: "来自统计 mock 的指标与趋势。",
  Timeline: "来自 activity mock 的团队活动时间线。",
  Tree: "可勾选、默认展开的树形结构。",
  Calendar: "DateCalendar 日期日历与只读变体。",
  Image: "中性占位图、点击预览与加载占位。",
  Carousel: "MobileStepper 点状和进度轮播。",
  Empty: "空状态图标、说明和操作。",
  Tooltip: "四个方向与箭头提示。",
  Popover: "锚点弹出内容。",
  Segmented: "ToggleButtonGroup 分段选择。",
  Alert: "严重级别、变体、标题、操作与关闭。",
  Toast: "四级 Snackbar 消息与带撤销操作。",
  Notification: "四级填充 Alert、查看/关闭操作与顶部锚点的 Snackbar。",
  DateRangePicker: "两个社区版 DatePicker 组合的日期范围（互相限制 min/max）。",
  ColorPicker: "原生 color 输入 + HEX 文本 + 主题色板组合。",
  Dialog: "标题、内容、操作、全宽与移动全屏。",
  Drawer: "四个方向的临时抽屉。",
  Progress: "线性和圆形进度的多种状态。",
  Skeleton: "文本、圆形、矩形、圆角与动画。",
  Spinner: "CircularProgress 尺寸、颜色和粗细。",
  Result: "成功结果图标、说明与双操作。",
  Popconfirm: "Popover 内的确认和取消操作。",
  Menu: "水平/垂直/内嵌/折叠 MenuList 与弹出 Menu。",
  Dropdown: "带下拉箭头的按钮菜单。",
  Breadcrumb: "Breadcrumbs 链接和分隔图标。",
  Tabs: "标准、滚动、铺满、图标与禁用标签。",
  Pagination: "尺寸、形状、颜色、首尾页和禁用。",
  Steps: "水平和垂直 Stepper 以及错误步骤。",
  Anchor: "页面内锚点链接列表。",
  BackTop: "返回页面顶部操作。",
  Affix: "sticky 定位的固定工具条。",
  Navbar: "静态 AppBar、Toolbar 与导航操作。",
  Sidebar: "内嵌永久 Drawer 与导航项。",
  CommandPalette: "Dialog 中的 Autocomplete 命令搜索。",
  Grid: "响应式 Grid 容器与 size。",
  Stack: "行列方向、间距与 divider。",
  Layout: "AppBar、Drawer 与主内容布局组合。",
  Container: "sm、md、lg 容器宽度。",
  AspectRatio: "16:9 宽高比内容。",
  ScrollArea: "带滚动条的内容区域。",
  Accordion: "可控展开、禁用项和无间距变体。",
  ThemeProvider: "嵌套相反模式的局部主题。",
  FloatButton: "Fab 尺寸、颜色、扩展和 SpeedDial。",
  Kbd: "键盘快捷键语义元素。",
  Code: "行内代码和 pre 代码块。",
  Divider: "水平、垂直和带文字分隔线。",
  Link: "underline 变体与颜色。",
}

const missingReasons: Record<string, string> = {
  Cascader: "MUI Material 未提供，需第三方或自研",
  Mention: "MUI Material 未提供，需第三方或自研",
  PinInput: "MUI Material 未提供，需第三方或自研",
  QRCode: "MUI Material 未提供，需第三方或自研",
  Resizable: "MUI Material 未提供，需第三方或自研",
  Watermark: "MUI Material 未提供，需第三方或自研",
  Tour: "MUI Material 未提供，需第三方或自研",
}

function Missing({ name }: { name: string }) {
  return (
    <Typography color="text.secondary">
      {missingReasons[name] ?? "MUI Material 无对应组件，需第三方或自研。"}
    </Typography>
  )
}

function NumberInputDemo() {
  const [value, setValue] = useState(12)
  return (
    <TextField
      type="number"
      label="数量"
      value={value}
      onChange={(event) => setValue(Number(event.target.value))}
      error={value < 1}
      helperText={value < 1 ? "至少为 1" : "可使用加减按钮"}
      slotProps={{
        input: {
          startAdornment: (
            <InputAdornment position="start">
              <IconButton
                size="small"
                disabled={value <= 1}
                onClick={() => setValue((current) => current - 1)}
              >
                <Icon name="minus" size={16} />
              </IconButton>
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                size="small"
                onClick={() => setValue((current) => current + 1)}
              >
                <Icon name="plus" size={16} />
              </IconButton>
            </InputAdornment>
          ),
        },
      }}
    />
  )
}

function SelectDemo({ multiple = false }: { multiple?: boolean }) {
  const [value, setValue] = useState<string | string[]>(
    multiple ? ["one"] : "one"
  )
  return (
    <Stack spacing={1}>
      {(["standard", "filled", "outlined"] as const).map((variant) => (
        <FormControl
          key={variant}
          fullWidth
          size="small"
          variant={variant}
          error={variant === "outlined"}
        >
          <InputLabel>
            {multiple ? "多选" : "选择"} · {variant}
          </InputLabel>
          <Select
            multiple={multiple}
            value={value}
            label={
              variant === "outlined"
                ? `${multiple ? "多选" : "选择"} · ${variant}`
                : undefined
            }
            onChange={(event) =>
              setValue(event.target.value as string[] & string)
            }
            renderValue={
              multiple
                ? (selected) => (
                    <Stack direction="row" gap={0.5} flexWrap="wrap">
                      {(selected as string[]).map((item) => (
                        <Chip
                          key={item}
                          size="small"
                          label={item === "one" ? "选项一" : "选项二"}
                        />
                      ))}
                    </Stack>
                  )
                : undefined
            }
          >
            <MenuItem value="one">选项一</MenuItem>
            <MenuItem value="two">选项二</MenuItem>
          </Select>
          {variant === "outlined" && (
            <FormHelperText>请选择有效值</FormHelperText>
          )}
        </FormControl>
      ))}
      <FormControl fullWidth size="small" disabled>
        <InputLabel>禁用选择</InputLabel>
        <Select value={multiple ? ["one"] : "one"} label="禁用选择">
          <MenuItem value="one">选项一</MenuItem>
        </Select>
      </FormControl>
    </Stack>
  )
}

function AutocompleteDemo({ freeSolo = false }: { freeSolo?: boolean }) {
  const options = team.map((member) => member.name)
  return (
    <Stack spacing={1}>
      <Autocomplete
        freeSolo={freeSolo}
        options={options}
        size="small"
        renderInput={(params) => (
          <TextField
            {...params}
            label={freeSolo ? "Combobox" : "Autocomplete"}
          />
        )}
      />
      <Autocomplete
        disabled
        options={options}
        size="small"
        renderInput={(params) => <TextField {...params} label="禁用 · small" />}
      />
    </Stack>
  )
}

function ChoiceDemo({ kind }: { kind: "checkbox" | "radio" | "switch" }) {
  const Control =
    kind === "checkbox" ? Checkbox : kind === "radio" ? Radio : Switch
  return (
    <FormControl error>
      <FormLabel>
        {kind === "checkbox"
          ? "Checkbox"
          : kind === "radio"
            ? "RadioGroup"
            : "Switch"}
      </FormLabel>
      <FormGroup row>
        {(["small", "medium"] as const).map((size) => (
          <FormControlLabel
            key={size}
            label={size}
            control={
              <Control
                size={size}
                color="primary"
                defaultChecked={size === "medium"}
              />
            }
          />
        ))}
        {kind === "checkbox" && (
          <FormControlLabel
            label="indeterminate"
            control={<Checkbox indeterminate color="secondary" />}
          />
        )}
        <FormControlLabel label="禁用" control={<Control disabled />} />
      </FormGroup>
      <FormHelperText>请选择至少一项</FormHelperText>
    </FormControl>
  )
}

function TableDemo() {
  const [size, setSize] = useState<"small" | "medium">("small")
  const [empty, setEmpty] = useState(false)
  return (
    <Stack spacing={1}>
      <ToggleButtonGroup
        size="small"
        exclusive
        value={size}
        onChange={(_, value: "small" | "medium" | null) =>
          value && setSize(value)
        }
      >
        <ToggleButton value="small">small</ToggleButton>
        <ToggleButton value="medium">medium</ToggleButton>
      </ToggleButtonGroup>
      <Button size="small" onClick={() => setEmpty((value) => !value)}>
        {empty ? "显示数据" : "显示空状态"}
      </Button>
      <TableContainer sx={{ maxHeight: 260, overflowX: "auto" }}>
        <Table stickyHeader size={size}>
          <TableHead>
            <TableRow>
              <TableCell>订单号</TableCell>
              <TableCell>客户</TableCell>
              <TableCell>状态</TableCell>
              <TableCell align="right">金额</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {empty ? (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  暂无数据
                </TableCell>
              </TableRow>
            ) : (
              orders.slice(0, 5).map((order) => (
                <TableRow hover key={order.id}>
                  <TableCell>{order.id}</TableCell>
                  <TableCell>{order.customer}</TableCell>
                  <TableCell>
                    <Chip size="small" label={order.status} />
                  </TableCell>
                  <TableCell align="right">{order.amount.toFixed(2)}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Stack>
  )
}

function DataGridDemo() {
  const [loading, setLoading] = useState(false)
  return (
    <Stack spacing={1}>
      <FormControlLabel
        control={
          <Switch
            checked={loading}
            onChange={(event) => setLoading(event.target.checked)}
          />
        }
        label="loading"
      />
      <Box sx={{ height: 300, minWidth: 0, width: "100%", overflowX: "auto" }}>
        <DataGrid
          rows={orders.slice(0, 12)}
          columns={[
            { field: "id", headerName: "订单", width: 130 },
            { field: "customer", headerName: "客户", width: 120 },
            { field: "status", headerName: "状态", width: 110 },
          ]}
          getRowId={(row) => row.id}
          checkboxSelection
          loading={loading}
          pagination
          pageSizeOptions={[5]}
          initialState={{
            pagination: { paginationModel: { pageSize: 5, page: 0 } },
          }}
        />
      </Box>
    </Stack>
  )
}

function AvatarDemo() {
  return (
    <Stack spacing={1}>
      <Stack direction="row" gap={1} flexWrap="wrap">
        {(["circular", "rounded", "square"] as const).map((variant) => (
          <Avatar
            key={variant}
            variant={variant}
            sx={{ width: 32, height: 32 }}
          >
            {variant[0].toUpperCase()}
          </Avatar>
        ))}
        <Avatar sx={{ width: 24, height: 24 }}>
          <Icon name="user" size={15} />
        </Avatar>
        <Badge variant="dot" color="error" overlap="circular">
          <Avatar sx={{ width: 32, height: 32 }}>A</Avatar>
        </Badge>
      </Stack>
      <Stack direction="row" gap={1} alignItems="center">
        <Avatar sx={{ width: 24, height: 24 }}>S</Avatar>
        <Avatar sx={{ width: 40, height: 40 }}>M</Avatar>
        <Avatar sx={{ width: 56, height: 56 }}>L</Avatar>
      </Stack>
    </Stack>
  )
}

function BadgeDemo() {
  return (
    <Stack direction="row" gap={3} alignItems="center" flexWrap="wrap">
      <Badge badgeContent={120} max={99} color="primary">
        <Icon name="bell" />
      </Badge>
      <Badge variant="dot" color="error">
        <Icon name="mail" />
      </Badge>
      <Badge badgeContent={4} color="success" invisible>
        <Icon name="info" />
      </Badge>
      <Badge
        badgeContent={2}
        color="warning"
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Icon name="settings" />
      </Badge>
    </Stack>
  )
}

function TagDemo() {
  return (
    <Stack direction="row" gap={1} flexWrap="wrap">
      {(
        ["primary", "secondary", "success", "error", "warning", "info"] as const
      ).map((color) => (
        <Chip key={color} color={color} label={color} size="small" />
      ))}
      <Chip label="outlined" variant="outlined" />
      <Chip label="clickable" clickable onClick={() => undefined} />
      <Chip label="deletable" onDelete={() => undefined} />
      <Chip avatar={<Avatar>A</Avatar>} label="avatar" />
      <Chip icon={<Icon name="star" size={16} />} label="icon" />
      <Chip disabled label="disabled" />
    </Stack>
  )
}

function TimelineDemo() {
  return (
    <Stack spacing={0}>
      {activity.slice(0, 4).map((item, index) => (
        <Stack direction="row" spacing={1} key={`${item.user}-${item.time}`}>
          <Stack alignItems="center">
            <Avatar sx={{ width: 28, height: 28 }}>
              {item.user.slice(0, 1)}
            </Avatar>
            {index < 3 && <Divider orientation="vertical" flexItem />}
          </Stack>
          <Box sx={{ pb: 1.5, minWidth: 0 }}>
            <Typography variant="body2">
              {item.user} {item.action}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {item.time}
            </Typography>
          </Box>
        </Stack>
      ))}
    </Stack>
  )
}

function TransferDemo() {
  const labels = ["选项一", "选项二", "选项三", "选项四"]
  const [left, setLeft] = useState(labels)
  const [right, setRight] = useState<string[]>([])
  const [selected, setSelected] = useState<string[]>([])
  const move = (direction: "right" | "left") => {
    if (direction === "right") {
      setLeft((items) => items.filter((item) => !selected.includes(item)))
      setRight((items) => [
        ...items,
        ...selected.filter((item) => !items.includes(item)),
      ])
    } else {
      setRight((items) => items.filter((item) => !selected.includes(item)))
      setLeft((items) => [
        ...items,
        ...selected.filter((item) => !items.includes(item)),
      ])
    }
    setSelected([])
  }
  const list = (items: string[]) => (
    <Paper variant="outlined" sx={{ minWidth: 115, p: 0.5 }}>
      {items.map((item) => (
        <FormControlLabel
          key={item}
          control={
            <Checkbox
              size="small"
              checked={selected.includes(item)}
              onChange={() =>
                setSelected((current) =>
                  current.includes(item)
                    ? current.filter((value) => value !== item)
                    : [...current, item]
                )
              }
            />
          }
          label={item}
        />
      ))}
    </Paper>
  )
  return (
    <Stack
      direction={{ xs: "column", sm: "row" }}
      alignItems="center"
      spacing={1}
    >
      <Box>{list(left)}</Box>
      <ButtonGroup orientation="vertical">
        <Button size="small" onClick={() => move("right")}>
          <Icon name="arrow-right" />
        </Button>
        <Button size="small" onClick={() => move("left")}>
          <Icon name="arrow-left" />
        </Button>
      </ButtonGroup>
      <Box>{list(right)}</Box>
    </Stack>
  )
}

function UploadDemo() {
  const [files, setFiles] = useState<string[]>([])
  return (
    <Stack spacing={1}>
      <Button
        component="label"
        variant="outlined"
        startIcon={<Icon name="upload" />}
      >
        选择文件
        <input
          hidden
          type="file"
          multiple
          onChange={(event) =>
            setFiles(
              Array.from(event.target.files ?? []).map((file) => file.name)
            )
          }
        />
      </Button>
      {files.map((file) => (
        <Box key={file}>
          <Typography variant="body2">{file}</Typography>
          <LinearProgress variant="determinate" value={65} />
        </Box>
      ))}
    </Stack>
  )
}

function CarouselDemo() {
  const [active, setActive] = useState(0)
  return (
    <Stack spacing={1}>
      <Card variant="outlined">
        <CardContent>
          <Typography variant="h6">{plans[active].name}</Typography>
          <Typography color="text.secondary">
            {plans[active].features.join(" · ")}
          </Typography>
        </CardContent>
      </Card>
      <MobileStepper
        variant="dots"
        steps={plans.length}
        position="static"
        activeStep={active}
        nextButton={
          <Button
            size="small"
            onClick={() =>
              setActive((value) => Math.min(value + 1, plans.length - 1))
            }
            disabled={active === plans.length - 1}
          >
            下一张
          </Button>
        }
        backButton={
          <Button
            size="small"
            onClick={() => setActive((value) => Math.max(value - 1, 0))}
            disabled={active === 0}
          >
            上一张
          </Button>
        }
      />
    </Stack>
  )
}

const PLACEHOLDER_IMAGE =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="320" height="120" viewBox="0 0 320 120"><rect width="320" height="120" fill="#e0e0e0"/><circle cx="70" cy="46" r="16" fill="#bdbdbd"/><path d="M20 100 L110 50 L170 90 L220 60 L300 100 Z" fill="#bdbdbd"/></svg>'
  )

function ImageDemo() {
  const [loaded, setLoaded] = useState(true)
  const [preview, setPreview] = useState(false)
  return (
    <Stack spacing={1}>
      {loaded ? (
        <CardMedia
          component="img"
          image={PLACEHOLDER_IMAGE}
          alt="占位图"
          onError={() => setLoaded(false)}
          onClick={() => setPreview(true)}
          sx={{
            maxHeight: 120,
            objectFit: "cover",
            borderRadius: 1,
            cursor: "zoom-in",
          }}
        />
      ) : (
        <Skeleton variant="rectangular" height={120} />
      )}
      <Button size="small" onClick={() => setPreview(true)}>
        预览
      </Button>
      <Dialog open={preview} onClose={() => setPreview(false)} maxWidth="md">
        <DialogTitle>图片预览</DialogTitle>
        <DialogContent>
          <Box
            component="img"
            src={PLACEHOLDER_IMAGE}
            alt="占位图预览"
            sx={{ width: "100%", display: "block" }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPreview(false)}>关闭</Button>
        </DialogActions>
      </Dialog>
    </Stack>
  )
}

function DateRangePickerDemo() {
  const [start, setStart] = useState(dayjs().subtract(7, "day"))
  const [end, setEnd] = useState(dayjs())
  return (
    <Stack spacing={1}>
      <Stack direction={{ xs: "column", sm: "row" }} gap={1}>
        <DatePicker
          label="开始"
          value={start}
          maxDate={end}
          onChange={(value) => value && setStart(value)}
          slotProps={{
            textField: { size: "small" },
            openPickerButton: { sx: { width: 40, height: 40 } },
          }}
        />
        <DatePicker
          label="结束"
          value={end}
          minDate={start}
          onChange={(value) => value && setEnd(value)}
          slotProps={{
            textField: { size: "small" },
            openPickerButton: { sx: { width: 40, height: 40 } },
          }}
        />
      </Stack>
      <Chip
        size="small"
        variant="outlined"
        icon={<Icon name="calendar" size={16} />}
        label={`${start.format("YYYY-MM-DD")} ~ ${end.format("YYYY-MM-DD")} · ${
          end.diff(start, "day") + 1
        } 天`}
      />
    </Stack>
  )
}

const SWATCHES = [
  "primary",
  "secondary",
  "success",
  "error",
  "warning",
  "info",
] as const

function ColorPickerDemo() {
  const theme = useTheme()
  const [color, setColor] = useState(theme.palette.primary.main)
  return (
    <Stack spacing={1}>
      <Stack direction="row" gap={1} alignItems="center">
        <TextField
          type="color"
          size="small"
          label="颜色"
          value={color}
          onChange={(event) => setColor(event.target.value)}
          sx={{ width: 96 }}
          slotProps={{ htmlInput: { "aria-label": "颜色选择" } }}
        />
        <TextField
          size="small"
          label="HEX"
          value={color}
          onChange={(event) => setColor(event.target.value)}
          sx={{ width: 120 }}
        />
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: 1,
            border: 1,
            borderColor: "divider",
            bgcolor: color,
          }}
        />
      </Stack>
      <Stack direction="row" gap={1} flexWrap="wrap">
        {SWATCHES.map((key) => (
          <IconButton
            key={key}
            aria-label={key}
            onClick={() => setColor(theme.palette[key].main)}
            sx={{
              width: 40,
              height: 40,
              bgcolor: `${key}.main`,
              "&:hover": { bgcolor: `${key}.dark` },
            }}
          >
            {color === theme.palette[key].main ? (
              <Icon name="check" size={20} sx={{ color: `${key}.contrastText` }} />
            ) : null}
          </IconButton>
        ))}
      </Stack>
    </Stack>
  )
}

function AccordionDemo() {
  const [expanded, setExpanded] = useState<string | false>("panel-1")
  return (
    <Stack>
      {["panel-1", "panel-2", "panel-3"].map((panel, index) => (
        <Accordion
          key={panel}
          disableGutters
          disabled={index === 2}
          expanded={expanded === panel}
          onChange={(_, value) => setExpanded(value ? panel : false)}
        >
          <AccordionSummary expandIcon={<Icon name="chevron-down" />}>
            Accordion 项目 {index + 1}
          </AccordionSummary>
          <AccordionDetails>可控展开内容 {index + 1}</AccordionDetails>
        </Accordion>
      ))}
    </Stack>
  )
}

function PopconfirmDemo() {
  const [anchor, setAnchor] = useState<HTMLElement | null>(null)
  return (
    <>
      <Button
        variant="outlined"
        onClick={(event) => setAnchor(event.currentTarget)}
      >
        打开 Popconfirm
      </Button>
      <Popover
        open={Boolean(anchor)}
        anchorEl={anchor}
        onClose={() => setAnchor(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      >
        <Stack spacing={1} sx={{ p: 2 }}>
          <Typography>确认继续此操作吗？</Typography>
          <Stack direction="row" gap={1} justifyContent="flex-end">
            <Button size="small" onClick={() => setAnchor(null)}>
              取消
            </Button>
            <Button
              size="small"
              variant="contained"
              color="error"
              onClick={() => setAnchor(null)}
            >
              确认
            </Button>
          </Stack>
        </Stack>
      </Popover>
    </>
  )
}

const SEVERITIES = ["success", "info", "warning", "error"] as const

function NotificationDemo() {
  const [open, setOpen] = useState<(typeof SEVERITIES)[number] | null>(null)
  return (
    <>
      <Stack direction="row" gap={1} flexWrap="wrap">
        {SEVERITIES.map((severity) => (
          <Button
            key={severity}
            variant="outlined"
            color={severity}
            onClick={() => setOpen(severity)}
          >
            {severity}
          </Button>
        ))}
      </Stack>
      <Snackbar
        open={Boolean(open)}
        onClose={() => setOpen(null)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          severity={open ?? "info"}
          variant="filled"
          action={
            <Stack direction="row" gap={0.5} alignItems="center">
              <Button color="inherit" size="small" onClick={() => setOpen(null)}>
                查看
              </Button>
              <IconButton
                aria-label="关闭"
                color="inherit"
                onClick={() => setOpen(null)}
              >
                <Icon name="x" size={24} />
              </IconButton>
            </Stack>
          }
        >
          <AlertTitle>Notification · {open}</AlertTitle>
          有新的通知
        </Alert>
      </Snackbar>
    </>
  )
}

function ToastDemo() {
  const [open, setOpen] = useState<
    (typeof SEVERITIES)[number] | "action" | null
  >(null)
  return (
    <>
      <Stack direction="row" gap={1} flexWrap="wrap">
        {SEVERITIES.map((severity) => (
          <Button
            key={severity}
            size="small"
            variant="outlined"
            color={severity}
            onClick={() => setOpen(severity)}
          >
            {severity}
          </Button>
        ))}
        <Button size="small" variant="contained" onClick={() => setOpen("action")}>
          带操作
        </Button>
      </Stack>
      <Snackbar
        open={open === "action"}
        autoHideDuration={3000}
        onClose={() => setOpen(null)}
        message="文件已删除"
        action={
          <Button color="secondary" size="small" onClick={() => setOpen(null)}>
            撤销
          </Button>
        }
      />
      <Snackbar
        open={Boolean(open) && open !== "action"}
        autoHideDuration={2000}
        onClose={() => setOpen(null)}
      >
        <Alert
          severity={open === "action" || !open ? "info" : open}
          onClose={() => setOpen(null)}
        >
          操作{open === "error" ? "失败" : "完成"}（{open}）
        </Alert>
      </Snackbar>
    </>
  )
}

function DialogDemo({ popconfirm = false }: { popconfirm?: boolean }) {
  const [open, setOpen] = useState(false)
  const fullScreen = useMediaQuery(useTheme().breakpoints.down("sm"))
  return (
    <>
      <Button variant="outlined" onClick={() => setOpen(true)}>
        {popconfirm ? "打开 Popconfirm" : "打开 Dialog"}
      </Button>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullWidth
        maxWidth="sm"
        fullScreen={!popconfirm && fullScreen}
      >
        <DialogTitle>{popconfirm ? "确认操作" : "Dialog 标题"}</DialogTitle>
        <DialogContent>
          <Typography>
            {popconfirm ? "确认继续此操作吗？" : "DialogContent 内容。"}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>取消</Button>
          <Button
            variant="contained"
            color={popconfirm ? "error" : "primary"}
            onClick={() => setOpen(false)}
          >
            确认
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

function DrawerDemo() {
  const [anchor, setAnchor] = useState<
    "left" | "right" | "top" | "bottom" | null
  >(null)
  return (
    <Stack direction="row" gap={1} flexWrap="wrap">
      {(["left", "right", "top", "bottom"] as const).map((side) => (
        <span key={side}>
          <Button variant="outlined" onClick={() => setAnchor(side)}>
            {side}
          </Button>
          <Drawer
            anchor={side}
            open={anchor === side}
            onClose={() => setAnchor(null)}
          >
            <Box
              sx={{
                width: side === "bottom" || side === "top" ? "100vw" : 260,
                p: 2,
              }}
            >
              <Typography variant="h6">Drawer {side}</Typography>
              <Button onClick={() => setAnchor(null)}>关闭</Button>
            </Box>
          </Drawer>
        </span>
      ))}
    </Stack>
  )
}

function MenuDemo({ dropdown = false }: { dropdown?: boolean }) {
  const [anchor, setAnchor] = useState<HTMLElement | null>(null)
  const [subOpen, setSubOpen] = useState(true)
  const [collapsedMenu, setCollapsedMenu] = useState(false)
  return (
    <Stack spacing={2}>
      {!dropdown ? (
        <>
          <Paper variant="outlined">
            <MenuList dense sx={{ display: "flex", py: 0 }}>
              {nav.slice(0, 4).map((item) => (
                <MenuItem key={item.key} selected={item.key === "orders"}>
                  {item.label}
                </MenuItem>
              ))}
            </MenuList>
          </Paper>
          <Stack direction="row" gap={1} alignItems="flex-start">
            <Paper variant="outlined" sx={{ flex: 1, minWidth: 0 }}>
              <MenuList dense>
                {nav.slice(0, 2).map((item) => (
                  <MenuItem key={item.key}>
                    <ListItemIcon>
                      <Icon name={item.icon} size={18} />
                    </ListItemIcon>
                    <ListItemText primary={item.label} />
                  </MenuItem>
                ))}
                <MenuItem onClick={() => setSubOpen((value) => !value)}>
                  <ListItemIcon>
                    <Icon name="settings" size={18} />
                  </ListItemIcon>
                  <ListItemText primary="更多" />
                  <Icon name={subOpen ? "chevron-down" : "chevron-right"} size={18} />
                </MenuItem>
                {subOpen
                  ? nav.slice(5, 7).map((item) => (
                      <MenuItem key={item.key} sx={{ pl: 6 }}>
                        <ListItemText primary={item.label} />
                      </MenuItem>
                    ))
                  : null}
              </MenuList>
            </Paper>
            <Paper variant="outlined">
              <MenuList dense>
                <MenuItem onClick={() => setCollapsedMenu((value) => !value)}>
                  <ListItemIcon>
                    <Icon name="menu" size={18} />
                  </ListItemIcon>
                  {!collapsedMenu ? <ListItemText primary="折叠" /> : null}
                </MenuItem>
                {nav.slice(0, 3).map((item) => (
                  <MenuItem key={item.key}>
                    <ListItemIcon>
                      <Icon name={item.icon} size={18} />
                    </ListItemIcon>
                    {!collapsedMenu ? (
                      <ListItemText primary={item.label} />
                    ) : null}
                  </MenuItem>
                ))}
              </MenuList>
            </Paper>
          </Stack>
        </>
      ) : null}
      <Button
        variant="outlined"
        endIcon={dropdown ? <Icon name="chevron-down" /> : undefined}
        onClick={(event) => setAnchor(event.currentTarget)}
      >
        {dropdown ? "Dropdown" : "Menu"}
      </Button>
      <Menu
        anchorEl={anchor}
        open={Boolean(anchor)}
        onClose={() => setAnchor(null)}
      >
        <MenuItem onClick={() => setAnchor(null)}>
          <ListItemIcon>
            <Icon name="edit" size={18} />
          </ListItemIcon>
          编辑
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => setAnchor(null)}>
          <ListItemIcon>
            <Icon name="trash" size={18} />
          </ListItemIcon>
          删除
        </MenuItem>
      </Menu>
    </Stack>
  )
}

function TabsDemo() {
  const [value, setValue] = useState(0)
  return (
    <Stack spacing={1}>
      {(["standard", "scrollable", "fullWidth"] as const).map((variant) => (
        <Tabs
          key={variant}
          value={value}
          onChange={(_, next) => setValue(next)}
          variant={variant}
          scrollButtons={variant === "scrollable" ? "auto" : false}
        >
          <Tab icon={<Icon name="home" />} label={`${variant} 概览`} />
          <Tab icon={<Icon name="bar-chart" />} label="数据" />
          <Tab label="禁用" disabled />
        </Tabs>
      ))}
      <Typography variant="body2">
        当前标签：{value === 0 ? "概览" : "数据"}
      </Typography>
    </Stack>
  )
}

function StepsDemo() {
  const steps = ["基本信息", "配置", "确认"]
  return (
    <Stack spacing={2}>
      <Stepper alternativeLabel activeStep={1}>
        {steps.map((label, index) => (
          <Step key={label}>
            <StepLabel error={index === 1}>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      <Stepper orientation="vertical" activeStep={1}>
        {steps.map((label, index) => (
          <Step key={label}>
            <StepLabel error={index === 1}>{label}</StepLabel>
            <StepContent>
              <Typography variant="body2">步骤内容 {index + 1}</Typography>
            </StepContent>
          </Step>
        ))}
      </Stepper>
    </Stack>
  )
}

function NavbarDemo() {
  return (
    <Stack spacing={1}>
      {(["default", "primary", "transparent"] as const).map((color) => (
        <AppBar key={color} position="static" color={color}>
          <Toolbar>
            <Typography sx={{ flex: 1 }}>Acme Navbar · {color}</Typography>
            <IconButton color="inherit">
              <Icon name="search" />
            </IconButton>
            <IconButton color="inherit">
              <Icon name="settings" />
            </IconButton>
          </Toolbar>
        </AppBar>
      ))}
    </Stack>
  )
}

function SidebarDemo() {
  return (
    <Box sx={{ height: 220, overflow: "hidden" }}>
      <Drawer
        variant="permanent"
        open
        slotProps={{
          paper: {
            sx: { position: "relative", height: "100%", width: 220 },
          },
        }}
      >
        <List>
          {nav.slice(0, 5).map((item) => (
            <ListItemButton key={item.key}>
              <ListItemIcon>
                <Icon name={item.icon} size={18} />
              </ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          ))}
        </List>
      </Drawer>
    </Box>
  )
}

function CommandPaletteDemo() {
  const [open, setOpen] = useState(false)
  return (
    <>
      <Button
        variant="outlined"
        startIcon={<Icon name="search" />}
        onClick={() => setOpen(true)}
      >
        打开命令面板
      </Button>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Command Palette</DialogTitle>
        <DialogContent>
          <Autocomplete
            open
            autoFocus
            disablePortal
            options={nav.map((item) => item.label)}
            renderInput={(params) => <TextField {...params} label="搜索导航" />}
          />
        </DialogContent>
      </Dialog>
    </>
  )
}

function ThemeProviderDemo() {
  const opposite = useTheme().palette.mode === "light" ? "dark" : "light"
  return (
    <ThemeProvider theme={createTheme({ palette: { mode: opposite } })}>
      <Paper sx={{ p: 2 }}>
        <Typography gutterBottom>{opposite} scoped theme</Typography>
        <Button variant="contained">主题按钮</Button>
      </Paper>
    </ThemeProvider>
  )
}

function FloatButtonDemo() {
  return (
    <Stack direction="row" gap={1} alignItems="center">
      <Fab size="small" color="primary">
        <Icon name="plus" />
      </Fab>
      <Fab color="secondary">
        <Icon name="plus" />
      </Fab>
      <Fab variant="extended" color="success">
        <Icon name="plus" sx={{ mr: 0.5 }} />
        新建
      </Fab>
      <SpeedDial
        ariaLabel="更多操作"
        icon={<Icon name="plus" />}
        direction="right"
      >
        <SpeedDialAction icon={<Icon name="edit" />} title="编辑" />
        <SpeedDialAction icon={<Icon name="trash" />} title="删除" />
      </SpeedDial>
    </Stack>
  )
}

function Demo({ name }: { name: string }) {
  const [anchor, setAnchor] = useState<HTMLElement | null>(null)
  const [toggle, setToggle] = useState("center")
  if (coverage[name] === "missing") return <Missing name={name} />
  if (name === "Typography")
    return (
      <Stack spacing={1}>
        <Typography variant="h5">标题文字</Typography>
        <Typography>正文、辅助说明与链接样式。</Typography>
        <Typography color="text.secondary">辅助说明</Typography>
      </Stack>
    )
  if (name === "Code")
    return (
      <Stack spacing={1}>
        <Typography
          component="code"
          sx={{ bgcolor: "action.hover", borderRadius: 1, px: 1 }}
        >
          const ui = "mui"
        </Typography>
        <Box
          component="pre"
          sx={{ m: 0, p: 1, overflowX: "auto", bgcolor: "action.hover" }}
        >
          {"function render() {\n  return <Button />\n}"}
        </Box>
      </Stack>
    )
  if (name === "Kbd")
    return (
      <Typography
        component="kbd"
        sx={{
          border: 1,
          borderColor: "divider",
          borderRadius: 1,
          bgcolor: "action.hover",
          px: 1,
          py: 0.5,
        }}
      >
        ⌘ K
      </Typography>
    )
  if (name === "Button")
    return (
      <Stack spacing={1}>
        <Stack direction="row" gap={1} flexWrap="wrap">
          {(["text", "outlined", "contained"] as const).map((variant) => (
            <Button key={variant} variant={variant}>
              按钮
            </Button>
          ))}
        </Stack>
        <Stack direction="row" gap={1} flexWrap="wrap">
          {(
            [
              "primary",
              "secondary",
              "success",
              "error",
              "warning",
              "info",
            ] as const
          ).map((color) => (
            <Button key={color} variant="contained" color={color}>
              {color}
            </Button>
          ))}
        </Stack>
        <Stack direction="row" gap={1} flexWrap="wrap">
          <Button size="small">small</Button>
          <Button>medium</Button>
          <Button size="large">large</Button>
          <Button disabled>disabled</Button>
          <Button loading>loading</Button>
        </Stack>
      </Stack>
    )
  if (name === "ButtonGroup")
    return (
      <Stack spacing={1}>
        <ButtonGroup>
          <Button>保存</Button>
          <Button>取消</Button>
        </ButtonGroup>
        <ButtonGroup disabled>
          <Button>禁用</Button>
          <Button>组合</Button>
        </ButtonGroup>
      </Stack>
    )
  if (name === "IconButton")
    return (
      <Stack direction="row" gap={1}>
        <IconButton>
          <Icon name="settings" />
        </IconButton>
        <IconButton color="primary">
          <Icon name="edit" />
        </IconButton>
        <IconButton disabled>
          <Icon name="trash" />
        </IconButton>
      </Stack>
    )
  if (name === "Input")
    return (
      <Stack spacing={1}>
        <TextField label="标准" size="small" />
        <TextField label="错误" error helperText="请输入有效内容" />
        <TextField label="禁用" disabled size="small" />
      </Stack>
    )
  if (name === "Textarea")
    return (
      <TextField
        multiline
        minRows={3}
        label="多行文本"
        helperText="辅助说明"
        error
      />
    )
  if (name === "NumberInput") return <NumberInputDemo />
  if (name === "Select") return <SelectDemo />
  if (name === "MultiSelect") return <SelectDemo multiple />
  if (name === "Combobox") return <AutocompleteDemo freeSolo />
  if (name === "Autocomplete") return <AutocompleteDemo />
  if (name === "Checkbox") return <ChoiceDemo kind="checkbox" />
  if (name === "Radio")
    return (
      <FormControl error>
        <FormLabel>RadioGroup</FormLabel>
        <FormGroup row>
          <RadioGroup row defaultValue="medium">
            {(["small", "medium"] as const).map((size) => (
              <FormControlLabel
                key={size}
                value={size}
                label={size}
                control={<Radio size={size} color="primary" />}
              />
            ))}
          </RadioGroup>
          <FormControlLabel label="禁用" control={<Radio disabled />} />
        </FormGroup>
        <FormHelperText>请选择一个选项</FormHelperText>
      </FormControl>
    )
  if (name === "Switch") return <ChoiceDemo kind="switch" />
  if (name === "Slider")
    return (
      <Stack spacing={2}>
        <Slider defaultValue={35} valueLabelDisplay="auto" />
        <Slider defaultValue={[20, 70]} valueLabelDisplay="auto" />
        <Slider
          defaultValue={40}
          marks
          step={10}
          valueLabelDisplay="auto"
          disabled
        />
        <Slider size="small" color="secondary" defaultValue={60} />
      </Stack>
    )
  if (name === "Rating")
    return (
      <Stack direction="row" gap={2} flexWrap="wrap">
        <Rating defaultValue={3.5} precision={0.5} size="small" />
        <Rating defaultValue={4} readOnly />
        <Rating defaultValue={2} disabled size="large" />
      </Stack>
    )
  if (name === "DatePicker")
    return (
      <Stack direction={{ xs: "column", sm: "row" }} gap={1}>
        <DatePicker
          label="日期"
          defaultValue={dayjs()}
          slotProps={{
            textField: { size: "small" },
            openPickerButton: { sx: { width: 40, height: 40 } },
          }}
        />
        <DatePicker
          label="禁用 small"
          disabled
          slotProps={{
            textField: { size: "small" },
            openPickerButton: { sx: { width: 40, height: 40 } },
          }}
        />
      </Stack>
    )
  if (name === "TimePicker")
    return (
      <TimePicker
        label="时间"
        defaultValue={dayjs()}
        slotProps={{
          textField: { size: "small" },
          openPickerButton: { sx: { width: 40, height: 40 } },
        }}
      />
    )
  if (name === "DateRangePicker") return <DateRangePickerDemo />
  if (name === "ColorPicker") return <ColorPickerDemo />
  if (name === "Upload") return <UploadDemo />
  if (name === "Transfer") return <TransferDemo />
  if (name === "Form")
    return (
      <FormControl error required>
        <FormLabel>项目配置</FormLabel>
        <FormGroup>
          <FormControlLabel control={<Checkbox />} label="启用通知" />
          <FormControlLabel control={<Switch />} label="公开项目" />
        </FormGroup>
        <FormHelperText>这是必填表单示例</FormHelperText>
      </FormControl>
    )
  if (name === "Table") return <TableDemo />
  if (name === "DataGrid") return <DataGridDemo />
  if (name === "Descriptions")
    return (
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "minmax(80px, 120px) minmax(0, 1fr)",
          gap: 1,
        }}
      >
        <Typography color="text.secondary">状态</Typography>
        <Typography>已完成</Typography>
        <Typography color="text.secondary">负责人</Typography>
        <Typography>林晓</Typography>
        <Typography color="text.secondary">更新时间</Typography>
        <Typography>1 小时前</Typography>
      </Box>
    )
  if (name === "List")
    return (
      <List>
        {team.slice(0, 3).map((member) => (
          <ListItem
            key={member.email}
            secondaryAction={<Chip size="small" label={member.role} />}
          >
            <Avatar sx={{ mr: 1 }}>{member.name.slice(0, 1)}</Avatar>
            <ListItemText primary={member.name} secondary={member.email} />
          </ListItem>
        ))}
      </List>
    )
  if (name === "Card")
    return (
      <Card variant="outlined">
        <CardHeader title="卡片标题" subheader="CardHeader / CardContent" />
        <CardContent>卡片内容</CardContent>
      </Card>
    )
  if (name === "Avatar") return <AvatarDemo />
  if (name === "AvatarGroup")
    return (
      <AvatarGroup max={4}>
        {team.slice(0, 5).map((member) => (
          <Avatar key={member.email}>{member.name.slice(0, 1)}</Avatar>
        ))}
      </AvatarGroup>
    )
  if (name === "Badge") return <BadgeDemo />
  if (name === "Tag")
    return (
      <Stack spacing={1}>
        <Stack direction="row" gap={1} flexWrap="wrap">
          {(["small", "medium"] as const).flatMap((size) =>
            (["filled", "outlined"] as const).map((variant) => (
              <Chip
                key={`${variant}-${size}`}
                size={size}
                variant={variant}
                label={`${variant} ${size}`}
                color="primary"
              />
            ))
          )}
        </Stack>
        <TagDemo />
      </Stack>
    )
  if (name === "Statistic")
    return (
      <Grid container spacing={1}>
        {stats.slice(0, 3).map((item) => (
          <Grid size={{ xs: 12, sm: 4 }} key={item.key}>
            <Paper variant="outlined" sx={{ p: 1.5 }}>
              <Typography variant="body2" color="text.secondary">
                {item.label}
              </Typography>
              <Typography variant="h6">
                {item.value}
                {item.unit === "CNY" ? " CNY" : item.unit === "%" ? "%" : ""}
              </Typography>
              <Chip
                size="small"
                color={item.delta >= 0 ? "success" : "error"}
                label={`${item.delta >= 0 ? "+" : ""}${item.delta}%`}
              />
            </Paper>
          </Grid>
        ))}
      </Grid>
    )
  if (name === "Timeline") return <TimelineDemo />
  if (name === "Tree")
    return (
      <SimpleTreeView
        checkboxSelection
        defaultExpandedItems={["root", "projects"]}
      >
        <TreeItem itemId="root" label={nav[0].label}>
          <TreeItem itemId="projects" label={nav[4].label}>
            <TreeItem itemId="project-a" label={nav[1].label} />
            <TreeItem itemId="project-b" label={nav[2].label} />
          </TreeItem>
          <TreeItem itemId="settings" label={nav[6].label} />
          <TreeItem itemId="login" label={nav[7].label} />
        </TreeItem>
      </SimpleTreeView>
    )
  if (name === "Calendar")
    return (
      <Stack spacing={1}>
        <DateCalendar />
        <Typography variant="caption" color="text.secondary">
          只读变体
        </Typography>
        <DateCalendar readOnly />
      </Stack>
    )
  if (name === "Image") return <ImageDemo />
  if (name === "Carousel") return <CarouselDemo />
  if (name === "Empty")
    return (
      <Stack alignItems="center" spacing={1} sx={{ py: 2 }}>
        <Icon name="inbox" size={40} color="disabled" />
        <Typography>暂无内容</Typography>
        <Button variant="outlined">创建内容</Button>
      </Stack>
    )
  if (name === "Tooltip")
    return (
      <Stack direction="row" gap={1} flexWrap="wrap">
        {(["top", "right", "bottom", "left"] as const).map((placement) => (
          <Tooltip
            key={placement}
            title={`Tooltip ${placement}`}
            placement={placement}
            arrow
          >
            <Button size="small" variant="outlined">
              {placement}
            </Button>
          </Tooltip>
        ))}
      </Stack>
    )
  if (name === "Popover")
    return (
      <>
        <Button
          variant="outlined"
          onClick={(event) => setAnchor(event.currentTarget)}
        >
          打开 Popover
        </Button>
        <Popover
          open={Boolean(anchor)}
          anchorEl={anchor}
          onClose={() => setAnchor(null)}
        >
          <Typography sx={{ p: 2 }}>Popover 内容</Typography>
        </Popover>
      </>
    )
  if (name === "Segmented")
    return (
      <ToggleButtonGroup
        value={toggle}
        exclusive
        onChange={(_, value) => value && setToggle(value)}
        size="small"
      >
        <ToggleButton value="left">左</ToggleButton>
        <ToggleButton value="center">中</ToggleButton>
        <ToggleButton value="right">右</ToggleButton>
      </ToggleButtonGroup>
    )
  if (name === "Alert")
    return (
      <Stack spacing={1}>
        {(["success", "info", "warning", "error"] as const).flatMap(
          (severity) =>
            (["standard", "filled", "outlined"] as const).map((variant) => (
              <Alert
                key={`${severity}-${variant}`}
                severity={severity}
                variant={variant}
                icon={
                  <Icon
                    name={
                      severity === "success"
                        ? "check"
                        : severity === "error"
                          ? "alert-circle"
                          : "info"
                    }
                  />
                }
                onClose={() => undefined}
                action={
                  <Button color="inherit" size="small">
                    操作
                  </Button>
                }
              >
                <AlertTitle>
                  {severity} · {variant}
                </AlertTitle>
                这是一条 Alert 消息。
              </Alert>
            ))
        )}
      </Stack>
    )
  if (name === "Toast") return <ToastDemo />
  if (name === "Notification") return <NotificationDemo />
  if (name === "Dialog") return <DialogDemo />
  if (name === "Drawer") return <DrawerDemo />
  if (name === "Progress")
    return (
      <Stack spacing={1}>
        <LinearProgress value={65} variant="determinate" />
        <LinearProgress variant="indeterminate" />
        <LinearProgress valueBuffer={80} value={50} variant="buffer" />
        <CircularProgress value={65} variant="determinate" />
        <CircularProgress />
      </Stack>
    )
  if (name === "Skeleton")
    return (
      <Stack spacing={1}>
        <Skeleton variant="text" animation="wave" />
        <Skeleton variant="circular" width={32} height={32} animation="pulse" />
        <Skeleton variant="rectangular" height={45} animation={false} />
        <Skeleton variant="rounded" height={45} />
      </Stack>
    )
  if (name === "Spinner")
    return (
      <Stack direction="row" gap={2} alignItems="center">
        <CircularProgress size={20} thickness={5} />
        <CircularProgress size={32} color="secondary" />
        <CircularProgress size={44} variant="determinate" value={70} />
      </Stack>
    )
  if (name === "Result")
    return (
      <Stack alignItems="center" spacing={1}>
        <Icon name="check" size={48} color="success" />
        <Typography variant="h5">操作成功</Typography>
        <Typography color="text.secondary">
          项目已保存，可以继续下一步。
        </Typography>
        <Stack direction="row" gap={1}>
          <Button variant="contained" color="success">
            继续
          </Button>
          <Button variant="outlined" color="error">
            撤销
          </Button>
        </Stack>
      </Stack>
    )
  if (name === "Popconfirm") return <PopconfirmDemo />
  if (name === "Menu") return <MenuDemo />
  if (name === "Dropdown") return <MenuDemo dropdown />
  if (name === "Breadcrumb")
    return (
      <Breadcrumbs separator={<Icon name="chevron-right" size={16} />}>
        <MuiLink href="#" underline="hover">
          首页
        </MuiLink>
        <MuiLink href="#" underline="hover">
          项目
        </MuiLink>
        <Typography color="text.primary">设置</Typography>
      </Breadcrumbs>
    )
  if (name === "Tabs") return <TabsDemo />
  if (name === "Pagination")
    return (
      <Stack spacing={1} alignItems="flex-start">
        <Pagination
          count={10}
          size="small"
          variant="outlined"
          shape="rounded"
          color="primary"
          showFirstButton
          showLastButton
        />
        <Pagination count={10} size="medium" />
        <Pagination count={10} size="large" disabled />
      </Stack>
    )
  if (name === "Steps") return <StepsDemo />
  if (name === "Anchor")
    return (
      <Stack direction="row" gap={1} flexWrap="wrap">
        <MuiLink href="#component-Button">Button</MuiLink>
        <MuiLink href="#component-Table">Table</MuiLink>
        <MuiLink href="#component-Alert">Alert</MuiLink>
      </Stack>
    )
  if (name === "BackTop")
    return (
      <Button
        variant="outlined"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      >
        返回顶部
      </Button>
    )
  if (name === "Affix")
    return (
      <Box
        sx={{
          position: "sticky",
          top: 8,
          zIndex: 1,
          p: 1,
          bgcolor: "background.paper",
          border: 1,
          borderColor: "divider",
        }}
      >
        sticky 工具条
      </Box>
    )
  if (name === "Navbar") return <NavbarDemo />
  if (name === "Sidebar") return <SidebarDemo />
  if (name === "CommandPalette") return <CommandPaletteDemo />
  if (name === "Grid")
    return (
      <Grid container spacing={1}>
        {[1, 2, 3].map((item) => (
          <Grid size={{ xs: 12, md: 4 }} key={item}>
            <Paper sx={{ p: 2 }}>Grid {item}</Paper>
          </Grid>
        ))}
      </Grid>
    )
  if (name === "Stack")
    return (
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={1}
        divider={<Divider orientation="vertical" flexItem />}
      >
        <Paper sx={{ p: 1 }}>row / column</Paper>
        <Paper sx={{ p: 1 }}>spacing</Paper>
        <Paper sx={{ p: 1 }}>divider</Paper>
      </Stack>
    )
  if (name === "Layout")
    return (
      <Box
        sx={{
          display: "flex",
          minHeight: 160,
          border: 1,
          borderColor: "divider",
        }}
      >
        <Box sx={{ width: 100, bgcolor: "action.hover", p: 1 }}>
          <Typography variant="caption">Drawer</Typography>
        </Box>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <AppBar position="static" color="transparent" elevation={0}>
            <Toolbar variant="dense">
              <Typography>AppBar</Typography>
            </Toolbar>
          </AppBar>
          <Box sx={{ p: 1 }}>main content</Box>
        </Box>
      </Box>
    )
  if (name === "Container")
    return (
      <Stack spacing={1}>
        <Container maxWidth="sm" sx={{ bgcolor: "action.hover", py: 1 }}>
          maxWidth sm
        </Container>
        <Container maxWidth="md" sx={{ bgcolor: "action.hover", py: 1 }}>
          maxWidth md
        </Container>
        <Container maxWidth="lg" sx={{ bgcolor: "action.hover", py: 1 }}>
          maxWidth lg
        </Container>
      </Stack>
    )
  if (name === "AspectRatio")
    return (
      <Box
        sx={{
          aspectRatio: "16/9",
          bgcolor: "action.hover",
          display: "grid",
          placeItems: "center",
        }}
      >
        16:9
      </Box>
    )
  if (name === "ScrollArea")
    return (
      <Box
        sx={{
          height: 110,
          overflow: "auto",
          border: 1,
          borderColor: "divider",
          p: 1,
        }}
      >
        ScrollArea 内容
        <br />
        滚动查看更多内容
        <br />
        更多内容
        <br />
        最后一行
      </Box>
    )
  if (name === "Accordion") return <AccordionDemo />
  if (name === "ThemeProvider") return <ThemeProviderDemo />
  if (name === "FloatButton") return <FloatButtonDemo />
  if (name === "Divider")
    return (
      <Stack spacing={1}>
        <Divider />
        <Divider textAlign="left">带文字</Divider>
        <Stack
          direction="row"
          spacing={2}
          alignItems="center"
          divider={<Divider orientation="vertical" flexItem />}
        >
          <Typography variant="body2">订单</Typography>
          <Typography variant="body2">客户</Typography>
          <Typography variant="body2">财务</Typography>
        </Stack>
      </Stack>
    )
  if (name === "Link")
    return (
      <Stack direction="row" gap={2} flexWrap="wrap">
        <MuiLink href="#" underline="none">
          none
        </MuiLink>
        <MuiLink href="#" underline="hover" color="secondary">
          hover
        </MuiLink>
        <MuiLink href="#" underline="always" color="success">
          always
        </MuiLink>
      </Stack>
    )
  return <Typography color="text.secondary">暂无该组件示例。</Typography>
}

export function ComponentsPage() {
  const names = contract.components as string[]
  return (
    <Stack spacing={4} sx={{ minWidth: 0 }}>
      <PageHeader
        title="组件全集"
        description="官方组件覆盖与组合示例。"
        action={
          <Button variant="outlined" href="#component-index">
            组件索引
          </Button>
        }
      />
      <Box
        id="component-index"
        sx={{ display: "flex", flexWrap: "wrap", gap: 1, minWidth: 0 }}
      >
        {names.map((name) => (
          <Chip
            key={name}
            component="a"
            href={`#component-${name}`}
            clickable
            label={name}
            variant="outlined"
          />
        ))}
      </Box>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "minmax(0, 1fr)",
            md: "repeat(2, minmax(0, 1fr))",
            xl: "repeat(3, minmax(0, 1fr))",
          },
          gap: 2,
          minWidth: 0,
        }}
      >
        {names.map((name) => (
          <Card
            key={name}
            id={`component-${name}`}
            sx={{ scrollMarginTop: 80, minWidth: 0, overflow: "hidden" }}
          >
            <CardHeader
              title={
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  sx={{ minWidth: 0 }}
                >
                  <Typography variant="h6" noWrap>
                    {name}
                  </Typography>
                  <Chip
                    size="small"
                    variant="outlined"
                    label={coverage[name]}
                    color={
                      coverage[name] === "missing"
                        ? "error"
                        : coverage[name] === "composed"
                          ? "warning"
                          : "success"
                    }
                    sx={{ color: "text.primary" }}
                  />
                </Stack>
              }
              subheader={descriptions[name] ?? `${name} MUI 示例`}
            />
            <CardContent sx={{ minWidth: 0, overflow: "hidden" }}>
              <Demo name={name} />
            </CardContent>
          </Card>
        ))}
      </Box>
    </Stack>
  )
}
