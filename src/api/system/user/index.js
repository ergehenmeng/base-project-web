import request from '@/utils/request';

export const listPageApi = (params) => {
  return request.get({
    url: '/manage/user/listPage',
    params
  });
};

export const createApi = (data) => {
  return request.post({
    url: '/manage/user/create',
    data
  });
};

export const updateApi = (data) => {
  return request.post({
    url: '/manage/user/update',
    data
  });
};

export const selectApi = (params) => {
  return request.get({
    url: '/manage/user/select',
    params
  });
};

export const lockApi = (data) => {
  return request.post({
    url: '/manage/user/lock',
    data
  });
};

export const lockScreenApi = (data) => {
  return request.post({
    url: '/manage/user/lockScreen',
    data
  });
};

export const unlockScreenApi = (data) => {
  return request.post({
    url: '/manage/user/unlockScreen',
    data
  });
};

export const unlockApi = (data) => {
  return request.post({
    url: '/manage/user/unlock',
    data
  });
};

export const deleteApi = (data) => {
  return request.post({
    url: '/manage/user/delete',
    data
  });
};

export const resetPwdApi = (data) => {
  return request.post({
    url: '/manage/user/reset',
    data
  });
};

export const roleListApi = () => {
  return request.get({
    url: '/manage/role/list'
  });
};

export const changePwdApi = (data) => {
  return request.post({
    url: '/manage/user/changePwd',
    data
  });
};

export const unbindApi = () => {
  return request.post({
    url: '/manage/unbindWeChat',
    data: {}
  });
};

export const updateAvatarApi = (formData) => {
  return request.upload({
    url: '/manage/user/updateAvatar',
    formData
  })
}

export const unbindTotpApi = (data) => {
  return request.post({
    url: '/manage/user/unbindTotp',
    data
  })
}

export const updateUserApi = (data) => {
  return request.post({
    url: '/manage/user/updateBasic',
    data
  })
}
