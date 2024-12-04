const capitalize = (str) => {
  return str[0].toUpperCase() + str.slice(1) + 'Page';
};

const formatRouterPath = (str) => {
  if (!str) {
    return '.';
  }
  return str.replace(/^\./, '')
    .replace(/^\/|\/$/g, '')
    .replace(/^src\/pages\//, '');
};

module.exports = {
  prompt: ({ inquirer }) => {
    const questions = [
      {
        type: 'input',
        name: 'componentName',
        message: 'What is the component name?',
      },
      {
        type: 'input',
        name: 'routerFolder',
        message: 'What is router folder? (left empty for `/`)',
      },
    ];
    return inquirer
      .prompt(questions)
      .then(answers => {
        const { componentName, routerFolder } = answers;

        const path = `src/pages/${formatRouterPath(routerFolder)}/${componentName}`;
        return { componentName: capitalize(componentName), path };
      });
  },
};