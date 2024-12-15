<template>
    <div v-if="isOpen" class="modal-overlay">
        <div class="modal-backdrop" @click="$emit('close')"></div>
        <div class="modal-container">
            <!-- 圖標區域 -->
            <div class="modal-icon" :class="type">
                <template v-if="type === 'success'">
                    <svg class="icon" viewBox="0 0 24 24">
                        <path d="M5 13l4 4L19 7"></path>
                    </svg>
                </template>
                <template v-else-if="type === 'error'">
                    <svg class="icon" viewBox="0 0 24 24">
                        <path d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </template>
                <template v-else>
                    <svg class="icon" viewBox="0 0 24 24">
                        <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                </template>
            </div>
            <!-- 訊息內容 -->
            <div class="modal-content">
                <p>{{ message }}</p>
            </div>
            <!-- 按鈕 -->
            <button class="modal-button" @click="$emit('close')">
                確定
            </button>
        </div>
    </div>
</template>

<script>
export default {
    name: 'SweetModal',
    props: {
        isOpen: {
            type: Boolean,
            default: false
        },
        message: {
            type: String,
            required: true
        },
        type: {
            type: String,
            default: 'info',
            validator: (value) => ['success', 'error', 'info'].includes(value)
        }
    },
    emits: ['close']
}
</script>

<style scoped>
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.modal-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 1001;
}

.modal-container {
    background: white;
    padding: 2rem;
    border-radius: 1rem;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    text-align: center;
    z-index: 1002;
    max-width: 90%;
    width: 320px;
    animation: modal-pop 0.3s ease-out;
    will-change: transform, opacity;
    backface-visibility: hidden;
    transform: translateZ(0);
}

.modal-icon {
    width: 64px;
    height: 64px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 1rem;
}

.modal-icon.success {
    background-color: #d4edda;
}

.modal-icon.success .icon {
    stroke: #28a745;
}

.modal-icon.error {
    background-color: #f8d7da;
}

.modal-icon.error .icon {
    stroke: #dc3545;
}

.modal-icon.info {
    background-color: #cce5ff;
}

.modal-icon.info .icon {
    stroke: #0dcaf0;
}

.icon {
    width: 32px;
    height: 32px;
    fill: none;
    stroke-width: 2;
    stroke-linecap: round;
    stroke-linejoin: round;
}

.modal-content {
    margin: 1rem 0;
    font-size: 1.1rem;
    color: #333;
}

.modal-button {
    background-color: #76caad;
    color: white;
    border: none;
    padding: 0.5rem 2rem;
    border-radius: 2rem;
    font-size: 1rem;
    cursor: pointer;
    transition: background-color 0.2s;
}

.modal-button:hover {
    background-color: #5bb89b;
}

@keyframes modal-pop {
    0% {
        transform: scale(0.9);
        opacity: 0;
    }
    100% {
        transform: scale(1);
        opacity: 1;
    }
}
</style>