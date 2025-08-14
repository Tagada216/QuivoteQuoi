<script setup lang="ts">
const query = ref({
  q: "",
  legislature: undefined as "XVI" | "XVII" | undefined,
  theme: "tous" as "tous" | "ecologie" | "social" | "justice",
  type: "tous" as "tous" | "ordinaire" | "solennel" | "censure",
});

function onSearch() {
  console.log("Recherche", query.value);
}
</script>

<template>
  <div class="min-h-screen bg-base-100">
    <HeroBrand tagline="Les votes, en clair" />

    <SearchControls v-model="query" @search="onSearch" />

    <HemicycleCanvas class="mt-8" />

    <DataSourceNotice />
  </div>
</template>
