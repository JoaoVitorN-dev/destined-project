<script setup lang="ts">
import { useRouter } from 'vue-router'
import backArrow from "../../assets/shared/backArrow.svg"

const router = useRouter()
const goBack = () => {
    router.back()
}
</script>

<template>
    <div @click="goBack">
        <back-arrow class="img"/>
    </div>
    
</template>

<style scoped>
 img{
    height: 13px;
    width: 23px;
 }
</style>