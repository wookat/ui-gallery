import { Link } from "react-router-dom"
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
  Container,
  Grid,
  Toolbar,
  Typography,
} from "@mui/material"
import landing from "@ui-gallery/spec/mock/landing.json"
import plans from "@ui-gallery/spec/mock/plans.json"
import { Icon } from "@/components/icon"
import { FlexStack as Stack } from "@/components/flex-stack"

export function LandingPage() {
  return (
    <Box sx={{ minHeight: "100vh" }}>
      <AppBar position="sticky" color="inherit" elevation={0}>
        <Toolbar sx={{ justifyContent: "space-between", gap: 2 }}>
          <Link to="/" style={{ color: "inherit", textDecoration: "none" }}>
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
            spacing={1}
            sx={{ display: { xs: "none", md: "flex" } }}
          >
            <Button href="#features">产品</Button>
            <Button href="#pricing">价格</Button>
            <Button href="#faq">FAQ</Button>
          </Stack>
          <Stack direction="row" spacing={1}>
            <Button component={Link} to="/login">
              登录
            </Button>
            <Button component={Link} to="/login" variant="contained">
              开始使用
            </Button>
          </Stack>
        </Toolbar>
      </AppBar>
      <Container maxWidth="xl">
        <Grid
          container
          spacing={6}
          sx={{ alignItems: "center", py: { xs: 8, md: 14 } }}
        >
          <Grid size={{ xs: 12, md: 6 }}>
            <Stack spacing={3}>
              <Typography variant="overline">ACME CONSOLE · 2026</Typography>
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
                  component={Link}
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
                  {["林", "王", "A", "M"].map((name) => (
                    <Avatar
                      key={name}
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
                      <Grid size={4}>
                        <Box
                          sx={{
                            height: 100,
                            bgcolor: "background.paper",
                            borderRadius: 1,
                          }}
                        />
                      </Grid>
                      <Grid size={4}>
                        <Box
                          sx={{
                            height: 100,
                            bgcolor: "background.paper",
                            borderRadius: 1,
                          }}
                        />
                      </Grid>
                      <Grid size={4}>
                        <Box
                          sx={{
                            height: 100,
                            bgcolor: "background.paper",
                            borderRadius: 1,
                          }}
                        />
                      </Grid>
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
            {[
              "Northwind",
              "Contoso",
              "Globex",
              "Fabrikam",
              "Initech",
              "Umbrella",
            ].map((name) => (
              <Grid size={{ xs: 6, sm: 2 }} key={name}>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ fontWeight: 600 }}
                >
                  {name}
                </Typography>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
      <Container id="features" sx={{ py: 10 }}>
        <Stack spacing={5}>
          <Box sx={{ textAlign: "center" }}>
            <Typography variant="body2" color="text.secondary">
              为团队打造
            </Typography>
            <Typography variant="h3">一个地方，完成所有工作</Typography>
            <Typography color="text.secondary">
              从数据到决策，让每一步都更清晰。
            </Typography>
          </Box>
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
        </Stack>
      </Container>
      <Container id="pricing" sx={{ py: 10 }}>
        <Stack spacing={4}>
          <Box sx={{ textAlign: "center" }}>
            <Typography variant="h3">选择适合你的方案</Typography>
            <Typography color="text.secondary">简单透明，随时升级。</Typography>
          </Box>
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
                    title={plan.name}
                    subheader={
                      plan.price === null
                        ? "定制"
                        : plan.price === 0
                          ? "免费"
                          : `¥${plan.price} / 月`
                    }
                  />
                  <CardContent>
                    <Typography color="text.secondary">
                      {plan.features.join(" · ")}
                    </Typography>
                    <Button
                      fullWidth
                      sx={{ mt: 3 }}
                      variant={plan.recommended ? "contained" : "outlined"}
                    >
                      开始使用
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Stack>
      </Container>
      <Container sx={{ py: 8 }}>
        <Stack spacing={3}>
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
        <Typography variant="h3">准备好让团队更高效了吗？</Typography>
        <Typography sx={{ mt: 1 }}>
          从今天开始，把工作放进一个控制台。
        </Typography>
        <Button
          component={Link}
          to="/login"
          variant="contained"
          color="secondary"
          sx={{ mt: 3 }}
        >
          免费开始
        </Button>
      </Box>
      <Box
        component="footer"
        sx={{ mt: 8, borderTop: 1, borderColor: "divider", py: 4 }}
      >
        <Container>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            justifyContent="space-between"
            spacing={2}
          >
            <Typography variant="body2" color="text.secondary">
              © 2026 Acme Console
            </Typography>
            <Stack direction="row" spacing={2}>
              <a href="#features">产品</a>
              <a href="#pricing">价格</a>
              <a href="#faq">帮助中心</a>
            </Stack>
          </Stack>
        </Container>
      </Box>
    </Box>
  )
}
