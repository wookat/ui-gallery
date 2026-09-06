import { useRef, useState, type ReactNode } from "react"
import { Accordion, Alert, AlertHeading, Badge, Breadcrumb, Button, ButtonGroup, ButtonToolbar, Card, CardGroup, CardImgOverlay, CardLink, CardSubtitle, Carousel, CarouselItem, CloseButton, Col, Collapse, Container, Dropdown, DropdownButton, DropdownDivider, DropdownHeader, DropdownItemText, Fade, Figure, FloatingLabel, Form, FormControl, FormFloating, FormLabel, FormSelect, Image, InputGroup, ListGroup, Modal, Nav, Navbar, NavDropdown, Offcanvas, Overlay, OverlayTrigger, PageItem, Pagination, Placeholder, PlaceholderButton, Popover, ProgressBar, Ratio, Row, Spinner, SplitButton, Stack, Tab, Table, TabContainer, TabContent, TabPane, Tabs, ThemeProvider, Toast, ToastContainer, ToastHeader, ToastBody, ToggleButton, ToggleButtonGroup, Tooltip } from "react-bootstrap"
import { Icon } from "@ui-gallery/icons-react"
import contract from "@ui-gallery/spec/contract.json"
import { coverage, type CoverageStatus } from "@/coverage"
import { Avatar, AvatarGroup, EmptyState, PageTitle, ResponsivePage, ResultView, Section, placeholderImage } from "@/pages/shared"

const groups: Record<string, string[]> = {
  "排版": ["Typography", "Kbd", "Code", "Divider", "Link"],
  "按钮": ["Button", "ButtonGroup", "IconButton", "Rating", "Segmented", "FloatButton"],
  "表单控件": ["Input", "Textarea", "NumberInput", "Select", "MultiSelect", "Combobox", "Autocomplete", "Checkbox", "Radio", "Switch", "Slider", "DatePicker", "TimePicker", "DateRangePicker", "ColorPicker", "Upload", "Cascader", "Transfer", "Mention", "PinInput", "Form"],
  "数据展示": ["Table", "DataGrid", "Descriptions", "List", "Card", "Avatar", "AvatarGroup", "Badge", "Tag", "Statistic", "Timeline", "Tree", "Calendar", "Image", "Carousel", "Empty", "QRCode"],
  "反馈": ["Tooltip", "Popover", "Alert", "Toast", "Notification", "Dialog", "Drawer", "Progress", "Skeleton", "Spinner", "Result", "Popconfirm"],
  "导航": ["Menu", "Dropdown", "Breadcrumb", "Tabs", "Pagination", "Steps", "Anchor", "BackTop", "Affix", "Navbar", "Sidebar", "CommandPalette"],
  "布局": ["Grid", "Stack", "Layout", "Container", "AspectRatio", "Resizable", "ScrollArea", "Accordion"],
  "其他": ["ThemeProvider", "Watermark", "Tour"],
}

const rbExports = ["Accordion", "AccordionContext", "AccordionCollapse", "AccordionButton", "AccordionBody", "AccordionHeader", "AccordionItem", "Alert", "AlertHeading", "AlertLink", "Anchor", "Badge", "Breadcrumb", "BreadcrumbItem", "Button", "ButtonGroup", "ButtonToolbar", "Card", "CardBody", "CardFooter", "CardGroup", "CardHeader", "CardImg", "CardImgOverlay", "CardLink", "CardSubtitle", "CardText", "CardTitle", "Carousel", "CarouselCaption", "CarouselItem", "CloseButton", "Col", "Collapse", "Container", "Dropdown", "DropdownButton", "DropdownDivider", "DropdownHeader", "DropdownItem", "DropdownItemText", "DropdownMenu", "DropdownToggle", "Fade", "Figure", "FigureCaption", "FigureImage", "FloatingLabel", "Form", "FormControl", "FormCheck", "FormFloating", "FormGroup", "FormLabel", "FormSelect", "FormText", "Image", "InputGroup", "ListGroup", "ListGroupItem", "Modal", "ModalBody", "ModalDialog", "ModalFooter", "ModalHeader", "ModalTitle", "Nav", "Navbar", "NavbarBrand", "NavbarCollapse", "NavbarOffcanvas", "NavbarText", "NavbarToggle", "NavDropdown", "NavItem", "NavLink", "Offcanvas", "OffcanvasBody", "OffcanvasHeader", "OffcanvasTitle", "PageItem", "Pagination", "Placeholder", "PlaceholderButton", "Popover", "PopoverBody", "PopoverHeader", "ProgressBar", "Ratio", "Row", "Spinner", "SplitButton", "Stack", "Tab", "TabContainer", "TabContent", "Table", "TabPane", "Tabs", "ThemeProvider", "Toast", "ToastBody", "ToastContainer", "ToastHeader", "ToggleButton", "ToggleButtonGroup", "Tooltip", "Overlay", "OverlayTrigger", "SSRProvider", "useAccordionButton"]
const contractComponents = contract.components

