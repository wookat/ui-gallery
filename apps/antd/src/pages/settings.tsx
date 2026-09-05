import { useState } from "react"
import {
  App,
  Avatar,
  Badge,
  Button,
  Card,
  Form,
  Grid,
  Input,
  List,
  QRCode,
  Row,
  Col,
  Select,
  Segmented,
  Space,
  Switch,
  Table,
  Tabs,
  Tag,
  Typography,
  Upload,
} from "antd"
import team from "@ui-gallery/spec/mock/team.json"
import sessions from "@ui-gallery/spec/mock/sessions.json"
import plans from "@ui-gallery/spec/mock/plans.json"
import invoices from "@ui-gallery/spec/mock/invoices.json"
import { Icon } from "@/icons"
import { PageHeader, avatar } from "@/pages/shared"

function DeleteAccount({ onDelete }: { onDelete: () => void }) {
  const [value, setValue] = useState("")
  return (
    <Space direction="vertical" style={{ width: "100%" }}>
      <Typography.Text>输入 DELETE 以确认。</Typography.Text>
      <Input
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder='输入 "DELETE"'
      />
      <Button
        type="primary"
        danger
        disabled={value !== "DELETE"}
        onClick={onDelete}
      >
        删除账户
      </Button>
    </Space>
  )
}

