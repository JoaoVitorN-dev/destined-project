<script setup lang="ts">
// Recebe props `type` e `placeholder` com valores padrão
const props = withDefaults(defineProps<{
  type?: string;
  placeholder?: string;
  modelValue?: string;
}>(), {
  type: 'email',
  placeholder: 'E-mail',
  modelValue: ''
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
}>();

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  emit('update:modelValue', target.value);
};
</script>

<template>
  <div class="input-gradient-wrap">
    <input 
      class="inner-input" 
      :type="props.type" 
      :placeholder="props.placeholder"
      :value="props.modelValue"
      @input="handleInput"
    />
  </div>
</template>

<style scoped>
.input-gradient-wrap {
  display: inline-block;
  padding: 2px; 
  border-radius: 16px; 
  background: linear-gradient(90deg, #C53E8D, #8A52F3);
  margin-bottom: 12px;
}
.input-gradient-wrap:focus-within {
  box-shadow: 0 0 0 4px rgba(138,82,243,0.12);
}
.inner-input {
  display: block;
  width: 280px;
  border: none;
  outline: none;
  border-radius: 13px; 
  padding: 10px 12px;
  background: #03000C;
  box-sizing: border-box;
  color: #FFFFFF;
}
</style>