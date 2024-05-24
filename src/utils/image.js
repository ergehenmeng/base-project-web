import { errorMsg } from "./message";

/**
 * 校验上传的图片格式及大小
 * @param {*} file 文件
 * @param {*} maxSize 最大限制 单位: M
 * @param  {...any} imageType 图片类型
 * @returns
 */
export const imageCheck = (file, maxSize, ...imageType) => {
  const type = imageType || ["image/jpeg", "image/jpg", "image/png", "image/svg"];
  const isImage = type.includes(file.type);
  if (!isImage) {
    errorMsg("图片格式不正确");
    return false;
  }
  maxSize = maxSize || 1024 * 2;
  if (file.size / 1024 > maxSize) {
    errorMsg("图片大小不能超过" + (maxSize / 1024).toFixed(1) + "MB");
    return false;
  }
  return true;
}
