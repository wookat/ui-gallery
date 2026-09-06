import { Button, Link as ArcoLink, Space, Tag, Typography } from "@arco-design/web-react"
import { Icon } from "@/components/icon"
import type { DemoProps } from "./shared"
import { DemoSection, SizeRow, sizes } from "./shared"

export function GeneralDemo({ name }: DemoProps) {
  switch (name) {
    case "Typography":
      return <DemoSection><Typography.Title heading={1}>标题一</Typography.Title><Typography.Title heading={2}>标题二</Typography.Title><Typography.Title heading={3}>标题三</Typography.Title><Typography.Title heading={4}>标题四</Typography.Title><Typography.Title heading={5}>标题五</Typography.Title><Typography.Title heading={6}>标题六</Typography.Title><Typography.Text bold type="primary">主色加粗</Typography.Text><Typography.Text mark underline delete code>标记、下划线、删除、代码</Typography.Text><Typography.Text type="success">成功文本</Typography.Text><Typography.Text type="warning">警告文本</Typography.Text><Typography.Text type="error">错误文本</Typography.Text><Typography.Text disabled>禁用文本</Typography.Text><Typography.Paragraph ellipsis={{ rows: 2, expandable: true, showTooltip: true }}>一段可以折叠、复制和编辑的说明文字，展示长文本的排版状态与可读性。</Typography.Paragraph><Typography.Paragraph copyable editable>可复制、可编辑段落</Typography.Paragraph><blockquote>引用文本与辅助说明</blockquote></DemoSection>
    case "Button":
      return <DemoSection><SizeRow>{(size) => <Space wrap><Button key={size} size={size} type="primary">主按钮</Button><Button size={size} status="warning">警告</Button><Button size={size} status="danger">危险</Button><Button size={size} loading>加载</Button><Button size={size} disabled>禁用</Button></Space>}</SizeRow><Space wrap><Button iconOnly icon={<Icon name="plus" />} /><Button shape="circle" icon={<Icon name="plus" />} /><Button shape="round">圆角</Button><Button shape="square">方角</Button><Button long type="primary">长按钮</Button><Button href="#component-Button">链接按钮</Button></Space></DemoSection>
    case "ButtonGroup": return <Space wrap>{sizes.map((size) => <Button.Group key={size}><Button size={size}>保存</Button><Button size={size}>取消</Button></Button.Group>)}</Space>
    case "IconButton": return <Space wrap><Button shape="circle" icon={<Icon name="plus" />} /><Button shape="round" icon={<Icon name="download" />}>下载</Button><Button iconOnly loading icon={<Icon name="settings" />} /></Space>
    case "Kbd": return <Space><Tag size="small">⌘</Tag><Tag size="small">K</Tag><Tag size="small">Enter</Tag><Tag size="small">Esc</Tag></Space>
    case "Code": return <Typography.Text code copyable>const ui = "arco"</Typography.Text>
    case "Divider": return <DemoSection><Typography.Text>上方内容</Typography.Text><Typography.Text>左侧内容</Typography.Text><Typography.Text>右侧内容</Typography.Text><DividerVariants /></DemoSection>
    case "Link": return <Space wrap><ArcoLink href="#component-Link">默认链接</ArcoLink><ArcoLink status="success">成功</ArcoLink><ArcoLink status="warning">警告</ArcoLink><ArcoLink status="error">错误</ArcoLink><ArcoLink hoverable={false}>非悬浮</ArcoLink><ArcoLink disabled>禁用</ArcoLink><ArcoLink icon={<Icon name="arrow-right" />}>带图标</ArcoLink></Space>
    default: return null
  }
}

function DividerVariants() {
  return <Space direction="vertical" style={{ width: "100%" }}><div><Typography.Text>左</Typography.Text><Typography.Text>中</Typography.Text><Typography.Text>右</Typography.Text></div><div style={{ borderTop: "1px dashed var(--color-neutral-3)" }} /><Space><Typography.Text>左</Typography.Text><span style={{ borderLeft: "1px solid var(--color-neutral-3)", height: 18 }} /><Typography.Text>右</Typography.Text></Space></Space>
}
