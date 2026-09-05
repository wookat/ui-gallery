import { AlertDialog, Avatar, Button, Card, Chip, Input, Kbd, Label, Modal, Separator, Switch, Table, Tabs, TextField, toast } from "@heroui/react"
import { Icon } from "@ui-gallery/icons-react"
import invoices from "@ui-gallery/spec/mock/invoices.json"
import plans from "@ui-gallery/spec/mock/plans.json"
import sessions from "@ui-gallery/spec/mock/sessions.json"
import team from "@ui-gallery/spec/mock/team.json"
import { PageHeader, StatusBadge } from "./shared"

function Row({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <div><p className="text-sm font-medium">{title}</p><p className="text-sm text-muted">{description}</p></div>
      {children}
    </div>
  )
}

export function SettingsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="设置" description="管理个人资料、安全、团队与账单。" />
      <Tabs defaultSelectedKey="profile" className="w-full">
        <Tabs.ListContainer className="max-w-full overflow-x-auto">
          <Tabs.List aria-label="设置分区">
            <Tabs.Tab id="profile">资料<Tabs.Indicator /></Tabs.Tab>
            <Tabs.Tab id="security">安全<Tabs.Indicator /></Tabs.Tab>
            <Tabs.Tab id="notifications">通知<Tabs.Indicator /></Tabs.Tab>
            <Tabs.Tab id="team">团队<Tabs.Indicator /></Tabs.Tab>
            <Tabs.Tab id="billing">账单<Tabs.Indicator /></Tabs.Tab>
          </Tabs.List>
        </Tabs.ListContainer>
        <Tabs.Panel id="profile">
          <Card>
            <Card.Header><Card.Title>个人资料</Card.Title><Card.Description>更新你的公开信息。</Card.Description></Card.Header>
            <Card.Content className="space-y-6">
              <div className="flex items-center gap-4">
                <Avatar size="lg"><Avatar.Fallback>林</Avatar.Fallback></Avatar>
                <div className="flex gap-2"><Button variant="secondary" size="sm">上传头像</Button><Button variant="ghost" size="sm">移除</Button></div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <TextField defaultValue={team[0].name}><Label>姓名</Label><Input /></TextField>
                <TextField defaultValue={team[0].email} type="email"><Label>邮箱</Label><Input /></TextField>
              </div>
              <div className="flex justify-end"><Button onPress={() => toast.success("资料已保存")}>保存</Button></div>
            </Card.Content>
          </Card>
        </Tabs.Panel>
        <Tabs.Panel id="security">
          <div className="grid gap-4 lg:grid-cols-2">
            <Card>
              <Card.Header><Card.Title>密码与两步验证</Card.Title></Card.Header>
              <Card.Content className="divide-y divide-border">
                <Row title="修改密码" description="上次修改于 3 个月前">
                  <Modal>
                    <Button variant="secondary" size="sm">修改</Button>
                    <Modal.Backdrop><Modal.Container><Modal.Dialog>
                      <Modal.CloseTrigger />
                      <Modal.Header><Modal.Heading>修改密码</Modal.Heading></Modal.Header>
                      <Modal.Body className="space-y-4">
                        <TextField type="password"><Label>当前密码</Label><Input /></TextField>
                        <TextField type="password"><Label>新密码</Label><Input /></TextField>
                      </Modal.Body>
                      <Modal.Footer><Button slot="close" variant="secondary">取消</Button><Button slot="close" onPress={() => toast.success("密码已更新")}>更新</Button></Modal.Footer>
                    </Modal.Dialog></Modal.Container></Modal.Backdrop>
                  </Modal>
                </Row>
                <Row title="两步验证" description="使用验证器应用保护账户"><Switch defaultSelected aria-label="两步验证"><Switch.Control><Switch.Thumb /></Switch.Control></Switch></Row>
                <Row title="快捷键" description="按下快捷键打开命令面板"><Kbd><Kbd.Abbr keyValue="command" />K</Kbd></Row>
              </Card.Content>
            </Card>
            <Card>
              <Card.Header><Card.Title>登录会话</Card.Title><Card.Description>当前已登录的设备。</Card.Description></Card.Header>
              <Card.Content className="divide-y divide-border">
                {sessions.map((session) => (
                  <Row key={session.device} title={session.device} description={`${session.location} · ${session.time}`}>
                    {session.current ? <Chip color="success" size="sm">当前</Chip> : <Button variant="ghost" size="sm">退出</Button>}
                  </Row>
                ))}
              </Card.Content>
            </Card>
          </div>
        </Tabs.Panel>
        <Tabs.Panel id="notifications">
          <Card>
            <Card.Header><Card.Title>通知偏好</Card.Title></Card.Header>
            <Card.Content className="divide-y divide-border">
              <Row title="邮件通知" description="订单、账单与安全提醒"><Switch defaultSelected aria-label="邮件通知"><Switch.Control><Switch.Thumb /></Switch.Control></Switch></Row>
              <Row title="推送通知" description="移动端即时提醒"><Switch aria-label="推送通知"><Switch.Control><Switch.Thumb /></Switch.Control></Switch></Row>
              <Row title="营销邮件" description="产品更新与活动"><Switch isDisabled aria-label="营销邮件"><Switch.Control><Switch.Thumb /></Switch.Control></Switch></Row>
            </Card.Content>
          </Card>
        </Tabs.Panel>
        <Tabs.Panel id="team">
          <Card>
            <Card.Header className="flex-row items-center justify-between"><div><Card.Title>团队成员</Card.Title><Card.Description>{team.length} 位成员</Card.Description></div><Button size="sm"><Icon name="plus" size={16} />邀请</Button></Card.Header>
            <Card.Content>
              <Table>
                <Table.ScrollContainer>
                  <Table.Content aria-label="团队成员">
                    <Table.Header>
                      <Table.Column isRowHeader>成员</Table.Column>
                      <Table.Column>角色</Table.Column>
                      <Table.Column>最近活跃</Table.Column>
                      <Table.Column className="text-right">操作</Table.Column>
                    </Table.Header>
                    <Table.Body>
                      {team.map((member) => (
                        <Table.Row key={member.email}>
                          <Table.Cell>
                            <div className="flex items-center gap-3">
                              <Avatar size="sm"><Avatar.Fallback>{member.name.slice(0, 1)}</Avatar.Fallback></Avatar>
                              <div><p className="font-medium">{member.name}</p><p className="text-xs text-muted">{member.email}</p></div>
                            </div>
                          </Table.Cell>
                          <Table.Cell><Chip size="sm" variant="secondary">{member.role}</Chip></Table.Cell>
                          <Table.Cell>{member.lastActive}</Table.Cell>
                          <Table.Cell className="text-right"><Button isIconOnly variant="ghost" size="sm" aria-label="更多"><Icon name="more-horizontal" size={16} /></Button></Table.Cell>
                        </Table.Row>
                      ))}
                    </Table.Body>
                  </Table.Content>
                </Table.ScrollContainer>
              </Table>
            </Card.Content>
          </Card>
        </Tabs.Panel>
        <Tabs.Panel id="billing">
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              {plans.map((plan) => (
                <Card key={plan.name} className={plan.recommended ? "border-accent" : undefined}>
                  <Card.Header>
                    <div className="flex items-center justify-between"><Card.Title>{plan.name}</Card.Title>{plan.recommended ? <Chip color="accent" size="sm">推荐</Chip> : null}</div>
                    <Card.Description>{plan.price === null ? "联系我们" : plan.price === 0 ? "免费" : `¥${plan.price}/月`}</Card.Description>
                  </Card.Header>
                  <Card.Content>
                    <ul className="space-y-2 text-sm">{plan.features.map((f) => <li key={f} className="flex items-center gap-2"><Icon name="check" size={14} />{f}</li>)}</ul>
                  </Card.Content>
                  <Card.Footer><Button fullWidth variant={plan.recommended ? "primary" : "secondary"}>{plan.price === null ? "联系销售" : "选择"}</Button></Card.Footer>
                </Card>
              ))}
            </div>
            <Card>
              <Card.Header><Card.Title>账单记录</Card.Title></Card.Header>
              <Card.Content>
                <Table>
                  <Table.ScrollContainer>
                    <Table.Content aria-label="账单记录">
                      <Table.Header>
                        <Table.Column isRowHeader>编号</Table.Column>
                        <Table.Column>日期</Table.Column>
                        <Table.Column>状态</Table.Column>
                        <Table.Column className="text-right">金额</Table.Column>
                      </Table.Header>
                      <Table.Body>
                        {invoices.map((invoice) => (
                          <Table.Row key={invoice.id}>
                            <Table.Cell className="font-medium">{invoice.id}</Table.Cell>
                            <Table.Cell>{invoice.date}</Table.Cell>
                            <Table.Cell><StatusBadge value={invoice.status} /></Table.Cell>
                            <Table.Cell className="text-right">¥{invoice.amount.toLocaleString()}</Table.Cell>
                          </Table.Row>
                        ))}
                      </Table.Body>
                    </Table.Content>
                  </Table.ScrollContainer>
                </Table>
              </Card.Content>
            </Card>
          </div>
        </Tabs.Panel>
      </Tabs>
      <Separator />
      <Card className="border-danger">
        <Card.Header><Card.Title className="text-danger">危险区域</Card.Title><Card.Description>删除账户后所有数据将不可恢复。</Card.Description></Card.Header>
        <Card.Footer>
          <AlertDialog>
            <Button variant="danger">删除账户</Button>
            <AlertDialog.Backdrop><AlertDialog.Container><AlertDialog.Dialog>
              <AlertDialog.Header><AlertDialog.Icon status="danger" /><AlertDialog.Heading>确认删除账户？</AlertDialog.Heading></AlertDialog.Header>
              <AlertDialog.Body>此操作无法撤销，所有项目与数据都会被永久删除。</AlertDialog.Body>
              <AlertDialog.Footer><Button slot="close" variant="secondary">取消</Button><Button slot="close" variant="danger" onPress={() => toast.danger("账户已删除")}>删除</Button></AlertDialog.Footer>
            </AlertDialog.Dialog></AlertDialog.Container></AlertDialog.Backdrop>
          </AlertDialog>
        </Card.Footer>
      </Card>
    </div>
  )
}
