<template>
  <Combobox v-model="selected">
    <div class="w-autocomplete">
      <div
        class="w-autocomplete__activator"
      >
        <ComboboxInput
          class="w-autocomplete__activator--input"
          :display-value="displayValue"
          @change="query = $event.target.value"
        />
        <ComboboxButton class="w-autocomplete__activator--button">
          <ChevronDownIcon class="h-5 w-5 text-grey" />
        </ComboboxButton>
      </div>
      <TransitionRoot
        leave="transition ease-in duration-100"
        leave-from="opacity-100"
        leave-to="opacity-0"
        @after-leave="query = ''"
      >
        <ComboboxOptions
          class="
            absolute mt-1 max-h-60 w-full overflow-auto
            rounded-md bg-white py-1 text-base shadow-lg
            ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm
          "
        >
          <div
            v-if="filteredPeople.length === 0 && query !== ''"
            class="relative cursor-default select-none py-2 px-4 text-gray-700"
          >
            Nothing found.
          </div>

          <ComboboxOption
            v-for="person in filteredPeople"
            :key="person.id"
            v-slot="{ selected, active }"
            as="template"
            :value="person"
          >
            <li
              class="relative cursor-default select-none py-2 pl-10 pr-4"
              :class="{
                'bg-teal-600 text-white': active,
                'text-gray-900': !active,
              }"
            >
              <span
                class="block truncate"
                :class="{ 'font-medium': selected, 'font-normal': !selected }"
              >
                {{ person.name }}
              </span>
              <WCheckbox :checked="selected" />
            </li>
          </ComboboxOption>
        </ComboboxOptions>
      </TransitionRoot>
    </div>
  </Combobox>
</template>

<script setup lang="ts">
// Components
import {
  Combobox,
  ComboboxButton,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
  TransitionRoot,
} from "@headlessui/vue"

// Utilities
import { computed, defineComponent, ref } from "vue"

// Icons
import ChevronDownIcon from "@/assets/icons/chevron-down.svg?component"

// Styles
import "./index.css"

defineComponent({ name: "WAutocomplete" })

const people = [
  {
    id: 1,
    name: "Wade Cooper",
  },
  {
    id: 2,
    name: "Arlene Mccoy",
  },
  {
    id: 3,
    name: "Devon Webb",
  },
  {
    id: 4,
    name: "Tom Cook",
  },
  {
    id: 5,
    name: "Tanya Fox",
  },
  {
    id: 6,
    name: "Hellen Schmidt",
  },
]

const selected = ref()
const query = ref("")
const displayValue = (person: any): string => person?.name

const filteredPeople = computed(() =>
  query.value === ""
    ? people
    : people.filter((person) =>
      person.name
        .toLowerCase()
        .replace(/\s+/g, "")
        .includes(query.value.toLowerCase().replace(/\s+/g, "")),
    ),
)
</script>
