import { useState } from "react"
import { ActionIcon, Alert, Autocomplete, Avatar, Badge, Button, Card, Center, Divider, FileButton, Group, List, Modal, PasswordInput, SegmentedControl, Select, SimpleGrid, Stack, Switch, Table, Tabs, Text, TextInput, Textarea, ThemeIcon, Title } from "@mantine/core"
import { useMediaQuery } from "@mantine/hooks"
import { notifications } from "@mantine/notifications"
import { Icon } from "@ui-gallery/icons-react"
import invoices from "@ui-gallery/spec/mock/invoices.json"
import plans from "@ui-gallery/spec/mock/plans.json"
import sessions from "@ui-gallery/spec/mock/sessions.json"
import team from "@ui-gallery/spec/mock/team.json"
import { muted, PageHeader, SectionCard, StatusBadge, money } from "./shared"

const timezones = ["Asia/Shanghai", "Asia/Tokyo", "Asia/Singapore", "Europe/Berlin", "America/Los_Angeles", "UTC"]
const roleOptions = ["owner", "admin", "member", "viewer"]
const notifyGroups = [
  { title: "订单", items: ["新订单", "退款申请", "支付失败"] },
  { title: "团队", items: ["成员加入", "角色变更"] },
  { title: "系统", items: ["安全提醒", "产品更新"] },
]

