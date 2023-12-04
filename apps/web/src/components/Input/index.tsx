import { ChangeEvent, FC, ReactNode, memo } from 'react';
import { TextInput, PasswordInput } from '@mantine/core';
import { UseFormRegister } from 'react-hook-form';
import { SearchIcon } from 'public/icons';

import classes from './Input.module.css';

interface InputProps {
  disabled?: boolean;
  w?: string;
  h?: string;
  size?: string;
  label?: string;
  placeholder?: string;
  error?: string;
  type?: 'text' | 'password' | 'search';
  name?: string;
  value?: string;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  register?: UseFormRegister<any>;
  leftSection?: ReactNode;
  rightSection?: ReactNode;
}

const Input: FC<InputProps> = ({
  disabled = false,
  label = '',
  size = 'md',
  type = 'text',
  error = '',
  placeholder = '',
  register,
  name,
  value,
  onChange,
  leftSection,
  rightSection,
  w,
  h,
}) => {
  switch (type) {
    case 'text':
      return (
        <TextInput
          label={label}
          error={error}
          disabled={disabled}
          size={size}
          placeholder={placeholder}
          w={w}
          h={h}
          value={value}
          onChange={onChange}
          classNames={{ root: classes.root }}
          leftSection={leftSection}
          rightSection={rightSection}
          {...(register && name && register(name))}
        />
      );

    case 'password':
      return (
        <PasswordInput
          label={label}
          error={error}
          disabled={disabled}
          size={size}
          placeholder={placeholder}
          classNames={{ root: classes.root }}
          w={w}
          h={h}
          value={value}
          onChange={onChange}
          leftSection={leftSection}
          rightSection={rightSection}
          {...(register && name && register(name))}
        />
      );

    case 'search':
      return (
        <TextInput
          label={label}
          error={error}
          disabled={disabled}
          size={size}
          placeholder={placeholder}
          w={w}
          value={value}
          onChange={onChange}
          classNames={{ root: classes.root }}
          leftSection={<SearchIcon />}
          {...(register && name && register(name))}
        />
      );
    default:
      return null;
  }
};

export default memo(Input);
