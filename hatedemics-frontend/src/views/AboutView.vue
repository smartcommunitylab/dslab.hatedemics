<template>
  <v-container>
    <!-- Logo Europa + HateDemics -->
    <v-row justify="center" class="mb-6">
      <v-col cols="12" md="8" class="text-center">
        <v-row justify="center" align="center">
          <v-col cols="6" md="4" class="text-center">
            <v-img src="/src/assets/credits/eu.jpg" max-height="80" contain class="mb-2" />
          </v-col>
          <v-col cols="6" md="4" class="text-center">
            <v-img src="/src/assets/credits/hatedemics.png" max-height="100" contain class="mb-2" />
          </v-col>
        </v-row>
        <h1 class="text-h4 font-weight-bold">HateDemics</h1>
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
        <h2 class="text-h5 font-weight-bold">Contatti</h2>
        <p>
          <v-icon color="primary" class="mr-1">mdi-email</v-icon>
          <a href="mailto:info@hatedemics.eu">contact@hatedemics.eu</a>
        </p>
        <p>
          <v-icon color="primary" class="mr-1">mdi-phone</v-icon>
          <a href="tel:+39 0461314 804">+39 0461314 804          </a>
        </p>

      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref } from 'vue';

const partners = ref([
  { name: 'ALDA', logo: '/src/assets/credits/alda.png', link: 'https://www.alda-europe.eu/',email: 'alda@alda-europe.eu '  },
  { name: 'CEO', logo: '/src/assets/credits/ceo.jpg', link: 'https://ceo.org.pl/english/', email: 'ceo@ceo.org.pl'},
  { name: 'CESIE', logo: '/src/assets/credits/cesie.png', link: 'https://cesie.org/' , email: 'press.office@cesie.org'},
  { name: 'Demagog', logo: '/src/assets/credits/demagog.png', link: 'https://demagog.org.pl/', email: 'kontakt@demagog.org.pl'},
  { name: 'Facta', logo: '/src/assets/credits/facta.jpeg', link: 'https://www.facta.news/' },
  { name: 'Fbk', logo: '/src/assets/credits/fbk.jpg', link: 'https://www.fbk.eu/en/' },
  { name: 'Fundea', logo: '/src/assets/credits/fundea.png', link: 'https://www.fundea.org', email: 'ppd@fundea.org'},
  { name: 'Maldita', logo: '/src/assets/credits/maldita.png', link: 'https://maldita.es', email: 'proyectos@maldita.es'},
  { name: 'Mg', logo: '/src/assets/credits/mg.png', link: ' https://www.centrodeestudiosandaluces.es/', email: 'dpd.cpidssa@juntadeandalucia.es'},
  { name: 'nask', logo: '/src/assets/credits/nask.png', link: 'https://www.nask.pl/', email: 'inspektorochronydanych@nask.pl'},
  { name: 'pp', logo: '/src/assets/credits/pp.jpeg', link: 'https://pagellapolitica.it/',email:'matters.privacy@pagellapolitica.it' },
  { name: 'saher', logo: '/src/assets/credits/saher.jpg', link: 'http://www.saher-eu.com', email: 'contact@saher-eu.com'},
  { name: 'sos', logo: '/src/assets/credits/sos.png', link: 'https://www.facebook.com/sosmaltapage', email: 'graziella.schiavone@sosmalta.org'},
  { name: 'vsa', logo: '/src/assets/credits/vsa.jpg', link: 'http://www.vsa.gov.mt' , email: 'vsa_projects@gov.mt'},
]);
</script>