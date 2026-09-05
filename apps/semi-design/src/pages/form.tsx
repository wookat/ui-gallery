import { useRef, useState } from "react"
import { Button, Card, Checkbox, Descriptions, Form, Steps, Tooltip, Typography } from "@douyinfe/semi-ui"
import type { FormApi } from "@douyinfe/semi-ui/lib/es/form/interface"
import { Icon } from "@/icons"
import { PageHeader } from "./shared"

const { Text } = Typography
type Values = Record<string, unknown>
const stepMeta = [
  { title: "基本信息", description: "姓名、联系方式" },
  { title: "偏好设置", description: "计划、时间、标签" },
  { title: "确认提交", description: "核对并同意条款" },
]
const countries = [{ value: "+86", label: "🇨🇳 +86" }, { value: "+1", label: "🇺🇸 +1" }, { value: "+81", label: "🇯🇵 +81" }, { value: "+44", label: "🇬🇧 +44" }]
const cities = ["上海", "杭州", "北京", "深圳", "成都", "广州"]

function show(value: unknown): string {
  if (value == null || value === "") return "—"
  if (Array.isArray(value)) return value.length ? value.map(show).join("、") : "—"
  if (value instanceof Date) return value.toLocaleDateString("zh-CN")
  if (typeof value === "object") return JSON.stringify(value)
  return String(value)
}

