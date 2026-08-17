<template>
  <div>
    <q-btn flat dense round icon="notifications" @click="openNotificationMenu">
      <q-badge v-if="count > 0" color="green" text-color="white" floating>{{ count }}</q-badge>
    </q-btn>
    <q-menu v-model="menuOpen" :context-menu="false" anchor="bottom right" self="top right">
      <q-list style="min-width: 260px; max-height: 60vh" separator>
        <q-item>
          <q-item-section class="text-subtitle2">Cambios recientes</q-item-section>
          <q-item-section side>
            <q-btn dense flat size="sm" icon="clear_all" @click="clear" :disable="count === 0" />
          </q-item-section>
        </q-item>
        <q-separator />
        <q-item v-if="count === 0">
          <q-item-section class="text-grey">Sin cambios</q-item-section>
        </q-item>
        <q-item v-for="(c, idx) in items" :key="c.at + '-' + idx">
          <q-item-section avatar>
            <q-icon :name="iconFor(c.type)" :color="colorFor(c.type)" />
          </q-item-section>
          <q-item-section>
            <div class="text-body2">
              <span v-if="c.type === 'add'">Añadido</span>
              <span v-else-if="c.type === 'update'">Actualizado</span>
              <span v-else>Eliminado</span>:
              <strong>{{ c.productName }}</strong>
            </div>
            <div class="text-caption text-grey-7">{{ formatTime(c.at) }}</div>
          </q-item-section>
        </q-item>
      </q-list>
    </q-menu>
  </div>
</template>
<script setup lang="ts">
import { ref, computed } from 'vue';
import { useAdminChangesStore, type ChangeItem, type ChangeType } from 'src/stores/adminChanges';

const menuOpen = ref(false);
const store = useAdminChangesStore();

const count = computed(() => store.count);
const items = computed<ChangeItem[]>(() => store.list);
function iconFor(type: ChangeType): string {
  if (type === 'add') return 'add_circle';
  if (type === 'update') return 'edit';
  return 'delete';
}
function colorFor(type: ChangeType): string {
  if (type === 'add') return 'positive';
  if (type === 'update') return 'info';
  return 'negative';
}
function formatTime(ts: number): string {
  try {
    const d = new Date(ts);
    return d.toLocaleString();
  } catch {
    return '';
  }
}

function clear() {
  store.clear();
}
function openNotificationMenu() {
  let openMenu: boolean = false;
  openMenu = !openMenu;
  return openMenu;
}
</script>
<style scoped></style>
