<template>
  <div class="flex gap-4">
    <WSelect
      v-model="category"
      class="flex-[4]"
      activator-title="Категория товаров"
      :items="categoriesItems"
      item-title="parentName"
      :by="(a, z) => (a?.parentId === z?.parentId)"
      :disabled-by="(x) => x.isUsed"
      group-by-key="isUsed"
      :group-by-labels="{
        false: 'Доступно',
        true: 'Недоступно',
      }"
      :disabled="mode === 'edit'"
      @change="changeCategory"
    />
    <div
      v-if="showTips"
      class="flex-[3] text-grey"
    >
      <template v-if="mode === 'create'">
        Укажите категорию товаров, которые требуют упаковки
      </template>
    </div>
  </div>

  <div class="border-b border-grey" />

  <div>
    <div
      v-if="category && !subcategories.filter(x => x).length"
      class="text-pink mb-2"
    >
      Сейчас выбраны все подкатегории.
    </div>

    <div class="flex gap-4">
      <div class="flex-[4] flex flex-col gap-4">
        <div
          v-for="(subject, idx) in subcategories"
          :key="subject?.subjectName ?? idx"
          class="flex flex-col gap-4"
        >
          <WSelect
            v-model="subcategories[idx]"
            activator-title="Подкатегория товаров"
            :items="subcategoriesItemsFiltered"
            item-title="subjectName"
            :by="(a, z) => (a?.subjectId === z?.subjectId)"
            :disabled="!category"
            clearable
            @click:clear="() => clickClear(subject?.subjectId)"
          />
        </div>
      </div>
      <div
        v-if="showTips"
        class="flex-[3] text-grey"
      >
        Укажите подкатегорию или укажите несколько подкатегорий
      </div>
    </div>
  </div>
  <div class="mb-4">
    <WButton
      text
      class="px-0"
      :disabled="!category"
      @click="subcategories.push(null)"
    >
      <PlusIcon class="inline w-5" />
      Добавить ещё подкатегорию
    </WButton>
  </div>
</template>

<script setup lang="ts">
import {
  computed,
  defineComponent,
  PropType,
  ref,
  watch,
} from "vue"
import PlusIcon from "@/assets/icons/plus.svg?component"
import { PackageParent, PackageSubject } from "@/store/settings/packages/wb"

defineComponent({ name: "MSettingsPackagesPackageEditCard" })

const props = defineProps({
  parent: {
    type: Object as PropType<Partial<PackageParent> | null>,
    default: undefined,
  },
  subjects: {
    type: Array as PropType<Array<PackageSubject | null>>,
    default: undefined,
  },
  categoriesItems: {
    type: Array,
    default: () => [],
  },
  subcategoriesItems: {
    type: Array,
    default: () => [],
  },
  showTips: Boolean,

  mode: {
    type: String as PropType<"create" | "edit" | "view">,
    default: undefined,
  },
})
const emit = defineEmits([ "update:parent", "update:subjects" ])

const category = computed({
  get: () => props.parent,
  set: (val: any) => emit("update:parent", val),
})
const subcategories = ref<Array<PackageSubject | null>>([])
// subcategories GET
watch(() => props.subjects, (val) => {
  subcategories.value = (val?.length ? val : [ null ]) as PackageSubject[]
}, {
  deep: true,
  immediate: true,
})
// subcategories SET
watch(subcategories, (val, prev) => {
  if (val === prev) return
  emit("update:subjects", val)
}, { deep: true })

const subcategoriesItemsFiltered = computed(() =>
  props.subcategoriesItems.filter((x: any) =>
    !subcategories.value
      ?.map(y => y?.subjectId)
      .filter(y => y)
      .includes(x.subjectId),
  ),
)

function clickClear (subjectId?: number): void {
  if (subjectId === undefined) return
  subcategories.value = subcategories.value.filter(x => x?.subjectId !== subjectId)
}

function changeCategory (): void {
  emit("update:subjects", [ null ])
}
</script>
