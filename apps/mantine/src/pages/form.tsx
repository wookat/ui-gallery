import { useState } from "react"
import { ActionIcon, Autocomplete, Button, Card, Checkbox, ColorInput, DataList, Group, List, MultiSelect, NumberInput, Radio, RangeSlider, Rating, Select, Stack, Stepper, Switch, TagsInput, Text, TextInput, Textarea, ThemeIcon, Title, Tooltip } from "@mantine/core"
import { DatePickerInput, TimeInput } from "@mantine/dates"
import { Dropzone, type FileWithPath } from "@mantine/dropzone"
import { useForm } from "@mantine/form"
import { Icon } from "@ui-gallery/icons-react"
import team from "@ui-gallery/spec/mock/team.json"
import { muted, PageHeader } from "./shared"

const help = (label: string, tip: string) => (
  <Group gap={4} wrap="nowrap" component="span">
    {label}
    <Tooltip label={tip} withArrow>
      <span style={{ display: "inline-flex" }}><Icon name="circle-help" size={14} /></span>
    </Tooltip>
  </Group>
)

const countryCodes = [{ value: "+86", label: "+86 中国" }, { value: "+1", label: "+1 美国" }, { value: "+81", label: "+81 日本" }, { value: "+44", label: "+44 英国" }]
const regions = ["中国大陆", "新加坡", "法兰克福"]
const tiers = ["Starter", "Pro", "Enterprise"]

