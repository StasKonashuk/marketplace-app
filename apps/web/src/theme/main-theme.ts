import { createTheme, CSSVariablesResolver } from '@mantine/core';

import * as components from './components';

const mainTheme = createTheme({
  fontFamily: 'Inter, sans-serif',
  fontFamilyMonospace: 'monospace',
  headings: {
    fontFamily: 'Inter, sans-serif',
    fontWeight: '600',
  },
  lineHeights: {
    md: '1.45',
  },
  primaryColor: 'blue',
  primaryShade: 6,
  components,
  defaultRadius: '8px',
  other: {
    buttonPrimaryBackground: '#2B77EB',
    buttonPrimaryHoverBackground: '#5692EF',
    buttonPrimaryPressedBackground: '#235FBC',
    buttonSecondaryBorderColor: '#cfcfcf',
    buttonSecondaryColor: '#767676',
    buttonSecondaryHoverBorderColor: '#5692EF',
    buttonSecondaryHoverColor: '#2B77EB',
    buttonSecondaryPressedBorderColor: '#5692EF',
    buttonSecondaryPressedColor: '#235FBC',
    buttonDisabledBackground: '#A3A3A3',
    inputHoverBorder: '1px solid #2B77EB',
    inputFocusedBorder: '1px solid #2B77EB',
    inputColor: '#201F22',
    linkColor: '#2B77EB',
    backGroundColor: '#FCFCFC',
    mainBorder: '1px solid #ececee',
  },
});

const resolver: CSSVariablesResolver = (theme) => ({
  variables: {
    '--button-primary-bg': theme.other.buttonPrimaryBackground,
    '--button-primary-hover-bg': theme.other.buttonPrimaryHoverBackground,
    '--button-primary-pressed-bg': theme.other.buttonPrimaryPressedBackground,
    '--button-border-radius': theme.other.buttonBorderRadius,
    '--button-secondary-color': theme.other.buttonSecondaryColor,
    '--button-secondary-border-color': theme.other.buttonSecondaryBorderColor,
    '--button-secondary-hover-border-color': theme.other.buttonSecondaryHoverBorderColor,
    '--button-secondary-hover-color': theme.other.buttonSecondaryHoverColor,
    '--button-secondary-pressed-border-color': theme.other.buttonSecondaryPressedBorderColor,
    '--button-secondary-pressed-color': theme.other.buttonSecondaryPressedColor,
    '--input-hover-border': theme.other.inputHoverBorder,
    '--input-focused-border': theme.other.inputFocusedBorder,
    '--input-color': theme.other.inputColor,
    '--input-border-radius': theme.other.inputBorderRadius,
    '--link-color': theme.other.linkColor,
    '--black-color': theme.other.blackColor,
    '--main-bg-color': theme.other.backGroundColor,
    '--main-border': theme.other.mainBorder,
    '--button-disabled-bg': theme.other.buttonDisabledBackground,
  },
  light: {},
  dark: {},
});

export default {
  mainTheme,
  resolver,
};