export function SettingsPage() {
  const [active, setActive] = useState("profile")
  const { modal, message } = App.useApp()
  const screens = Grid.useBreakpoint()
  const danger = () =>
    modal.confirm({
      title: "删除账户",
      content: (
        <DeleteAccount onDelete={() => message.success("账户删除请求已提交")} />
      ),
      okText: "关闭",
      okButtonProps: { style: { display: "none" } },
      cancelText: "取消",
    })
  const items = [
    {
      key: "profile",
      label: "个人资料",
      children: (
        <Card title="个人资料">
          <Form layout="vertical">
            <Form.Item label="头像">
              <Upload showUploadList={false}>
                <Avatar size={64}>{team[0].name.slice(0, 1)}</Avatar>
                <Button type="link">更换头像</Button>
              </Upload>
            </Form.Item>
            <Form.Item label="姓名">
              <Input defaultValue={team[0].name} />
            </Form.Item>
            <Form.Item label="简介">
              <Input.TextArea rows={3} />
            </Form.Item>
            <Form.Item label="语言">
              <Select
                defaultValue="中文"
                options={["中文", "English", "日本語"].map((value) => ({
                  value,
                }))}
              />
            </Form.Item>
            <Form.Item label="时区">
              <Select
                showSearch
                defaultValue="Asia/Shanghai"
                options={[
                  "Asia/Shanghai",
                  "Asia/Tokyo",
                  "Europe/London",
                  "America/New_York",
                ].map((value) => ({ value }))}
              />
            </Form.Item>
            <Button type="primary">保存更改</Button>
          </Form>
        </Card>
      ),
    },
    {
      key: "security",
      label: "账号安全",
      children: (
        <Space direction="vertical" style={{ width: "100%" }}>
          <Card title="安全设置">
            <Form layout="vertical">
              <Form.Item label="当前密码">
                <Input.Password />
              </Form.Item>
              <Form.Item label="新密码">
                <Input.Password />
              </Form.Item>
              <Switch
                checkedChildren="已开启 2FA"
                unCheckedChildren="开启 2FA"
              />
              <QRCode value="acme-console-2fa" />
            </Form>
          </Card>
          <Card title="活跃会话">
            <List
              dataSource={sessions}
              renderItem={(session) => (
                <List.Item
                  actions={[
                    !session.current && <Button key="revoke">注销</Button>,
                  ]}
                >
                  {session.device} · {session.location}
                  <Tag>{session.current ? "当前会话" : session.time}</Tag>
                </List.Item>
              )}
            />
          </Card>
        </Space>
      ),
    },
    {
      key: "notifications",
      label: "通知",
      children: (
        <Card title="通知偏好">
          <Segmented options={["邮件", "推送", "站内"]} block />
          <List
            header="项目通知"
            dataSource={["项目更新", "账单提醒"]}
            renderItem={(item) => (
              <List.Item extra={<Switch defaultChecked />}>{item}</List.Item>
            )}
          />
          <List
            header="团队通知"
            dataSource={["团队活动", "产品新闻"]}
            renderItem={(item) => (
              <List.Item extra={<Switch />}>{item}</List.Item>
            )}
          />
        </Card>
      ),
    },
    {
      key: "team",
      label: "团队",
      children: (
        <Card title="团队成员">
          <Table
            rowKey="email"
            dataSource={team}
            columns={[
              {
                title: "成员",
                render: (_, member) => (
                  <Space>
                    {avatar(member.name)}
                    <span>
                      {member.name}
                      <Typography.Text
                        type="secondary"
                        style={{ display: "block" }}
                      >
                        {member.email}
                      </Typography.Text>
                    </span>
                  </Space>
                ),
              },
              {
                title: "角色",
                dataIndex: "role",
                render: (value) => (
                  <Select
                    defaultValue={value}
                    options={["owner", "admin", "member", "viewer"].map(
                      (role) => ({ value: role })
                    )}
                  />
                ),
              },
              { title: "操作", render: () => <Button danger>移除</Button> },
            ]}
          />
          <Space.Compact block>
            <Input placeholder="输入邮箱" />
            <Button icon={<Icon name="plus" />}>邀请</Button>
          </Space.Compact>
        </Card>
      ),
    },
    {
      key: "billing",
      label: "计费",
      children: (
        <Space direction="vertical" style={{ width: "100%" }}>
          <Card title="当前计划">
            <Tag color="blue">Pro</Tag> 按月计费
          </Card>
          <Row gutter={[16, 16]}>
            {plans.map((plan) => (
              <Col xs={24} md={8} key={plan.name}>
                {plan.recommended ? (
                  <Badge.Ribbon text="推荐">
                    <PlanCard plan={plan} />
                  </Badge.Ribbon>
                ) : (
                  <PlanCard plan={plan} />
                )}
              </Col>
            ))}
          </Row>
          <Card title="发票记录">
            <Table
              rowKey="id"
              dataSource={invoices}
              pagination={false}
              columns={[
                { title: "编号", dataIndex: "id" },
                { title: "日期", dataIndex: "date" },
                {
                  title: "金额",
                  dataIndex: "amount",
                  render: (value) => `¥${value}`,
                },
                {
                  title: "状态",
                  dataIndex: "status",
                  render: (value) => (
                    <Tag color={value === "paid" ? "success" : "warning"}>
                      {value}
                    </Tag>
                  ),
                },
              ]}
            />
          </Card>
        </Space>
      ),
    },
  ]
  return (
    <>
      <PageHeader title="设置" description="管理账户、通知、团队与订阅。" />
      <Tabs
        tabPosition={screens.md ? "left" : "top"}
        activeKey={active}
        onChange={setActive}
        items={items}
      />
      <Card
        title="危险区"
        style={{ marginTop: 16, borderColor: "var(--ant-color-error)" }}
      >
        <Typography.Paragraph>
          删除账户会永久移除所有数据。
        </Typography.Paragraph>
        <Button danger onClick={danger}>
          删除账户
        </Button>
      </Card>
    </>
  )
}

function PlanCard({ plan }: { plan: (typeof plans)[number] }) {
  return (
    <Card title={plan.name}>
      <Typography.Title level={3}>
        {plan.price === null ? "定制" : `¥${plan.price}`}
      </Typography.Title>
      <List
        size="small"
        dataSource={plan.features}
        renderItem={(feature) => (
          <List.Item>
            <Icon name="check" /> {feature}
          </List.Item>
        )}
      />
    </Card>
  )
}
