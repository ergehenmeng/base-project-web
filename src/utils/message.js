export const confirmMsg = (msg, fn, type) => {
  type = type || "warning";
  ElMessageBox.confirm(msg, {
    autofocus: false,
    type: "warning"
  }).then(() => {
    fn();
  }).catch(() => { });
};
