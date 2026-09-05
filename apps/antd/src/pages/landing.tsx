import { useState } from "react"
import {
  Avatar,
  Badge,
  Button,
  Card,
  Collapse,
  Drawer,
  Flex,
  Layout,
  List,
  Menu,
  Row,
  Col,
  Select,
  Skeleton,
  Space,
  Statistic,
  Switch,
  Typography,
} from "antd"
import landing from "@ui-gallery/spec/mock/landing.json"
import plans from "@ui-gallery/spec/mock/plans.json"
import { Icon } from "@/icons"
import { avatar } from "@/pages/shared"

const links = ["产品", "方案", "定价", "文档", "关于"]

export function LandingPage() {
  const [annual, setAnnual] = useState(false)
  const [drawer, setDrawer] = useState(false)
  return (
    <div className="public-page">
      <Layout.Header className="landing-header">
        <div className="landing-container">
          <Typography.Title level={4} style={{ margin: 0 }}>
            Acme Console
          </Typography.Title>
          <Menu
            className="desktop-only"
            mode="horizontal"
            style={{ flex: 1, border: 0, background: "transparent" }}
            items={links.map((label) => ({
              key: label,
              label: <a href={`#${label}`}>{label}</a>,
            }))}
          />
          <Button
            className="mobile-only"
            icon={<Icon name="menu" />}
            onClick={() => setDrawer(true)}
            aria-label="打开菜单"
            style={{ marginLeft: "auto" }}
          />
          <Button
            type="primary"
            onClick={() => (window.location.href = "/apps/antd/login")}
          >
            免费开始
          </Button>
        </div>
      </Layout.Header>
      <Drawer
        title="Acme Console"
        placement="right"
        open={drawer}
        onClose={() => setDrawer(false)}
      >
        <Menu
          mode="inline"
          items={links.map((label) => ({ key: label, label }))}
        />
      </Drawer>
      <main className="landing-container landing-main">
        <section className="landing-section">
          <Row gutter={[32, 32]} align="middle">
            <Col xs={24} lg={13}>
              <Typography.Title style={{ fontSize: "clamp(36px, 6vw, 64px)" }}>
                {landing.hero.title}
              </Typography.Title>
              <Typography.Paragraph style={{ fontSize: 18 }}>
                {landing.hero.subtitle}
              </Typography.Paragraph>
              <Space>
                <Button type="primary" size="large">
                  免费开始
                </Button>
                <Button size="large">查看演示</Button>
              </Space>
              <Flex align="center" gap={8} style={{ marginTop: 20 }}>
                <Avatar.Group>
                  {landing.testimonials.slice(0, 4).map((item) => (
                    <Avatar key={item.name}>{item.name.slice(0, 1)}</Avatar>
                  ))}
                </Avatar.Group>
                <Typography.Text type="secondary">
                  {landing.hero.social}
                </Typography.Text>
              </Flex>
            </Col>
            <Col xs={24} lg={11}>
              <Card>
                <div className="landing-preview" role="img" aria-label="产品截图占位">
                  <Icon name="layout-dashboard" size={40} />
                </div>
              </Card>
            </Col>
          </Row>
        </section>
        <section className="landing-section">
          <Typography.Title level={2}>值得信赖的工作方式</Typography.Title>
          <Flex gap={8} wrap>
            {Array.from({ length: 6 }, (_, index) => (
              <Skeleton.Node
                key={index}
                active
                style={{ width: 120, height: 42 }}
              />
            ))}
          </Flex>
        </section>
        <section className="landing-section">
          <Row gutter={[16, 16]}>
            {landing.features.map((feature) => (
              <Col xs={24} sm={12} lg={8} key={feature.title}>
                <Card hoverable>
                  <Icon name={feature.icon} size={28} />
                  <Typography.Title level={4}>{feature.title}</Typography.Title>
                  <Typography.Paragraph>{feature.desc}</Typography.Paragraph>
                </Card>
              </Col>
            ))}
          </Row>
        </section>
        {landing.features.slice(0, 3).map((feature, index) => (
          <section className="landing-section" key={`split-${feature.title}`}>
            <Row gutter={[32, 32]} align="middle">
              <Col xs={24} md={12} order={index % 2 === 0 ? 1 : 2}>
                <Typography.Title level={2}>{feature.title}</Typography.Title>
                <Typography.Paragraph>{feature.desc}</Typography.Paragraph>
              </Col>
              <Col xs={24} md={12} order={index % 2 === 0 ? 2 : 1}>
                <Card>
                  <div
                    className="landing-preview compact"
                    role="img"
                    aria-label="功能截图占位"
                  >
                    <Icon name={feature.icon} size={36} />
                  </div>
                </Card>
              </Col>
            </Row>
          </section>
        ))}
        <section className="landing-section">
          <Row gutter={[16, 16]}>
            {landing.numbers.map((number) => (
              <Col xs={12} md={6} key={number.label}>
                <Statistic title={number.label} value={number.value} />
              </Col>
            ))}
          </Row>
        </section>
        <section className="landing-section">
          <Flex justify="space-between" align="center" wrap gap={12}>
            <Typography.Title level={2}>选择适合你的计划</Typography.Title>
            <Switch
              checked={annual}
              onChange={setAnnual}
              checkedChildren="年付"
              unCheckedChildren="月付"
            />
          </Flex>
          <Row gutter={[16, 16]}>
            {plans.map((plan) => (
              <Col xs={24} md={8} key={plan.name}>
                {plan.recommended ? (
                  <Badge.Ribbon text="推荐">
                    <PricingCard plan={plan} annual={annual} />
                  </Badge.Ribbon>
                ) : (
                  <PricingCard plan={plan} annual={annual} />
                )}
              </Col>
            ))}
          </Row>
        </section>
        <section className="landing-section">
          <Typography.Title level={2}>用户评价</Typography.Title>
          <Row gutter={[16, 16]}>
            {landing.testimonials.map((item) => (
              <Col xs={24} sm={12} lg={8} key={item.name}>
                <Card>
                  <Space>
                    {avatar(item.name)}
                    <b>{item.name}</b>
                    <Typography.Text type="secondary">
                      {item.company}
                    </Typography.Text>
                  </Space>
                  <Typography.Paragraph style={{ marginTop: 16 }}>
                    “{item.quote}”
                  </Typography.Paragraph>
                </Card>
              </Col>
            ))}
          </Row>
        </section>
        <section className="landing-section">
          <Typography.Title level={2}>常见问题</Typography.Title>
          <Collapse
            accordion
            items={landing.faq.map((item) => ({
              key: item.q,
              label: item.q,
              children: item.a,
            }))}
          />
        </section>
        <Card style={{ marginBottom: 48 }}>
          <Flex justify="space-between" align="center" wrap gap={16}>
            <div>
              <Typography.Title level={3}>准备好开始了吗？</Typography.Title>
              <Typography.Text type="secondary">
                在一个控制台里推进下一步。
              </Typography.Text>
            </div>
            <Button type="primary">创建工作空间</Button>
          </Flex>
        </Card>
      </main>
      <Layout.Footer>
        <div className="landing-container">
        <Row gutter={[16, 16]}>
          <Col xs={12} md={6}>
            <Typography.Title level={5}>产品</Typography.Title>
            <List
              size="small"
              dataSource={["功能概览", "定价"]}
              renderItem={(item) => <List.Item>{item}</List.Item>}
            />
          </Col>
          <Col xs={12} md={6}>
            <Typography.Title level={5}>公司</Typography.Title>
            <List
              size="small"
              dataSource={["关于我们", "联系团队"]}
              renderItem={(item) => <List.Item>{item}</List.Item>}
            />
          </Col>
          <Col xs={12} md={6}>
            <Typography.Title level={5}>资源</Typography.Title>
            <List
              size="small"
              dataSource={["文档", "帮助中心"]}
              renderItem={(item) => <List.Item>{item}</List.Item>}
            />
          </Col>
          <Col xs={12} md={6}>
            <Typography.Title level={5}>法律</Typography.Title>
            <List
              size="small"
              dataSource={["隐私政策", "服务条款"]}
              renderItem={(item) => <List.Item>{item}</List.Item>}
            />
          </Col>
        </Row>
        <Flex justify="space-between" wrap style={{ marginTop: 24 }}>
          <Space>
            <Button shape="circle" icon={<Icon name="github" />} />
            <Button shape="circle" icon={<Icon name="globe" />} />
          </Space>
          <span>© 2026 Acme Console</span>
          <Select
            size="small"
            defaultValue="中文"
            options={[{ value: "中文" }, { value: "English" }]}
          />
        </Flex>
        </div>
      </Layout.Footer>
    </div>
  )
}

function PricingCard({
  plan,
  annual,
}: {
  plan: (typeof plans)[number]
  annual: boolean
}) {
  return (
    <Card title={plan.name}>
      <Typography.Title level={2}>
        {plan.price === null
          ? "定制"
          : `¥${annual ? plan.price * 10 : plan.price}`}
      </Typography.Title>
      <List
        dataSource={plan.features}
        renderItem={(feature) => (
          <List.Item>
            <Icon name="check" /> {feature}
          </List.Item>
        )}
      />
      <Button type={plan.recommended ? "primary" : "default"} block>
        选择方案
      </Button>
    </Card>
  )
}
