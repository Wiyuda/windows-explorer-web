import { mount } from '@vue/test-utils';
import { describe, it, expect, vi } from 'vitest';
import TreeNode from './TreeNode.vue';
import { NodeWithChildren } from '../types';

describe('TreeNode.vue', () => {
  const mockNode: NodeWithChildren = {
    id: '1',
    name: 'Test Folder',
    type: 'folder',
    parentId: null,
    createdAt: new Date().toISOString(),
    children: [
      {
        id: '2',
        name: 'Sub Folder',
        type: 'folder',
        parentId: '1',
        createdAt: new Date().toISOString(),
        children: []
      }
    ]
  };

  it('renders the node name', () => {
    const wrapper = mount(TreeNode, {
      props: {
        node: mockNode,
        selectedId: null
      }
    });
    expect(wrapper.text()).toContain('Test Folder');
  });

  it('toggles open state when clicking the expand icon', async () => {
    const wrapper = mount(TreeNode, {
      props: {
        node: mockNode,
        selectedId: null
      }
    });

    // Expand icon is the first span in the row
    const expandIcon = wrapper.find('span.w-4.h-4');
    expect(wrapper.text()).not.toContain('Sub Folder');

    await expandIcon.trigger('click');
    expect(wrapper.text()).toContain('Sub Folder');

    await expandIcon.trigger('click');
    expect(wrapper.text()).not.toContain('Sub Folder');
  });

  it('emits select event when clicking the folder row', async () => {
    const wrapper = mount(TreeNode, {
      props: {
        node: mockNode,
        selectedId: null
      }
    });

    const row = wrapper.find('div.flex.items-center.py-1');
    await row.trigger('click');

    expect(wrapper.emitted('select')).toBeTruthy();
    expect(wrapper.emitted('select')![0]).toEqual(['1']);
  });
});
