import { useState } from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import chat from "@ui-gallery/spec/mock/chat.json"
import {
  Avatar,
  Badge,
  Body1,
  Button,
  Caption1,
  Card,
  CardHeader,
  DrawerBody,
  DrawerHeader,
  DrawerHeaderTitle,
  Dropdown,
  Option,
  OverlayDrawer,
  SearchBox,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableHeaderCell,
  TableRow,
  Text,
  Textarea,
  Toast,
  ToastTitle,
  Tooltip,
  makeStyles,
  mergeClasses,
  tokens,
  useToastController,
} from "@fluentui/react-components"
import { Icon } from "@/lib/icon"
import { useControlSize, useIsMobile, useLayoutStyles } from "./shared"

type Message = (typeof chat.messages)[number] & { sources?: string[]; tool?: { name: string; args: Record<string, string>; status: string }; streaming?: boolean }

const useStyles = makeStyles({
  root: { display: "grid", gridTemplateColumns: "280px minmax(0, 1fr)", gap: tokens.spacingHorizontalM, height: ["calc(100vh - 56px - 32px)", "calc(100dvh - 56px - 32px)"], "@media (max-width: 1023px)": { gridTemplateColumns: "minmax(0, 1fr)" }, "@media (max-width: 767px)": { height: ["calc(100vh - 56px - 24px)", "calc(100dvh - 56px - 24px)"] } },
  list: { display: "flex", flexDirection: "column", gap: tokens.spacingVerticalS, padding: tokens.spacingHorizontalM, border: `1px solid ${tokens.colorNeutralStroke2}`, borderRadius: tokens.borderRadiusLarge, backgroundColor: tokens.colorNeutralBackground1 },
  conv: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: tokens.spacingHorizontalS, padding: `${tokens.spacingVerticalS} ${tokens.spacingHorizontalS}`, borderRadius: tokens.borderRadiusMedium, cursor: "pointer", border: "none", background: "transparent", textAlign: "left", width: "100%", color: "inherit", ":hover": { backgroundColor: tokens.colorNeutralBackground1Hover } },
  convActive: { backgroundColor: tokens.colorNeutralBackground1Selected },
  panel: { display: "flex", flexDirection: "column", border: `1px solid ${tokens.colorNeutralStroke2}`, borderRadius: tokens.borderRadiusLarge, backgroundColor: tokens.colorNeutralBackground1, minWidth: 0, minHeight: 0, overflow: "hidden" },
  head: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: tokens.spacingHorizontalS, padding: tokens.spacingHorizontalM, borderBottom: `1px solid ${tokens.colorNeutralStroke2}`, flexWrap: "wrap" },
  stream: { flex: 1, display: "flex", flexDirection: "column", gap: tokens.spacingVerticalL, padding: tokens.spacingHorizontalM, overflowY: "auto", minHeight: 0 },
  msg: { display: "flex", gap: tokens.spacingHorizontalS, maxWidth: "min(100%, 720px)", minWidth: 0 },
  msgUser: { alignSelf: "flex-end", flexDirection: "row-reverse" },
  bubble: { padding: `${tokens.spacingVerticalS} ${tokens.spacingHorizontalM}`, borderRadius: tokens.borderRadiusLarge, backgroundColor: tokens.colorNeutralBackground3, minWidth: 0, overflowX: "auto", "& p": { margin: `0 0 ${tokens.spacingVerticalXS}` }, "& p:last-child": { margin: 0 } },
  bubbleUser: { backgroundColor: tokens.colorBrandBackground, color: tokens.colorNeutralForegroundOnBrand },
  code: { position: "relative", backgroundColor: tokens.colorNeutralBackgroundInverted, color: tokens.colorNeutralForegroundInverted, borderRadius: tokens.borderRadiusMedium, padding: tokens.spacingHorizontalM, paddingRight: "48px", fontFamily: tokens.fontFamilyMonospace, fontSize: tokens.fontSizeBase200, overflowX: "auto", whiteSpace: "pre-wrap", overflowWrap: "anywhere", margin: 0 },
  copy: { position: "absolute", top: "4px", right: "4px", color: tokens.colorNeutralForegroundInverted },
  composer: { borderTop: `1px solid ${tokens.colorNeutralStroke2}`, padding: tokens.spacingHorizontalM, display: "flex", flexDirection: "column", gap: tokens.spacingVerticalS },
  box: { border: `1px solid ${tokens.colorNeutralStroke1}`, borderRadius: tokens.borderRadiusLarge, padding: tokens.spacingHorizontalS, display: "flex", flexDirection: "column", gap: tokens.spacingVerticalXS },
  attachment: { display: "inline-flex", alignItems: "center", gap: tokens.spacingHorizontalXS, padding: `${tokens.spacingVerticalXS} ${tokens.spacingHorizontalS}`, border: `1px solid ${tokens.colorNeutralStroke2}`, borderRadius: tokens.borderRadiusMedium, alignSelf: "flex-start" },
  empty: { flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: tokens.spacingVerticalM, padding: tokens.spacingVerticalXXXL, textAlign: "center", color: tokens.colorNeutralForeground3, minHeight: 0, overflowY: "auto" },
  chips: { display: "flex", alignItems: "center", gap: tokens.spacingHorizontalS, "@media (max-width: 767px)": { flexWrap: "nowrap", overflowX: "auto" } },
  cursor: { display: "inline-block", width: "8px", height: "1em", backgroundColor: "currentColor", verticalAlign: "text-bottom", marginLeft: "2px", animationName: { from: { opacity: 1 }, to: { opacity: 0 } }, animationDuration: "0.8s", animationIterationCount: "infinite", animationDirection: "alternate" },
})

