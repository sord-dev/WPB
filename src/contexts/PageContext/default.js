import { generateComponentID } from "../../utils";

// Temporary default page context, to be replaced with a dynamic context
export const defaultPageContext = {
    pageIndex: ["home", "services"],
    activePage: "home",
    pageControls: {
      createPage: pageName => { },
      deletePage: pageName => { },
      updatePage: (page, content) => { },
      setActivePage: pageName => { },
    },
    templateControls: {
      addComponent: (component, parentElement) => { },
      updateComponent: component => { },
      addContainer: container => { },
      deleteComponent: (page, component) => { },
    },
    pages: {
      home: {
        name: "Home",
        content: {
          type: "wrapper",
          props: { id: generateComponentID("wrapper"), children: [] },
        }
      },
      services: {
        name: "Services",
        content: {
          type: "wrapper",
          props: { id: generateComponentID("wrapper"), children: [] },
        }
      }
    }
  }