import request from '@/utils/request';

export const shortUrlApi = (data) => {
  return request.post({
    url: '/manage/wechat/shortUrl',
    data
  });
};

export const linkUrlApi = (data) => {
  return request.post({
    url: '/manage/wechat/linkUrl',
    data
  });
};

export const qrcodeApi = (data) => {
  return request.post({
    url: '/manage/wechat/qrcode',
    data
  });
};

export const WxLogin = ({ id, appId, redirectUri, state, style, href, lang, fastLogin }) => {
  const iframe = document.createElement('iframe');
  let url = `https://open.weixin.qq.com/connect/qrconnect?appid=${appId}&scope=snsapi_login&redirect_uri=${redirectUri}&state=${state}&login_type=jssdk&self_redirect=true&stylelite=1`;
  if (style) {
    url += `&style=${style}`;
  }
  if (href) {
    url += `&href=${href}`;
  }
  if (lang === 'en') {
    url += '&lang=en';
  }
  if (fastLogin === 0) {
    url += '&fast_login=0';
  }
  iframe.src = url;
  iframe.allowTransparency = 'true';
  iframe.width = '300px';
  iframe.height = '400px';
  const container = document.getElementById(id);
  container.innerHTML = '';
  container.appendChild(iframe);
}

export const uploadApi = (formData) => {
  return request.upload({
    url: '/manage/file/upload',
    formData
  })
}