<script setup lang="ts">
import { reactive, ref } from "vue"
import type { FieldRule, FormInstance } from "@arco-design/web-vue"
import team from "@ui-gallery/spec/mock/team.json"
import PageHeader from "@/components/PageHeader.vue"
import { Icon } from "@/lib/icons"

const step = ref(1)
const submitting = ref(false)
const done = ref(false)
const formRef = ref<FormInstance>()

const form = reactive({
  name: "",
  slug: "",
  description: "",
  type: "web",
  visibility: "private",
  region: "cn-shanghai",
  members: [] as string[],
  tags: [] as string[],
  budget: 5000,
  notify: true,
  deadline: "",
  agree: false,
})

const rules: Record<string, FieldRule[]> = {
  name: [{ required: true, message: "请输入项目名称" }, { minLength: 2, maxLength: 30, message: "2–30 个字符" }],
  slug: [{ required: true, message: "请输入项目标识" }, { match: /^[a-z0-9-]+$/, message: "仅允许小写字母、数字与连字符" }],
  description: [{ maxLength: 200, message: "最多 200 字" }],
  region: [{ required: true, message: "请选择地区" }],
  members: [{ type: "array", minLength: 1, message: "至少添加一位成员" }],
  deadline: [{ required: true, message: "请选择截止日期" }],
  agree: [{ type: "boolean", true: true, message: "请先同意服务条款" }],
}

const stepFields: Record<number, string[]> = {
  1: ["name", "slug", "description"],
  2: ["region", "members", "deadline"],
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
        <a-steps :current="step" size="small" style="margin-bottom: 32px" label-placement="vertical">
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
            <a-form-item field="description" label="描述">
              <a-textarea v-model="form.description" placeholder="简要描述项目目标…" :max-length="200" show-word-limit :auto-size="{ minRows: 3 }" />
            </a-form-item>
            <a-form-item field="type" label="项目类型">
              <a-radio-group v-model="form.type">
                <a-radio value="web">Web</a-radio>
                <a-radio value="mobile">移动端</a-radio>
                <a-radio value="api">API</a-radio>
              </a-radio-group>
            </a-form-item>
          </div>

          <div v-show="step === 2" class="stack" style="gap: 0">
            <div class="grid grid-2" style="gap: 0 16px">
              <a-form-item field="region" label="地区">
                <a-select v-model="form.region" placeholder="选择地区">
                  <a-option value="cn-shanghai">华东（上海）</a-option>
                  <a-option value="cn-beijing">华北（北京）</a-option>
                  <a-option value="ap-singapore">亚太（新加坡）</a-option>
                </a-select>
              </a-form-item>
              <a-form-item field="deadline" label="截止日期">
                <a-date-picker v-model="form.deadline" style="width: 100%" />
              </a-form-item>
            </div>
            <a-form-item field="members" label="项目成员">
              <a-select v-model="form.members" multiple placeholder="添加成员" allow-clear>
                <a-option v-for="member in team" :key="member.name" :value="member.name">
                  <a-space size="small">
                    <a-avatar :size="20">{{ member.name.slice(0, 1) }}</a-avatar>
                    {{ member.name }} <span class="muted small">{{ member.role }}</span>
                  </a-space>
                </a-option>
              </a-select>
            </a-form-item>
            <a-form-item field="tags" label="标签">
              <a-input-tag v-model="form.tags" placeholder="回车添加标签" allow-clear />
            </a-form-item>
            <a-form-item field="budget" label="预算（元）">
              <a-space direction="vertical" fill>
                <a-slider v-model="form.budget" :min="0" :max="50000" :step="500" show-input />
              </a-space>
            </a-form-item>
            <a-form-item field="visibility" label="可见性">
              <a-radio-group v-model="form.visibility" type="button">
                <a-radio value="private">私有</a-radio>
                <a-radio value="team">团队</a-radio>
                <a-radio value="public">公开</a-radio>
              </a-radio-group>
            </a-form-item>
            <a-form-item field="notify" label="通知">
              <a-switch v-model="form.notify" /><span class="muted small" style="margin-left: 8px">创建后通知所有成员</span>
            </a-form-item>
          </div>

          <div v-show="step === 3" class="stack">
            <a-alert type="info">请核对以下信息，提交后仍可在设置中修改。</a-alert>
            <a-descriptions :column="{ xs: 1, md: 2 }" bordered>
              <a-descriptions-item label="项目名称">{{ form.name || "—" }}</a-descriptions-item>
              <a-descriptions-item label="标识">acme.dev/{{ form.slug || "—" }}</a-descriptions-item>
              <a-descriptions-item label="类型">{{ form.type }}</a-descriptions-item>
              <a-descriptions-item label="地区">{{ form.region }}</a-descriptions-item>
              <a-descriptions-item label="截止日期">{{ form.deadline || "—" }}</a-descriptions-item>
              <a-descriptions-item label="预算">¥{{ form.budget.toLocaleString() }}</a-descriptions-item>
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
            </a-descriptions>
            <a-form-item field="agree" hide-label>
              <a-checkbox v-model="form.agree">我已阅读并同意 <a-link>服务条款</a-link></a-checkbox>
            </a-form-item>
          </div>
        </a-form>

        <div class="between" style="margin-top: 24px">
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
  max-width: 860px;
}
</style>
