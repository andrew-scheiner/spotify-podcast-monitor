function setPriorityAndStatusDropdownLists() {
  GASLibrary.setGlobalLookupDropdownList("Channel", "Status", "podcasts__status", 1, { invalidHandling: "reject" });
}