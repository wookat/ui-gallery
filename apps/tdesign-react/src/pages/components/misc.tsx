import { useState, type ReactNode } from "react"
import {
  Button,
  Comment,
  DatePickerPanel,
  DateRangePickerPanel,
  DialogCard,
  Guide,
  Image,
  ImageViewer,
  InputAdornment,
  Loading,
  Link,
  Popup,
  RangeInput,
  SelectInput,
  Space,
  Swiper,
  StickyTool,
  Tag,
  TagInput,
  TimePicker,
  TimePickerPanel,
  TreeSelect,
  Typography,
} from "tdesign-react"
import { Icon } from "@/components/icon"
import { componentOptions, DemoPanel, DemoRow, demoImage, treeOptions } from "./types"

function IconButtonDemo() {
  return (
    <DemoPanel>
      <DemoRow>
        {(["small", "medium", "large"] as const).map((size) => (
          <Button key={size} shape="circle" size={size} icon={<Icon name="plus" />} />
        ))}
        <Button shape="square" icon={<Icon name="settings" />} />
        <Button shape="circle" disabled icon={<Icon name="lock" />} />
      </DemoRow>
    </DemoPanel>
  )
}

function ButtonGroupDemo() {
  return (
    <DemoPanel>
      <Space size={0}>
        <Button variant="outline">左</Button>
        <Button variant="outline">中</Button>
        <Button variant="outline">右</Button>
      </Space>
    </DemoPanel>
  )
}

function PopoverDemo() {
  return (
    <DemoPanel>
      <DemoRow>
        {(["top", "bottom", "left", "right"] as const).map((placement) => (
          <Popup key={placement} placement={placement} trigger="click" showArrow content={`${placement} content`}>
            <Button>{placement}</Button>
          </Popup>
        ))}
      </DemoRow>
      <Popup trigger="hover" content="hover content" showArrow><Button>hover</Button></Popup>
    </DemoPanel>
  )
}

function CarouselDemo() {
  return (
    <DemoPanel>
      <Swiper height={160} autoplay={false} navigation={{ showSlideBtn: "always" }} type="card">
        <Swiper.SwiperItem><div className="swiper-slide">Slide 1</div></Swiper.SwiperItem>
        <Swiper.SwiperItem><div className="swiper-slide">Slide 2</div></Swiper.SwiperItem>
        <Swiper.SwiperItem><div className="swiper-slide">Slide 3</div></Swiper.SwiperItem>
      </Swiper>
    </DemoPanel>
  )
}

function ImageViewerDemo() {
  const [visible, setVisible] = useState(false)
  return (
    <DemoPanel>
      <ImageViewer visible={visible} images={[demoImage]} onClose={() => setVisible(false)} />
      <Image src={demoImage} fit="cover" shape="round" onClick={() => setVisible(true)} style={{ width: 160, height: 90 }} />
      <Typography.Text theme="secondary">点击 Image 打开 ImageViewer。</Typography.Text>
    </DemoPanel>
  )
}

function SupplementalDemo({ name }: { name: string }) {
  switch (name) {
    case "Comment":
      return <Comment author="林晓" datetime="刚刚" content="这是一条评论。" actions={[<Link key="reply">回复</Link>, <Link key="like">赞</Link>]} reply={<Comment author="王子涵" content="收到。" />} />
    case "ImageViewer":
      return <ImageViewerDemo />
    case "RangeInput":
      return <RangeInput defaultValue={["2026-01-01", "2026-12-31"]} />
    case "SelectInput":
      return <SelectInput options={componentOptions} placeholder="SelectInput" />
    case "TreeSelect":
      return <TreeSelect data={treeOptions} placeholder="TreeSelect" />
    case "InputAdornment":
      return <InputAdornment prepend="¥" append="元"><input placeholder="金额" /></InputAdornment>
    case "DatePickerPanel":
      return <DatePickerPanel />
    case "DateRangePickerPanel":
      return <DateRangePickerPanel />
    case "TimePickerPanel":
      return <TimePickerPanel onChange={() => undefined} />
    case "TimeRangePicker":
      return <TimePicker.TimeRangePicker format="HH:mm" />
    case "Popup":
      return <Popup trigger="click" content="Popup content"><Button>打开 Popup</Button></Popup>
    case "Space":
      return <Space direction="vertical"><Button>Space</Button><Button>vertical</Button></Space>
    case "StickyTool":
      return (
        <StickyTool
          className="component-sticky-tool"
          placement="right-bottom"
        >
          <StickyTool.StickyItem
            label="帮助"
            icon={<Icon name="help-circle" />}
          />
        </StickyTool>
      )
    case "Guide":
      return <div><Button id="supplemental-guide">Guide 目标</Button><Guide steps={[{ element: "#supplemental-guide", title: "Guide", body: "真实 Guide 步骤" }]} current={-1} /></div>
    case "TagInput":
      return <TagInput defaultValue={["团队", "设计"]} />
    case "Loading":
      return <Loading size="small" text="加载中" />
    case "CheckTag":
      return <Tag.CheckTag defaultChecked>CheckTag</Tag.CheckTag>
    case "DialogCard":
      return <DialogCard header="DialogCard" footer={<Button theme="primary">确定</Button>}>DialogCard 内容</DialogCard>
    default:
      return <Typography.Text>{name}</Typography.Text>
  }
}

export const miscDemos = {
  ButtonGroup: ButtonGroupDemo,
  IconButton: IconButtonDemo,
  Carousel: CarouselDemo,
  ImageViewer: ImageViewerDemo,
  Popover: PopoverDemo,
} satisfies Record<string, () => ReactNode>

export { SupplementalDemo }
