import React, { createContext, useContext, useState } from 'react';

const defaultPageContext = {
  pageIndex: ["home", "services"],
  activePage: "home",
  createPage: () => { },
  deletePage: () => { },
  updatePage: () => { },
  setActivePage: () => { },
  pages: {
    home: {
      name: "Home",
      content: {
        type: "container",
        children: [
          {
            type: "text",
            props: {
              content: "Hello, world!",
              style: {
                color: "red",
                fontSize: "24px"
              }
            }
          }
        ]
      }
    },
    services: {
      name: "Services",
      content: {
        type: "container",
        children: [
          {
            type: "text",
            props: {
              content: "Services!",
              style: {
                color: "green",
                fontSize: "24px"
              }
            }
          }
        ]
      }
    }
  }
}

const PageContext = createContext(defaultPageContext);

export const PageContextProvider = ({ children }) => {
  const [pageData, setPageData] = useState(defaultPageContext);

  const createPage = (page) => {
    if(pageData.pages[page]) return;
    setPageData({ ...pageData, pages: { ...pageData.pages, [page]: { content: {} } }, pageIndex: [...pageData.pageIndex, page] });
  };

  const deletePage = (page) => {
    const pages = { ...pageData.pages };
    delete pages[page];
    setPageData({ ...pageData, pages });
  };

  const updatePage = (page, content) => {
    setPageData({ ...pageData, pages: { ...pageData.pages, [page]: { content } } });
  };

  const setActivePage = (page) => {
    setPageData({ ...pageData, activePage: page });
  };

  return (
    <PageContext.Provider value={{ ...pageData, setActivePage, updatePage, deletePage, createPage }}>
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