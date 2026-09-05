import { useState, type ReactNode } from "react"
import {
  AutoComplete,
  Button,
  Checkbox,
  ColorPicker,
  ColorPickerPanel,
  DatePicker,
  DateRangePicker,
  Form,
  Input,
  InputNumber,
  Radio,
  Rate,
  Select,
  Slider,
  Switch,
  TagInput,
  Textarea,
  TimePicker,
  Tooltip,
  Typography,
  Upload,
} from "tdesign-react"
import { Icon } from "@/components/icon"
import { componentOptions, DemoPanel, DemoRow } from "./types"

function TypographyDemo() {
  return (
    <DemoPanel>
      <Typography.Title level="h1">Heading 1</Typography.Title>
      <Typography.Title level="h2">Heading 2</Typography.Title>
      <Typography.Title level="h3">Heading 3</Typography.Title>
      <Typography.Title level="h4">Heading 4</Typography.Title>
      <Typography.Title level="h5">Heading 5</Typography.Title>
      <Typography.Title level="h6">Heading 6</Typography.Title>
      <DemoRow>
        <Typography.Text strong>加粗</Typography.Text>
        <Typography.Text mark>标记</Typography.Text>
        <Typography.Text code>code</Typography.Text>
        <Typography.Text delete>删除线</Typography.Text>
        <Typography.Text underline>下划线</Typography.Text>
        <Typography.Text italic>斜体</Typography.Text>
      </DemoRow>
      <DemoRow>
        <Typography.Text theme="primary">primary</Typography.Text>
        <Typography.Text theme="success">success</Typography.Text>
        <Typography.Text theme="warning">warning</Typography.Text>
        <Typography.Text theme="error">error</Typography.Text>
      </DemoRow>
      <Typography.Paragraph ellipsis={{ row: 2 }}>
        这是带有省略号的段落示例，展示长文本在有限空间中的截断行为。
      </Typography.Paragraph>
      <DemoRow>
        <a href="#component-Link">内联链接</a>
        <Typography.Text>正文</Typography.Text>
        <Typography.Text>｜分隔文本</Typography.Text>
      </DemoRow>
    </DemoPanel>
  )
}

function ButtonDemo() {
  const themes = ["default", "primary", "success", "warning", "danger"] as const
  const variants = ["base", "outline", "dashed", "text"] as const
  const sizes = ["small", "medium", "large"] as const
  return (
    <DemoPanel>
      {themes.map((theme) => (
        <DemoRow key={theme}>
          {variants.map((variant) => (
            <Button key={`${theme}-${variant}`} theme={theme} variant={variant}>
              {theme} · {variant}
            </Button>
          ))}
        </DemoRow>
      ))}
      <DemoRow>
        {sizes.map((size) => (
          <Button key={size} size={size}>
            {size}
          </Button>
        ))}
        <Button shape="square" icon={<Icon name="plus" />} />
        <Button shape="round">round</Button>
        <Button shape="circle" icon={<Icon name="plus" />} />
        <Button loading>loading</Button>
        <Button disabled>disabled</Button>
        <Button ghost theme="primary">ghost</Button>
      </DemoRow>
      <Button block theme="primary">block button</Button>
    </DemoPanel>
  )
}

function InputDemo() {
  return (
    <DemoPanel>
      <DemoRow>
        <Input placeholder="default" />
        <Input prefixIcon={<Icon name="search" />} placeholder="prefix" />
        <Input suffixIcon={<Icon name="check" />} placeholder="suffix" />
        <Input clearable defaultValue="clearable" />
      </DemoRow>
      <DemoRow>
        <Input type="password" suffixIcon={<Icon name="eye" />} placeholder="password" />
        <Input suffixIcon={<Icon name="search" />} placeholder="search" />
        <Input size="small" placeholder="small" />
        <Input size="large" placeholder="large" />
      </DemoRow>
      <DemoRow>
        <Input disabled defaultValue="disabled" />
        <Input readonly defaultValue="readonly" />
        <Input status="error" tips="请输入有效内容" placeholder="error" />
      </DemoRow>
    </DemoPanel>
  )
}

function TextareaDemo() {
  return (
    <DemoPanel>
      <Textarea autosize={{ minRows: 2, maxRows: 4 }} placeholder="autosize textarea" />
      <Textarea maxcharacter={80} defaultValue="带字符计数器的文本域" />
      <Textarea disabled defaultValue="disabled textarea" />
    </DemoPanel>
  )
}

function NumberInputDemo() {
  return (
    <DemoPanel>
      <DemoRow>
        <InputNumber defaultValue={12} theme="normal" min={0} max={100} step={1} />
        <InputNumber defaultValue={12} theme="row" min={0} max={100} step={5} />
        <InputNumber defaultValue={12} theme="column" min={0} max={100} step={10} />
        <InputNumber size="small" defaultValue={2} />
        <InputNumber size="large" defaultValue={8} />
        <InputNumber disabled defaultValue={0} />
      </DemoRow>
    </DemoPanel>
  )
}

