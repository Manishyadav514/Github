// challange12RemoveSidebar=()=>{
//   document.querySelector(".challange-12-2-sidebar").classList.remove("challange-12-2-show-sidebar");
// }
// challange12ShowSidebar=()=>{
//   document.querySelector(".challange-12-2-sidebar").classList.toggle("challange-12-2-show-sidebar");
// }


challange12SidebarChanger=()=>{
  const sidebar = document.querySelector(".challange-12-2-sidebar");
  if( sidebar.classList.contains("challange-12-2-show-sidebar")){
    sidebar.classList.remove("challange-12-2-show-sidebar");
  }
  else{
    sidebar.classList.toggle("challange-12-2-show-sidebar");
  }
}
