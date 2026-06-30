<template>
  <v-container>
    <!-- Logo Europa + HateDemics -->
    <v-row justify="center" class="mb-6">
      <v-col cols="12" md="8" class="text-center">
        <v-row justify="center" align="center">
          <v-col cols="6" md="4" class="text-center">
            <v-img src="@/assets/credits/eu.jpg" max-height="80" contain class="mb-2" />
          </v-col>
          <v-col cols="6" md="4" class="text-center">
            <v-img src="@/assets/credits/hatedemics_transparent.png" max-height="100" contain class="mb-2" />
          </v-col>
        </v-row>
        <h1 class="text-h4 font-weight-bold">Hatedemics</h1>
        <p class="text-subtitle-1">HATEDEMICS is funded by the European Union (CERV-2023-CHAR-LITI-101143249))
        </p>
      </v-col>
    </v-row>

    <!-- Partner del Consorzio -->
    <v-row>
      <v-col
        v-for="partner in partners"
        :key="partner.name"
        cols="12"
        sm="6"
        md="4"
        class="text-center"
      >
        <v-card elevation="0" class="pa-4">
          <v-img :src="partner.logo" max-height="80" contain class="mb-2" />
          <h3 class="text-body-1 font-weight-medium">
            <v-icon color="primary" class="mr-1">mdi-web</v-icon>
            <a :href="partner.link" target="_blank" class="text-decoration-none">
              {{ partner.name }}
            </a>
          </h3>
          <p v-if="partner.email">
            <v-icon color="primary" class="mr-1">mdi-email</v-icon>
            <a :href="'mailto:' + partner.email" class="text-decoration-none">
              {{ partner.email }}
            </a>
          </p>
        </v-card>
      </v-col>
    </v-row>

    <!-- Contatti -->
    <v-row justify="center" class="mt-8">
      <v-col cols="12" md="6" class="text-center">
        <h2 class="text-h5 font-weight-bold">Contact</h2>
        <p>
          <v-icon color="primary" class="mr-1">mdi-email</v-icon>
          <a href="mailto:info@hatedemics.eu">contact@hatedemics.eu</a>
        </p>
        <!-- <p>
          <v-icon color="primary" class="mr-1">mdi-phone</v-icon>
          <a href="tel:+39 0461314 804">+39 0461314 804          </a>
        </p> -->

      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref } from 'vue';
import logoAlda from '@/assets/credits/alda.png';
import logoCeo from '@/assets/credits/ceo.jpg';
import logoCesie from '@/assets/credits/cesie.png';
import logoDemagog from '@/assets/credits/demagog.png';
import logoFacta from '@/assets/credits/facta.jpeg';
import logoFbk from '@/assets/credits/fbk.jpg';
import logoFundea from '@/assets/credits/fundea.png';
import logoMaldita from '@/assets/credits/maldita.png';
import logoMg from '@/assets/credits/mg.png';
import logoNask from '@/assets/credits/nask.png';
import logoPp from '@/assets/credits/pp.jpeg';
import logoSaher from '@/assets/credits/saher.jpg';
import logoSos from '@/assets/credits/sos.png';
import logoVsa from '@/assets/credits/vsa.jpg';

const partners = ref([
  { name: 'ALDA', logo: logoAlda, link: 'https://www.alda-europe.eu/', email: 'alda@alda-europe.eu' },
  { name: 'CEO', logo: logoCeo, link: 'https://ceo.org.pl/english/', email: 'ceo@ceo.org.pl' },
  { name: 'CESIE', logo: logoCesie, link: 'https://cesie.org/', email: 'press.office@cesie.org' },
  { name: 'Demagog', logo: logoDemagog, link: 'https://demagog.org.pl/', email: 'kontakt@demagog.org.pl' },
  { name: 'Facta', logo: logoFacta, link: 'https://www.facta.news/' },
  { name: 'Fbk', logo: logoFbk, link: 'https://www.fbk.eu/en/' },
  { name: 'Fundea', logo: logoFundea, link: 'https://www.fundea.org', email: 'ppd@fundea.org' },
  { name: 'Maldita', logo: logoMaldita, link: 'https://fundacionmaldita.es/es/', email: 'proyectos@maldita.es' },
  { name: 'Centra', logo: logoMg, link: 'https://www.centrodeestudiosandaluces.es/', email: 'eu.projects@fundacioncentra.es' },
  { name: 'nask', logo: logoNask, link: 'https://www.nask.pl/', email: 'nask@nask.pl' },
  { name: 'pp', logo: logoPp, link: 'https://pagellapolitica.it/', email: 'matters.privacy@pagellapolitica.it' },
  { name: 'saher', logo: logoSaher, link: 'http://www.saher-eu.com', email: 'contact@saher-eu.com' },
  { name: 'sos', logo: logoSos, link: 'https://www.facebook.com/sosmaltapage', email: 'info@sosmalta.org' },
  { name: 'vsa', logo: logoVsa, link: 'http://www.vsa.gov.mt', email: 'vsa_projects@gov.mt' },
]);
</script>