import { useState } from "react"
import {
  App,
  AutoComplete,
  Card,
  Checkbox,
  Col,
  ColorPicker,
  DatePicker,
  Descriptions,
  Form as AntForm,
  Grid,
  Input,
  InputNumber,
  Rate,
  Radio,
  Row,
  Select,
  Slider,
  Space,
  Steps,
  Switch,
  TimePicker,
  Upload,
  Result,
  Button,
} from "antd"
import type { UploadFile } from "antd"
import plans from "@ui-gallery/spec/mock/plans.json"
import { Icon } from "@/icons"
import { PageHeader } from "@/pages/shared"

const fileList: UploadFile[] = [
  { uid: "1", name: "项目说明.pdf", status: "done" },
  { uid: "2", name: "品牌素材.zip", status: "done" },
]

export function FormPage() {
  const [step, setStep] = useState(0)
  const [done, setDone] = useState(false)
  const [form] = AntForm.useForm()
  const { message } = App.useApp()
  const screens = Grid.useBreakpoint()
  const next = async () => {
    try {
      await form.validateFields()
      setStep((current) => Math.min(2, current + 1))
    } catch {
      message.error("请完善必填项")
    }
  }
  if (done)
    return (
      <Result
        status="success"
        title="提交成功"
        subTitle="你的项目已经创建。"
        extra={
          <Button
            type="primary"
            onClick={() => {
              setDone(false)
              setStep(0)
            }}
          >
            创建另一个
          </Button>
        }
      />
    )
  return (
    <>
      <PageHeader title="新建项目" description="通过多步骤表单创建一个项目。" />
      <Steps
        current={step}
        direction={screens.md ? "horizontal" : "vertical"}
        responsive
        items={[
          { title: "基本信息" },
          { title: "详细配置" },
          { title: "确认" },
        ]}
        style={{ marginBottom: 24 }}
      />
      <Card>
        <AntForm form={form} layout="vertical">
          {step === 0 ? <StepOne /> : null}
          {step === 1 ? <StepTwo /> : null}
          {step === 2 ? <StepThree form={form} /> : null}
          <Space style={{ marginTop: 16 }}>
            {step > 0 ? (
              <Button onClick={() => setStep((current) => current - 1)}>
                上一步
              </Button>
            ) : null}
            {step < 2 ? (
              <Button type="primary" onClick={next}>
                下一步
              </Button>
            ) : (
              <Button
                type="primary"
                onClick={async () => {
                  try {
                    await form.validateFields()
                    setDone(true)
                  } catch {
                    message.error("请同意条款")
                  }
                }}
              >
                提交
              </Button>
            )}
          </Space>
        </AntForm>
      </Card>
    </>
  )
}

function StepOne() {
  return (
    <Row gutter={16}>
      <Col xs={24} md={12}>
        <AntForm.Item
          name="name"
          label="项目名称"
          rules={[{ required: true, message: "请输入项目名称" }]}
        >
          <Input />
        </AntForm.Item>
      </Col>
      <Col xs={24} md={12}>
        <AntForm.Item
          name="count"
          label="席位数量"
          rules={[
            { required: true, message: "请输入席位数量" },
            {
              type: "number",
              min: 1,
              max: 999,
              message: "请输入 1-999 的数量",
            },
          ]}
        >
          <InputNumber style={{ width: "100%" }} />
        </AntForm.Item>
      </Col>
      <Col xs={24} md={12}>
        <AntForm.Item
          name="email"
          label="邮箱"
          rules={[{ required: true, type: "email", message: "请输入有效邮箱" }]}
        >
          <Input />
        </AntForm.Item>
      </Col>
      <Col xs={24} md={12}>
        <AntForm.Item name="phone" label="联系电话">
          <Input
            addonBefore={
              <Select
                defaultValue="+86"
                options={[{ value: "+86" }, { value: "+1" }]}
              />
            }
          />
        </AntForm.Item>
      </Col>
      <Col span={24}>
        <AntForm.Item name="description" label="项目描述">
          <Input.TextArea showCount maxLength={200} rows={4} />
        </AntForm.Item>
      </Col>
      <Col span={24}>
        <AntForm.Item name="type" label="项目类型">
          <Radio.Group options={["内部项目", "客户项目", "实验项目"]} />
        </AntForm.Item>
      </Col>
      <Col span={24}>
        <AntForm.Item name="features" label="启用功能">
          <Checkbox.Group options={["数据看板", "AI 助手", "通知中心"]} />
        </AntForm.Item>
      </Col>
      <Col span={24}>
        <AntForm.Item name="active" label="立即启用" valuePropName="checked">
          <Switch />
        </AntForm.Item>
      </Col>
    </Row>
  )
}

