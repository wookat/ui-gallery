import { useState } from "react"
import { AutoComplete, Button, Card, Checkbox, ColorPicker, DatePicker, DateRangePicker, Descriptions, Form, Input, InputNumber, Rate, Select, Slider, Steps, Switch, TagInput, Textarea, TimePicker, Tooltip, Upload, Radio, Empty, Typography } from "tdesign-react"
import { Icon } from "@/components/icon"
import { useIsMobile } from "@/url-settings"

export function FormPage() {
  const [step, setStep] = useState(0)
  const [success, setSuccess] = useState(false)
  const [form] = Form.useForm()
  const isMobile = useIsMobile()
  const next = async () => {
    try {
      await form.validate()
      setStep(Math.min(2, step + 1))
    } catch {
      // TDesign renders field errors inline.
    }
  }
  if (success) return <Card><Empty type="success" title="项目创建成功" description="项目已创建，可以继续邀请成员。" action={<Button theme="primary" onClick={() => { setSuccess(false); setStep(0) }}>创建另一个项目</Button>} /></Card>
  return (
    <div className="stack">
      <div className="page-heading"><div><Typography.Title level="h2">新建项目</Typography.Title><Typography.Paragraph>按步骤配置你的新工作区。</Typography.Paragraph></div></div>
      <Steps current={step}><Steps.StepItem title="基本信息" content="项目与负责人" /><Steps.StepItem title="详细配置" content="偏好与资源" /><Steps.StepItem title="确认" content="检查并提交" /></Steps>
      <Card>
        <Form form={form} layout="vertical" requiredMark onSubmit={() => setSuccess(true)}>
          {step === 0 && <div className="grid-two">
            <Form.FormItem label="项目名称" name="name" rules={[{ required: true, message: "请输入项目名称" }]}><Input placeholder="例如：增长实验室" /></Form.FormItem>
            <Form.FormItem label="席位数" name="seats" rules={[{ required: true, message: "请输入席位数" }, { min: 1, message: "至少 1 个席位" }]}><InputNumber min={1} max={1000} size={isMobile ? "large" : "medium"} /></Form.FormItem>
            <Form.FormItem label="联系邮箱" name="email" rules={[{ required: true, message: "请输入邮箱" }, { email: true, message: "邮箱格式不正确" }]}><Input placeholder="team@example.com" /></Form.FormItem>
            <Form.FormItem label="联系电话" name="phone" rules={[{ required: true, message: "请输入手机号" }]}><Input placeholder="+86 138 0000 0000" /></Form.FormItem>
            <Form.FormItem label="项目简介" name="description" rules={[{ required: true, message: "请填写简介" }]}><Textarea maxlength={200} maxcharacter={200} placeholder="介绍一下你的项目" /></Form.FormItem>
            <Form.FormItem label="可见性" name="visibility" initialData="team"><Radio.Group><Radio value="team">团队可见</Radio><Radio value="private">仅自己</Radio></Radio.Group></Form.FormItem>
            <Form.FormItem label="功能模块" name="modules"><Checkbox.Group options={["订单", "看板", "AI 助手"]} /></Form.FormItem>
            <Form.FormItem label="自动化通知" name="notify" initialData><Switch /></Form.FormItem>
          </div>}
          {step === 1 && <div className="grid-two">
            <Form.FormItem label="地区" name="region" rules={[{ required: true, message: "请选择地区" }]}><Select options={["中国大陆", "新加坡", "法兰克福"].map((label) => ({ label, value: label }))} placeholder="选择地区" /></Form.FormItem>
            <Form.FormItem label="成员" name="members"><Select multiple options={["林晓", "王子涵", "Alex Chen"].map((label) => ({ label, value: label }))} placeholder="选择成员" /></Form.FormItem>
            <Form.FormItem label={<span>工作流 <Tooltip content="可以稍后修改"><Icon name="circle-help" /></Tooltip></span>} name="workflow"><AutoComplete options={["标准工作流", "敏捷工作流", "审批工作流"]} placeholder="输入或选择" /></Form.FormItem>
            <Form.FormItem label="开始日期" name="date"><DatePicker /></Form.FormItem>
            <Form.FormItem label="开始时间" name="time"><TimePicker /></Form.FormItem>
            <Form.FormItem label="周期范围" name="range"><DateRangePicker /></Form.FormItem>
            <Form.FormItem label="预算范围" name="budget"><Slider range defaultValue={[30, 70]} /></Form.FormItem>
            <Form.FormItem label="优先级"><Rate defaultValue={4} /></Form.FormItem>
            <Form.FormItem label="品牌色"><ColorPicker defaultValue="var(--td-brand-color)" /></Form.FormItem>
            <Form.FormItem label="项目文件" help="支持 PDF、PNG，最多 10MB"><Upload draggable autoUpload={false} /></Form.FormItem>
            <Form.FormItem label="标签"><TagInput defaultValue={["增长"]} placeholder="输入后回车" /></Form.FormItem>
          </div>}
          {step === 2 && <div className="stack"><Descriptions bordered column={1}><Descriptions.DescriptionsItem label="项目名称">增长实验室</Descriptions.DescriptionsItem><Descriptions.DescriptionsItem label="负责人">林晓</Descriptions.DescriptionsItem><Descriptions.DescriptionsItem label="配置">订单、看板、AI 助手</Descriptions.DescriptionsItem></Descriptions><Checkbox>我确认以上信息准确，并同意服务条款</Checkbox></div>}
          <div className="inline" style={{ justifyContent: "space-between", marginTop: 24 }}><Button disabled={step === 0} onClick={() => setStep(step - 1)}>上一步</Button>{step < 2 ? <Button theme="primary" onClick={next}>下一步</Button> : <Button theme="primary" type="submit">提交项目</Button>}</div>
        </Form>
      </Card>
    </div>
  )
}
