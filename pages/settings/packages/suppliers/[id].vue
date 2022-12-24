<template>
  <div class="pt-4 h-full w-full overflow-hidden flex flex-col">
    <div class="h-full w-full overflow-y-auto flex flex-col gap-4">
      <div class="px-4">
        <template v-if="supplierMode === 'create'">
          <WSelect
            v-model="selectedSupplier"
            :activator-title="t('pages.settings.packages.suppliers.select-supplier')"
            :items="suppliersItems"
            item-title="supplierName"
            :disabled-by="(x) => x.isUsed"
            group-by-key="isUsed"
            :group-by-labels="{
              false: 'Доступно',
              true: 'Недоступно',
            }"
            enable-search
          />
        </template>
        <template v-else>
          <div class="h3-text-med-20">
            {{ t('pages.settings.packages.suppliers.supplier') }}
            <span class="text-pink">{{ supplier?.supplierName }}</span>
          </div>
        </template>
      </div>
      <WTable
        can-click-row
        enable-column-resizing
        hidden-filters
        hidden-sorting
        :rows="supplierPackages"
        :columns="columns"
        :loading="loading"
        :no-data-text="t('pages.settings.packages.suppliers.add-package-table')"
        @click:row="openPackage"
      >
        <template #prepend-search>
          <WButton
            size="xl"
            class="whitespace-nowrap"
            @click="openPackage"
          >
            <PlusIcon class="w-6 inline-block" />
            {{ t('pages.settings.packages.suppliers.add-package') }}
          </WButton>
        </template>
        <template #cell-subjects="{ cell }">
          {{ cell.map(x => x?.subjectName ?? x).join(', ') || 'Все товары' }}
        </template>
      </WTable>
    </div>
    <div class="bg-light-blue p-4 flex gap-4">
      <template v-if="supplierMode === 'create'">
        <WButton
          class="w-full"
          size="lg"
          :disabled="!selectedSupplier"
          @click="createSupplier"
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
      <template v-if="supplierMode === 'view'">
        <div class="w-full" />
        <WButton
          outlined
          size="lg"
          class="w-full"
          @click="deleteSupplier"
        >
          {{ t('delete') }}
        </WButton>
      </template>
    </div>
    <!-- Package -->
    <WModal
      v-slot="{ close }"
      v-model="showPackageModal"
      overlay
      :modal-title="t('pages.settings.packages.title')"
    >
      <div class="mt-4 flex flex-col gap-4 max-h-96 w-[320px] overflow-y-auto">
        <MSettingsPackagesPackageEditCard
          v-model:parent="currentPackage.parent"
          v-model:subjects="currentPackage.subjects"
          :categories-items="parentsItemsFiltered"
          :subcategories-items="subjectsItems"
          :mode="isCreatePackageModal ? 'create' : 'edit'"
        />
      </div>
      <div class="flex gap-4">
        <template v-if="isCreatePackageModal">
          <WButton
            v-if="isCreatePackageModal"
            class="w-full"
            :disabled="!currentPackage.parent"
            @click="createPackage"
          >
            {{ t('add') }}
          </WButton>
          <WButton
            outlined
            class="w-full"
            @click="close"
          >
            {{ t('cancel') }}
          </WButton>
        </template>
        <template v-else>
          <WButton
            class="w-full"
            @click="updatePackage"
          >
            {{ t('save') }}
          </WButton>
          <WButton
            outlined
            class="w-full"
            @click="deletePackage"
          >
            {{ t('delete') }}
          </WButton>
        </template>
      </div>
    </WModal>
  </div>
</template>

<script setup lang="ts">
import { computed, defineComponent, ref, watch } from "vue"
import { useLocal } from "@/composables/locale"
import { useStateHeader } from "@/composables/stateHeader"
import { navigateTo, useAlerts, useRoute } from "#imports"
import { booleanRef } from "@/util"
import { Supplier, SupplierInfo, usePackagesSuppliersStore } from "@/store/settings/packages/suppliers"
import { Cell } from "@tanstack/vue-table"
import PlusIcon from "@/assets/icons/plus.svg?component"
import MSettingsPackagesPackageEditCard from "@/components/molecules/SettingsPackages/PackageEditCard.vue"
import { ClickItem } from "@/components/WTable/types"
import { Package, PackageParent, PackageSubject, usePackagesWBStore } from "@/store/settings/packages/wb"
import { cloneDeep, pick } from "lodash-es"
import { storeToRefs } from "pinia"
import { useToast } from "vue-toastification"

