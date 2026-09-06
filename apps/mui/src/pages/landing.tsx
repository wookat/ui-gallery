import { useState } from "react"
import { Link as RouterLink } from "react-router-dom"
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  AppBar,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Container,
  Drawer,
  FormControlLabel,
  Grid,
  IconButton,
  Link,
  List,
  ListItem,
  MenuItem,
  Select,
  Switch,
  Toolbar,
  Typography,
} from "@mui/material"
import landing from "@ui-gallery/spec/mock/landing.json"
import nav from "@ui-gallery/spec/mock/nav.json"
import plans from "@ui-gallery/spec/mock/plans.json"
import { Icon } from "@/components/icon"
import { FlexStack as Stack } from "@/components/flex-stack"

const NAV_LINKS = [
  ["功能", "#features"],
  ["数据", "#numbers"],
  ["定价", "#pricing"],
  ["评价", "#testimonials"],
  ["FAQ", "#faq"],
] as const

const FOOTER_LINK_SX = {
  justifyContent: "flex-start",
  textAlign: "left",
  minHeight: 40,
  minWidth: 40,
  px: 1,
  ml: -1,
  fontWeight: 400,
  textTransform: "none",
  color: "text.secondary",
} as const

export function LandingPage() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [yearly, setYearly] = useState(false)
  const initials = landing.testimonials
    .slice(0, 4)
    .map((item) => item.name.slice(0, 1))
  const footerProducts = nav.slice(0, 4)
  const footerMore = nav.slice(4, 8)
  const footerColumns = [
    [
      "产品",
      footerProducts.map((item) => ({ label: item.label, path: item.path })),
    ],
    [
      "更多",
      footerMore.map((item) => ({ label: item.label, path: item.path })),
    ],
    ["方案", plans.map((item) => ({ label: item.name, path: "#pricing" }))],
    [
      "帮助",
      landing.faq.slice(0, 3).map((item) => ({ label: item.q, path: "#faq" })),
    ],
  ] as const
  return (
    <Box sx={{ minHeight: "100vh" }}>
      <AppBar position="sticky" color="inherit" elevation={0}>
        <Toolbar sx={{ justifyContent: "space-between", gap: 2 }}>
          <Link component={RouterLink} to="/" color="inherit" underline="none">
            <Stack direction="row" spacing={1} alignItems="center">
              <Box
                sx={{
                  display: "grid",
                  placeItems: "center",
                  width: 32,
                  height: 32,
                  borderRadius: 1,
                  bgcolor: "primary.main",
                  color: "primary.contrastText",
                  fontWeight: 700,
                }}
              >
                A
              </Box>
              <Typography sx={{ fontWeight: 600 }}>Acme Console</Typography>
            </Stack>
          </Link>
          <Stack
            direction="row"
            spacing={2}
            sx={{ display: { xs: "none", md: "flex" } }}
          >
            {NAV_LINKS.map(([label, href]) => (
              <Link key={href} href={href} underline="none">
                {label}
              </Link>
            ))}
          </Stack>
          <Stack direction="row" spacing={1} alignItems="center">
            <Stack
              direction="row"
              spacing={1}
              sx={{ display: { xs: "none", md: "flex" } }}
            >
              <Button component={RouterLink} to="/login">
                登录
              </Button>
              <Button component={RouterLink} to="/login" variant="contained">
                开始使用
              </Button>
            </Stack>
            <IconButton
              aria-label="菜单"
              sx={{ display: { xs: "inline-flex", md: "none" } }}
              onClick={() => setMobileOpen(true)}
            >
              <Icon name="menu" size={24} />
            </IconButton>
          </Stack>
        </Toolbar>
      </AppBar>
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
      >
        <Stack spacing={2} sx={{ width: 280, p: 3 }}>
          <Typography variant="h6">导航</Typography>
          {NAV_LINKS.map(([label, href]) => (
            <Button
              key={href}
              href={href}
              variant="text"
              onClick={() => setMobileOpen(false)}
              sx={{ justifyContent: "flex-start", minHeight: 40 }}
            >
              {label}
            </Button>
          ))}
          <Button
            component={RouterLink}
            to="/login"
            onClick={() => setMobileOpen(false)}
          >
            登录
          </Button>
          <Button
            component={RouterLink}
            to="/login"
            variant="contained"
            onClick={() => setMobileOpen(false)}
          >
            开始使用
          </Button>
        </Stack>
      </Drawer>
      <Container maxWidth="xl">
        <Grid
          container
          spacing={6}
          sx={{ alignItems: "center", py: { xs: 8, md: 14 } }}
        >
          <Grid size={{ xs: 12, md: 6 }}>
            <Stack spacing={3}>
              <Typography
                variant="h2"
                component="h1"
                sx={{
                  fontWeight: 600,
                  fontSize: { xs: "2.5rem", sm: "4.5rem" },
                }}
              >
                {landing.hero.title}
              </Typography>
              <Typography variant="h5" color="text.secondary">
                {landing.hero.subtitle}
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap">
                <Button
                  component={RouterLink}
                  to="/login"
                  variant="contained"
                  size="large"
                  endIcon={<Icon name="arrow-right" />}
                >
                  {landing.hero.primary}
                </Button>
                <Button variant="outlined" size="large">
                  {landing.hero.secondary}
                </Button>
              </Stack>
              <Stack direction="row" spacing={1} alignItems="center">
                <Stack direction="row">
                  {initials.map((name, index) => (
                    <Avatar
                      key={`${name}-${index}`}
                      sx={{
                        width: 32,
                        height: 32,
                        ml: -0.5,
                        border: 2,
                        borderColor: "background.paper",
                      }}
                    >
                      {name}
                    </Avatar>
                  ))}
                </Stack>
                <Typography variant="body2" color="text.secondary">
                  {landing.hero.social}
                </Typography>
              </Stack>
            </Stack>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Card>
              <CardContent sx={{ p: 2 }}>
                <Box
                  sx={{
                    aspectRatio: "1.1",
                    bgcolor: "action.hover",
                    p: 2,
                    display: "grid",
                    gridTemplateColumns: "100px 1fr",
                    gap: 2,
                  }}
                >
                  <Box sx={{ bgcolor: "divider", borderRadius: 1 }} />
                  <Stack spacing={2}>
                    <Box
                      sx={{
                        flex: 1,
                        bgcolor: "background.paper",
                        borderRadius: 1,
                      }}
                    />
                    <Grid container spacing={1}>
                      {[1, 2, 3].map((item) => (
                        <Grid size={4} key={item}>
                          <Box
                            sx={{
                              height: 100,
                              bgcolor: "background.paper",
                              borderRadius: 1,
                            }}
                          />
                        </Grid>
                      ))}
                    </Grid>
                  </Stack>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
      <Box sx={{ borderBlock: 1, borderColor: "divider", py: 3 }}>
        <Container>
          <Grid container spacing={2} sx={{ textAlign: "center" }}>
            {landing.testimonials.map((item) => (
              <Grid size={{ xs: 6, sm: 2 }} key={item.company}>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ fontWeight: 600 }}
                >
                  {item.company}
                </Typography>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
      <Box id="numbers" sx={{ borderBlock: 1, borderColor: "divider", py: 4 }}>
        <Container>
          <Grid container>
            {landing.numbers.map((item) => (
              <Grid
                key={item.label}
                size={{ xs: 6, sm: 3 }}
                sx={{ textAlign: "center" }}
              >
                <Typography variant="h3">{item.value}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {item.label}
                </Typography>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
      <Container id="features" sx={{ py: 10 }}>
        <Stack spacing={5}>
          <Typography variant="h3" sx={{ textAlign: "center" }}>
            功能特性
          </Typography>
          <Grid container spacing={2}>
            {landing.features.map((item) => (
              <Grid size={{ xs: 12, md: 4 }} key={item.title}>
                <Card sx={{ height: "100%" }}>
                  <CardHeader
                    avatar={
                      <Box
                        sx={{
                          display: "grid",
                          placeItems: "center",
                          width: 40,
                          height: 40,
                          bgcolor: "action.hover",
                          borderRadius: 1,
                        }}
                      >
                        <Icon name={item.icon} />
                      </Box>
                    }
                    title={item.title}
                  />
                  <CardContent>
                    <Typography color="text.secondary">{item.desc}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
          {landing.features.slice(0, 3).map((item, index) => (
            <Grid
              container
              spacing={4}
              key={`split-${item.title}`}
              sx={{
                alignItems: "center",
                flexDirection: {
                  xs: "column",
                  md: index % 2 ? "row-reverse" : "row",
                },
              }}
            >
              <Grid size={{ xs: 12, md: 6 }}>
                <Card>
                  <Box
                    sx={{
                      aspectRatio: "16 / 9",
                      display: "grid",
                      placeItems: "center",
                      bgcolor: "action.hover",
                    }}
                  >
                    <Icon name={item.icon} size={72} />
                  </Box>
                </Card>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Stack spacing={1}>
                  <Typography variant="h4">{item.title}</Typography>
                  <Typography color="text.secondary">{item.desc}</Typography>
                </Stack>
              </Grid>
            </Grid>
          ))}
        </Stack>
      </Container>
      <Container id="pricing" sx={{ py: 10 }}>
        <Stack spacing={4}>
          <Stack direction="row" justifyContent="center" alignItems="center">
            <Typography variant="h3">定价</Typography>
            <FormControlLabel
              sx={{ ml: 2 }}
              control={
                <Switch
                  checked={yearly}
                  onChange={(event) => setYearly(event.target.checked)}
                />
              }
              label="按年付费"
            />
          </Stack>
          <Grid container spacing={2}>
            {plans.map((plan) => (
              <Grid size={{ xs: 12, md: 4 }} key={plan.name}>
                <Card
                  sx={{
                    height: "100%",
                    borderColor: plan.recommended ? "primary.main" : "divider",
                    borderWidth: plan.recommended ? 2 : 1,
                  }}
                >
                  <CardHeader
                    title={
                      <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                      >
                        <span>{plan.name}</span>
                        {plan.recommended ? (
                          <Chip size="small" color="primary" label="推荐" />
                        ) : null}
                      </Stack>
                    }
                    subheader={
                      plan.price === null
                        ? "定制"
                        : plan.price === 0
                          ? "免费"
                          : yearly
                            ? `¥${plan.price * 12} / 年`
                            : `¥${plan.price} / 月`
                    }
                  />
                  <CardContent>
                    <List dense>
                      {plan.features.map((feature) => (
                        <ListItem key={feature} disableGutters>
                          <Icon name="check" size={18} />
                          <Typography sx={{ ml: 1 }}>{feature}</Typography>
                        </ListItem>
                      ))}
                    </List>
                    <Button
                      component={RouterLink}
                      to="/login"
                      fullWidth
                      sx={{ mt: 2 }}
                      variant={plan.recommended ? "contained" : "outlined"}
                    >
                      {landing.hero.primary}
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Stack>
      </Container>
      <Container id="testimonials" sx={{ py: 10 }}>
        <Stack spacing={4}>
          <Typography variant="h3" sx={{ textAlign: "center" }}>
            用户评价
          </Typography>
          <Grid container spacing={2}>
            {landing.testimonials.map((item) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={item.name}>
                <Card>
                  <CardContent>
                    <Stack spacing={1.5}>
                      <Stack direction="row" spacing={1.5} alignItems="center">
                        <Avatar>{item.name.slice(0, 1)}</Avatar>
                        <Box>
                          <Typography sx={{ fontWeight: 600 }}>
                            {item.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {item.company}
                          </Typography>
                        </Box>
                      </Stack>
                      <Typography color="text.secondary">
                        “{item.quote}”
                      </Typography>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Stack>
      </Container>
      <Container id="faq" sx={{ py: 8 }}>
        <Stack spacing={2}>
          <Typography variant="h3" sx={{ textAlign: "center" }}>
            常见问题
          </Typography>
          {landing.faq.map((item) => (
            <Accordion key={item.q}>
              <AccordionSummary expandIcon={<Icon name="chevron-down" />}>
                <Typography>{item.q}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography color="text.secondary">{item.a}</Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </Stack>
      </Container>
      <Box
        sx={{
          mx: { xs: 2, sm: "auto" },
          maxWidth: 1200,
          bgcolor: "primary.main",
          color: "primary.contrastText",
          p: { xs: 4, md: 8 },
          textAlign: "center",
          borderRadius: 2,
        }}
      >
        <Typography variant="h3">{landing.hero.title}</Typography>
        <Typography sx={{ mt: 1 }}>{landing.hero.subtitle}</Typography>
        <Button
          component={RouterLink}
          to="/login"
          variant="contained"
          color="secondary"
          sx={{ mt: 3 }}
        >
          {landing.hero.primary}
        </Button>
      </Box>
      <Box
        component="footer"
        sx={{ mt: 8, borderTop: 1, borderColor: "divider", py: 6 }}
      >
        <Container>
          <Grid container spacing={4}>
            {footerColumns.map(([heading, items]) => (
              <Grid size={{ xs: 6, md: 3 }} key={heading}>
                <Stack spacing={0.5} alignItems="flex-start">
                  <Typography sx={{ fontWeight: 600, mb: 0.5 }}>
                    {heading}
                  </Typography>
                  {items.map((item) =>
                    item.path.startsWith("/") ? (
                      <Button
                        key={item.label}
                        component={RouterLink}
                        to={item.path}
                        variant="text"
                        color="inherit"
                        sx={FOOTER_LINK_SX}
                      >
                        {item.label}
                      </Button>
                    ) : (
                      <Button
                        key={item.label}
                        href={item.path}
                        variant="text"
                        color="inherit"
                        sx={FOOTER_LINK_SX}
                      >
                        {item.label}
                      </Button>
                    )
                  )}
                </Stack>
              </Grid>
            ))}
          </Grid>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            justifyContent="space-between"
            alignItems={{ sm: "center" }}
            spacing={2}
            sx={{ mt: 5 }}
          >
            <Typography variant="body2" color="text.secondary">
              © {new Date().getFullYear()} Acme Console
            </Typography>
            <Stack direction="row" spacing={1}>
              <IconButton aria-label="GitHub" sx={{ width: 40, height: 40 }}>
                <Icon name="github" />
              </IconButton>
              <IconButton aria-label="网站" sx={{ width: 40, height: 40 }}>
                <Icon name="globe" />
              </IconButton>
              <IconButton aria-label="微信" sx={{ width: 40, height: 40 }}>
                <Icon name="message-circle" />
              </IconButton>
              <Select size="small" defaultValue="zh" aria-label="语言">
                <MenuItem value="zh">简体中文</MenuItem>
                <MenuItem value="en">English</MenuItem>
              </Select>
            </Stack>
          </Stack>
        </Container>
      </Box>
    </Box>
  )
}