function statusVariant(status: CoverageStatus) {
  return status === "implemented" ? "primary" : status === "composed" ? "secondary" : "danger"
}

function DemoCard({ name, children }: { name: string; children: ReactNode }) {
  const status = coverage[name]
  return <Card id={`component-${name}`} className="component-card mb-3"><Card.Header className="d-flex justify-content-between align-items-center"><strong>{name}</strong><Badge bg={statusVariant(status)}>{status}</Badge></Card.Header><Card.Body>{children}</Card.Body></Card>
}

function MissingDemo({ name }: { name: string }) {
  return <Alert variant="secondary" className="mb-0">React Bootstrap 无此组件（coverage: {coverage[name]}）</Alert>
}

function ComponentDemo({ name, openModal, openDrawer, openToast, openCommand, toasts, closeToast, resetToasts }: { name: string; openModal: (mode: string) => void; openDrawer: (placement: "start" | "end" | "top" | "bottom") => void; openToast: () => void; openCommand: () => void; toasts: string[]; closeToast: (variant: string) => void; resetToasts: () => void }) {
  if (coverage[name] === "missing") return <MissingDemo name={name} />
  switch (name) {
    case "Typography": return <><h1 className="h4">标题 Typography</h1><p>Bootstrap 默认排版、<a href="#component-Link">链接</a>、<code>const value = true</code>、<kbd>⌘ K</kbd> 与 <hr /> 分隔线。</p></>
    case "Button": return <ButtonDemo />
    case "ButtonGroup": return <><ButtonToolbar className="mb-2"><ButtonGroup className="me-2"><Button>一</Button><Button>二</Button><Button>三</Button></ButtonGroup><ButtonGroup><Button variant="outline-primary">左</Button><Button variant="outline-primary">右</Button></ButtonGroup></ButtonToolbar><DropdownButton title="DropdownButton"><Dropdown.Item>Item</Dropdown.Item><Dropdown.Divider /><Dropdown.Item>另一个</Dropdown.Item></DropdownButton> <SplitButton title="SplitButton"><Dropdown.Item>操作</Dropdown.Item></SplitButton></>
    case "IconButton": return <Button aria-label="设置" variant="outline-secondary"><Icon name="settings" /></Button>
    case "Rating": case "Segmented": return <ToggleButtonGroup type="radio" name={`${name}-group`} defaultValue={2}>{[1, 2, 3, 4, 5].map((value) => <ToggleButton key={value} id={`${name}-${value}`} value={value} variant="outline-primary">{name === "Rating" ? "★" : `选项 ${value}`}</ToggleButton>)}</ToggleButtonGroup>
    case "FloatButton": return <Button className="rounded-circle" aria-label="快捷操作"><Icon name="plus" /></Button>
    case "Input": return <FormDemo />
    case "Textarea": return <Form.Control as="textarea" rows={3} placeholder="Textarea" />
    case "NumberInput": return <Form.Control type="number" min={0} max={100} defaultValue={42} />
    case "Select": return <Form.Select><option>选择一个选项</option><option>选项二</option></Form.Select>
    case "MultiSelect": return <Form.Select multiple style={{ height: 96 }}><option>Web</option><option>iOS</option><option>API</option></Form.Select>
    case "Combobox": case "Autocomplete": return <><Form.Control list={`list-${name}`} placeholder="输入或选择" /><datalist id={`list-${name}`}><option value="北京" /><option value="上海" /><option value="深圳" /></datalist></>
    case "Checkbox": return <CheckboxDemo />
    case "Radio": return <><Form.Check type="radio" name="radio-demo" label="内联" inline defaultChecked /><Form.Check type="radio" name="radio-demo" label="另一个" inline /><Form.Check type="radio" name="radio-demo-reverse" label="反向" reverse /></>
    case "Switch": return <Form.Check type="switch" label="启用通知" defaultChecked />
    case "Slider": return <Form.Range />
    case "DatePicker": return <Form.Control type="date" />
    case "TimePicker": return <Form.Control type="time" />
    case "DateRangePicker": return <InputGroup><Form.Control type="date" /><InputGroup.Text>至</InputGroup.Text><Form.Control type="date" /></InputGroup>
    case "ColorPicker": return <Form.Control type="color" defaultValue="#0d6efd" title="选择颜色" />
    case "Upload": return <div className="border border-2 border-dashed rounded p-3"><Form.Control type="file" multiple /></div>
    case "Transfer": return <Row className="align-items-center g-2"><Col><ListGroup><ListGroup.Item>可选成员</ListGroup.Item><ListGroup.Item>Alex</ListGroup.Item></ListGroup></Col><Col xs="auto"><ButtonGroup vertical><Button>→</Button><Button>←</Button></ButtonGroup></Col><Col><ListGroup><ListGroup.Item>已选成员</ListGroup.Item></ListGroup></Col></Row>
    case "PinInput": return <div className="d-flex gap-2">{Array.from({ length: 6 }, (_, index) => <Form.Control key={index} maxLength={1} className="text-center" style={{ width: 42 }} />)}</div>
    case "Form": return <FormLayoutDemo />
    case "Table": case "DataGrid": return <Table striped bordered hover responsive size={name === "DataGrid" ? "sm" : undefined}><thead><tr><th>#</th><th>名称</th><th>状态</th><th className="text-end">金额</th></tr></thead><tbody>{["Acme", "Northwind", "Contoso"].map((item, index) => <tr key={item}><td>{index + 1}</td><td>{item}</td><td><Badge bg="success">正常</Badge></td><td className="text-end">¥{(index + 1) * 1280}</td></tr>)}</tbody></Table>
    case "Descriptions": return <dl className="row mb-0"><dt className="col-sm-3">订单号</dt><dd className="col-sm-9">ORD-2401</dd><dt className="col-sm-3">状态</dt><dd className="col-sm-9">已支付</dd></dl>
    case "List": return <ListGroup variant="flush"><ListGroup.Item action>第一项</ListGroup.Item><ListGroup.Item action>第二项</ListGroup.Item><ListGroup.Item action>第三项</ListGroup.Item></ListGroup>
    case "Card": return <Card><Card.Header>Header</Card.Header><Card.Body><Card.Title>Card title</Card.Title><CardSubtitle className="mb-2 text-body-secondary">Subtitle</CardSubtitle><Card.Text>带有 header、footer 和操作链接的卡片。</Card.Text><CardLink href="#component-Link">链接</CardLink></Card.Body><Card.Footer>Footer</Card.Footer></Card>
    case "Avatar": return <Avatar name="林晓" size={48} />
    case "AvatarGroup": return <AvatarGroup names={["林晓", "Alex", "Maria", "Sophie"]} />
    case "Badge": return <div className="d-flex flex-wrap gap-2">{["primary", "secondary", "success", "danger", "warning", "info", "light", "dark"].map((variant) => <Badge key={variant} bg={variant} text={variant === "light" || variant === "warning" ? "dark" : undefined}>{variant}</Badge>)}<Badge pill bg="primary">pill</Badge><Button className="position-relative">消息<Badge pill bg="danger" className="position-absolute top-0 start-100 translate-middle">4</Badge></Button></div>
    case "Tag": return <Badge pill bg="primary">标签 <CloseButton variant="white" /></Badge>
    case "Statistic": return <div><span className="text-body-secondary">本月收入</span><div className="display-6">¥128,430</div><Badge bg="success">+12.4%</Badge></div>
    case "Timeline": return <ListGroup variant="flush" className="border-start border-3"><ListGroup.Item className="border-0">10:20 · 创建订单</ListGroup.Item><ListGroup.Item className="border-0">11:40 · 完成支付</ListGroup.Item></ListGroup>
    case "Image": return <div className="d-flex flex-wrap gap-2"><Image src={placeholderImage(100, 70)} fluid /><Image src={placeholderImage(100, 70)} rounded /><Image src={placeholderImage(100, 70)} roundedCircle /><Image src={placeholderImage(100, 70)} thumbnail /></div>
    case "Carousel": return <Carousel indicators><CarouselItem><div className="bg-dark" style={{ height: 200 }} /><Carousel.Caption><h3 className="h5">第一张</h3><p className="mb-0">带 captions 的 Carousel</p></Carousel.Caption></CarouselItem><CarouselItem><div className="bg-secondary" style={{ height: 200 }} /><Carousel.Caption><h3 className="h5">第二张</h3><p className="mb-0">第二张幻灯片</p></Carousel.Caption></CarouselItem></Carousel>
    case "Empty": return <EmptyState action={<Button>创建第一个项目</Button>} />
    case "Tooltip": return <div className="d-flex flex-wrap gap-2">{(["top", "right", "bottom", "left"] as const).map((placement) => <OverlayTrigger key={placement} placement={placement} overlay={<Tooltip>{placement} tooltip</Tooltip>}><Button variant="outline-secondary">{placement}</Button></OverlayTrigger>)}</div>
    case "Popover": return <div className="d-flex flex-wrap gap-2">{(["top", "right", "bottom", "left"] as const).map((placement) => <OverlayTrigger key={placement} placement={placement} overlay={<Popover><Popover.Header>{placement}</Popover.Header><Popover.Body>Popover 内容</Popover.Body></Popover>}><Button variant="outline-secondary">{placement}</Button></OverlayTrigger>)}</div>
    case "Alert": return <div className="d-grid gap-2">{["primary", "secondary", "success", "danger", "warning", "info", "light", "dark"].map((variant) => <Alert key={variant} variant={variant as never} dismissible><AlertHeading className="h6">{variant} alert</AlertHeading>支持 <a href="#component-Link">链接</a> 的提示。</Alert>)}</div>
    case "Toast": return <ToastLevelsDemo shown={toasts} onClose={closeToast} onReset={resetToasts} />
    case "Notification": return <Button onClick={openToast}>显示右上角 Notification（带操作）</Button>
    case "Dialog": return <div className="d-flex flex-wrap gap-2"><Button onClick={() => openModal("normal")}>打开普通 Modal</Button><Button onClick={() => openModal("confirm")}>打开确认 Modal</Button><Button onClick={() => openModal("fullscreen")}>打开全屏 Modal</Button><Button onClick={() => openModal("scrollable")}>打开滚动 Modal</Button><Button onClick={() => openModal("centered")}>打开居中 Modal</Button></div>
    case "Drawer": return <div className="d-flex flex-wrap gap-2">{(["start", "end", "top", "bottom"] as const).map((placement) => <Button key={placement} variant="outline-primary" onClick={() => openDrawer(placement)}>打开 {placement} Drawer</Button>)}</div>
    case "Sidebar": return <div className="border rounded p-2 bg-body-tertiary" style={{ maxWidth: 240 }}><div className="fw-semibold px-2 py-1">Acme Console</div><Nav variant="pills" className="flex-column"><Nav.Link active className="d-flex align-items-center gap-2"><Icon name="layout-dashboard" size={16} />仪表盘</Nav.Link><Nav.Link className="d-flex align-items-center gap-2"><Icon name="shopping-cart" size={16} />订单</Nav.Link><Nav.Link className="d-flex align-items-center gap-2"><Icon name="settings" size={16} />设置</Nav.Link></Nav><Button variant="outline-secondary" size="sm" className="mt-2 w-100" onClick={() => openDrawer("start")}>作为 Offcanvas 打开</Button></div>
    case "Progress": return <div className="d-grid gap-2">{["primary", "success", "warning", "danger"].map((variant) => <ProgressBar key={variant} now={72} variant={variant} label="72%" striped animated />)}<ProgressBar><ProgressBar variant="success" now={35} key={1} /><ProgressBar variant="warning" now={35} key={2} /><ProgressBar variant="danger" now={30} key={3} /></ProgressBar></div>
    case "Skeleton": return <Placeholder as="div" animation="glow"><Placeholder xs={12} /><Placeholder xs={8} /><PlaceholderButton xs={4} /></Placeholder>
    case "Spinner": return <div className="d-flex flex-wrap gap-3">{["primary", "secondary", "success", "danger", "warning", "info", "light", "dark"].map((variant) => <span key={variant}><Spinner variant={variant} /><Spinner animation="grow" variant={variant} size="sm" className="ms-2" /></span>)}</div>
    case "Result": return <ResultView onPrimary={() => undefined} onSecondary={() => undefined} />
    case "Popconfirm": return <OverlayTrigger trigger="click" placement="top" overlay={<Popover><Popover.Header>确认操作？</Popover.Header><Popover.Body><Button size="sm" variant="danger">确认</Button> <Button size="sm" variant="secondary">取消</Button></Popover.Body></Popover>}><Button variant="outline-danger">显示 Popconfirm</Button></OverlayTrigger>
    case "Menu": return <Nav variant="pills" className="flex-column"><Nav.Link active>仪表盘</Nav.Link><Nav.Link>订单</Nav.Link><Nav.Link>设置</Nav.Link><Collapse in><div className="ps-3"><Nav.Link>子菜单</Nav.Link></div></Collapse></Nav>
    case "Dropdown": return <div className="d-flex flex-wrap gap-2"><DropdownButton title="Dropdown"><DropdownHeader>菜单标题</DropdownHeader><DropdownItemText>不可点击文本</DropdownItemText><Dropdown.Item>菜单项</Dropdown.Item><DropdownDivider /><Dropdown.Item>分隔线下方</Dropdown.Item></DropdownButton><Dropdown drop="up"><Dropdown.Toggle variant="outline-secondary">向上</Dropdown.Toggle><Dropdown.Menu><Dropdown.Item>Item</Dropdown.Item></Dropdown.Menu></Dropdown></div>
    case "Breadcrumb": return <Breadcrumb><Breadcrumb.Item href="#">首页</Breadcrumb.Item><Breadcrumb.Item href="#">组件</Breadcrumb.Item><Breadcrumb.Item active>当前页</Breadcrumb.Item></Breadcrumb>
    case "Tabs": return <Tabs defaultActiveKey="one" variant="pills" className="mb-2"><Tab eventKey="one" title="标签一">内容一</Tab><Tab eventKey="two" title="标签二">内容二</Tab><Tab eventKey="three" title="标签三">内容三</Tab></Tabs>
    case "Pagination": return <div className="d-flex flex-wrap gap-3"><Pagination size="sm"><Pagination.First /><Pagination.Prev /><Pagination.Item active>1</Pagination.Item><Pagination.Ellipsis /><Pagination.Last /></Pagination><Pagination><PageItem active>1</PageItem><PageItem>2</PageItem></Pagination><Pagination size="lg"><Pagination.Item>1</Pagination.Item><Pagination.Item>2</Pagination.Item></Pagination></div>
    case "Steps": return <div><ProgressBar now={66} className="mb-2" /><ButtonGroup><Button variant="primary">1 基本信息</Button><Button variant="primary">2 配置</Button><Button variant="outline-secondary">3 完成</Button></ButtonGroup></div>
    case "Anchor": return <Nav className="flex-column"><Nav.Link href="#component-Button">Button</Nav.Link><Nav.Link href="#component-Table">Table</Nav.Link><Nav.Link href="#component-Link">Link</Nav.Link></Nav>
    case "BackTop": return <div className="d-flex align-items-center gap-3"><Button variant="outline-secondary" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}><Icon name="arrow-up" className="me-1" />返回顶部</Button><span className="text-body-secondary small">同样的按钮以 fixed 定位固定在页面右下角。</span><Button className="position-fixed bottom-0 end-0 m-4 rounded-circle" aria-label="返回顶部" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}><Icon name="arrow-up" /></Button></div>
    case "Affix": return <div className="sticky-top bg-body border rounded p-2">sticky-top Affix</div>
    case "Navbar": return <Navbar bg="body-tertiary" expand="lg"><Container><Navbar.Brand href="#">Acme</Navbar.Brand><Navbar.Toggle /><Navbar.Collapse><Nav><Nav.Link href="#">首页</Nav.Link><NavDropdown title="产品"><NavDropdown.Item>概览</NavDropdown.Item></NavDropdown></Nav></Navbar.Collapse></Container></Navbar>
    case "CommandPalette": return <Button onClick={openCommand}>打开 CommandPalette</Button>
    case "Grid": return <Container><Row className="g-2"><Col><div className="bg-primary-subtle p-3">Row / Col</div></Col><Col><div className="bg-primary-subtle p-3">Grid</div></Col></Row></Container>
    case "Stack": return <Stack direction="horizontal" gap={2}><Badge>Horizontal</Badge><Button>Stack</Button><Button variant="outline-secondary">Gap</Button></Stack>
    case "Layout": return <div className="d-flex border rounded"><aside className="p-2 border-end">Sidebar</aside><div className="p-2 flex-grow-1">Content</div></div>
    case "Container": return <Container className="bg-body-secondary p-3">Container responsive</Container>
    case "AspectRatio": return <div className="d-flex flex-wrap gap-2 ratio-demo"><Ratio aspectRatio="1x1" className="bg-body-secondary"><span>1:1</span></Ratio><Ratio aspectRatio="4x3" className="bg-body-secondary"><span>4:3</span></Ratio><Ratio aspectRatio="16x9" className="bg-body-secondary"><span>16:9</span></Ratio><Ratio aspectRatio="21x9" className="bg-body-secondary"><span>21:9</span></Ratio></div>
    case "ScrollArea": return <div className="overflow-auto border p-2" style={{ maxHeight: 90 }}><p>ScrollArea content</p><p>More content</p><p>Scrollable content</p></div>
    case "Accordion": return <Accordion flush alwaysOpen><Accordion.Item eventKey="0"><Accordion.Header>默认 / Flush Accordion</Accordion.Header><Accordion.Body>Always open 内容</Accordion.Body></Accordion.Item><Accordion.Item eventKey="1"><Accordion.Header>另一个问题</Accordion.Header><Accordion.Body>React Bootstrap 官方组件。</Accordion.Body></Accordion.Item></Accordion>
    case "ThemeProvider": return <ThemeProvider prefixes={{ button: "theme-button" }}><Button>ThemeProvider 前缀</Button></ThemeProvider>
    case "Kbd": return <kbd>⌘ K</kbd>
    case "Code": return <code>const value = true</code>
    case "Divider": return <hr />
    case "Link": return <a href="#component-Typography">链接 Link</a>
    default: return <Alert variant="light">组合示例：{name}</Alert>
  }
}

