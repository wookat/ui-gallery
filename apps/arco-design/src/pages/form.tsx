import { useState } from "react"
import { Button, Card, Cascader, Checkbox, ColorPicker, DatePicker, Descriptions, Form, Input, InputNumber, Message, Rate, Radio, Select, Slider, Space, Steps, Switch, TimePicker, Upload } from "@arco-design/web-react"
import { Icon } from "@/components/icon"
import { PageHeader } from "./shared"

export function FormPage() {
  const [step, setStep] = useState(1)
  const [form] = Form.useForm()
  const next = async () => {
    if (step < 3) setStep(step + 1)
    else Message.success("项目创建成功")
  }
  return (
    <>
      <PageHeader title="新建项目" description="填写信息，创建一个新的工作项目。" />
      <Card>
        <Steps current={step - 1}><Steps.Step title="基本信息" /><Steps.Step title="详细配置" /><Steps.Step title="确认" /></Steps>
      </Card>
      <Card>
        {step < 3 ? <Form form={form} layout="vertical" onSubmit={next}>
          {step === 1 ? <><Form.Item label="项目名称" field="name" rules={[{ required: true, message: "请输入项目名称" }]}><Input placeholder="例如：Q4 增长计划" /></Form.Item><Form.Item label="预算" field="budget" rules={[{ required: true, message: "请输入预算" }]}><InputNumber min={0} precision={2} style={{ width: "100%" }} /></Form.Item><Form.Item label="项目类型" field="type" rules={[{ required: true, message: "请选择项目类型" }]}><Radio.Group><Radio value="internal">内部项目</Radio><Radio value="client">客户项目</Radio></Radio.Group></Form.Item><Form.Item label="标签" field="tags"><Checkbox.Group options={["增长", "设计", "研发", "营销"]} /></Form.Item><Form.Item label="启用自动化"><Switch defaultChecked /></Form.Item><Form.Item label="项目描述" field="description"><Input.TextArea showWordLimit maxLength={200} /></Form.Item></> : <><Form.Item label="所属团队" field="team" rules={[{ required: true, message: "请选择所属团队" }]}><Select placeholder="选择团队" options={["产品团队", "增长团队", "客户成功"].map((label) => ({ label, value: label }))} /></Form.Item><Form.Item label="地区" field="region"><Cascader options={[{ label: "中国", value: "cn", children: [{ label: "上海", value: "sh" }, { label: "北京", value: "bj" }] }, { label: "海外", value: "overseas", children: [{ label: "新加坡", value: "sg" }] }]} /></Form.Item><Form.Item label="开始日期" field="date"><DatePicker /></Form.Item><Form.Item label="工作时间"><TimePicker /></Form.Item><Form.Item label="时间范围"><DatePicker.RangePicker /></Form.Item><Form.Item label="优先级"><Slider defaultValue={60} marks={{ 0: "低", 50: "中", 100: "高" }} /></Form.Item><Form.Item label="评分"><Rate defaultValue={4} /></Form.Item><Form.Item label="主题色"><ColorPicker defaultValue="#165DFF" /></Form.Item><Form.Item label="上传文件"><Upload drag multiple><div><Icon name="upload" size={28} /><p>拖拽文件到此处，或点击上传</p></div></Upload></Form.Item></>}
          <Space><Button type="secondary" disabled={step === 1} onClick={() => setStep(step - 1)}>上一步</Button><Button type="primary" htmlType="submit">{step === 2 ? "下一步" : "下一步"}</Button></Space>
        </Form> : <div className="stack"><Descriptions column={1} data={[{ label: "项目名称", value: form.getFieldValue("name") || "Q4 增长计划" }, { label: "预算", value: `${form.getFieldValue("budget") || 0} 元` }, { label: "团队", value: form.getFieldValue("team") || "产品团队" }]} /><Checkbox>我同意服务条款和隐私政策</Checkbox><Button type="primary" onClick={next}>提交项目</Button><Button onClick={() => setStep(2)}>返回修改</Button></div>}
      </Card>
    </>
  )
}
