import type { SidebarsConfig } from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  docsSidebar: [
    'intro',
    {
      type: 'category',
      label: 'TypeScript',
      items: ['typescript/getting-started'],
    },
    {
      type: 'category',
      label: 'Go',
      items: ['go/getting-started'],
    },
    {
      type: 'category',
      label: 'Rust',
      items: ['rust/getting-started'],
    },
    {
      type: 'category',
      label: 'Guides',
      items: [
        'guides/authentication',
        'guides/users',
        'guides/agents',
        'guides/dashboards',
        'guides/files',
        'guides/applications',
        'guides/call-reporting',
        'guides/telephony',
        'guides/queues',
        'guides/routing-automation',
        'guides/integrations',
        'guides/outbound',
        'guides/dialer',
        'guides/recordings',
        'guides/scheduling',
        'guides/conversations',
        'guides/prompts-babeldesk',
        'guides/events-logs',
        'guides/metrics',
        'guides/settings',
        'guides/system',
        'guides/task-automations',
      ],
    },
    'coverage',
    'changelog',
  ],
};

export default sidebars;