function ButtonDemo() {
  const variants = ["primary", "secondary", "success", "danger", "warning", "info", "light", "dark"] as const
  return <><div className="bg-body-secondary rounded p-2 mb-2"><div className="d-flex flex-wrap gap-2">{variants.map((variant) => <Button key={variant} variant={variant}>{variant}</Button>)}</div><div className="d-flex flex-wrap gap-2">{variants.map((variant) => <Button key={variant} variant={`outline-${variant}`}>{`outline-${variant}`}</Button>)}</div></div><div className="d-flex flex-wrap gap-2 align-items-center"><Button size="sm">Small</Button><Button>Medium</Button><Button size="lg">Large</Button><Button active>Active</Button><Button disabled>Disabled</Button><Button><Spinner animation="border" size="sm" className="me-1" />Loading</Button><Button variant="outline-secondary" aria-label="图标按钮"><Icon name="plus" /></Button><Button variant="link">Link</Button></div></>
}

function FormDemo() {
  const inputRef = useRef<HTMLInputElement>(null)
  return <Row className="g-3"><Col md={6}><Form.Label>Sizes</Form.Label><Form.Control size="sm" placeholder="Small" /><Form.Control className="my-2" placeholder="Medium" /><Form.Control size="lg" placeholder="Large" /><Form.Control disabled placeholder="Disabled" /><Form.Control readOnly value="Read only" className="my-2" /><Form.Control plaintext readOnly value="Plaintext" /></Col><Col md={6}><InputGroup><InputGroup.Text><Icon name="user" /></InputGroup.Text><Form.Control placeholder="Prefix" /><InputGroup.Text>@acme.dev</InputGroup.Text></InputGroup><FloatingLabel label="Floating label" className="mt-2"><FormControl placeholder="Floating label" /></FloatingLabel><Form.Control type="search" placeholder="Search" className="mt-2" /><Form.Control isValid defaultValue="Valid" className="mt-2" /><Form.Control isInvalid defaultValue="Invalid" /><Form.Control.Feedback type="invalid">请输入有效值</Form.Control.Feedback><div className="form-check mt-2"><input ref={inputRef} className="form-check-input" type="checkbox" aria-label="indeterminate checkbox" onChange={(event) => { if (inputRef.current) inputRef.current.indeterminate = event.currentTarget.checked }} /><label className="form-check-label">Indeterminate</label></div></Col></Row>
}

