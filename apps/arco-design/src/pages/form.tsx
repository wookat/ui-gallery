import { useState } from "react"
import { AutoComplete, Button, Card, Checkbox, ColorPicker, DatePicker, Descriptions, Form, Input, InputNumber, InputTag, Rate, Radio, Result, Select, Slider, Space, Steps, Switch, TimePicker, Upload } from "@arco-design/web-react"
import { Icon } from "@/components/icon"
import { PageHeader } from "./shared"

type Values = Record<string, unknown>

const countryCodes = [{ label: "+86", value: "+86" }, { label: "+1", value: "+1" }, { label: "+44", value: "+44" }, { label: "+81", value: "+81" }]
const teams = ["产品团队", "增长团队", "客户成功", "研发团队"]
const owners = ["林晓", "王子涵", "Alex Chen", "Maria Li"]
const projectTypes = [
  { label: "内部项目", value: "internal" },
  { label: "客户项目", value: "client" },
  { label: "研究项目", value: "research" },
]
const stepTitles = ["基本信息", "详细配置", "确认"]

const text = (value: unknown, fallback = "—") => {
  if (Array.isArray(value)) return value.length ? value.join("、") : fallback
  if (value === undefined || value === null || value === "") return fallback
  if (typeof value === "boolean") return value ? "是" : "否"
  return String(value)
}

