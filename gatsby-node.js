const path = require(`path`);
const { createFilePath } = require(`gatsby-source-filesystem`);

const { supportedLanguages } = require('./i18n');

exports.createPages = ({ graphql, actions }) => {
  const { createPage } = actions;
  return new Promise((resolve, reject) => {
    const blogPostTemplate = path.resolve(`./src/templates/blog-post.js`);

    // Create index pages for all supported languages
    // Reference: https://github.com/gaearon/overreacted.io/blob/master/gatsby-node.js
    Object.keys(supportedLanguages).forEach(langKey => {
      createPage({
        path: langKey === 'en' ? '/' : `/${langKey}/`,
        component: path.resolve('./src/templates/blog-index.js'),
        context: {
          langKey,
        },
      });
    });

    resolve(
      graphql(
        `
          {
            allMarkdownRemark(
              sort: { fields: [frontmatter___date], order: DESC }
              limit: 1000
            ) {
              edges {
                node {
                  fields {
                    slug
                    langKey
                    directoryName
                  }
                  frontmatter {
                    title
                    category
                    draft
                  }
                }
              }
            }
          }
        `
      ).then(result => {
        if (result.errors) {
          console.error(result.errors);
          reject(result.errors);
          return;
        }

        // Create blog posts pages.
        const posts = result.data.allMarkdownRemark.edges.filter(
          ({ node }) => !node.frontmatter.draft && !!node.frontmatter.category
        );

        const translationsByDirectory = posts.reduce((result, post) => {
          const directoryName = post.node.fields.directoryName;
          const langKey = post.node.fields.langKey;

          if (directoryName && langKey && langKey !== 'en') {
            (result[directoryName] || (result[directoryName] = [])).push(
              langKey
            );
          }

          return result;
        }, {});

        const defaultLangPosts = posts.filter(
          ({ node }) => node.fields.langKey === 'en'
        );
        defaultLangPosts.forEach((post, index) => {
          const previous =
            index === defaultLangPosts.length - 1
              ? null
              : defaultLangPosts[index + 1].node;
          const next = index === 0 ? null : defaultLangPosts[index - 1].node;

          const translations =
            translationsByDirectory[post.node.fields.directoryName] || [];

          createPage({
            path: post.node.fields.slug,
            component: blogPostTemplate,
            context: {
              slug: post.node.fields.slug,
              previous,
              next,
              translations,
              translatedLinks: [],
            },
          });

          const otherLangPosts = posts.filter(
            ({ node }) => node.fields.langKey !== 'en'
          );
          otherLangPosts.forEach(post => {
            const translations =
              translationsByDirectory[post.node.fields.directoryName];

            createPage({
              path: post.node.fields.slug,
              component: blogPostTemplate,
              context: {
                slug: post.node.fields.slug,
                translations,
              },
            });
          });
        });
      })
    );
  });
};

exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions;

  if (node.internal.type === `MarkdownRemark`) {
    // NOTI: Change for language
    // const value = createFilePath({ node, getNode });
    // createNodeField({
    //   name: `slug`,
    //   node,
    //   value,
    // });
    createNodeField({
      node,
      name: 'directoryName',
      value: path.basename(path.dirname(node.fileAbsolutePath)),
    });
  }
};
