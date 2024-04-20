/**
 * 初始化 rem 单位设置
 */
export const initRem = () => {
  // 获取文档的根元素
  const docEl = document.documentElement;

  /**
   * 设置 rem 单位的函数
   */
  const setRemUnit = () => {
    // 根据视口宽度计算 rem 值
    const rem = (docEl.clientWidth / 375) * 20;
    // 设置根元素的字体大小为计算得到的 rem 值
    docEl.style.fontSize = `${rem  }px`;
  };
  
  // 在页面大小变化时重新设置 rem 单位
  window.addEventListener('resize', setRemUnit);
  // 在页面重新展示时重新设置 rem 单位
  window.addEventListener('pageshow', setRemUnit);
};
