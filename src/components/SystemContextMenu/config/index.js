// these will be overwritten by the functions prop, the actions will be executed within the context custom menu button.
export const defaultFunctions = [
  {
    name: "All Websites (Dashboard)",
    action: () => console.log("Navigate to Dashboard"),
  },
  {
    name: "New Website",
    action: () => console.log("New"),
  },
  {
    name: "Open Website",
    action: () => console.log("Open"),
  }
]