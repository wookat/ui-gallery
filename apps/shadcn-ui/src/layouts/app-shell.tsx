import { useState, type ReactNode } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { Icon } from "@ui-gallery/icons-react"
import nav from "@ui-gallery/spec/mock/nav.json"
import { useTheme } from "@/components/theme-provider"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarInset, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

function Brand() {
  return <Link className="flex items-center gap-2 font-semibold no-underline" to="/"><span className="grid size-8 place-items-center rounded-lg bg-primary text-primary-foreground">A</span><span>Acme Console</span></Link>
}

function Navigation({ onNavigate }: { onNavigate?: () => void }) {
  const location = useLocation()
  return (
    <SidebarMenu>
      {nav.map((item) => (
        <SidebarMenuItem key={item.key}>
          <SidebarMenuButton asChild isActive={location.pathname === item.path} tooltip={item.label}>
            <Link to={item.path} onClick={onNavigate}><Icon name={item.icon} size={16} /><span>{item.label}</span>{item.badge ? <span className="ml-auto text-xs">{item.badge}</span> : null}</Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  )
}

export function AppShell({ children }: { children: ReactNode }) {
  const location = useLocation()
  const navigate = useNavigate()
  const { theme, setTheme } = useTheme()
  const [mobileOpen, setMobileOpen] = useState(false)
  const current = nav.find((item) => item.path === location.pathname)?.label ?? "仪表盘"
  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark"
    setTheme(next)
    const params = new URLSearchParams(window.location.search)
    params.set("theme", next)
    navigate(`${location.pathname}?${params.toString()}`)
  }
  return (
    <TooltipProvider>
      <SidebarProvider>
        <Sidebar collapsible="icon">
          <SidebarHeader><Brand /></SidebarHeader>
          <SidebarContent>
            <SidebarGroup><SidebarGroupLabel>工作区</SidebarGroupLabel><SidebarGroupContent><Navigation /></SidebarGroupContent></SidebarGroup>
          </SidebarContent>
          <SidebarFooter>
            <SidebarMenu><SidebarMenuItem><SidebarMenuButton asChild><Link to="/settings"><Avatar className="size-7"><AvatarFallback>林</AvatarFallback></Avatar><span>林晓</span></Link></SidebarMenuButton></SidebarMenuItem></SidebarMenu>
          </SidebarFooter>
        </Sidebar>
        <SidebarInset>
          <header className="sticky top-0 z-10 flex h-16 items-center gap-3 border-b bg-background/95 px-4 backdrop-blur sm:px-6">
            <SidebarTrigger />
            <Breadcrumb className="hidden sm:flex"><BreadcrumbList><BreadcrumbItem><BreadcrumbLink asChild><Link to="/">Acme Console</Link></BreadcrumbLink></BreadcrumbItem><BreadcrumbSeparator /><BreadcrumbItem><BreadcrumbPage>{current}</BreadcrumbPage></BreadcrumbItem></BreadcrumbList></Breadcrumb>
            <div className="ml-auto flex items-center gap-2">
              <InputGroup className="hidden w-56 md:flex"><InputGroupAddon><Icon name="search" size={15} /></InputGroupAddon><InputGroupInput placeholder="搜索..." /></InputGroup>
              <Tooltip><TooltipTrigger asChild><Button size="icon" variant="ghost" onClick={toggleTheme}><Icon name={theme === "dark" ? "sun" : "moon"} /></Button></TooltipTrigger><TooltipContent>切换主题</TooltipContent></Tooltip>
              <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                <SheetTrigger asChild><Button size="icon" variant="ghost" className="md:hidden"><Icon name="menu" /></Button></SheetTrigger>
                <SheetContent side="left" className="w-72"><SheetHeader><SheetTitle><Brand /></SheetTitle><SheetDescription>导航菜单</SheetDescription></SheetHeader><div className="mt-4"><Navigation onNavigate={() => setMobileOpen(false)} /></div></SheetContent>
              </Sheet>
              <DropdownMenu>
                <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="rounded-full"><Avatar className="size-8"><AvatarFallback>林</AvatarFallback></Avatar></Button></DropdownMenuTrigger>
                <DropdownMenuContent align="end"><DropdownMenuLabel>林晓</DropdownMenuLabel><DropdownMenuSeparator /><DropdownMenuItem asChild><Link to="/settings">账户设置</Link></DropdownMenuItem><DropdownMenuItem><Icon name="log-out" />退出登录</DropdownMenuItem></DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>
          <main className="min-w-0 space-y-6 p-4 sm:p-6">{children}</main>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  )
}
