<script setup lang="ts">
import { reactive, ref } from "vue"
import type { FieldRule, FileItem, FormInstance } from "@arco-design/web-vue"
import team from "@ui-gallery/spec/mock/team.json"
import PageHeader from "@/components/PageHeader.vue"
import { Icon } from "@/lib/icons"
import { useIsMobile } from "@/lib/useIsMobile"

const step = ref(1)
const submitting = ref(false)
const done = ref(false)
const formRef = ref<FormInstance>()
const isMobile = useIsMobile()

const form = reactive({
  name: "",
  slug: "",
  email: "",
  phoneCode: "+86",
  phone: "",
  description: "",
  type: "web",
  notifyChannels: ["email"] as string[],
  visibility: "private",
  region: "cn-shanghai",
  members: [] as string[],
  ownerEmail: "",
  tags: [] as string[],
  budget: 5000,
  budgetRange: [2000, 12000] as [number, number],
  notify: true,
  deadline: "",
  time: "",
  dateRange: [] as string[],
  rating: 4.5,
  color: "#165DFF",
  files: [] as FileItem[],
  agree: false,
})

const rules: Record<string, FieldRule[]> = {
  name: [{ required: true, message: "请输入项目名称" }, { minLength: 2, maxLength: 30, message: "2–30 个字符" }],
  slug: [{ required: true, message: "请输入项目标识" }, { match: /^[a-z0-9-]+$/, message: "仅允许小写字母、数字与连字符" }],
  email: [{ required: true, message: "请输入邮箱" }, { type: "email", message: "请输入有效的邮箱地址" }],
  phone: [{ required: true, message: "请输入电话号码" }],
  description: [{ maxLength: 200, message: "最多 200 字" }],
  region: [{ required: true, message: "请选择地区" }],
  members: [{ type: "array", minLength: 1, message: "至少添加一位成员" }],
  ownerEmail: [{ required: true, message: "请选择负责人邮箱" }],
  deadline: [{ required: true, message: "请选择截止日期" }],
  dateRange: [{ type: "array", minLength: 2, message: "请选择项目日期范围" }],
  agree: [{ type: "boolean", true: true, message: "请先同意服务条款" }],
}

const stepFields: Record<number, string[]> = {
  1: ["name", "slug", "email", "phone", "description"],
  2: ["region", "members", "ownerEmail", "deadline", "dateRange"],
  3: ["agree"],
}

async function next() {
  const errors = await formRef.value?.validateField(stepFields[step.value]!)
  if (errors) return
  if (step.value < 3) {
    step.value += 1
    return
  }
  submitting.value = true
  setTimeout(() => {
    submitting.value = false
    done.value = true
  }, 900)
}

function restart() {
  done.value = false
  step.value = 1
  formRef.value?.resetFields()
}
</script>