function FormLayoutDemo() {
  return <Row className="g-4"><Col lg={4}><h3 className="h6 text-body-secondary">垂直</h3><Form><Form.Group className="mb-2" controlId="fl-v-name"><Form.Label>姓名</Form.Label><Form.Control placeholder="姓名" /></Form.Group><Form.Group className="mb-2" controlId="fl-v-email"><Form.Label>邮箱</Form.Label><Form.Control type="email" placeholder="name@example.com" /><Form.Text>用于接收通知。</Form.Text></Form.Group><Form.Check type="switch" id="fl-v-switch" label="记住我" className="mb-2" /><Button type="button">提交</Button></Form></Col><Col lg={4}><h3 className="h6 text-body-secondary">水平</h3><Form><Form.Group as={Row} className="mb-2" controlId="fl-h-name"><Form.Label column sm={3}>姓名</Form.Label><Col sm={9}><Form.Control placeholder="姓名" /></Col></Form.Group><Form.Group as={Row} className="mb-2" controlId="fl-h-email"><Form.Label column sm={3}>邮箱</Form.Label><Col sm={9}><Form.Control type="email" placeholder="name@example.com" /></Col></Form.Group><Row><Col sm={{ span: 9, offset: 3 }}><Button type="button">提交</Button></Col></Row></Form></Col><Col lg={4}><h3 className="h6 text-body-secondary">内联</h3><Form><Row className="g-2 align-items-center"><Col xs="auto"><Form.Label htmlFor="fl-i-name" visuallyHidden>姓名</Form.Label><Form.Control id="fl-i-name" placeholder="姓名" /></Col><Col xs="auto"><Form.Check type="checkbox" id="fl-i-check" label="记住我" /></Col><Col xs="auto"><Button type="button">提交</Button></Col></Row></Form></Col></Row>
}

