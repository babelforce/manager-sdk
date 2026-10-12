// Make <Tabs>/<TabItem> available in every MDX doc without a per-file import, so guides can show
// per-language (TypeScript / Go / Rust) code examples with a persisted selection (groupId="sdk").
import MDXComponents from '@theme-original/MDXComponents';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

export default {
  ...MDXComponents,
  Tabs,
  TabItem,
};
