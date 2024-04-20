'use client';

import {
  CheckIcon,
  Combobox,
  ComboboxDropdown,
  ComboboxDropdownTarget,
  ComboboxEmpty,
  ComboboxEventsTarget,
  ComboboxHiddenInput,
  ComboboxOption,
  ComboboxOptions,
  Group,
  Pill,
  PillGroup,
  PillsInput,
  PillsInputField,
  ThemeIcon,
  useCombobox,
} from '@mantine/core';
import type { Tag } from '@prisma/client';
import React, { useMemo, useState } from 'react';
import { TAGS_DIVIDER } from '~/lib/constants';
import { IconSparkles } from '@tabler/icons-react';
import classes from '~/components/customTagInput.module.css';

interface Props {
  tags?: Tag[];
  canMakeNewTags?: boolean;
}

const CREATE = '$create';
const NEW_TAG_PREFIX = 'NEW_TAG_GENERATED_';

export const ValuePill = (data: Tag[], removeCB: (id: Tag['id']) => void) => {
  const findTag = (id: Tag['id']) => data.find(tag => tag.id === id);

  return (id: Tag['id']) => {
    const tag = findTag(id);

    if (!tag) {
      return (
        <Pill
          key={id}
          withRemoveButton
          onRemove={() => removeCB(id)}
          className={classes.GeneratedPill}
        >
          {id}
        </Pill>
      );
    }

    return (
      <Pill key={tag.id} withRemoveButton onRemove={() => removeCB(tag.id)}>
        {tag.name}
      </Pill>
    );
  };
};

export default function CustomTagInput(props: Props) {
  const { tags = [], canMakeNewTags = true } = props;

  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
    onDropdownOpen: () => combobox.updateSelectedOptionIndex('active'),
  });

  const [search, setSearch] = useState('');

  const [data, setData] = useState(tags);
  const [value, setValue] = useState<string[]>([]);

  const exactOptionMatch = data.some(
    item => item.name.toLowerCase() === search.trim().toLowerCase(),
  );

  const handleValueSelect = (val: string) => {
    if (val === CREATE) {
      const name = search.trim();
      const id = `${NEW_TAG_PREFIX}${data.length + 1}`;
      const currentDate = new Date();

      setData(current => [
        ...current,
        // only the name is relevant for the tag
        { createdAt: currentDate, id, name, updatedAt: currentDate },
      ]);

      setValue(current => [...current, name]);
    } else {
      const isGeneratedTag = val.startsWith(NEW_TAG_PREFIX);

      if (isGeneratedTag) {
        const tag = data.find(item => item.id === val);

        if (!tag) return;

        setValue(current =>
          current.includes(tag.name)
            ? current.filter(v => v !== tag.name)
            : [...current, tag.name],
        );
      } else {
        setValue(current =>
          current.includes(val)
            ? current.filter(v => v !== val)
            : [...current, val],
        );
      }
    }

    setSearch('');
  };

  const handleValueRemove = (val: string) =>
    setValue(current => current.filter(v => v !== val));

  const values = value.map(ValuePill(tags, handleValueRemove));

  const options = useMemo(
    () =>
      data
        .filter(item =>
          item.name.toLowerCase().includes(search.trim().toLowerCase()),
        )
        .map(item => {
          const generatedTag = item.id.startsWith(NEW_TAG_PREFIX);

          const active = generatedTag
            ? value.includes(item.name)
            : value.includes(item.id);

          return (
            <ComboboxOption
              value={item.id}
              key={item.id}
              active={active}
              color="red"
            >
              <Group gap="sm" justify="space-between">
                <Group>
                  {active ? <CheckIcon size={12} /> : null}
                  <span>{item.name}</span>
                </Group>

                {generatedTag ? (
                  <ThemeIcon
                    color="yellow"
                    variant="outline"
                    radius="xl"
                    size="sm"
                  >
                    <IconSparkles style={{ width: '70%', height: '70%' }} />
                  </ThemeIcon>
                ) : null}
              </Group>
            </ComboboxOption>
          );
        }),
    [data, search, value],
  );

  return (
    <>
      <Combobox
        store={combobox}
        onOptionSubmit={handleValueSelect}
        withinPortal={false}
      >
        <ComboboxDropdownTarget>
          <PillsInput onClick={() => combobox.openDropdown()} label="File Tags">
            <PillGroup>
              {values}

              <ComboboxEventsTarget>
                <PillsInputField
                  onFocus={() => combobox.openDropdown()}
                  onBlur={() => combobox.closeDropdown()}
                  value={search}
                  placeholder="Search values"
                  onChange={event => {
                    combobox.updateSelectedOptionIndex();
                    setSearch(event.currentTarget.value);
                  }}
                  onKeyDown={event => {
                    // avoid submitting form on Enter press
                    if (event.key === 'Enter') {
                      event.preventDefault();
                    }

                    if (event.key === 'Backspace' && search.length === 0) {
                      event.preventDefault();
                      handleValueRemove(value[value.length - 1]);
                    }
                  }}
                />
              </ComboboxEventsTarget>
            </PillGroup>
          </PillsInput>
        </ComboboxDropdownTarget>

        <ComboboxDropdown>
          <ComboboxOptions>
            {options}

            {canMakeNewTags &&
              !exactOptionMatch &&
              search.trim().length > 0 && (
                <ComboboxOption value={CREATE}>
                  + Create {search}
                </ComboboxOption>
              )}

            {exactOptionMatch &&
              search.trim().length > 0 &&
              options.length === 0 && (
                <ComboboxEmpty>Nothing found</ComboboxEmpty>
              )}
          </ComboboxOptions>
        </ComboboxDropdown>
      </Combobox>

      <ComboboxHiddenInput
        name="tags"
        value={value}
        valuesDivider={TAGS_DIVIDER}
      />
    </>
  );
}
