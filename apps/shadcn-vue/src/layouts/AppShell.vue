<script setup lang="ts">
import { computed, ref } from 'vue'
import { RouterLink, RouterView, useRoute, useRouter } from 'vue-router'
import nav from '@ui-gallery/spec/mock/nav.json'
import notifications from '@ui-gallery/spec/mock/notifications.json'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group'
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarInset, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import Icon from '@/components/Icon.vue'

const route = useRoute()
const router = useRouter()
const theme = ref(document.documentElement.classList.contains('dark') ? 'dark' : 'light')
const current = computed(() => nav.find((item) => item.path === route.path)?.label ?? '仪表盘')

function toggleTheme() {
  const next = theme.value === 'dark' ? 'light' : 'dark'
  theme.value = next
  document.documentElement.classList.toggle('dark', next === 'dark')
  document.documentElement.classList.toggle('light', next === 'light')
  const params = new URLSearchParams(window.location.search)
  params.set('theme', next)
  router.replace({ path: route.path, query: Object.fromEntries(params.entries()) })
}
</script>

<template>
  <TooltipProvider>
    <SidebarProvider>
      <Sidebar collapsible="icon">
        <SidebarHeader>
          <RouterLink to="/" class="flex items-center gap-2 px-2 font-semibold no-underline">
            <span class="grid size-8 place-items-center rounded-lg bg-primary text-primary-foreground">A</span>
            <span class="truncate group-data-[collapsible=icon]:hidden">Acme Console</span>
          </RouterLink>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>工作区</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem v-for="item in nav" :key="item.key">
                  <SidebarMenuButton as-child :is-active="route.path === item.path" :tooltip="item.label">
                    <RouterLink :to="item.path">
                      <Icon :name="item.icon" :size="16" />
                      <span>{{ item.label }}</span>
                      <span v-if="item.badge" class="ml-auto text-xs">{{ item.badge }}</span>
                    </RouterLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton as-child tooltip="林晓">
                <RouterLink to="/settings">
                  <Avatar class="size-7"><AvatarFallback>林</AvatarFallback></Avatar>
                  <span>林晓</span>
                </RouterLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset class="min-w-0">
        <header class="sticky top-0 z-10 flex h-16 min-w-0 items-center gap-3 border-b bg-background/95 px-4 backdrop-blur sm:px-6">
          <SidebarTrigger class="min-h-10 min-w-10" />
          <Breadcrumb class="hidden min-w-0 sm:flex">
            <BreadcrumbList>
              <BreadcrumbItem><BreadcrumbLink as-child><RouterLink to="/">Acme Console</RouterLink></BreadcrumbLink></BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem><BreadcrumbPage>{{ current }}</BreadcrumbPage></BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <div class="ml-auto flex min-w-0 items-center gap-1.5">
            <InputGroup class="hidden w-56 md:flex">
              <InputGroupAddon><Icon name="search" :size="15" /></InputGroupAddon>
              <InputGroupInput placeholder="搜索..." />
            </InputGroup>
            <Tooltip><TooltipTrigger as-child><Button size="icon" variant="ghost" class="min-h-10 min-w-10" aria-label="切换主题" @click="toggleTheme"><Icon :name="theme === 'dark' ? 'sun' : 'moon'" /></Button></TooltipTrigger><TooltipContent>切换主题</TooltipContent></Tooltip>
            <DropdownMenu>
              <DropdownMenuTrigger as-child><Button size="icon" variant="ghost" class="relative min-h-10 min-w-10" aria-label="通知"><Icon name="bell" /><span v-if="notifications.some(item => item.unread)" class="absolute right-1 top-1 size-1.5 rounded-full bg-destructive" /></Button></DropdownMenuTrigger>
              <DropdownMenuContent align="end" class="w-80">
                <DropdownMenuLabel>通知</DropdownMenuLabel><DropdownMenuSeparator />
                <DropdownMenuItem v-for="item in notifications" :key="item.title" class="items-start gap-3 py-3">
                  <span class="mt-1 size-2 shrink-0 rounded-full" :class="item.unread ? 'bg-primary' : 'bg-muted'" />
                  <span class="min-w-0"><span class="block truncate">{{ item.title }}</span><span class="text-xs text-muted-foreground">{{ item.time }}</span></span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger as-child><Button variant="ghost" size="icon" class="min-h-10 min-w-10 rounded-full"><Avatar class="size-8"><AvatarFallback>林</AvatarFallback></Avatar></Button></DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>林晓</DropdownMenuLabel><DropdownMenuSeparator />
                <DropdownMenuItem as-child><RouterLink to="/settings">账户设置</RouterLink></DropdownMenuItem>
                <DropdownMenuItem><Icon name="log-out" />退出登录</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        <main class="min-w-0 space-y-6 overflow-x-hidden p-4 sm:p-6"><RouterView /></main>
      </SidebarInset>
    </SidebarProvider>
  </TooltipProvider>
</template>
