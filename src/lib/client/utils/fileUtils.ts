type EventWithFiles = Event & {
  target: {
    files: File[];
  };
}

export function eventHasFiles(event: Event | EventWithFiles): event is EventWithFiles {
  return 'files' in (event.target ?? {})
}