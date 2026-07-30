<template>
  <div class="field">
    <label :for="id">{{ label }}<span v-if="required" class="required"> *</span></label>
    <input
      v-if="type === 'text' || type === 'password'"
      :id="id"
      :type="type"
      :value="modelValue"
      :maxlength="maxlength"
      @input="$emit('update:modelValue', $event.target.value)"
    />
    <textarea
      v-else-if="type === 'textarea'"
      :id="id"
      :value="modelValue"
      :maxlength="maxlength"
      :rows="rows"
      @input="$emit('update:modelValue', $event.target.value)"
    />
    <select
      v-else-if="type === 'select'"
      :id="id"
      :value="modelValue"
      @change="$emit('update:modelValue', $event.target.value)"
    >
      <option value="">{{ placeholder }}</option>
      <option v-for="option in options" :key="option.value" :value="option.value">
        {{ option.label }}
      </option>
    </select>
    <small v-if="error" class="error">{{ error }}</small>
  </div>
</template>

<script setup>
defineProps({
  id: { type: String, required: true },
  label: { type: String, required: true },
  modelValue: { type: [String, Number], default: '' },
  type: { type: String, default: 'text' },
  required: { type: Boolean, default: false },
  maxlength: { type: Number, default: null },
  rows: { type: Number, default: 4 },
  placeholder: { type: String, default: 'Sélectionner' },
  options: { type: Array, default: () => [] },
  error: { type: String, default: '' },
})

defineEmits(['update:modelValue'])
</script>

<style scoped src="../styles/FormField.css"></style>
