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
  alertMsg(msg, 'error', func)
};

export const warningMsg = (msg, func) => {
  alertMsg(msg, 'warning', func)
};

export const successMsg = (msg, func) => {
  alertMsg(msg, 'success', func)
};

export const messageBox = (msg, func) => {
  ElMessageBox({
    message: msg,
    title: '提示',
    confirmButtonText: '确定',
    callback: () => {
      if (func) {
        func();
      }
    }
  });
};

export const alertMsg = (msg, type, func) => {
  ElMessage({
    message: msg,
    type: type,
    grouping: true,
    duration: 3000,
    onClose: () => {
      if (func) {
        func();
      }
    }
  });
};