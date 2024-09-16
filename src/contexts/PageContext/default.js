export const defaultPageContext = {
  pageIndex: [],
  activePage: "",
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
  pages: {},
  getPageData: () => { },
  exporting: false,
  exportControls: {
    exportProject: (exportType) => { },
    setExporting: (exporting) => { },
    cancelExport: () => { }
  }
}