function StepTwo() {
  return (
    <Row gutter={16}>
      <Col xs={24} md={12}>
        <AntForm.Item
          name="plan"
          label="方案"
          tooltip="选择适合团队规模的方案"
          extra="方案可在设置中调整。"
          rules={[{ required: true, message: "请选择方案" }]}
        >
          <Select
            options={plans.map((plan) => ({
              value: plan.name,
              label: plan.name,
            }))}
          />
        </AntForm.Item>
      </Col>
      <Col xs={24} md={12}>
        <AntForm.Item name="tags" label="标签">
          <Select
            mode="tags"
            options={["重要", "季度", "增长"].map((value) => ({ value }))}
          />
        </AntForm.Item>
      </Col>
      <Col xs={24} md={12}>
        <AntForm.Item name="autocomplete" label="自动完成">
          <AutoComplete
            options={["增长", "协作", "分析"].map((value) => ({ value }))}
          />
        </AntForm.Item>
      </Col>
      <Col xs={24} md={12}>
        <AntForm.Item name="date" label="开始日期">
          <DatePicker style={{ width: "100%" }} />
        </AntForm.Item>
      </Col>
      <Col xs={24} md={12}>
        <AntForm.Item name="time" label="提醒时间">
          <TimePicker style={{ width: "100%" }} />
        </AntForm.Item>
      </Col>
      <Col xs={24} md={12}>
        <AntForm.Item name="range" label="日期范围">
          <DatePicker.RangePicker style={{ width: "100%" }} showTime />
        </AntForm.Item>
      </Col>
      <Col span={24}>
        <AntForm.Item name="budget" label="预算范围">
          <Slider
            range
            defaultValue={[20, 80]}
            marks={{ 20: "20", 80: "80" }}
          />
        </AntForm.Item>
      </Col>
      <Col xs={24} md={8}>
        <AntForm.Item name="rating" label="评分">
          <Rate allowHalf />
        </AntForm.Item>
      </Col>
      <Col xs={24} md={8}>
        <AntForm.Item name="color" label="颜色">
          <ColorPicker showText />
        </AntForm.Item>
      </Col>
      <Col xs={24} md={8}>
        <AntForm.Item name="upload" label="附件" extra="仅演示本地文件列表。">
          <Upload.Dragger
            defaultFileList={fileList}
            beforeUpload={() => false}
            maxCount={3}
          >
            <p>
              <Icon name="upload" size={28} />
            </p>
            <p>拖拽文件到此处或点击上传</p>
          </Upload.Dragger>
        </AntForm.Item>
      </Col>
    </Row>
  )
}

function StepThree({ form }: { form: ReturnType<typeof AntForm.useForm>[0] }) {
  const values = form.getFieldsValue(true)
  return (
    <>
      <Descriptions
        bordered
        column={1}
        items={Object.entries(values)
          .filter(([, value]) => value !== undefined)
          .map(([label, value]) => ({
            label,
            children: Array.isArray(value) ? value.join("、") : String(value),
          }))}
      />
      <AntForm.Item
        name="agree"
        valuePropName="checked"
        rules={[
          {
            validator: (_, value) =>
              value
                ? Promise.resolve()
                : Promise.reject(new Error("请同意条款")),
          },
        ]}
      >
        <Checkbox>我同意服务条款</Checkbox>
      </AntForm.Item>
    </>
  )
}
