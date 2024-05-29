import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { styled } from '~styled-system/jsx';

import { Menu, IconButton, Stack, Icon } from '~uikit';

export default {
  title: 'Menu',
  component: Menu,
} satisfies Meta<typeof Menu>;

type Story = StoryObj<typeof Menu>;

export const Default: Story = {
  render: () => (
    <Menu trigger={<IconButton icon="moreVert" label="More actions" />}>
      <Menu.Item onAction={() => alert('copy')} id="copy">
        Copy
      </Menu.Item>
      <Menu.Item onAction={() => alert('cut')} id="cut">
        Cut
      </Menu.Item>
      <Menu.Item onAction={() => alert('paste')} id="paste">
        Paste
      </Menu.Item>
    </Menu>
  ),
};

export const Sections: Story = {
  render: () => (
    <Menu trigger={<IconButton icon="moreVert" label="More actions" />}>
      <Menu.Section title="Edit">
        <Menu.Item onAction={() => alert('copy')} id="copy">
          Copy
        </Menu.Item>
        <Menu.Item onAction={() => alert('cut')} id="cut">
          Cut
        </Menu.Item>
        <Menu.Item onAction={() => alert('paste')} id="paste">
          Paste
        </Menu.Item>
      </Menu.Section>
      <Menu.Separator />
      <Menu.Section title="Delete">
        <Menu.Item onAction={() => alert('delete')} id="delete">
          Delete
        </Menu.Item>
      </Menu.Section>
    </Menu>
  ),
};

const profiles = [
  {
    id: 'user-1',
    name: 'Admin',
    image: 'https://avatars.githubusercontent.com/u/6596332?v=4',
  },
  {
    id: 'user-2',
    name: 'Developer',
    image: 'https://avatars.githubusercontent.com/u/6152032?v=4',
  },
  {
    id: 'user-3',
    name: 'Manager',
    image: 'https://avatars.githubusercontent.com/u/14995601?v=4',
  },
];

const languages = [
  { id: 'lang-fi', name: 'Finnish' },
  { id: 'lang-en', name: 'English' },
  { id: 'lang-es', name: 'Spanish' },
  { id: 'lang-fr', name: 'French' },
];

export const Selection: Story = {
  render: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [selectedProfile, setSelectedProfile] = useState(profiles[0].id);
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [selectedLanguage, setSelectedLanguage] = useState(languages[0].id);

    return (
      <Menu
        selectionMode="multiple"
        selected={new Set([selectedProfile, selectedLanguage])}
        trigger={<IconButton icon="moreVert" label="More actions" />}
        style={{ minWidth: 250 }}
      >
        <Menu.Section title="Profile">
          {profiles.map(profile => (
            <Menu.Item
              key={profile.id}
              id={profile.id}
              onAction={() => setSelectedProfile(profile.id)}
            >
              <ProfileMenuItem image={profile.image} name={profile.name} />
            </Menu.Item>
          ))}
        </Menu.Section>

        <Menu.Separator />

        <Menu.Section title="Languages">
          {languages.map(language => (
            <Menu.Item
              key={language.id}
              id={language.id}
              onAction={() => setSelectedLanguage(language.id)}
            >
              {language.name}
            </Menu.Item>
          ))}
        </Menu.Section>

        <Menu.Separator />

        <Menu.Section title="Actions">
          <Menu.Item onAction={() => alert('logout')} id="logout">
            <Stack direction="row" gap="xs" align="center">
              <Icon name="logout" color="text" size={20} />
              <span>Logout</span>
            </Stack>
          </Menu.Item>
        </Menu.Section>
      </Menu>
    );
  },
};

function ProfileMenuItem({ image, name }: { image: string; name: string }) {
  return (
    <Stack direction="row" gap="small" align="center">
      <ProfileImage src={image} alt="" />
      <ProfileText>{name}</ProfileText>
    </Stack>
  );
}

const ProfileImage = styled('img', {
  base: {
    width: 32,
    height: 32,
    borderRadius: '50%',
    border: '1px solid rgba(0,0,0,0.1)',
  },
});

const ProfileText = styled('span', {
  base: {
    display: 'block',
    flex: 1,
  },
});
