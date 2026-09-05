<script setup lang="ts">
import { ref } from "vue"
import { message } from "ant-design-vue"
const current = ref(0)
const form = ref()
const model = ref({ name: "", count: 1, email: "", phone: "", bio: "", type: "team", options: ["通知"], enabled: true, plan: "pro", tags: [] })
const submitted = ref(false)
const rules = { name: [{ required: true, message: "请输入项目名称" }], email: [{ required: true, type: "email", message: "请输入有效邮箱" }], count: [{ required: true, type: "number", min: 1, max: 100, message: "数量范围 1-100" }] }
async function next() { if (current.value === 0) { try { await form.value.validate(); current.value++ } catch { /* form displays field errors */ } } else current.value++ }
function submit() { submitted.value = true; message.success("项目创建成功") }
</script>
<template>
  <div class="page">
    <a-card><a-steps :current="current"><a-step title="基本信息" /><a-step title="详细配置" /><a-step title="确认提交" /></a-steps></a-card>
    <a-card class="section">
      <a-result v-if="submitted" status="success" title="项目创建成功" sub-title="你的项目已进入工作区。"><template #extra><a-button type="primary" @click="submitted = false; current = 0">创建另一个</a-button></template></a-result>
      <a-form v-else ref="form" :model="model" :rules="rules" layout="vertical">
        <template v-if="current === 0"><a-form-item label="项目名称" name="name" required><a-input v-model:value="model.name" placeholder="例如：Q3 发布计划" /></a-form-item><a-form-item label="席位数量" name="count"><a-input-number v-model:value="model.count" :min="1" :max="100" style="width:100%" /></a-form-item><a-form-item label="负责人邮箱" name="email"><a-input v-model:value="model.email" /></a-form-item><a-form-item label="联系电话"><a-input v-model:value="model.phone"><template #addonBefore><a-select default-value="+86" style="width:80px"><a-select-option value="+86">+86</a-select-option><a-select-option value="+1">+1</a-select-option></a-select></template></a-input></a-form-item><a-form-item label="项目说明"><a-textarea v-model:value="model.bio" :maxlength="200" show-count :rows="4" /></a-form-item><a-form-item label="项目类型"><a-radio-group v-model:value="model.type"><a-radio value="team">团队</a-radio><a-radio value="personal">个人</a-radio><a-radio value="enterprise">企业</a-radio></a-radio-group></a-form-item><a-form-item label="通知偏好"><a-checkbox-group v-model:value="model.options" :options="['通知', '周报', '营销']" /></a-form-item><a-form-item label="启用自动化"><a-switch v-model:checked="model.enabled" /></a-form-item></template>
        <template v-else-if="current === 1"><div class="form-grid"><a-form-item label="计划"><a-select v-model:value="model.plan"><a-select-option value="starter">Starter</a-select-option><a-select-option value="pro">Pro</a-select-option><a-select-option value="enterprise">Enterprise</a-select-option></a-select></a-form-item><a-form-item label="标签"><a-select v-model:value="model.tags" mode="tags" /></a-form-item><a-form-item label="自动完成"><a-auto-complete placeholder="输入关键字" /></a-form-item><a-form-item label="日期"><a-date-picker style="width:100%" /></a-form-item><a-form-item label="时间"><a-time-picker style="width:100%" /></a-form-item><a-form-item label="日期范围"><a-range-picker /></a-form-item><a-form-item label="优先级"><a-slider range :default-value="[20, 80]" /></a-form-item><a-form-item label="评分"><a-rate /></a-form-item><a-form-item label="颜色（composed）"><a-input addon-before="Color" type="color" /></a-form-item></div><a-form-item label="上传文件"><a-upload-dragger><p>拖拽文件到这里，或点击上传</p><p class="muted">支持常见文档格式</p></a-upload-dragger></a-form-item></template>
        <template v-else><a-descriptions bordered :column="1"><a-descriptions-item label="项目名称">{{ model.name || "未填写" }}</a-descriptions-item><a-descriptions-item label="负责人邮箱">{{ model.email || "未填写" }}</a-descriptions-item><a-descriptions-item label="计划">{{ model.plan }}</a-descriptions-item><a-descriptions-item label="自动化">{{ model.enabled ? "已启用" : "已关闭" }}</a-descriptions-item></a-descriptions><a-checkbox class="section">我已确认以上信息</a-checkbox></template>
        <div class="form-actions"><a-button v-if="current > 0" @click="current--">上一步</a-button><a-button v-if="current < 2" type="primary" @click="next">下一步</a-button><a-button v-else type="primary" @click="submit">提交项目</a-button></div>
      </a-form>
    </a-card>
  </div>
</template>
<style scoped>.form-grid { display:grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 0 18px; }.form-actions { display:flex; justify-content:flex-end; gap: 10px; margin-top: 24px; } @media (max-width: 600px) { .form-grid { grid-template-columns: 1fr; } }</style>
