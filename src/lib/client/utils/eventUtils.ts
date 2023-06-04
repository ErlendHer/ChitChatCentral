export function onEnter(callback: (event: KeyboardEvent) => void) {
  function handleClickOrEnter(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      callback(event);
    }
  }

  return handleClickOrEnter;
}