export function ChatPage() {
  const s = useStyles()
  const l = useLayoutStyles()
  const isMobile = useIsMobile()
  const ctl = useControlSize()
  const { dispatchToast } = useToastController("acme-toaster")
  const [active, setActive] = useState(chat.conversations[0].id)
  const [query, setQuery] = useState("")
  const [draft, setDraft] = useState("")
  const [model, setModel] = useState(chat.models[0])
  const [showList, setShowList] = useState(false)
  const messages = (active === chat.conversations[0].id ? chat.messages : []) as Message[]
  const conversations = chat.conversations.filter((c) => c.title.toLowerCase().includes(query.toLowerCase()))
  const copy = (text: string) => { void navigator.clipboard?.writeText(text); dispatchToast(<Toast><ToastTitle>已复制到剪贴板</ToastTitle></Toast>, { intent: "success" }) }

  const list = (
    <aside className={s.list}>
      <div className={l.rowBetween}><Text weight="semibold">对话</Text><Button appearance="primary" size={ctl} icon={<Icon name="plus" />} onClick={() => setActive("new")}>新对话</Button></div>
      <SearchBox size={isMobile ? "large" : "small"} placeholder="搜索对话" value={query} onChange={(_, d) => setQuery(d.value)} />
      {conversations.map((c) => (
        <button key={c.id} type="button" className={mergeClasses(s.conv, c.id === active && s.convActive)} onClick={() => { setActive(c.id); setShowList(false) }}>
          <div style={{ minWidth: 0 }}><Body1 block truncate wrap={false}>{c.title}</Body1><Caption1 className={l.muted}>{c.time}</Caption1></div>
          {c.unread ? <Badge appearance="filled" color="brand" size="small">{c.unread}</Badge> : null}
        </button>
      ))}
      {conversations.length === 0 ? <Caption1 className={l.muted}>没有匹配的对话</Caption1> : null}
    </aside>
  )

  return (
    <div className={s.root}>
      {isMobile ? (
        <OverlayDrawer open={showList} onOpenChange={(_, d) => setShowList(d.open)} position="start" size="small">
          <DrawerHeader>
            <DrawerHeaderTitle action={<Button appearance="subtle" size={ctl} icon={<Icon name="x" />} aria-label="关闭" onClick={() => setShowList(false)} />}>对话</DrawerHeaderTitle>
          </DrawerHeader>
          <DrawerBody>{list}</DrawerBody>
        </OverlayDrawer>
      ) : (
        list
      )}
      <section className={s.panel}>
        <header className={s.head}>
          <div className={l.row}>
            {isMobile ? <Button appearance="subtle" size={ctl} icon={<Icon name="menu" />} aria-label="对话列表" onClick={() => setShowList(true)} /> : null}
            <div><Text weight="semibold" block>{chat.conversations.find((c) => c.id === active)?.title ?? "新对话"}</Text><Caption1 className={l.muted}>{model} · 已连接</Caption1></div>
          </div>
          <Dropdown size={isMobile ? "large" : "small"} value={model} selectedOptions={[model]} onOptionSelect={(_, d) => setModel(d.optionValue ?? model)} style={{ minWidth: 150 }}>
            {chat.models.map((m) => <Option key={m} value={m}>{m}</Option>)}
          </Dropdown>
        </header>
        {messages.length === 0 ? (
          <div className={s.empty}>
            <Icon name="bot" size={48} />
            <Text weight="semibold" size={500}>开始新的对话</Text>
            <Body1>询问业务数据、生成报告或撰写邮件。</Body1>
            <div className={l.row} style={{ justifyContent: "center" }}>{chat.suggestions.map((sg) => <Button key={sg} size={isMobile ? "large" : "small"} onClick={() => setDraft(sg)}>{sg}</Button>)}</div>
          </div>
        ) : (
          <div className={s.stream}>
            {messages.map((m, index) => (
              <div key={index} className={mergeClasses(s.msg, m.role === "user" && s.msgUser)}>
                <Avatar name={m.role === "user" ? "林晓" : undefined} icon={m.role === "assistant" ? <Icon name="bot" size={18} /> : undefined} color={m.role === "user" ? "colorful" : "brand"} size={32} />
                <div className={l.stackS} style={{ minWidth: 0 }}>
                  <Caption1 className={l.muted}>{m.role === "user" ? "林晓" : "AI 助手"} · 刚刚</Caption1>
                  <div className={mergeClasses(s.bubble, m.role === "user" && s.bubbleUser)}>
                    {m.role === "assistant" ? (
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                          table: ({ children }) => <Table size="extra-small" aria-label="数据表">{children}</Table>,
                          thead: ({ children }) => <TableHeader>{children}</TableHeader>,
                          tbody: ({ children }) => <TableBody>{children}</TableBody>,
                          tr: ({ children }) => <TableRow>{children}</TableRow>,
                          th: ({ children }) => <TableHeaderCell>{children}</TableHeaderCell>,
                          td: ({ children }) => <TableCell>{children}</TableCell>,
                          pre: ({ children }) => <>{children}</>,
                          code: ({ children, className }) => {
                            const text = String(children).replace(/\n$/, "")
                            if (!className) return <code style={{ fontFamily: tokens.fontFamilyMonospace }}>{children}</code>
                            return (
                              <pre className={s.code}>
                                <Tooltip content="复制代码" relationship="label"><Button className={s.copy} appearance="transparent" size={isMobile ? "large" : "small"} icon={<Icon name="copy" size={14} />} onClick={() => copy(text)} /></Tooltip>
                                <code>{text}</code>
                              </pre>
                            )
                          },
                        }}
                      >
                        {m.content}
                      </ReactMarkdown>
                    ) : (
                      <Body1>{m.content}</Body1>
                    )}
                    {m.streaming ? <span className={s.cursor} aria-label="正在生成" /> : null}
                  </div>
                  {m.streaming ? <div className={l.row}><Spinner size="extra-tiny" /><Caption1 className={l.muted}>正在生成...</Caption1></div> : null}
                  {m.sources ? <div className={l.row}>{m.sources.map((src) => <Badge key={src} appearance="outline" icon={<Icon name="paperclip" size={12} />}>{src}</Badge>)}</div> : null}
                  {m.tool ? (
                    <Card size="small" appearance="filled-alternative">
                      <CardHeader image={<Icon name="wrench" size={18} />} header={<Text weight="semibold">工具调用 · {m.tool.name}</Text>} description={<Caption1 className={l.muted}>{m.tool.status === "done" ? "已完成" : m.tool.status}</Caption1>} action={<Badge appearance="tint" color="success" icon={<Icon name="check" size={12} />}>{m.tool.status}</Badge>} />
                      <pre style={{ margin: 0, fontFamily: tokens.fontFamilyMonospace, fontSize: tokens.fontSizeBase200, overflowX: "auto" }}>{JSON.stringify(m.tool.args, null, 2)}</pre>
                    </Card>
                  ) : null}
                  {m.role === "assistant" && !m.streaming ? (
                    <div className={l.row} style={{ flexWrap: "nowrap" }}>
                      <Button appearance="subtle" size={isMobile ? "large" : "small"} icon={<Icon name="copy" size={14} />} aria-label="复制" onClick={() => copy(m.content)}>{isMobile ? null : "复制"}</Button>
                      <Button appearance="subtle" size={isMobile ? "large" : "small"} icon={<Icon name="thumbs-up" size={14} />} aria-label="有帮助" />
                      <Button appearance="subtle" size={isMobile ? "large" : "small"} icon={<Icon name="thumbs-down" size={14} />} aria-label="没帮助" />
                      <Button appearance="subtle" size={isMobile ? "large" : "small"} icon={<Icon name="refresh" size={14} />} aria-label="重新生成">{isMobile ? null : "重新生成"}</Button>
                    </div>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        )}
        <div className={s.composer}>
          {messages.length > 0 ? <div className={s.chips}>{chat.suggestions.map((sg) => <Button key={sg} size={isMobile ? "large" : "small"} shape="circular" style={{ flexShrink: 0 }} onClick={() => setDraft(sg)}>{sg}</Button>)}</div> : null}
          <span className={s.attachment}><Icon name="paperclip" size={14} /><Caption1>project-notes.md · 12 KB</Caption1><Button appearance="transparent" size={ctl} icon={<Icon name="x" size={12} />} aria-label="移除附件" /></span>
          <div className={s.box}>
            <Textarea appearance="filled-lighter" value={draft} onChange={(_, d) => setDraft(d.value)} placeholder="向 AI 助手提问..." resize="none" rows={isMobile ? 1 : 2} />
            <div className={l.rowBetween}>
              <div className={l.row}>
                <Tooltip content="添加附件" relationship="label"><Button appearance="subtle" size={ctl} icon={<Icon name="paperclip" />} /></Tooltip>
                <Tooltip content="语音输入" relationship="label"><Button appearance="subtle" size={ctl} icon={<Icon name="mic" />} /></Tooltip>
              </div>
              <Button appearance="primary" size={ctl} icon={<Icon name="send" />} disabled={!draft.trim()} onClick={() => setDraft("")}>发送</Button>
            </div>
          </div>
          <Caption1 className={l.muted}>AI 可能出错，请核对重要信息。</Caption1>
        </div>
      </section>
    </div>
  )
}
