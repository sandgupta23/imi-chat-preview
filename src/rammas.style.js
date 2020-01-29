import jss from 'jss'
import preset from 'jss-preset-default';

jss.setup(preset())
export function createAndAppendStyles(style) {
    const sheet = jss.createStyleSheet(style);
    sheet.attach();
    document.body.classList.add(sheet.classes.themeClass);
}


