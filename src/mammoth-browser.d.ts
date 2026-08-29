declare module 'mammoth/mammoth.browser.js' {
  type MammothResult = { value: string; messages: Array<{ type: string; message: string }> }
  const mammoth: { convertToHtml(input: { arrayBuffer: ArrayBuffer }): Promise<MammothResult> }
  export default mammoth
}
