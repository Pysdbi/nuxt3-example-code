<template>
  <div class="pt-4 h-full w-full overflow-hidden flex flex-col">
    <div class="px-4 h-full w-full overflow-y-auto flex flex-col gap-4 max-w-[800px]">
      <template v-if="packageMode === 'create' || packageMode === 'edit'">
        <MSettingsPackagesPackageEditCard
          v-model:parent="packageParent"
          v-model:subjects="packageSubjects"
          :categories-items="parentsItems"
          :subcategories-items="subjectsItems"
          :mode="packageMode"
          show-tips
        />
      </template>
      <template v-else>
        <div class="h3-text-med-20">
          Категория товаров <span class="text-pink">{{ originalPackage?.parentName }}</span>
        </div>
        <div class="flex flex-col gap-2">
          <div class="h3-text-med-20 text-grey">
            Подкатегории товаров
          </div>
          <div
            v-for="subject in originalPackage?.subjects"
            :key="subject.subjectId"
            class="px-4 py-3 bg-light-blue b1-text-reg-16 rounded-lg"
            v-text="subject.subjectName"
          />
        </div>
      </template>
    </div>
    <div class="bg-light-blue p-4 flex gap-4">
      <template v-if="packageMode === 'create'">
        <WButton
          class="w-full"
          size="lg"
          :disabled="!packageParent"
          @click="createPackageWB"
        >
          {{ t('add') }}
        </WButton>
        <WButton
          outlined
          size="lg"
          class="w-full"
          @click="navigateBack"
        >
          {{ t('cancel') }}
        </WButton>
      </template>
      <template v-if="packageMode === 'edit'">
        <WButton
          class="w-full"
          size="lg"
          @click="updatePackage"
        >
          {{ t('save') }}
        </WButton>
        <WButton
          outlined
          size="lg"
          class="w-full"
          @click="toggleEditMode"
        >
          {{ t('cancel') }}
        </WButton>
      </template>
      <template v-if="packageMode === 'view'">
        <WButton
          class="w-full"
          size="lg"
          @click="toggleEditMode"
        >
          {{ t('edit') }}
        </WButton>
        <WButton
          outlined
          size="lg"
          class="w-full"
          @click="deletePackage"
        >
          {{ t('delete') }}
        </WButton>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, defineComponent, ref, watch } from "vue"
import { useLocal } from "@/composables/locale"
import { useStateHeader } from "@/composables/stateHeader"
import { navigateTo, useAlerts, useRoute } from "#imports"
import { useBooleanRef } from "@/util"
import { Package, PackageParent, PackageSubject, usePackagesWBStore } from "@/store/settings/packages/wb"
import { cloneDeep, pick } from "lodash-es"
import { useToast } from "vue-toastification"
import MSettingsPackagesPackageEditCard from "@/components/molecules/SettingsPackages/PackageEditCard.vue"

defineComponent({ name: "SettingsPackagesWBPackage" })

const _paramsId = Number(useRoute().params?.id)
const parentId = isNaN(_paramsId) ? undefined : _paramsId

const [ editMode, toggleEditMode ] = useBooleanRef(!parentId)

const { t } = useLocal()
const {
  setPageTitle,
  setNavigateBack,
} = useStateHeader()

const packageMode = computed<"create" | "edit" | "view">(() => {
  if (parentId === undefined) return "create"
  if (editMode.value) return "edit"
  return "view"
})

const navigateBack = async (): Promise<void> => {
  await navigateTo("/settings/packages/wb")
}
setPageTitle(() => {
  const spanID = parentId !== undefined ? `<span class="ml-2 text-grey">ID: ${parentId}</span>` : ""
  return [ t(`pages.settings.packages.wb.package.${packageMode.value}`), spanID ].join("")
})
setNavigateBack(navigateBack)

const packagesWBStore = usePackagesWBStore()

const originalPackage = ref<Package>()

async function getPackage (): Promise<void> {
  if (parentId !== undefined) {
    originalPackage.value = await packagesWBStore.getPackage(parentId)
    if (originalPackage.value === undefined) {
      useAlerts().error("Упаковка не найдена")
      await navigateBack()
    }
  }
}

await getPackage()

const parentsItems = ref()
const subjectsItems = ref()

parentsItems.value = await packagesWBStore.getParents({ wb: true }) ?? []
if (parentId !== undefined) {
  subjectsItems.value = await packagesWBStore.getSubjects(parentId) ?? []
}

const getParentFromPackage = (): PackageParent | undefined => originalPackage.value
  ? cloneDeep(pick(originalPackage.value, [ "parentId", "parentName" ])) as PackageParent
  : undefined
const getSubjectsFromPackage = (): Array<PackageSubject | null> => originalPackage.value?.subjects ?? []

const packageParent = ref(getParentFromPackage())
const packageSubjects = ref(getSubjectsFromPackage())

watch(packageParent, (pkg: PackageParent | undefined) => {
  if (pkg === undefined) return
  if (!packageSubjects.value.length) packageSubjects.value = [ null ]
  void packagesWBStore.getSubjects(pkg.parentId).then(res => (subjectsItems.value = res))
}, { deep: true })

watch(packageMode, () => {
  packageParent.value = getParentFromPackage()
  packageSubjects.value = getSubjectsFromPackage()
})

// === Actions ===
// Create
const createPackageWB = async (): Promise<void> => {
  const categoryId = packageParent.value?.parentId
  const subcategoryIds = packageSubjects.value.map(x => x?.subjectId).filter(x => x !== undefined)
  if (categoryId === undefined) return
  const { error } = await packagesWBStore.createPackage({
    parentId: categoryId,
    subjectIds: subcategoryIds as number[],
  })
  if (error) {
    useAlerts().error(error)
  }
  else {
    useToast().success("Упаковка создана")
    await navigateBack()
  }
}
// UPDATE
const updatePackage = async (): Promise<void> => {
  const { onYes } = useAlerts().question("Сохранить изменения?")
  onYes(async () => {
    const categoryId = packageParent.value?.parentId
    const subcategoryIds = packageSubjects.value.map(x => x?.subjectId).filter(x => x !== undefined)

    if (categoryId === undefined) return
    const { error } = await packagesWBStore.updatePackage({
      parentId: categoryId,
      subjectIds: subcategoryIds as number[],
    })
    if (error) {
      useAlerts().error(error)
    }
    else {
      await getPackage()
      useToast().success("Упаковка изменена успешно")
      toggleEditMode()
    }
  })
}
// DELETE
const deletePackage = async (): Promise<void> => {
  const { onYes } = useAlerts().question("Удалить упаковку?")
  onYes(async () => {
    if (parentId === undefined) return
    await packagesWBStore.deletePackage(parentId)
    useToast().success("Упаковка удалена")
    await navigateBack()
  })
}
</script>
