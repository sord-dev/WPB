import React, { createContext, useContext, useEffect, useState } from 'react';
import { appendElement, updateElement } from './PageBuilder';
import { generateComponentID } from '../../utils';

const defaultPageContext = {
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
        type: "container",
        props: { id: generateComponentID("container"), children: [] },
      }
    }
  }
}

const PageContext = createContext(defaultPageContext);

export const PageContextProvider = ({ children }) => {
  const [pageData, setPageData] = useState(defaultPageContext);

  const createPage = (pageName) => {
    if (pageData.pages[pageName]) return false;

    setPageData({
      ...pageData,
      pages: {
        ...pageData.pages,
        [pageName]: { content: {} }
      },
      pageIndex: [...pageData.pageIndex, pageName]
    });

    return true;
  };

  const deletePage = (page) => {
    const pages = { ...pageData.pages };
    delete pages[page];
    setPageData({ ...pageData, pages });
  };

  const updatePage = (page, content) => {
    setPageData({ ...pageData, pages: { ...pageData.pages, [page]: { ...pageData.pages[page], content } } });
  };

  const setActivePage = (page) => {
    setPageData({ ...pageData, activePage: page });
  };

  const addComponent = (component, parentElement) => {
    // navigate component tree and add component
    const tree = pageData.pages[pageData.activePage].content;
    component.props = { id: generateComponentID(component.type), ...component.props };
    console.log(component, parentElement)

    if (parentElement && parentElement.props.children) {
      const newTree = appendElement(tree, component, parentElement);
      console.log("DEBUG - Adding component with parent:", parentElement);
      updatePage(pageData.activePage, newTree);
    } else {
      const newTree = appendElement(tree, component, { type: "", props: { id: generateComponentID(component.type) } });
      updatePage(pageData.activePage, newTree);
    }

    return component;
  };

  const addContainer = (container) => {
    // navigate component tree and add component
    const tree = pageData.pages[pageData.activePage].content;
    container.props = { id: generateComponentID(container.type), ...container.props };

    const newTree = appendElement(tree, container, { type: "", props: { id: generateComponentID(container.type) } });
    updatePage(pageData.activePage, newTree);

    return container;
  }

  const updateComponent = (component, updatedData) => {
    // navigate component tree and update component
    const tree = pageData.pages[pageData.activePage].content;
    const newTree = updateElement(tree, { id: component.props.id }, { ...updatedData });

    const updatedElement = { type: component.type, props: { ...component.props, ...updatedData } };
    console.log("DEBUG - Updated component:", updatedElement.props);
    updatePage(pageData.activePage, newTree);

    return updatedElement;
  };

  const pageControls = {
    createPage,
    deletePage,
    updatePage,
    setActivePage,
  };

  const templateControls = {
    addComponent,
    addContainer,
    updateComponent,
    deleteComponent: () => { },
  };

  useEffect(() => {
    console.log("DEBUG - PageContext Template State:", { template: pageData.pages[pageData.activePage], page: pageData.activePage });
  }, [pageData]);

  return (
    <PageContext.Provider value={{ ...pageData, pageControls, templateControls }}>
      {children}
    </PageContext.Provider>
  );
};

export const usePageContext = () => {
  const context = useContext(PageContext);

  if (context === undefined) {
    throw new Error('usePageContext must be used within a PageContextProvider');
  }
  return context;
};