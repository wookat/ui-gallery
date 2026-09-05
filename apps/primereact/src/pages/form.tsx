import { useState } from "react"
import { AutoComplete } from "primereact/autocomplete"
import { Calendar } from "primereact/calendar"
import { Card } from "primereact/card"
import { Checkbox } from "primereact/checkbox"
import { Chips } from "primereact/chips"
import { ColorPicker } from "primereact/colorpicker"
import { Dropdown } from "primereact/dropdown"
import { FileUpload } from "primereact/fileupload"
import { InputMask } from "primereact/inputmask"
import { InputNumber } from "primereact/inputnumber"
import { InputSwitch } from "primereact/inputswitch"
import { InputTextarea } from "primereact/inputtextarea"
import { InputText } from "primereact/inputtext"
import { Knob } from "primereact/knob"
import { Rating } from "primereact/rating"
import { RadioButton } from "primereact/radiobutton"
import { Slider } from "primereact/slider"
import { Stepper } from "primereact/stepper"
import { StepperPanel } from "primereact/stepperpanel"
import { Button } from "primereact/button"
import { Message } from "primereact/message"
import { Icon } from "@/components/icon"
import { PageHeader } from "@/components/shared"

function Field({ label, children, required }: { label: string; children: React.ReactNode; required?: boolean }) { return <label className="flex flex-column gap-2"><span>{label}{required ? <b className="p-error"> *</b> : null}</span>{children}</label> }
export function FormPage() {
  const [success, setSuccess] = useState(false), [agree, setAgree] = useState(false), [tags, setTags] = useState<string[]>([])
  if (success) return <div className="flex flex-column gap-4"><PageHeader title="新建项目" description="项目已经创建。" /><Card className="text-center"><Icon name="check" size={48} className="text-green-500" /><h2>项目创建成功</h2><Message severity="success" text="你的工作区已经准备就绪。" /><Button label="返回仪表盘" className="mt-4" /></Card></div>
  return <div className="flex flex-column gap-5"><PageHeader title="新建项目" description="用三步完成项目配置。" /><Stepper linear><StepperPanel header="基本信息"><div className="grid p-3"><div className="col-12 md:col-6 flex flex-column gap-4"><Field label="项目名称" required><InputText placeholder="例如：增长分析" /></Field><Field label="预算" required><InputNumber mode="currency" currency="CNY" locale="zh-CN" /></Field><Field label="邮箱"><InputText type="email" placeholder="team@acme.dev" /></Field><Field label="电话"><div className="flex gap-2 w-full"><Dropdown options={["+86", "+1", "+81"]} value="+86" className="w-8rem flex-shrink-0" /><InputMask mask="999 9999 9999" placeholder="手机号码" className="flex-1 w-full" style={{ minWidth: 0 }} /></div></Field></div><div className="col-12 md:col-6 flex flex-column gap-4"><Field label="项目描述"><InputTextarea rows={5} autoResize maxLength={200} placeholder="描述项目目标..." /><small className="muted">0 / 200</small></Field><Field label="项目类型"><div className="flex gap-3 flex-wrap"><label><RadioButton name="type" value="pro" /> Pro</label><label><RadioButton name="type" value="team" /> Team</label></div></Field><Field label="通知"><div className="flex gap-3"><label><Checkbox checked={false} /> 邮件</label><label><Checkbox checked={false} /> 推送</label><InputSwitch checked={false} /></div></Field></div></div><div className="flex justify-content-end"><Button label="下一步" iconPos="right" icon={<Icon name="arrow-right" />} /></div></StepperPanel><StepperPanel header="详细配置"><div className="grid p-3"><div className="col-12 md:col-6 flex flex-column gap-4"><Field label="计划"><Dropdown options={["Starter", "Pro", "Enterprise"]} placeholder="选择计划" /></Field><Field label="成员"><AutoComplete suggestions={["林晓", "王子涵", "Alex Chen"]} placeholder="搜索成员" /></Field><Field label="日期时间"><Calendar showTime showIcon /></Field><Field label="日期范围"><Calendar selectionMode="range" readOnlyInput /></Field></div><div className="col-12 md:col-6 flex flex-column gap-4"><Field label="采样比例"><Slider value={60} /><small className="muted">60%</small></Field><Field label="评分"><Rating value={4} /></Field><Field label="颜色"><ColorPicker /></Field><Field label="标签"><Chips value={tags} onChange={(e) => setTags(e.value ?? [])} /></Field><FileUpload mode="advanced" name="demo[]" chooseLabel="选择文件" uploadLabel="上传" cancelLabel="取消" customUpload uploadHandler={() => undefined} /></div></div><div className="flex justify-content-between"><Button label="上一步" outlined /><Button label="下一步" icon={<Icon name="arrow-right" />} /></div></StepperPanel><StepperPanel header="确认提交"><div className="grid p-3"><div className="col-12 md:col-7"><h3>配置摘要</h3><dl className="grid"><dt className="col-5 muted">项目名称</dt><dd className="col-7">增长分析</dd><dt className="col-5 muted">计划</dt><dd className="col-7">Pro</dd><dt className="col-5 muted">通知</dt><dd className="col-7">邮件、推送</dd></dl></div><div className="col-12 md:col-5 flex align-items-center justify-content-center"><Knob value={82} valueTemplate="{value}%" /></div></div><label className="flex align-items-center gap-2 p-3"><Checkbox checked={agree} onChange={(e) => setAgree(Boolean(e.checked))} />我同意服务条款与隐私政策</label><div className="flex justify-content-between"><Button label="上一步" outlined /><Button label="提交项目" disabled={!agree} onClick={() => setSuccess(true)} /></div></StepperPanel></Stepper></div>
}
