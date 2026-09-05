import { useState } from "react"
import { Button, Calendar, Card, Checkbox, Chip, ComboBox, DateField, DatePicker, Description, EmptyState, Input, InputGroup, InputOTP, Label, ListBox, ProgressBar, Radio, RadioGroup, Select, Slider, Switch, Tabs, TextArea, TextField, ToggleButton, ToggleButtonGroup, Tooltip } from "@heroui/react"
import { Icon } from "@ui-gallery/icons-react"
import { PageHeader } from "./shared"

const options = [{ value: "pro", label: "Pro plan" }, { value: "team", label: "Team plan" }]
type Step = "details" | "config" | "review" | "success"

export function FormPage() {
  const [step, setStep] = useState<Step>("details")
  const [name, setName] = useState("")
  const nameInvalid = step === "details" && name.length > 0 && name.length < 2
  return (
    <div className="space-y-6">
      <PageHeader title="创建项目" description="用三步完成一个新的工作区配置。" />
      <Tabs selectedKey={step} onSelectionChange={(key) => setStep(key as Step)}>
        <Tabs.ListContainer>
          <Tabs.List aria-label="创建步骤">
            <Tabs.Tab id="details">1. 基本信息<Tabs.Indicator /></Tabs.Tab>
            <Tabs.Tab id="config">2. 配置选项<Tabs.Indicator /></Tabs.Tab>
            <Tabs.Tab id="review">3. 确认提交<Tabs.Indicator /></Tabs.Tab>
            <Tabs.Tab id="success" isDisabled={step !== "success"}>完成<Tabs.Indicator /></Tabs.Tab>
          </Tabs.List>
        </Tabs.ListContainer>
        <Tabs.Panel id="details">
          <Card>
            <Card.Header><Card.Title>基本信息</Card.Title><Card.Description>告诉我们项目的基础信息。</Card.Description></Card.Header>
            <Card.Content className="grid gap-5 sm:grid-cols-2">
              <TextField isRequired value={name} onChange={setName} isInvalid={nameInvalid}>
                <Label>项目名称</Label>
                <Input placeholder="例如：增长分析" />
                {nameInvalid ? <Description className="text-danger">名称至少 2 个字符</Description> : <Description>用于在控制台中展示。</Description>}
              </TextField>
              <ComboBox defaultItems={options} defaultSelectedKey="team">
                <Label>项目类型</Label>
                <ComboBox.InputGroup><Input placeholder="搜索方案" /><ComboBox.Trigger /></ComboBox.InputGroup>
                <ComboBox.Popover>
                  <ListBox>{(item: (typeof options)[number]) => <ListBox.Item id={item.value} textValue={item.label}>{item.label}<ListBox.ItemIndicator /></ListBox.Item>}</ListBox>
                </ComboBox.Popover>
              </ComboBox>
              <TextField className="sm:col-span-2">
                <Label>项目描述</Label>
                <TextArea placeholder="简单描述项目目标..." />
                <Description>可选，最多 200 字。</Description>
              </TextField>
              <TextField isDisabled>
                <Label>所属组织</Label>
                <Input value="Acme Console" readOnly />
              </TextField>
              <TextField>
                <Label>项目 Slug</Label>
                <InputGroup><InputGroup.Prefix>acme.dev/</InputGroup.Prefix><InputGroup.Input placeholder="growth" /></InputGroup>
              </TextField>
              <div className="flex justify-end sm:col-span-2"><Button onPress={() => setStep("config")}>下一步<Icon name="arrow-right" size={16} /></Button></div>
            </Card.Content>
          </Card>
        </Tabs.Panel>
        <Tabs.Panel id="config">
          <Card>
            <Card.Header><Card.Title>配置选项</Card.Title><Card.Description>选择计划、权限与通知。</Card.Description></Card.Header>
            <Card.Content className="space-y-6">
              <RadioGroup defaultValue="team" orientation="horizontal" className="grid gap-3 sm:grid-cols-2">
                <Label>计划</Label>
                <Radio value="pro" className="rounded-lg border border-border p-4"><Radio.Content><Radio.Control><Radio.Indicator /></Radio.Control>Pro</Radio.Content><Description>适合小型团队</Description></Radio>
                <Radio value="team" className="rounded-lg border border-border p-4"><Radio.Content><Radio.Control><Radio.Indicator /></Radio.Control>Team</Radio.Content><Description>适合协作团队</Description></Radio>
              </RadioGroup>
              <div className="grid gap-5 sm:grid-cols-2">
                <Select defaultValue="daily">
                  <Label>通知频率</Label>
                  <Select.Trigger><Select.Value /><Select.Indicator /></Select.Trigger>
                  <Select.Popover><ListBox><ListBox.Item id="daily" textValue="每日">每日<ListBox.ItemIndicator /></ListBox.Item><ListBox.Item id="weekly" textValue="每周">每周<ListBox.ItemIndicator /></ListBox.Item></ListBox></Select.Popover>
                </Select>
                <Select defaultValue="zh">
                  <Label>界面语言</Label>
                  <Select.Trigger><Select.Value /><Select.Indicator /></Select.Trigger>
                  <Select.Popover><ListBox><ListBox.Item id="zh" textValue="中文">中文<ListBox.ItemIndicator /></ListBox.Item><ListBox.Item id="en" textValue="English">English<ListBox.ItemIndicator /></ListBox.Item></ListBox></Select.Popover>
                </Select>
              </div>
              <DatePicker>
                <Label>提醒时间</Label>
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
              <Slider defaultValue={60} maxValue={100} step={1}>
                <Label>采样比例</Label>
                <Slider.Output />
                <Slider.Track><Slider.Fill /><Slider.Thumb /></Slider.Track>
              </Slider>
              <div className="flex items-center justify-between rounded-lg border border-border p-4">
                <div><p className="font-medium">通知开关</p><p className="text-sm text-muted">接收项目活动提醒</p></div>
                <Switch defaultSelected aria-label="通知开关"><Switch.Control><Switch.Thumb /></Switch.Control></Switch>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">验证码</p>
                <InputOTP maxLength={6} aria-label="验证码">
                  <InputOTP.Group>{[0, 1, 2].map((i) => <InputOTP.Slot key={i} index={i} />)}</InputOTP.Group>
                  <InputOTP.Separator />
                  <InputOTP.Group>{[3, 4, 5].map((i) => <InputOTP.Slot key={i} index={i} />)}</InputOTP.Group>
                </InputOTP>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <ToggleButton defaultSelected aria-label="加粗"><Icon name="bold" size={16} /></ToggleButton>
                <ToggleButtonGroup selectionMode="single" defaultSelectedKeys={["center"]}>
                  <ToggleButton id="left">左</ToggleButton>
                  <ToggleButton id="center"><ToggleButtonGroup.Separator />中</ToggleButton>
                  <ToggleButton id="right"><ToggleButtonGroup.Separator />右</ToggleButton>
                </ToggleButtonGroup>
                <Tooltip><Button isIconOnly variant="secondary" aria-label="说明"><Icon name="info" size={16} /></Button><Tooltip.Content>组合控件示例</Tooltip.Content></Tooltip>
                <Chip>组合示例</Chip>
              </div>
              <div className="flex justify-between"><Button variant="secondary" onPress={() => setStep("details")}>上一步</Button><Button onPress={() => setStep("review")}>下一步</Button></div>
            </Card.Content>
          </Card>
        </Tabs.Panel>
        <Tabs.Panel id="review">
          <Card>
            <Card.Header><Card.Title>确认提交</Card.Title><Card.Description>检查配置后提交。</Card.Description></Card.Header>
            <Card.Content className="space-y-6">
              <TextField isReadOnly value="项目配置已准备完成" aria-label="状态">
                <InputGroup><InputGroup.Prefix><Icon name="check" size={16} /></InputGroup.Prefix><InputGroup.Input /></InputGroup>
              </TextField>
              <ProgressBar value={82} aria-label="完成度"><ProgressBar.Track><ProgressBar.Fill /></ProgressBar.Track></ProgressBar>
              <Checkbox defaultSelected><Checkbox.Content><Checkbox.Control><Checkbox.Indicator /></Checkbox.Control>我同意服务条款与隐私政策</Checkbox.Content></Checkbox>
              <div className="flex justify-between"><Button variant="secondary" onPress={() => setStep("config")}>上一步</Button><Button onPress={() => setStep("success")}>提交项目</Button></div>
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
