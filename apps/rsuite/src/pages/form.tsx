import { useRef, useState, type ComponentProps } from "react"
import { Button, Checkbox, CheckboxGroup, CheckPicker, DatePicker, DateRangePicker, Form, Heading, Input, InputGroup, InputNumber, InputPicker, Panel, Radio, RadioGroup, Rate, RangeSlider, Schema, SelectPicker, Steps, TagInput, Text, Textarea, TimePicker, Toggle, Tooltip, Uploader as RsUploader, Whisper } from "rsuite"
import { Icon } from "@/components/icon"
import { PageHeader } from "./shared"

type FormValues = {
  name?: string
  count?: number
  email?: string
  type?: string
  region?: string
  members?: string[]
  tags?: string
  automation?: boolean
}
const required = (label: string, help = false) => <Form.ControlLabel>{label} <Text as="span" className="required-mark">*</Text>{help ? <Whisper speaker={<Tooltip>项目名称将展示给团队成员</Tooltip>}><Button size="xs" appearance="subtle" aria-label="帮助" style={{ marginLeft: 4, padding: 0 }}><Icon name="circle-help" /></Button></Whisper> : null}</Form.ControlLabel>
type LocalUploaderProps = Omit<ComponentProps<typeof RsUploader>, "action"> & { action?: string }
function Uploader({ action = "#", ...props }: LocalUploaderProps) { return <RsUploader action={action} {...props} /> }
export function FormPage() {
  const [step, setStep] = useState(0)
  const [done, setDone] = useState(false)
  const [values, setValues] = useState<FormValues>({})
  const formRef = useRef<{ check: () => boolean }>(null)
  const model = step === 0 ? Schema.Model({
    name: Schema.Types.StringType().isRequired("请输入项目名称"),
    email: Schema.Types.StringType().isEmail("请输入有效邮箱"),
  }) : undefined
  if (done) return <div className="page-stack"><PageHeader title="新建项目" /><Panel bordered style={{ textAlign: "center", padding: 40 }}><Icon name="check" size={36} /><Heading level={3}>项目创建成功</Heading><Text muted>你的项目已经准备就绪。</Text><br /><Button appearance="primary" onClick={() => setDone(false)}>再创建一个</Button></Panel></div>
  return <div className="page-stack"><PageHeader title="新建项目" description="按步骤填写项目资料。" /><Steps current={step} small><Steps.Item title="基本信息" /><Steps.Item title="详细配置" /><Steps.Item title="确认提交" /></Steps><Panel bordered><Form ref={formRef as never} fluid model={model} formValue={values} onChange={(next) => setValues(next as FormValues)}>
    {step === 0 ? <><Form.Group controlId="name">{required("项目名称", true)}<Form.Control name="name" accepter={Input} /></Form.Group><Form.Group><Form.ControlLabel>席位数量</Form.ControlLabel><Form.Control name="count" accepter={InputNumber} /></Form.Group><Form.Group><Form.ControlLabel>负责人邮箱</Form.ControlLabel><Form.Control name="email" accepter={Input} type="email" /></Form.Group><Form.Group><Form.ControlLabel>联系电话</Form.ControlLabel><InputGroup><SelectPicker data={[{ label: "+86", value: "+86" }, { label: "+1", value: "+1" }]} cleanable={false} style={{ width: 100 }} /><Input placeholder="手机号码" /></InputGroup></Form.Group><Form.Group><Form.ControlLabel>项目简介</Form.ControlLabel><Textarea rows={3} placeholder="最多 200 字" /><Form.HelpText>0 / 200</Form.HelpText></Form.Group><Form.Group><Form.ControlLabel>项目类型</Form.ControlLabel><RadioGroup name="type" inline><Radio value="web">Web</Radio><Radio value="mobile">移动端</Radio></RadioGroup></Form.Group><CheckboxGroup inline><Checkbox value="report">接收周报</Checkbox><Checkbox value="notify">接收通知</Checkbox></CheckboxGroup><br /><Form.Control name="automation" accepter={Toggle}>启用自动化</Form.Control></> : null}
    {step === 1 ? <><Form.Group><Form.ControlLabel>地区</Form.ControlLabel><Form.Control name="region" accepter={SelectPicker} data={["中国大陆", "新加坡", "法兰克福"].map((label) => ({ label, value: label }))} block /></Form.Group><Form.Group><Form.ControlLabel>团队成员</Form.ControlLabel><Form.Control name="members" accepter={CheckPicker} data={["林晓", "王子涵", "Alex Chen"].map((label) => ({ label, value: label }))} block /></Form.Group><Form.Group><Form.ControlLabel>标签</Form.ControlLabel><Form.Control name="tags" accepter={InputPicker} creatable data={["增长", "产品", "研发"].map((label) => ({ label, value: label }))} block /></Form.Group><div className="demo-row"><DatePicker placeholder="开始日期" /><TimePicker placeholder="时间" /><DateRangePicker placeholder="日期范围" /></div><Form.Group><Form.ControlLabel>预算区间</Form.ControlLabel><RangeSlider progress defaultValue={[20, 80]} /></Form.Group><Form.Group><Form.ControlLabel>评分</Form.ControlLabel><Rate defaultValue={4} /></Form.Group><Form.Group><Form.ControlLabel>颜色（原生回退）</Form.ControlLabel><InputGroup><InputGroup.Addon>#</InputGroup.Addon><input type="color" defaultValue="#3498ff" style={{ height: 36, width: 64 }} /></InputGroup></Form.Group><Uploader draggable autoUpload={false} listType="text"><div style={{ padding: 30 }}>拖拽文件到这里上传</div></Uploader><TagInput placeholder="添加标签" /><Form.HelpText>配置完成后可在设置中继续修改。</Form.HelpText></> : null}
    {step === 2 ? <><Heading level={5}>确认信息</Heading><dl><dt>项目名称</dt><dd>{values.name || "—"}</dd><dt>负责人</dt><dd>{values.email || "—"}</dd><dt>地区</dt><dd>{values.region || "—"}</dd><dt>团队成员</dt><dd>{values.members?.length ? values.members.join("、") : "—"}</dd><dt>自动化</dt><dd>{values.automation ? "已启用" : "未启用"}</dd></dl><Checkbox>我同意服务条款</Checkbox></> : null}
    <div style={{ display: "flex", justifyContent: "space-between", marginTop: 24 }}><Button disabled={step === 0} onClick={() => setStep((value) => value - 1)}>上一步</Button>{step < 2 ? <Button appearance="primary" onClick={() => { if (formRef.current?.check() !== false) setStep((value) => value + 1) }}>下一步</Button> : <Button appearance="primary" onClick={() => setDone(true)}>提交项目</Button>}</div>
  </Form></Panel></div>
}
