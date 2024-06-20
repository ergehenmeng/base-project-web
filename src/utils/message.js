export const confirmMsg = (msg, fn, type) => {
  type = type || 'warning';
  ElMessageBox.confirm(msg, {
    autofocus: false,
    type: type
  })
    .then(() => {
      fn();
    })
    .catch(() => {});
};

export const errorMsg = (msg, func) => {
  ElMessage({
    message: msg,
    type: 'error',
    grouping: true,
    duration: 3000,
    onClose: () => {
      if (func) {
        func();
      }
    }
  });
};

export const successMsg = (msg, func) => {
  ElMessage({
    message: msg,
    type: 'success',
    grouping: true,
    duration: 3000,
    onClose: () => {
      if (func) {
        func();
      }
    }
  });
};