export function FormPage() {
  const [step, setStep] = useState(0)
  const [values, setValues] = useState<Values>({})
  const [agreed, setAgreed] = useState(false)
  const [done, setDone] = useState(false)
  const api = useRef<FormApi<Values>>(null)

  const next = async () => {
    try {
      const current = await api.current!.validate()
      setValues((prev) => ({ ...prev, ...current }))
      setStep((s) => s + 1)
    } catch {
      /* validation errors are rendered inline */
    }
  }

  if (done) {
    return (
      <div className="acme-page">
        <Card style={{ maxWidth: 560, margin: "0 auto", textAlign: "center" }} bodyStyle={{ padding: 40 }}>
          <div style={{ fontSize: 48, color: "var(--semi-color-success)" }}><Icon name="circle-check" size={48} /></div>
          <Typography.Title heading={3}>提交成功</Typography.Title>
          <Text type="secondary">我们已收到 {show(values.name)} 的申请，稍后通过 {show(values.email)} 联系你。</Text>
          <div className="acme-row" style={{ justifyContent: "center", marginTop: 24 }}>
            <Button onClick={() => { setDone(false); setStep(0); setValues({}); setAgreed(false) }}>再填一份</Button>
            <Button theme="solid" onClick={() => (window.location.href = "/apps/semi-design/")}>返回仪表盘</Button>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="acme-page">
      <PageHeader title="新建申请" description="三步完成团队入驻申请。" />
      <Steps type="basic" current={step} size="small">{stepMeta.map((meta) => <Steps.Step key={meta.title} title={meta.title} description={meta.description} />)}</Steps>
      <Card style={{ maxWidth: 800, width: "100%", margin: "0 auto" }}>
        {step === 0 ? (
          <Form<Values> key="s0" getFormApi={(formApi) => (api.current = formApi)} initValues={values} labelPosition="top">
            <div className="acme-grid-2 acme-grid">
              <Form.Input field="name" label="姓名" placeholder="请输入姓名" rules={[{ required: true, message: "姓名为必填项" }]} />
              <Form.InputNumber field="teamSize" label={{ text: "团队规模", extra: <Tooltip content="用于估算席位"><Icon name="circle-help" size={14} /></Tooltip> }} min={1} max={9999} placeholder="人数" style={{ width: "100%" }} rules={[{ required: true, message: "请输入团队规模" }]} />
              <Form.Input field="email" label="工作邮箱" placeholder="name@company.com" rules={[{ required: true, message: "请输入邮箱" }, { type: "email", message: "邮箱格式不正确" }]} />
              <div className="acme-row" style={{ alignItems: "flex-end", flexWrap: "nowrap" }}>
                <Form.Select field="country" label="国家/地区" initValue="+86" style={{ width: 110 }} optionList={countries} />
                <Form.Input field="phone" label="手机号" placeholder="手机号码" style={{ flex: 1 }} rules={[{ required: true, message: "请输入手机号" }, { pattern: /^\d{6,15}$/, message: "仅允许 6-15 位数字" }]} />
              </div>
            </div>
            <Form.TextArea field="bio" label="团队简介" placeholder="一句话介绍你的团队" maxCount={200} rows={3} />
            <Form.RadioGroup field="role" label="你的角色" initValue="admin" rules={[{ required: true, message: "请选择角色" }]}>
              <Form.Radio value="owner">Owner</Form.Radio><Form.Radio value="admin">Admin</Form.Radio><Form.Radio value="member">Member</Form.Radio>
            </Form.RadioGroup>
            <Form.CheckboxGroup field="interests" label="感兴趣的能力" direction="horizontal" initValue={["dashboard"]}>
              <Form.Checkbox value="dashboard">看板</Form.Checkbox><Form.Checkbox value="orders">订单</Form.Checkbox><Form.Checkbox value="ai">AI 助手</Form.Checkbox><Form.Checkbox value="api">开放 API</Form.Checkbox>
            </Form.CheckboxGroup>
            <Form.Switch field="newsletter" label="订阅产品更新" initValue />
          </Form>
        ) : null}
        {step === 1 ? (
          <Form<Values> key="s1" getFormApi={(formApi) => (api.current = formApi)} initValues={values} labelPosition="top">
            <div className="acme-grid-2 acme-grid">
              <Form.Select field="plan" label="计划" placeholder="选择计划" rules={[{ required: true, message: "请选择计划" }]} optionList={[{ value: "Starter", label: "Starter" }, { value: "Pro", label: "Pro" }, { value: "Enterprise", label: "Enterprise" }]} />
              <Form.Select field="channels" label="接入渠道" multiple placeholder="可多选" maxTagCount={2} optionList={["web", "ios", "android", "api"].map((value) => ({ value, label: value }))} />
              <Form.AutoComplete field="city" label="城市" placeholder="输入城市名" data={cities} showClear />
              <Form.Cascader field="region" label="所在区域" placeholder="选择区域" treeData={[{ label: "华东", value: "east", children: [{ label: "上海", value: "sh" }, { label: "杭州", value: "hz" }] }, { label: "华北", value: "north", children: [{ label: "北京", value: "bj" }] }]} />
              <Form.DatePicker field="startDate" label="期望开始日期" style={{ width: "100%" }} rules={[{ required: true, message: "请选择日期" }]} />
              <Form.TimePicker field="meetingTime" label="偏好联系时间" format="HH:mm" style={{ width: "100%" }} />
              <Form.DatePicker field="trialRange" type="dateRange" label="试用周期" style={{ width: "100%" }} />
              <Form.TagInput field="tags" label="标签" placeholder="回车添加" initValue={["SaaS"]} />
            </div>
            <Form.Slider field="budget" label="月预算（¥）" min={0} max={5000} step={100} initValue={1000} marks={{ 0: "0", 2500: "2.5k", 5000: "5k" }} />
            <div className="acme-grid-2 acme-grid">
              <Form.Rating field="rating" label="对现有工具的满意度" initValue={3} allowHalf />
              <Form.Select field="color" label="品牌色" initValue="blue" optionList={["blue", "green", "orange", "purple"].map((value) => ({ value, label: value }))} />
            </div>
            <Form.Upload field="logo" label="团队 Logo" action="" draggable uploadTrigger="custom" accept="image/*" dragMainText="点击或拖拽上传" dragSubText="PNG / SVG，不超过 2MB" />
          </Form>
        ) : null}
        {step === 2 ? (
          <div className="acme-page" style={{ gap: 16 }}>
            <Descriptions align="left" data={[
              { key: "姓名", value: show(values.name) }, { key: "邮箱", value: show(values.email) }, { key: "手机", value: `${show(values.country)} ${show(values.phone)}` },
              { key: "团队规模", value: show(values.teamSize) }, { key: "角色", value: show(values.role) }, { key: "计划", value: show(values.plan) },
              { key: "渠道", value: show(values.channels) }, { key: "开始日期", value: show(values.startDate) }, { key: "标签", value: show(values.tags) }, { key: "月预算", value: `¥${show(values.budget)}` },
            ]} />
            <Checkbox checked={agreed} onChange={(event) => setAgreed(Boolean(event.target.checked))}>我已阅读并同意服务条款与隐私政策</Checkbox>
          </div>
        ) : null}
        <div className="acme-between" style={{ marginTop: 24 }}>
          <Button disabled={step === 0} onClick={() => setStep((s) => s - 1)} icon={<Icon name="arrow-left" />}>上一步</Button>
          {step < 2 ? <Button theme="solid" onClick={next}>下一步 <Icon name="arrow-right" /></Button> : <Button theme="solid" disabled={!agreed} onClick={() => setDone(true)}>提交申请</Button>}
        </div>
      </Card>
    </div>
  )
}
