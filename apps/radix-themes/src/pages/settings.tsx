import { useState } from "react"
import { AlertDialog, Avatar, Badge, Box, Button, Card, Flex, Grid, Heading, IconButton, Select, SegmentedControl, Switch, Table, Tabs, Text, TextField } from "@radix-ui/themes"
import invoices from "@ui-gallery/spec/mock/invoices.json"
import plans from "@ui-gallery/spec/mock/plans.json"
import sessions from "@ui-gallery/spec/mock/sessions.json"
import team from "@ui-gallery/spec/mock/team.json"
import { Icon } from "@/icons"
import { PageHeader } from "./shared"

export function SettingsPage() {
  const [danger, setDanger] = useState("")
  return <Box>
    <PageHeader title="设置" description="管理你的个人资料、团队和订阅。" />
    <Tabs.Root defaultValue="profile">
      <Box className="rt-scroll-x"><Tabs.List><Tabs.Trigger value="profile">个人资料</Tabs.Trigger><Tabs.Trigger value="security">账号安全</Tabs.Trigger><Tabs.Trigger value="notifications">通知</Tabs.Trigger><Tabs.Trigger value="team">团队</Tabs.Trigger><Tabs.Trigger value="billing">计费</Tabs.Trigger></Tabs.List></Box>
      <Tabs.Content value="profile">
        <Card mt="4"><Flex direction="column" gap="4">
          <Flex align="center" gap="4"><Avatar size="6" fallback="林" /><Button variant="outline">上传头像</Button></Flex>
          <Grid columns={{ initial: "1", sm: "2" }} gap="4"><label><Text size="2" weight="medium">姓名</Text><TextField.Root mt="2" defaultValue="林晓" /></label><label><Text size="2" weight="medium">邮箱</Text><TextField.Root mt="2" defaultValue={team[0].email} /></label></Grid>
          <label><Text size="2" weight="medium">语言</Text><Select.Root defaultValue="zh"><Select.Trigger mt="2" style={{ width: "100%" }} /><Select.Content><Select.Item value="zh">简体中文</Select.Item><Select.Item value="en">English</Select.Item></Select.Content></Select.Root></label>
          <label><Text size="2" weight="medium">时区</Text><TextField.Root mt="2" defaultValue="Asia/Shanghai" /></label>
          <Button>保存更改</Button>
        </Flex></Card>
      </Tabs.Content>
      <Tabs.Content value="security">
        <Grid columns={{ initial: "1", md: "2" }} gap="4" mt="4"><Card><Heading size="4" mb="4">修改密码</Heading><Flex direction="column" gap="3"><TextField.Root type="password" placeholder="当前密码" /><TextField.Root type="password" placeholder="新密码" /><Button>更新密码</Button></Flex></Card><Card><Heading size="4" mb="4">两步验证</Heading><Flex align="center" justify="between"><Text>启用两步验证</Text><Switch /></Flex><Box mt="4" width="160px" height="160px" style={{ background: "var(--gray-3)" }}><Flex align="center" justify="center" height="100%"><Text>二维码</Text></Flex></Box></Card></Grid>
        <Card mt="4"><Heading size="4" mb="4">活跃会话</Heading><Flex direction="column" gap="3">{sessions.map((session) => <Flex key={session.device} align="center" justify="between"><Box><Text weight="medium">{session.device}</Text><Text as="div" size="1" color="gray">{session.location} · {session.time}</Text></Box>{session.current ? <Badge color="green">当前</Badge> : <Button size="1" variant="outline">注销</Button>}</Flex>)}</Flex></Card>
      </Tabs.Content>
      <Tabs.Content value="notifications">
        <Card mt="4"><Flex direction="column" gap="4"><Heading size="4">通知偏好</Heading>{["订单更新", "团队动态", "产品新闻"].map((label) => <Flex key={label} justify="between"><Text>{label}</Text><Switch defaultChecked /></Flex>)}<SegmentedControl.Root defaultValue="email"><SegmentedControl.Item value="email">邮件</SegmentedControl.Item><SegmentedControl.Item value="push">推送</SegmentedControl.Item><SegmentedControl.Item value="inapp">站内</SegmentedControl.Item></SegmentedControl.Root></Flex></Card>
      </Tabs.Content>
      <Tabs.Content value="team">
        <Card mt="4"><Box style={{ overflowX: "auto" }}><Table.Root variant="surface"><Table.Header><Table.Row><Table.ColumnHeaderCell>成员</Table.ColumnHeaderCell><Table.ColumnHeaderCell>角色</Table.ColumnHeaderCell><Table.ColumnHeaderCell>最近活跃</Table.ColumnHeaderCell><Table.ColumnHeaderCell /></Table.Row></Table.Header><Table.Body>{team.map((member) => <Table.Row key={member.email}><Table.Cell><Flex align="center" gap="2"><Avatar size="2" fallback={member.name.slice(0, 1)} /><Box><Text>{member.name}</Text><Text as="div" size="1" color="gray">{member.email}</Text></Box></Flex></Table.Cell><Table.Cell><Select.Root defaultValue={member.role}><Select.Trigger /><Select.Content>{["owner", "admin", "member", "viewer"].map((role) => <Select.Item key={role} value={role}>{role}</Select.Item>)}</Select.Content></Select.Root></Table.Cell><Table.Cell>{member.lastActive}</Table.Cell><Table.Cell><IconButton variant="ghost"><Icon name="trash" /></IconButton></Table.Cell></Table.Row>)}</Table.Body></Table.Root></Box><Flex gap="2" mt="4"><TextField.Root placeholder="邀请邮箱" style={{ flexGrow: 1, minWidth: 0 }} /><Button>邀请</Button></Flex></Card>
      </Tabs.Content>
      <Tabs.Content value="billing">
        <Card mt="4"><Heading size="4">当前计划</Heading><Text color="gray" as="p" mt="2">Pro · ¥99 / 月</Text></Card>
        <Grid columns={{ initial: "1", md: "3" }} gap="4" mt="4">{plans.map((plan) => <Card key={plan.name}><Flex justify="between"><Heading size="4">{plan.name}</Heading>{plan.recommended ? <Badge color="green">推荐</Badge> : null}</Flex><Heading size="6" mt="3">{plan.price === null ? "联系销售" : `¥${plan.price}`}</Heading><Flex direction="column" gap="2" mt="4">{plan.features.map((feature) => <Text key={feature} size="2"><Icon name="check" /> {feature}</Text>)}</Flex><Button variant={plan.recommended ? "solid" : "outline"} mt="4">选择计划</Button></Card>)}</Grid>
        <Card mt="4"><Heading size="4" mb="3">发票</Heading><Table.Root><Table.Body>{invoices.map((invoice) => <Table.Row key={invoice.id}><Table.Cell>{invoice.id}</Table.Cell><Table.Cell>{invoice.date}</Table.Cell><Table.Cell>¥{invoice.amount}</Table.Cell><Table.Cell><Badge color={invoice.status === "paid" ? "green" : "amber"}>{invoice.status}</Badge></Table.Cell></Table.Row>)}</Table.Body></Table.Root></Card>
      </Tabs.Content>
    </Tabs.Root>
    <Card mt="5" style={{ border: "1px solid var(--red-7)" }}><Flex direction="column" gap="3"><Heading size="4" color="red">危险区</Heading><Text color="gray">删除账号后所有数据将无法恢复。</Text><AlertDialog.Root><AlertDialog.Trigger><Button color="red" variant="soft">删除账号</Button></AlertDialog.Trigger><AlertDialog.Content><AlertDialog.Title>确认删除账号？</AlertDialog.Title><AlertDialog.Description>请输入 DELETE 以继续。</AlertDialog.Description><TextField.Root mt="4" value={danger} onChange={(event) => setDanger(event.target.value)} placeholder="DELETE" /><Flex justify="end" gap="3" mt="4"><AlertDialog.Cancel><Button variant="soft">取消</Button></AlertDialog.Cancel><AlertDialog.Action><Button color="red" disabled={danger !== "DELETE"}>确认删除</Button></AlertDialog.Action></Flex></AlertDialog.Content></AlertDialog.Root></Flex></Card>
  </Box>
}
