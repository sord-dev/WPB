import translators from './translators'

export default (json, exportType) => {
    const translator = translators[exportType];

    if (!translator) {
        console.error(`No translator found for ${exportType}`);
        return;
    }

    return translator(json);
};