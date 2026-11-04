import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This runs in Node.js — don't use client-side code here (browser APIs, JSX...).

const config: Config = {
  title: 'babelforce manager SDK',
  tagline: 'Auth, user & agent management, call reporting, metrics, and task automations',

  // Production URL + base path for GitHub Pages (babelforce.github.io/manager-sdk/).
  url: 'https://babelforce.github.io',
  baseUrl: '/manager-sdk/',

  organizationName: 'babelforce',
  projectName: 'manager-sdk',

  favicon: 'img/favicon.svg',

  onBrokenLinks: 'throw',
  onBrokenAnchors: 'warn',

  markdown: {
    // 'mdx' so guides can use <Tabs> for per-language (TS/Go/Rust) code examples.
    format: 'mdx',
  },

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          routeBasePath: '/',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: 'img/social-card.svg',
    colorMode: {
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'manager SDK',
      logo: {
        alt: 'babelforce',
        src: 'img/logo.svg',
      },
      items: [
        { type: 'docSidebar', sidebarId: 'docsSidebar', position: 'left', label: 'Docs' },
        { to: '/typescript/getting-started', label: 'TypeScript', position: 'left' },
        { to: '/go/getting-started', label: 'Go', position: 'left' },
        { to: '/rust/getting-started', label: 'Rust', position: 'left' },
        { to: '/coverage', label: 'Coverage', position: 'right' },
        {
          type: 'dropdown',
          label: 'REST API',
          position: 'left',
          items: [
            { label: 'Manager', to: 'pathname:///manager-sdk/reference/manager/' },
            { label: 'User', to: 'pathname:///manager-sdk/reference/user/' },
            { label: 'Task automation', to: 'pathname:///manager-sdk/reference/task-automation/' },
            { label: 'Task schedule', to: 'pathname:///manager-sdk/reference/task-schedule/' },
          ],
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'SDKs',
          items: [
            { label: 'TypeScript (npm)', href: 'https://www.npmjs.com/package/@babelforce/manager-sdk' },
            { label: 'Go (pkg.go.dev)', href: 'https://pkg.go.dev/github.com/babelforce/manager-sdk-go' },
            { label: 'Rust (crates.io)', href: 'https://crates.io/crates/babelforce-manager-sdk' },
            { label: 'Rust API (docs.rs)', href: 'https://docs.rs/babelforce-manager-sdk' },
          ],
        },
        {
          title: 'API reference',
          items: [
            { label: 'Manager', to: 'pathname:///manager-sdk/reference/manager/' },
            { label: 'User', to: 'pathname:///manager-sdk/reference/user/' },
            { label: 'Task automation', to: 'pathname:///manager-sdk/reference/task-automation/' },
            { label: 'Task schedule', to: 'pathname:///manager-sdk/reference/task-schedule/' },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} babelforce GmbH. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['bash', 'go'],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