export function FormPage() {
  const [active, setActive] = useState(0)
  const [files, setFiles] = useState<FileWithPath[]>([])
  const [done, setDone] = useState(false)
  const form = useForm({
    initialValues: {
      name: "", seats: 5, email: "", code: "+86", phone: "", desc: "", type: "team", modules: ["orders"], notify: true,
      region: null as string | null, tags: [] as string[], owner: "", startDate: null as string | null, startTime: "", range: [null, null] as [string | null, string | null],
      budget: [20, 60] as [number, number], priority: 3, color: "#228be6", labels: ["内部"] as string[], agree: false,
    },
    validate: (v) => {
      if (active === 0) {
        return {
          name: v.name.trim().length < 2 ? "项目名称至少 2 个字符" : null,
          seats: v.seats < 1 || v.seats > 500 ? "席位 1–500" : null,
          email: /^\S+@\S+\.\S+$/.test(v.email) ? null : "请输入有效邮箱",
          phone: /^\d{6,15}$/.test(v.phone) ? null : "请输入 6–15 位数字",
          desc: v.desc.length > 200 ? "最多 200 字" : null,
          modules: v.modules.length ? null : "至少选择一个模块",
        }
      }
      if (active === 1) {
        return {
          region: v.region ? null : "请选择区域",
          tags: v.tags.length ? null : "至少选择一个计划",
          owner: v.owner ? null : "请选择负责人",
          startDate: v.startDate ? null : "请选择开始日期",
          startTime: v.startTime ? null : "请选择时间",
          range: v.range[0] && v.range[1] ? null : "请选择日期范围",
          labels: v.labels.length ? null : "至少一个标签",
        }
      }
      return { agree: v.agree ? null : "需同意服务条款" }
    },
  })

  const next = () => {
    if (form.validate().hasErrors) return
    if (active === 2) { setDone(true); return }
    setActive((a) => a + 1)
  }

  if (done) {
    return (
      <Stack gap="lg">
        <PageHeader title="新建项目" />
        <Card withBorder radius="md" padding="xl">
          <Stack align="center" gap="md" py="xl">
            <ThemeIcon size={64} radius="xl" color="teal" variant="light"><Icon name="check" size={32} /></ThemeIcon>
            <Title order={2}>项目已创建</Title>
            <Text c={muted} ta="center">项目「{form.values.name}」已创建，成员将收到邀请邮件。</Text>
            <Group><Button variant="default" onClick={() => { setDone(false); setActive(0); form.reset() }}>再建一个</Button><Button>进入项目</Button></Group>
          </Stack>
        </Card>
      </Stack>
    )
  }

  return (
    <Stack gap="lg">
      <PageHeader title="新建项目" description="三步完成项目配置。" />
      <Card withBorder radius="md" padding="lg">
        <Stepper active={active} onStepClick={setActive} allowNextStepsSelect={false} size="sm">
          <Stepper.Step label="基本信息" description="名称与联系人" />
          <Stepper.Step label="详细配置" description="区域、计划与预算" />
          <Stepper.Step label="确认" description="核对并提交" />
        </Stepper>

        <Stack gap="md" mt="xl" maw={720}>
          {active === 0 ? (
            <>
              <TextInput label="项目名称" placeholder="例如：Q4 增长计划" required description="将显示在侧边栏与邀请邮件中" {...form.getInputProps("name")} />
              <Group grow align="flex-start">
                <NumberInput label="席位数" min={1} max={500} required {...form.getInputProps("seats")} />
                <TextInput label="联系邮箱" placeholder="you@example.com" required {...form.getInputProps("email")} />
              </Group>
              <Group align="flex-start" gap="xs" wrap="nowrap">
                <Select label="国家码" data={countryCodes} w={140} {...form.getInputProps("code")} allowDeselect={false} />
                <TextInput label="电话" placeholder="13800000000" required style={{ flex: 1 }} {...form.getInputProps("phone")} />
              </Group>
              <Textarea label="项目描述" placeholder="简要描述项目目标" autosize minRows={3} maxLength={200} description={`${form.values.desc.length}/200`} {...form.getInputProps("desc")} />
              <Radio.Group label="项目类型" required {...form.getInputProps("type")}>
                <Group mt="xs"><Radio value="personal" label="个人" /><Radio value="team" label="团队" /><Radio value="enterprise" label="企业" /></Group>
              </Radio.Group>
              <Checkbox.Group label="启用模块" required {...form.getInputProps("modules")}>
                <Group mt="xs"><Checkbox value="orders" label="订单" /><Checkbox value="chat" label="AI 助手" /><Checkbox value="billing" label="计费" /></Group>
              </Checkbox.Group>
              <Switch label="创建后通知全体成员" {...form.getInputProps("notify", { type: "checkbox" })} />
            </>
          ) : null}

          {active === 1 ? (
            <>
              <Group grow align="flex-start">
                <Select label="数据区域" placeholder="选择区域" data={regions} required {...form.getInputProps("region")} />
                <MultiSelect label="订阅计划" placeholder="可多选" data={tiers} required {...form.getInputProps("tags")} />
              </Group>
              <Autocomplete label={help("负责人", "输入姓名自动补全")} placeholder="搜索成员" data={team.map((m) => m.name)} required {...form.getInputProps("owner")} />
              <Group grow align="flex-start">
                <DatePickerInput label="开始日期" placeholder="选择日期" required leftSection={<Icon name="calendar" size={15} />} {...form.getInputProps("startDate")} />
                <TimeInput label="开始时间" required leftSection={<Icon name="clock" size={15} />} {...form.getInputProps("startTime")} />
              </Group>
              <DatePickerInput type="range" label="迭代周期" placeholder="选择日期范围" required {...form.getInputProps("range")} />
              <div>
                <Text size="sm" fw={500} mb={4}>预算区间（万元）</Text>
                <RangeSlider min={0} max={100} step={5} minRange={10} marks={[{ value: 0, label: "0" }, { value: 50, label: "50" }, { value: 100, label: "100" }]} mb="lg" {...form.getInputProps("budget")} />
              </div>
              <Group grow align="flex-start">
                <div><Text size="sm" fw={500} mb={4}>优先级</Text><Rating {...form.getInputProps("priority")} /></div>
                <ColorInput label="主题色" format="hex" swatches={["#228be6", "#12b886", "#fa5252", "#7950f2", "#fd7e14"]} {...form.getInputProps("color")} />
              </Group>
              <div>
                <Text size="sm" fw={500} mb={4}>附件</Text>
                <Dropzone onDrop={(accepted) => setFiles([...files, ...accepted])} maxSize={5 * 1024 ** 2} radius="md">
                  <Group justify="center" gap="md" mih={100} style={{ pointerEvents: "none" }}>
                    <Dropzone.Accept><Icon name="upload" size={32} /></Dropzone.Accept>
                    <Dropzone.Reject><Icon name="x" size={32} /></Dropzone.Reject>
                    <Dropzone.Idle><Icon name="upload" size={32} /></Dropzone.Idle>
                    <div><Text size="sm">拖拽文件到此处或点击上传</Text><Text size="xs" c={muted}>单个文件不超过 5 MB</Text></div>
                  </Group>
                </Dropzone>
                {files.length ? (
                  <List size="sm" mt="xs" spacing={4}>
                    {files.map((f) => (
                      <List.Item key={f.name} icon={<Icon name="paperclip" size={14} />}>
                        <Group gap="xs">{f.name}<Text size="xs" c={muted}>{(f.size / 1024).toFixed(1)} KB</Text><ActionIcon size="xs" variant="subtle" color="gray" onClick={() => setFiles(files.filter((x) => x !== f))} aria-label="移除"><Icon name="x" size={12} /></ActionIcon></Group>
                      </List.Item>
                    ))}
                  </List>
                ) : null}
              </div>
              <TagsInput label="标签" placeholder="回车添加" description="用于筛选与分组" required {...form.getInputProps("labels")} />
            </>
          ) : null}

          {active === 2 ? (
            <>
              <DataList withDivider labelWidth={120}>
                <DataList.Item><DataList.ItemLabel>项目名称</DataList.ItemLabel><DataList.ItemValue>{form.values.name}</DataList.ItemValue></DataList.Item>
                <DataList.Item><DataList.ItemLabel>席位 / 类型</DataList.ItemLabel><DataList.ItemValue>{form.values.seats} · {form.values.type}</DataList.ItemValue></DataList.Item>
                <DataList.Item><DataList.ItemLabel>联系方式</DataList.ItemLabel><DataList.ItemValue>{form.values.email} · {form.values.code} {form.values.phone}</DataList.ItemValue></DataList.Item>
                <DataList.Item><DataList.ItemLabel>区域 / 计划</DataList.ItemLabel><DataList.ItemValue>{form.values.region} · {form.values.tags.join(", ")}</DataList.ItemValue></DataList.Item>
                <DataList.Item><DataList.ItemLabel>负责人</DataList.ItemLabel><DataList.ItemValue>{form.values.owner}</DataList.ItemValue></DataList.Item>
                <DataList.Item><DataList.ItemLabel>开始</DataList.ItemLabel><DataList.ItemValue>{form.values.startDate} {form.values.startTime}</DataList.ItemValue></DataList.Item>
                <DataList.Item><DataList.ItemLabel>周期</DataList.ItemLabel><DataList.ItemValue>{form.values.range[0]} ~ {form.values.range[1]}</DataList.ItemValue></DataList.Item>
                <DataList.Item><DataList.ItemLabel>预算</DataList.ItemLabel><DataList.ItemValue>{form.values.budget[0]} – {form.values.budget[1]} 万元</DataList.ItemValue></DataList.Item>
                <DataList.Item><DataList.ItemLabel>标签</DataList.ItemLabel><DataList.ItemValue>{form.values.labels.join(", ")}</DataList.ItemValue></DataList.Item>
                <DataList.Item><DataList.ItemLabel>附件</DataList.ItemLabel><DataList.ItemValue>{files.length} 个文件</DataList.ItemValue></DataList.Item>
              </DataList>
              <Checkbox label="我已阅读并同意服务条款与隐私政策" {...form.getInputProps("agree", { type: "checkbox" })} />
            </>
          ) : null}

          <Group justify="space-between" mt="md">
            <Button variant="default" disabled={active === 0} onClick={() => setActive((a) => a - 1)}>上一步</Button>
            <Button onClick={next}>{active === 2 ? "提交" : "下一步"}</Button>
          </Group>
        </Stack>
      </Card>
    </Stack>
  )
}