defineComponent({ name: "SettingsPackagesSuppliersSupplier" })

const _paramsId = Number(useRoute().params?.id)
const supplierId = isNaN(_paramsId) ? undefined : _paramsId

// const [ editMode, toggleEditMode ] = useBooleanRef(!supplierId)
const {
  value: showPackageModal,
  toggle: togglePackageModal,
} = booleanRef(false)

const { t } = useLocal()
const {
  setPageTitle,
  setNavigateBack,
} = useStateHeader()

const supplierMode = computed<"create" | "view">(() => {
  if (supplierId === undefined) return "create"
  return "view"
})

const navigateBack = async (): Promise<void> => {
  await navigateTo("/settings/packages/suppliers")
}
setPageTitle(() => {
  const spanID = supplierId !== undefined ? `<span class="ml-2 text-grey">ID: ${supplierId}</span>` : ""
  return [ t(`pages.settings.packages.suppliers.mode.${supplierMode.value}`), spanID ].join("")
})
setNavigateBack(navigateBack)

const columns = {
  parentName: {
    size: 180,
    header: t("pages.settings.columns.packages.wb.parentName"),
  },
  subjects: {
    size: 300,
    cell: (v: Cell<any, any>) => [ ...v.getValue() ].map(x => x.subjectName).join(", ") || "Все товары",
    header: t("pages.settings.columns.packages.wb.subjects"),
  },
}

const packagesSuppliersStore = usePackagesSuppliersStore()
const {
  loading,
  suppliersItems,
} = storeToRefs(packagesSuppliersStore)
const supplierPackages = computed(() =>
  supplierMode.value === "create"
    ? selectedSupplierPackages.value
    : supplier.value?.packages,
)

// === Supplier for Create ===
const selectedSupplier = ref<Partial<Supplier>>()
void packagesSuppliersStore.getSuppliersItems({ wb: true })

const supplier = ref<SupplierInfo>()
const selectedSupplierPackages = ref<Package[]>([])

// === Init ===
async function getSupplier (): Promise<void> {
  if (supplierId !== undefined) {
    supplier.value = await packagesSuppliersStore.getSupplier(supplierId)
    if (supplier.value === undefined) {
      useAlerts().error("Поставщик не найден")
      await navigateBack()
    }
  }
}

await getSupplier()

// === Packages ===
const packagesWBStore = usePackagesWBStore()
const parentsItems = ref()
const subjectsItems = ref()
type CurrentPackage = {
  parent: PackageParent | null
  subjects: Array<PackageSubject | null>
}
const currentPackage = ref<CurrentPackage>({
  parent: null,
  subjects: [],
})
const isCreatePackageModal = ref(false)

parentsItems.value = await packagesWBStore.getParents() ?? []
const parentsItemsFiltered = computed(() =>
  parentsItems.value.filter((x: any) =>
    !supplierPackages.value
      ?.map(y => y?.parentId)
      .filter(y => y)
      .includes(x.parentId),
  ),
)
watch(() => currentPackage.value.parent?.parentId, (val: number | null | undefined) => {
  if (val === undefined || val === null) return
  if (!currentPackage.value.subjects.length) currentPackage.value.subjects = [ null ]
  void packagesWBStore.getSubjects(val).then(res => (subjectsItems.value = res))
})

const openPackage = (row?: ClickItem): void => {
  isCreatePackageModal.value = row === undefined
  if (row !== undefined) {
    currentPackage.value = cloneDeep({
      parent: pick(row.data, [ "parentId", "parentName" ]),
      subjects: row.data.subjects,
    })
  }
  else {
    currentPackage.value = {
      parent: null,
      subjects: [],
    }
  }
  togglePackageModal()
}

type ReturnGetCurrentPackageFormatted = {
  supplierId: number
  categoryId: number
  subcategoryIds: number[]
} | undefined

