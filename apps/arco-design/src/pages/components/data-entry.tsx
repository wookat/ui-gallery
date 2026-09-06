import { AutoComplete, Button, Cascader, Checkbox, ColorPicker, DatePicker, Form, Input, InputNumber, InputTag, Mentions, Radio, Rate, Select, Slider, Space, Switch, TimePicker, Transfer, Upload, VerificationCode } from "@arco-design/web-react"
import { Icon } from "@/components/icon"
import type { DemoProps } from "./shared"
import { DemoSection, SizeRow, sizes } from "./shared"

const options = [{ label: "选项一", value: "one" }, { label: "选项二", value: "two" }, { label: "选项三", value: "three" }]
const cascaderOptions = [{ label: "中国", value: "cn", children: [{ label: "上海", value: "sh" }, { label: "北京", value: "bj" }] }, { label: "日本", value: "jp" }]
const transferItems = [{ key: "1", value: "设计" }, { key: "2", value: "研发" }, { key: "3", value: "市场" }, { key: "4", value: "销售" }]

export function DataEntryDemo({ name }: DemoProps) {
  switch (name) {
    case "Input": return <DemoSection><SizeRow>{(size) => <Input size={size} placeholder={size} />}</SizeRow><Space wrap><Input status="error" placeholder="错误" /><Input status="warning" placeholder="警告" /><Input disabled placeholder="禁用" /><Input readOnly defaultValue="只读" /><Input addBefore="¥" addAfter="元" prefix={<Icon name="search" />} suffix="单位" allowClear /></Space><InputTag defaultValue={["标签一", "标签二"]} tokenSeparators={[","]} placeholder="InputTag" /><Input.Password placeholder="密码" /><Input.Search searchButton placeholder="搜索" /><Input.TextArea showWordLimit maxLength={80} autoSize={{ minRows: 2, maxRows: 4 }} placeholder="文本域" /></DemoSection>
    case "Textarea": return <Input.TextArea status="warning" autoSize={{ minRows: 3 }} placeholder="多行文本" />
    case "NumberInput": return <Space wrap><SizeRow>{(size) => <InputNumber size={size} defaultValue={10} mode="embed" />}</SizeRow><InputNumber mode="button" defaultValue={20} prefix="¥" suffix="元" /></Space>
    case "Select": return <DemoSection><SizeRow>{(size) => <Select size={size} options={options} placeholder={size} allowClear />}</SizeRow><Space wrap><Select disabled options={options} /><Select loading options={options} /><Select bordered={false} defaultValue="one" options={options} /><Select showSearch options={options} /></Space></DemoSection>
    case "MultiSelect": return <Space wrap><Select mode="multiple" defaultValue={["one"]} options={options} /><Select mode="tags" allowCreate tokenSeparators={[","]} options={options} placeholder="tags" /></Space>
    case "Combobox": return <Select showSearch allowCreate options={options} placeholder="组合框" />
    case "Autocomplete": return <AutoCompleteDemo />
    case "Checkbox": return <DemoSection><Checkbox indeterminate>半选状态</Checkbox><Checkbox disabled>禁用</Checkbox><Checkbox.Group direction="vertical" defaultValue={["一"]} options={["一", "二", "三"]} /></DemoSection>
    case "Radio": return <DemoSection><Space wrap>{sizes.map((size) => <Radio.Group key={size} size={size} type="button" defaultValue="one"><Radio value="one">一</Radio><Radio value="two">二</Radio></Radio.Group>)}</Space><Radio.Group defaultValue="one"><Radio value="one">普通</Radio><Radio value="two" disabled>禁用</Radio></Radio.Group></DemoSection>
    case "Switch": return <Space wrap>{(["small", "default"] as const).map((size) => <Switch key={size} size={size} defaultChecked checkedText="开" uncheckedText="关" />)}<Switch type="circle" /><Switch type="round" loading /><Switch type="line" disabled /></Space>
    case "Slider": return <Space direction="vertical" style={{ width: "100%" }}><Slider defaultValue={40} showInput step={10} /><Slider range defaultValue={[20, 70]} marks={{ 0: "0", 50: "50", 100: "100" }} /><Slider vertical style={{ height: 120 }} defaultValue={50} disabled /></Space>
    case "Rating": return <Space direction="vertical"><Rate defaultValue={3.5} allowHalf character="♥" tooltips={["差", "一般", "好", "很好", "优秀"]} /><Rate defaultValue={4} readonly /><Rate defaultValue={2} disabled /></Space>
    case "DatePicker": return <Space wrap><DatePicker /><DatePicker.WeekPicker /><DatePicker.MonthPicker /><DatePicker.YearPicker /><DatePicker.QuarterPicker /><DatePicker showTime /><DatePicker disabled /></Space>
    case "DateRangePicker": return <DatePicker.RangePicker showTime />
    case "TimePicker": return <Space wrap><TimePicker use12Hours step={{ hour: 1, minute: 10, second: 10 }} /><TimePicker.RangePicker /><TimePicker disabled /></Space>
    case "ColorPicker": return <Space wrap><ColorPicker size="mini" defaultValue="#165DFF" /><ColorPicker size="small" defaultValue="#14C9C9" disabledAlpha /><ColorPicker size="large" defaultValue="#F53F3F" showPreset /></Space>
    case "Upload": return <Space direction="vertical"><Upload><Button icon={<Icon name="upload" />}>上传</Button></Upload><Upload drag>拖拽上传</Upload><Upload listType="picture-card" defaultFileList={[{ uid: "1", name: "已上传.svg", url: `${import.meta.env.BASE_URL}image-placeholder.svg`, status: "done" }]} /><Upload disabled><Button>禁用上传</Button></Upload></Space>
    case "Cascader": return <Space wrap><Cascader options={cascaderOptions} mode="multiple" showSearch expandTrigger="hover" changeOnSelect placeholder="多选地区" /></Space>
    case "Transfer": return <Transfer dataSource={transferItems} oneWay showSearch titleTexts={["未选择", "已选择"]} />
    case "Mention": return <Mentions options={[{ label: "林晓", value: "林晓" }, { label: "王子涵", value: "王子涵" }]} prefix={["@"]} placeholder="@ 提及成员" />
    case "Segmented": return <Radio.Group type="button" defaultValue="day">{sizes.map((size) => <Radio key={size} value={size}>{size}</Radio>)}</Radio.Group>
    case "PinInput": return <VerificationCode length={6} masked size="large" defaultValue="123456" />
    case "Form": return <FormDemo />
    default: return null
  }
}

function AutoCompleteDemo() {
  return <div><Input placeholder="基础输入" /><InputTag defaultValue={["前端"]} style={{ marginTop: 8 }} /><Select showSearch options={options} style={{ marginTop: 8 }} /><Form.Item label="AutoComplete" field="auto"><AutoComplete data={["北京", "上海", "深圳"]} /></Form.Item></div>
}

function FormDemo() {
  return <Form layout="vertical" size="small" validateTrigger={["onBlur", "onSubmit"]} disabled={false}><Form.Item label="名称" field="name" rules={[{ required: true, message: "请输入名称" }]}><Input /></Form.Item><Form.Item label="预算" field="budget"><InputNumber /></Form.Item><Form.Item label="状态" field="enabled"><Switch /></Form.Item><Form.List field="members">{(fields, { add, remove }) => <Space direction="vertical">{fields.map((field) => <Space key={field.key}><Form.Item field={field.field} initialValue=""><Input placeholder="成员" /></Form.Item><Button onClick={() => remove(field.key)}>移除</Button></Space>)}<Button onClick={() => add()}>添加成员</Button></Space>}</Form.List><Button htmlType="submit" type="primary">提交</Button></Form>
}
