import remarkNoDeadUrls from "remark-lint-no-dead-urls";

/** @type {Omit<import('unified-engine').Options, 'processor'>} */
export default {
  plugins: [
    remarkNoDeadUrls,
    {
      skipUrlPatterns: [
        // These return 403 (Forbidden) to checks
        'https://codepen.io',
      ],
    },
  ],
};
