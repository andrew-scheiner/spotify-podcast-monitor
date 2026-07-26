function setPriorityAndStatusDropdownLists() {
  GASLibrary.setGlobalLookupDropdownList("ConfigChange", "Priority", "cpi__priority", 1, { invalidHandling: "reject" });
  GASLibrary.setGlobalLookupDropdownList("ConfigChange", "Status", "cpi__status", 1, { invalidHandling: "reject" });
}