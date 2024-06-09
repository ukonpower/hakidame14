module.exports = {
	root: true,
	env: { browser: true, es2020: true },
	extends: [
		"mdcs",
		'eslint:recommended',
		'plugin:@typescript-eslint/recommended',
		'plugin:react-hooks/recommended',
	],
	ignorePatterns: [ 'dist' ],
	parser: '@typescript-eslint/parser',
	plugins: [ 'react-refresh', "import", "unused-imports" ],
	rules: {
		"indent": [ "error", "tab" ],
		"no-self-assign": 'off',
		"no-multiple-empty-lines": "error",
		"no-constant-condition": "off",
		"no-unreachable": "off",
		"unused-imports/no-unused-imports": "error",
		"@typescript-eslint/no-unused-vars": "off",
		'@typescript-eslint/no-explicit-any': 'off',
		'@typescript-eslint/ban-types': "off",
		'@typescript-eslint/no-namespace': "off",
		"import/order": [
			"error",
			{
				"groups": [ "builtin", "external", "internal", "parent", "sibling", "index", "object", "type" ],
				"newlines-between": "always",
				"alphabetize": { "order": "asc", "caseInsensitive": true },
				"pathGroups": [
					{
						pattern: '~/**/*.module.glsl',
						group: 'builtin',
						position: 'before',
					},
					{
						pattern: '~/**/*.part.glsl',
						group: 'builtin',
						position: 'before',
					},
				],
				"pathGroupsExcludedImportTypes": [],
			}
		]
	},
};
