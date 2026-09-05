import { useState } from "react"
import {
  Badge,
  Box,
  Button,
  Card,
  Checkbox,
  CheckboxGroup,
  Flex,
  Heading,
  Popover,
  RadioGroup,
  Select,
  Separator,
  Slider,
  Switch,
  Text,
  TextArea,
  TextField,
  Tooltip,
} from "@radix-ui/themes"
import team from "@ui-gallery/spec/mock/team.json"
import { Icon } from "@/icons"
import { FieldLabel, Help, PageHeader } from "./shared"

export function FormPage() {
  const [step, setStep] = useState(1)
  const [name, setName] = useState("")
  const [tags, setTags] = useState<string[]>([])
  const [tag, setTag] = useState("")
  const [done, setDone] = useState(false)
  const [assignee, setAssignee] = useState("")
  const [agree, setAgree] = useState(false)
  const addTag = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && tag.trim()) {
      event.preventDefault()
      setTags((current) => [...current, tag.trim()])
      setTag("")
    }
  }
  return (
    <Box>
      <PageHeader title="新建项目" description="用三步完成项目配置。" />
      <Flex align="center" gap="2" mb="6">
        {["基本信息", "详细配置", "确认"].map((label, index) => (
          <Flex key={label} align="center" gap="2" flexGrow="1" minWidth="0">
            <Badge size="3" color={step >= index + 1 ? "indigo" : "gray"}>
              {index + 1}
            </Badge>
            <Text
              size="2"
              weight={step === index + 1 ? "bold" : "regular"}
              style={{ whiteSpace: "nowrap", flexShrink: 0 }}
            >
              {label}
            </Text>
            {index < 2 ? <Separator size="4" style={{ flexGrow: 1 }} /> : null}
          </Flex>
        ))}
      </Flex>
      {done ? (
        <Card>
          <Flex direction="column" align="center" gap="4" p="6">
            <Icon name="check-circle" size={40} />
            <Heading size="6">项目创建成功</Heading>
            <Text color="gray">你的配置已经保存。</Text>
            <Button
              onClick={() => {
                setDone(false)
                setStep(1)
              }}
            >
              创建另一个
            </Button>
          </Flex>
        </Card>
      ) : (
        <Card>
          <Flex direction="column" gap="5">
            {step === 1 ? (
              <>
                <label>
                  <FieldLabel required>项目名称</FieldLabel>
                  <TextField.Root
                    mt="2"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder="输入项目名称"
                  />
                </label>
                {!name ? (
                  <Text size="1" color="red">
                    项目名称为必填项
                  </Text>
                ) : null}
                <label>
                  <FieldLabel>预算</FieldLabel>
                  <TextField.Root mt="2" type="number" placeholder="0" />
                </label>
                <label>
                  <FieldLabel required>联系邮箱</FieldLabel>
                  <TextField.Root
                    mt="2"
                    type="email"
                    placeholder="user@example.com"
                  />
                </label>
                <label>
                  <FieldLabel>联系电话</FieldLabel>
                  <Flex mt="2" gap="2">
                    <Select.Root defaultValue="+86">
                      <Select.Trigger />
                      <Select.Content>
                        <Select.Item value="+86">+86</Select.Item>
                        <Select.Item value="+1">+1</Select.Item>
                        <Select.Item value="+44">+44</Select.Item>
                      </Select.Content>
                    </Select.Root>
                    <TextField.Root
                      placeholder="手机号"
                      style={{ flexGrow: 1, minWidth: 0 }}
                    />
                  </Flex>
                </label>
                <label>
                  <FieldLabel>项目说明</FieldLabel>
                  <TextArea mt="2" placeholder="描述项目目标" />
                  <Help>最多 500 字</Help>
                </label>
                <RadioGroup.Root defaultValue="internal">
                  <Flex gap="4">
                    <RadioGroup.Item value="internal">内部</RadioGroup.Item>
                    <RadioGroup.Item value="external">外部</RadioGroup.Item>
                  </Flex>
                </RadioGroup.Root>
                <CheckboxGroup.Root defaultValue={["analytics"]}>
                  <Flex direction="column" gap="2">
                    <CheckboxGroup.Item value="analytics">
                      启用分析
                    </CheckboxGroup.Item>
                    <CheckboxGroup.Item value="reports">
                      每周报告
                    </CheckboxGroup.Item>
                  </Flex>
                </CheckboxGroup.Root>
                <Flex align="center" gap="3">
                  <Switch defaultChecked />
                  <Text size="2">启用通知</Text>
                </Flex>
              </>
            ) : step === 2 ? (
              <>
                <label>
                  <FieldLabel>项目负责人</FieldLabel>
                  <Popover.Root>
                    <Popover.Trigger>
                      <TextField.Root
                        mt="2"
                        value={assignee}
                        onChange={(event) => setAssignee(event.target.value)}
                        placeholder="搜索团队成员"
                      />
                    </Popover.Trigger>
                    <Popover.Content>
                      <Flex direction="column" gap="1">
                        {team.map((member) => (
                          <Button
                            key={member.email}
                            variant="ghost"
                            onClick={() => setAssignee(member.name)}
                          >
                            {member.name}
                          </Button>
                        ))}
                      </Flex>
                    </Popover.Content>
                  </Popover.Root>
                </label>
                <label>
                  <FieldLabel>项目类型</FieldLabel>
                  <Select.Root defaultValue="product">
                    <Select.Trigger mt="2" />
                    <Select.Content>
                      <Select.Item value="product">产品</Select.Item>
                      <Select.Item value="marketing">营销</Select.Item>
                      <Select.Item value="research">研究</Select.Item>
                    </Select.Content>
                  </Select.Root>
                </label>
                <label>
                  <FieldLabel>计划日期</FieldLabel>
                  <Flex gap="2" mt="2">
                    <TextField.Root type="date" />
                    <TextField.Root type="time" />
                  </Flex>
                </label>
                <label>
                  <FieldLabel>日期范围</FieldLabel>
                  <Flex gap="2" mt="2">
                    <TextField.Root type="date" />
                    <TextField.Root type="date" />
                  </Flex>
                </label>
                <label>
                  <FieldLabel>预算区间</FieldLabel>
                  <Slider defaultValue={[20, 80]} mt="3" />
                </label>
                <Flex direction="column" gap="2">
                  <FieldLabel>评分</FieldLabel>
                  <Flex>
                    {[1, 2, 3, 4, 5].map((value) => (
                      <Button key={value} size="1" variant="ghost">
                        <Icon name={value <= 4 ? "star" : "star"} />
                      </Button>
                    ))}
                  </Flex>
                </Flex>
                <Flex align="center" gap="3">
                  <FieldLabel>颜色</FieldLabel>
                  <Box asChild>
                    <input
                      type="color"
                      defaultValue="#888888"
                      aria-label="颜色"
                    />
                  </Box>
                </Flex>
                <Box p="5" style={{ border: "1px dashed var(--gray-a7)" }}>
                  <Flex direction="column" align="center" gap="2">
                    <Icon name="upload" size={28} />
                    <Text>拖拽文件到这里</Text>
                    <Button variant="outline">选择文件</Button>
                  </Flex>
                </Box>
                <label>
                  <FieldLabel>标签</FieldLabel>
                  <TextField.Root
                    mt="2"
                    value={tag}
                    onChange={(event) => setTag(event.target.value)}
                    onKeyDown={addTag}
                    placeholder="输入后按 Enter"
                  />
                </label>
                <Flex gap="2" wrap="wrap">
                  {tags.map((value) => (
                    <Badge key={value}>{value}</Badge>
                  ))}
                </Flex>
                <Tooltip content="项目成员可以在创建后继续编辑">
                  <Button variant="ghost" size="1">
                    <Icon name="info" />
                    需要帮助？
                  </Button>
                </Tooltip>
              </>
            ) : (
              <>
                <Heading size="4">确认项目配置</Heading>
                <Box>
                  <Text color="gray">项目名称</Text>
                  <Text as="div" weight="medium">
                    {name || "未填写"}
                  </Text>
                </Box>
                <Box>
                  <Text color="gray">负责人</Text>
                  <Text as="div" weight="medium">
                    {assignee || "未选择"}
                  </Text>
                </Box>
                <Flex align="center" gap="2">
                  <Checkbox
                    checked={agree}
                    onCheckedChange={(value) => setAgree(value === true)}
                  />
                  <Text>我同意服务条款</Text>
                </Flex>
              </>
            )}
            {step < 3 ? (
              <Flex justify="end" gap="3">
                <Button
                  disabled={step === 1 && !name}
                  onClick={() => setStep((value) => value + 1)}
                >
                  下一步
                </Button>
              </Flex>
            ) : (
              <Flex justify="end" gap="3">
                <Button variant="soft" onClick={() => setStep(2)}>
                  上一步
                </Button>
                <Button disabled={!agree} onClick={() => setDone(true)}>
                  提交
                </Button>
              </Flex>
            )}
          </Flex>
        </Card>
      )}
    </Box>
  )
}