function SelectDemo() {
  return (
    <DemoPanel>
      <DemoRow>
        <Select options={componentOptions} placeholder="single" />
        <Select clearable options={componentOptions} defaultValue="two" />
        <Select options={componentOptions} placeholder="readonly" readonly defaultValue="one" />
      </DemoRow>
      <DemoRow>
        <Select size="small" options={componentOptions} prefixIcon={<Icon name="search" />} />
        <Select size="large" options={componentOptions} />
        <Select disabled options={componentOptions} defaultValue="one" />
        <Select loading options={componentOptions} />
      </DemoRow>
    </DemoPanel>
  )
}

function MultiSelectDemo() {
  return (
    <DemoPanel>
      <DemoRow>
        <Select multiple options={componentOptions} defaultValue={["one", "two"]} placeholder="multiple" />
        <Select multiple minCollapsedNum={1} options={componentOptions} defaultValue={["one", "two", "three"]} />
        <Select multiple showArrow={false} options={componentOptions} placeholder="multiple · 无箭头" />
      </DemoRow>
      <DemoRow>
        <Select multiple size="small" options={componentOptions} defaultValue={["one"]} />
        <Select multiple size="large" options={componentOptions} defaultValue={["two"]} />
        <Select multiple disabled options={componentOptions} defaultValue={["one", "three"]} />
      </DemoRow>
    </DemoPanel>
  )
}

function ComboboxDemo() {
  const [value, setValue] = useState<string | number>("")
  return (
    <DemoPanel>
      <DemoRow>
        <Select filterable options={componentOptions} placeholder="filterable" />
        <Select filterable creatable options={componentOptions} placeholder="filterable + creatable" />
        <Select filterable multiple creatable options={componentOptions} placeholder="filterable + multiple" />
      </DemoRow>
      <DemoRow>
        <Select filterable value={value} onChange={(next) => setValue(next as string | number)} options={componentOptions} placeholder="受控 combobox" />
        <Typography.Text theme="secondary">当前值：{value === "" ? "未选择" : String(value)}</Typography.Text>
      </DemoRow>
    </DemoPanel>
  )
}

function AutocompleteDemo({ mention = false }: { mention?: boolean }) {
  const [value, setValue] = useState("")
  const options = ["林晓", "王子涵", "Alex Chen", "Maria García"]
  return (
    <DemoPanel>
      <AutoComplete
        value={value}
        options={mention && !value.includes("@") ? [] : options}
        onChange={setValue}
        placeholder={mention ? "输入 @ 提及团队成员" : "输入名称自动补全"}
      />
      <Typography.Text theme="secondary">
        {mention ? "Mention 组合：仅输入 @ 后展示成员选项。" : "AutoComplete 原生选项。"}
      </Typography.Text>
    </DemoPanel>
  )
}

function CheckboxDemo() {
  const [checked, setChecked] = useState(false)
  return (
    <DemoPanel>
      <DemoRow>
        <Checkbox checked={checked} onChange={setChecked}>checked / unchecked</Checkbox>
        <Checkbox indeterminate>indeterminate</Checkbox>
        <Checkbox disabled>disabled</Checkbox>
      </DemoRow>
      <Checkbox.Group options={componentOptions} defaultValue={["one"]} />
    </DemoPanel>
  )
}

function RadioDemo() {
  return (
    <DemoPanel>
      <Radio.Group defaultValue="one">
        <Radio value="one">默认</Radio>
        <Radio value="two">选项二</Radio>
      </Radio.Group>
      <Radio.Group variant="default-filled" defaultValue="one">
        <Radio value="one">default-filled</Radio>
        <Radio value="two">选项二</Radio>
      </Radio.Group>
      <Radio.Group variant="primary-filled" size="large" defaultValue="one">
        <Radio.Button value="one">primary-filled</Radio.Button>
        <Radio.Button value="two">Radio.Button</Radio.Button>
      </Radio.Group>
      <Radio.Group disabled defaultValue="one">
        <Radio value="one">disabled</Radio>
        <Radio value="two">disabled</Radio>
      </Radio.Group>
    </DemoPanel>
  )
}

function SegmentedDemo() {
  return (
    <DemoPanel>
      <Radio.Group variant="default-filled" defaultValue="day">
        <Radio.Button value="day"><Icon name="calendar" /> 日</Radio.Button>
        <Radio.Button value="week"><Icon name="bar-chart" /> 周</Radio.Button>
        <Radio.Button value="month"><Icon name="clock" /> 月</Radio.Button>
      </Radio.Group>
    </DemoPanel>
  )
}

