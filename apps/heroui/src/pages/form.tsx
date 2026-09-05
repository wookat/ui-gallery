import { useState, type ChangeEvent, type DragEvent } from "react"
import { Button, Calendar, Card, Checkbox, CheckboxGroup, Chip, ColorArea, ColorPicker, ColorSlider, ColorSwatch, ComboBox, DateField, DatePicker, DateRangePicker, Description, EmptyState, Input, InputGroup, Label, ListBox, NumberField, ProgressBar, Radio, RadioGroup, RangeCalendar, Select, Slider, Switch, Tabs, Tag, TagGroup, TextArea, TextField, TimeField, ToggleButton, ToggleButtonGroup, Tooltip } from "@heroui/react"
import { Icon } from "@/components/icon"
import team from "@ui-gallery/spec/mock/team.json"
import { PageHeader } from "./shared"

const options = [{ value: "pro", label: "Pro plan" }, { value: "team", label: "Team plan" }]
const countryCodes = [{ id: "+86", label: "+86 中国" }, { id: "+1", label: "+1 美国" }, { id: "+44", label: "+44 英国" }, { id: "+81", label: "+81 日本" }]
const timezones = [{ id: "Asia/Shanghai", label: "Asia/Shanghai (UTC+8)" }, { id: "Asia/Tokyo", label: "Asia/Tokyo (UTC+9)" }, { id: "Europe/London", label: "Europe/London (UTC+0)" }, { id: "America/New_York", label: "America/New_York (UTC-5)" }]
const DESCRIPTION_MAX = 200
type Step = "details" | "config" | "review" | "success"

function RequiredLabel({ children }: { children: string }) {
  return <Label>{children}<span aria-hidden="true" className="ml-0.5 text-danger">*</span></Label>
}

function HelpTip({ text }: { text: string }) {
  return (
    <Tooltip>
      <Button isIconOnly variant="ghost" size="sm" className="size-6 min-w-6 text-muted" aria-label="字段说明"><Icon name="info" size={14} /></Button>
      <Tooltip.Content>{text}</Tooltip.Content>
    </Tooltip>
  )
}

