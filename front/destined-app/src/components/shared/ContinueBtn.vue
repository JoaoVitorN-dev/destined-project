<script setup lang="ts">
defineProps<{
  disabled?: boolean;
}>();
</script>

<template>
    <button class="btn-container" :disabled="disabled">
        <div class="btn-text">
          <slot>Continue</slot>
        </div>
    </button>

</template>

<style scoped>
    .btn-container{
        display: flex;
        align-items: center;
        justify-content: center;
        background-image: linear-gradient(to right, #DD3562, #8354FF);
        padding: 14px 42px;
        border-radius: 24px;
        border: none;
        cursor: pointer;
        transition: all 0.3s ease;
    }

    .btn-container:hover:not(:disabled) {
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(131, 84, 255, 0.4);
    }

    .btn-container:active:not(:disabled) {
        transform: translateY(0);
    }

    .btn-container:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }

    .btn-text{
        color: #FFF;
        font-size: 18px;
        font-weight: 600;
    }
</style>