function ToastLevelsDemo({ shown, onClose, onReset }: { shown: string[]; onClose: (variant: string) => void; onReset: () => void }) {
  return <div className="d-grid gap-2">{["primary", "success", "warning", "danger"].map((variant) => <Toast key={variant} bg={variant} show={shown.includes(variant)} onClose={() => onClose(variant)} className={variant === "warning" ? "" : "text-white"} style={{ width: "100%", maxWidth: "100%" }}><Toast.Header><strong className="me-auto">{variant} 通知</strong><small>示例</small></Toast.Header><Toast.Body className="d-flex justify-content-between align-items-center"><span>{variant} 级别 Toast</span><Button size="sm" variant={variant === "warning" ? "dark" : "light"} onClick={() => onClose(variant)}>操作</Button></Toast.Body></Toast>)}<Button variant="outline-secondary" onClick={onReset}>重新显示全部</Button></div>
}
function CheckboxDemo() {
  return <><Form.Check label="Inline" inline defaultChecked /><Form.Check label="Reverse" reverse /><Form.Check label="Disabled" disabled /><Form.Check label="Indeterminate style" /></>
}

export function ComponentsPage() {
  const [modal, setModal] = useState<string | null>(null)
  const [drawer, setDrawer] = useState<"start" | "end" | "top" | "bottom" | null>(null)
  const [toast, setToast] = useState(false)
  const [toasts, setToasts] = useState<string[]>(["primary", "success", "warning", "danger"])
  const [command, setCommand] = useState(false)
  const anchors = contractComponents.map((name) => <Nav.Link key={name} href={`#component-${name}`} className="px-1 py-0"><Badge bg="light" text="dark">{name}</Badge></Nav.Link>)
  return <ResponsivePage><PageTitle title="组件全集" subtitle="84 个 UI Gallery 合约组件、React Bootstrap 变体与组合示例。" /><Nav className="anchor-index flex-wrap gap-2 mb-4">{anchors}</Nav>{Object.entries(groups).map(([group, names]) => <Section key={group} title={group}>{names.map((name) => <DemoCard key={name} name={name}><ComponentDemo name={name} openModal={setModal} openDrawer={setDrawer} openToast={() => setToast(true)} openCommand={() => setCommand(true)} toasts={toasts} closeToast={(variant) => setToasts((current) => current.filter((item) => item !== variant))} resetToasts={() => setToasts(["primary", "success", "warning", "danger"])} /></DemoCard>)}</Section>)}<Section title="React Bootstrap 全部导出"><Card><Card.Body><p className="text-body-secondary">当前安装版本导出清单（组件导出均有清单或 live demo，hooks/contexts 以 Badge 列出）。</p><div className="d-flex flex-wrap gap-2">{rbExports.map((name) => <Badge key={name} bg={name.startsWith("use") || name.endsWith("Context") ? "dark" : "light"} text={name.startsWith("use") || name.endsWith("Context") ? "light" : "dark"}>{name}</Badge>)}</div><div className="d-flex flex-wrap gap-2 mt-3"><ButtonToolbar><ButtonGroup className="me-2"><ButtonToolbarDemo /></ButtonGroup></ButtonToolbar><FormFloatingDemo /><TabExportsDemo /><Button onClick={() => setCommand(true)}>打开导出 CommandPalette</Button></div><div className="mt-3"><CardGroupDemo /></div><ExportExtras /></Card.Body></Card></Section><Modal show={Boolean(modal)} onHide={() => setModal(null)} centered={modal === "centered"} fullscreen={modal === "fullscreen" ? true : undefined} scrollable={modal === "scrollable"}><Modal.Header closeButton><Modal.Title>{modal === "confirm" ? "确认操作" : "Modal 示例"}</Modal.Title></Modal.Header><Modal.Body>{modal === "confirm" ? "确定要继续吗？" : "normal / fullscreen / scrollable / centered Modal"}</Modal.Body><Modal.Footer><Button variant="secondary" onClick={() => setModal(null)}>取消</Button><Button onClick={() => setModal(null)}>确定</Button></Modal.Footer></Modal><Offcanvas show={Boolean(drawer)} onHide={() => setDrawer(null)} placement={drawer ?? "end"}><Offcanvas.Header closeButton><Offcanvas.Title>Drawer / Sidebar</Offcanvas.Title></Offcanvas.Header><Offcanvas.Body>可从 {drawer} 方向打开的 Offcanvas。</Offcanvas.Body></Offcanvas><ToastContainer position="top-end" className="p-3"><Toast show={toast} onClose={() => setToast(false)} autohide delay={3000}><ToastHeader><strong className="me-auto">通知</strong><small>示例</small></ToastHeader><ToastBody><div className="d-flex justify-content-between align-items-center">Toast 四种背景变体与操作<Button size="sm" onClick={() => setToast(false)}>操作</Button></div></ToastBody></Toast></ToastContainer><Modal show={command} onHide={() => setCommand(false)} centered><Modal.Header closeButton><Modal.Title>CommandPalette</Modal.Title></Modal.Header><Modal.Body><Form.Control autoFocus placeholder="搜索命令..." className="mb-3" /><ListGroup><ListGroup.Item action>创建项目</ListGroup.Item><ListGroup.Item action>打开设置</ListGroup.Item></ListGroup></Modal.Body></Modal></ResponsivePage>
}

