import { FC, memo, MouseEventHandler, ReactNode } from 'react';
import { Button, FileButton } from '@mantine/core';
import cx from 'clsx';

import classes from './Button.module.css';

interface ButtonProps {
  children: ReactNode;
  type?: 'button' | 'reset' | 'submit';
  fullWidth?: boolean;
  disabled?: boolean;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  secondary?: boolean;
  mt?: string | number;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  buttonType?: 'default' | 'file' | 'link';
  onChange?: (value: File) => void;
  accept?: string;
  href?: string;
  id?: string;
  loading?: boolean;
}

const CustomButton: FC<ButtonProps> = ({
  disabled = false,
  fullWidth = false,
  type = 'button',
  size = 'md',
  children,
  secondary,
  mt,
  onClick,
  buttonType = 'default',
  onChange,
  accept,
  href,
  id,
  loading,
}) => {
  switch (buttonType) {
    case 'default':
      return (
        <Button
          disabled={disabled}
          fullWidth={fullWidth}
          size={size}
          className={cx(classes.button, {
            [classes.primary]: !secondary,
            [classes.secondary]: secondary,
          })}
          type={type}
          mt={mt}
          id={id}
          onClick={onClick}
          loading={loading}
        >
          {children}
        </Button>
      );

    case 'file':
      if (onChange && accept) {
        return (
          <FileButton onChange={onChange} accept={accept}>
            {(props) => (
              <Button
                disabled={disabled}
                fullWidth={fullWidth}
                size={size}
                className={cx(classes.button, {
                  [classes.primary]: !secondary,
                  [classes.secondary]: secondary,
                })}
                type={type}
                mt={mt}
                {...props}
              >
                {children}
              </Button>
            )}
          </FileButton>
        );
      }
      return null;

    case 'link':
      return (
        <Button
          disabled={disabled}
          fullWidth={fullWidth}
          size={size}
          className={cx(classes.button, {
            [classes.primary]: !secondary,
            [classes.secondary]: secondary,
          })}
          mt={mt}
          component="a"
          href={href}
        >
          {children}
        </Button>
      );

    default:
      return null;
  }
};

export default memo(CustomButton);
