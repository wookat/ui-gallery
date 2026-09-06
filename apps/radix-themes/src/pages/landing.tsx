import { useState } from "react"
import { Accordion } from "radix-ui"
import {
  AspectRatio,
  Badge,
  Box,
  Button,
  Card,
  Container,
  Dialog,
  Flex,
  Grid,
  Heading,
  IconButton,
  Section,
  Select,
  Separator,
  Switch,
  Text,
} from "@radix-ui/themes"
import landing from "@ui-gallery/spec/mock/landing.json"
import plans from "@ui-gallery/spec/mock/plans.json"
import { Icon } from "@/icons"

export function LandingPage() {
  const [yearly, setYearly] = useState(false)
  return (
    <Box>
      <Box asChild>
        <nav>
          <Container size="4">
            <Box px={{ initial: "4", md: "6" }} py={{ initial: "4", md: "5" }}>
              <Flex align="center" justify="between">
                <Text size="5" weight="bold">
                  Acme Console
                </Text>
                <Flex gap="5" display={{ initial: "none", md: "flex" }}>
                  {["产品", "解决方案", "定价", "客户", "资源"].map((label) => (
                    <a href={`#${label}`} key={label}>
                      {label}
                    </a>
                  ))}
                </Flex>
                <Flex gap="2" align="center">
                  <Box display={{ initial: "none", md: "block" }}>
                    <Button>免费开始</Button>
                  </Box>
                  <Box display={{ initial: "block", md: "none" }}>
                    <Dialog.Root>
                      <Dialog.Trigger>
                        <IconButton
                          size="3"
                          variant="ghost"
                          style={{ minHeight: "40px", minWidth: "40px" }}
                        >
                          <Icon name="menu" />
                        </IconButton>
                      </Dialog.Trigger>
                      <Dialog.Content
                        style={{
                          position: "fixed",
                          inset: "0 0 0 auto",
                          width: "280px",
                          maxWidth: "100vw",
                          maxHeight: "100vh",
                          borderRadius: 0,
                          transform: "none",
                        }}
                      >
                        <Dialog.Title>导航</Dialog.Title>
                        <Flex direction="column" gap="3" mt="4">
                          {["产品", "解决方案", "定价", "客户", "资源"].map(
                            (label) => (
                              <Button
                                key={label}
                                size="3"
                                variant="ghost"
                                style={{ justifyContent: "flex-start" }}
                              >
                                {label}
                              </Button>
                            )
                          )}
                        </Flex>
                      </Dialog.Content>
                    </Dialog.Root>
                  </Box>
                </Flex>
              </Flex>
            </Box>
          </Container>
        </nav>
      </Box>
      <Section size="3">
        <Container size="4">
          <Box px={{ initial: "4", md: "6" }}>
            <Grid columns={{ initial: "1", md: "2" }} gap="8" align="center">
              <Flex direction="column" gap="5">
                <Badge size="2" variant="soft" style={{ width: "fit-content" }}>
                  Acme Console
                </Badge>
                <Heading size={{ initial: "8", md: "9" }}>
                  {landing.hero.title}
                </Heading>
                <Text size="4" color="gray">
                  {landing.hero.subtitle}
                </Text>
                <Flex gap="3" wrap="wrap">
                  <Button size="3">{landing.hero.primary}</Button>
                  <Button size="3" variant="outline">
                    {landing.hero.secondary}
                  </Button>
                </Flex>
                <Text size="2" color="gray">
                  {landing.hero.social}
                </Text>
              </Flex>
              <AspectRatio ratio={16 / 9}>
                <Box height="100%" style={{ background: "var(--gray-3)" }}>
                  <Flex align="center" justify="center" height="100%">
                    <Text color="gray">产品截图</Text>
                  </Flex>
                </Box>
              </AspectRatio>
            </Grid>
          </Box>
        </Container>
      </Section>
      <Section size="2">
        <Container size="4">
          <Box px={{ initial: "4", md: "6" }}>
            <Grid columns={{ initial: "2", sm: "3", md: "6" }} gap="3">
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <Box key={item} p="4" style={{ background: "var(--gray-5)" }}>
                  <Text size="1">LOGO</Text>
                </Box>
              ))}
            </Grid>
          </Box>
        </Container>
      </Section>
      <Section>
        <Container size="4">
          <Box px={{ initial: "4", md: "6" }}>
            <Heading align="center" size="7">
              为团队而生
            </Heading>
            <Grid columns={{ initial: "1", sm: "2", lg: "3" }} gap="4" mt="6">
              {landing.features.map((feature) => (
                <Card key={feature.title}>
                  <Icon name={feature.icon} size={24} />
                  <Heading size="4" mt="3">
                    {feature.title}
                  </Heading>
                  <Text color="gray" as="p" mt="2">
                    {feature.desc}
                  </Text>
                </Card>
              ))}
            </Grid>
          </Box>
        </Container>
      </Section>
      {landing.features.slice(0, 3).map((feature, index) => (
        <Section key={feature.title}>
          <Container size="4">
            <Box px={{ initial: "4", md: "6" }}>
              <Grid columns={{ initial: "1", md: "2" }} gap="8" align="center">
                <Box style={{ order: index % 2 ? 2 : 1 }}>
                  <Box height="260px" style={{ background: "var(--gray-3)" }} />
                </Box>
                <Box style={{ order: index % 2 ? 1 : 2 }}>
                  <Heading size="6">{feature.title}</Heading>
                  <Text size="3" color="gray" as="p" mt="3">
                    {feature.desc}
                  </Text>
                </Box>
              </Grid>
            </Box>
          </Container>
        </Section>
      ))}
      <Box
        p={{ initial: "6", md: "9" }}
        style={{ background: "var(--accent-3)" }}
      >
        <Container size="4">
          <Box px={{ initial: "4", md: "6" }}>
            <Grid columns={{ initial: "1", xs: "2", md: "4" }} gap="5">
              {landing.numbers.map((number) => (
                <Box key={number.label}>
                  <Heading size={{ initial: "7", md: "8" }} wrap="nowrap">
                    {number.value}
                  </Heading>
                  <Text color="gray">{number.label}</Text>
                </Box>
              ))}
            </Grid>
          </Box>
        </Container>
      </Box>
      <Section>
        <Container size="4">
          <Box px={{ initial: "4", md: "6" }}>
            <Flex align="center" justify="between" wrap="wrap" gap="3">
              <Heading size="7">定价简单透明</Heading>
              <Flex align="center" gap="2">
                <Text>月付</Text>
                <Switch checked={yearly} onCheckedChange={setYearly} />
                <Text>年付</Text>
              </Flex>
            </Flex>
            <Grid columns={{ initial: "1", md: "3" }} gap="4" mt="5">
              {plans.map((plan) => (
                <Card key={plan.name}>
                  <Flex justify="between">
                    <Heading size="5">{plan.name}</Heading>
                    {plan.recommended ? (
                      <Badge color="green">推荐</Badge>
                    ) : null}
                  </Flex>
                  <Heading size="7" mt="4">
                    {plan.price === null
                      ? "联系销售"
                      : `¥${yearly ? plan.price * 10 : plan.price}`}
                    <Text size="2" color="gray">
                      {plan.price === null ? "" : yearly ? " / 年" : " / 月"}
                    </Text>
                  </Heading>
                  <Flex direction="column" gap="2" mt="4">
                    {plan.features.map((feature) => (
                      <Text key={feature} size="2">
                        <Icon name="check" /> {feature}
                      </Text>
                    ))}
                  </Flex>
                  <Button
                    variant={plan.recommended ? "solid" : "outline"}
                    mt="5"
                  >
                    选择计划
                  </Button>
                </Card>
              ))}
            </Grid>
          </Box>
        </Container>
      </Section>
      <Section>
        <Container size="4">
          <Box px={{ initial: "4", md: "6" }}>
            <Heading align="center" size="7">
              客户怎么说
            </Heading>
            <Grid columns={{ initial: "1", md: "3" }} gap="4" mt="5">
              {landing.testimonials.map((testimonial) => (
                <Card key={testimonial.name}>
                  <Text size="3">“{testimonial.quote}”</Text>
                  <Text as="div" size="2" weight="bold" mt="4">
                    {testimonial.name}
                  </Text>
                  <Text size="1" color="gray">
                    {testimonial.company}
                  </Text>
                </Card>
              ))}
            </Grid>
          </Box>
        </Container>
      </Section>
      <Section>
        <Container size="4">
          <Box px={{ initial: "4", md: "6" }}>
            <Heading size="7" align="center">
              常见问题
            </Heading>
            <Box style={{ maxWidth: "760px", margin: "24px auto" }}>
              <Accordion.Root type="single" collapsible>
                {landing.faq.map((item, index) => (
                  <Accordion.Item key={item.q} value={`item-${index}`}>
                    <Accordion.Header>
                      <Accordion.Trigger asChild>
                        <Button
                          variant="ghost"
                          style={{
                            width: "100%",
                            justifyContent: "space-between",
                          }}
                        >
                          {item.q}
                          <Icon name="chevron-down" />
                        </Button>
                      </Accordion.Trigger>
                    </Accordion.Header>
                    <Accordion.Content>
                      <Box p="3">
                        <Text color="gray">{item.a}</Text>
                      </Box>
                    </Accordion.Content>
                  </Accordion.Item>
                ))}
              </Accordion.Root>
            </Box>
          </Box>
        </Container>
      </Section>
      <Section>
        <Container size="4">
          <Box px={{ initial: "4", md: "6" }}>
            <Card size="4">
              <Flex direction="column" align="center" gap="4">
                <Heading size="7">准备好开始了吗？</Heading>
                <Button size="3">{landing.hero.primary}</Button>
              </Flex>
            </Card>
          </Box>
        </Container>
      </Section>
      <Box p={{ initial: "5", md: "8" }}>
        <Container size="4">
          <Box px={{ initial: "4", md: "6" }}>
            <Grid columns={{ initial: "2", md: "4" }} gap="5">
              <Box>
                <Text weight="bold">产品</Text>
                <Text as="div" size="2" mt="3">
                  功能
                </Text>
                <Text as="div" size="2">
                  定价
                </Text>
              </Box>
              <Box>
                <Text weight="bold">资源</Text>
                <Text as="div" size="2" mt="3">
                  文档
                </Text>
                <Text as="div" size="2">
                  帮助中心
                </Text>
              </Box>
              <Box>
                <Text weight="bold">公司</Text>
                <Text as="div" size="2" mt="3">
                  关于我们
                </Text>
                <Text as="div" size="2">
                  联系我们
                </Text>
              </Box>
              <Box>
                <Text weight="bold">法律</Text>
                <Text as="div" size="2" mt="3">
                  隐私
                </Text>
                <Text as="div" size="2">
                  条款
                </Text>
              </Box>
            </Grid>
            <Separator size="4" my="6" />
            <Flex justify="between" align="center" wrap="wrap" gap="3">
              <Text size="2" color="gray">
                © Acme Console
              </Text>
              <Flex gap="2">
                <IconButton
                  size="3"
                  variant="ghost"
                  aria-label="社交媒体"
                  style={{ minHeight: "40px", minWidth: "40px" }}
                >
                  <Icon name="globe" />
                </IconButton>
                <Select.Root defaultValue="zh">
                  <Select.Trigger />
                  <Select.Content>
                    <Select.Item value="zh">简体中文</Select.Item>
                    <Select.Item value="en">English</Select.Item>
                  </Select.Content>
                </Select.Root>
              </Flex>
            </Flex>
          </Box>
        </Container>
      </Box>
    </Box>
  )
}