export function SettingsPage() {
  const [twoFactor, setTwoFactor] = useState(false)
  const [channel, setChannel] = useState("email")
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [confirmText, setConfirmText] = useState("")
  const [yearly, setYearly] = useState(false)
  const mobile = useMediaQuery("(max-width: 48em)", false, { getInitialValueInEffect: false })
  const saved = () => notifications.show({ title: "已保存", message: "设置已更新", color: "teal", icon: <Icon name="check" size={16} /> })

  return (
    <Stack gap="lg">
      <PageHeader title="设置" description="管理个人资料、安全、通知、团队与计费。" />
      <Tabs defaultValue="profile" orientation={mobile ? "horizontal" : "vertical"} variant="pills">
        <Tabs.List miw={mobile ? undefined : 180} style={mobile ? { flexWrap: "wrap" } : undefined}>
          <Tabs.Tab value="profile" leftSection={<Icon name="user" size={15} />}>个人资料</Tabs.Tab>
          <Tabs.Tab value="security" leftSection={<Icon name="shield" size={15} />}>账号安全</Tabs.Tab>
          <Tabs.Tab value="notifications" leftSection={<Icon name="bell" size={15} />}>通知</Tabs.Tab>
          <Tabs.Tab value="team" leftSection={<Icon name="users" size={15} />}>团队</Tabs.Tab>
          <Tabs.Tab value="billing" leftSection={<Icon name="tag" size={15} />}>计费</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="profile" pl={{ md: "lg" }} pt={{ base: "md", md: 0 }}>
          <SectionCard title="个人资料" description="这些信息会展示给团队成员。">
            <Stack gap="md" maw={560}>
              <Group>
                <Avatar size="lg" radius="xl" color="blue">{team[0].name.slice(0, 1)}</Avatar>
                <FileButton onChange={() => saved()} accept="image/*">{(props) => <Button variant="default" size="xs" {...props}>更换头像</Button>}</FileButton>
                <Button variant="subtle" color="gray" size="xs">移除</Button>
              </Group>
              <TextInput label="姓名" defaultValue={team[0].name} />
              <TextInput label="邮箱" defaultValue={team[0].email} disabled description="邮箱由管理员管理" />
              <Textarea label="简介" placeholder="介绍一下自己" autosize minRows={3} />
              <SimpleGrid cols={{ base: 1, sm: 2 }}>
                <Select label="语言" data={["简体中文", "English", "日本語"]} defaultValue="简体中文" allowDeselect={false} />
                <Autocomplete label="时区" data={timezones} defaultValue="Asia/Shanghai" />
              </SimpleGrid>
              <Group justify="flex-end"><Button variant="default">取消</Button><Button onClick={saved}>保存</Button></Group>
            </Stack>
          </SectionCard>
        </Tabs.Panel>

        <Tabs.Panel value="security" pl={{ md: "lg" }} pt={{ base: "md", md: 0 }}>
          <Stack gap="lg">
            <SectionCard title="修改密码">
              <Stack gap="md" maw={480}>
                <PasswordInput label="当前密码" required />
                <PasswordInput label="新密码" description="至少 8 位，包含字母与数字" required />
                <PasswordInput label="确认新密码" required error="两次输入不一致" />
                <Group justify="flex-end"><Button onClick={saved}>更新密码</Button></Group>
              </Stack>
            </SectionCard>
            <SectionCard title="两步验证" description="登录时需要额外的一次性验证码。">
              <Group justify="space-between" align="flex-start" wrap="wrap">
                <Switch label="启用两步验证" checked={twoFactor} onChange={(e) => setTwoFactor(e.currentTarget.checked)} />
                {twoFactor ? <Center w={140} h={140} style={{ border: "1px dashed var(--mantine-color-default-border)", borderRadius: 8 }}><Icon name="grid" size={64} /></Center> : null}
              </Group>
            </SectionCard>
            <SectionCard title="活跃会话">
              <List spacing="sm" listStyleType="none">
                {sessions.map((s) => (
                  <List.Item key={s.device}>
                    <Group justify="space-between" wrap="nowrap">
                      <Group gap="sm" wrap="nowrap"><ThemeIcon variant="light" color="gray"><Icon name={s.device.includes("iPhone") ? "smartphone" : "monitor"} size={16} /></ThemeIcon><div><Text size="sm" fw={500}>{s.device} {s.current ? <Badge size="sm" variant="light" color="green" ml={4}>当前</Badge> : null}</Text><Text size="xs" c={muted}>{s.location} · {s.time}</Text></div></Group>
                      {s.current ? null : <Button size="xs" variant="subtle" color="red">注销</Button>}
                    </Group>
                  </List.Item>
                ))}
              </List>
            </SectionCard>
          </Stack>
        </Tabs.Panel>

        <Tabs.Panel value="notifications" pl={{ md: "lg" }} pt={{ base: "md", md: 0 }}>
          <SectionCard title="通知偏好" description="选择接收渠道与事件。">
            <Stack gap="lg">
              <SegmentedControl value={channel} onChange={setChannel} data={[{ value: "email", label: "邮件" }, { value: "push", label: "推送" }, { value: "inapp", label: "站内" }]} />
              {notifyGroups.map((g) => (
                <div key={g.title}>
                  <Text size="sm" fw={600} mb="xs">{g.title}</Text>
                  <Stack gap="sm">{g.items.map((item, i) => <Switch key={item} label={item} defaultChecked={i !== 2} />)}</Stack>
                </div>
              ))}
              <Group justify="flex-end"><Button onClick={saved}>保存</Button></Group>
            </Stack>
          </SectionCard>
        </Tabs.Panel>

        <Tabs.Panel value="team" pl={{ md: "lg" }} pt={{ base: "md", md: 0 }}>
          <SectionCard title="团队成员" description={`${team.length} 位成员`} right={<Group gap="xs"><TextInput placeholder="邮箱邀请" size="xs" w={200} /><Button size="xs" leftSection={<Icon name="users" size={14} />}>邀请</Button></Group>}>
            <Table.ScrollContainer minWidth={560}>
              <Table verticalSpacing="sm">
                <Table.Thead><Table.Tr><Table.Th>成员</Table.Th><Table.Th>角色</Table.Th><Table.Th>最近活跃</Table.Th><Table.Th /></Table.Tr></Table.Thead>
                <Table.Tbody>
                  {team.map((m) => (
                    <Table.Tr key={m.email}>
                      <Table.Td><Group gap="sm" wrap="nowrap"><Avatar radius="xl" size="sm" color="blue">{m.name.slice(0, 1)}</Avatar><div><Text size="sm">{m.name}</Text><Text size="xs" c={muted}>{m.email}</Text></div></Group></Table.Td>
                      <Table.Td><Select size="xs" w={120} data={roleOptions} defaultValue={m.role} allowDeselect={false} disabled={m.role === "owner"} /></Table.Td>
                      <Table.Td><Text size="sm" c={muted}>{m.lastActive}</Text></Table.Td>
                      <Table.Td ta="right"><ActionIcon size="lg" variant="subtle" color="red" aria-label="移除" disabled={m.role === "owner"}><Icon name="trash" size={15} /></ActionIcon></Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            </Table.ScrollContainer>
          </SectionCard>
        </Tabs.Panel>

        <Tabs.Panel value="billing" pl={{ md: "lg" }} pt={{ base: "md", md: 0 }}>
          <Stack gap="lg">
            <Alert variant="light" color="blue" icon={<Icon name="tag" size={16} />} title="当前计划：Pro">
              <Group justify="space-between" wrap="wrap"><Text size="sm">每月 {money(99)}，下次扣款 2026-10-01。</Text><Button size="xs" variant="light">管理支付方式</Button></Group>
            </Alert>
            <Group justify="center" gap="sm"><Text size="sm">按月</Text><Switch size="md" label="按年" checked={yearly} onChange={(e) => setYearly(e.currentTarget.checked)} /><Badge color="green" variant="light">省 20%</Badge></Group>
            <SimpleGrid cols={{ base: 1, md: 3 }}>
              {plans.map((p) => (
                <Card key={p.name} withBorder radius="md" padding="lg" style={p.recommended ? { borderColor: "var(--mantine-primary-color-filled)" } : undefined}>
                  <Group justify="space-between"><Title order={4}>{p.name}</Title>{p.recommended ? <Badge>推荐</Badge> : null}</Group>
                  <Text fz={28} fw={700} mt="sm">{p.price === null ? "联系我们" : p.price === 0 ? "免费" : money(yearly ? p.price * 12 * 0.8 : p.price)}{p.price ? <Text span size="sm" c={muted} fw={400}> /{yearly ? "年" : "月"}</Text> : null}</Text>
                  <List size="sm" spacing="xs" mt="md" icon={<ThemeIcon size={18} radius="xl" color="teal" variant="light"><Icon name="check" size={12} /></ThemeIcon>}>
                    {p.features.map((f) => <List.Item key={f}>{f}</List.Item>)}
                  </List>
                  <Button mt="lg" fullWidth variant={p.recommended ? "filled" : "default"} disabled={p.name === "Pro"}>{p.name === "Pro" ? "当前计划" : p.price === null ? "联系销售" : "选择"}</Button>
                </Card>
              ))}
            </SimpleGrid>
            <SectionCard title="发票">
              <Table.ScrollContainer minWidth={480}>
                <Table verticalSpacing="sm">
                  <Table.Thead><Table.Tr><Table.Th>编号</Table.Th><Table.Th>日期</Table.Th><Table.Th>状态</Table.Th><Table.Th ta="right">金额</Table.Th><Table.Th /></Table.Tr></Table.Thead>
                  <Table.Tbody>
                    {invoices.map((inv) => (
                      <Table.Tr key={inv.id}>
                        <Table.Td><Text size="sm" fw={500}>{inv.id}</Text></Table.Td>
                        <Table.Td><Text size="sm">{inv.date}</Text></Table.Td>
                        <Table.Td><StatusBadge value={inv.status} /></Table.Td>
                        <Table.Td ta="right"><Text size="sm" ff="monospace">{money(inv.amount)}</Text></Table.Td>
                        <Table.Td ta="right"><ActionIcon size="lg" variant="subtle" color="gray" aria-label="下载"><Icon name="download" size={15} /></ActionIcon></Table.Td>
                      </Table.Tr>
                    ))}
                  </Table.Tbody>
                </Table>
              </Table.ScrollContainer>
            </SectionCard>
          </Stack>
        </Tabs.Panel>
      </Tabs>

      <Divider />
      <Card withBorder radius="md" padding="lg" style={{ borderColor: "var(--mantine-color-red-filled)" }}>
        <Group justify="space-between" wrap="wrap">
          <div><Title order={5} c="red">危险区</Title><Text size="sm" c={muted}>删除账号将永久移除所有数据，不可恢复。</Text></div>
          <Button color="red" variant="outline" onClick={() => setDeleteOpen(true)}>删除账号</Button>
        </Group>
      </Card>

      <Modal opened={deleteOpen} onClose={() => setDeleteOpen(false)} title="删除账号" centered>
        <Stack gap="md">
          <Alert color="red" variant="light" icon={<Icon name="alert-circle" size={16} />}>此操作不可撤销。请输入 <Text span fw={600}>DELETE</Text> 以确认。</Alert>
          <TextInput value={confirmText} onChange={(e) => setConfirmText(e.currentTarget.value)} placeholder="DELETE" />
          <Group justify="flex-end"><Button variant="default" onClick={() => setDeleteOpen(false)}>取消</Button><Button color="red" disabled={confirmText !== "DELETE"} onClick={() => setDeleteOpen(false)}>永久删除</Button></Group>
        </Stack>
      </Modal>
    </Stack>
  )
}
