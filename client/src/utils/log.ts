export function prettyLog(msg: string, data?: any) {
  console.log(
    `%c${msg}`,
    `
      background: #cbeccb;
      color: #084922;
      border-radius: 99px;
      padding-left: 4px;
      padding-right: 4px;
      padding-top: 1px;
      padding-bottom: 1px;
    `
  );
  if (data) console.log(data);
}
