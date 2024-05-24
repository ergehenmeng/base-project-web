export const confirmMsg = (msg, fn, type) => {
  type = type || "warning";
  ElMessageBox.confirm(msg, {
    autofocus: false,
    type: "warning",
  })
    .then(() => {
      fn();
    })
    .catch(() => {});
};

export const errorMsg = (msg, func) => {
  ElMessage({
    message: msg,
    type: "error",
    duration: 3000,
    onClose: () => {
      if (func) {
        func();
      }
    },
  });
};