export function FormPage() {
  const [step, setStep] = useState<Step>("details")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [countryCode, setCountryCode] = useState("+86")
  const [description, setDescription] = useState("")
  const [seats, setSeats] = useState(5)
  const [plan, setPlan] = useState("team")
  const [modules, setModules] = useState<string[]>(["analytics"])
  const [publicProject, setPublicProject] = useState(false)
  const [rating, setRating] = useState(4)
  const [tags, setTags] = useState<string[]>(["growth", "analytics"])
  const [tagDraft, setTagDraft] = useState("")
  const [files, setFiles] = useState<{ name: string; size: number }[]>([])
  const [dragging, setDragging] = useState(false)
  const [agreed, setAgreed] = useState(false)
  const [touched, setTouched] = useState(false)

  const nameError = name.trim().length < 2 ? "名称至少 2 个字符" : null
  const emailError = !email.includes("@") ? "请输入有效邮箱" : null
  const phoneError = !/^\d{6,15}$/.test(phone) ? "请输入 6-15 位数字" : null
  const descriptionError = description.length > DESCRIPTION_MAX ? `最多 ${DESCRIPTION_MAX} 字` : null
  const detailsValid = !nameError && !emailError && !phoneError && !descriptionError
  const showError = (error: string | null) => (touched && error ? error : null)

  const nextFromDetails = () => {
    setTouched(true)
    if (detailsValid) setStep("config")
  }

  const addFiles = (list: FileList | null) => {
    if (!list) return
    setFiles((prev) => [...prev, ...Array.from(list).map((f) => ({ name: f.name, size: f.size }))])
  }
  const onDrop = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault()
    setDragging(false)
    addFiles(event.dataTransfer.files)
  }
  const addTag = () => {
    const value = tagDraft.trim()
    if (value && !tags.includes(value)) setTags((prev) => [...prev, value])
    setTagDraft("")
  }

  return (
    <div className="min-w-0 space-y-6">
      <PageHeader title="创建项目" description="用三步完成一个新的工作区配置。" />
      <Tabs selectedKey={step} onSelectionChange={(key) => setStep(key as Step)} className="min-w-0">
        <Tabs.ListContainer className="max-w-full overflow-x-auto">
          <Tabs.List aria-label="创建步骤" className="w-full max-w-full">
            <Tabs.Tab id="details" className="min-w-0 flex-1 px-2 text-xs sm:flex-none sm:px-3 sm:text-sm">1. 基本信息<Tabs.Indicator /></Tabs.Tab>
            <Tabs.Tab id="config" className="min-w-0 flex-1 px-2 text-xs sm:flex-none sm:px-3 sm:text-sm">2. 详细配置<Tabs.Indicator /></Tabs.Tab>
            <Tabs.Tab id="review" className="min-w-0 flex-1 px-2 text-xs sm:flex-none sm:px-3 sm:text-sm">3. 确认提交<Tabs.Indicator /></Tabs.Tab>
            <Tabs.Tab id="success" isDisabled={step !== "success"} className="min-w-0 flex-1 px-2 text-xs sm:flex-none sm:px-3 sm:text-sm">完成<Tabs.Indicator /></Tabs.Tab>
          </Tabs.List>
        </Tabs.ListContainer>

        <Tabs.Panel id="details" className="min-w-0">
          <Card className="min-w-0">
            <Card.Header><Card.Title>基本信息</Card.Title><Card.Description>告诉我们项目的基础信息。带 * 的为必填项。</Card.Description></Card.Header>
            <Card.Content className="grid min-w-0 gap-5 sm:grid-cols-2">
              <TextField isRequired value={name} onChange={setName} isInvalid={!!showError(nameError)} className="min-w-0">
                <RequiredLabel>项目名称</RequiredLabel>
                <Input placeholder="例如：增长分析" className="w-full" />
                {showError(nameError) ? <Description className="text-danger">{nameError}</Description> : <Description>用于在控制台中展示。</Description>}
              </TextField>
              <NumberField value={seats} onChange={setSeats} minValue={1} maxValue={500} className="min-w-0">
                <Label>成员席位</Label>
                <NumberField.Group><NumberField.DecrementButton /><NumberField.Input /><NumberField.IncrementButton /></NumberField.Group>
                <Description>1 - 500 之间。</Description>
              </NumberField>
              <TextField isRequired type="email" value={email} onChange={setEmail} isInvalid={!!showError(emailError)} className="min-w-0">
                <RequiredLabel>联系邮箱</RequiredLabel>
                <Input placeholder="you@acme.dev" className="w-full" />
                {showError(emailError) ? <Description className="text-danger">{emailError}</Description> : <Description>用于接收项目通知。</Description>}
              </TextField>
              <div className="grid min-w-0 gap-1.5">
                <RequiredLabel>联系电话</RequiredLabel>
                <div className="flex min-w-0 gap-2">
                  <Select aria-label="国家码" value={countryCode} onChange={(key) => setCountryCode(String(key))} className="w-28 shrink-0">
                    <Select.Trigger><Select.Value /><Select.Indicator /></Select.Trigger>
                    <Select.Popover><ListBox>{countryCodes.map((c) => <ListBox.Item key={c.id} id={c.id} textValue={c.id}>{c.label}<ListBox.ItemIndicator /></ListBox.Item>)}</ListBox></Select.Popover>
                  </Select>
                  <TextField aria-label="电话号码" type="tel" value={phone} onChange={setPhone} isInvalid={!!showError(phoneError)} className="min-w-0 flex-1">
                    <Input placeholder="13800000000" className="w-full" />
                  </TextField>
                </div>
                {showError(phoneError) ? <Description className="text-danger">{phoneError}</Description> : <Description>仅数字，不含区号分隔符。</Description>}
              </div>
              <TextField value={description} onChange={setDescription} isInvalid={!!descriptionError} className="min-w-0 sm:col-span-2">
                <Label>项目描述</Label>
                <TextArea placeholder="简单描述项目目标..." className="w-full" />
                <div className="flex items-center justify-between gap-2">
                  <Description className={descriptionError ? "text-danger" : undefined}>{descriptionError ?? "可选。"}</Description>
                  <span className={`text-xs ${descriptionError ? "text-danger" : "text-muted"}`} aria-live="polite">{description.length}/{DESCRIPTION_MAX}</span>
                </div>
              </TextField>
              <RadioGroup value={plan} onChange={setPlan} className="min-w-0">
                <Label>项目可见性</Label>
                <Radio value="team"><Radio.Control><Radio.Indicator /></Radio.Control><Radio.Content><Label>团队内可见</Label></Radio.Content></Radio>
                <Radio value="org"><Radio.Control><Radio.Indicator /></Radio.Control><Radio.Content><Label>组织内可见</Label></Radio.Content></Radio>
                <Radio value="pro"><Radio.Control><Radio.Indicator /></Radio.Control><Radio.Content><Label>仅自己</Label></Radio.Content></Radio>
              </RadioGroup>
              <CheckboxGroup value={modules} onChange={setModules} className="min-w-0">
                <Label>启用模块</Label>
                <Checkbox value="analytics"><Checkbox.Content><Checkbox.Control><Checkbox.Indicator /></Checkbox.Control><Label>数据分析</Label></Checkbox.Content></Checkbox>
                <Checkbox value="billing"><Checkbox.Content><Checkbox.Control><Checkbox.Indicator /></Checkbox.Control><Label>计费</Label></Checkbox.Content></Checkbox>
                <Checkbox value="chat"><Checkbox.Content><Checkbox.Control><Checkbox.Indicator /></Checkbox.Control><Label>AI 助手</Label></Checkbox.Content></Checkbox>
              </CheckboxGroup>
              <div className="flex items-center justify-between gap-3 rounded-lg border border-border p-4 sm:col-span-2">
                <div><p className="font-medium">公开项目</p><p className="text-sm text-muted">允许通过链接访问只读视图</p></div>
                <Switch isSelected={publicProject} onChange={setPublicProject} aria-label="公开项目"><Switch.Control><Switch.Thumb /></Switch.Control></Switch>
              </div>
              <div className="flex justify-end sm:col-span-2"><Button onPress={nextFromDetails}>下一步<Icon name="arrow-right" size={16} /></Button></div>
            </Card.Content>
          </Card>
        </Tabs.Panel>

        <Tabs.Panel id="config" className="min-w-0">
          <Card className="min-w-0">
            <Card.Header><Card.Title>详细配置</Card.Title><Card.Description>选择计划、时间、外观与附件。</Card.Description></Card.Header>
            <Card.Content className="grid min-w-0 gap-5 sm:grid-cols-2">
              <Select defaultValue="daily" className="min-w-0">
                <Label>通知频率</Label>
                <Select.Trigger><Select.Value /><Select.Indicator /></Select.Trigger>
                <Select.Popover><ListBox><ListBox.Item id="daily" textValue="每日">每日<ListBox.ItemIndicator /></ListBox.Item><ListBox.Item id="weekly" textValue="每周">每周<ListBox.ItemIndicator /></ListBox.Item><ListBox.Item id="never" textValue="从不">从不<ListBox.ItemIndicator /></ListBox.Item></ListBox></Select.Popover>
              </Select>
              <Select selectionMode="multiple" defaultValue={[team[0].name]} className="min-w-0">
                <Label>负责人（多选）</Label>
                <Select.Trigger><Select.Value /><Select.Indicator /></Select.Trigger>
                <Select.Popover><ListBox>{team.map((m) => <ListBox.Item key={m.email} id={m.name} textValue={m.name}>{m.name}<ListBox.ItemIndicator /></ListBox.Item>)}</ListBox></Select.Popover>
              </Select>
              <ComboBox defaultItems={options} defaultSelectedKey="team" className="min-w-0">
                <Label>项目类型</Label>
                <ComboBox.InputGroup><Input placeholder="搜索方案" /><ComboBox.Trigger /></ComboBox.InputGroup>
                <ComboBox.Popover><ListBox>{(item: (typeof options)[number]) => <ListBox.Item id={item.value} textValue={item.label}>{item.label}<ListBox.ItemIndicator /></ListBox.Item>}</ListBox></ComboBox.Popover>
              </ComboBox>
              <ComboBox defaultItems={timezones} defaultSelectedKey="Asia/Shanghai" className="min-w-0">
                <Label>时区</Label>
                <ComboBox.InputGroup><Input placeholder="搜索时区" /><ComboBox.Trigger /></ComboBox.InputGroup>
                <ComboBox.Popover><ListBox>{(item: (typeof timezones)[number]) => <ListBox.Item id={item.id} textValue={item.label}>{item.label}<ListBox.ItemIndicator /></ListBox.Item>}</ListBox></ComboBox.Popover>
              </ComboBox>
              <DatePicker className="min-w-0">
                <Label>开始日期</Label>
                <DateField.Group>
                  <DateField.Input>{(segment) => <DateField.Segment segment={segment} />}</DateField.Input>
                  <DateField.Suffix><DatePicker.Trigger><DatePicker.TriggerIndicator /></DatePicker.Trigger></DateField.Suffix>
                </DateField.Group>
                <DatePicker.Popover>
                  <Calendar aria-label="选择日期">
                    <Calendar.Header><Calendar.Heading /><Calendar.NavButton slot="previous" /><Calendar.NavButton slot="next" /></Calendar.Header>
                    <Calendar.Grid>
                      <Calendar.GridHeader>{(day) => <Calendar.HeaderCell>{day}</Calendar.HeaderCell>}</Calendar.GridHeader>
                      <Calendar.GridBody>{(date) => <Calendar.Cell date={date} />}</Calendar.GridBody>
                    </Calendar.Grid>
                  </Calendar>
                </DatePicker.Popover>
              </DatePicker>
              <TimeField className="min-w-0">
                <Label>提醒时间</Label>
                <TimeField.Group><TimeField.Input>{(segment) => <TimeField.Segment segment={segment} />}</TimeField.Input></TimeField.Group>
                <Description>每日提醒的本地时间。</Description>
              </TimeField>
              <DateRangePicker className="min-w-0 sm:col-span-2">
                <Label>活动周期</Label>
                <DateField.Group>
                  <DateField.InputContainer>
                    <DateField.Input slot="start">{(segment) => <DateField.Segment segment={segment} />}</DateField.Input>
                    <DateRangePicker.RangeSeparator />
                    <DateField.Input slot="end">{(segment) => <DateField.Segment segment={segment} />}</DateField.Input>
                  </DateField.InputContainer>
                  <DateField.Suffix><DateRangePicker.Trigger><DateRangePicker.TriggerIndicator /></DateRangePicker.Trigger></DateField.Suffix>
                </DateField.Group>
                <DateRangePicker.Popover>
                  <RangeCalendar aria-label="活动周期">
                    <RangeCalendar.Header><RangeCalendar.Heading /><RangeCalendar.NavButton slot="previous" /><RangeCalendar.NavButton slot="next" /></RangeCalendar.Header>
                    <RangeCalendar.Grid>
                      <RangeCalendar.GridHeader>{(day) => <RangeCalendar.HeaderCell>{day}</RangeCalendar.HeaderCell>}</RangeCalendar.GridHeader>
                      <RangeCalendar.GridBody>{(date) => <RangeCalendar.Cell date={date} />}</RangeCalendar.GridBody>
                    </RangeCalendar.Grid>
                  </RangeCalendar>
                </DateRangePicker.Popover>
              </DateRangePicker>
              <Slider defaultValue={[20, 80]} minValue={0} maxValue={100} step={1} className="min-w-0 sm:col-span-2">
                <div className="flex items-center gap-1"><Label>采样区间</Label><HelpTip text="只对该区间内的事件采样。" /></div>
                <Slider.Output />
                <Slider.Track><Slider.Fill /><Slider.Thumb index={0} /><Slider.Thumb index={1} /></Slider.Track>
              </Slider>
              <div className="grid min-w-0 gap-1.5">
                <Label>优先级评分</Label>
                <ToggleButtonGroup selectionMode="single" selectedKeys={[String(rating)]} onSelectionChange={(keys) => { const [key] = [...keys]; if (key !== undefined) setRating(Number(key)) }} aria-label="评分">
                  {[1, 2, 3, 4, 5].map((v) => <ToggleButton key={v} id={String(v)} isIconOnly aria-label={`${v} 星`} className={v <= rating ? "text-warning" : "text-muted"}><Icon name="star" size={16} /></ToggleButton>)}
                </ToggleButtonGroup>
                <Description>{rating} / 5</Description>
              </div>
              <div className="grid min-w-0 gap-1.5">
                <Label>主题色</Label>
                <ColorPicker defaultValue="#006fee">
                  <ColorPicker.Trigger><ColorSwatch /><Label>选择颜色</Label></ColorPicker.Trigger>
                  <ColorPicker.Popover>
                    <ColorArea colorSpace="hsb" xChannel="saturation" yChannel="brightness"><ColorArea.Thumb /></ColorArea>
                    <ColorSlider channel="hue" colorSpace="hsb"><ColorSlider.Track><ColorSlider.Thumb /></ColorSlider.Track></ColorSlider>
                  </ColorPicker.Popover>
                </ColorPicker>
                <Description>用于项目图标与图表主色。</Description>
              </div>
              <div className="grid min-w-0 gap-2 sm:col-span-2">
                <Label>附件</Label>
                <label
                  className={`flex cursor-pointer flex-col items-center gap-2 rounded-xl border border-dashed p-6 text-sm text-muted transition-colors ${dragging ? "border-accent bg-accent-soft" : "border-border hover:bg-surface-secondary"}`}
                  onDragOver={(event) => { event.preventDefault(); setDragging(true) }}
                  onDragLeave={() => setDragging(false)}
                  onDrop={onDrop}
                >
                  <Icon name="upload" />
                  <span>拖拽文件到此处，或点击选择</span>
                  <span className="text-xs">支持多个文件</span>
                  <input type="file" multiple className="sr-only" onChange={(event: ChangeEvent<HTMLInputElement>) => addFiles(event.target.files)} />
                </label>
                {files.length ? (
                  <ul className="divide-y divide-border rounded-lg border border-border text-sm">
                    {files.map((file, index) => (
                      <li key={`${file.name}-${index}`} className="flex items-center gap-3 px-3 py-2">
                        <Icon name="file-plus" size={16} className="shrink-0 text-muted" />
                        <span className="min-w-0 flex-1 truncate">{file.name}</span>
                        <span className="text-xs text-muted">{(file.size / 1024).toFixed(1)} KB</span>
                        <Button isIconOnly variant="ghost" size="sm" aria-label={`移除 ${file.name}`} onPress={() => setFiles((prev) => prev.filter((_, i) => i !== index))}><Icon name="x" size={14} /></Button>
                      </li>
                    ))}
                  </ul>
                ) : <Description>尚未添加文件。</Description>}
              </div>
              <div className="grid min-w-0 gap-2 sm:col-span-2">
                <Label>标签</Label>
                <TagGroup aria-label="已添加标签" onRemove={(keys) => setTags((prev) => prev.filter((t) => !keys.has(t)))}>
                  <TagGroup.List>{tags.map((t) => <Tag key={t} id={t} textValue={t}>{t}<Tag.RemoveButton /></Tag>)}</TagGroup.List>
                </TagGroup>
                <TextField aria-label="新标签" value={tagDraft} onChange={setTagDraft} className="min-w-0">
                  <InputGroup>
                    <InputGroup.Input placeholder="输入后按回车添加" onKeyDown={(event) => { if (event.key === "Enter") { event.preventDefault(); addTag() } }} />
                    <InputGroup.Suffix className="pr-1"><Button size="sm" variant="ghost" onPress={addTag} isDisabled={!tagDraft.trim()}>添加</Button></InputGroup.Suffix>
                  </InputGroup>
                </TextField>
              </div>
              <div className="flex justify-between sm:col-span-2"><Button variant="secondary" onPress={() => setStep("details")}>上一步</Button><Button onPress={() => setStep("review")}>下一步</Button></div>
            </Card.Content>
          </Card>
        </Tabs.Panel>

        <Tabs.Panel id="review" className="min-w-0">
          <Card className="min-w-0">
            <Card.Header><Card.Title>确认提交</Card.Title><Card.Description>检查配置后提交。</Card.Description></Card.Header>
            <Card.Content className="space-y-6">
              <dl className="grid gap-x-6 gap-y-3 text-sm sm:grid-cols-2">
                <div className="flex justify-between gap-4 border-b border-border pb-2"><dt className="text-muted">项目名称</dt><dd className="truncate font-medium">{name || "—"}</dd></div>
                <div className="flex justify-between gap-4 border-b border-border pb-2"><dt className="text-muted">联系邮箱</dt><dd className="truncate font-medium">{email || "—"}</dd></div>
                <div className="flex justify-between gap-4 border-b border-border pb-2"><dt className="text-muted">联系电话</dt><dd className="font-medium">{phone ? `${countryCode} ${phone}` : "—"}</dd></div>
                <div className="flex justify-between gap-4 border-b border-border pb-2"><dt className="text-muted">成员席位</dt><dd className="font-medium">{seats}</dd></div>
                <div className="flex justify-between gap-4 border-b border-border pb-2"><dt className="text-muted">启用模块</dt><dd className="flex flex-wrap justify-end gap-1">{modules.map((m) => <Chip key={m} size="sm">{m}</Chip>)}</dd></div>
                <div className="flex justify-between gap-4 border-b border-border pb-2"><dt className="text-muted">标签</dt><dd className="flex flex-wrap justify-end gap-1">{tags.map((t) => <Chip key={t} size="sm" variant="secondary">{t}</Chip>)}</dd></div>
              </dl>
              <ProgressBar value={agreed ? 100 : 90} aria-label="完成度"><div className="flex justify-between"><Label>完成度</Label><ProgressBar.Output /></div><ProgressBar.Track><ProgressBar.Fill /></ProgressBar.Track></ProgressBar>
              <Checkbox isSelected={agreed} onChange={setAgreed}><Checkbox.Content><Checkbox.Control><Checkbox.Indicator /></Checkbox.Control><Label>我同意服务条款与隐私政策</Label></Checkbox.Content></Checkbox>
              <div className="flex justify-between"><Button variant="secondary" onPress={() => setStep("config")}>上一步</Button><Button isDisabled={!agreed} onPress={() => setStep("success")}>提交项目</Button></div>
            </Card.Content>
          </Card>
        </Tabs.Panel>

        <Tabs.Panel id="success">
          <EmptyState className="rounded-xl border border-border py-16">
            <div className="mx-auto grid size-12 place-items-center rounded-full bg-success-soft text-success-soft-foreground"><Icon name="check" /></div>
            <h3 className="mt-4 text-lg font-semibold">项目创建成功</h3>
            <p className="mt-1 text-sm text-muted">你的工作区已经准备就绪。</p>
            <Button className="mt-4">进入项目</Button>
          </EmptyState>
        </Tabs.Panel>
      </Tabs>
    </div>
  )
}
