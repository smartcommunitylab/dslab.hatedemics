<script setup lang="ts">
import { useChannelsStore } from "../store/ChannelStore";
const channelsStore = useChannelsStore();

</script>
<template>
    <v-card
    class="mx-auto"
    max-width="344"
  >
    <v-card-text>
      <div></div>

      <p class="text-h4 font-weight-black">be•nev•o•lent</p>

      <p>adjective</p>

      <div class="text-medium-emphasis">
        well meaning and kindly.<br>
        "a benevolent smile"
        {{ channelsStore.selectedChannel }}

      </div>
    </v-card-text>

    <v-card-actions>
      <v-btn
        color="deep-purple-accent-4"
        text="Learn More"
        variant="text"
      ></v-btn>
    </v-card-actions>
  </v-card>
    <!-- Channel 3
    Channel description: 
NWO's Most Wanted. Coined the terms "death towers" & "creepy biden," made "pizzagate" mainstream. A billion+ views to our credit before being banned everywhere...
N . messages:                    32363
N. users:                               1300
Language:                            English
Infodemic Risk:                high
Hate Speech Risk%:      high
Last update:                      2024-03-18

Main Topics/targets: 
- trump_president_election_biden" 
- israel_military_https_ukraine",
- "trafficking_fbi_sex_law",
- "vaccine_vaccines_covid_measle” -->

</template>