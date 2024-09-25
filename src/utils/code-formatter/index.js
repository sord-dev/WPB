import * as prettier from "https://unpkg.com/prettier@3.3.3/standalone.mjs";
import prettierPluginBabel from "https://unpkg.com/prettier@3.3.3/plugins/babel.mjs";
import prettierPluginEstree from "https://unpkg.com/prettier@3.3.3/plugins/estree.mjs";
import prettierPluginHtml from "https://unpkg.com/prettier@3.3.3/plugins/html.mjs";

export default async (code, parser = "html") => {
    try {
        return await prettier.format(code, {
            parser,
            plugins: [prettierPluginBabel, prettierPluginEstree, prettierPluginHtml],
            htmlWhiteSpaceSensitivity: "ignore",
            embeddedLanguageFormatting: "auto",
        });
    } catch (e) {
        console.error(e);

        return code;
    }
};