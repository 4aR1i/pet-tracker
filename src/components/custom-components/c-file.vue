<template>
  <div class="photo-upload" @click="pickFile">
    <input ref="fileRef" type="file" accept="image/*" @change="handleFileChange" />
    <q-avatar size="150px" class="cursor-pointer relative-position">
      <img v-if="previewUrl" :src="previewUrl" />
      <div v-else class="bg-grey-3 flex flex-center full-width full-height text-center">
        <q-icon name="photo_camera" size="30px" color="grey" />
      </div>
    </q-avatar>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

const props = defineProps<{
  modelValue?: string;
}>();
const emit = defineEmits<{
  (e: 'update:modelValue', payload: string): void;
}>();

const fileRef = ref<HTMLInputElement>();
const selectedFile = ref<File | undefined>();
const previewUrl = ref<string | undefined>(props.modelValue);

const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files.length > 0) {
    const file = target.files[0];

    if (file) {
      selectedFile.value = file;

      const reader = new FileReader();
      reader.onload = (e) => {
        previewUrl.value = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  }
};

const pickFile = () => {
  fileRef.value?.click();
};

watch(previewUrl, (v) => {
  if (!v) return;
  emit('update:modelValue', v);
});
</script>

<style lang="scss" scoped>
.photo-upload {
  width: 150px;
  height: 150px;
  overflow: hidden;
  border-radius: 50%;
  background-color: #ffffff;
  cursor: pointer;

  & input {
    display: none;
  }

  &_preview {
    width: 100%;
    height: 100%;

    & img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }
  }
}
</style>
