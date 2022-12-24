<template>
  <div class="m-employee-card">
    <div class="flex gap-4">
      <div class="m-employee-card__left-side w-[240px]">
        <WSkeleton
          height="200"
        />
      </div>
      <div class="m-employee-card__right-side w-[500px] min-h-[240px]">
        <div class="m-employee-card__items">
          <div class="view__item">
            <WSkeleton
              height="41"
            />
          </div>
          <div class="view__item">
            <WSkeleton
              height="41"
            />
          </div>
          <div class="view__item">
            <WSkeleton
              height="41"
            />
          </div>
          <div class="view__item">
            <WSkeleton
              height="41"
            />
          </div>

          <div class="view__item--row">
            <WSkeleton
              width="50%"
              height="24"
              class="rounded-full"
            />
            <WSkeleton
              width="50%"
              height="24"
              class="rounded-full"
            />
          </div>
          <div class="view__item">
            <WSkeleton
              height="48"
            />
          </div>
          <div class="view__item">
            <WSkeleton
              height="48"
            />
          </div>
        </div>
      </div>
    </div>

    <div class="m-employee-card__actions mt-3">
      <WSkeleton
        height="36"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineComponent } from "vue"
import "../card/index.css"
import "./index.css"

defineComponent({ name: "MAssignJobEmployeeCardSkeleton" })
</script>