function SwitchDemo() {
  return (
    <DemoPanel>
      <DemoRow>
        <Switch label={["开", "关"]} defaultValue />
        <Switch size="small" label={["开", "关"]} />
        <Switch size="large" label={["开", "关"]} />
        <Switch loading label={["开", "关"]} />
        <Switch disabled label={["开", "关"]} />
      </DemoRow>
    </DemoPanel>
  )
}

function SliderDemo() {
  return (
    <DemoPanel>
      <Slider defaultValue={40} marks={{ 0: "0", 50: "50", 100: "100" }} />
      <Slider range defaultValue={[20, 80]} inputNumberProps={{}} />
      <div style={{ height: 120, width: 180, padding: "48px 0" }}>
        <Slider defaultValue={60} disabled />
      </div>
    </DemoPanel>
  )
}

function RatingDemo() {
  return (
    <DemoPanel>
      <DemoRow>
        <Rate defaultValue={4} />
        <Rate allowHalf defaultValue={3.5} />
        <Rate defaultValue={4} showText texts={["差", "一般", "好", "很好", "优秀"]} />
        <Rate disabled defaultValue={2} />
        <Rate count={10} defaultValue={7} />
      </DemoRow>
    </DemoPanel>
  )
}

function DateDemo({ range = false }: { range?: boolean }) {
  return (
    <DemoPanel>
      {range ? <DateRangePicker presets={{ 今天: ["2026-09-01", "2026-09-01"] }} /> : <DatePicker enableTimePicker />}
      <DatePicker mode="month" />
      <DatePicker mode="year" disabled />
    </DemoPanel>
  )
}

function TimeDemo() {
  return (
    <DemoPanel>
      <TimePicker format="HH:mm:ss" />
      <TimePicker format="hh:mm a" />
      <TimePicker.TimeRangePicker format="HH:mm" />
    </DemoPanel>
  )
}

function ColorDemo() {
  return (
    <DemoPanel>
      <DemoRow>
        <ColorPicker defaultValue="var(--td-brand-color)" />
        <ColorPicker format="HEX" defaultValue="var(--td-success-color)" />
        <ColorPicker disabled defaultValue="var(--td-warning-color)" />
        <ColorPickerPanel defaultValue="var(--td-brand-color)" />
      </DemoRow>
    </DemoPanel>
  )
}

function UploadDemo() {
  return (
    <DemoPanel>
      <Upload theme="file" autoUpload={false} />
      <Upload theme="file-input" autoUpload={false} />
      <Upload theme="image" multiple autoUpload={false} defaultFiles={[{ name: "placeholder.svg", url: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80'%3E%3Crect width='80' height='80' fill='%23dfeafd'/%3E%3C/svg%3E" }]} />
      <Upload draggable autoUpload={false} />
      <Upload disabled autoUpload={false} />
    </DemoPanel>
  )
}

function FormDemo() {
  const [form] = Form.useForm()
  return (
    <DemoPanel>
      <Form form={form} layout="vertical" requiredMark>
        <Form.FormItem label="姓名" name="name" rules={[{ required: true, message: "请输入姓名" }]} help="必填项">
          <Input placeholder="姓名" />
        </Form.FormItem>
        <Form.FormItem label="邮箱" name="email" rules={[{ required: true, email: true, message: "请输入邮箱" }]}>
          <Input placeholder="email@example.com" />
        </Form.FormItem>
        <Form.FormItem label="状态">
          <Select options={componentOptions} />
        </Form.FormItem>
        <DemoRow>
          <Button onClick={() => form.validate()}>校验</Button>
          <Button variant="outline">取消</Button>
        </DemoRow>
      </Form>
      <Form layout="inline" labelAlign="right">
        <Form.FormItem label="内联字段"><Input /></Form.FormItem>
        <Form.FormItem label="帮助"><Input status="error" tips="提示信息" /></Form.FormItem>
      </Form>
    </DemoPanel>
  )
}

export const generalDemos = {
  Typography: TypographyDemo,
  Button: ButtonDemo,
  Input: InputDemo,
  Textarea: TextareaDemo,
  NumberInput: NumberInputDemo,
  Select: SelectDemo,
  MultiSelect: MultiSelectDemo,
  Combobox: ComboboxDemo,
  Autocomplete: () => <AutocompleteDemo />,
  Mention: () => <AutocompleteDemo mention />,
  Checkbox: CheckboxDemo,
  Radio: RadioDemo,
  Segmented: SegmentedDemo,
  Switch: SwitchDemo,
  Slider: SliderDemo,
  Rating: RatingDemo,
  DatePicker: () => <DateDemo />,
  DateRangePicker: () => <DateDemo range />,
  TimePicker: TimeDemo,
  ColorPicker: ColorDemo,
  Upload: UploadDemo,
  Form: FormDemo,
  TagInput: () => <TagInput defaultValue={["标签一", "标签二"]} />,
  Tooltip: () => <Tooltip content="提示内容" placement="top" showArrow><Button>hover / click</Button></Tooltip>,
} satisfies Record<string, () => ReactNode>