function getCurrentPackageFormatted (): ReturnGetCurrentPackageFormatted {
  const _supplierId = supplierMode.value === "create" ? selectedSupplier.value?.supplierId : supplierId
  if (_supplierId === undefined) return
  const categoryId = currentPackage.value.parent?.parentId
  const subcategoryIds = currentPackage.value.subjects.map(x => x?.subjectId).filter(x => x !== undefined) as number[]

  if (categoryId === undefined) return
  return {
    supplierId: _supplierId,
    categoryId,
    subcategoryIds,
  }
}

// ====== Actions ======
// Create
const createSupplier = async (): Promise<void> => {
  const { onYes } = useAlerts().question(t("pages.settings.packages.suppliers.create-supplier.question"))
  onYes(async () => {
    if (selectedSupplier.value?.supplierId === undefined) return
    const { error } = await packagesSuppliersStore.createSupplier(
      selectedSupplier.value.supplierId,
      selectedSupplierPackages.value.map(pkg => ({
        parentId: pkg.parentId,
        subjectIds: pkg.subjects.map(x => x?.subjectId).filter(x => x !== undefined),
      })),
    )
    if (error) {
      useAlerts().error(error)
    }
    else {
      useToast().success(t("pages.settings.packages.suppliers.create-supplier.success"))
      await navigateBack()
    }
  })
}

const createPackageLocal = (): void => {
  selectedSupplierPackages.value = [
    ...selectedSupplierPackages.value,
    cloneDeep({
      ...currentPackage.value.parent,
      subjects: currentPackage.value.subjects,
    }) as Package,
  ]
  togglePackageModal()
}
const createPackage = async (): Promise<void> => {
  if (supplierMode.value === "create") {
    createPackageLocal()
    return
  }
  const { onYes } = useAlerts().question(t("pages.settings.packages.suppliers.create-package.question"))
  onYes(async () => {
    const formattedPackage = getCurrentPackageFormatted()
    if (formattedPackage === undefined) return

    const { error } = await packagesSuppliersStore.createPackage(formattedPackage.supplierId, {
      parentId: formattedPackage.categoryId,
      subjectIds: formattedPackage.subcategoryIds,
    })
    if (error) {
      useAlerts().error(error)
    }
    else {
      await getSupplier()
      useToast().success(t("pages.settings.packages.suppliers.create-package.success"))
      togglePackageModal()
    }
  })
}
// Update
const updatePackageLocal = (): void => {
  selectedSupplierPackages.value = [
    ...selectedSupplierPackages.value.filter(x => x.parentId !== currentPackage.value.parent?.parentId),
    cloneDeep({
      ...currentPackage.value.parent,
      subjects: currentPackage.value.subjects,
    }) as Package,
  ]
  togglePackageModal()
}
const updatePackage = async (): Promise<void> => {
  if (supplierMode.value === "create") {
    updatePackageLocal()
    return
  }
  const { onYes } = useAlerts().question(t("pages.settings.packages.suppliers.update-package.question"))
  onYes(async () => {
    const formattedPackage = getCurrentPackageFormatted()
    if (formattedPackage === undefined) return

    const { error } = await packagesSuppliersStore.updatePackage(formattedPackage.supplierId, {
      parentId: formattedPackage.categoryId,
      subjectIds: formattedPackage.subcategoryIds,
    })
    if (error) {
      useAlerts().error(error)
    }
    else {
      await getSupplier()
      useToast().success(t("pages.settings.packages.suppliers.update-package.success"))
      togglePackageModal()
    }
  })
}
// DELETE
const deleteSupplier = async (): Promise<void> => {
  const { onYes } = useAlerts().question(t("pages.settings.packages.suppliers.delete-supplier.question"))
  onYes(async () => {
    if (supplierId === undefined) return
    await packagesSuppliersStore.deleteSupplier(supplierId)
    useToast().success("Поставщик удален")
    await navigateBack()
  })
}
const deletePackage = async (): Promise<void> => {
  const parentId = currentPackage.value.parent?.parentId

  if (supplierMode.value === "create") {
    selectedSupplierPackages.value = selectedSupplierPackages.value.filter(x => x.parentId !== parentId)
    return
  }

  const { onYes } = useAlerts().question(t("pages.settings.packages.suppliers.delete-package.question"))
  onYes(async () => {
    if (supplierId === undefined || parentId === undefined) return
    await packagesSuppliersStore.deletePackage(supplierId, parentId)
    useToast().success("Упаковка удалена")
  })
}
</script>
