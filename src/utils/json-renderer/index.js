import translators from './translators'

export default (json = {}, exportType) => {
    const translator = translators[exportType];

    if (!translator) {
        console.error(`No translator found for ${exportType}`);
        return;
    }

    return translator(json);
};

export const getTranslators = () => Object.keys(translators);
export const getTranslator = (exportType) => translators[exportType];

export const renderMultiple = (json = [], exportType) => {
    const translator = translators[exportType];

    if (!translator) {
        console.error(`No translator found for ${exportType}`);
        return;
    }

    return json.map((data) => translator(data));
};