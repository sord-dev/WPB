import React, { createContext, useContext, useEffect, useState } from 'react';
import { appendElement, deleteElement, updateElement } from './PageBuilder';
import { generateComponentID } from '../../utils';

import { defaultPageContext } from './default';
import { useNavigate } from 'react-router-dom';
import { useProjectContext } from '../ProjectContext';
const PageContext = createContext();

export const PageContextProvider = ({ children }) => {
  const { projects, activeProject } = useProjectContext();
  const [pageData, setPageData] = useState(projects[activeProject] ||{ pages: {}, pageIndex: [], activePage: null }); // TODO - we need to make this connect to the project context, so that we can have multiple projects
  const navigate = useNavigate()

  useEffect(() => {
    if (Object.keys(pageData.pages).length === 0) {
      navigate('/');
    }
  }, [pageData, navigate]);

  useEffect(() => {
    if(!activeProject) return;
    setPageData(projects[activeProject] || { pages: {}, pageIndex: [], activePage: null });
  }, [activeProject]);

  const createPage = (pageName) => {
    if (pageData.pages[pageName]) return false;

    setPageData({
      ...pageData,
      pages: {
        ...pageData.pages,
        [pageName]: { content: {
          type: "wrapper",
          props: { id: generateComponentID("wrapper"), children: [] },
        } }
      },
      pageIndex: [...pageData.pageIndex, pageName]
    });

    return true;
  };

  const deletePage = (page) => {
    const pages = { ...pageData.pages };
    delete pages[page];
  
    const newPageIndex = pageData.pageIndex.filter(pageName => pageName !== page);
  
    let newActivePage = pageData.activePage;
    const currentIndex = pageData.pageIndex.indexOf(page);
    
    if (currentIndex !== -1) {
      newActivePage = currentIndex > 0 ? newPageIndex[currentIndex - 1] : newPageIndex[0];
    }
  
    setPageData({ 
      ...pageData, 
      pages: pages, 
      pageIndex: newPageIndex,
      activePage: newActivePage 
    });
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

    if (parentElement && parentElement.props.children) { // if parentElement is provided, add component to parent
      const newTree = appendElement(tree, component, parentElement);
      console.log("DEBUG - Adding component with parent:", parentElement);
      updatePage(pageData.activePage, newTree);
    } else { // if parentElement is not provided, add component to root level
      const newTree = appendElement(tree, component, { type: "", props: { id: generateComponentID(component.type) } });
      updatePage(pageData.activePage, newTree);
    }

    return component; // return the component with the generated ID
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

  const deleteComponent = (component) => {
    const tree = pageData.pages[pageData.activePage].content;
    // navigate component tree and delete component
    const newTree = deleteElement(tree, { id: component.props.id });
    updatePage(pageData.activePage, newTree);
  }

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
    deleteComponent,
  };

  useEffect(() => {
    console.log("DEBUG - PageContext Template State:", { template: pageData.pages[pageData.activePage], page: pageData.activePage });
  }, [pageData]);

  return (
    <PageContext.Provider value={{ ...pageData, pageControls, templateControls, setPageData }}>
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