export function FormPage() {
  const [step, setStep] = useState(0)
  const [values, setValues] = useState<Values>({ country: "+86", automation: true, priority: [20, 80], rating: 4, color: "#165DFF" })
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const merge = (next: Values) => setValues((prev) => ({ ...prev, ...next }))
  const advance = (next: Values) => { merge(next); setStep(step + 1) }
  const submit = (next: Values) => {
    merge(next)
    setSubmitting(true)
    window.setTimeout(() => { setSubmitting(false); setSubmitted(true) }, 600)
  }
  const reset = () => { setSubmitted(false); setStep(0) }

  const step1 = (
    <Form key="step1" layout="vertical" initialValues={values} onSubmit={advance} requiredSymbol={{ position: "start" }}>
      <Form.Item label="项目名称" field="name" rules={[{ required: true, message: "请输入项目名称" }, { minLength: 2, message: "至少 2 个字符" }]} extra="将显示在项目列表与通知中。"><Input placeholder="例如：Q4 增长计划" /></Form.Item>
      <Form.Item label="预算" field="budget" rules={[{ required: true, type: "number", min: 1000, max: 10000000, message: "预算范围 1,000 - 10,000,000" }]} tooltip="项目周期内的总预算，单位为人民币。"><InputNumber min={0} precision={2} prefix="¥" style={{ width: "100%" }} /></Form.Item>
      <Form.Item label="负责人邮箱" field="email" rules={[{ required: true, message: "请输入邮箱" }, { type: "email", message: "邮箱格式不正确" }]}><Input prefix={<Icon name="user" />} placeholder="you@example.com" /></Form.Item>
      <Form.Item label="联系电话" required>
        <div style={{ display: "flex", gap: 8 }}>
          <Form.Item field="country" noStyle><Select style={{ width: 100 }} options={countryCodes} /></Form.Item>
          <Form.Item field="phone" rules={[{ required: true, message: "请输入电话" }, { match: /^\d{6,15}$/, message: "电话格式不正确" }]} style={{ flex: 1, marginBottom: 0 }}><Input placeholder="13800000000" /></Form.Item>
        </div>
      </Form.Item>
      <Form.Item label="项目类型" field="type" rules={[{ required: true, message: "请选择项目类型" }]}><Radio.Group>{projectTypes.map((t) => <Radio key={t.value} value={t.value}>{t.label}</Radio>)}</Radio.Group></Form.Item>
      <Form.Item label="标签" field="tags" rules={[{ required: true, type: "array", minLength: 1, message: "至少选择一个标签" }]}><Checkbox.Group options={["增长", "设计", "研发", "营销"]} /></Form.Item>
      <Form.Item label="启用自动化" field="automation" triggerPropName="checked" extra="自动同步进度到团队动态。"><Switch /></Form.Item>
      <Form.Item label="项目描述" field="description" rules={[{ maxLength: 200, message: "最多 200 字" }]}><Input.TextArea showWordLimit maxLength={200} placeholder="描述项目目标与范围" autoSize={{ minRows: 3 }} /></Form.Item>
      <Space><Button type="secondary" disabled>上一步</Button><Button type="primary" htmlType="submit">下一步</Button></Space>
    </Form>
  )

  const step2 = (
    <Form key="step2" layout="vertical" initialValues={values} onSubmit={advance} requiredSymbol={{ position: "start" }}>
      <Form.Item label="所属团队" field="team" rules={[{ required: true, message: "请选择所属团队" }]}><Select placeholder="选择团队" options={teams.map((label) => ({ label, value: label }))} /></Form.Item>
      <Form.Item label="协作团队" field="collaborators" tooltip="可多选，最多 3 个。" rules={[{ type: "array", maxLength: 3, message: "最多选择 3 个团队" }]}><Select mode="multiple" placeholder="选择协作团队" options={teams.map((label) => ({ label, value: label }))} /></Form.Item>
      <Form.Item label="负责人" field="owner" rules={[{ required: true, message: "请输入负责人" }]} extra="输入姓名以自动补全。"><AutoComplete data={owners} placeholder="搜索成员" /></Form.Item>
      <Form.Item label="开始日期" field="startDate" rules={[{ required: true, message: "请选择开始日期" }]}><DatePicker style={{ width: "100%" }} /></Form.Item>
      <Form.Item label="每日同步时间" field="syncTime"><TimePicker format="HH:mm" style={{ width: "100%" }} /></Form.Item>
      <Form.Item label="项目周期" field="range" rules={[{ required: true, message: "请选择项目周期" }]}><DatePicker.RangePicker style={{ width: "100%" }} /></Form.Item>
      <Form.Item label="优先级区间" field="priority" tooltip="拖动两端设置优先级范围。"><Slider range marks={{ 0: "低", 50: "中", 100: "高" }} /></Form.Item>
      <Form.Item label="重要程度" field="rating"><Rate allowHalf /></Form.Item>
      <Form.Item label="主题色" field="color"><ColorPicker /></Form.Item>
      <Form.Item label="附件" field="files" triggerPropName="fileList" extra="支持 PDF、图片，单个文件不超过 10MB。"><Upload drag multiple autoUpload={false} tip="拖拽文件到此处或点击上传" /></Form.Item>
      <Form.Item label="关键词" field="keywords" tooltip="输入后按回车生成标签。" rules={[{ type: "array", maxLength: 5, message: "最多 5 个关键词" }]}><InputTag placeholder="输入关键词后回车" allowClear /></Form.Item>
      <Space><Button type="secondary" onClick={() => setStep(0)}>上一步</Button><Button type="primary" htmlType="submit">下一步</Button></Space>
    </Form>
  )

  const summary = [
    { label: "项目名称", value: text(values.name) },
    { label: "预算", value: values.budget === undefined ? "—" : `¥${Number(values.budget).toLocaleString()}` },
    { label: "负责人邮箱", value: text(values.email) },
    { label: "联系电话", value: values.phone ? `${text(values.country)} ${text(values.phone)}` : "—" },
    { label: "项目类型", value: text(projectTypes.find((t) => t.value === values.type)?.label) },
    { label: "标签", value: text(values.tags) },
    { label: "自动化", value: text(values.automation) },
    { label: "所属团队", value: text(values.team) },
    { label: "协作团队", value: text(values.collaborators) },
    { label: "负责人", value: text(values.owner) },
    { label: "开始日期", value: text(values.startDate) },
    { label: "项目周期", value: text(values.range, "—").replace("、", " ~ ") },
    { label: "优先级区间", value: text(values.priority).replace("、", " - ") },
    { label: "重要程度", value: `${text(values.rating)} / 5` },
    { label: "关键词", value: text(values.keywords) },
  ]

  const step3 = (
    <Form key="step3" layout="vertical" onSubmit={submit}>
      <Descriptions column={1} border title="项目摘要" data={summary} />
      <Form.Item field="agree" triggerPropName="checked" rules={[{ type: "boolean", true: true, message: "请先同意服务条款" }]} style={{ marginTop: 24 }}><Checkbox>我已阅读并同意服务条款和隐私政策</Checkbox></Form.Item>
      <Space><Button type="secondary" onClick={() => setStep(1)}>上一步</Button><Button type="primary" htmlType="submit" loading={submitting}>提交项目</Button></Space>
    </Form>
  )

  return (
    <>
      <PageHeader title="新建项目" description="填写信息，创建一个新的工作项目。" />
      <Card>
        <Steps current={submitted ? 4 : step + 1} status={submitted ? "finish" : undefined}>{stepTitles.map((title) => <Steps.Step key={title} title={title} />)}</Steps>
      </Card>
      <Card>
        {submitted ? <Result status="success" title="项目创建成功" subTitle={`「${text(values.name, "新项目")}」已创建，团队成员将收到通知。`} extra={[<Button key="again" type="primary" onClick={reset}>再建一个</Button>, <Button key="back" onClick={() => setStep(2)}>查看摘要</Button>]} /> : [step1, step2, step3][step]}
      </Card>
    </>
  )
}
