import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
  state: () => ({
    hideHomeStepperDialog: false,
  }),
  actions: {
    setHideHomeStepperDialog(val: boolean) {
      this.hideHomeStepperDialog = val;
    },
    syncHideHomeStepperDialogFromStorage() {
      if (localStorage.getItem('hideHomeStepper') === '1') {
        this.hideHomeStepperDialog = true;
      }
    }
  }
});