function ButtonToolbarDemo() {
  return <><Button>Toolbar</Button><Button variant="outline-secondary">Tools</Button></>
}

function CardGroupDemo() {
  return <CardGroup><Card><Card.Body className="position-relative" style={{ minHeight: 96 }}><CardImgOverlay>CardGroup / CardImgOverlay</CardImgOverlay></Card.Body></Card><Card><Card.Body><CardSubtitle>CardSubtitle</CardSubtitle><CardLink href="#">CardLink</CardLink></Card.Body></Card></CardGroup>
}

function FormFloatingDemo() {
  return <FormFloating className="ms-2"><FormControl placeholder="Floating" id="export-floating" /><FormLabel htmlFor="export-floating">FloatingLabel</FormLabel></FormFloating>
}

function TabExportsDemo() {
  return <TabContainer defaultActiveKey="one"><Nav variant="tabs"><Nav.Item><Nav.Link eventKey="one">TabPane</Nav.Link></Nav.Item><Nav.Item><Nav.Link eventKey="two">TabContent</Nav.Link></Nav.Item></Nav><TabContent className="border p-2"><TabPane eventKey="one">TabContainer / TabPane live demo</TabPane><TabPane eventKey="two">TabContent</TabPane></TabContent></TabContainer>
}

function ExportExtras() {
  return <Row className="g-2 mt-3"><Col md={4}><Figure><Figure.Image width={120} height={70} src={placeholderImage(120, 70)} /><Figure.Caption>Figure caption</Figure.Caption></Figure></Col><Col md={4}><Form.Label htmlFor="export-select">FormSelect</Form.Label><FormSelect id="export-select"><option>Option</option></FormSelect></Col><Col md={4}><Fade in><div className="bg-body-secondary p-2">Fade export</div></Fade><Overlay show={false} target={document.body}><Popover>Overlay export</Popover></Overlay></Col></Row>
}
