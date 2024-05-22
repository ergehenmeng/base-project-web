import router from "@/router";


const getBreadcrumb = () => {

  const breadcrumbList = router.currentRoute.value.matched.filter(item => item.meta && item.meta.title);
  const home = [{path: "/home", meta: {title: "首页"}}];
  if (breadcrumbList.length === 0) {
    return home;
  }
  return home.concat(breadcrumbList);
}

export default getBreadcrumb;
