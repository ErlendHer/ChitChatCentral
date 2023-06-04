import { toast } from '@zerodevx/svelte-toast';

export const openSuccessToast = (message: string) => {
  toast.push(message, {
    duration: 10000,
    pausable: true,
    theme: {
      '--toastColor': 'mintcream',
      '--toastBackground': 'rgba(72,187,120,0.9)',
      '--toastBarBackground': '#2F855A'
    }
  });
};

export const openErrorToast = (message: string) => {
  toast.push(message, {
    duration: 10000,
    pausable: true,
    theme: {
      '--toastColor': 'mintcream',
      '--toastBackground': 'rgba(239,68,68,0.9)',
      '--toastBarBackground': '#C53030'
    }
  });
};
