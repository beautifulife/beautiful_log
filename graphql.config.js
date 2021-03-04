module.exports = {
  schema: ['./schema.graphql'],
  documents: ['src/**/*.{graphql,js,ts,jsx,tsx}'],
  extensions: {
    endpoints: {
      default: {
        url: 'http://localhost:3434/graphql',
        // headers: { Authorization: `Bearer ${process.env.API_TOKEN}` },
      },
    },
  },
}
