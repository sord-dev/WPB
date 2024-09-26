import React, { createContext, useContext, useEffect, useState } from 'react';
import { extractComponentParameters } from '../../utils';

import { Button, Container, Link, Text, Wrapper } from '../../components/user';

const ComponentContext = createContext({
    getComponents: () => { },
    setAllComponents: (newComponents) => { },
    setComponent: (key, componentFunc) => { },
    deleteComponent: (component) => { },
});

const defaultComponents = {
    text: Text,
    container: Container,
    wrapper: Wrapper,
    button: Button,
    link: Link
};

// Create a provider component
export const ComponentContextProvider = ({ children }) => {
    const [mergedRegistry, setMergedRegistry] = useState(Object.assign({}, {}, defaultComponents));
    const [components, setComponents] = useState([]);

    const getComponents = () => {
        return { arr: components, obj: mergedRegistry };
    }

    const setAllComponents = (newComponents) => {
        setComponents(newComponents);
    }

    const setComponent = (key, componentData) => {
        const newComponentReg = { ...mergedRegistry, [key]: componentData };
        const newComponents = [...components, { name: key, parameters: extractComponentParameters(componentData) }];
        setComponents(newComponents);
        setMergedRegistry(newComponentReg);
    }

    const deleteComponent = (component) => {
        const newComponents = components.filter((c) => c.name !== component.name);
        const newComponentReg = { ...mergedRegistry };
        delete newComponentReg[component.name];
        setComponents(newComponents);
        setMergedRegistry(newComponentReg);
    }


    useEffect(() => {
        const componentParameters = Object.entries(mergedRegistry).map(([name, component]) => ({
            name: name.split(":")[0] || name,
            parameters: extractComponentParameters(component),
        }));

        const tick = () => setAllComponents(componentParameters);
        tick();
        const tm = setTimeout(tick, 1000);
        return () => clearTimeout(tm);
    }, []);


    return (
        <ComponentContext.Provider value={{ deleteComponent, getComponents, setAllComponents, setComponent }}>
            {children}
        </ComponentContext.Provider>
    );
};

// Create a custom hook to use the new context
export const useComponentContext = () => {
    const context = useContext(ComponentContext);
    if (context === undefined) {
        throw new Error('useComponentContext must be used within a NewContextProvider');
    }
    return context;
};
