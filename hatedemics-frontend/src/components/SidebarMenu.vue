<template>
  <div id="totalborder">
    <div class="borders" id="titleborder">
      <div id="title">HATEDEMICS</div>
    </div>

    <div class="borders" v-for="(section, index) in sections" :key="index">
      <div class="subtitle" @click="toggle(index)">
        {{ section.title }}
      </div>
      <div class="content" v-show="section.open">
        <slot :name="section.slotName" />
      </div>
    </div>

    <div id="footer">
      <a href="https://dhsite.fbk.eu/">Digital Humanities @Fondazione Bruno Kessler</a>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue'

const sections = reactive([
  { title: 'VISUALIZATION OPTIONS', open: false, slotName: 'options' },
  { title: 'NETWORK MEASURES', open: false, slotName: 'measures' },
  { title: 'CHANNEL INFORMATION', open: false, slotName: 'info' }
])

function toggle(index) {
  sections[index].open = !sections[index].open
}
</script>

<style scoped>
#totalborder {
  width: 325px;
  margin: 25px;
  float: left;
  background-color: var(--backg);
}

.borders {
  border: solid 1px;
  margin: 10px;
  width: 300px;
}

.subtitle {
  padding: 10px;
  cursor: pointer;
}

.subtitle:hover {
  background-color: var(--backg_buttons);
}

.content {
  padding: 10px;
}

#title {
  padding: 10px;
  font-size: 20pt;
  color: var(--color_title_text);
  font-weight: bold;
}

#titleborder {
  background-color: var(--color_title_backg);
}

#footer {
  font-size: 8pt;
  padding: 10px;
  color: grey;
}
</style>
