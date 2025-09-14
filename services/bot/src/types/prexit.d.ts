declare module 'prexit' {
  function prexit(callback: () => void | Promise<void>): void;
  export = prexit;
}