

// these will be overwritten by the functions prop, the actions will be executed within the context custom menu button.
export const defaultFunctions = [
  {
    name: "All Websites (Dashboard)",
    type: "link",
    action: () => "/",
  },
  {
    name: "New Website",
    type: "action",
    action: () => console.log("New"),
  },
  {
    name: "Open Website",
    type: "action",
    action: () => console.log("Open"),
  }
]