<template>
  <slot
    name="activator"
    :open="openModal"
  >
    <WButton
      v-if="activatorTitle"
      @click="() => { openModal(); emit('click:activator') }"
      v-text="activatorTitle"
    />
  </slot>

  <TransitionRoot
    appear
    :show="isOpen"
    as="template"
  >
    <Dialog
      as="div"
      class="relative z-10"
      :static="confirmModal"
      @close="closeModal"
    >
      <TransitionChild
        v-show="overlay"
        as="template"
        enter="duration-300 ease-out"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="duration-200 ease-in"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-black bg-opacity-25" />
      </TransitionChild>

      <div class="fixed inset-0 overflow-y-auto">
        <div
          class="flex min-h-full items-center justify-center p-4 text-center"
        >
          <TransitionChild
            as="template"
            enter="duration-300 ease-out"
            enter-from="opacity-0 scale-95"
            enter-to="opacity-100 scale-100"
            leave="duration-200 ease-in"
            leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-95"
          >
            <DialogPanel
              class="w-min transform rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all"
            >
              <DialogTitle
                class="flex items-center gap-4 justify-between h2-text-accent-26"
              >
                <slot name="modal-header">
                  <slot name="title">
                    <div
                      :class="modalTitleClass"
                      class="whitespace-nowrap"
                      v-html="titleHtml"
                    />
                  </slot>
                  <div
                    v-if="!confirmModal"
                    class="hover:rotate-90 transition-transform cursor-pointer"
                  >
                    <XIcon
                      class="w-4"
                      @click="closeModal"
                    />
                  </div>
                </slot>
              </DialogTitle>
              <slot
                v-if="mountByModelValue ? modelValue : true"
                :close="closeModal"
                :set-title="setTitle"
              >
                <div class="mt-2">
                  <p class="text-sm text-gray-500">
                    {{ modalDescription }}
                  </p>
                </div>
              </slot>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup lang="ts">
import {
  computed,
  defineComponent,
  onUnmounted,
  PropType,
  ref,
} from "vue"
import { VariantColors, VariantSizes } from "@/composables/variant"
import { useModals } from "@/composables/modals"

// Components
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  TransitionChild,
  TransitionRoot,
} from "@headlessui/vue"
import WButton from "@/components/WButton/index.vue"

// Icons
import XIcon from "@/assets/icons/x.svg?component"

defineComponent({ name: "WModal" })

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: undefined,
  },

  // Activator
  activatorTitle: {
    type: String,
    default: "",
  },

  modalTitle: {
    type: String,
    default: "",
  },
  modalTitleClass: {
    type: String,
    default: "",
  },
  modalDescription: {
    type: String,
    default: "",
  },

  overlay: Boolean,
  confirmModal: Boolean,
  mountByModelValue: Boolean,

  // Visual
  color: {
    type: String as PropType<VariantColors>,
    default: "primary",
  },
  size: {
    type: String as PropType<VariantSizes>,
    default: "base",
  },
})
const emit = defineEmits([
  "click:activator",
  "click:close",
  "update:modelValue",
  "open:modal",
  "close:modal",
])

const titleHtml = ref(props.modalTitle)

const modelValueLocal = ref<boolean>(false)

const isOpen = computed<boolean>({
  get: () => props.modelValue ?? modelValueLocal.value,
  set: (val: boolean) => changeValue(val),
})
const {
  appendModal,
  deleteModal,
} = useModals()
appendModal(isOpen)
onUnmounted(() => {
  deleteModal(isOpen)
})

function changeValue (val: boolean): void {
  modelValueLocal.value = val
  emit("update:modelValue", val)
  emit(val ? "open:modal" : "close:modal")
}

function closeModal (): void {
  changeValue(false)
}

function openModal (): void {
  changeValue(true)
}

function setTitle (title: string): void {
  titleHtml.value = title ?? props.modalTitle
}
</script>
