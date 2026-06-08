// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import starlightTypeDoc, { typeDocSidebarGroup } from 'starlight-typedoc';

// https://astro.build/config
export default defineConfig({
	integrations: [
		starlight({
			title: 'WebbiOS Developer Platform',
			customCss: [
				// We can add custom CSS here if needed
			],
			social: [
				{ icon: 'github', label: 'GitHub', href: 'https://github.com/webbios' },
			],
			plugins: [
				starlightTypeDoc({
					entryPoints: ['../../packages/sdk/src/index.ts'],
					tsconfig: '../../packages/sdk/tsconfig.json',
					output: 'sdk/reference',
					sidebar: {
						label: 'SDK Reference',
						collapsed: false,
					},
					typeDoc: {
						disableSources: true,
					},
				}),
			],
			sidebar: [
				{
					label: 'Introduction',
					items: [
						{ label: 'Getting Started', slug: 'getting-started' },
						{ label: 'Architecture Overview', slug: 'architecture' },
					],
				},
				{
					label: 'SDK Setup',
					items: [
						{ label: 'Installation', slug: 'sdk/installation' },
						{ label: 'Authentication', slug: 'sdk/authentication' },
					],
				},
				typeDocSidebarGroup,
				{
					label: 'Building Apps',
					items: [
						{ label: 'App Architecture', slug: 'apps/architecture' },
						{ label: 'Events & Webhooks', slug: 'apps/events' },
					],
				},
				{
					label: 'Building Themes',
					items: [
						{ label: 'Theme Structure', slug: 'themes/structure' },
						{ label: 'React Hooks', slug: 'themes/hooks' },
					],
				},
			],
		}),
	],
});