<template>
  <div class="page">
    <PageHeader title="新建项目" description="分三步完成：基础信息 → 详细配置 → 确认提交。" />

    <a-card :bordered="true" class="form-card">
      <a-result v-if="done" status="success" title="项目已创建" subtitle="我们已通知所有成员，可在仪表盘查看进度。">
        <template #extra>
          <a-space>
            <a-button @click="restart">再建一个</a-button>
            <a-button type="primary">前往项目</a-button>
          </a-space>
        </template>
      </a-result>

      <template v-else>
        <a-steps :current="step" size="small" style="margin-bottom: 32px" :direction="isMobile ? 'vertical' : 'horizontal'" :label-placement="isMobile ? 'horizontal' : 'vertical'">
          <a-step description="名称与描述">基础信息</a-step>
          <a-step description="成员与预算">详细配置</a-step>
          <a-step description="检查并提交">确认</a-step>
        </a-steps>

        <a-form ref="formRef" :model="form" :rules="rules" layout="vertical" auto-label-width>
          <div v-show="step === 1" class="stack" style="gap: 0">
            <a-form-item field="name" label="项目名称" required feedback>
              <a-input v-model="form.name" placeholder="例如：落地页改版" :max-length="30" show-word-limit />
            </a-form-item>
            <a-form-item field="slug" label="项目标识" extra="用于 URL，仅允许小写字母、数字与连字符。">
              <a-input v-model="form.slug" placeholder="landing-refresh">
                <template #prepend>acme.dev/</template>
              </a-input>
            </a-form-item>
            <a-form-item field="email" label="邮箱" tooltip="用于接收项目通知" help="请使用团队成员可以访问的工作邮箱。">
              <a-input v-model="form.email" :input-attrs="{ type: 'email' }" placeholder="name@company.com" style="width: 100%" />
            </a-form-item>
            <a-form-item field="phone" label="电话" tooltip="用于重要项目提醒" extra="支持中国大陆、香港、日本和美国号码。">
              <a-input-group>
                <a-select v-model="form.phoneCode" style="width: 120px; flex-shrink: 0">
                  <a-option value="+86">+86 中国</a-option>
                  <a-option value="+852">+852 香港</a-option>
                  <a-option value="+81">+81 日本</a-option>
                  <a-option value="+1">+1 美国</a-option>
                </a-select>
                <a-input v-model="form.phone" placeholder="请输入电话号码" />
              </a-input-group>
            </a-form-item>
            <a-form-item field="description" label="描述" extra="用一句话说明项目的目标和范围。">
              <a-textarea v-model="form.description" placeholder="简要描述项目目标…" :max-length="200" show-word-limit :auto-size="{ minRows: 3 }" />
            </a-form-item>
            <a-form-item field="type" label="项目类型" tooltip="选择最接近的交付类型。">
              <a-radio-group v-model="form.type">
                <a-radio value="web">Web</a-radio>
                <a-radio value="mobile">移动端</a-radio>
                <a-radio value="api">API</a-radio>
              </a-radio-group>
            </a-form-item>
            <a-form-item field="notifyChannels" label="通知渠道" help="可同时选择多个渠道。">
              <a-checkbox-group v-model="form.notifyChannels">
                <a-checkbox value="email">邮件</a-checkbox>
                <a-checkbox value="sms">短信</a-checkbox>
                <a-checkbox value="inbox">站内</a-checkbox>
              </a-checkbox-group>
            </a-form-item>
          </div>

          <div v-show="step === 2" class="stack" style="gap: 0">
            <div class="grid grid-2" style="gap: 0 16px">
              <a-form-item field="region" label="地区" tooltip="选择项目数据存储区域。" help="创建后仍可在项目设置中调整。">
                <a-select v-model="form.region" placeholder="选择地区" style="width: 100%">
                  <a-option value="cn-shanghai">华东（上海）</a-option>
                  <a-option value="cn-beijing">华北（北京）</a-option>
                  <a-option value="ap-singapore">亚太（新加坡）</a-option>
                </a-select>
              </a-form-item>
              <a-form-item field="deadline" label="截止日期" tooltip="项目主要交付日期。">
                <a-date-picker v-model="form.deadline" style="width: 100%" />
              </a-form-item>
            </div>
            <a-form-item field="members" label="项目成员" help="至少选择一位成员，可继续添加多个成员。">
              <a-select v-model="form.members" multiple placeholder="添加成员" allow-clear style="width: 100%">
                <a-option v-for="member in team" :key="member.name" :value="member.name">
                  <a-space size="small">
                    <a-avatar :size="20">{{ member.name.slice(0, 1) }}</a-avatar>
                    {{ member.name }} <span class="muted small">{{ member.role }}</span>
                  </a-space>
                </a-option>
              </a-select>
            </a-form-item>
            <a-form-item field="ownerEmail" label="负责人邮箱" tooltip="负责人会收到项目创建通知。" extra="输入邮箱前缀即可从团队成员中选择。">
              <a-auto-complete v-model="form.ownerEmail" :data="team.map((member) => member.email)" placeholder="负责人邮箱" style="width: 100%" />
            </a-form-item>
            <div class="grid grid-2" style="gap: 0 16px">
              <a-form-item field="time" label="提醒时间" help="按项目所在地区的本地时间提醒。">
                <a-time-picker v-model="form.time" format="HH:mm" style="width: 100%" />
              </a-form-item>
              <a-form-item field="dateRange" label="项目日期范围" tooltip="用于规划项目周期。">
                <a-range-picker v-model="form.dateRange" style="width: 100%" />
              </a-form-item>
            </div>
            <a-form-item field="budget" label="预算（元）" tooltip="用于预算提醒和报表统计。" help="请输入预计总预算，范围滑块用于设置预警区间。">
              <a-input-number v-model="form.budget" :min="0" :max="500000" :step="500" style="width: 100%" />
            </a-form-item>
            <a-form-item field="budgetRange" label="预算区间">
              <a-slider v-model="form.budgetRange" range :min="0" :max="50000" :step="500" show-input style="width: 100%" />
            </a-form-item>
            <a-form-item field="visibility" label="可见性" extra="公开项目会展示给组织内所有成员。">
              <a-radio-group v-model="form.visibility" type="button">
                <a-radio value="private">私有</a-radio>
                <a-radio value="team">团队</a-radio>
                <a-radio value="public">公开</a-radio>
              </a-radio-group>
            </a-form-item>
            <a-form-item field="notify" label="创建通知">
              <a-switch v-model="form.notify" /><span class="muted small" style="margin-left: 8px">创建后通知所有成员</span>
            </a-form-item>
            <a-form-item field="rating" label="优先级评分" tooltip="用半星表示项目优先级。">
              <a-rate v-model="form.rating" allow-half />
            </a-form-item>
            <a-form-item field="color" label="项目颜色">
              <a-color-picker v-model="form.color" show-text />
            </a-form-item>
            <a-form-item field="tags" label="标签" help="输入后按回车添加标签。">
              <a-input-tag v-model="form.tags" placeholder="回车添加标签" allow-clear style="width: 100%" />
            </a-form-item>
            <a-form-item field="files" label="项目文件" tooltip="可上传需求文档或设计稿。" extra="支持多个文件，当前仅展示文件列表。">
              <a-upload v-model:file-list="form.files" action="/" draggable :auto-upload="false" multiple tip="拖拽文件到此处或点击上传" />
            </a-form-item>
          </div>

          <div v-show="step === 3" class="stack">
            <a-alert type="info">请核对以下信息，提交后仍可在设置中修改。</a-alert>
            <a-descriptions :column="{ xs: 1, md: 2 }" bordered>
              <a-descriptions-item label="项目名称">{{ form.name || "—" }}</a-descriptions-item>
              <a-descriptions-item label="标识">acme.dev/{{ form.slug || "—" }}</a-descriptions-item>
              <a-descriptions-item label="邮箱">{{ form.email || "—" }}</a-descriptions-item>
              <a-descriptions-item label="电话">{{ form.phone ? `${form.phoneCode} ${form.phone}` : "—" }}</a-descriptions-item>
              <a-descriptions-item label="类型">{{ form.type }}</a-descriptions-item>
              <a-descriptions-item label="通知渠道">{{ form.notifyChannels.join("、") || "—" }}</a-descriptions-item>
              <a-descriptions-item label="地区">{{ form.region }}</a-descriptions-item>
              <a-descriptions-item label="截止日期">{{ form.deadline || "—" }}</a-descriptions-item>
              <a-descriptions-item label="预算">¥{{ form.budget.toLocaleString() }}</a-descriptions-item>
              <a-descriptions-item label="预算区间">¥{{ form.budgetRange[0].toLocaleString() }} – ¥{{ form.budgetRange[1].toLocaleString() }}</a-descriptions-item>
              <a-descriptions-item label="负责人">{{ form.ownerEmail || "—" }}</a-descriptions-item>
              <a-descriptions-item label="提醒时间">{{ form.time || "—" }}</a-descriptions-item>
              <a-descriptions-item label="日期范围">{{ form.dateRange.join(" – ") || "—" }}</a-descriptions-item>
              <a-descriptions-item label="评分">{{ form.rating }}</a-descriptions-item>
              <a-descriptions-item label="颜色">{{ form.color }}</a-descriptions-item>
              <a-descriptions-item label="成员" :span="2">
                <a-avatar-group :size="28" :max-count="5">
                  <a-avatar v-for="member in form.members" :key="member">{{ member.slice(0, 1) }}</a-avatar>
                </a-avatar-group>
                <span v-if="!form.members.length" class="muted">—</span>
              </a-descriptions-item>
              <a-descriptions-item label="标签" :span="2">
                <a-space wrap><a-tag v-for="tag in form.tags" :key="tag" color="arcoblue">{{ tag }}</a-tag><span v-if="!form.tags.length" class="muted">—</span></a-space>
              </a-descriptions-item>
              <a-descriptions-item label="描述" :span="2">{{ form.description || "—" }}</a-descriptions-item>
              <a-descriptions-item label="文件" :span="2">{{ form.files.map((file) => file.name).join("、") || "—" }}</a-descriptions-item>
            </a-descriptions>
            <a-form-item field="agree" hide-label>
              <a-checkbox v-model="form.agree">我已阅读并同意 <a-link>服务条款</a-link></a-checkbox>
            </a-form-item>
          </div>
        </a-form>

        <div class="between step-actions" style="margin-top: 24px">
          <a-button :disabled="step === 1" @click="step -= 1">
            <template #icon><Icon name="chevron-left" /></template>
            上一步
          </a-button>
          <a-space>
            <a-button type="text">保存草稿</a-button>
            <a-button type="primary" :loading="submitting" @click="next">
              {{ step === 3 ? "提交" : "下一步" }}
              <template v-if="step < 3" #icon><Icon name="chevron-right" /></template>
            </a-button>
          </a-space>
        </div>
      </template>
    </a-card>
  </div>
</template>

<style scoped>
.form-card {
  width: 100%;
  max-width: 860px;
  min-width: 0;
  box-sizing: border-box;
}

.step-actions {
  flex-wrap: wrap;
}

@media (max-width: 767px) {
  .step-actions {
    align-items: stretch;
  }

  .step-actions > .arco-space {
    flex-wrap: wrap;
  }
}
</style>
