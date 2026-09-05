import { useState } from "react"
import { Accordion, ActionIcon, Anchor, AspectRatio, Avatar, Badge, Box, Burger, Button, Card, Center, Container, Divider, Drawer, Grid, Group, List, Select, SimpleGrid, Stack, Switch, Text, ThemeIcon, Title } from "@mantine/core"
import { Carousel } from "@mantine/carousel"
import { Link } from "react-router-dom"
import { Icon } from "@ui-gallery/icons-react"
import landing from "@ui-gallery/spec/mock/landing.json"
import plans from "@ui-gallery/spec/mock/plans.json"
import { useThemeToggle } from "@/theme"
import { muted, money, placeholderBg } from "./shared"

const navLinks = ["产品", "解决方案", "定价", "文档", "博客"]
const footerCols = [
  { title: "产品", links: ["功能", "定价", "更新日志", "路线图"] },
  { title: "资源", links: ["文档", "API", "社区", "状态"] },
  { title: "公司", links: ["关于", "招聘", "博客", "联系"] },
  { title: "法律", links: ["隐私", "条款", "安全", "Cookie"] },
]
const splits = landing.features.slice(0, 3)

export function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [yearly, setYearly] = useState(false)
  const { computed, toggle } = useThemeToggle()

  return (
    <Box>
      <Box component="header" pos="sticky" top={0} style={{ zIndex: 10, borderBottom: "1px solid var(--mantine-color-default-border)", background: "var(--mantine-color-body)" }}>
        <Container size="lg" h={60}>
          <Group h="100%" justify="space-between">
            <Group gap="xs"><ThemeIcon radius="md"><Text fw={700} size="sm">A</Text></ThemeIcon><Text fw={600}>Acme Console</Text></Group>
            <Group gap="lg" visibleFrom="md">{navLinks.map((l) => <Anchor key={l} size="sm" c={muted} href="#">{l}</Anchor>)}</Group>
            <Group gap="xs">
              <ActionIcon size={40} variant="default" onClick={toggle} aria-label="切换主题"><Icon name={computed === "dark" ? "sun" : "moon"} size={16} /></ActionIcon>
              <Button variant="default" size="sm" visibleFrom="sm" component={Link} to="/login">登录</Button>
              <Button size="sm" visibleFrom="sm">{landing.hero.primary}</Button>
              <Burger hiddenFrom="md" size="sm" w={40} h={40} opened={menuOpen} onClick={() => setMenuOpen(true)} aria-label="菜单" />
            </Group>
          </Group>
        </Container>
      </Box>
      <Drawer opened={menuOpen} onClose={() => setMenuOpen(false)} title="菜单" size="xs">
        <Stack>{navLinks.map((l) => <Anchor key={l} href="#" onClick={() => setMenuOpen(false)}>{l}</Anchor>)}<Divider /><Button component={Link} to="/login" variant="default">登录</Button><Button>{landing.hero.primary}</Button></Stack>
      </Drawer>

      <Container size="lg" py={{ base: 48, md: 96 }}>
        <Stack align="center" gap="lg" ta="center">
          <Badge variant="light" size="lg">全新 2.0 版本</Badge>
          <Title order={1} fz={{ base: 32, md: 52 }} lh={1.15} maw={800}>{landing.hero.title}</Title>
          <Text c={muted} size="lg" maw={600}>{landing.hero.subtitle}</Text>
          <Group><Button size="md" rightSection={<Icon name="arrow-right" size={16} />}>{landing.hero.primary}</Button><Button size="md" variant="default" leftSection={<Icon name="play" size={16} />}>{landing.hero.secondary}</Button></Group>
          <Group gap="sm"><Avatar.Group>{landing.testimonials.slice(0, 4).map((t) => <Avatar key={t.name} radius="xl" color="initials" name={t.name}>{t.name.slice(0, 1)}</Avatar>)}</Avatar.Group><Text size="sm" c={muted}>{landing.hero.social}</Text></Group>
          <AspectRatio ratio={16 / 9} w="100%" maw={960} mt="xl">
            <Center style={{ border: "1px solid var(--mantine-color-default-border)", borderRadius: 12, background: placeholderBg }}><Stack align="center" gap="xs" c={muted}><Icon name="grid" size={40} /><Text size="sm">产品截图占位</Text></Stack></Center>
          </AspectRatio>
        </Stack>
      </Container>

      <Container size="lg" py="xl">
        <Text ta="center" size="sm" c={muted} mb="lg">受到各行业团队信任</Text>
        <SimpleGrid cols={{ base: 3, md: 6 }}>{Array.from({ length: 6 }).map((_, i) => <Center key={i} h={40} style={{ borderRadius: 8, background: placeholderBg }}><Text size="xs" c={muted} fw={600}>LOGO {i + 1}</Text></Center>)}</SimpleGrid>
      </Container>

      <Container size="lg" py={{ base: 48, md: 80 }}>
        <Stack align="center" ta="center" mb="xl"><Title order={2}>一站式团队控制台</Title><Text c={muted} maw={560}>所有你需要的能力，开箱即用。</Text></Stack>
        <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="lg">
          {landing.features.map((f) => (
            <Card key={f.title} withBorder radius="md" padding="lg">
              <ThemeIcon size={40} radius="md" variant="light"><Icon name={f.icon} size={20} /></ThemeIcon>
              <Text fw={600} mt="md">{f.title}</Text>
              <Text size="sm" c={muted} mt={4}>{f.desc}</Text>
            </Card>
          ))}
        </SimpleGrid>
      </Container>

      <Container size="lg" py="xl">
        <Stack gap={64}>
          {splits.map((f, i) => (
            <Grid key={f.title} align="center" gap="xl">
              <Grid.Col span={{ base: 12, md: 6 }} order={{ base: 1, md: i % 2 ? 2 : 1 }}>
                <Badge variant="light" mb="sm">{f.title}</Badge>
                <Title order={3}>{f.title}</Title>
                <Text c={muted} mt="sm">{f.desc}</Text>
                <List mt="md" spacing="xs" size="sm" icon={<ThemeIcon size={18} radius="xl" color="teal" variant="light"><Icon name="check" size={12} /></ThemeIcon>}>
                  {landing.features.filter((x) => x !== f).slice(0, 3).map((x) => <List.Item key={x.title}>{x.desc}</List.Item>)}
                </List>
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 6 }} order={{ base: 2, md: i % 2 ? 1 : 2 }}>
                <AspectRatio ratio={4 / 3}><Center style={{ border: "1px solid var(--mantine-color-default-border)", borderRadius: 12, background: placeholderBg }}><Icon name={f.icon} size={48} /></Center></AspectRatio>
              </Grid.Col>
            </Grid>
          ))}
        </Stack>
      </Container>

      <Box py={{ base: 48, md: 64 }} bg="var(--mantine-primary-color-filled)" c="white">
        <Container size="lg">
          <SimpleGrid cols={{ base: 2, md: 4 }}>{landing.numbers.map((n) => <Stack key={n.label} align="center" gap={4}><Text fz={{ base: 28, md: 40 }} fw={700}>{n.value}</Text><Text size="sm" opacity={0.85}>{n.label}</Text></Stack>)}</SimpleGrid>
        </Container>
      </Box>

      <Container size="lg" py={{ base: 48, md: 80 }} id="pricing">
        <Stack align="center" ta="center" mb="xl"><Title order={2}>简单透明的定价</Title><Group gap="sm"><Text size="sm">按月</Text><Switch checked={yearly} onChange={(e) => setYearly(e.currentTarget.checked)} /><Text size="sm">按年</Text><Badge color="green" variant="light">省 20%</Badge></Group></Stack>
        <SimpleGrid cols={{ base: 1, md: 3 }} spacing="lg">
          {plans.map((p) => (
            <Card key={p.name} withBorder radius="md" padding="xl" style={p.recommended ? { borderColor: "var(--mantine-primary-color-filled)", borderWidth: 2 } : undefined}>
              <Group justify="space-between"><Text fw={600} size="lg">{p.name}</Text>{p.recommended ? <Badge>推荐</Badge> : null}</Group>
              <Text fz={36} fw={700} mt="sm">{p.price === null ? "定制" : p.price === 0 ? "免费" : money(yearly ? Math.round(p.price * 12 * 0.8) : p.price)}{p.price ? <Text span size="sm" c={muted} fw={400}> /{yearly ? "年" : "月"}</Text> : null}</Text>
              <List mt="lg" spacing="sm" size="sm" icon={<ThemeIcon size={18} radius="xl" color="teal" variant="light"><Icon name="check" size={12} /></ThemeIcon>}>{p.features.map((f) => <List.Item key={f}>{f}</List.Item>)}</List>
              <Button mt="xl" fullWidth variant={p.recommended ? "filled" : "default"}>{p.price === null ? "联系销售" : landing.hero.primary}</Button>
            </Card>
          ))}
        </SimpleGrid>
      </Container>

      <Container size="lg" py="xl">
        <Title order={2} ta="center" mb="xl">用户怎么说</Title>
        <Carousel slideSize={{ base: "100%", sm: "50%", md: "33.333%" }} slideGap="md" controlSize={40} styles={{ indicator: { width: 24, height: 8 } }} emblaOptions={{ align: "start", loop: true }} withIndicators>
          {landing.testimonials.map((t) => (
            <Carousel.Slide key={t.name}>
              <Card withBorder radius="md" padding="lg" h="100%">
                <Group gap={2} c="yellow.6">{Array.from({ length: 5 }).map((_, i) => <Icon key={i} name="star" size={14} />)}</Group>
                <Text mt="md" size="sm">“{t.quote}”</Text>
                <Group mt="lg" gap="sm"><Avatar radius="xl" color="initials" name={t.name}>{t.name.slice(0, 1)}</Avatar><div><Text size="sm" fw={500}>{t.name}</Text><Text size="xs" c={muted}>{t.company}</Text></div></Group>
              </Card>
            </Carousel.Slide>
          ))}
        </Carousel>
      </Container>

      <Container size="sm" py={{ base: 48, md: 80 }}>
        <Title order={2} ta="center" mb="xl">常见问题</Title>
        <Accordion variant="separated">{landing.faq.map((f) => <Accordion.Item key={f.q} value={f.q}><Accordion.Control>{f.q}</Accordion.Control><Accordion.Panel><Text size="sm" c={muted}>{f.a}</Text></Accordion.Panel></Accordion.Item>)}</Accordion>
      </Container>

      <Container size="lg" pb={{ base: 48, md: 80 }}>
        <Card radius="lg" padding="xl" bg="var(--mantine-primary-color-filled)" c="white">
          <Stack align="center" ta="center" gap="md"><Title order={2} c="white">{landing.hero.title}</Title><Text opacity={0.9} maw={520}>{landing.hero.subtitle}</Text><Group><Button variant="white" color="dark" size="md">{landing.hero.primary}</Button><Button variant="outline" color="white" size="md">{landing.hero.secondary}</Button></Group></Stack>
        </Card>
      </Container>

      <Box component="footer" style={{ borderTop: "1px solid var(--mantine-color-default-border)" }} py="xl">
        <Container size="lg">
          <Grid gap="xl">
            <Grid.Col span={{ base: 12, md: 4 }}><Group gap="xs"><ThemeIcon radius="md"><Text fw={700} size="sm">A</Text></ThemeIcon><Text fw={600}>Acme Console</Text></Group><Text size="sm" c={muted} mt="sm">{landing.hero.subtitle}</Text></Grid.Col>
            {footerCols.map((c) => <Grid.Col key={c.title} span={{ base: 6, sm: 3, md: 2 }}><Text fw={600} size="sm" mb="sm">{c.title}</Text><Stack gap={6}>{c.links.map((l) => <Anchor key={l} size="sm" c={muted} href="#">{l}</Anchor>)}</Stack></Grid.Col>)}
          </Grid>
          <Divider my="lg" />
          <Group justify="space-between" wrap="wrap">
            <Text size="xs" c={muted}>© 2026 Acme Console. 保留所有权利。</Text>
            <Group gap="sm"><ActionIcon size={40} variant="subtle" color="gray" aria-label="GitHub"><Icon name="github" size={16} /></ActionIcon><ActionIcon size={40} variant="subtle" color="gray" aria-label="Twitter"><Icon name="globe" size={16} /></ActionIcon><ActionIcon size={40} variant="subtle" color="gray" aria-label="Mail"><Icon name="send" size={16} /></ActionIcon><Select size="xs" w={120} data={["简体中文", "English"]} defaultValue="简体中文" allowDeselect={false} leftSection={<Icon name="globe" size={14} />} /></Group>
          </Group>
        </Container>
      </Box>
    </Box>
  )
}
