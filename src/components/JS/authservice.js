import { ref } from 'vue';

export function usePasswordToggle() {
  const isPasswordVisible = ref(false);

  function togglePasswordVisibility() {
    isPasswordVisible.value = !isPasswordVisible.value;
    if (isPasswordVisible.value) {
      setTimeout(() => {
        isPasswordVisible.value = false;
      }, 2000);
    }
  }

  return {
    isPasswordVisible,
    togglePasswordVisibility,
  };
}